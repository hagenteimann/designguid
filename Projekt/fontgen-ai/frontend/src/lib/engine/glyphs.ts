import { V, dist, ellipseArcCubics } from './geometry';
import { Metrics } from './params';
import { Cap, Stroke } from './stroker';

export type Edge = 's' | 'r' | 'd' | 'o';

export interface Dot {
  x: number;
  y: number;
  r: number;
}

export interface Skel {
  strokes: Stroke[];
  dots: Dot[];
}

export interface GlyphDef {
  skel: Skel;
  edges: [Edge, Edge];
  /** nominal outer width, used to mirror glyphs and centre accents */
  w: number;
  /** x position accents are centred on */
  cx: number;
  /** top of the glyph for accent placement */
  top: number;
}

export interface DefContext {
  m: Metrics;
  squareness: number;
}

const rad = (d: number) => (d * Math.PI) / 180;

class PB {
  segs: { p: V[] }[] = [];
  cur: V | null = null;

  constructor(private sqz: number, x?: number, y?: number) {
    if (x !== undefined && y !== undefined) this.cur = [x, y];
  }

  L(x: number, y: number): this {
    const p: V = [x, y];
    if (this.cur && dist(this.cur, p) > 1e-6) this.segs.push({ p: [this.cur, p] });
    this.cur = p;
    return this;
  }

  C(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this {
    this.segs.push({ p: [this.cur as V, [x1, y1], [x2, y2], [x, y]] });
    this.cur = [x, y];
    return this;
  }

  /** Elliptical arc; degrees, counter-clockwise when a1 > a0. */
  arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): this {
    const cubics = ellipseArcCubics(cx, cy, rx, ry, rad(a0), rad(a1), this.sqz);
    const st = cubics[0][0];
    if (!this.cur) this.cur = st;
    else if (dist(this.cur, st) > 0.05) this.L(st[0], st[1]);
    for (const c of cubics) this.segs.push({ p: c });
    this.cur = cubics[cubics.length - 1][3];
    return this;
  }

  /** Smooth chain through points with given unit tangents. */
  herm(pts: [V, V][], k = 0.4): this {
    if (!this.cur) this.cur = pts[0][0];
    for (let i = 0; i < pts.length - 1; i++) {
      const [p, t] = pts[i], [q, u] = pts[i + 1];
      const d = dist(p, q) * k;
      this.segs.push({ p: [p, [p[0] + t[0] * d, p[1] + t[1] * d], [q[0] - u[0] * d, q[1] - u[1] * d], q] });
    }
    this.cur = pts[pts.length - 1][0];
    return this;
  }

  stroke(capStart: Cap = 'term', capEnd: Cap = 'term', closed = false): Stroke {
    return { segs: this.segs, capStart, capEnd, closed };
  }
}

const mapStroke = (s: Stroke, f: (p: V) => V): Stroke => ({
  ...s,
  segs: s.segs.map(g => ({ p: g.p.map(f) }))
});

const flipX = (g: GlyphDef): GlyphDef => ({
  ...g,
  skel: {
    strokes: g.skel.strokes.map(s => mapStroke(s, p => [g.w - p[0], p[1]])),
    dots: g.skel.dots.map(d => ({ ...d, x: g.w - d.x }))
  },
  edges: [g.edges[1], g.edges[0]],
  cx: g.w - g.cx
});

const rot180 = (g: GlyphDef, ymid: number): GlyphDef => ({
  ...g,
  skel: {
    strokes: g.skel.strokes.map(s => mapStroke(s, p => [g.w - p[0], 2 * ymid - p[1]])),
    dots: g.skel.dots.map(d => ({ ...d, x: g.w - d.x, y: 2 * ymid - d.y }))
  },
  edges: [g.edges[1], g.edges[0]],
  cx: g.w - g.cx
});

export function buildDefs(c: DefContext): Record<string, GlyphDef> {
  const { m, squareness: sqz } = c;
  const { a, b, cap, xh, asc, desc, ov, stem, hstem, wf } = m;
  const defs: Record<string, GlyphDef> = {};

  const pb = (x?: number, y?: number) => new PB(sqz, x, y);
  const ln = (x0: number, y0: number, x1: number, y1: number, cs: Cap = 'butt', ce: Cap = 'butt'): Stroke =>
    ({ segs: [{ p: [[x0, y0], [x1, y1]] }], capStart: cs, capEnd: ce });
  const ring = (cx: number, cy: number, rx: number, ry: number) => pb().arc(cx, cy, rx, ry, 0, 360).stroke('butt', 'butt', true);
  const capW = (f: number) => cap * f * wf;
  const lcW = (f: number) => xh * f * wf;
  const hw = m.hw;

  const def = (ch: string, edges: [Edge, Edge], strokes: Stroke[], w: number, o: { dots?: Dot[]; cx?: number; top?: number } = {}) => {
    defs[ch] = { skel: { strokes, dots: o.dots ?? [] }, edges, w, cx: o.cx ?? w / 2, top: o.top ?? cap };
  };

  const rd = stem * 0.62;
  const dotGap = 30 + stem * 0.3;
  const dotY = xh + dotGap + rd;

  /* round glyph helpers: ellipse whose outer edges span [yb, yt] and width W */
  const loopRx = (W: number) => W / 2 - a;
  const loopRy = (yt: number, yb: number) => (yt - yb - 2 * b) / 2;

  /* ── Uppercase ─────────────────────────────────────────────────────────── */

  { const W = capW(0.56);
    def('E', ['s', 'o'], [ln(a, 0, a, cap), ln(a, cap - b, W, cap - b), ln(a, cap * 0.52, W * 0.9, cap * 0.52), ln(a, b, W, b)], W); }
  { const W = capW(0.54);
    def('F', ['s', 'o'], [ln(a, 0, a, cap), ln(a, cap - b, W, cap - b), ln(a, cap * 0.54, W * 0.88, cap * 0.54)], W); }
  { const W = capW(0.52);
    def('L', ['s', 'o'], [ln(a, 0, a, cap), ln(a, b, W, b)], W); }
  { const W = capW(0.7);
    def('H', ['s', 's'], [ln(a, 0, a, cap), ln(W - a, 0, W - a, cap), ln(a, cap * 0.5, W - a, cap * 0.5)], W); }
  def('I', ['s', 's'], [ln(a, 0, a, cap)], stem);
  { const W = capW(0.62);
    def('T', ['o', 'o'], [ln(0, cap - b, W, cap - b), ln(W / 2, 0, W / 2, cap - b)], W); }
  { const W = capW(0.7), hd = hw(W, cap);
    def('N', ['s', 's'], [ln(a, 0, a, cap), ln(W - a, 0, W - a, cap), ln(hd / 2, cap, W - hd / 2, 0, 'hcut', 'hcut')], W); }
  { const W = capW(0.9), hd = hw(W / 2, cap);
    def('M', ['s', 's'], [ln(a, 0, a, cap), ln(W - a, 0, W - a, cap), ln(hd / 2, cap, W / 2, 0, 'hcut', 'hcut'), ln(W / 2, 0, W - hd / 2, cap, 'hcut', 'hcut')], W); }
  { const W = capW(0.72), hd = hw(W / 2, cap);
    def('V', ['d', 'd'], [ln(hd / 2, cap, W / 2, 0, 'hcut', 'hcut'), ln(W / 2, 0, W - hd / 2, cap, 'hcut', 'hcut')], W); }
  { const W = capW(1.02), hd = hw(W / 4, cap);
    def('W', ['d', 'd'], [
      ln(hd / 2, cap, W * 0.27, 0, 'hcut', 'hcut'), ln(W * 0.27, 0, W / 2, cap, 'hcut', 'hcut'),
      ln(W / 2, cap, W * 0.73, 0, 'hcut', 'hcut'), ln(W * 0.73, 0, W - hd / 2, cap, 'hcut', 'hcut')
    ], W); }
  { const W = capW(0.74), hd = hw(W / 2, cap), yb = cap * 0.3;
    const xl = hd / 2 + (W / 2 - hd / 2) * (yb / cap);
    def('A', ['d', 'd'], [ln(hd / 2, 0, W / 2, cap, 'hcut', 'hcut'), ln(W - hd / 2, 0, W / 2, cap, 'hcut', 'hcut'), ln(xl, yb, W - xl, yb)], W); }
  { const W = capW(0.7), hd = hw(W, cap);
    def('X', ['d', 'd'], [ln(hd / 2, cap, W - hd / 2, 0, 'hcut', 'hcut'), ln(W - hd / 2, cap, hd / 2, 0, 'hcut', 'hcut')], W); }
  { const W = capW(0.68), hd = hw(W / 2, cap * 0.55), yj = cap * 0.44;
    def('Y', ['d', 'd'], [ln(hd / 2, cap, W / 2, yj, 'hcut', 'butt'), ln(W - hd / 2, cap, W / 2, yj, 'hcut', 'butt'), ln(W / 2, 0, W / 2, yj + 20)], W); }
  { const W = capW(0.64), hd1 = hw(W - a, cap * 0.64), yk = cap * 0.36;
    const xe = W - hd1 / 2, t = 0.55;
    const kx = a + (xe - a) * t, ky = yk + (cap - yk) * t;
    def('K', ['s', 'd'], [ln(a, 0, a, cap), ln(a, yk, xe, cap, 'butt', 'hcut'), ln(kx, ky, W - hw(W - kx, ky) / 2, 0, 'butt', 'hcut')], W); }
  { const W = capW(0.62), hd = hw(W, cap);
    def('Z', ['o', 'o'], [ln(0, cap - b, W, cap - b), ln(0, b, W, b), ln(W - hd / 2, cap, hd / 2, 0, 'hcut', 'hcut')], W); }

  const bowl = (yT: number, yB: number, xR: number): Stroke => {
    const ry = (yT - yB) / 2, rx = Math.min(ry * 0.95, xR - a);
    return pb(a, yT).L(xR - rx, yT).arc(xR - rx, (yT + yB) / 2, rx, ry, 90, -90).L(a, yB).stroke('butt', 'butt');
  };
  { const W = capW(0.62), ym = cap * 0.53;
    def('B', ['s', 'r'], [ln(a, 0, a, cap), bowl(cap - b, ym, W - a - cap * 0.035), bowl(ym, b, W - a)], W); }
  { const W = capW(0.6);
    def('P', ['s', 'r'], [ln(a, 0, a, cap), bowl(cap - b, cap * 0.4, W - a)], W); }
  { const W = capW(0.62), yb = cap * 0.42;
    def('R', ['s', 'd'], [ln(a, 0, a, cap), bowl(cap - b, yb, W - a), ln(a + (W - a) * 0.4, yb, W - hw(W * 0.5, yb) / 2, 0, 'butt', 'hcut')], W); }
  { const W = capW(0.72);
    def('D', ['s', 'r'], [ln(a, 0, a, cap), bowl(cap - b, b, W - a)], W); }
  { const W = capW(0.8), rx = loopRx(W), ry = loopRy(cap + ov, -ov);
    def('O', ['r', 'r'], [ring(W / 2, cap / 2, rx, ry)], W); }
  { const W = capW(0.8), rx = loopRx(W), ry = loopRy(cap + ov, -ov);
    def('Q', ['r', 'r'], [ring(W / 2, cap / 2, rx, ry), ln(W * 0.58, cap * 0.26, W * 0.9, -cap * 0.05)], W); }
  { const W = capW(0.76), rx = loopRx(W), ry = loopRy(cap + ov, -ov);
    def('C', ['r', 'o'], [pb().arc(W / 2, cap / 2, rx, ry, 38, 322).stroke()], W); }
  { const W = capW(0.8), rx = loopRx(W), ry = loopRy(cap + ov, -ov);
    /* the bowl ends with a vertical tangent exactly at bar height, so the bar meets it in one clean corner */
    const yE = cap / 2;
    def('G', ['r', 's'], [pb().arc(W / 2, cap / 2, rx, ry, 38, 360).L(W * 0.52, yE).stroke('term', 'butt')], W); }
  { const W = capW(0.48), rx = (W - 2 * a) / 2, ry = cap * 0.2, yc = b - ov + ry;
    def('J', ['r', 's'], [pb(W - a, cap).L(W - a, yc).arc(W - a - rx, yc, rx, ry, 0, -170).stroke('butt', 'term')], W); }
  { const W = capW(0.7), rx = W / 2 - a, ry = Math.min(rx, cap * 0.45), yc = b - ov + ry;
    def('U', ['s', 's'], [pb(a, cap).L(a, yc).arc(W / 2, yc, rx, ry, 180, 360).L(W - a, cap).stroke('butt', 'butt')], W); }

  const sShape = (W: number, H: number): Stroke => {
    const X = (u: number) => a + u * (W - 2 * a);
    const Y = (u: number) => b - ov + u * (H + 2 * ov - 2 * b);
    const P = (u: number, v: number): V => [X(u), Y(v)];
    return pb().herm([
      [P(0.97, 0.78), [-0.45, 0.89]],
      [P(0.5, 1), [-1, 0]],
      [P(0.03, 0.74), [0, -1]],
      [P(0.5, 0.5), [0.894, -0.447]],
      [P(0.97, 0.26), [0, -1]],
      [P(0.5, 0), [-1, 0]],
      [P(0.03, 0.22), [-0.3, 0.95]]
    ], 0.42).stroke();
  };
  { const W = capW(0.6); def('S', ['r', 'r'], [sShape(W, cap)], W); }

  /* ── Digits ────────────────────────────────────────────────────────────── */

  { const W = capW(0.62), rx = loopRx(W), ry = loopRy(cap + ov, -ov);
    def('0', ['r', 'r'], [ring(W / 2, cap / 2, rx, ry)], W); }
  { const fx = capW(0.2), xs = fx + a + 8, W = xs + a, fy = cap * 0.18, hd = hw(fx, fy);
    // the flag's flat top ends flush with the stem's right edge, however heavy the pen is
    def('1', ['o', 's'], [ln(xs, 0, xs, cap), ln(xs - fx, cap - fy, xs + a - hd / 2, cap, 'butt', 'hcut')], W); }
  { const W = capW(0.58), rx = W / 2 - a, ryT = cap * 0.26, cyT = cap + ov - b - ryT;
    const hd = hw(W * 0.7, cyT - ryT);
    def('2', ['r', 'o'], [pb().arc(W / 2, cyT, rx, ryT, 160, -40).L(hd / 2, 0).stroke('term', 'hcut'), ln(0, b, W, b)], W); }
  { const W = capW(0.58), ym = cap * 0.52;
    const ryT = (cap + ov - b - ym) / 2, cyT = ym + ryT, ryB = (ym - (b - ov)) / 2, cyB = b - ov + ryB;
    const rxT = W / 2 - a - cap * 0.02, rxB = W / 2 - a;
    def('3', ['r', 'r'], [
      pb().arc(W / 2, cyT, rxT, ryT, 155, -90).L(W / 2 - rxT * 0.45, ym).stroke('term', 'butt'),
      pb().arc(W / 2, cyB, rxB, ryB, 90, -155).stroke('butt', 'term')
    ], W); }
  { const W = capW(0.64), xs = W - a - cap * 0.09, yb = cap * 0.27, hd = hw(xs, cap - yb);
    // diagonal's flat top ends flush with the stem's right edge; the crossbar overhangs clearly
    def('4', ['d', 's'], [ln(xs, 0, xs, cap), ln(xs + a - hd / 2, cap, hd / 2, yb, 'hcut', 'butt'), ln(0, yb, W, yb)], W); }
  { const W = capW(0.58), htop = cap * 0.62, cyb = (htop + b - ov) / 2, ryb = (htop - (b - ov)) / 2, rxb = W / 2 - a;
    const ys = cyb + ryb * Math.sin(rad(140));
    def('5', ['s', 'r'], [
      pb(W, cap - b).L(a, cap - b).L(a, ys).stroke('butt', 'butt'),
      pb().arc(W / 2, cyb, rxb, ryb, 140, -150).stroke('butt', 'term')
    ], W); }
  const six = (() => {
    const W = capW(0.6), rx = loopRx(W), Ht = cap * 0.6;
    const ryl = (Ht + ov - 2 * b) / 2, cyl = (Ht - ov) / 2;
    const ryU = cap * 0.3, cyU = cap + ov - b - ryU;
    const g: GlyphDef = {
      skel: { strokes: [ring(W / 2, cyl, rx, ryl), pb(a, cyl).L(a, cyU).arc(W / 2, cyU, rx, ryU, 180, 48).stroke('butt', 'term')], dots: [] },
      edges: ['r', 'r'], w: W, cx: W / 2, top: cap
    };
    return g;
  })();
  defs['6'] = six;
  defs['9'] = rot180(six, cap / 2);
  { const W = capW(0.58), ym = cap * 0.535;
    const ryU = (cap + ov - b - ym) / 2, cyU = ym + ryU, ryL = (ym - (b - ov)) / 2, cyL = b - ov + ryL;
    def('8', ['r', 'r'], [ring(W / 2, cyU, W / 2 - a - cap * 0.03, ryU), ring(W / 2, cyL, W / 2 - a, ryL)], W); }
  { const W = capW(0.58), hd = hw(W * 0.7, cap);
    def('7', ['o', 'd'], [ln(0, cap - b, W, cap - b), ln(W - hd / 2, cap, W * 0.28, 0, 'hcut', 'hcut')], W); }

  /* ── Lowercase ─────────────────────────────────────────────────────────── */

  const lcRing = (W: number) => ring(W / 2, xh / 2, loopRx(W), loopRy(xh + ov, -ov));
  { const W = lcW(0.92); def('o', ['r', 'r'], [lcRing(W)], W, { top: xh }); }
  { const W = lcW(0.84), rx = loopRx(W), ry = loopRy(xh + ov, -ov);
    def('c', ['r', 'o'], [pb().arc(W / 2, xh / 2, rx, ry, 40, 320).stroke()], W, { top: xh }); }
  { const W = lcW(0.88), rx = loopRx(W), ry = loopRy(xh + ov, -ov);
    def('e', ['r', 'r'], [pb(a, xh / 2).L(W - a, xh / 2).arc(W / 2, xh / 2, rx, ry, 0, 320).stroke('butt', 'term')], W, { top: xh }); }
  { const W = lcW(0.88);
    def('a', ['r', 's'], [lcRing(W), ln(W - a, 0, W - a, xh)], W, { top: xh }); }
  const dChar: GlyphDef = (() => {
    const W = lcW(0.88);
    return { skel: { strokes: [lcRing(W), ln(W - a, 0, W - a, asc)], dots: [] }, edges: ['r', 's'], w: W, cx: W / 2, top: asc } as GlyphDef;
  })();
  defs['d'] = dChar;
  defs['b'] = flipX(dChar);
  const pChar: GlyphDef = (() => {
    const W = lcW(0.88);
    return { skel: { strokes: [lcRing(W), ln(a, -desc, a, xh)], dots: [] }, edges: ['s', 'r'], w: W, cx: W / 2, top: xh } as GlyphDef;
  })();
  defs['p'] = pChar;
  defs['q'] = flipX(pChar);
  { const W = lcW(0.88), ryg = desc * 0.55, ycg = -desc + b + ryg, rx = (W - 2 * a) / 2;
    def('g', ['r', 's'], [lcRing(W), pb(W - a, xh).L(W - a, ycg).arc(W / 2, ycg, rx, ryg, 0, -160).stroke('butt', 'term')], W, { top: xh }); }
  { const xs = a + xh * 0.18, rx = xh * 0.26, cy = asc + ov - b - rx;
    def('f', ['o', 'o'], [pb(xs, 0).L(xs, cy).arc(xs + rx, cy, rx, rx, 180, 60).stroke('butt', 'term'), ln(0, xh - b, xs + rx * 0.9, xh - b)], xs + rx * 1.4, { top: asc }); }
  { const xs = a + xh * 0.16, rx = xh * 0.2, ry = xh * 0.2, cy = b - ov + ry;
    def('t', ['o', 'o'], [pb(xs, asc * 0.88).L(xs, cy).arc(xs + rx, cy, rx, ry, 180, 315).stroke('butt', 'term'), ln(0, xh - b, xs + rx, xh - b)], xs + rx + a, { top: asc * 0.88 }); }
  def('i', ['s', 's'], [ln(a, 0, a, xh)], stem, { dots: [{ x: a, y: dotY, r: rd }], cx: a, top: xh });
  { const rx = xh * 0.2, xj = a + rx, ry = desc * 0.5, cy = -desc + b + ry;
    def('j', ['o', 's'], [pb(xj, xh).L(xj, cy).arc(xj - rx, cy, rx, ry, 0, -165).stroke('butt', 'term')], xj + a, { dots: [{ x: xj, y: dotY, r: rd }], cx: xj, top: xh }); }
  def('l', ['s', 's'], [ln(a, 0, a, asc)], stem, { top: asc });
  { const W = lcW(0.82), hd1 = hw(W - a, xh * 0.64), yk = xh * 0.36;
    const xe = W - hd1 / 2, t = 0.55, kx = a + (xe - a) * t, ky = yk + (xh - yk) * t;
    def('k', ['s', 'd'], [ln(a, 0, a, asc), ln(a, yk, xe, xh, 'butt', 'hcut'), ln(kx, ky, W - hw(W - kx, ky) / 2, 0, 'butt', 'hcut')], W, { top: asc }); }

  const archY = () => {
    const cy = xh * 0.52;
    return { cy, ry: xh + ov - b - cy };
  };
  { const W = lcW(0.88), { cy, ry } = archY(), rx = W / 2 - a;
    def('n', ['s', 's'], [ln(a, 0, a, xh), pb(a, cy).arc(W / 2, cy, rx, ry, 180, 0).L(W - a, 0).stroke('butt', 'butt')], W, { top: xh });
    def('h', ['s', 's'], [ln(a, 0, a, asc), pb(a, cy).arc(W / 2, cy, rx, ry, 180, 0).L(W - a, 0).stroke('butt', 'butt')], W, { top: asc }); }
  { const W = lcW(1.4), { cy, ry } = archY(), xm = W / 2, rx = (xm - a) / 2;
    def('m', ['s', 's'], [
      ln(a, 0, a, xh),
      pb(a, cy).arc(a + rx, cy, rx, ry, 180, 0).L(xm, 0).stroke('butt', 'butt'),
      pb(xm, cy).arc(xm + rx, cy, rx, ry, 180, 0).L(W - a, 0).stroke('butt', 'butt')
    ], W, { top: xh }); }
  { const W = lcW(0.6), { cy, ry } = archY(), rx = xh * 0.3;
    def('r', ['s', 'o'], [ln(a, 0, a, xh), pb(a, cy).arc(a + rx, cy, rx, ry, 180, 55).stroke('butt', 'term')], W, { top: xh }); }
  { const W = lcW(0.88), rx = W / 2 - a, ry = Math.min(rx, xh * 0.45), yc = b - ov + ry;
    def('u', ['s', 's'], [pb(a, xh).L(a, yc).arc(W / 2, yc, rx, ry, 180, 360).stroke('butt', 'butt'), ln(W - a, xh, W - a, 0)], W, { top: xh }); }
  { const W = lcW(0.8), hd = hw(W / 2, xh);
    def('v', ['d', 'd'], [ln(hd / 2, xh, W / 2, 0, 'hcut', 'hcut'), ln(W / 2, 0, W - hd / 2, xh, 'hcut', 'hcut')], W, { top: xh }); }
  { const W = lcW(1.2), hd = hw(W / 4, xh);
    def('w', ['d', 'd'], [
      ln(hd / 2, xh, W * 0.27, 0, 'hcut', 'hcut'), ln(W * 0.27, 0, W / 2, xh, 'hcut', 'hcut'),
      ln(W / 2, xh, W * 0.73, 0, 'hcut', 'hcut'), ln(W * 0.73, 0, W - hd / 2, xh, 'hcut', 'hcut')
    ], W, { top: xh }); }
  { const W = lcW(0.8), hd = hw(W, xh);
    def('x', ['d', 'd'], [ln(hd / 2, xh, W - hd / 2, 0, 'hcut', 'hcut'), ln(W - hd / 2, xh, hd / 2, 0, 'hcut', 'hcut')], W, { top: xh }); }
  { const W = lcW(0.8), hd = hw(W * 0.5, xh + desc);
    const P0: V = [W - hd / 2, xh], P1: V = [W * 0.12 + hd / 2, -desc];
    const xon = P0[0] + (P1[0] - P0[0]) * (xh / (xh + desc));
    def('y', ['d', 'd'], [ln(P0[0], P0[1], P1[0], P1[1], 'hcut', 'hcut'), ln(hd / 2, xh, xon, 0, 'hcut', 'butt')], W, { top: xh }); }
  { const W = lcW(0.76), hd = hw(W, xh);
    def('z', ['o', 'o'], [ln(0, xh - b, W, xh - b), ln(0, b, W, b), ln(W - hd / 2, xh, hd / 2, 0, 'hcut', 'hcut')], W, { top: xh }); }
  { const W = lcW(0.78); def('s', ['r', 'r'], [sShape(W, xh)], W, { top: xh }); }

  /* ß: stem with rounded top, small upper bowl and a larger lower bowl that closes on the stem */
  { const ru = (asc - 2 * b) * 0.23, ymid = asc + ov - b - 2 * ru;
    const xr = a + ru * 2 + 30;
    def('ß', ['s', 'r'], [
      ln(a, 0, a, asc - ru - 20),
      pb(a, asc + ov - b - ru).arc(a + ru, asc + ov - b - ru, ru, ru, 180, -90).L(a, ymid).stroke('butt', 'butt'),
      bowl(ymid, b, xr)
    ], xr + a, { top: asc });
  }

  /* ── Punctuation ───────────────────────────────────────────────────────── */

  const sqDot = (x: number, y: number): Dot => ({ x, y, r: rd });
  def('.', ['s', 's'], [], rd * 2, { dots: [sqDot(rd, rd)], top: rd * 2 });
  { const tail = (x: number, y: number) => ln(x, y, x - stem * 0.5, y - stem * 2.2, 'butt', 'hcut');
    def(',', ['s', 's'], [tail(rd, rd * 0.8)], rd * 2, { dots: [sqDot(rd, rd)], top: rd * 2 });
    def('’', ['s', 's'], [tail(rd, cap - rd * 0.8)], rd * 2, { dots: [sqDot(rd, cap - rd)], top: cap });
    def(';', ['s', 's'], [tail(rd, rd * 0.8)], rd * 2, { dots: [sqDot(rd, rd), sqDot(rd, xh - rd)], top: xh }); }
  def(':', ['s', 's'], [], rd * 2, { dots: [sqDot(rd, rd), sqDot(rd, xh - rd)], top: xh });
  def('!', ['s', 's'], [ln(rd, cap, rd, cap * 0.27)], rd * 2, { dots: [sqDot(rd, rd)] });
  { const W = capW(0.5), rx = W / 2 - a, ry = cap * 0.2, cy = cap + ov - b - ry;
    const E: V = [W / 2 + rx * Math.cos(rad(-55)), cy + ry * Math.sin(rad(-55))];
    const t: V = [Math.sin(rad(-55)), -Math.cos(rad(-55))];
    const q: V = [W / 2, cap * 0.3];
    def('?', ['r', 'o'], [pb().arc(W / 2, cy, rx, ry, 165, -55).herm([[E, t], [q, [0, -1]]], 0.45).stroke('term', 'butt')], W, { dots: [sqDot(W / 2, rd)] }); }
  { const W = capW(0.34); def('-', ['o', 'o'], [ln(0, cap * 0.36, W, cap * 0.36)], W, { top: cap * 0.4 }); }
  { const W = capW(0.6); def('–', ['o', 'o'], [ln(0, cap * 0.36, W, cap * 0.36)], W, { top: cap * 0.4 }); }
  { const W = capW(0.7); def('_', ['o', 'o'], [ln(0, -cap * 0.12, W, -cap * 0.12)], W, { top: 0 }); }
  def("'", ['s', 's'], [ln(a, cap, a, cap * 0.72)], stem, { top: cap });
  def('"', ['s', 's'], [ln(a, cap, a, cap * 0.72), ln(a + stem * 1.9, cap, a + stem * 1.9, cap * 0.72)], stem * 2.9, { top: cap });
  { const W = capW(0.6), ym = cap * 0.36;
    def('+', ['o', 'o'], [ln(0, ym, W, ym), ln(W / 2, ym - W / 2, W / 2, ym + W / 2)], W, { top: ym + W / 2 });
    def('=', ['o', 'o'], [ln(0, ym - cap * 0.1, W, ym - cap * 0.1), ln(0, ym + cap * 0.1, W, ym + cap * 0.1)], W, { top: ym + cap * 0.1 }); }
  { const W = capW(0.42), hd = hw(W, cap * 1.1);
    def('/', ['d', 'd'], [ln(hd / 2, -cap * 0.1, W - hd / 2, cap, 'hcut', 'hcut')], W); }
  { const top = cap * 0.86, bot = -desc * 0.95, ry = (top - bot) / 2, rx = cap * 0.28;
    def('(', ['r', 'o'], [pb().arc(rx + a, (top + bot) / 2, rx, ry, 122, 238).stroke('butt', 'butt')], rx * 0.6 + 2 * a, { top });
    defs[')'] = flipX(defs['(']); }
  { const W = capW(0.3), top = cap * 0.88, bot = -desc * 0.95;
    def('[', ['s', 'o'], [ln(a, bot, a, top), ln(a, top - b, W, top - b), ln(a, bot + b, W, bot + b)], W, { top });
    defs[']'] = flipX(defs['[']); }

  /* ── Accents ───────────────────────────────────────────────────────────── */

  const dotless = defs['i'].skel.strokes;
  defs['ı'] = { ...defs['i'], skel: { strokes: dotless, dots: [] } };

  const markGap = 34 + stem * 0.28;
  const mark = (kind: 'dieresis' | 'acute' | 'grave' | 'circ', cx: number, top: number, w: number): Skel => {
    const y0 = top + markGap, hM = 105 + stem * 0.55, wM = 80 + stem * 0.5;
    if (kind === 'dieresis') {
      const dx = Math.max(rd * 2.1, w * 0.19), yy = top + dotGap + rd;
      return { strokes: [], dots: [{ x: cx - dx, y: yy, r: rd }, { x: cx + dx, y: yy, r: rd }] };
    }
    if (kind === 'acute') return { strokes: [ln(cx - wM / 2, y0, cx + wM / 2, y0 + hM)], dots: [] };
    if (kind === 'grave') return { strokes: [ln(cx + wM / 2, y0, cx - wM / 2, y0 + hM)], dots: [] };
    return { strokes: [pb(cx - wM * 0.85, y0).L(cx, y0 + hM * 0.95).L(cx + wM * 0.85, y0).stroke('butt', 'butt')], dots: [] };
  };

  const compose = (ch: string, baseCh: string, kind: 'dieresis' | 'acute' | 'grave' | 'circ') => {
    const base = defs[baseCh];
    if (!base) return;
    const mk = mark(kind, base.cx, base.top, base.w);
    defs[ch] = {
      ...base,
      skel: { strokes: [...base.skel.strokes, ...mk.strokes], dots: [...base.skel.dots, ...mk.dots] }
    };
  };

  const table: [string, string, 'dieresis' | 'acute' | 'grave' | 'circ'][] = [];
  const vowelsLower = 'aeiou', vowelsUpper = 'AEIOU';
  const acute = 'áéíóú', grave = 'àèìòù', circ = 'âêîôû', dier = 'äëïöü';
  for (let i = 0; i < 5; i++) {
    const lo = i === 2 ? 'ı' : vowelsLower[i];
    table.push([acute[i], lo, 'acute'], [grave[i], lo, 'grave'], [circ[i], lo, 'circ'], [dier[i], lo, 'dieresis']);
    table.push(['ÁÉÍÓÚ'[i], vowelsUpper[i], 'acute'], ['ÀÈÌÒÙ'[i], vowelsUpper[i], 'grave'], ['ÂÊÎÔÛ'[i], vowelsUpper[i], 'circ'], ['ÄËÏÖÜ'[i], vowelsUpper[i], 'dieresis']);
  }
  table.push(['ÿ', 'y', 'dieresis']);
  for (const [ch, base, kind] of table) compose(ch, base, kind);

  const cedilla = (ch: string, baseCh: string) => {
    const base = defs[baseCh];
    const x = base.w * 0.52;
    defs[ch] = { ...base, skel: { strokes: [...base.skel.strokes, ln(x, -b * 0.4, x - stem * 0.2, -stem * 1.5, 'butt', 'hcut')], dots: base.skel.dots } };
  };
  cedilla('ç', 'c');
  cedilla('Ç', 'C');

  return defs;
}
