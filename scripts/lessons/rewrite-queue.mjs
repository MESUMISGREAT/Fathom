// Builds the rewrite queue from the student-read scores: every 9709 lesson scoring below 8, worst first.
// Usage: node scripts/lessons/rewrite-queue.mjs <path to 9709-student-read.md>
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

const AFTER_FIX = {
  'p3-vectors-line-relationships': 8.5, 'stats-data-cfg-usage': 8, 'complex-numbers-conjugate-pairs': 8,
  'p3-algebra-binomial-rational-expansion': 7.5, 'complex-numbers-regions-loci': 6, 'p3-int-standard-integrals': 6,
  'newtons-laws-first-second': 7.5, 'newtons-laws-mass-weight': 5.5, 'newtons-laws-inclined-planes': 7, 'work-energy-power-gpe-ke': 7,
  'work-energy-power-power': 6, 'p3-int-f-prime-over-f': 7.5, 'p3-int-partial-fractions': 7.5, 'p3-numerical-solution-rearranging': 7,
  'differential-equations-separable': 7, 'p3-trig-sec-cosec-cot': 7, 'p3-trig-pythagorean-identities': 7.5, 'p3-trig-r-form': 7.5,
  'differential-equations-particular': 7.5, 'differential-equations-formulating': 7.5,
};
const dir = 'content/subjects/9709/lessons';
const byTopic = new Map();
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yaml'))) {
  const d = YAML.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const t = String(d.topic);
  byTopic.set(t, [...(byTopic.get(t) ?? []), { id: d.id, title: d.title, order: d.order, status: d.provenance?.status }]);
}
for (const l of byTopic.values()) l.sort((a, b) => a.order - b.order);

const rows = [];
let topic = '';
for (const line of fs.readFileSync(process.argv[2], 'utf8').split('\n')) {
  const h = line.match(/^## (\d+\.\d+)/);
  if (h) { topic = h[1]; continue; }
  const m = line.match(/^([\d.]+) \| ([^|]+) \| (.*)$/);
  if (!m || !byTopic.has(topic)) continue;
  const lesson = byTopic.get(topic).find((l) => l.title.trim() === m[2].trim());
  if (!lesson) continue;
  const score = AFTER_FIX[lesson.id] ?? Number(m[1]);
  if (score < 8) rows.push({ score, topic, id: lesson.id, status: lesson.status, why: m[3].slice(0, 150) });
}
rows.sort((a, b) => a.score - b.score || a.topic.localeCompare(b.topic, undefined, { numeric: true }));
for (const r of rows) console.log(`${r.score}\t${r.topic}\t${r.id}\t${r.status}\t${r.why}`);
console.error(`${rows.length} lessons below 8 (${rows.filter((r) => r.score < 6).length} below 6)`);
