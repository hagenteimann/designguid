/**
 * Everything runs in the browser: the LLM is only asked for design parameters (with the user's own key,
 * called directly), and the font is drawn and assembled locally. No data is sent to any server of ours.
 */
import type { ApiProvider as Provider } from '../lib/llm';
export type { DesignTokens } from '../lib/engine/params';

export type ApiProvider = Provider;

export const API_PROVIDERS: Record<ApiProvider, { label: string; placeholder: string }> = {
  gemini: { label: 'Google Gemini', placeholder: 'AIza… or AQ.…' },
  openai: { label: 'OpenAI', placeholder: 'sk-...' },
  anthropic: { label: 'Anthropic Claude', placeholder: 'sk-ant-...' }
};

export function detectProvider(key: string): ApiProvider | null {
  const k = key.trim();
  if (k.startsWith('AIza') || k.startsWith('AQ.')) return 'gemini';
  if (k.startsWith('sk-ant-')) return 'anthropic';
  if (k.startsWith('sk-')) return 'openai';
  return null;
}

export function isValidApiKey(key: string, provider?: ApiProvider): boolean {
  const k = key.trim();
  if (k.length <= 8) return false;
  if (provider === 'gemini') return k.startsWith('AIza') || k.startsWith('AQ.');
  if (provider === 'anthropic') return k.startsWith('sk-ant-');
  if (provider === 'openai') return k.startsWith('sk-');
  return true;
}

export interface GlyphInfo {
  char: string;
  unicode: number;
  width?: number;
}

export interface QACheck {
  name: string;
  passed: boolean;
  message?: string;
}

export interface QAStatus {
  passed: boolean;
  checks: QACheck[];
  issues: string[];
}

export type ExportType = 'otf' | 'json';

export interface ExportFormat {
  type: ExportType;
  label: string;
  filename: string;
}

const EXPORT_FORMATS: ExportFormat[] = [
  { type: 'otf', label: 'OTF', filename: 'generated-font.otf' },
  { type: 'json', label: 'PARAMETERS (JSON)', filename: 'generated-font.params.json' }
];

export function getExportFormats(): ExportFormat[] {
  return EXPORT_FORMATS;
}

export async function exportFont(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to read file: ${response.statusText}`);
  return response.blob();
}

export function downloadFont(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
