import type { V } from './geometry';
import type { GlyphDef } from './glyphs';
import type { Stroke } from './stroker';

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
