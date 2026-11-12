import { ReactNode, useEffect, useState } from 'react';
import { GlyphInfo, QAStatus } from '../services/api';
import { STYLE_KEYS, STYLE_LABEL, StyleKey } from '../lib/engine/variants';
import { Disclosure } from './Disclosure';

export const PREVIEW_FAMILY = 'FontGenPreview';

interface PreviewCardProps {
  name: string;
  onNameChange: (name: string) => void;
  style: StyleKey;
  onStyleChange: (style: StyleKey) => void;
  fontUrl?: string;
  glyphs: GlyphInfo[];
  qa?: QAStatus;
  paramsUrl?: string;
  paramsName: string;
  children?: ReactNode;
}

export function PreviewCard({ name, onNameChange, style, onStyleChange, fontUrl, glyphs, qa, paramsUrl, paramsName, children }: PreviewCardProps) {
  const [fontReady, setFontReady] = useState(false);
  const [sample, setSample] = useState('Hamburgefonstiv 0123');

  // Register the font built in this browser so the preview shows the real outlines
  useEffect(() => {
    if (!fontUrl) return;
    let cancelled = false;
    let face: FontFace | null = null;
    (async () => {
      try {
        const buffer = await (await fetch(fontUrl)).arrayBuffer();
        face = new FontFace(PREVIEW_FAMILY, buffer);
        await face.load();
        if (cancelled) return;
        document.fonts.add(face);
        setFontReady(true);
      } catch (error) {
        console.error('Font loading error:', error);
      }
    })();
    return () => {
      cancelled = true;
      if (face) document.fonts.delete(face);
    };
  }, [fontUrl]);

  const fontStyle = fontReady ? { fontFamily: `"${PREVIEW_FAMILY}"` } : undefined;

  return (
    <div className="bg-white rounded-xl shadow">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4">
        <input
          value={name}
          maxLength={30}
          onChange={(e) => onNameChange(e.target.value)}
          aria-label="Font name"
          title="Click to rename"
          className="min-w-0 flex-1 text-lg font-bold text-neutral-900 bg-transparent rounded px-1 -mx-1 border border-transparent hover:border-neutral-300 focus:border-primary-300 outline-none"
        />
        <div className="grid grid-cols-4 gap-1 w-full sm:w-auto" role="group" aria-label="Style">
          {STYLE_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => onStyleChange(k)}
              aria-pressed={style === k}
              className={`px-2 sm:px-3 py-2 min-h-[44px] rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                style === k ? 'bg-primary-300 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {STYLE_LABEL[k]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <textarea
          value={sample}
          onChange={(e) => setSample(e.target.value)}
          rows={2}
          spellCheck={false}
          aria-label="Type here to preview your font"
          placeholder="Type to preview…"
          style={{ ...fontStyle, fontSize: 'clamp(30px, 6vw, 60px)', lineHeight: 1.2 }}
          className="w-full resize-none bg-transparent text-neutral-900 placeholder:text-neutral-300 outline-none rounded-md px-1 -mx-1 focus:bg-neutral-50"
        />
      </div>

      <div className="px-4 pb-4 space-y-3">
        {children}

        <Disclosure title={`All characters (${glyphs.length}): tap to add to the preview`}>
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-1 max-h-56 overflow-y-auto bg-neutral-50 rounded-md p-2">
            {glyphs.map((g) => (
              <button
                key={g.unicode}
                onClick={() => setSample((s) => s + g.char)}
                aria-label={`Add ${g.char}`}
                style={{ ...fontStyle, fontSize: '26px', lineHeight: '48px' }}
                className="h-12 rounded bg-white hover:bg-primary-100 text-neutral-900 text-center transition-colors"
              >
                {g.char}
              </button>
            ))}
          </div>
        </Disclosure>

        {qa && (
          <Disclosure
            title={qa.passed ? 'Font checks passed' : `${qa.issues.length} note${qa.issues.length === 1 ? '' : 's'} on the font checks`}
            titleClassName={qa.passed ? 'text-green-700' : 'text-amber-700'}
          >
            <ul className="text-xs text-neutral-600 space-y-1">
              {qa.checks.map((c) => (
                <li key={c.name} className="flex gap-2">
                  <span className={c.passed ? 'text-green-600' : 'text-amber-600'}>{c.passed ? '✓' : '◆'}</span>
                  <span>
                    {c.name}
                    {c.message && <span className="text-neutral-400"> · {c.message}</span>}
                  </span>
                </li>
              ))}
            </ul>
            {paramsUrl && (
              <a href={paramsUrl} download={paramsName} className="inline-flex items-center min-h-[44px] mt-1 text-xs underline text-neutral-600 hover:text-neutral-900">
                Save the design settings as a file (JSON)
              </a>
            )}
          </Disclosure>
        )}
      </div>
    </div>
  );
}
