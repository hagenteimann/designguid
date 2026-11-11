import opentype from 'opentype.js';
import { Contour, bounds, normalizeWinding, parsePath, transformContours } from './svgPath';

export const UNITS_PER_EM = 1000;
export const ASCENDER = 800;
export const DESCENDER = -200;
export const CAP_HEIGHT = 700;
const LOWERCASE_SCALE = 0.7;

export interface RawGlyph {
  paths: string[];
  width: number;
}

export interface BuiltGlyph {
  char: string;
  unicode: number;
  width: number;
  contours: Contour[];
  derived: boolean;
}

export interface BuildResult {
  buffer: ArrayBuffer;
  glyphs: BuiltGlyph[];
  missing: string[];
  outOfBounds: string[];
}

function toOpentypePath(contours: Contour[]): opentype.Path {
  const path = new opentype.Path();
  for (const c of contours) {
    path.moveTo(c.sx, c.sy);
    for (const s of c.segs) {
      if (s.t === 'L') path.lineTo(s.x, s.y);
      else if (s.t === 'Q') path.quadraticCurveTo(s.x1, s.y1, s.x, s.y);
      else path.curveTo(s.x1, s.y1, s.x2, s.y2, s.x, s.y);
    }
    path.close();
  }
  return path;
}

export function buildFont(
  raw: Record<string, RawGlyph>,
  familyName: string,
  requiredChars: string
): BuildResult {
  const glyphs: BuiltGlyph[] = [];
  const missing: string[] = [];
  const outOfBounds: string[] = [];
  const byChar = new Map<string, BuiltGlyph>();

  for (const [char, g] of Object.entries(raw)) {
    if ([...char].length !== 1) continue;
    const parsed = (g.paths ?? []).flatMap(p => (typeof p === 'string' ? parsePath(p) : []));
    if (parsed.length === 0) continue;
    const width = Math.min(1200, Math.max(200, Math.round(Number(g.width) || 600)));
    const built: BuiltGlyph = {
      char,
      unicode: char.codePointAt(0)!,
      width,
      contours: normalizeWinding(parsed),
      derived: false
    };
    byChar.set(char, built);
    const b = bounds(built.contours);
    if (b && (b.yMin < DESCENDER - 100 || b.yMax > ASCENDER + 150)) outOfBounds.push(char);
  }

  // Lowercase fallback: scaled uppercase (small-cap style) when the model returned none.
  for (const upper of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    const lower = upper.toLowerCase();
    const base = byChar.get(upper);
    if (!base || byChar.has(lower)) continue;
    byChar.set(lower, {
      char: lower,
      unicode: lower.codePointAt(0)!,
      width: Math.round(base.width * LOWERCASE_SCALE),
      contours: transformContours(base.contours, LOWERCASE_SCALE, LOWERCASE_SCALE),
      derived: true
    });
  }

  for (const ch of requiredChars) if (!byChar.has(ch)) missing.push(ch);

  const ordered = [...byChar.values()].sort((a, b) => a.unicode - b.unicode);
  glyphs.push(...ordered);

  const notdefPath = new opentype.Path();
  notdefPath.moveTo(80, 0); notdefPath.lineTo(80, CAP_HEIGHT); notdefPath.lineTo(520, CAP_HEIGHT); notdefPath.lineTo(520, 0); notdefPath.close();
  notdefPath.moveTo(140, 60); notdefPath.lineTo(460, 60); notdefPath.lineTo(460, CAP_HEIGHT - 60); notdefPath.lineTo(140, CAP_HEIGHT - 60); notdefPath.close();

  const otGlyphs = [
    new opentype.Glyph({ name: '.notdef', unicode: 0, advanceWidth: 600, path: notdefPath }),
    new opentype.Glyph({ name: 'space', unicode: 32, advanceWidth: 300, path: new opentype.Path() }),
    ...ordered.map(g => new opentype.Glyph({
      name: `uni${g.unicode.toString(16).toUpperCase().padStart(4, '0')}`,
      unicode: g.unicode,
      advanceWidth: g.width,
      path: toOpentypePath(g.contours)
    }))
  ];

  const font = new opentype.Font({
    familyName,
    styleName: 'Regular',
    unitsPerEm: UNITS_PER_EM,
    ascender: ASCENDER,
    descender: DESCENDER,
    glyphs: otGlyphs
  });

  return { buffer: font.toArrayBuffer(), glyphs, missing, outOfBounds };
}

export function parseFont(buffer: ArrayBuffer): opentype.Font {
  return opentype.parse(buffer);
}
