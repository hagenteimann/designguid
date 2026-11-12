import { Contour, Seg } from './contour';
import { V, add, cross, cubicAt, dist, dot, mul, norm, sub } from './geometry';

type Piece = V[];

const MIN_TURN = 0.3;

function toPieces(c: Contour): Piece[] {
  let cur: V = [c.sx, c.sy];
  return c.segs.map((s): Piece => {
    const p: Piece = s.t === 'L' ? [cur, [s.x, s.y]] : [cur, [s.x1, s.y1], [s.x2, s.y2], [s.x, s.y]];
    cur = [s.x, s.y];
    return p;
  });
}

function pieceLength(p: Piece): number {
  if (p.length === 2) return dist(p[0], p[1]);
  let len = 0, prev = p[0];
  for (let i = 1; i <= 16; i++) {
    const q = cubicAt(p, i / 16);
    len += dist(prev, q);
    prev = q;
  }
  return len;
}

function tangentAt(p: Piece, atStart: boolean): V {
  const n = p.length;
  if (atStart) {
    for (let i = 1; i < n; i++) { const d = sub(p[i], p[0]); if (Math.hypot(d[0], d[1]) > 1e-9) return norm(d); }
  } else {
    for (let i = n - 2; i >= 0; i--) { const d = sub(p[n - 1], p[i]); if (Math.hypot(d[0], d[1]) > 1e-9) return norm(d); }
  }
  return [1, 0];
}

const lerp = (a: V, b: V, t: number): V => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

function splitCubic(p: Piece, t: number): [Piece, Piece] {
  const a = lerp(p[0], p[1], t), b = lerp(p[1], p[2], t), c = lerp(p[2], p[3], t);
  const d = lerp(a, b, t), e = lerp(b, c, t);
  const f = lerp(d, e, t);
  return [[p[0], a, d, f], [f, e, c, p[3]]];
}

/** Parameter t whose arc length from the start equals `d` (for d measured from the end, pass length - d). */
function paramAtLength(p: Piece, d: number): number {
  if (p.length === 2) return d / (dist(p[0], p[1]) || 1);
  const N = 32;
  let acc = 0, prev = p[0];
  for (let i = 1; i <= N; i++) {
    const q = cubicAt(p, i / N);
    const seg = dist(prev, q);
    if (acc + seg >= d) return (i - 1 + (d - acc) / (seg || 1)) / N;
    acc += seg;
    prev = q;
  }
  return 1;
}

function trim(p: Piece, dStart: number, dEnd: number): Piece {
  if (dStart <= 0 && dEnd <= 0) return p;
  const len = pieceLength(p);
  const t0 = paramAtLength(p, dStart);
  const t1 = paramAtLength(p, len - dEnd);
  if (p.length === 2) return [lerp(p[0], p[1], t0), lerp(p[0], p[1], t1)];
  const right = splitCubic(p, t0)[1];
  return splitCubic(right, (t1 - t0) / (1 - t0 || 1))[0];
}

/**
 * Rounds every sharp corner (convex and concave) with a circular fillet of radius `radius`.
 * The radius shrinks where adjacent edges are too short, so thin features stay intact.
 */
export function roundCorners(contours: Contour[], radius: number, concaveRadius: number = radius): Contour[] {
  if (radius <= 0.5 && concaveRadius <= 0.5) return contours;
  return contours.map(c => roundContour(c, radius, concaveRadius));
}

/** Outer contours run clockwise and counters counter-clockwise, so material is always on the right. */
function roundContour(c: Contour, radius: number, concaveRadius: number): Contour {
  const pieces = toPieces(c);
  const n = pieces.length;
  if (n < 2) return c;

  const lens = pieces.map(pieceLength);
  const trimStart = new Array<number>(n).fill(0);
  const trimEnd = new Array<number>(n).fill(0);
  const turn = new Array<number>(n).fill(0);
  const radiusAt = new Array<number>(n).fill(0);

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const ti = tangentAt(pieces[i], false), tj = tangentAt(pieces[j], true);
    const theta = Math.acos(Math.max(-1, Math.min(1, dot(ti, tj))));
    if (theta < MIN_TURN) continue;
    const concave = cross(ti, tj) > 0;
    const r = concave ? concaveRadius : radius;
    if (r <= 0.5) continue;
    const wanted = r * Math.tan(Math.min(theta, Math.PI - 0.05) / 2);
    const d = Math.min(wanted, 0.45 * lens[i], 0.45 * lens[j]);
    if (d < 0.5) continue;
    turn[i] = theta;
    trimEnd[i] = d;
    trimStart[j] = d;
    radiusAt[i] = d / Math.tan(Math.min(theta, Math.PI - 0.05) / 2);
  }

  const trimmed = pieces.map((p, i) => trim(p, trimStart[i], trimEnd[i]));
  const segs: Seg[] = [];
  const push = (p: Piece) => {
    segs.push(p.length === 2
      ? { t: 'L', x: p[1][0], y: p[1][1] }
      : { t: 'C', x1: p[1][0], y1: p[1][1], x2: p[2][0], y2: p[2][1], x: p[3][0], y: p[3][1] });
  };

  for (let i = 0; i < n; i++) {
    push(trimmed[i]);
    if (turn[i] > 0) {
      const j = (i + 1) % n;
      const A = trimmed[i][trimmed[i].length - 1], B = trimmed[j][0];
      const ta = tangentAt(trimmed[i], false), tb = tangentAt(trimmed[j], true);
      const h = (4 / 3) * Math.tan(turn[i] / 4) * radiusAt[i];
      push([A, add(A, mul(ta, h)), sub(B, mul(tb, h)), B]);
    }
  }
  const start = trimmed[0][0];
  return { sx: start[0], sy: start[1], segs };
}
