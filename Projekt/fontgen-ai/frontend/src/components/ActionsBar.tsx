interface ActionsBarProps {
  styleLabel: string;
  disabled?: boolean;
  busy?: boolean;
  onDownload: () => void;
  onFamily: () => void;
  onShare: () => void;
}

/** One element: pinned to the bottom edge on phones and tablets, inline in the preview card on desktop. */
export function ActionsBar({ styleLabel, disabled, busy, onDownload, onFamily, onShare }: ActionsBarProps) {
  const off = disabled || busy;
  const secondary = `px-3 py-2 min-h-[44px] rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
    off ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
  }`;
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-neutral-200 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:static lg:z-auto lg:bg-transparent lg:backdrop-blur-none lg:border-0 lg:p-0">
      <div className="flex gap-2 max-w-7xl mx-auto">
        <button
          onClick={onDownload}
          disabled={off}
          className={`flex-1 px-4 py-2 min-h-[48px] rounded-md text-sm font-bold transition-colors ${
            off ? 'bg-neutral-300 text-white cursor-not-allowed' : 'bg-primary-300 hover:bg-primary-400 text-white'
          }`}
        >
          Download<span className="hidden sm:inline"> {styleLabel}</span>
        </button>
        <button onClick={onFamily} disabled={off} className={secondary} title="Regular, Bold, Italic and Bold Italic as a ZIP">
          {busy ? 'Building…' : 'All 4 styles'}
        </button>
        <button onClick={onShare} disabled={disabled} className={secondary} title="Add this font to the public library">
          Share
        </button>
      </div>
    </div>
  );
}
