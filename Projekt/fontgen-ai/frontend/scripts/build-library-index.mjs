import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const TAG = 'library';
const dir = 'public/library/fonts';
mkdirSync(dir, { recursive: true });

const slug = (name) => String(name).replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '') || 'font';
const zipName = (id, name) => `${id}-${slug(name)}-family.zip`;

/** Download counts come from GitHub: every font package is an asset of the "library" release. */
async function releaseAssets() {
  const repo = process.env.GITHUB_REPOSITORY;
  if (!repo) return null;
  const api = process.env.GITHUB_API_URL || 'https://api.github.com';
  const headers = { Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) };
  try {
    const rel = await fetch(`${api}/repos/${repo}/releases/tags/${TAG}`, { headers });
    if (!rel.ok) return null;
    const { id } = await rel.json();
    const assets = new Map();
    for (let page = 1; page <= 10; page++) {
      const res = await fetch(`${api}/repos/${repo}/releases/${id}/assets?per_page=100&page=${page}`, { headers });
      if (!res.ok) break;
      const list = await res.json();
      for (const a of list) assets.set(a.name, a.download_count);
      if (list.length < 100) break;
    }
    return assets;
  } catch (e) {
    console.warn(`library: could not read download counts: ${e.message}`);
    return null;
  }
}

const assets = await releaseAssets();

const fonts = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  try {
    const font = JSON.parse(readFileSync(`${dir}/${file}`, 'utf8'));
    const zip = zipName(font.id, font.name);
    if (assets && assets.has(zip)) {
      font.zip = zip;
      font.downloads = assets.get(zip);
    }
    fonts.push(font);
  } catch (e) {
    console.warn(`library: skipping ${file}: ${e.message}`);
  }
}
fonts.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
writeFileSync('public/library/index.json', JSON.stringify({ version: 1, fonts }));
console.log(`library: indexed ${fonts.length} fonts${assets ? `, ${fonts.filter((f) => f.zip).length} with download packages` : ' (no download counts)'}`);
