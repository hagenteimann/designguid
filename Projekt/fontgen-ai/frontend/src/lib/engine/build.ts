import { Box, Contour, bounds, mapContours } from './contour';
import { buildDefs, Edge } from './glyphs';
import { FontParams, computeMetrics } from './params';
import { removeOverlaps } from './overlap';
import { dotContour, strokeToContours } from './stroker';

export interface BuiltGlyph {
  char: string;
  unicode: number;
  advance: number;
  contours: Contour[];
}

export interface GlyphSet {
  glyphs: BuiltGlyph[];
  spaceAdvance: number;
}

const EDGE_FACTOR: Record<Edge, number> = { s: 1, r: 0.62, d: 0.22, o: 0.12 };

export function buildGlyphs(p: FontParams, only?: string): GlyphSet {
  const m = computeMetrics(p);
  const defs = buildDefs({ m, squareness: p.squareness });
  const pen = { a: m.a, b: m.b };
  const square = p.terminal === 'flat';
  const shear = Math.tan((p.slant * Math.PI) / 180);
  const unit = (90 - m.stem * 0.15) * p.spacing;
  const monoAdvance = Math.round(600 * p.width);

  const wanted = only ? new Set([...only]) : null;
  const glyphs: BuiltGlyph[] = [];
  for (const [char, def] of Object.entries(defs)) {
    if (wanted && !wanted.has(char)) continue;
    let contours: Contour[] = def.skel.strokes.flatMap(s => strokeToContours(s, pen, { terminal: p.terminal }));
    for (const d of def.skel.dots) {
      const r = square ? d.r * 0.92 : d.r;
      contours.push(dotContour(d.x, d.y, r, r, square));
    }
    if (contours.length === 0) continue;
    contours = removeOverlaps(contours);
    if (contours.length === 0) continue;
    if (shear) contours = mapContours(contours, (x, y) => [x + y * shear, y]);

    let box = bounds(contours) as Box;
    let width = box.xMax - box.xMin;
    let advance: number;
    let shift: number;

    if (p.mono) {
      advance = monoAdvance;
      const room = advance - 70;
      if (width > room) {
        const k = room / width;
        contours = mapContours(contours, (x, y) => [box.xMin + (x - box.xMin) * k, y]);
        box = bounds(contours) as Box;
        width = box.xMax - box.xMin;
      }
      shift = (advance - width) / 2 - box.xMin;
    } else {
      const lsb = unit * EDGE_FACTOR[def.edges[0]];
      const rsb = unit * EDGE_FACTOR[def.edges[1]];
      advance = width + lsb + rsb;
      shift = lsb - box.xMin;
    }

    contours = mapContours(contours, (x, y) => [Math.round(x + shift), Math.round(y)]);
    glyphs.push({ char, unicode: char.codePointAt(0) as number, advance: Math.round(advance), contours });
  }

  return {
    glyphs: glyphs.sort((x, y) => x.unicode - y.unicode),
    spaceAdvance: p.mono ? monoAdvance : Math.round(m.cap * 0.36 * p.width)
  };
}
