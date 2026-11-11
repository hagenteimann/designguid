import { buildGlyphs } from './engine/build';
import { FontParams } from './engine/params';

const r1 = (n: number) => Math.round(n * 10) / 10;

/** SVG path data for a line of text, drawn straight from the engine (no font file needed). */
export function textPath(params: FontParams, text: string, size: number): { d: string; width: number; height: number } {
  const chars = [...new Set([...text].filter(c => c.trim()))].join('');
  const { glyphs, spaceAdvance } = buildGlyphs(params, chars);
  const byChar = new Map(glyphs.map(g => [g.char, g]));
  const k = size / 1000;
  const base = size * 0.82;
  let x = 0;
  let d = '';
  for (const ch of text) {
    if (ch === ' ') { x += spaceAdvance * k; continue; }
    const g = byChar.get(ch);
    if (!g) continue;
    const X = (v: number) => r1(x + v * k);
    const Y = (v: number) => r1(base - v * k);
    for (const c of g.contours) {
      d += `M${X(c.sx)} ${Y(c.sy)}`;
      for (const s of c.segs) {
        d += s.t === 'L' ? `L${X(s.x)} ${Y(s.y)}` : `C${X(s.x1)} ${Y(s.y1)} ${X(s.x2)} ${Y(s.y2)} ${X(s.x)} ${Y(s.y)}`;
      }
      d += 'Z';
    }
    x += g.advance * k;
  }
  return { d, width: Math.max(1, Math.ceil(x)), height: Math.ceil(size * 1.15) };
}
