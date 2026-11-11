import { useEffect, useRef, useState } from 'react';
import { GlyphInfo } from '../services/api';

interface PreviewPanelProps {
  glyphs?: GlyphInfo[];
  isLoading?: boolean;
  fontUrl?: string;
}

export function PreviewPanel({ glyphs = [], isLoading = false, fontUrl }: PreviewPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadedFont, setLoadedFont] = useState<ArrayBuffer | null>(null);
  const [selectedGlyph, setSelectedGlyph] = useState<GlyphInfo | null>(null);
  const previewTextRef = useRef('AaBbCcDdEeFfGg');

  // Load font from URL
  useEffect(() => {
    if (!fontUrl) return;

    const loadFont = async () => {
      try {
        const response = await fetch(fontUrl);
        if (!response.ok) throw new Error('Failed to load font');
        const buffer = await response.arrayBuffer();
        setLoadedFont(buffer);
      } catch (error) {
        console.error('Font loading error:', error);
      }
    };

    loadFont();
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

    // Draw preview text or glyphs grid
    if (loadedFont && previewTextRef.current) {
      // Try to render preview text
      ctx.fillStyle = 'hsl(0, 0%, 15%)';
      ctx.font = 'bold 48px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(previewTextRef.current, canvas.width / 2 / window.devicePixelRatio, canvas.height / 2 / window.devicePixelRatio);
    } else {
      // Draw glyph grid
      const cols = Math.floor(canvas.width / window.devicePixelRatio / 100);
      const rows = Math.ceil(glyphs.length / cols);
      const cellWidth = (canvas.width / window.devicePixelRatio) / cols;
      const cellHeight = (canvas.height / window.devicePixelRatio) / rows;

      ctx.fillStyle = 'hsl(0, 0%, 15%)';
      ctx.font = '32px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      glyphs.forEach((glyph, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;

        // Draw cell background
        ctx.fillStyle = selectedGlyph?.char === glyph.char
          ? 'hsl(210, 100%, 90%)'
          : 'hsl(0, 0%, 90%)';
        ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

        // Draw glyph
        ctx.fillStyle = 'hsl(0, 0%, 15%)';
        ctx.fillText(glyph.char, x, y);

        // Draw border
        ctx.strokeStyle = 'hsl(0, 0%, 70%)';
        ctx.lineWidth = 1;
        ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
      });
    }
  }, [glyphs, isLoading, loadedFont, selectedGlyph]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (glyphs.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate which glyph was clicked
    const cols = Math.floor(canvas.width / window.devicePixelRatio / 100);
    const cellWidth = (canvas.width / window.devicePixelRatio) / cols;
    const cellHeight = (canvas.height / window.devicePixelRatio) / (Math.ceil(glyphs.length / cols));

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
