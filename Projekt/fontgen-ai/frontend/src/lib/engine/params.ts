import { Edits, Paths, sanitizeEdits, sanitizePaths } from './skeleton';

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
  /** hand-edited skeleton points per letter (see skeleton.ts) */
  edits?: Edits;
  /** cut / join operations per letter (see skeleton.ts) */
  paths?: Paths;
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
  key: Exclude<keyof FontParams, 'terminal' | 'mono' | 'serif' | 'edits' | 'paths'>;
  label: string;
  min: number;
  max: number;
  step: number;
  /** what the slider's left / right end looks like */
  low: string;
  high: string;
  /** shown directly, or tucked into "More controls" */
  group: 'basic' | 'advanced';
}

export const PARAM_SPECS: ParamSpec[] = [
  { key: 'weight', label: 'Weight', min: 100, max: 1000, step: 10, low: 'Thin', high: 'Heavy', group: 'basic' },
  { key: 'width', label: 'Width', min: 0.7, max: 1.6, step: 0.01, low: 'Narrow', high: 'Wide', group: 'basic' },
  { key: 'corner', label: 'Roundness', min: 0, max: 1, step: 0.01, low: 'Sharp', high: 'Round', group: 'basic' },
  { key: 'slant', label: 'Slant', min: 0, max: 20, step: 0.5, low: 'Upright', high: 'Slanted', group: 'basic' },
  { key: 'spacing', label: 'Letter spacing', min: 0.4, max: 1.5, step: 0.01, low: 'Tight', high: 'Loose', group: 'basic' },
  { key: 'xHeight', label: 'Lowercase height', min: 440, max: 640, step: 5, low: 'Small', high: 'Tall', group: 'advanced' },
  { key: 'contrast', label: 'Stroke contrast', min: 0, max: 0.6, step: 0.01, low: 'Even', high: 'High', group: 'advanced' },
  { key: 'squareness', label: 'Boxiness', min: 0, max: 1.5, step: 0.01, low: 'Circular', high: 'Boxy', group: 'advanced' },
  { key: 'wax', label: 'Wax / melt', min: 0, max: 1, step: 0.01, low: 'Off', high: 'Gooey', group: 'advanced' },
  { key: 'serifSize', label: 'Serif length', min: 0.4, max: 1.8, step: 0.05, low: 'Short', high: 'Long', group: 'advanced' }
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
  if ('edits' in r) p.edits = sanitizeEdits(r.edits);
  if (!p.edits) delete p.edits;
  if ('paths' in r) p.paths = sanitizePaths(r.paths);
  if (!p.paths) delete p.paths;
  return p;
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
