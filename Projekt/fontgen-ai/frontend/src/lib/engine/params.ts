export interface FontParams {
  weight: number;
  width: number;
  xHeight: number;
  contrast: number;
  squareness: number;
  slant: number;
  spacing: number;
  terminal: 'flat' | 'round';
  mono: boolean;
  serif: SerifStyle;
  serifSize: number;
  corner: number;
  wax: number;
}

export type SerifStyle = 'none' | 'slab' | 'bracketed' | 'hairline';
export const SERIF_STYLES: SerifStyle[] = ['none', 'slab', 'bracketed', 'hairline'];

export const DEFAULT_PARAMS: FontParams = {
  weight: 400,
  width: 1,
  xHeight: 520,
  contrast: 0.12,
  squareness: 0.15,
  slant: 0,
  spacing: 1,
  terminal: 'flat',
  mono: false,
  serif: 'none',
  serifSize: 1,
  corner: 0,
  wax: 0
};

export interface ParamSpec {
  key: Exclude<keyof FontParams, 'terminal' | 'mono' | 'serif'>;
  label: string;
  min: number;
  max: number;
  step: number;
  hint: string;
}

export const PARAM_SPECS: ParamSpec[] = [
  { key: 'weight', label: 'Weight', min: 100, max: 1000, step: 10, hint: 'Stem thickness: 400 regular, 700 bold, 900+ ultra heavy' },
  { key: 'width', label: 'Width', min: 0.7, max: 1.6, step: 0.01, hint: 'Condensed ↔ extended letterforms' },
  { key: 'xHeight', label: 'x-height', min: 440, max: 640, step: 5, hint: 'Large x-height reads better at small sizes' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 0.6, step: 0.01, hint: '0 = monoline, higher = thinner horizontals' },
  { key: 'squareness', label: 'Squareness', min: 0, max: 1.5, step: 0.01, hint: '0 = circular, 1 = squarish, 1.5 = boxy / brutalist' },
  { key: 'slant', label: 'Slant', min: 0, max: 20, step: 0.5, hint: 'Oblique angle in degrees (Italic style uses at least 11°)' },
  { key: 'spacing', label: 'Spacing', min: 0.4, max: 1.5, step: 0.01, hint: 'Very tight (brutalist) ↔ loose text spacing' },
  { key: 'serifSize', label: 'Serif size', min: 0.4, max: 1.8, step: 0.05, hint: 'Length of serifs (needs a serif style)' },
  { key: 'corner', label: 'Corner rounding', min: 0, max: 1, step: 0.01, hint: '0 = sharp, 1 = fully rounded corners and stroke ends' },
  { key: 'wax', label: 'Wax', min: 0, max: 1, step: 0.01, hint: 'Soft, melted look: gooey joints and slightly lumpy, organic edges' }
];

const num = (v: unknown, min: number, max: number, fallback: number) => {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return typeof n === 'number' && isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

/** Validate untrusted values (e.g. from an LLM) and clamp them into the supported ranges. */
export function sanitizeParams(raw: unknown, base: FontParams = DEFAULT_PARAMS): FontParams {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const p: FontParams = { ...base };
  for (const s of PARAM_SPECS) p[s.key] = num(r[s.key], s.min, s.max, base[s.key]);
  if (r.terminal === 'flat' || r.terminal === 'round') p.terminal = r.terminal;
  if (typeof r.mono === 'boolean') p.mono = r.mono;
  if (SERIF_STYLES.includes(r.serif as SerifStyle)) p.serif = r.serif as SerifStyle;
  return p;
}

export interface DesignTokens {
  weight: 'light' | 'regular' | 'bold';
  contrast: 'low' | 'medium' | 'high';
  style: 'sans' | 'serif' | 'slab' | 'brutalist' | 'mono';
  mood: 'elegant' | 'playful' | 'technical';
}

/** Deterministic starting point derived from the quick-pick chips. */
export function paramsFromTokens(t: DesignTokens): FontParams {
  const p: Partial<FontParams> = {
    weight: t.weight === 'light' ? 280 : t.weight === 'bold' ? 700 : 400,
    contrast: t.contrast === 'low' ? 0.04 : t.contrast === 'high' ? 0.42 : 0.18,
    mono: t.style === 'mono',
    squareness: t.mood === 'technical' ? 0.55 : t.mood === 'playful' ? 0 : 0.15,
    terminal: t.mood === 'playful' ? 'round' : 'flat',
    corner: t.mood === 'playful' ? 0.5 : 0,
    spacing: t.mood === 'elegant' ? 1.1 : 1
  };
  if (t.style === 'serif') Object.assign(p, { serif: 'bracketed', contrast: Math.max(p.contrast as number, 0.3), xHeight: 500 });
  if (t.style === 'slab') Object.assign(p, { serif: 'slab', contrast: Math.min(p.contrast as number, 0.1) });
  if (t.style === 'brutalist') {
    Object.assign(p, { weight: Math.max(p.weight as number, 850), width: 1.35, squareness: 1.3, spacing: 0.6, xHeight: 590, contrast: 0, terminal: 'flat' });
  }
  return sanitizeParams(p);
}

export interface Preset {
  id: string;
  label: string;
  params: Partial<FontParams>;
}

export const PRESETS: Preset[] = [
  { id: 'sans', label: 'Sans', params: {} },
  { id: 'rounded', label: 'Rounded', params: { weight: 480, xHeight: 560, squareness: 0.1, terminal: 'round', spacing: 1.05 } },
  { id: 'soft', label: 'Soft', params: { weight: 520, xHeight: 550, squareness: 0.25, terminal: 'round', corner: 0.75, spacing: 1.05 } },
  { id: 'wax', label: 'Wax', params: { weight: 640, width: 1.05, xHeight: 560, contrast: 0.05, squareness: 0.3, terminal: 'round', corner: 0.6, wax: 0.9, spacing: 0.95 } },
  { id: 'serif', label: 'Serif', params: { weight: 400, xHeight: 500, contrast: 0.4, squareness: 0, spacing: 1.05, serif: 'bracketed' } },
  { id: 'slab', label: 'Slab', params: { weight: 560, width: 1.05, xHeight: 530, contrast: 0.04, squareness: 0.15, serif: 'slab' } },
  { id: 'didone', label: 'Didone', params: { weight: 420, width: 0.95, xHeight: 470, contrast: 0.6, squareness: 0, spacing: 1.05, serif: 'hairline', serifSize: 1.2 } },
  { id: 'brutalist', label: 'Brutalist', params: { weight: 880, width: 1.4, xHeight: 600, contrast: 0, squareness: 1.4, spacing: 0.6 } },
  { id: 'brutalist-slab', label: 'Brutalist slab', params: { weight: 820, width: 1.3, xHeight: 580, contrast: 0, squareness: 1.2, spacing: 0.6, serif: 'slab', serifSize: 1 } },
  { id: 'brutalist-mono', label: 'Brutalist mono', params: { weight: 700, xHeight: 560, contrast: 0, squareness: 1.5, serif: 'slab', serifSize: 0.9, mono: true } }
];

export const UPM = 1000;
export const CAP_HEIGHT = 700;

export interface Metrics {
  stem: number;
  hstem: number;
  a: number;
  b: number;
  cap: number;
  xh: number;
  asc: number;
  desc: number;
  ov: number;
  wf: number;
  hw: (dx: number, dy: number) => number;
}

export function computeMetrics(p: FontParams): Metrics {
  const stem = 36 + ((p.weight - 100) / 800) * 144;
  const hstem = Math.max(stem * 0.2, stem * (0.92 - p.contrast * 0.8));
  const a = stem / 2, b = hstem / 2;
  const hw = (dx: number, dy: number) => {
    const l = Math.hypot(dx, dy) || 1;
    const tx = dx / l, ty = dy / l;
    const nx = -ty, ny = tx;
    const h = Math.sqrt(a * a * nx * nx + b * b * ny * ny);
    return (2 * h) / Math.max(0.2, Math.abs(ty));
  };
  return {
    stem, hstem, a, b,
    cap: CAP_HEIGHT,
    xh: p.xHeight,
    asc: CAP_HEIGHT + 30,
    desc: Math.round(p.xHeight * 0.4),
    ov: 12,
    wf: p.width,
    hw
  };
}
