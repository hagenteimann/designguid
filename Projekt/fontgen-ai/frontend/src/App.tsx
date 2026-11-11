import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ApiKeyInput, ApiKeySubmit } from './components/ApiKeyInput';
import { PromptBuilder } from './components/PromptBuilder';
import { PreviewPanel } from './components/PreviewPanel';
import { OutputPanel } from './components/OutputPanel';
import { generateFont, DesignTokens, GenerateResponse, ApiProvider, getEstimatedTime } from './services/api';

type Tab = 'generate' | 'edit';

const KEY_STORE = 'fontgen_api_key';
const TYPE_STORE = 'fontgen_api_type';
const MODEL_STORE = 'fontgen_api_model';

export function App() {
  const [tab, setTab] = useState<Tab>('generate');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiType, setApiType] = useState<ApiProvider>('gemini');
  const [model, setModel] = useState('');
  const [hasApiKey, setHasApiKey] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [designTokens, setDesignTokens] = useState<DesignTokens>({
    weight: 'regular',
    contrast: 'medium',
    style: 'sans',
    mood: 'elegant'
  });
  const [estimatedTime, setEstimatedTime] = useState(0);

  // Restore key from this browser's storage (localStorage if remembered, else sessionStorage)
  useEffect(() => {
    try {
      const store = localStorage.getItem(KEY_STORE) ? localStorage : sessionStorage;
      const stored = store.getItem(KEY_STORE);
      if (stored) {
        setApiKey(stored);
        setApiType((store.getItem(TYPE_STORE) as ApiProvider) || 'gemini');
        setModel(store.getItem(MODEL_STORE) || '');
        setHasApiKey(true);
      }
    } catch {
      /* storage unavailable (private mode) */
    }
  }, []);

  useEffect(() => {
    setEstimatedTime(getEstimatedTime(designTokens));
  }, [designTokens]);

  const generation = useMutation({
    mutationFn: async () => {
      if (!apiKey) throw new Error('No API key');
      return generateFont({ prompt, apiKey, apiType, model, designTokens });
    }
  });
  const isLoading = generation.isPending;
  const generationResult: GenerateResponse | undefined = generation.data;
  const error = generation.error;

  const clearStoredKey = () => {
    try {
      for (const store of [localStorage, sessionStorage]) {
        store.removeItem(KEY_STORE);
        store.removeItem(TYPE_STORE);
        store.removeItem(MODEL_STORE);
      }
    } catch {
      /* ignore */
    }
  };

  const handleApiKeySubmit = ({ apiKey: key, provider, model: m, remember }: ApiKeySubmit) => {
    clearStoredKey();
    try {
      const store = remember ? localStorage : sessionStorage;
      store.setItem(KEY_STORE, key);
      store.setItem(TYPE_STORE, provider);
      store.setItem(MODEL_STORE, m);
    } catch {
      /* keep in memory only */
    }
    setApiKey(key);
    setApiType(provider);
    setModel(m);
    setHasApiKey(true);
  };

  const handlePromptChange = (newPrompt: string, newTokens: DesignTokens) => {
    setPrompt(newPrompt);
    setDesignTokens(newTokens);
  };

  const handleGenerate = () => {
    if (!prompt.trim() || isLoading) {
      return;
    }
    generation.mutate();
  };

  const handleResetApiKey = () => {
    clearStoredKey();
    setApiKey(null);
    setHasApiKey(false);
    generation.reset();
  };

  const handleEditFont = () => {
    // Link to external glyph editor component (separate agent)
    alert('Glyph editor is in development. Redirect to editor component would go here.');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* API Key Modal */}
      {!hasApiKey && <ApiKeyInput onSubmit={handleApiKeySubmit} />}

      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">FontGen AI</h1>
            <p className="text-sm text-neutral-600 mt-0.5">Generate custom fonts with artificial intelligence</p>
          </div>
          {hasApiKey && (
            <button
              onClick={handleResetApiKey}
              className="text-xs px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-md transition-colors"
            >
              Forget key
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      {hasApiKey && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Panel - Prompt Builder */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Design Your Font</h2>
              <PromptBuilder
                onPromptChange={handlePromptChange}
                isLoading={isLoading}
              />

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className="w-full mt-6 bg-primary-300 hover:bg-primary-400 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" style={{ borderWidth: '2px', width: '18px', height: '18px' }} />
                    Generating... ({Math.round(estimatedTime / 1000)}s)
                  </>
                ) : (
                  '✨ Generate Font'
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Error:</span> {typeof error === 'object' && error && 'message' in error ? error.message : String(error)}
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Check your API key, model name and spend limits
                  </p>
                </div>
              )}

              {/* Generation Result Error */}
              {generationResult?.status === 'error' && generationResult.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Generation Failed:</span> {generationResult.error}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {generationResult?.status === 'success' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">✓ Font generated successfully!</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview & Output */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 bg-white rounded-lg shadow p-1">
              <button
                onClick={() => setTab('generate')}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === 'generate'
                    ? 'bg-primary-300 text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => setTab('edit')}
                disabled={!generationResult?.fontUrl}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === 'edit'
                    ? 'bg-primary-300 text-white'
                    : generationResult?.fontUrl
                    ? 'text-neutral-600 hover:bg-neutral-100'
                    : 'text-neutral-400 cursor-not-allowed'
                }`}
              >
                Edit (Glyph Editor)
              </button>
            </div>

            {/* Tab Content */}
            {tab === 'generate' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preview Panel */}
                <div className="bg-white rounded-lg shadow overflow-hidden h-96">
                  <PreviewPanel
                    glyphs={generationResult?.glyphs}
                    isLoading={isLoading}
                    fontUrl={generationResult?.fontUrl}
                  />
                </div>

                {/* Output Panel */}
                <div className="overflow-y-auto max-h-96">
                  <OutputPanel
                    qaStatus={generationResult?.qaStatus}
                    fontUrl={generationResult?.fontUrl}
                    glyphDataUrl={generationResult?.glyphDataUrl}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

            {tab === 'edit' && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-neutral-600 mb-4">
                  The glyph editor is a separate component built by another agent.
                </p>
                <button
                  onClick={handleEditFont}
                  className="bg-primary-300 hover:bg-primary-400 text-white font-medium px-6 py-2 rounded-md transition-colors"
                >
                  Open Glyph Editor
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-neutral-600">
          <p>
            FontGen AI • Powered by generative AI • Runs entirely in your browser – no data is sent to our servers
          </p>
          <p className="mt-1">
            <a href="#" className="hover:text-primary-300 transition-colors">Privacy</a> •
            <a href="#" className="hover:text-primary-300 transition-colors ml-2">Terms</a> •
            <a href="#" className="hover:text-primary-300 transition-colors ml-2">About</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
