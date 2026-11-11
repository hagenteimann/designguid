import opentype from 'opentype.js';
import { BuiltGlyph } from './engine/build';
import { Contour } from './engine/contour';
import { UPM } from './engine/params';

function toPath(contours: Contour[]): opentype.Path {
  const path = new opentype.Path();
  for (const c of contours) {
    path.moveTo(c.sx, c.sy);
    for (const s of c.segs) {
      if (s.t === 'L') path.lineTo(s.x, s.y);
      else path.curveTo(s.x1, s.y1, s.x2, s.y2, s.x, s.y);
    }
    path.close();
  }
  return path;
}

export function assembleFont(glyphs: BuiltGlyph[], spaceAdvance: number, familyName: string, ascender: number, descender: number): ArrayBuffer {
  const notdef = new opentype.Path();
  notdef.moveTo(80, 0); notdef.lineTo(80, 700); notdef.lineTo(520, 700); notdef.lineTo(520, 0); notdef.close();
  notdef.moveTo(140, 60); notdef.lineTo(460, 60); notdef.lineTo(460, 640); notdef.lineTo(140, 640); notdef.close();

  const otGlyphs = [
    new opentype.Glyph({ name: '.notdef', unicode: 0, advanceWidth: 600, path: notdef }),
    new opentype.Glyph({ name: 'space', unicode: 32, advanceWidth: spaceAdvance, path: new opentype.Path() }),
    ...glyphs.map(g => new opentype.Glyph({
      name: `uni${g.unicode.toString(16).toUpperCase().padStart(4, '0')}`,
      unicode: g.unicode,
      advanceWidth: g.advance,
      path: toPath(g.contours)
    }))
  ];

  const font = new opentype.Font({
    familyName,
    styleName: 'Regular',
    unitsPerEm: UPM,
    ascender,
    descender,
    glyphs: otGlyphs
  });
  return font.toArrayBuffer();
}

export function parseFont(buffer: ArrayBuffer): opentype.Font {
  return opentype.parse(buffer);
}
