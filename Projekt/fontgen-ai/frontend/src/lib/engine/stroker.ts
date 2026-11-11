import { Contour, Seg, area, reverseContour } from './contour';
import { V, add, cross, cubicAt, cubicDeriv, dist, dot, ellipseArcCubics, fitCurve, mul, neg, norm, sub } from './geometry';

/** 'term' resolves to the font's terminal style; 'hcut'/'vcut' end flush with a horizontal/vertical line. */
export type Cap = 'butt' | 'round' | 'term' | 'hcut' | 'vcut';

/** A skeleton segment: 2 points = line, 4 points = cubic Bézier. */
export interface SkSeg {
  p: V[];
}

export interface Stroke {
  segs: SkSeg[];
  closed?: boolean;
  capStart?: Cap;
  capEnd?: Cap;
  /** scales the pen for this stroke only (thin serifs and beaks) */
  scale?: { a?: number; b?: number };
}

/** Elliptical pen: a = half width of vertical stems, b = half thickness of horizontal strokes. */
export interface Pen {
  a: number;
  b: number;
}

export interface StrokeOptions {
  terminal: 'flat' | 'round';
  tolerance?: number;
}

type Piece = V[];

const MITER_LIMIT = 4;

function tan0(s: SkSeg): V {
  const p = s.p;
  for (let i = 1; i < p.length; i++) {
    const d = sub(p[i], p[0]);
    if (Math.hypot(d[0], d[1]) > 1e-9) return norm(d);
  }
  return [1, 0];
}

function tan1(s: SkSeg): V {
  const p = s.p, n = p.length;
  for (let i = n - 2; i >= 0; i--) {
    const d = sub(p[n - 1], p[i]);
    if (Math.hypot(d[0], d[1]) > 1e-9) return norm(d);
  }
  return [1, 0];
}

function tanAt(s: SkSeg, t: number): V {
  const d = cubicDeriv(s.p, t);
  return Math.hypot(d[0], d[1]) < 1e-9 ? (t < 0.5 ? tan0(s) : tan1(s)) : norm(d);
}

/** Point on the pen's outline that touches a stroke travelling in direction T (side +1 = left). */
function offset(pen: Pen, T: V, side: 1 | -1): V {
  const nx = -T[1], ny = T[0];
  const h = Math.sqrt(pen.a * pen.a * nx * nx + pen.b * pen.b * ny * ny) || 1;
  return [(side * pen.a * pen.a * nx) / h, (side * pen.b * pen.b * ny) / h];
}

interface Cut {
  axis: 'x' | 'y';
  val: number;
}

function applyCut(pt: V, T: V, cut: Cut): V {
  if (cut.axis === 'y') {
    if (Math.abs(T[1]) < 0.15) return pt;
    const s = (cut.val - pt[1]) / T[1];
    return [pt[0] + T[0] * s, cut.val];
  }
  if (Math.abs(T[0]) < 0.15) return pt;
  const s = (cut.val - pt[0]) / T[0];
  return [cut.val, pt[1] + T[1] * s];
}

function sideChain(segs: SkSeg[], closed: boolean, pen: Pen, side: 1 | -1, cutS: Cut | null, cutE: Cut | null, tol: number): Piece[] {
  const n = segs.length;
  const S: V[] = [], E: V[] = [];
  const bevel: boolean[] = new Array(n).fill(false);

  for (let i = 0; i < n; i++) {
    const p = segs[i].p;
    S[i] = add(p[0], offset(pen, tan0(segs[i]), side));
    E[i] = add(p[p.length - 1], offset(pen, tan1(segs[i]), side));
  }

  const joints = closed ? n : n - 1;
  for (let i = 0; i < joints; i++) {
    const j = (i + 1) % n;
    const Ti = tan1(segs[i]), Tj = tan0(segs[j]);
    const c = cross(Ti, Tj), d = dot(Ti, Tj);
    const P = segs[i].p[segs[i].p.length - 1];
    if (d > 0.9945) {
      const m: V = [(E[i][0] + S[j][0]) / 2, (E[i][1] + S[j][1]) / 2];
      E[i] = m; S[j] = m;
    } else if (Math.abs(c) < 1e-6) {
      bevel[i] = true;
    } else {
      const s = cross(sub(S[j], E[i]), Tj) / c;
      const X = add(E[i], mul(Ti, s));
      if (dist(X, P) <= MITER_LIMIT * Math.max(pen.a, pen.b)) { E[i] = X; S[j] = X; }
      else bevel[i] = true;
    }
  }

  if (!closed) {
    if (cutS) S[0] = applyCut(S[0], tan0(segs[0]), cutS);
    if (cutE) E[n - 1] = applyCut(E[n - 1], tan1(segs[n - 1]), cutE);
  }

  const pieces: Piece[] = [];
  for (let i = 0; i < n; i++) {
    const s = segs[i];
    if (s.p.length === 2) {
      pieces.push([S[i], E[i]]);
    } else {
      const poly = dist(s.p[0], s.p[1]) + dist(s.p[1], s.p[2]) + dist(s.p[2], s.p[3]);
      const K = Math.min(48, Math.max(10, Math.ceil(poly / 8)));
      const pts: V[] = [S[i]];
      for (let k = 1; k < K; k++) {
        const t = k / K;
        pts.push(add(cubicAt(s.p, t), offset(pen, tanAt(s, t), side)));
      }
      pts.push(E[i]);
      for (const c of fitCurve(pts, tan0(s), neg(tan1(s)), tol)) pieces.push(c);
    }
    if (bevel[i] && (closed || i < n - 1)) pieces.push([E[i], S[(i + 1) % n]]);
  }
  return pieces;
}

const startOf = (ps: Piece[]) => ps[0][0];
const endOf = (ps: Piece[]) => ps[ps.length - 1][ps[ps.length - 1].length - 1];
const reversePieces = (ps: Piece[]): Piece[] => ps.map(p => [...p].reverse()).reverse();

function toContour(pieces: Piece[]): Contour {
  const segs: Seg[] = pieces.map((p): Seg =>
    p.length === 2
      ? { t: 'L', x: p[1][0], y: p[1][1] }
      : { t: 'C', x1: p[1][0], y1: p[1][1], x2: p[2][0], y2: p[2][1], x: p[3][0], y: p[3][1] }
  );
  return { sx: pieces[0][0][0], sy: pieces[0][0][1], segs };
}

/** Half of the pen ellipse swept clockwise from `from` to `to`, centred on the stroke end `c`. */
function roundCap(from: V, to: V, c: V, T: V, pen: Pen, atEnd: boolean): Piece[] {
  const nL: V = [-T[1], T[0]];
  const thetaL = Math.atan2(pen.b * nL[1], pen.a * nL[0]);
  const theta0 = atEnd ? thetaL : thetaL + Math.PI;
  const arcs = ellipseArcCubics(0, 0, pen.a, pen.b, theta0, theta0 - Math.PI, 0);
  const pieces: Piece[] = arcs.map(a => a.map(q => add(q, c)) as Piece);
  pieces[0][0] = from;
  pieces[pieces.length - 1][3] = to;
  return pieces;
}

function resolveCap(cap: Cap | undefined, terminal: 'flat' | 'round'): Cap {
  if (cap === 'term') return terminal === 'round' ? 'round' : 'butt';
  return cap ?? 'butt';
}

function orient(c: Contour, clockwise: boolean): Contour {
  return (area(c) < 0) === clockwise ? c : reverseContour(c);
}

export function strokeToContours(stroke: Stroke, basePen: Pen, opts: StrokeOptions): Contour[] {
  const pen: Pen = stroke.scale ? { a: basePen.a * (stroke.scale.a ?? 1), b: basePen.b * (stroke.scale.b ?? 1) } : basePen;
  const segs = stroke.segs;
  if (segs.length === 0) return [];
  const tol = opts.tolerance ?? 0.7;

  if (stroke.closed) {
    const l = toContour(sideChain(segs, true, pen, 1, null, null, tol));
    const r = toContour(sideChain(segs, true, pen, -1, null, null, tol));
    const lOuter = Math.abs(area(l)) >= Math.abs(area(r));
    return [orient(l, lOuter), orient(r, !lOuter)];
  }

  const capS = resolveCap(stroke.capStart, opts.terminal);
  const capE = resolveCap(stroke.capEnd, opts.terminal);
  const first = segs[0], last = segs[segs.length - 1];
  const P0 = first.p[0], P1 = last.p[last.p.length - 1];
  const T0 = tan0(first), T1 = tan1(last);

  const cutS: Cut | null = capS === 'hcut' ? { axis: 'y', val: P0[1] } : capS === 'vcut' ? { axis: 'x', val: P0[0] } : null;
  const cutE: Cut | null = capE === 'hcut' ? { axis: 'y', val: P1[1] } : capE === 'vcut' ? { axis: 'x', val: P1[0] } : null;

  const L = sideChain(segs, false, pen, 1, cutS, cutE, tol);
  const R = sideChain(segs, false, pen, -1, cutS, cutE, tol);

  const pieces: Piece[] = [...L];
  pieces.push(...(capE === 'round' ? roundCap(endOf(L), endOf(R), P1, T1, pen, true) : [[endOf(L), endOf(R)]]));
  pieces.push(...reversePieces(R));
  pieces.push(...(capS === 'round' ? roundCap(startOf(R), startOf(L), P0, T0, pen, false) : [[startOf(R), startOf(L)]]));

  return [orient(toContour(pieces), true)];
}

export function dotContour(cx: number, cy: number, rx: number, ry: number, square: boolean): Contour {
  if (square) {
    return { sx: cx - rx, sy: cy + ry, segs: [
      { t: 'L', x: cx + rx, y: cy + ry },
      { t: 'L', x: cx + rx, y: cy - ry },
      { t: 'L', x: cx - rx, y: cy - ry },
      { t: 'L', x: cx - rx, y: cy + ry }
    ] };
  }
  return toContour(ellipseArcCubics(cx, cy, rx, ry, Math.PI / 2, -Math.PI * 1.5, 0));
}
