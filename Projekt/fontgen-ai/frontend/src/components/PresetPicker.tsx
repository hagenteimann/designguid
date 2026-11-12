import { useMemo } from 'react';
import { DEFAULT_PARAMS, FontParams, PRESETS, Preset, sanitizeParams } from '../lib/engine/params';
import { textPath } from '../lib/preview';

interface PresetPickerProps {
  current: FontParams;
  onPick: (preset: Preset) => void;
}

const resolve = (p: Preset) => sanitizeParams({ ...DEFAULT_PARAMS, ...p.params });

export function PresetPicker({ current, onPick }: PresetPickerProps) {
  const cards = useMemo(
    () => PRESETS.map((preset) => {
      try {
        return { preset, shape: textPath(resolve(preset), 'Aa', 46) };
      } catch {
        return { preset, shape: null };
      }
    }),
    []
  );
  const currentKey = JSON.stringify(current);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5 gap-2">
      {cards.map(({ preset, shape }) => {
        const active = JSON.stringify(resolve(preset)) === currentKey;
        return (
          <button
            key={preset.id}
            onClick={() => onPick(preset)}
            aria-pressed={active}
            className={`flex flex-col items-center justify-between gap-1 rounded-lg border px-2 pt-2 pb-1.5 min-h-[80px] transition-colors ${
              active ? 'border-primary-300 bg-primary-100' : 'border-neutral-200 bg-white hover:border-primary-200 hover:bg-neutral-50'
            }`}
          >
            {shape && (
              <svg viewBox={`0 0 ${shape.width} ${shape.height}`} className="h-10 w-auto max-w-full" role="img" aria-hidden="true">
                <path d={shape.d} fill="currentColor" className="text-neutral-900" />
              </svg>
            )}
            <span className="text-[11px] leading-tight text-neutral-600 text-center">{preset.label}</span>
          </button>
        );
      })}
    </div>
  );
}
