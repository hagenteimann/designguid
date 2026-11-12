import { useEffect, useMemo, useState } from 'react';
import { LibraryEntry, fetchLibrary } from '../lib/library';
import { textPath } from '../lib/preview';
import { downloadFont } from '../services/api';
import { buildFamilyZip, fileSlug } from '../lib/family';

interface LibraryViewProps {
  onOpen: (entry: LibraryEntry) => void;
}

const PAGE = 24;

function Card({ entry, onOpen }: { entry: LibraryEntry; onOpen: (e: LibraryEntry) => void }) {
  const preview = useMemo(() => {
    try {
      return textPath(entry.params, 'Hamburgefonstiv', 46);
    } catch {
      return null;
    }
  }, [entry]);

  const downloadFamily = () => downloadFont(buildFamilyZip(entry.params, entry.name), `${fileSlug(entry.name)}-family.zip`);

  return (
    <article className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
      <div className="overflow-hidden bg-neutral-50 rounded-md px-3 py-2" aria-label={`Preview of ${entry.name}`}>
        {preview && (
          <svg viewBox={`0 0 ${preview.width} ${preview.height}`} className="w-full h-auto max-h-16" role="img" aria-label="Hamburgefonstiv">
            <path d={preview.d} fill="currentColor" className="text-neutral-900" />
          </svg>
        )}
      </div>
      <div>
        <h3 className="font-bold text-neutral-900">{entry.name}</h3>
        <p className="text-xs text-neutral-500">by {entry.author} · free to use (CC0)</p>
        {entry.description && <p className="text-sm text-neutral-600 mt-1">{entry.description}</p>}
      </div>
      <div className="flex gap-2 mt-auto">
        <button onClick={() => onOpen(entry)} className="flex-1 px-3 py-2 min-h-[44px] rounded-md text-sm font-medium bg-primary-300 hover:bg-primary-400 text-white transition-colors">
          Open in studio
        </button>
        <button onClick={downloadFamily} className="flex-1 px-3 py-2 min-h-[44px] rounded-md text-sm font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-colors" title="Regular, Bold, Italic and Bold Italic as a ZIP">
          Download
        </button>
      </div>
    </article>
  );
}

export function LibraryView({ onOpen }: LibraryViewProps) {
  const [entries, setEntries] = useState<LibraryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);

  useEffect(() => {
    fetchLibrary().then(setEntries).catch((e) => setError(e instanceof Error ? e.message : 'Library could not be loaded'));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (entries ?? []).filter((e) => !q || e.name.toLowerCase().includes(q) || e.author.toLowerCase().includes(q));
  }, [entries, query]);

  return (
    <section className="space-y-4 min-w-0" aria-label="Public font library">
      <div className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Public library</h2>
          <p className="text-sm text-neutral-500">Community fonts, free to use under CC0. Save yours from the studio.</p>
        </div>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShown(PAGE); }}
          placeholder="Search name or author"
          aria-label="Search fonts"
          className="px-3 py-2.5 border border-neutral-300 rounded-md text-sm w-full sm:w-64"
        />
      </div>

      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}
      {!entries && !error && <p className="text-sm text-neutral-500">Loading…</p>}
      {entries && filtered.length === 0 && <p className="text-sm text-neutral-500">No fonts found.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(0, shown).map((e) => (
          <Card key={e.id} entry={e} onOpen={onOpen} />
        ))}
      </div>

      {filtered.length > shown && (
        <button onClick={() => setShown(shown + PAGE)} className="block mx-auto px-4 py-2 rounded-md text-sm font-medium bg-white shadow hover:bg-neutral-100">
          Show more
        </button>
      )}
    </section>
  );
}
