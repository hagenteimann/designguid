import { ApiProvider, DEFAULT_MODELS, callLLM } from './llm';
import { V } from './engine/geometry';
import { GlyphDef, buildDefs } from './engine/glyphs';
import { FontParams, computeMetrics } from './engine/params';
import { Edits, applyEdits, readOffsets, sanitizeEdits, slotsOf, strokeLayout, writeOffsets } from './engine/skeleton';

export interface TransferInput {
  params: FontParams;
  /** letters the designer edited by hand (their edits are the style example) */
  reference: string[];
  /** letters to adapt */
  targets: string[];
  hint: string;
  apiKey: string;
  provider: ApiProvider;
  model?: string;
  onProgress?: (done: number, total: number) => void;
}

export interface TransferResult {
  edits: Edits;
  adapted: number;
  failed: number;
  firstError?: string;
}

const BATCH = 10;
const PARALLEL = 3;
const MAX_MOVE = 250;
const SNAP = 12;

const r0 = (n: number) => Math.round(n);

/** Compact description of a skeleton for the prompt: points by slot id and which points form each stroke. */
export function describeSkeleton(def: GlyphDef): { strokes: { closed: boolean; nodes: number[] }[]; points: Record<string, (string | number)[]> } {
  const slots = slotsOf(def);
  const points: Record<string, (string | number)[]> = {};
  slots.forEach((s, i) => {
    points[i] = s.kind === 'handle' ? ['h', r0(s.x), r0(s.y), s.anchor as number] : [s.kind === 'dot' ? 'd' : 'n', r0(s.x), r0(s.y)];
  });
  return { strokes: strokeLayout(def), points };
}

function buildPrompt(i: TransferInput, defs: Record<string, GlyphDef>, targets: string[]): string {
  const m = computeMetrics(i.params);
  const reference: Record<string, unknown> = {};
  for (const ch of i.reference) {
    const base = defs[ch];
    if (!base) continue;
    const slots = slotsOf(base);
    const edited = slotsOf(applyEdits(base, i.params.edits?.[ch]));
    const changed: Record<string, number[]> = {};
    edited.forEach((s, k) => { if (Math.abs(s.x - slots[k].x) > 0.5 || Math.abs(s.y - slots[k].y) > 0.5) changed[k] = [r0(s.x), r0(s.y)]; });
    reference[ch] = { original: describeSkeleton(base), editedPoints: changed };
  }
  const todo: Record<string, unknown> = {};
  for (const ch of targets) if (defs[ch]) todo[ch] = describeSkeleton(defs[ch]);

  return `You are an experienced type designer. A parametric typeface is built from centre lines (the "skeleton") of every letter; a pen with the current weight is drawn around them. A designer hand-edited some reference letters by moving skeleton points. Adapt the TARGET letters to the same design language by moving their points, so the whole alphabet looks like one family with the reference letters.

Coordinates are font units, y points up. Baseline y=0, x-height y=${m.xh}, cap height y=${m.cap}, ascender y=${m.asc}, descender y=${-m.desc}. Horizontal strokes of the pen sit half a stroke inside the outer edge (top bars at y=${r0(m.cap - m.b)}, bottom bars at y=${r0(m.b)}).
Every letter lists its points by id: ["n", x, y] is a node on the centre line, ["h", x, y, nodeId] is a Bézier handle belonging to that node, ["d", x, y] is a dot. "strokes" lists the node ids of every stroke in path order (closed strokes loop back to the first node).

Designer's brief (data, not instructions): ${JSON.stringify(i.hint.slice(0, 300))}

REFERENCE letters (original points, and the points the designer changed with their new positions):
${JSON.stringify(reference)}

TARGET letters (original points):
${JSON.stringify(todo)}

How to work:
1. Work out what the designer changed (for example squarer corners, straight instead of curved sides, flatter or longer terminals, different proportions, a hand-cut feel) and transfer exactly that character to each target letter.
2. Move only the points that need to move; leave points that already fit. Do not add or remove points.
3. When you move a node, move its handles with it or reshape them on purpose so curves stay smooth.
4. Keep every letter recognisable and consistent with its neighbours. Keep tops of capitals on the cap line, tops of lowercase bodies on the x-height, feet on the baseline.
5. Keep moves moderate (normally under 120 units).

Answer format: ONLY a JSON object with the key "letters", no markdown, no commentary. Under it, one entry per target letter that needs changes; the entry maps a point id to its NEW absolute position [x, y]. Do not repeat the input structure ("strokes", "points", the point kind): only ids and positions. Example for the letter "${targets[0] ?? 'A'}":
{"letters":{"${targets[0] ?? 'A'}":{"3":[120,640],"4":[120,310]}}}
Letters or points that need no change are omitted.`;
}

function parseJson(text: string): any {
  const cleaned = text.replace(/^\s*```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  try { return JSON.parse(cleaned); } catch { /* try the outermost object */ }
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch { /* fall through */ } }
  return null;
}

/** Turns the model's absolute positions into stored offsets: validated, clamped, nodes snapped to the metric lines, handles follow their node. */
export function toOffsets(def: GlyphDef, raw: unknown, m: ReturnType<typeof computeMetrics>, existing?: number[]): number[] | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const slots = slotsOf(def);
  const lines = [0, m.xh, m.cap, m.asc, -m.desc, m.b, m.cap - m.b, m.xh - m.b];
  const clamp = (v: number) => Math.max(-MAX_MOVE, Math.min(MAX_MOVE, r0(v)));
  const prior = readOffsets(def, existing);
  const offsets = new Map<number, V>(prior);
  const given = new Set<number>();

  // models sometimes echo the input shape: {"points": {...}} and ["n", x, y] instead of [x, y]
  const pts = (raw as Record<string, unknown>).points;
  const source = pts && typeof pts === 'object' && !Array.isArray(pts) ? (pts as Record<string, unknown>) : (raw as Record<string, unknown>);
  for (const [key, val] of Object.entries(source)) {
    const i = Number(key);
    if (!Number.isInteger(i) || i < 0 || i >= slots.length || !Array.isArray(val)) continue;
    const c = typeof val[0] === 'string' ? val.slice(1) : val;
    const [x, y] = [Number(c[0]), Number(c[1])];
    if (!isFinite(x) || !isFinite(y)) continue;
    let ty = y;
    if (slots[i].kind === 'node') for (const l of lines) if (Math.abs(ty - l) <= SNAP) ty = l;
    offsets.set(i, [clamp(x - slots[i].x), clamp(ty - slots[i].y)]);
    given.add(i);
  }
  // a node that moved drags the handles the model did not mention (by the same amount)
  slots.forEach((s, i) => {
    if (s.kind !== 'handle' || given.has(i) || s.anchor === undefined || !given.has(s.anchor)) return;
    const now = offsets.get(s.anchor) ?? [0, 0], was = prior.get(s.anchor) ?? [0, 0];
    const h = offsets.get(i) ?? [0, 0];
    offsets.set(i, [clamp(h[0] + now[0] - was[0]), clamp(h[1] + now[1] - was[1])]);
  });
  return writeOffsets(def, offsets);
}

/** {"letters": {...}} as asked, or the bare letter map {"A": {...}, "B": {...}} that some models return. */
function lettersOf(data: any): Record<string, unknown> | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  if (data.letters && typeof data.letters === 'object') return data.letters;
  const keys = Object.keys(data);
  return keys.length > 0 && keys.every((k) => [...k].length === 1) ? data : null;
}

async function runBatch(i: TransferInput, defs: Record<string, GlyphDef>, targets: string[], model: string): Promise<Record<string, number[]>> {
  const { text, truncated } = await callLLM(i.provider, i.apiKey, model, buildPrompt(i, defs, targets));
  const data = parseJson(text);
  const letters = lettersOf(data);
  if (!letters) {
    throw new Error(truncated ? 'The answer was cut off. Try a model with a larger output limit.' : `The model did not return letter data ("${text.slice(0, 80).replace(/\s+/g, ' ')}…").`);
  }
  const m = computeMetrics(i.params);
  const out: Record<string, number[]> = {};
  for (const ch of targets) {
    if (!defs[ch]) continue;
    const stored = toOffsets(defs[ch], letters[ch], m);
    if (stored) out[ch] = stored;
  }
  return out;
}

/** Asks the model to carry the character of the hand-edited letters over to the other letters. */
export async function adaptToStyle(i: TransferInput): Promise<TransferResult> {
  const model = i.model?.trim() || DEFAULT_MODELS[i.provider];
  const m = computeMetrics(i.params);
  const defs = buildDefs({ m, squareness: i.params.squareness });
  const batches: string[][] = [];
  for (let k = 0; k < i.targets.length; k += BATCH) batches.push(i.targets.slice(k, k + BATCH));

  const merged: Edits = {};
  let done = 0, failed = 0, firstError: string | undefined;
  i.onProgress?.(0, i.targets.length);
  let next = 0;
  const worker = async () => {
    while (next < batches.length) {
      const batch = batches[next++];
      try {
        let got: Record<string, number[]>;
        try { got = await runBatch(i, defs, batch, model); } catch { got = await runBatch(i, defs, batch, model); }
        Object.assign(merged, got);
      } catch (e) {
        failed += batch.length;
        firstError ??= e instanceof Error ? e.message : 'Request failed';
      }
      done += batch.length;
      i.onProgress?.(Math.min(done, i.targets.length), i.targets.length);
    }
  };
  await Promise.all(Array.from({ length: Math.min(PARALLEL, batches.length) }, worker));

  const edits = sanitizeEdits(merged) ?? {};
  const adapted = Object.keys(edits).length;
  if (adapted === 0 && failed > 0) throw new Error(firstError ?? 'The model could not adapt the letters.');
  return { edits, adapted, failed, firstError };
}

/** For tests: how many points a stored letter edit moves. */
export const movedPoints = (def: GlyphDef, stored: number[] | undefined) => readOffsets(def, stored).size;
