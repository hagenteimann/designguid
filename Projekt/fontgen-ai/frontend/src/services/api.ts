/**
 * API Service for Font Generator
 * Handles communication with backend generator pipeline
 */

export interface DesignTokens {
  weight: 'light' | 'regular' | 'bold';
  contrast: 'low' | 'medium' | 'high';
  style: 'serif' | 'sans' | 'mono';
  mood: 'elegant' | 'playful' | 'technical';
}

export type ApiProvider = 'gemini' | 'openai' | 'anthropic';

export const API_PROVIDERS: Record<ApiProvider, { label: string; placeholder: string }> = {
  gemini: { label: 'Google Gemini', placeholder: 'AIza...' },
  openai: { label: 'OpenAI', placeholder: 'sk-...' },
  anthropic: { label: 'Anthropic Claude', placeholder: 'sk-ant-...' }
};

export function detectProvider(key: string): ApiProvider | null {
  const k = key.trim();
  if (k.startsWith('AIza')) return 'gemini';
  if (k.startsWith('sk-ant-')) return 'anthropic';
  if (k.startsWith('sk-')) return 'openai';
  return null;
}

export interface GenerateRequest {
  prompt: string;
  apiKey: string;
  apiType: ApiProvider;
  designTokens: DesignTokens;
}

export interface GenerateResponse {
  status: 'pending' | 'success' | 'error';
  fontUrl?: string;
  glyphs?: GlyphInfo[];
  qaStatus?: QAStatus;
  error?: string;
  estimatedTime?: number;
}

export interface GlyphInfo {
  char: string;
  unicode: number;
  svg?: string;
  width?: number;
}

export interface QAStatus {
  passed: boolean;
  checks: QACheck[];
  issues: string[];
}

export interface QACheck {
  name: string;
  passed: boolean;
  message?: string;
}

export interface ExportFormat {
  type: 'otf' | 'ttf' | 'ufo';
  mimeType: string;
  extension: string;
}

const EXPORT_FORMATS: Record<string, ExportFormat> = {
  otf: {
    type: 'otf',
    mimeType: 'font/otf',
    extension: 'otf'
  },
  ttf: {
    type: 'ttf',
    mimeType: 'font/ttf',
    extension: 'ttf'
  },
  ufo: {
    type: 'ufo',
    mimeType: 'application/zip',
    extension: 'ufo.zip'
  }
};

/**
 * Generate font from prompt and design tokens
 * Calls backend API at POST /api/generate
 */
export async function generateFont(
  request: GenerateRequest,
  onProgress?: (update: Partial<GenerateResponse>) => void
): Promise<GenerateResponse> {
  try {
    // Validate API key
    if (!request.apiKey || request.apiKey.trim().length === 0) {
      return {
        status: 'error',
        error: 'API key is required'
      };
    }

    // Validate prompt
    if (!request.prompt || request.prompt.trim().length === 0) {
      return {
        status: 'error',
        error: 'Prompt is required'
      };
    }

    // Emit initial pending state
    onProgress?.({ status: 'pending', estimatedTime: 7000 });

    // Call backend API
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        apiKey: request.apiKey,
        apiType: request.apiType,
        designTokens: request.designTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        status: 'error',
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json() as GenerateResponse;
    return {
      ...data,
      status: data.status || 'success'
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      status: 'error',
      error: `Failed to generate font: ${message}`
    };
  }
}

/**
 * Export font in specified format
 * Assumes fontUrl points to a binary font file
 */
export async function exportFont(
  fontUrl: string,
  format: 'otf' | 'ttf' | 'ufo'
): Promise<Blob> {
  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.statusText}`);
  }

  const blob = await response.blob();
  const exportFormat = EXPORT_FORMATS[format];

  return new Blob([blob], {
    type: exportFormat.mimeType
  });
}

/**
 * Download font as file
 */
export function downloadFont(
  blob: Blob,
  filename: string
): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get supported export formats
 */
export function getExportFormats(): ExportFormat[] {
  return Object.values(EXPORT_FORMATS);
}

/**
 * Validate API key format (basic check)
 */
export function isValidApiKey(key: string, provider?: ApiProvider): boolean {
  const k = key.trim();
  if (k.length <= 8) return false;
  if (provider === 'gemini') return k.startsWith('AIza');
  if (provider === 'anthropic') return k.startsWith('sk-ant-');
  if (provider === 'openai') return k.startsWith('sk-');
  return true;
}

/**
 * Get estimated generation time based on design tokens
 */
export function getEstimatedTime(tokens: DesignTokens): number {
  // Base time in milliseconds
  let time = 5000;

  // Add time based on contrast complexity
  if (tokens.contrast === 'high') time += 2000;
  else if (tokens.contrast === 'medium') time += 1000;

  // Add time based on style complexity
  if (tokens.style === 'serif') time += 1500;
  else if (tokens.style === 'mono') time += 1000;

  // Add time based on mood complexity
  if (tokens.mood === 'elegant') time += 1000;
  else if (tokens.mood === 'technical') time += 500;

  return time;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
