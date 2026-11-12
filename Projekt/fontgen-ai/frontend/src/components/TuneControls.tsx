import { DEFAULT_PARAMS, FontParams, PARAM_SPECS, ParamSpec, SERIF_STYLES, SerifStyle } from '../lib/engine/params';
import { PREVIEW_FAMILY } from './PreviewCard';
import { Disclosure } from './Disclosure';

interface TuneControlsProps {
  params: FontParams;
  onChange: (params: FontParams) => void;
}

const SERIF_LABEL: Record<SerifStyle, string> = { none: 'None', slab: 'Slab', bracketed: 'Classic', hairline: 'Hairline' };

const fmt = (v: number, step: number) => (step < 1 ? v.toFixed(2) : String(Math.round(v)));

function Slider({ spec, value, onChange }: { spec: ParamSpec; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="flex justify-between text-sm text-neutral-700 mb-0.5">
        <span className="font-medium">{spec.label}</span>
        <span className="font-mono text-xs text-neutral-400">{fmt(value, spec.step)}</span>
      </div>
      <input
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        aria-label={spec.label}
        className="w-full accent-primary-300"
      />
      <div className="flex justify-between text-[11px] text-neutral-400 -mt-1">
        <span>{spec.low}</span>
        <span>{spec.high}</span>
      </div>
    </label>
  );
}

const segmented = (active: boolean) =>
  `flex-1 px-3 py-2 min-h-[44px] rounded-md text-sm font-medium transition-colors ${
    active ? 'bg-primary-300 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
  }`;

export function TuneControls({ params, onChange }: TuneControlsProps) {
  const set = (key: ParamSpec['key']) => (v: number) => onChange({ ...params, [key]: v });
  const basic = PARAM_SPECS.filter((s) => s.group === 'basic');
  const advanced = PARAM_SPECS.filter((s) => s.group === 'advanced');

  return (
    <div className="space-y-4">
      {/* Keeps the result in view while scrolling through the sliders on small screens */}
      <div
        className="lg:hidden sticky top-0 z-10 -mx-4 px-4 py-1.5 bg-white/95 backdrop-blur border-y border-neutral-200 whitespace-nowrap overflow-hidden text-ellipsis text-neutral-900"
        style={{ fontFamily: `"${PREVIEW_FAMILY}"`, fontSize: '28px', lineHeight: 1.3 }}
        aria-hidden="true"
      >
        Hamburgefonstiv 0123
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {basic.map((s) => (
          <Slider key={s.key} spec={s} value={params[s.key]} onChange={set(s.key)} />
        ))}
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-700 mb-1">Serifs</p>
        <div className="grid grid-cols-4 gap-2">
          {SERIF_STYLES.map((st) => (
            <button key={st} onClick={() => onChange({ ...params, serif: st })} aria-pressed={params.serif === st} className={segmented(params.serif === st)}>
              {SERIF_LABEL[st]}
            </button>
          ))}
        </div>
      </div>

      <Disclosure title="More controls">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {advanced.map((s) => (
              <div key={s.key} className={s.key === 'serifSize' && params.serif === 'none' ? 'opacity-40 pointer-events-none' : ''}>
                <Slider spec={s} value={params[s.key]} onChange={set(s.key)} />
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-1">Stroke ends</p>
            <div className="grid grid-cols-2 gap-2">
              {(['flat', 'round'] as const).map((t) => (
                <button key={t} onClick={() => onChange({ ...params, terminal: t })} aria-pressed={params.terminal === t} className={segmented(params.terminal === t)}>
                  {t === 'flat' ? 'Flat cut' : 'Round'}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3 min-h-[44px] text-sm text-neutral-700 cursor-pointer">
            <input type="checkbox" checked={params.mono} onChange={(e) => onChange({ ...params, mono: e.target.checked })} className="accent-primary-300 w-5 h-5" />
            Monospaced (every letter the same width)
          </label>
        </div>
      </Disclosure>

      <button
        onClick={() => onChange(DEFAULT_PARAMS)}
        className="text-sm text-neutral-500 hover:text-neutral-900 underline min-h-[44px]"
      >
        Reset all settings
      </button>
    </div>
  );
}
