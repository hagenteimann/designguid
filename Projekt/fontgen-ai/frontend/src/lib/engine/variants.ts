import { FontParams, sanitizeParams } from './params';

export type StyleKey = 'regular' | 'bold' | 'italic' | 'boldItalic';

export const STYLE_KEYS: StyleKey[] = ['regular', 'bold', 'italic', 'boldItalic'];

export const STYLE_LABEL: Record<StyleKey, string> = {
  regular: 'Regular',
  bold: 'Bold',
  italic: 'Italic',
  boldItalic: 'Bold Italic'
};

export const isBold = (s: StyleKey) => s === 'bold' || s === 'boldItalic';
export const isItalic = (s: StyleKey) => s === 'italic' || s === 'boldItalic';

const ITALIC_SLANT = 11;

/**
 * Derives the other styles of a family from its Regular parameters:
 * Bold adds stem weight (slightly wider, a bit tighter, lower contrast so the thin strokes survive),
 * Italic slants the letters and narrows them a little.
 */
export function variantOf(base: FontParams, style: StyleKey): FontParams {
  const p = { ...base };
  if (isBold(style)) {
    const w = base.weight;
    p.weight = Math.min(950, w < 500 ? w + 280 : w < 750 ? w + 210 : w + 100);
    p.width = base.width * 1.03;
    p.spacing = base.spacing * 0.97;
    p.contrast = base.contrast * 0.8;
  }
  if (isItalic(style)) {
    p.slant = Math.max(base.slant, ITALIC_SLANT);
    p.width = p.width * 0.95;
  }
  return sanitizeParams(p, base);
}
