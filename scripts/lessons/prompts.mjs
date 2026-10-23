// Writes the instructions for one lesson agent and prints the file path.
// Usage: node scripts/lessons/prompts.mjs <write|review> "<unit>" [YYYY-MM-DD]
//   unit is a label from units.json, e.g. "9709 1.6+1.7" (see status.mjs).
// The agent is then told: "Read your complete instructions from <path> and follow them exactly."
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { label, reviewerPrompt, writerPrompt } from './templates.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const units = JSON.parse(readFileSync(path.join(here, 'units.json'), 'utf8'));
const [kind, key, date = new Date().toISOString().slice(0, 10)] = process.argv.slice(2);
if (!['write', 'review'].includes(kind) || !key) {
  console.error('Usage: node scripts/lessons/prompts.mjs <write|review> "<unit>" [YYYY-MM-DD]');
  process.exit(2);
}
const unit = units.find((u) => label(u) === key);
if (!unit) {
  console.error(`No unit "${key}". Labels look like "9709 1.6+1.7"; run status.mjs to list them.`);
  process.exit(1);
}
const outDir = path.join(here, '..', '..', 'data', 'lesson-prompts');
mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, `${kind}-${key.replace(/[^\w.+]/g, '_')}.txt`);
writeFileSync(file, kind === 'write' ? writerPrompt(unit, date) : reviewerPrompt(unit, null, date));
console.log(file);
