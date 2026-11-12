import { useEffect, useRef } from 'react';

export interface ChatEntry {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  /** what the assistant changed */
  changes?: string[];
  undone?: boolean;
}

interface AiChatProps {
  entries: ChatEntry[];
  draft: string;
  onDraft: (value: string) => void;
  onSend: () => void;
  busy: boolean;
  hasKey: boolean;
  providerLabel: string;
  error: string | null;
  /** id of the entry whose change can be undone (the latest one) */
  undoId: number | null;
  onUndo: (id: number) => void;
}

const EXAMPLES = ['Friendly rounded font for a bakery', 'Make the lowercase letters taller', 'Make the G squarer'];

export function AiChat({ entries, draft, onDraft, onSend, busy, hasKey, providerLabel, error, undoId, onUndo }: AiChatProps) {
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView?.({ block: 'nearest' });
  }, [entries.length, busy]);

  const submit = () => {
    if (draft.trim() && !busy) onSend();
  };

  return (
    <div className="space-y-3">
      <div role="log" aria-live="polite" aria-label="Conversation with the AI" className="max-h-80 overflow-y-auto space-y-2 pr-1">
        {entries.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-neutral-600">
              Describe a font, or ask for changes later: “make it bolder”, “taller lowercase”, “round the G”. The AI can change the settings and reshape single letters.
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => onDraft(ex)}
                  className="px-3 py-1.5 min-h-[36px] text-xs rounded-full bg-neutral-100 hover:bg-primary-100 text-neutral-700 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {entries.map((e) => (
          <div key={e.id} className={`flex ${e.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                e.role === 'user' ? 'bg-neutral-900 text-white rounded-br-sm' : 'bg-neutral-100 text-neutral-800 rounded-bl-sm'
              }`}
            >
              {e.text}
              {e.role === 'assistant' && e.changes && e.changes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-neutral-300 text-xs text-neutral-600">
                  <span className="font-medium">{e.undone ? 'Undone: ' : 'Changed: '}</span>
                  {e.changes.join(' · ')}
                  {!e.undone && undoId === e.id && (
                    <button type="button" onClick={() => onUndo(e.id)} className="ml-2 underline font-medium text-neutral-800 min-h-[28px]">
                      Undo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {busy && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-neutral-100 px-3 py-2 text-sm text-neutral-600 flex items-center gap-2">
              <span className="spinner" style={{ borderWidth: '2px', width: '16px', height: '16px' }} />
              {providerLabel} is thinking…
            </div>
          </div>
        )}
        <div ref={end} />
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3" role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-end gap-2"
      >
        <textarea
          value={draft}
          onChange={(e) => onDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          maxLength={600}
          disabled={busy}
          aria-label="Message to the AI"
          placeholder={entries.length ? 'Ask for a change…' : 'Describe the font you want…'}
          className="flex-1 min-w-0 px-3 py-2.5 border border-neutral-300 rounded-md resize-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!draft.trim() || busy}
          className="shrink-0 min-h-[44px] px-4 bg-neutral-900 hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
        >
          Send
        </button>
      </form>
      {!hasKey && <p className="text-xs text-neutral-500">You will be asked for your own API key. It stays in your browser.</p>}
    </div>
  );
}
