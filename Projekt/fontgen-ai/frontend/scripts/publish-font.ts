import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { validateSubmission } from '../src/lib/library';

// Runs in GitHub Actions after the maintainer labelled a submission issue "approved".
// The issue body is untrusted input: it is only parsed and validated here, never executed.
const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH as string, 'utf8'));
const number = Number(event?.issue?.number);
const body: string = typeof event?.issue?.body === 'string' ? event.issue.body : '';

if (!Number.isInteger(number) || number <= 0) throw new Error('No issue number in event');

const start = body.indexOf('{');
const end = body.lastIndexOf('}');
if (start < 0 || end <= start) throw new Error('No JSON found in the issue');

let raw: unknown;
try {
  raw = JSON.parse(body.slice(start, end + 1));
} catch {
  throw new Error('The font data in the issue is not valid JSON');
}

const sub = validateSubmission(raw);
const dir = 'public/library/fonts';
const file = `${dir}/${number}.json`;

if (existsSync(file)) {
  console.log(`Font #${number} is already published, nothing to do.`);
} else {
  mkdirSync(dir, { recursive: true });
  const entry = {
    id: number,
    name: sub.name,
    author: sub.author,
    description: sub.description,
    license: sub.license,
    params: sub.params,
    createdAt: new Date().toISOString()
  };
  writeFileSync(file, JSON.stringify(entry, null, 2) + '\n');
  console.log(`Published "${sub.name}" as #${number}`);
}
