import { V, dist } from './geometry';
import { GlyphDef } from './glyphs';
import { FontParams, Metrics } from './params';
import { Stroke } from './stroker';

export interface SerifResult {
  strokes: Stroke[];
  polys: V[][];
}

interface Level {
  y: number;
  /** +1: serif sits above the line (baseline), -1: below it (cap line) */
  dir: 1 | -1;
}

function sample(s: Stroke): V[] {
  const pts: V[] = [];
  for (const g of s.segs) {
    const n = g.p.length === 2 ? 1 : 12;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      if (g.p.length === 2) pts.push([g.p[0][0] + (g.p[1][0] - g.p[0][0]) * t, g.p[0][1] + (g.p[1][1] - g.p[0][1]) * t]);
      else {
        const m = 1 - t, p = g.p;
        pts.push([
          m * m * m * p[0][0] + 3 * m * m * t * p[1][0] + 3 * m * t * t * p[2][0] + t * t * t * p[3][0],
          m * m * m * p[0][1] + 3 * m * m * t * p[1][1] + 3 * m * t * t * p[2][1] + t * t * t * p[3][1]
        ]);
      }
    }
  }
  return pts;
}

function distToPath(pt: V, path: V[]): number {
  let best = Infinity;
  for (let i = 0; i < path.length - 1; i++) {
    const [ax, ay] = path[i], [bx, by] = path[i + 1];
    const dx = bx - ax, dy = by - ay;
    const l2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((pt[0] - ax) * dx + (pt[1] - ay) * dy) / l2));
    best = Math.min(best, dist(pt, [ax + dx * t, ay + dy * t]));
  }
  return best;
}

const bar = (x0: number, y: number, x1: number, scale: Stroke['scale']): Stroke => ({
  segs: [{ p: [[x0, y], [x1, y]] }], capStart: 'butt', capEnd: 'butt', scale
});

/** Concave bracket that blends a stem into its serif. */
function fillet(x: number, side: 1 | -1, yInner: number, inward: 1 | -1, a: number, f: number): V[] {
  const xe = x + side * a;
  const O: V = [xe + side * f, yInner + inward * f];
  const poly: V[] = [[xe, yInner]];
  const steps = 14;
  for (let k = 0; k <= steps; k++) {
    const phi = (k / steps) * (Math.PI / 2);
    poly.push([O[0] + f * (-side * Math.sin(phi)), O[1] + f * (-inward * Math.cos(phi))]);
  }
  return poly;
}

/**
 * Derives serifs from the skeleton: foot/head serifs on stems and legs that end on a metric line,
 * and vertical beaks on the free ends of top/bottom arms (T, E, L, 5, 7, f, t ...).
 */
export function serifGeometry(def: GlyphDef, m: Metrics, p: FontParams): SerifResult {
  const out: SerifResult = { strokes: [], polys: [] };
  if (p.serif === 'none') return out;

  const { a, b, stem, xh, cap, asc, desc } = m;
  const style = p.serif;
  const ext = (30 + stem * 0.25) * p.serifSize * (style === 'hairline' ? 1.15 : 1);
  const half = a + ext;
  const barScale = Math.max(style === 'slab' ? 1 : style === 'bracketed' ? 0.72 : 0.28, 10 / (2 * b));
  const beakScale = Math.max(style === 'slab' ? 1 : style === 'bracketed' ? 0.6 : 0.28, 5 / a);
  const t = 2 * b * barScale;
  const levels: Level[] = [
    { y: 0, dir: 1 }, { y: -desc, dir: 1 },
    { y: xh, dir: -1 }, { y: cap, dir: -1 }, { y: asc, dir: -1 }
  ];

  const paths = def.skel.strokes.map(sample);

  def.skel.strokes.forEach((s, si) => {
    if (s.closed || s.segs.length === 0) return;
    const first = s.segs[0].p, last = s.segs[s.segs.length - 1].p;
    const ends: { pt: V; out: V; cap: string | undefined }[] = [];
    const norm = (v: V): V => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l]; };
    ends.push({ pt: first[0], out: norm([first[0][0] - first[1][0], first[0][1] - first[1][1]]), cap: s.capStart });
    const n = last.length;
    ends.push({ pt: last[n - 1], out: norm([last[n - 1][0] - last[n - 2][0], last[n - 1][1] - last[n - 2][1]]), cap: s.capEnd });

    for (const e of ends) {
      if (e.cap !== 'butt' && e.cap !== 'hcut') continue;
      const [x, y] = e.pt;
      const isFree = () => paths.every((path, pi) => pi === si || distToPath(e.pt, path) > a + 8);

      // Foot / head serifs: stem or leg ending on a metric line
      const steep = e.cap === 'hcut' ? Math.abs(e.out[1]) > 0.6 : Math.abs(e.out[1]) > 0.9;
      const lvl = levels.find(l => Math.abs(y - l.y) < 1.5 && (l.dir === 1 ? e.out[1] < 0 : e.out[1] > 0));
      if (steep && lvl) {
        const vertical = Math.abs(e.out[0]) < 0.1;
        if (vertical || isFree()) {
          const yc = lvl.dir === 1 ? lvl.y + t / 2 : lvl.y - t / 2;
          out.strokes.push(bar(x - half, yc, x + half, { b: barScale }));
          if (style === 'bracketed' && vertical) {
            const yInner = lvl.dir === 1 ? lvl.y + t : lvl.y - t;
            const f = ext * 0.85;
            out.polys.push(fillet(x, 1, yInner, lvl.dir, a, f), fillet(x, -1, yInner, lvl.dir, a, f));
          }
        }
        continue;
      }

      // Beaks: free horizontal arm ends sitting at the top or bottom of the glyph
      // (the bar end must also be clear of other strokes by the beak's reach, otherwise the beak lands beside the
      //  diagonal of Z/z and fills the corner with a lump)
      const clearOfBeak = paths.every((path, pi) => pi === si || distToPath(e.pt, path) > half + 8);
      if (Math.abs(e.out[0]) > 0.9 && e.cap === 'butt' && clearOfBeak) {
        const lv = levels.find(l => Math.abs(y - (l.y + l.dir * b)) <= 2);
        if (!lv) continue;
        const xc = x - Math.sign(e.out[0]) * a * beakScale;
        const len = b + ext * 0.9;
        out.strokes.push({
          segs: [{ p: [[xc, y], [xc, y + lv.dir * len]] }],
          capStart: 'butt', capEnd: 'butt', scale: { a: beakScale }
        });
      }
    }
  });
  return out;
}
