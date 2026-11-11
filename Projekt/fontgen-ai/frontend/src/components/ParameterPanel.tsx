import { DEFAULT_PARAMS, FontParams, PARAM_SPECS, PRESETS, SERIF_STYLES, SerifStyle } from '../lib/engine/params';

interface ParameterPanelProps {
  params: FontParams;
  familyName: string;
  notes: string;
  onChange: (params: FontParams) => void;
  onSave: () => void;
}

const fmt = (v: number, step: number) => (step < 1 ? v.toFixed(2) : String(Math.round(v)));

const SERIF_LABEL: Record<SerifStyle, string> = {
  none: 'None',
  slab: 'Slab',
  bracketed: 'Bracketed',
  hairline: 'Hairline'
};

const segmented = (active: boolean) =>
  `flex-1 px-3 py-2 min-h-[44px] rounded-md text-xs font-medium transition-colors ${
    active ? 'bg-primary-300 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
  }`;

export function ParameterPanel({ params, familyName, notes, onChange, onSave }: ParameterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-neutral-700 break-words">Design parameters · {familyName}</h3>
          <p className="text-xs text-neutral-500 mt-1">
            One change updates every letter at once. These sliders work locally and cost nothing.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onSave}
            className="flex-1 sm:flex-none text-xs px-3 py-2 min-h-[44px] bg-primary-300 hover:bg-primary-400 text-white rounded-md transition-colors"
          >
            Save to public library
          </button>
          <button
            onClick={() => onChange(DEFAULT_PARAMS)}
            className="text-xs px-3 py-2 min-h-[44px] bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-neutral-600 mb-2">Style presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((pr) => (
            <button
              key={pr.id}
              onClick={() => onChange({ ...DEFAULT_PARAMS, ...pr.params })}
              className="px-3 py-2 min-h-[44px] rounded-md text-xs font-medium bg-neutral-100 hover:bg-primary-200 text-neutral-700 transition-colors"
            >
              {pr.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-white/95 backdrop-blur border-y border-neutral-200" aria-label="Live sample">
        <p
          className="whitespace-nowrap overflow-hidden text-ellipsis text-neutral-900"
          style={{ fontFamily: '"FontGenPreview"', fontSize: '30px', lineHeight: 1.3 }}
        >
          Hamburgefonstiv 0123
        </p>
      </div>

      {notes && (
        <p className="text-xs text-primary-600 bg-primary-100 rounded-md px-3 py-2">
          <span className="font-medium">AI rationale:</span> {notes}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {PARAM_SPECS.map((s) => {
          const disabled = s.key === 'serifSize' && params.serif === 'none';
          return (
            <label key={s.key} className={`block ${disabled ? 'opacity-40' : ''}`}>
              <div className="flex justify-between text-xs text-neutral-600 mb-1">
                <span className="font-medium">{s.label}</span>
                <span className="font-mono">{fmt(params[s.key], s.step)}</span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={params[s.key]}
                disabled={disabled}
                onChange={(e) => onChange({ ...params, [s.key]: parseFloat(e.target.value) })}
                aria-label={s.label}
                title={s.hint}
                className="w-full accent-primary-300"
              />
              <p className="text-[11px] text-neutral-400 mt-0.5">{s.hint}</p>
            </label>
          );
        })}

        <div>
          <p className="text-xs font-medium text-neutral-600 mb-1">Serifs</p>
          <div className="grid grid-cols-2 gap-2">
            {SERIF_STYLES.map((st) => (
              <button
                key={st}
                onClick={() => onChange({ ...params, serif: st })}
                aria-pressed={params.serif === st}
                className={segmented(params.serif === st)}
              >
                {SERIF_LABEL[st]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-neutral-600 mb-1">Terminals</p>
          <div className="flex gap-2">
            {(['flat', 'round'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChange({ ...params, terminal: t })}
                aria-pressed={params.terminal === t}
                className={segmented(params.terminal === t)}
              >
                {t === 'flat' ? 'Flat' : 'Round'}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 mt-3 min-h-[44px] text-xs text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={params.mono}
              onChange={(e) => onChange({ ...params, mono: e.target.checked })}
              className="accent-primary-300 w-4 h-4"
            />
            Monospaced
          </label>
        </div>
      </div>
    </div>
  );
}
