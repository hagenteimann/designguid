import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const dir = 'public/library/fonts';
mkdirSync(dir, { recursive: true });

const fonts = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  try {
    fonts.push(JSON.parse(readFileSync(`${dir}/${file}`, 'utf8')));
  } catch (e) {
    console.warn(`library: skipping ${file}: ${e.message}`);
  }
}
fonts.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
writeFileSync('public/library/index.json', JSON.stringify({ version: 1, fonts }));
console.log(`library: indexed ${fonts.length} fonts`);
