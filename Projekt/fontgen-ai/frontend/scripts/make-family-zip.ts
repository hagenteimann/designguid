import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { buildFamilyZip } from '../src/lib/family';
import { sanitizeParams } from '../src/lib/engine/params';
import { cleanText, zipAssetName } from '../src/lib/library';

// Usage: node make-family-zip.cjs <library entry .json> <output dir>
// Builds the four-style download package of one library font (same code as the studio).
const [file, outDir] = process.argv.slice(2);
if (!file || !outDir) throw new Error('usage: make-family-zip <entry.json> <outDir>');

const entry = JSON.parse(readFileSync(file, 'utf8'));
const name = cleanText(entry.name, 40);
if (!name || entry.id === undefined) throw new Error(`invalid library entry: ${file}`);

(async () => {
  const blob = buildFamilyZip(sanitizeParams(entry.params), name);
  mkdirSync(outDir, { recursive: true });
  const out = `${outDir}/${zipAssetName(entry.id, name)}`;
  writeFileSync(out, Buffer.from(await blob.arrayBuffer()));
  console.log(out);
})();
