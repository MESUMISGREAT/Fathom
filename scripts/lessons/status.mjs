// Where every lesson unit stands, worked out from the files (no state to keep in sync).
// Usage: node scripts/lessons/status.mjs [--all]
//   published  every lesson for the unit is on main
//   reviewed   all lessons are ai-checked but not yet published (run publish.sh)
//   drafted    lessons cover every objective but are not reviewed yet (run a reviewer)
//   partial    some lessons exist but objectives are missing (resume or rerun the writer)
//   todo       nothing written yet
// Without --all, prints counts plus the units that need action, in queue order.
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { label } from './templates.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..', '..');
const units = JSON.parse(readFileSync(path.join(here, 'units.json'), 'utf8'));
const onMain = new Set(execSync('git ls-files content/subjects', { cwd: root, encoding: 'utf8' }).split('\n'));
const syllabi = Object.fromEntries(
  ['9709', '9618', '9702', '9701'].map((c) => [c, parse(readFileSync(path.join(root, 'content/subjects', c, 'syllabus.yaml'), 'utf8'))]),
);

function unitState(u) {
  const dir = path.join(root, 'content/subjects', u.subject, 'lessons');
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => u.topics.some((t) => f.startsWith(`${t.prefix}-`))) : [];
  if (!files.length) return { state: 'todo', lessons: 0 };
  // A writer may be halfway through a file: one broken YAML must not hide the whole queue.
  const lessons = files.map((f) => {
    try {
      return { f, data: parse(readFileSync(path.join(dir, f), 'utf8')) };
    } catch (e) {
      return { f, data: null, error: e.message.split('\n')[0] };
    }
  });
  const broken = lessons.filter((l) => !l.data);
  if (broken.length) return { state: 'partial', lessons: files.length, missing: broken.map((l) => `broken YAML in ${l.f}`) };
  const taught = new Set(lessons.flatMap((l) => l.data.objectives ?? []));
  const codes = new Set(u.topics.map((t) => t.code));
  const needed = syllabi[u.subject].sections.flatMap((s) => s.topics).filter((t) => codes.has(t.code)).flatMap((t) => t.objectives.map((o) => o.code));
  const missing = needed.filter((c) => !taught.has(c));
  const published = lessons.every((l) => onMain.has(`content/subjects/${u.subject}/lessons/${l.f}`));
  const reviewed = lessons.every((l) => l.data.provenance?.status === 'ai-checked');
  const state = published && !missing.length ? 'published' : missing.length ? 'partial' : reviewed ? 'reviewed' : 'drafted';
  return { state, lessons: lessons.length, missing };
}

const rows = units.map((u) => ({ unit: label(u), ...unitState(u) }));
const counts = rows.reduce((a, r) => ({ ...a, [r.state]: (a[r.state] ?? 0) + 1 }), {});
console.log(`${rows.length} units: ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(', ')}`);
const show = process.argv.includes('--all') ? rows : rows.filter((r) => r.state !== 'published');
let todoShown = 0;
for (const r of show) {
  if (r.state === 'todo' && !process.argv.includes('--all') && ++todoShown > 6) continue;
  const extra = r.state === 'partial' ? ` (missing ${r.missing.join(', ')})` : '';
  console.log(`${r.state.padEnd(9)} ${r.unit}${r.lessons ? `  [${r.lessons} lessons]` : ''}${extra}`);
}
if (!process.argv.includes('--all') && todoShown > 6) console.log(`… ${todoShown - 6} more todo units (use --all)`);
