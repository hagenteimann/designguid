import opentype from 'opentype.js';
import { BuiltGlyph } from './engine/build';
import { Contour } from './engine/contour';
import { UPM } from './engine/params';
import { STYLE_LABEL, StyleKey, isBold, isItalic } from './engine/variants';

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

export interface StyleMeta {
  key: StyleKey;
  weight: number;
  slant: number;
}

const FS_ITALIC = 0x001, FS_BOLD = 0x020, FS_REGULAR = 0x040;

function checksum(view: DataView, start: number, length: number): number {
  let sum = 0;
  const end = start + Math.ceil(length / 4) * 4;
  for (let i = start; i < end; i += 4) {
    const word = i + 4 <= view.byteLength ? view.getUint32(i) : 0;
    sum = (sum + word) >>> 0;
  }
  return sum;
}

/** opentype.js cannot set head.macStyle or post.italicAngle: patch them in and fix all checksums. */
function patchStyleBits(buffer: ArrayBuffer, bold: boolean, italic: boolean, italicAngle: number): ArrayBuffer {
  const out = buffer.slice(0);
  const view = new DataView(out);
  const numTables = view.getUint16(4);
  const tables: Record<string, { entry: number; offset: number; length: number }> = {};
  for (let i = 0; i < numTables; i++) {
    const entry = 12 + i * 16;
    const tag = String.fromCharCode(view.getUint8(entry), view.getUint8(entry + 1), view.getUint8(entry + 2), view.getUint8(entry + 3));
    tables[tag] = { entry, offset: view.getUint32(entry + 8), length: view.getUint32(entry + 12) };
  }
  const head = tables['head'], post = tables['post'];
  if (!head || !post) return buffer;

  view.setUint16(head.offset + 44, (bold ? 1 : 0) | (italic ? 2 : 0));
  view.setInt32(post.offset + 4, Math.round(-italicAngle * 65536));

  view.setUint32(head.offset + 8, 0);
  for (const t of [head, post]) view.setUint32(t.entry + 4, checksum(view, t.offset, t.length));
  view.setUint32(head.offset + 8, (0xb1b0afba - checksum(view, 0, out.byteLength)) >>> 0);
  return out;
}

export function assembleFont(glyphs: BuiltGlyph[], spaceAdvance: number, familyName: string, ascender: number, descender: number, style: StyleMeta = { key: 'regular', weight: 400, slant: 0 }): ArrayBuffer {
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

  const bold = isBold(style.key), italic = isItalic(style.key);
  const font = new opentype.Font({
    familyName,
    styleName: STYLE_LABEL[style.key],
    // opentype.js typings declare these as strings; the values are numbers at runtime
    weightClass: Math.min(900, Math.max(100, Math.round(style.weight / 100) * 100)) as unknown as string,
    fsSelection: ((bold ? FS_BOLD : 0) | (italic ? FS_ITALIC : 0) | (!bold && !italic ? FS_REGULAR : 0)) as unknown as string,
    unitsPerEm: UPM,
    ascender,
    descender,
    glyphs: otGlyphs
  });
  return patchStyleBits(font.toArrayBuffer(), bold, italic, italic ? style.slant : 0);
}

export function parseFont(buffer: ArrayBuffer): opentype.Font {
  return opentype.parse(buffer);
}
