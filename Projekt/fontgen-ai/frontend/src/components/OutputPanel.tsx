import { useState } from 'react';
import { QAStatus, ExportFormat, exportFont, downloadFont, formatFileSize, getExportFormats } from '../services/api';

interface OutputPanelProps {
  qaStatus?: QAStatus;
  fontUrl?: string;
  isLoading?: boolean;
  onExport?: (format: string) => void;
}

export function OutputPanel({ qaStatus, fontUrl, isLoading = false, onExport }: OutputPanelProps) {
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async (format: 'otf' | 'ttf' | 'ufo') => {
    if (!fontUrl) return;

    setExporting(format);
    setExportError(null);

    try {
      const blob = await exportFont(fontUrl, format);
      const filename = `generated-font.${format}`;
      downloadFont(blob, filename);
      onExport?.(format);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Export failed';
      setExportError(message);
    } finally {
      setExporting(null);
    }
  };

  const exportFormats = getExportFormats();

  return (
    <div className="space-y-4">
      {/* QA Status */}
      {qaStatus && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-neutral-700">Quality Assurance</h3>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                qaStatus.passed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {qaStatus.passed ? '✓ Passed' : '⚠ Issues'}
            </div>
          </div>

          {/* Check List */}
          <div className="space-y-2">
            {qaStatus.checks.map((check, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 text-lg leading-none ${
                    check.passed ? 'text-green-600' : 'text-amber-600'
                  }`}
                >
                  {check.passed ? '✓' : '◆'}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-neutral-700 font-medium">{check.name}</p>
                  {check.message && (
                    <p className="text-xs text-neutral-500 mt-0.5">{check.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Issues */}
          {qaStatus.issues.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2">
              <p className="text-xs font-medium text-amber-900 mb-1">Known Issues:</p>
              <ul className="text-xs text-amber-800 space-y-1">
                {qaStatus.issues.map((issue, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span>•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-neutral-700 mb-2">Export Font</h3>
          <p className="text-xs text-neutral-500">
            Choose your preferred format. UFO is for editing, OTF/TTF for installation.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {exportFormats.map((format) => (
            <button
              key={format.type}
              onClick={() => handleExport(format.type as 'otf' | 'ttf' | 'ufo')}
              disabled={!fontUrl || isLoading || exporting !== null || !qaStatus?.passed}
              className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                !fontUrl || isLoading || exporting !== null || !qaStatus?.passed
                  ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  : 'bg-primary-300 hover:bg-primary-400 text-white'
              }`}
            >
              {exporting === format.type ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  {format.type.toUpperCase()}
                </>
              ) : (
                format.type.toUpperCase()
              )}
            </button>
          ))}
        </div>

        {/* Format Descriptions */}
        <div className="space-y-1 text-xs">
          <p className="text-neutral-600">
            <span className="font-medium">OTF:</span> OpenType Format - for installation and design software
          </p>
          <p className="text-neutral-600">
            <span className="font-medium">TTF:</span> TrueType Format - universal font format
          </p>
          <p className="text-neutral-600">
            <span className="font-medium">UFO:</span> Unified Font Object - for further editing
          </p>
        </div>

        {exportError && (
          <div className="bg-red-50 border border-red-200 rounded p-2">
            <p className="text-xs text-red-700">
              <span className="font-medium">Export Error:</span> {exportError}
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-900 mb-2">
          <span className="font-medium">How to use your font:</span>
        </p>
        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
          <li>Export in your preferred format</li>
          <li>For OTF/TTF: Install on your system or add to your project</li>
          <li>For UFO: Open in font editors like FontLab, Glyphs, or FontForge</li>
          <li>Use in design tools, websites, or applications</li>
        </ol>
      </div>

      {/* License Info */}
      <div className="bg-neutral-100 rounded-lg p-3 border border-neutral-300">
        <p className="text-xs text-neutral-700">
          <span className="font-medium">License:</span> Your generated fonts are yours to use.
          When sharing, include attribution: "Generated with FontGen AI"
        </p>
      </div>

      {/* Not Ready State */}
      {!fontUrl && (
        <div className="bg-neutral-50 border border-dashed border-neutral-300 rounded-lg p-4 text-center">
          <p className="text-sm text-neutral-600">
            Generate a font first to unlock export options
          </p>
        </div>
      )}
    </div>
  );
}
