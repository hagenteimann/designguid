import { useEffect, useRef, useState } from 'react';
import { GlyphInfo } from '../services/api';

interface PreviewPanelProps {
  glyphs?: GlyphInfo[];
  isLoading?: boolean;
  fontUrl?: string;
}

const PREVIEW_FAMILY = 'FontGenPreview';

export function PreviewPanel({ glyphs = [], isLoading = false, fontUrl }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fontReady, setFontReady] = useState(false);
  const [selectedGlyph, setSelectedGlyph] = useState<GlyphInfo | null>(null);
  const [sample, setSample] = useState('Hamburgefonstiv 0123456789');

  // Register the generated font (built in this browser) so previews use the real outlines
  useEffect(() => {
    setFontReady(false);
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

  // Render glyphs on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.fillStyle = 'hsl(0, 0%, 97%)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isLoading) {
      // Draw loading state
      ctx.fillStyle = 'hsl(0, 0%, 50%)';
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Generating glyphs...', canvas.width / 2 / window.devicePixelRatio, canvas.height / 2 / window.devicePixelRatio);
      return;
    }

    if (glyphs.length === 0) {
      // Draw empty state
      ctx.fillStyle = 'hsl(0, 0%, 70%)';
      ctx.font = '14px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No glyphs generated yet', canvas.width / 2 / window.devicePixelRatio, canvas.height / 2 / window.devicePixelRatio);
      return;
    }

    // Draw glyph grid using the generated font
    const w = canvas.width / window.devicePixelRatio;
    const h = canvas.height / window.devicePixelRatio;
    const cols = Math.max(1, Math.floor(w / 64));
    const rows = Math.ceil(glyphs.length / cols);
    const cellWidth = w / cols;
    const cellHeight = Math.min(h / rows, 64);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = fontReady ? `${Math.round(cellHeight * 0.55)}px "${PREVIEW_FAMILY}"` : '24px monospace';

    glyphs.forEach((glyph, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = col * cellWidth;
      const y = row * cellHeight;

      ctx.fillStyle = selectedGlyph?.char === glyph.char ? 'hsl(210, 100%, 90%)' : 'hsl(0, 0%, 94%)';
      ctx.fillRect(x, y, cellWidth, cellHeight);

      ctx.fillStyle = 'hsl(0, 0%, 15%)';
      ctx.fillText(glyph.char, x + cellWidth / 2, y + cellHeight * 0.72);

      ctx.strokeStyle = 'hsl(0, 0%, 80%)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellWidth, cellHeight);
    });
  }, [glyphs, isLoading, fontReady, selectedGlyph]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (glyphs.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cols = Math.max(1, Math.floor(rect.width / 64));
    const rows = Math.ceil(glyphs.length / cols);
    const cellWidth = rect.width / cols;
    const cellHeight = Math.min(rect.height / rows, 64);

    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    const index = row * cols + col;

    if (index < glyphs.length) {
      setSelectedGlyph(glyphs[index]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200">
        <h3 className="text-sm font-medium text-neutral-700">Live Preview</h3>
        <p className="text-xs text-neutral-500 mt-1">
          {glyphs.length > 0
            ? `${glyphs.length} glyphs generated`
            : 'Preview will appear here'}
        </p>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-hidden bg-neutral-50">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer"
        />
      </div>

      {/* Sample text in the generated font */}
      {fontReady && (
        <div className="px-4 py-3 border-t border-neutral-200">
          <input
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            aria-label="Sample text"
            className="w-full text-xs px-2 py-1 border border-neutral-300 rounded mb-2"
          />
          <p style={{ fontFamily: `"${PREVIEW_FAMILY}"`, fontSize: '28px', lineHeight: 1.2 }} className="break-words text-neutral-900">
            {sample}
          </p>
        </div>
      )}

      {/* Glyph Details */}
      {selectedGlyph && (
        <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
          <div className="text-sm">
            <p className="font-medium text-neutral-700 mb-2">
              Glyph: <span className="text-2xl ml-2">{selectedGlyph.char}</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-neutral-600">Unicode</p>
                <p className="text-neutral-900 font-mono">U+{selectedGlyph.unicode.toString(16).toUpperCase().padStart(4, '0')}</p>
              </div>
              <div>
                <p className="text-neutral-600">Width</p>
                <p className="text-neutral-900 font-mono">{selectedGlyph.width || 'N/A'} units</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && glyphs.length === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-neutral-500">
            Configure your prompt and generate a font to see the preview
          </p>
        </div>
      )}
    </div>
  );
}
