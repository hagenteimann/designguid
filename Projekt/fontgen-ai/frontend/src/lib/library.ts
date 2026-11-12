import { FontParams, sanitizeParams } from './engine/params';

export const REPO = 'hagenteimann/designguid';
export const LICENSE = 'CC0-1.0';
export const RELEASE_TAG = 'library';

export const fileSlug = (name: string) => name.replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'font';

/** Name of the download package of a library font, stored as an asset of the "library" release. */
export const zipAssetName = (id: string | number, name: string) => `${id}-${fileSlug(name)}-family.zip`;

export const zipDownloadUrl = (asset: string) => `https://github.com/${REPO}/releases/download/${RELEASE_TAG}/${encodeURIComponent(asset)}`;

export interface LibraryEntry {
  id: string | number;
  name: string;
  author: string;
  description: string;
  license: typeof LICENSE;
  params: FontParams;
  createdAt: string;
  /** package in the release, only set once it exists */
  zip?: string;
  /** downloads of that package, counted by GitHub */
  downloads?: number;
}

export interface Submission {
  name: string;
  author: string;
  description: string;
  license: typeof LICENSE;
  consent: true;
  params: FontParams;
}

/** Plain text only: strips control characters and angle brackets, collapses whitespace, limits length. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001f\u007f<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Validates untrusted submission data (from the GitHub issue). Throws with a readable reason. */
export function validateSubmission(raw: unknown): Submission {
  if (!raw || typeof raw !== 'object') throw new Error('Submission is not a JSON object');
  const r = raw as Record<string, unknown>;
  if (r.consent !== true) throw new Error('CC0 consent is missing');
  if (r.license !== LICENSE) throw new Error(`License must be ${LICENSE}`);
  const name = cleanText(r.name, 40);
  if (name.length < 2) throw new Error('Font name must be at least 2 characters');
  if (!r.params || typeof r.params !== 'object') throw new Error('Design parameters are missing');
  return {
    name,
    author: cleanText(r.author, 40) || 'Anonymous',
    description: cleanText(r.description, 200),
    license: LICENSE,
    consent: true,
    params: sanitizeParams(r.params)
  };
}

/** Readable header, compact parameters (hand edits would otherwise fill the URL with whitespace). */
function submissionJson(sub: Submission): string {
  const { params, ...rest } = sub;
  return `${JSON.stringify(rest, null, 2).slice(0, -2)},\n  "params": ${JSON.stringify(params)}\n}`;
}

export const MAX_URL_LENGTH = 7000;

export function submissionUrl(sub: Submission): string {
  const q = new URLSearchParams({
    template: 'font-submission.yml',
    title: `[Font] ${sub.name}`,
    submission: submissionJson(sub)
  });
  return `https://github.com/${REPO}/issues/new?${q.toString()}`;
}

export async function fetchLibrary(): Promise<LibraryEntry[]> {
  const res = await fetch('./library/index.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Library could not be loaded (${res.status})`);
  const data = await res.json();
  const list: unknown[] = Array.isArray(data?.fonts) ? data.fonts : [];
  const out: LibraryEntry[] = [];
  for (const item of list) {
    const e = item as Record<string, unknown>;
    const name = cleanText(e?.name, 40);
    if (!name || !e.params || typeof e.params !== 'object') continue;
    out.push({
      id: typeof e.id === 'number' || typeof e.id === 'string' ? e.id : name,
      name,
      author: cleanText(e.author, 40) || 'Anonymous',
      description: cleanText(e.description, 200),
      license: LICENSE,
      params: sanitizeParams(e.params),
      createdAt: typeof e.createdAt === 'string' ? e.createdAt : '',
      zip: typeof e.zip === 'string' && /^[\w.-]+$/.test(e.zip) ? e.zip : undefined,
      downloads: typeof e.downloads === 'number' && isFinite(e.downloads) && e.downloads >= 0 ? Math.floor(e.downloads) : undefined
    });
  }
  return out;
}
