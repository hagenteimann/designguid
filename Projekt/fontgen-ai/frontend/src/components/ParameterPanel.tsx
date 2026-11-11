import { DEFAULT_PARAMS, FontParams, PARAM_SPECS } from '../lib/engine/params';

interface ParameterPanelProps {
  params: FontParams;
  familyName: string;
  notes: string;
  onChange: (params: FontParams) => void;
}

const fmt = (v: number, step: number) => (step < 1 ? v.toFixed(step < 0.1 ? 2 : 2) : String(Math.round(v)));

export function ParameterPanel({ params, familyName, notes, onChange }: ParameterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-700">Design parameters · {familyName}</h3>
          <p className="text-xs text-neutral-500 mt-1">
            One change updates every letter at once. These sliders work locally and cost nothing.
          </p>
        </div>
        <button
          onClick={() => onChange(DEFAULT_PARAMS)}
          className="text-xs px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-md transition-colors shrink-0"
        >
          Reset
        </button>
      </div>

      {notes && (
        <p className="text-xs text-primary-600 bg-primary-100 rounded-md px-3 py-2">
          <span className="font-medium">AI rationale:</span> {notes}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {PARAM_SPECS.map((s) => (
          <label key={s.key} className="block">
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
              onChange={(e) => onChange({ ...params, [s.key]: parseFloat(e.target.value) })}
              aria-label={s.label}
              title={s.hint}
              className="w-full accent-primary-300"
            />
            <p className="text-[11px] text-neutral-400 mt-0.5">{s.hint}</p>
          </label>
        ))}

        <div>
          <p className="text-xs font-medium text-neutral-600 mb-1">Terminals</p>
          <div className="flex gap-2">
            {(['flat', 'round'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onChange({ ...params, terminal: t })}
                className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  params.terminal === t ? 'bg-primary-300 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {t === 'flat' ? 'Flat' : 'Round'}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 mt-3 text-xs text-neutral-600 cursor-pointer">
            <input
              type="checkbox"
              checked={params.mono}
              onChange={(e) => onChange({ ...params, mono: e.target.checked })}
              className="accent-primary-300"
            />
            Monospaced
          </label>
        </div>
      </div>
    </div>
  );
}
