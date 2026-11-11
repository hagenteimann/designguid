export type Seg =
  | { t: 'L'; x: number; y: number }
  | { t: 'C'; x1: number; y1: number; x2: number; y2: number; x: number; y: number };

export interface Contour {
  sx: number;
  sy: number;
  segs: Seg[];
}

export interface Box {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
}

type P = [number, number];

function flatten(c: Contour, steps = 12): P[] {
  const pts: P[] = [[c.sx, c.sy]];
  let cx = c.sx, cy = c.sy;
  for (const s of c.segs) {
    if (s.t === 'L') {
      pts.push([s.x, s.y]);
    } else {
      for (let i = 1; i <= steps; i++) {
        const t = i / steps, m = 1 - t;
        pts.push([
          m * m * m * cx + 3 * m * m * t * s.x1 + 3 * m * t * t * s.x2 + t * t * t * s.x,
          m * m * m * cy + 3 * m * m * t * s.y1 + 3 * m * t * t * s.y2 + t * t * t * s.y
        ]);
      }
    }
    cx = s.x; cy = s.y;
  }
  return pts;
}

/** Signed area (positive = counter-clockwise in a y-up coordinate system). */
export function area(c: Contour): number {
  const p = flatten(c);
  let a = 0;
  for (let i = 0; i < p.length; i++) {
    const [x1, y1] = p[i];
    const [x2, y2] = p[(i + 1) % p.length];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}

export function bounds(cs: Contour[]): Box | null {
  let xMin = Infinity, yMin = Infinity, xMax = -Infinity, yMax = -Infinity;
  for (const c of cs) {
    for (const [x, y] of flatten(c, 24)) {
      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
  }
  return xMin === Infinity ? null : { xMin, yMin, xMax, yMax };
}

export function mapContours(cs: Contour[], f: (x: number, y: number) => [number, number]): Contour[] {
  return cs.map(c => {
    const [sx, sy] = f(c.sx, c.sy);
    return {
      sx,
      sy,
      segs: c.segs.map((s): Seg => {
        if (s.t === 'L') {
          const [x, y] = f(s.x, s.y);
          return { t: 'L', x, y };
        }
        const [x1, y1] = f(s.x1, s.y1);
        const [x2, y2] = f(s.x2, s.y2);
        const [x, y] = f(s.x, s.y);
        return { t: 'C', x1, y1, x2, y2, x, y };
      })
    };
  });
}

export function reverseContour(c: Contour): Contour {
  const starts: P[] = [[c.sx, c.sy]];
  for (const s of c.segs) starts.push([s.x, s.y]);
  const last = c.segs[c.segs.length - 1];
  const segs: Seg[] = [];
  for (let i = c.segs.length - 1; i >= 0; i--) {
    const s = c.segs[i];
    const [px, py] = starts[i];
    segs.push(s.t === 'L'
      ? { t: 'L', x: px, y: py }
      : { t: 'C', x1: s.x2, y1: s.y2, x2: s.x1, y2: s.y1, x: px, y: py });
  }
  return { sx: last.x, sy: last.y, segs };
}
