import ClipperLib from 'clipper-lib';
import { Contour, Seg, area } from './contour';
import { V, cubicAt, dist, fitCurve, neg, norm, sub } from './geometry';

const SCALE = 64;
const WINDOW = 4;
const ORGANIC_WINDOW = 16;
const CORNER_DEG = 32;
const NEIGHBOUR = 6;
const TOLERANCE = 0.4;
const ORGANIC_TOLERANCE = 1.1;
const ORGANIC_CLEAN = 1.4;

function flatten(c: Contour): V[] {
  const pts: V[] = [[c.sx, c.sy]];
  let cur: V = [c.sx, c.sy];
  for (const s of c.segs) {
    if (s.t === 'L') {
      cur = [s.x, s.y];
      pts.push(cur);
    } else {
      const p: V[] = [cur, [s.x1, s.y1], [s.x2, s.y2], [s.x, s.y]];
      const poly = dist(p[0], p[1]) + dist(p[1], p[2]) + dist(p[2], p[3]);
      const steps = Math.min(120, Math.max(12, Math.ceil(poly / 5)));
      for (let i = 1; i <= steps; i++) pts.push(cubicAt(p, i / steps));
      cur = p[3];
    }
  }
  if (pts.length > 1 && dist(pts[0], pts[pts.length - 1]) < 1e-6) pts.pop();
  return pts;
}

function walk(P: V[], i: number, dir: 1 | -1, win: number): V {
  const n = P.length;
  let k = i, d = 0, steps = 0;
  while (d < win && steps < n / 2) {
    k = (k + dir + n) % n;
    d = dist(P[i], P[k]);
    steps++;
  }
  return P[k];
}

function angleAt(P: V[], i: number, win: number): number {
  const a = norm(sub(P[i], walk(P, i, -1, win)));
  const b = norm(sub(walk(P, i, 1, win), P[i]));
  return (Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1])) ) * 180) / Math.PI;
}

function isStraight(pts: V[]): boolean {
  const a = pts[0], b = pts[pts.length - 1];
  const l = dist(a, b);
  if (l < 1e-9) return false;
  for (const p of pts) {
    const d = Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / l;
    if (d > 0.25) return false;
  }
  return true;
}

/** Turn a dense polygon back into a contour of lines and smooth cubics, keeping sharp corners sharp. */
function fitPolygon(P: V[], tolerance: number = TOLERANCE, win: number = WINDOW): Contour | null {
  const n = P.length;
  if (n < 3) return null;

  const ang = P.map((_, i) => angleAt(P, i, win));
  const corners: number[] = [];
  for (let i = 0; i < n; i++) {
    if (ang[i] < CORNER_DEG) continue;
    let isMax = true;
    for (const dir of [1, -1]) {
      for (let d = 1; d < n && isMax; d++) {
        const j = (i + dir * d + n) % n;
        if (dist(P[i], P[j]) > NEIGHBOUR) break;
        if (ang[j] > ang[i] || (ang[j] === ang[i] && dir === -1)) isMax = false;
      }
    }
    if (isMax) corners.push(i);
  }

  const smooth = corners.length === 0;
  const knots = smooth ? [0, Math.floor(n / 2)] : corners;

  const segs: Seg[] = [];
  for (let k = 0; k < knots.length; k++) {
    const i = knots[k], j = knots[(k + 1) % knots.length];
    const pts: V[] = [];
    for (let m = i; ; m = (m + 1) % n) {
      pts.push(P[m]);
      if (m === j && pts.length > 1) break;
      if (pts.length > n + 1) break;
    }
    if (pts.length < 2) continue;

    if (pts.length === 2 || isStraight(pts)) {
      segs.push({ t: 'L', x: pts[pts.length - 1][0], y: pts[pts.length - 1][1] });
      continue;
    }

    const fwdI = walk(P, i, 1, win), backJ = walk(P, j, -1, win);
    let t1 = norm(sub(fwdI, P[i]));
    let t2 = norm(sub(backJ, P[j]));
    if (smooth) {
      t1 = norm(sub(walk(P, i, 1, win), walk(P, i, -1, win)));
      t2 = neg(norm(sub(walk(P, j, 1, win), walk(P, j, -1, win))));
    }
    for (const c of fitCurve(pts, t1, t2, tolerance)) {
      segs.push({ t: 'C', x1: c[1][0], y1: c[1][1], x2: c[2][0], y2: c[2][1], x: c[3][0], y: c[3][1] });
    }
  }
  return segs.length ? { sx: P[knots[0]][0], sy: P[knots[0]][1], segs } : null;
}

export interface OverlapOptions {
  /** smooth organic edge displacement */
  wobble?: { amp: number; wavelength: number; seed: number };
}

type CPath = { X: number; Y: number }[];

const hash = (ix: number, iy: number) => {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295 * 2 - 1;
};

function noise2(x: number, y: number): number {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0), b = hash(x0 + 1, y0), c = hash(x0, y0 + 1), d = hash(x0 + 1, y0 + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function wobblePaths(paths: CPath[], amp: number, wavelength: number, seed: number): CPath[] {
  const step = Math.max(6, wavelength / 8);
  const ox = (seed * 37.17) % 101, oy = (seed * 17.31) % 103;
  const out: CPath[] = [];
  for (const path of paths) {
    const pts: V[] = path.map(p => [p.X / SCALE, p.Y / SCALE]);
    const dense: V[] = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const n = Math.max(1, Math.ceil(dist(a, b) / step));
      for (let k = 0; k < n; k++) dense.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
    }
    out.push(dense.map((p, i) => {
      const prev = dense[(i - 1 + dense.length) % dense.length], next = dense[(i + 1) % dense.length];
      const t = norm(sub(next, prev));
      const nrm: V = [t[1], -t[0]];
      const f = 1 / wavelength;
      const w = noise2(p[0] * f + ox, p[1] * f + oy) + 0.4 * noise2(p[0] * f * 2.3 + oy, p[1] * f * 2.3 + ox);
      const d = (amp * w) / 1.4;
      return { X: Math.round((p[0] + nrm[0] * d) * SCALE), Y: Math.round((p[1] + nrm[1] * d) * SCALE) };
    }));
  }
  return ClipperLib.Clipper.SimplifyPolygons(out, ClipperLib.PolyFillType.pftNonZero);
}

/**
 * Merge overlapping strokes into clean outlines (outer contours clockwise, counters counter-clockwise),
 * so every rasterizer and font editor renders the glyph identically.
 */
export function removeOverlaps(contours: Contour[], opts: OverlapOptions = {}): Contour[] {
  if (contours.length === 0) return contours;

  const subject = contours.map(c => flatten(c).map(([x, y]) => ({ X: Math.round(x * SCALE), Y: Math.round(y * SCALE) })));
  const clipper = new ClipperLib.Clipper();
  clipper.AddPaths(subject, ClipperLib.PolyType.ptSubject, true);
  const solution = new ClipperLib.Paths();
  clipper.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
  let work: CPath[] = solution;
  if (opts.wobble && opts.wobble.amp > 0.3) work = ClipperLib.Clipper.CleanPolygons(work, SCALE * ORGANIC_CLEAN * 0.5);
  if (opts.wobble && opts.wobble.amp > 0.3) work = wobblePaths(work, opts.wobble.amp, opts.wobble.wavelength, opts.wobble.seed);
  const organic = work !== solution;
  const cleaned = ClipperLib.Clipper.CleanPolygons(work, SCALE * (organic ? ORGANIC_CLEAN : 0.1));

  const out: Contour[] = [];
  for (const path of cleaned) {
    // Clipper returns outers counter-clockwise (positive area); fonts want them clockwise.
    const pts: V[] = path.map((p: { X: number; Y: number }): V => [p.X / SCALE, p.Y / SCALE]).reverse();
    const fitted = fitPolygon(pts, organic ? ORGANIC_TOLERANCE : TOLERANCE, organic ? ORGANIC_WINDOW : WINDOW);
    if (fitted && Math.abs(area(fitted)) > 40) out.push(fitted);
  }
  return out;
}
