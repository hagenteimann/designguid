export type V = [number, number];
export type Cubic = [V, V, V, V];

export const add = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
export const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1]];
export const mul = (a: V, s: number): V => [a[0] * s, a[1] * s];
export const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1];
export const cross = (a: V, b: V) => a[0] * b[1] - a[1] * b[0];
export const len = (a: V) => Math.hypot(a[0], a[1]);
export const dist = (a: V, b: V) => len(sub(a, b));
export const neg = (a: V): V => [-a[0], -a[1]];
export const norm = (a: V): V => {
  const l = len(a);
  return l < 1e-12 ? [0, 0] : [a[0] / l, a[1] / l];
};

const bern = (u: number): [number, number, number, number] => {
  const m = 1 - u;
  return [m * m * m, 3 * u * m * m, 3 * u * u * m, u * u * u];
};

export function cubicAt(c: V[], t: number): V {
  const [b0, b1, b2, b3] = bern(t);
  return [
    b0 * c[0][0] + b1 * c[1][0] + b2 * c[2][0] + b3 * c[3][0],
    b0 * c[0][1] + b1 * c[1][1] + b2 * c[2][1] + b3 * c[3][1]
  ];
}

export function cubicDeriv(c: V[], t: number): V {
  const m = 1 - t;
  const d0 = sub(c[1], c[0]), d1 = sub(c[2], c[1]), d2 = sub(c[3], c[2]);
  return [
    3 * (m * m * d0[0] + 2 * m * t * d1[0] + t * t * d2[0]),
    3 * (m * m * d0[1] + 2 * m * t * d1[1] + t * t * d2[1])
  ];
}

/**
 * Cubic Bézier approximation of an elliptical arc. Angles in radians, counter-clockwise positive.
 * `sqz` (0..1) pushes the handles outwards, turning circles into superellipse-like "squircles".
 */
export function ellipseArcCubics(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, sqz = 0): Cubic[] {
  const total = a1 - a0;
  const n = Math.max(1, Math.ceil(Math.abs(total) / (Math.PI / 2) - 1e-9));
  const step = total / n;
  const k = (4 / 3) * Math.tan(step / 4) * (1 + sqz * 0.45 * Math.min(1, Math.abs(step) / (Math.PI / 2)));
  const out: Cubic[] = [];
  for (let i = 0; i < n; i++) {
    const t0 = a0 + step * i;
    const t1 = t0 + step;
    const p0: V = [cx + rx * Math.cos(t0), cy + ry * Math.sin(t0)];
    const p3: V = [cx + rx * Math.cos(t1), cy + ry * Math.sin(t1)];
    const d0: V = [-rx * Math.sin(t0), ry * Math.cos(t0)];
    const d1: V = [-rx * Math.sin(t1), ry * Math.cos(t1)];
    out.push([p0, add(p0, mul(d0, k)), sub(p3, mul(d1, k)), p3]);
  }
  return out;
}

/* ── Schneider curve fitting: polyline → few smooth cubics ─────────────────── */

function chordParam(pts: V[]): number[] {
  const u = [0];
  for (let i = 1; i < pts.length; i++) u.push(u[i - 1] + dist(pts[i], pts[i - 1]));
  const total = u[u.length - 1] || 1;
  return u.map(x => x / total);
}

function generateBezier(pts: V[], u: number[], t1: V, t2: V): Cubic {
  const p0 = pts[0], p3 = pts[pts.length - 1];
  let c00 = 0, c01 = 0, c11 = 0, x0 = 0, x1 = 0;
  for (let i = 0; i < pts.length; i++) {
    const [b0, b1, b2, b3] = bern(u[i]);
    const a1 = mul(t1, b1), a2 = mul(t2, b2);
    c00 += dot(a1, a1); c01 += dot(a1, a2); c11 += dot(a2, a2);
    const tmp = sub(pts[i], add(mul(p0, b0 + b1), mul(p3, b2 + b3)));
    x0 += dot(a1, tmp); x1 += dot(a2, tmp);
  }
  const det = c00 * c11 - c01 * c01;
  const seg = dist(p0, p3);
  const aL = Math.abs(det) > 1e-12 ? (x0 * c11 - x1 * c01) / det : 0;
  const aR = Math.abs(det) > 1e-12 ? (c00 * x1 - c01 * x0) / det : 0;
  const eps = 1e-6 * seg;
  if (aL < eps || aR < eps || aL > seg * 3 || aR > seg * 3) {
    const d = seg / 3;
    return [p0, add(p0, mul(t1, d)), add(p3, mul(t2, d)), p3];
  }
  return [p0, add(p0, mul(t1, aL)), add(p3, mul(t2, aR)), p3];
}

function maxError(pts: V[], bez: Cubic, u: number[]): { max: number; split: number } {
  let max = 0, split = Math.floor(pts.length / 2);
  for (let i = 1; i < pts.length - 1; i++) {
    const d = sub(cubicAt(bez, u[i]), pts[i]);
    const e = dot(d, d);
    if (e >= max) { max = e; split = i; }
  }
  return { max, split };
}

function reparameterize(pts: V[], u: number[], bez: Cubic): number[] {
  const d1: V[] = [sub(bez[1], bez[0]), sub(bez[2], bez[1]), sub(bez[3], bez[2])].map(v => mul(v, 3)) as V[];
  const d2: V[] = [sub(d1[1], d1[0]), sub(d1[2], d1[1])].map(v => mul(v, 2)) as V[];
  return u.map((ui, i) => {
    const m = 1 - ui;
    const q = cubicAt(bez, ui);
    const q1: V = [
      m * m * d1[0][0] + 2 * m * ui * d1[1][0] + ui * ui * d1[2][0],
      m * m * d1[0][1] + 2 * m * ui * d1[1][1] + ui * ui * d1[2][1]
    ];
    const q2: V = [m * d2[0][0] + ui * d2[1][0], m * d2[0][1] + ui * d2[1][1]];
    const diff = sub(q, pts[i]);
    const num = dot(diff, q1);
    const den = dot(q1, q1) + dot(diff, q2);
    return Math.abs(den) < 1e-12 ? ui : Math.min(1, Math.max(0, ui - num / den));
  });
}

function fitCubic(pts: V[], t1: V, t2: V, err2: number, out: Cubic[]): void {
  if (pts.length === 2) {
    const d = dist(pts[0], pts[1]) / 3;
    out.push([pts[0], add(pts[0], mul(t1, d)), add(pts[1], mul(t2, d)), pts[1]]);
    return;
  }
  let u = chordParam(pts);
  let bez = generateBezier(pts, u, t1, t2);
  let { max, split } = maxError(pts, bez, u);
  if (max < err2) { out.push(bez); return; }
  if (max < err2 * 16) {
    for (let i = 0; i < 6; i++) {
      u = reparameterize(pts, u, bez);
      bez = generateBezier(pts, u, t1, t2);
      ({ max, split } = maxError(pts, bez, u));
      if (max < err2) { out.push(bez); return; }
    }
  }
  split = Math.min(Math.max(split, 1), pts.length - 2);
  const tc = norm(sub(pts[split - 1], pts[split + 1]));
  fitCubic(pts.slice(0, split + 1), t1, tc, err2, out);
  fitCubic(pts.slice(split), neg(tc), t2, err2, out);
}

/** t1 points from the first point into the curve; t2 points from the last point back into the curve. */
export function fitCurve(points: V[], t1: V, t2: V, tolerance: number): Cubic[] {
  const pts: V[] = [points[0]];
  for (let i = 1; i < points.length; i++) if (dist(points[i], pts[pts.length - 1]) > 1e-6) pts.push(points[i]);
  if (pts.length < 2) return [];
  const out: Cubic[] = [];
  fitCubic(pts, t1, t2, tolerance * tolerance, out);
  return out;
}
