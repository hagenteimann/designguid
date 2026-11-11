import { useEffect, useState } from 'react';
import { GlyphInfo } from '../services/api';

interface PreviewPanelProps {
  glyphs?: GlyphInfo[];
  isLoading?: boolean;
  fontUrl?: string;
}

const PREVIEW_FAMILY = 'FontGenPreview';

export function PreviewPanel({ glyphs = [], isLoading = false, fontUrl }: PreviewPanelProps) {
  const [fontReady, setFontReady] = useState(false);
  const [selected, setSelected] = useState<GlyphInfo | null>(null);
  const [sample, setSample] = useState('Hamburgefonstiv 0123456789');

  // Register the font built in this browser so previews use the real outlines
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
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="text-sm font-medium text-neutral-700">Live Preview</h3>
        <p className="text-xs text-neutral-500 mt-1">
          {isLoading ? 'Waiting for the AI…' : glyphs.length > 0 ? `${glyphs.length} glyphs generated` : 'Preview will appear here'}
        </p>
      </div>

      <div className="px-4 py-3 border-b border-neutral-200">
        <input
          value={sample}
          onChange={(e) => setSample(e.target.value)}
          aria-label="Sample text"
          className="w-full text-xs px-2 py-1 border border-neutral-300 rounded mb-2"
        />
        <p style={{ ...fontStyle, fontSize: '34px', lineHeight: 1.25 }} className="break-words text-neutral-900">
          {sample || ' '}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-50 p-2">
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-1">
          {glyphs.map((g) => (
            <button
              key={g.unicode}
              onClick={() => setSelected(g)}
              aria-label={`Glyph ${g.char}`}
              style={{ ...fontStyle, fontSize: '30px', lineHeight: '56px' }}
              className={`h-14 rounded text-center text-neutral-900 transition-colors ${
                selected?.unicode === g.unicode ? 'bg-primary-200' : 'bg-white hover:bg-neutral-200'
              }`}
            >
              {g.char}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div className="px-4 py-2 border-t border-neutral-200 bg-white text-xs flex gap-6">
          <span className="text-neutral-600">
            Glyph <span className="text-lg align-middle ml-1" style={fontStyle}>{selected.char}</span>
          </span>
          <span className="text-neutral-600">
            Unicode <span className="font-mono text-neutral-900">U+{selected.unicode.toString(16).toUpperCase().padStart(4, '0')}</span>
          </span>
          <span className="text-neutral-600">
            Advance <span className="font-mono text-neutral-900">{selected.width ?? '–'}</span>
          </span>
        </div>
      )}
    </div>
  );
}
