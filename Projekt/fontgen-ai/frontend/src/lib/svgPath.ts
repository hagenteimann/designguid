export type Seg =
  | { t: 'L'; x: number; y: number }
  | { t: 'Q'; x1: number; y1: number; x: number; y: number }
  | { t: 'C'; x1: number; y1: number; x2: number; y2: number; x: number; y: number };

export interface Contour {
  sx: number;
  sy: number;
  segs: Seg[];
}

const TOKEN = /[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;
const ARGS: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };

/** Parse SVG path data (absolute + relative commands) into closed contours. Arcs degrade to lines. */
export function parsePath(d: string): Contour[] {
  const tokens = d.match(TOKEN) ?? [];
  const contours: Contour[] = [];
  let cur: Contour | null = null;
  let x = 0, y = 0, sx = 0, sy = 0;
  let lcx = 0, lcy = 0;
  let lastCmd = '';
  let i = 0;
  let cmd = '';

  const num = () => parseFloat(tokens[i++]);
  const finish = () => { if (cur && cur.segs.length > 0) contours.push(cur); cur = null; };
  const begin = (px: number, py: number) => { finish(); cur = { sx: px, sy: py, segs: [] }; sx = px; sy = py; };

  while (i < tokens.length) {
    if (/^[a-zA-Z]$/.test(tokens[i])) cmd = tokens[i++];
    else if (!cmd) { i++; continue; }
    const lower = cmd.toLowerCase();
    const rel = cmd === lower;
    if (!(lower in ARGS)) { i++; continue; }

    if (lower === 'z') {
      finish();
      x = sx; y = sy;
      lastCmd = 'z';
      cmd = '';
      continue;
    }
    if (i + ARGS[lower] > tokens.length) break;
    const ox = rel ? x : 0, oy = rel ? y : 0;

    switch (lower) {
      case 'm': {
        const nx = num() + ox, ny = num() + oy;
        begin(nx, ny); x = nx; y = ny;
        cmd = rel ? 'l' : 'L';
        break;
      }
      case 'l': {
        const nx = num() + ox, ny = num() + oy;
        if (!cur) begin(x, y);
        cur!.segs.push({ t: 'L', x: nx, y: ny }); x = nx; y = ny;
        break;
      }
      case 'h': {
        const nx = num() + ox;
        if (!cur) begin(x, y);
        cur!.segs.push({ t: 'L', x: nx, y }); x = nx;
        break;
      }
      case 'v': {
        const ny = num() + oy;
        if (!cur) begin(x, y);
        cur!.segs.push({ t: 'L', x, y: ny }); y = ny;
        break;
      }
      case 'c': {
        const x1 = num() + ox, y1 = num() + oy, x2 = num() + ox, y2 = num() + oy, nx = num() + ox, ny = num() + oy;
        if (!cur) begin(x, y);
        cur!.segs.push({ t: 'C', x1, y1, x2, y2, x: nx, y: ny });
        lcx = x2; lcy = y2; x = nx; y = ny;
        break;
      }
      case 's': {
        const x2 = num() + ox, y2 = num() + oy, nx = num() + ox, ny = num() + oy;
        const prevCurve = lastCmd === 'c' || lastCmd === 's';
        const x1 = prevCurve ? 2 * x - lcx : x, y1 = prevCurve ? 2 * y - lcy : y;
        if (!cur) begin(x, y);
        cur!.segs.push({ t: 'C', x1, y1, x2, y2, x: nx, y: ny });
        lcx = x2; lcy = y2; x = nx; y = ny;
        break;
      }
      case 'q': {
        const x1 = num() + ox, y1 = num() + oy, nx = num() + ox, ny = num() + oy;
        if (!cur) begin(x, y);
        cur!.segs.push({ t: 'Q', x1, y1, x: nx, y: ny });
        lcx = x1; lcy = y1; x = nx; y = ny;
        break;
      }
      case 't': {
        const nx = num() + ox, ny = num() + oy;
        const prevQuad = lastCmd === 'q' || lastCmd === 't';
        const x1 = prevQuad ? 2 * x - lcx : x, y1 = prevQuad ? 2 * y - lcy : y;
        if (!cur) begin(x, y);
        cur!.segs.push({ t: 'Q', x1, y1, x: nx, y: ny });
        lcx = x1; lcy = y1; x = nx; y = ny;
        break;
      }
      case 'a': {
        i += 5;
        const nx = num() + ox, ny = num() + oy;
        if (!cur) begin(x, y);
        cur!.segs.push({ t: 'L', x: nx, y: ny }); x = nx; y = ny;
        break;
      }
    }
    lastCmd = lower;
  }
  finish();
  return contours.filter(c => c.segs.every(s => isFinite(s.x) && isFinite(s.y)));
}

export function transformContours(cs: Contour[], sx: number, sy: number, dx = 0, dy = 0): Contour[] {
  const tx = (v: number) => v * sx + dx;
  const ty = (v: number) => v * sy + dy;
  return cs.map(c => ({
    sx: tx(c.sx),
    sy: ty(c.sy),
    segs: c.segs.map((s): Seg => {
      if (s.t === 'L') return { t: 'L', x: tx(s.x), y: ty(s.y) };
      if (s.t === 'Q') return { t: 'Q', x1: tx(s.x1), y1: ty(s.y1), x: tx(s.x), y: ty(s.y) };
      return { t: 'C', x1: tx(s.x1), y1: ty(s.y1), x2: tx(s.x2), y2: ty(s.y2), x: tx(s.x), y: ty(s.y) };
    })
  }));
}

function points(c: Contour): [number, number][] {
  const pts: [number, number][] = [[c.sx, c.sy]];
  for (const s of c.segs) pts.push([s.x, s.y]);
  return pts;
}

function signedArea(c: Contour): number {
  const p = points(c);
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % p.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

function pointInPolygon(px: number, py: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function reverse(c: Contour): Contour {
  const last = c.segs[c.segs.length - 1];
  const segs: Seg[] = [];
  let prevX = c.sx, prevY = c.sy;
  const starts: [number, number][] = [[c.sx, c.sy]];
  for (const s of c.segs) starts.push([s.x, s.y]);
  for (let i = c.segs.length - 1; i >= 0; i--) {
    const s = c.segs[i];
    [prevX, prevY] = starts[i];
    if (s.t === 'L') segs.push({ t: 'L', x: prevX, y: prevY });
    else if (s.t === 'Q') segs.push({ t: 'Q', x1: s.x1, y1: s.y1, x: prevX, y: prevY });
    else segs.push({ t: 'C', x1: s.x2, y1: s.y2, x2: s.x1, y2: s.y1, x: prevX, y: prevY });
  }
  return { sx: last.x, sy: last.y, segs };
}

/**
 * Enforce font winding: outer contours clockwise, counters (nested contours) counter-clockwise,
 * so the nonzero fill rule renders holes in letters like O, A, B correctly.
 */
export function normalizeWinding(cs: Contour[]): Contour[] {
  const polys = cs.map(points);
  return cs.map((c, i) => {
    const area = signedArea(c);
    if (area === 0) return c;
    const [px, py] = polys[i][0];
    let depth = 0;
    polys.forEach((poly, j) => { if (j !== i && pointInPolygon(px, py, poly)) depth++; });
    const wantClockwise = depth % 2 === 0;
    const isClockwise = area < 0;
    return wantClockwise === isClockwise ? c : reverse(c);
  });
}

export function bounds(cs: Contour[]): { xMin: number; yMin: number; xMax: number; yMax: number } | null {
  let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
  for (const c of cs) {
    for (const [x, y] of points(c)) {
      xMin = Math.min(xMin, x); xMax = Math.max(xMax, x);
      yMin = Math.min(yMin, y); yMax = Math.max(yMax, y);
    }
  }
  return xMin === Infinity ? null : { xMin, yMin, xMax, yMax };
}
