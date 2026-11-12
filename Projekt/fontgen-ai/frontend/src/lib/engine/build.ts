import { Box, Contour, area, bounds, mapContours, reverseContour } from './contour';
import { buildDefs, Edge } from './glyphs';
import { FontParams, computeMetrics } from './params';
import { removeOverlaps } from './overlap';
import { roundCorners } from './rounding';
import { serifGeometry } from './serifs';
import { applyEdits } from './skeleton';
import { dotContour, strokeToContours } from './stroker';

export interface BuiltGlyph {
  char: string;
  unicode: number;
  advance: number;
  contours: Contour[];
  /** x offset that moved the outline from skeleton space to its final place (before slant) */
  shift: number;
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
  const unit = (90 - m.stem * 0.15) * p.spacing * (p.serif === 'none' ? 1 : 0.75);
  const monoAdvance = Math.round(600 * p.width);

  const wanted = only ? new Set([...only]) : null;
  const glyphs: BuiltGlyph[] = [];
  for (const [char, baseDef] of Object.entries(defs)) {
    if (wanted && !wanted.has(char)) continue;
    const def = p.edits?.[char] ? applyEdits(baseDef, p.edits[char]) : baseDef;
    const extra = p.serif !== 'none' && /[\p{L}\p{N}]/u.test(char) ? serifGeometry(def, m, p) : { strokes: [], polys: [] };
    let contours: Contour[] = [...def.skel.strokes, ...extra.strokes].flatMap(s => strokeToContours(s, pen, { terminal: p.terminal }));
    for (const poly of extra.polys) {
      const c: Contour = { sx: poly[0][0], sy: poly[0][1], segs: poly.slice(1).map(([x, y]) => ({ t: 'L' as const, x, y })) };
      contours.push(area(c) < 0 ? c : reverseContour(c));
    }
    for (const d of def.skel.dots) {
      const r = square ? d.r * 0.92 : d.r;
      contours.push(dotContour(d.x, d.y, r, r, square));
    }
    if (contours.length === 0) continue;
    const waxAmp = Math.min(p.wax * 0.11 * m.stem, 0.3 * m.hstem * (p.serif === 'hairline' ? 0.35 : 1));
    contours = removeOverlaps(contours, {
      wobble: p.wax > 0 ? { amp: waxAmp, wavelength: 2.6 * m.stem + 60, seed: char.codePointAt(0) as number } : undefined
    });
    const rounding = Math.max(p.corner, p.wax * 0.7);
    if (rounding > 0 || p.wax > 0) {
      const convex = rounding * (m.stem * 0.55 + 10);
      contours = roundCorners(contours, convex, Math.max(convex, p.wax * m.stem * 0.55));
    }
    if (contours.length === 0) continue;

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

    // Slant after spacing: the advance comes from the upright shape (as in real italics), the lean pivots around mid x-height
    const pivot = m.xh / 2;
    contours = mapContours(contours, (x, y) => [Math.round(x + shift + (y - pivot) * shear), Math.round(y)]);
    glyphs.push({ char, unicode: char.codePointAt(0) as number, advance: Math.round(advance), contours, shift });
  }

  return {
    glyphs: glyphs.sort((x, y) => x.unicode - y.unicode),
    spaceAdvance: p.mono ? monoAdvance : Math.round(m.cap * 0.36 * p.width)
  };
}
