import { useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ApiKeyInput, ApiKeySubmit } from './components/ApiKeyInput';
import { PromptBuilder } from './components/PromptBuilder';
import { PreviewPanel } from './components/PreviewPanel';
import { OutputPanel } from './components/OutputPanel';
import { ParameterPanel } from './components/ParameterPanel';
import { SaveDialog } from './components/SaveDialog';
import { LibraryView } from './components/LibraryView';
import { LibraryEntry } from './lib/library';
import { ApiProvider, API_PROVIDERS, DesignTokens, GlyphInfo, QAStatus } from './services/api';
import { DEFAULT_PARAMS, FontParams } from './lib/engine/params';
import { renderFont, suggestParams } from './lib/generate';

const KEY_STORE = 'fontgen_api_key';
const TYPE_STORE = 'fontgen_api_type';
const MODEL_STORE = 'fontgen_api_model';

interface RenderState {
  fontUrl: string;
  paramsUrl: string;
  glyphs: GlyphInfo[];
  qaStatus: QAStatus;
}

type View = 'studio' | 'library';

export function App() {
  const [view, setView] = useState<View>('studio');
  const [skipKey, setSkipKey] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const [params, setParams] = useState<FontParams>(DEFAULT_PARAMS);
  const [familyName, setFamilyName] = useState('Sans');
  const [notes, setNotes] = useState('');
  const [rendered, setRendered] = useState<RenderState | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const urls = useRef<string[]>([]);

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

  // Rebuild the font locally whenever parameters change (fast, free, no network)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const r = renderFont(params, familyName);
        const fontUrl = URL.createObjectURL(new Blob([r.buffer], { type: 'font/otf' }));
        const paramsUrl = URL.createObjectURL(
          new Blob([JSON.stringify({ familyName, params }, null, 2)], { type: 'application/json' })
        );
        const old = urls.current;
        urls.current = [fontUrl, paramsUrl];
        setRendered({
          fontUrl,
          paramsUrl,
          glyphs: r.glyphs,
          qaStatus: {
            passed: r.checks.every((c) => c.passed),
            checks: r.checks,
            issues: r.checks.filter((c) => !c.passed).map((c) => `${c.name}${c.message ? ': ' + c.message : ''}`)
          }
        });
        setRenderError(null);
        setTimeout(() => old.forEach((u) => URL.revokeObjectURL(u)), 2000);
      } catch (e) {
        setRenderError(e instanceof Error ? e.message : 'Could not build the font');
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [params, familyName]);

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const suggestion = useMutation({
    mutationFn: async () => {
      if (!apiKey) throw new Error('No API key');
      return suggestParams({ prompt, apiKey, provider: apiType, model, designTokens });
    },
    onSuccess: (s) => {
      setParams(s.params);
      setFamilyName(s.familyName);
      setNotes(s.notes);
    }
  });
  const isLoading = suggestion.isPending;

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

  const handleResetApiKey = () => {
    clearStoredKey();
    setApiKey(null);
    setHasApiKey(false);
    suggestion.reset();
  };

  const handlePromptChange = (newPrompt: string, newTokens: DesignTokens) => {
    setPrompt(newPrompt);
    setDesignTokens(newTokens);
  };

  const openFromLibrary = (entry: LibraryEntry) => {
    setParams(entry.params);
    setFamilyName(entry.name);
    setNotes(`“${entry.name}” by ${entry.author} (CC0). Adjust it freely with the sliders.`);
    setView('studio');
  };

  const handleGenerate = () => {
    if (!apiKey || !prompt.trim() || isLoading) return;
    suggestion.mutate();
  };

  const errorMessage = suggestion.error instanceof Error ? suggestion.error.message : null;

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {!hasApiKey && !skipKey && <ApiKeyInput onSubmit={handleApiKeySubmit} onSkip={() => setSkipKey(true)} />}
      {saving && <SaveDialog params={params} familyName={familyName} onClose={() => setSaving(false)} />}

      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">FontGen AI</h1>
            <p className="text-sm text-neutral-600 mt-0.5">
              AI chooses the design, a parametric type engine draws every letter
            </p>
          </div>
          <nav className="flex items-center gap-2" aria-label="Main">
            {(['studio', 'library'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-current={view === v ? 'page' : undefined}
                className={`text-sm px-4 py-1.5 rounded-md font-medium transition-colors ${
                  view === v ? 'bg-primary-300 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {v === 'studio' ? 'Studio' : 'Library'}
              </button>
            ))}
            {hasApiKey ? (
              <button
                onClick={handleResetApiKey}
                className="text-xs px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-md transition-colors"
              >
                Forget key
              </button>
            ) : (
              <button
                onClick={() => setSkipKey(false)}
                className="text-xs px-3 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 rounded-md transition-colors"
              >
                Add API key
              </button>
            )}
          </nav>
        </div>
      </header>

      {(hasApiKey || skipKey) && view === 'library' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4">
          <LibraryView onOpen={openFromLibrary} />
        </main>
      )}

      {(hasApiKey || skipKey) && view === 'studio' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Design Your Font</h2>
              <PromptBuilder onPromptChange={handlePromptChange} isLoading={isLoading} />

              <button
                onClick={handleGenerate}
                disabled={!apiKey || !prompt.trim() || isLoading}
                className="w-full mt-6 bg-primary-300 hover:bg-primary-400 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="spinner" style={{ borderWidth: '2px', width: '18px', height: '18px' }} />
                    Asking {API_PROVIDERS[apiType].label}…
                  </>
                ) : (
                  '✨ Design with AI'
                )}
              </button>
              {!apiKey && (
                <p className="text-xs text-neutral-500 mt-2">Add an API key to let AI design for you. The sliders and the library work without one.</p>
              )}

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Request failed:</span> {errorMessage}
                  </p>
                  <p className="text-xs text-red-600 mt-1">Check your API key, model name and spend limits</p>
                </div>
              )}

              {suggestion.isSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    <span className="font-medium">✓ Design applied.</span> Fine-tune it with the sliders.
                  </p>
                </div>
              )}

              {renderError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Font build failed:</span> {renderError}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow overflow-hidden h-[28rem]">
                <PreviewPanel glyphs={rendered?.glyphs} isLoading={isLoading} fontUrl={rendered?.fontUrl} />
              </div>
              <div className="overflow-y-auto max-h-[28rem]">
                <OutputPanel
                  qaStatus={rendered?.qaStatus}
                  fontUrl={rendered?.fontUrl}
                  glyphDataUrl={rendered?.paramsUrl}
                  isLoading={isLoading}
                />
              </div>
            </div>

            <ParameterPanel params={params} familyName={familyName} notes={notes} onChange={setParams} onSave={() => setSaving(true)} />
          </div>
        </main>
      )}

      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-neutral-600">
          <p>FontGen AI • Runs entirely in your browser – no data is sent to our servers</p>
        </div>
      </footer>
    </div>
  );
}
