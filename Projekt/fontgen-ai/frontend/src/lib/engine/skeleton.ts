import type { V } from './geometry';
import type { GlyphDef } from './glyphs';
import type { Cap, Stroke } from './stroker';

/**
 * Editable skeleton points of a glyph. Every glyph is built from centre lines (strokes) and dots; the user may move
 * their nodes and Bézier handles. Edits are stored as offsets per point ("slot"), so they stay valid while weight,
 * width and the other settings change.
 *
 * Stored format per glyph: [slotCount, slot, dx, dy, slot, dx, dy, ...] (sparse, integers).
 */
export type Edits = Record<string, number[]>;

export interface Slot {
  x: number;
  y: number;
  kind: 'node' | 'handle' | 'dot';
  /** for a handle: the slot of the node it belongs to */
  anchor?: number;
}

export const MAX_EDIT_OFFSET = 250;
export const MAX_EDIT_POINTS = 900;

type Ref = { stroke: number; seg: number; pt: number } | { dot: number };

interface SlotInfo extends Slot {
  refs: Ref[];
}

function collect(def: GlyphDef): SlotInfo[] {
  const slots: SlotInfo[] = [];
  def.skel.strokes.forEach((s, si) => {
    const n = s.segs.length;
    if (n === 0) return;
    const nodeCount = s.closed ? n : n + 1;
    const base = slots.length;
    for (let k = 0; k < nodeCount; k++) {
      const refs: Ref[] = [];
      let at: V;
      if (k < n) {
        refs.push({ stroke: si, seg: k, pt: 0 });
        at = s.segs[k].p[0];
      } else {
        at = s.segs[n - 1].p[s.segs[n - 1].p.length - 1];
      }
      if (k > 0) refs.push({ stroke: si, seg: k - 1, pt: s.segs[k - 1].p.length - 1 });
      if (s.closed && k === 0) refs.push({ stroke: si, seg: n - 1, pt: s.segs[n - 1].p.length - 1 });
      slots.push({ x: at[0], y: at[1], kind: 'node', refs });
    }
    s.segs.forEach((g, k) => {
      if (g.p.length !== 4) return;
      slots.push({ x: g.p[1][0], y: g.p[1][1], kind: 'handle', anchor: base + k, refs: [{ stroke: si, seg: k, pt: 1 }] });
      slots.push({ x: g.p[2][0], y: g.p[2][1], kind: 'handle', anchor: base + ((k + 1) % nodeCount), refs: [{ stroke: si, seg: k, pt: 2 }] });
    });
  });
  def.skel.dots.forEach((d, i) => slots.push({ x: d.x, y: d.y, kind: 'dot', refs: [{ dot: i }] }));
  return slots;
}

/** Editable points of the unedited skeleton. */
export function slotsOf(def: GlyphDef): Slot[] {
  return collect(def).map(({ x, y, kind, anchor }) => ({ x, y, kind, anchor }));
}

/** Which slots form each stroke, in path order (nodes only), so the layout can be described to a model. */
export function strokeLayout(def: GlyphDef): { closed: boolean; nodes: number[] }[] {
  const out: { closed: boolean; nodes: number[] }[] = [];
  let at = 0;
  for (const s of def.skel.strokes) {
    const n = s.segs.length;
    if (n === 0) continue;
    const nodeCount = s.closed ? n : n + 1;
    out.push({ closed: !!s.closed, nodes: Array.from({ length: nodeCount }, (_, k) => at + k) });
    at += nodeCount + 2 * s.segs.filter(g => g.p.length === 4).length;
  }
  return out;
}

/** For every node: the nodes it is connected to and the handle (if the segment is a curve) that belongs to it on that segment. */
export function adjacencyOf(def: GlyphDef): Map<number, { other: number; handle?: number }[]> {
  const out = new Map<number, { other: number; handle?: number }[]>();
  const add = (k: number, v: { other: number; handle?: number }) => out.set(k, [...(out.get(k) ?? []), v]);
  let at = 0;
  for (const s of def.skel.strokes) {
    const n = s.segs.length;
    if (n === 0) continue;
    const nodeCount = s.closed ? n : n + 1;
    let h = at + nodeCount;
    s.segs.forEach((g, k) => {
      const a = at + k, b = at + ((k + 1) % nodeCount);
      const cubic = g.p.length === 4;
      add(a, { other: b, handle: cubic ? h : undefined });
      add(b, { other: a, handle: cubic ? h + 1 : undefined });
      if (cubic) h += 2;
    });
    at = h;
  }
  return out;
}

/** Offsets as a slot → [dx, dy] map (empty when the stored data does not fit this glyph any more). */
export function readOffsets(def: GlyphDef, stored: number[] | undefined): Map<number, V> {
  const out = new Map<number, V>();
  if (!stored || stored.length < 1) return out;
  const count = collect(def).length;
  if (stored[0] !== count) return out;
  for (let i = 1; i + 2 < stored.length; i += 3) {
    const slot = stored[i];
    if (Number.isInteger(slot) && slot >= 0 && slot < count) out.set(slot, [stored[i + 1], stored[i + 2]]);
  }
  return out;
}

export function writeOffsets(def: GlyphDef, offsets: Map<number, V>): number[] | undefined {
  const flat: number[] = [];
  [...offsets.entries()]
    .sort((a, b) => a[0] - b[0])
    .forEach(([slot, [dx, dy]]) => {
      const x = Math.round(dx), y = Math.round(dy);
      if (x !== 0 || y !== 0) flat.push(slot, x, y);
    });
  return flat.length ? [collect(def).length, ...flat] : undefined;
}

/** Returns a copy of the glyph with the stored edits applied. */
export function applyEdits(def: GlyphDef, stored: number[] | undefined): GlyphDef {
  const offsets = readOffsets(def, stored);
  if (offsets.size === 0) return def;
  const slots = collect(def);
  const strokes: Stroke[] = def.skel.strokes.map(s => ({ ...s, segs: s.segs.map(g => ({ p: g.p.map(q => [q[0], q[1]] as V) })) }));
  const dots = def.skel.dots.map(d => ({ ...d }));
  offsets.forEach(([dx, dy], i) => {
    for (const r of slots[i].refs) {
      if ('dot' in r) { dots[r.dot].x += dx; dots[r.dot].y += dy; }
      else { const q = strokes[r.stroke].segs[r.seg].p[r.pt]; q[0] += dx; q[1] += dy; }
    }
  });
  return { ...def, skel: { strokes, dots } };
}

/** Validates untrusted edits (from a submission): known shape, integer offsets within limits, bounded size. */
export function sanitizeEdits(raw: unknown): Edits | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out: Edits = {};
  let points = 0;
  for (const [ch, v] of Object.entries(raw as Record<string, unknown>)) {
    if ([...ch].length !== 1 || !Array.isArray(v) || v.length < 4 || (v.length - 1) % 3 !== 0) continue;
    const count = v[0];
    if (!Number.isInteger(count) || count < 1 || count > 200) continue;
    const clean: number[] = [count];
    let ok = true;
    for (let i = 1; i < v.length; i += 3) {
      const [slot, dx, dy] = [v[i], v[i + 1], v[i + 2]];
      if (!Number.isInteger(slot) || slot < 0 || slot >= count || typeof dx !== 'number' || typeof dy !== 'number' || !isFinite(dx) || !isFinite(dy)) { ok = false; break; }
      clean.push(slot, Math.max(-MAX_EDIT_OFFSET, Math.min(MAX_EDIT_OFFSET, Math.round(dx))), Math.max(-MAX_EDIT_OFFSET, Math.min(MAX_EDIT_OFFSET, Math.round(dy))));
    }
    if (!ok) continue;
    points += (clean.length - 1) / 3;
    if (points > MAX_EDIT_POINTS) break;
    out[ch] = clean;
  }
  return Object.keys(out).length ? out : undefined;
}

export const editedPointCount = (e: Edits | undefined) =>
  e ? Object.values(e).reduce((n, v) => n + (v.length - 1) / 3, 0) : 0;


/* ── Path operations: cut and join ─────────────────────────────────────────────────────────────────────────────────
 * Structural changes of a letter's centre lines, stored per letter as a flat list of [op, a, b] triples that are applied
 * in order to the original skeleton (a and b are node slots in the structure at that moment). The offsets in `edits`
 * refer to the structure after all operations.
 *   1 cut   (a)    split the path at node a (an open path becomes two, a closed path becomes open at that node)
 *   2 join  (a, b) connect two open ends with a straight line
 *   3 merge (a, b) connect two open ends that lie on top of each other into one node
 */
export type Paths = Record<string, number[]>;
export const OP_CUT = 1;
export const OP_JOIN = 2;
export const OP_MERGE = 3;
export const MAX_PATH_OPS = 12;
export const MAX_TOTAL_PATH_OPS = 80;

interface TSeg { p: V[]; ids: number[] }
interface TStroke { segs: TSeg[]; closed: boolean; capStart?: Cap; capEnd?: Cap; scale?: Stroke['scale'] }

const clone = (q: V): V => [q[0], q[1]];

function locate(def: GlyphDef, slot: number): { si: number; k: number; n: number; closed: boolean } | null {
  let at = 0;
  for (let si = 0; si < def.skel.strokes.length; si++) {
    const s = def.skel.strokes[si];
    const n = s.segs.length;
    if (n === 0) continue;
    const nodeCount = s.closed ? n : n + 1;
    if (slot >= at && slot < at + nodeCount) return { si, k: slot - at, n, closed: !!s.closed };
    at += nodeCount + 2 * s.segs.filter(g => g.p.length === 4).length;
  }
  return null;
}

const reverseStroke = (t: TStroke): TStroke => ({
  ...t,
  segs: [...t.segs].reverse().map(g => ({ p: [...g.p].reverse(), ids: [...g.ids].reverse() })),
  capStart: t.capEnd,
  capEnd: t.capStart
});

/** Is this node an open end of an open path, an inner node of one, or a node of a closed path? */
export function nodeRole(def: GlyphDef, slot: number): 'end' | 'inner' | 'ring' | null {
  const L = locate(def, slot);
  if (!L) return null;
  if (L.closed) return 'ring';
  return L.k === 0 || L.k === L.n ? 'end' : 'inner';
}

/** Applies one operation. Returns the new skeleton and, for every new slot, the slot it came from (for carrying offsets over). */
export function applyPathOp(def: GlyphDef, code: number, a: number, b = 0): { def: GlyphDef; map: number[] } | null {
  const oldSlots = collect(def);
  const ids: number[][][] = def.skel.strokes.map(s => s.segs.map(g => g.p.map(() => -1)));
  oldSlots.forEach((sl, i) => { for (const r of sl.refs) if (!('dot' in r)) ids[r.stroke][r.seg][r.pt] = i; });
  const ts: TStroke[] = def.skel.strokes.map((s, si) => ({
    segs: s.segs.map((g, k) => ({ p: g.p.map(clone), ids: [...ids[si][k]] })),
    closed: !!s.closed, capStart: s.capStart, capEnd: s.capEnd, scale: s.scale
  }));

  const A = locate(def, a);
  if (!A) return null;
  let out: TStroke[];

  if (code === OP_CUT) {
    const t = ts[A.si];
    let parts: TStroke[];
    if (!t.closed) {
      if (A.k === 0 || A.k === A.n) return null;
      parts = [
        { ...t, segs: t.segs.slice(0, A.k), capEnd: 'butt' },
        { ...t, segs: t.segs.slice(A.k), capStart: 'butt' }
      ];
    } else {
      parts = [{ ...t, segs: [...t.segs.slice(A.k), ...t.segs.slice(0, A.k)], closed: false, capStart: 'butt', capEnd: 'butt' }];
    }
    out = [...ts.slice(0, A.si), ...parts, ...ts.slice(A.si + 1)];
  } else if (code === OP_JOIN || code === OP_MERGE) {
    const B = locate(def, b);
    if (!B || a === b) return null;
    const ta = ts[A.si], tb = ts[B.si];
    if (ta.closed || tb.closed) return null;
    const aEnd = A.k === A.n ? 'end' : A.k === 0 ? 'start' : null;
    const bEnd = B.k === B.n ? 'end' : B.k === 0 ? 'start' : null;
    if (!aEnd || !bEnd) return null;
    if (A.si === B.si) {
      if (A.n < 2 || aEnd === bEnd) return null;
      const first = ta.segs[0], last = ta.segs[ta.segs.length - 1];
      const lastIdx = last.p.length - 1;
      if (code === OP_MERGE) {
        last.p[lastIdx] = clone(first.p[0]);
        last.ids[lastIdx] = first.ids[0];
      } else {
        ta.segs.push({ p: [clone(last.p[lastIdx]), clone(first.p[0])], ids: [last.ids[lastIdx], first.ids[0]] });
      }
      ta.closed = true;
      out = ts;
    } else {
      const s1 = aEnd === 'start' ? reverseStroke(ta) : ta;
      const s2 = bEnd === 'end' ? reverseStroke(tb) : tb;
      const e1 = s1.segs[s1.segs.length - 1], st2 = s2.segs[0];
      const i1 = e1.p.length - 1;
      let segs: TSeg[];
      if (code === OP_MERGE) {
        st2.p[0] = clone(e1.p[i1]);
        st2.ids[0] = e1.ids[i1];
        segs = [...s1.segs, ...s2.segs];
      } else {
        segs = [...s1.segs, { p: [clone(e1.p[i1]), clone(st2.p[0])], ids: [e1.ids[i1], st2.ids[0]] }, ...s2.segs];
      }
      const joined: TStroke = { segs, closed: false, capStart: s1.capStart, capEnd: s2.capEnd, scale: s1.scale };
      out = ts.map((t, i) => (i === A.si ? joined : t)).filter((_, i) => i !== B.si);
    }
  } else return null;

  const strokes: Stroke[] = out.map(t => ({
    segs: t.segs.map(g => ({ p: g.p })),
    ...(t.closed ? { closed: true } : {}),
    capStart: t.capStart, capEnd: t.capEnd, scale: t.scale
  }));
  const nd: GlyphDef = { ...def, skel: { strokes, dots: def.skel.dots.map(d => ({ ...d })) } };
  const nowSlots = collect(nd);
  const dotsOld = oldSlots.length - def.skel.dots.length, dotsNew = nowSlots.length - def.skel.dots.length;
  const map = nowSlots.map((sl, i) => {
    if (sl.kind === 'dot') return dotsOld + (i - dotsNew);
    const r = sl.refs[0] as { stroke: number; seg: number; pt: number };
    return out[r.stroke].segs[r.seg].ids[r.pt];
  });
  return { def: nd, map };
}

/** Applies a letter's stored operations to its original skeleton (operations that no longer fit are skipped). */
export function applyPaths(def: GlyphDef, ops: number[] | undefined): GlyphDef {
  if (!ops || ops.length < 3) return def;
  let cur = def;
  for (let i = 0; i + 2 < ops.length; i += 3) cur = applyPathOp(cur, ops[i], ops[i + 1], ops[i + 2])?.def ?? cur;
  return cur;
}

/** Validates untrusted stored operations. */
export function sanitizePaths(raw: unknown): Paths | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const out: Paths = {};
  let total = 0;
  for (const [ch, v] of Object.entries(raw as Record<string, unknown>)) {
    if ([...ch].length !== 1 || !Array.isArray(v) || v.length < 3 || v.length % 3 !== 0) continue;
    const clean: number[] = [];
    for (let i = 0; i + 2 < v.length && clean.length / 3 < MAX_PATH_OPS; i += 3) {
      const [code, a, b] = [v[i], v[i + 1], v[i + 2]];
      if (![OP_CUT, OP_JOIN, OP_MERGE].includes(code as number) || !Number.isInteger(a) || a < 0 || a > 199 || !Number.isInteger(b) || b < 0 || b > 199) break;
      clean.push(code, a, b);
    }
    if (!clean.length) continue;
    total += clean.length / 3;
    if (total > MAX_TOTAL_PATH_OPS) break;
    out[ch] = clean;
  }
  return Object.keys(out).length ? out : undefined;
}

/** The skeleton of a letter with its operations and offsets applied. */
export const shapeOf = (def: GlyphDef, paths: number[] | undefined, edits: number[] | undefined): GlyphDef => applyEdits(applyPaths(def, paths), edits);
