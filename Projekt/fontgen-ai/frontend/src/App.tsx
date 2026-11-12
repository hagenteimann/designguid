import { ReactNode, useState, useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ApiKeyInput, ApiKeySubmit } from './components/ApiKeyInput';
import { PreviewCard } from './components/PreviewCard';
import { ActionsBar } from './components/ActionsBar';
import { PresetPicker } from './components/PresetPicker';
import { AiChat, ChatEntry } from './components/AiChat';
import { TuneControls } from './components/TuneControls';
import { GlyphEditor } from './components/GlyphEditor';
import { Disclosure } from './components/Disclosure';
import { SaveDialog } from './components/SaveDialog';
import { LibraryView } from './components/LibraryView';
import { ApiProvider, API_PROVIDERS, GlyphInfo, QAStatus, downloadFont } from './services/api';
import { DEFAULT_PARAMS, FontParams, Preset } from './lib/engine/params';
import { renderFont } from './lib/generate';
import { chatTurn } from './lib/chat';
import { STYLE_LABEL, StyleKey } from './lib/engine/variants';
import { buildFamilyZip, fileSlug, styleFileName } from './lib/family';
import { LibraryEntry } from './lib/library';

const KEY_STORE = 'fontgen_api_key';
const TYPE_STORE = 'fontgen_api_type';
const MODEL_STORE = 'fontgen_api_model';

type View = 'studio' | 'library';

interface RenderState {
  fontUrl: string;
  paramsUrl: string;
  glyphs: GlyphInfo[];
  qaStatus: QAStatus;
}

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-xl shadow p-4 space-y-3" aria-label={title}>
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-7 h-7 rounded-full bg-primary-100 text-primary-600 text-sm font-bold flex items-center justify-center" aria-hidden="true">
          {n}
        </span>
        <div>
          <h2 className="font-bold text-neutral-900 leading-7">{title}</h2>
          {hint && <p className="text-xs text-neutral-500 -mt-0.5">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function App() {
  const [view, setView] = useState<View>('studio');
  const [saving, setSaving] = useState(false);
  const [keyDialog, setKeyDialog] = useState(false);
  const [pendingText, setPendingText] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiType, setApiType] = useState<ApiProvider>('gemini');
  const [model, setModel] = useState('');
  const [draft, setDraft] = useState('');
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [chatUndo, setChatUndo] = useState<Record<number, { params: FontParams; name: string }>>({});
  const nextId = useRef(1);

  const [params, setParams] = useState<FontParams>(DEFAULT_PARAMS);
  const [familyName, setFamilyName] = useState('Sans');
  const [style, setStyle] = useState<StyleKey>('regular');
  const [rendered, setRendered] = useState<RenderState | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [zipBusy, setZipBusy] = useState(false);
  const urls = useRef<string[]>([]);

  // Restore a saved key (localStorage if remembered, else sessionStorage)
  useEffect(() => {
    try {
      const store = localStorage.getItem(KEY_STORE) ? localStorage : sessionStorage;
      const stored = store.getItem(KEY_STORE);
      if (stored) {
        setApiKey(stored);
        setApiType((store.getItem(TYPE_STORE) as ApiProvider) || 'gemini');
        setModel(store.getItem(MODEL_STORE) || '');
      }
    } catch {
      /* storage unavailable (private mode) */
    }
  }, []);

  // Rebuild the font locally whenever the settings change (fast, free, no network)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const r = renderFont(params, familyName, style);
        const fontUrl = URL.createObjectURL(new Blob([r.buffer], { type: 'font/otf' }));
        const paramsUrl = URL.createObjectURL(new Blob([JSON.stringify({ familyName, params }, null, 2)], { type: 'application/json' }));
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
  }, [params, familyName, style]);

  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const chatMutation = useMutation({
    mutationFn: async (v: { message: string; history: ChatEntry[]; params: FontParams; name: string }) => {
      if (!apiKey) throw new Error('No API key');
      return chatTurn({
        message: v.message,
        history: v.history.map(({ role, text }) => ({ role, text })),
        params: v.params,
        familyName: v.name,
        apiKey,
        provider: apiType,
        model
      });
    },
    onSuccess: (r, v) => {
      const id = nextId.current++;
      if (r.changes.length) {
        setParams(r.params);
        setFamilyName(r.familyName);
        setChatUndo((u) => ({ ...u, [id]: { params: v.params, name: v.name } }));
      }
      setChat((c) => [...c, { id, role: 'assistant', text: r.reply, changes: r.changes }]);
    }
  });

  const sendChat = (text: string) => {
    const message = text.trim();
    if (!message || chatMutation.isPending) return;
    if (!apiKey) {
      setPendingText(message);
      setKeyDialog(true);
      return;
    }
    chatMutation.reset();
    setChat((c) => [...c, { id: nextId.current++, role: 'user', text: message }]);
    setDraft('');
    chatMutation.mutate({ message, history: chat, params, name: familyName });
  };

  // Send the message that was waiting for the key
  useEffect(() => {
    if (pendingText && apiKey) {
      const t = pendingText;
      setPendingText(null);
      sendChat(t);
    }
  }, [pendingText, apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const lastApplied = [...chat].reverse().find((e) => e.role === 'assistant' && e.changes?.length && chatUndo[e.id]);
  const undoChat = (id: number) => {
    const snap = chatUndo[id];
    if (!snap) return;
    setParams(snap.params);
    setFamilyName(snap.name);
    setChat((c) => c.map((e) => (e.id === id ? { ...e, undone: true } : e)));
    setChatUndo((u) => {
      const n = { ...u };
      delete n[id];
      return n;
    });
  };

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

  const handleKeySubmit = ({ apiKey: key, provider, model: m, remember }: ApiKeySubmit) => {
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
    setKeyDialog(false);
  };

  const forgetKey = () => {
    clearStoredKey();
    setApiKey(null);
    chatMutation.reset();
  };

  const pickPreset = (preset: Preset) => {
    setParams({ ...DEFAULT_PARAMS, ...preset.params });
    setFamilyName(preset.label);
  };

  const openFromLibrary = (entry: LibraryEntry) => {
    setParams(entry.params);
    setFamilyName(entry.name);
    setStyle('regular');
    setView('studio');
  };

  const downloadFamily = async () => {
    setZipBusy(true);
    await new Promise((r) => setTimeout(r, 30));
    try {
      downloadFont(buildFamilyZip(params, familyName), `${fileSlug(familyName)}-family.zip`);
    } finally {
      setZipBusy(false);
    }
  };

  const downloadCurrent = async () => {
    if (!rendered) return;
    const blob = await (await fetch(rendered.fontUrl)).blob();
    downloadFont(blob, styleFileName(familyName, style));
  };

  const aiError = chatMutation.error instanceof Error ? `${chatMutation.error.message}. Check your key, model name and spending limit.` : null;
  const tab = (v: View) =>
    `text-sm px-4 py-2 min-h-[44px] rounded-md font-medium transition-colors ${view === v ? 'bg-primary-300 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`;

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {keyDialog && (
        <ApiKeyInput
          onSubmit={handleKeySubmit}
          onClose={() => {
            setKeyDialog(false);
            setPendingText(null);
          }}
        />
      )}
      {saving && <SaveDialog params={params} familyName={familyName} onClose={() => setSaving(false)} />}

      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-xl font-bold text-neutral-900">FontGen</h1>
          <nav className="flex items-center gap-2" aria-label="Main">
            <button onClick={() => setView('studio')} aria-current={view === 'studio' ? 'page' : undefined} className={tab('studio')}>
              Studio
            </button>
            <button onClick={() => setView('library')} aria-current={view === 'library' ? 'page' : undefined} className={tab('library')}>
              Library
            </button>
            <button
              onClick={apiKey ? forgetKey : () => setKeyDialog(true)}
              className="text-xs px-3 py-2 min-h-[44px] rounded-md text-neutral-600 hover:bg-neutral-100 transition-colors"
              title={apiKey ? 'Remove the saved key from this browser' : 'Connect your own AI key'}
            >
              {apiKey ? 'AI connected · Forget key' : 'Connect AI'}
            </button>
          </nav>
        </div>
      </header>

      {view === 'library' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4">
          <LibraryView onOpen={openFromLibrary} />
        </main>
      )}

      {view === 'studio' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 pb-28 lg:pb-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-7 min-w-0 lg:sticky lg:top-4">
            <PreviewCard
              name={familyName}
              onNameChange={setFamilyName}
              style={style}
              onStyleChange={setStyle}
              fontUrl={rendered?.fontUrl}
              glyphs={rendered?.glyphs ?? []}
              qa={rendered?.qaStatus}
              paramsUrl={rendered?.paramsUrl}
              paramsName={`${fileSlug(familyName)}.params.json`}
            >
              {renderError && (
                <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3" role="alert">
                  Font build failed: {renderError}
                </p>
              )}
              <ActionsBar
                styleLabel={STYLE_LABEL[style]}
                disabled={!rendered}
                busy={zipBusy}
                onDownload={downloadCurrent}
                onFamily={downloadFamily}
                onSave={() => setSaving(true)}
              />
            </PreviewCard>
          </div>

          <div className="lg:col-span-5 space-y-4 min-w-0">
            <Step n={1} title="Pick a starting point">
              <PresetPicker current={params} onPick={pickPreset} />
            </Step>

            <Step n={2} title="Chat with the AI" hint="Optional: describe a font or ask for changes, also to single letters">
              <AiChat
                entries={chat}
                draft={draft}
                onDraft={setDraft}
                onSend={() => sendChat(draft)}
                busy={chatMutation.isPending}
                hasKey={!!apiKey}
                providerLabel={API_PROVIDERS[apiType].label}
                error={aiError}
                undoId={lastApplied ? lastApplied.id : null}
                onUndo={undoChat}
              />
            </Step>

            <Step n={3} title="Fine-tune" hint="Every change updates all letters at once">
              <TuneControls params={params} onChange={setParams} />
              <Disclosure title="Edit letter shapes (advanced)" lazy>
                <GlyphEditor params={params} onChange={setParams} ai={apiKey ? { apiKey, provider: apiType, model } : null} onConnect={() => setKeyDialog(true)} />
              </Disclosure>
            </Step>

            <Step n={4} title="Save it to the public library" hint="Everyone can use your font for free (CC0)">
              <p className="text-sm text-neutral-600">Give your font a name and your alias, and it appears in the library with your credit.</p>
              <button
                onClick={() => setSaving(true)}
                disabled={!rendered}
                className="w-full bg-primary-300 hover:bg-primary-400 disabled:bg-neutral-300 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Save to public library
              </button>
            </Step>
          </div>
        </main>
      )}

      <footer className="bg-white border-t border-neutral-200 mt-auto hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-3 text-center text-xs text-neutral-500">
          Runs in your browser. Nothing is sent anywhere unless you share a font to the library.
        </div>
      </footer>
    </div>
  );
}
