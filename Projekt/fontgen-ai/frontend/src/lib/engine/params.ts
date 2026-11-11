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
}

export const DEFAULT_PARAMS: FontParams = {
  weight: 400,
  width: 1,
  xHeight: 520,
  contrast: 0.12,
  squareness: 0.15,
  slant: 0,
  spacing: 1,
  terminal: 'flat',
  mono: false
};

export interface ParamSpec {
  key: Exclude<keyof FontParams, 'terminal' | 'mono'>;
  label: string;
  min: number;
  max: number;
  step: number;
  hint: string;
}

export const PARAM_SPECS: ParamSpec[] = [
  { key: 'weight', label: 'Weight', min: 100, max: 900, step: 10, hint: 'Stem thickness: 400 regular, 700 bold' },
  { key: 'width', label: 'Width', min: 0.8, max: 1.25, step: 0.01, hint: 'Condensed ↔ extended letterforms' },
  { key: 'xHeight', label: 'x-height', min: 440, max: 600, step: 5, hint: 'Large x-height reads better at small sizes' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 0.6, step: 0.01, hint: '0 = monoline, higher = thinner horizontals' },
  { key: 'squareness', label: 'Squareness', min: 0, max: 1, step: 0.01, hint: '0 = circular, 1 = squarish curves' },
  { key: 'slant', label: 'Slant', min: 0, max: 14, step: 0.5, hint: 'Oblique angle in degrees' },
  { key: 'spacing', label: 'Spacing', min: 0.7, max: 1.5, step: 0.01, hint: 'Tight display ↔ loose text spacing' }
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
  return p;
}

export interface DesignTokens {
  weight: 'light' | 'regular' | 'bold';
  contrast: 'low' | 'medium' | 'high';
  style: 'serif' | 'sans' | 'mono';
  mood: 'elegant' | 'playful' | 'technical';
}

/** Deterministic starting point derived from the quick-pick chips. */
export function paramsFromTokens(t: DesignTokens): FontParams {
  return sanitizeParams({
    weight: t.weight === 'light' ? 280 : t.weight === 'bold' ? 700 : 400,
    contrast: t.contrast === 'low' ? 0.04 : t.contrast === 'high' ? 0.42 : 0.18,
    mono: t.style === 'mono',
    width: t.style === 'mono' ? 1 : 1,
    squareness: t.mood === 'technical' ? 0.55 : t.mood === 'playful' ? 0 : 0.15,
    terminal: t.mood === 'playful' ? 'round' : 'flat',
    spacing: t.mood === 'elegant' ? 1.1 : 1
  });
}

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
