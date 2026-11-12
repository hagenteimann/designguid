interface AiPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
  hasKey: boolean;
  providerLabel: string;
  error: string | null;
  notes: string;
}

const EXAMPLES = ['Friendly rounded font for a bakery', 'Elegant serif for a wedding invitation', 'Loud brutalist poster headline'];

export function AiPrompt({ value, onChange, onSubmit, loading, hasKey, providerLabel, error, notes }: AiPromptProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim() && !loading) onSubmit();
      }}
      className="space-y-3"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        maxLength={500}
        disabled={loading}
        aria-label="Describe your font"
        placeholder="Describe the font you want…"
        className="w-full px-3 py-2.5 border border-neutral-300 rounded-md resize-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
      />
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onChange(ex)}
            disabled={loading}
            className="px-3 py-1.5 min-h-[36px] text-xs rounded-full bg-neutral-100 hover:bg-primary-100 text-neutral-700 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={!value.trim() || loading}
        className="w-full bg-neutral-900 hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="spinner" style={{ borderWidth: '2px', width: '18px', height: '18px' }} />
            Asking {providerLabel}…
          </>
        ) : (
          '✨ Design with AI'
        )}
      </button>
      {!hasKey && <p className="text-xs text-neutral-500">You will be asked for your own API key. It stays in your browser.</p>}

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3" role="alert">
          {error}
        </p>
      )}
      {!error && notes && (
        <p className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-md p-3">
          <span className="font-medium">Applied.</span> {notes}
        </p>
      )}
    </form>
  );
}
