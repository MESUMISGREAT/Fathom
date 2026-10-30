// Finds symbols used in a lesson's maths that the prose never explains.
// Usage: node scripts/lessons/symbols.mjs <subject> [--list] [--apply]
//   (no flag)  summary counts
//   --list     one line per lesson: the unexplained symbols
//   --apply    insert a "Key to the symbols" block where every unexplained symbol is in the dictionary
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { DICT } from './symbol-dictionary.mjs';

const [subject, ...flags] = process.argv.slice(2);
const dir = path.join('content/subjects', subject, 'lessons');
const KEY_TITLE = 'Key to the symbols';
const MATH = /\$\$[\s\S]*?\$\$|\$[^$\n]*\$/g;

const blockTexts = (b) => [b.body, b.problem, b.answer, ...(b.steps ?? []), ...(b.items ?? []).flatMap((i) => (typeof i === 'string' ? [i] : [i.wrong, i.right]))].filter(Boolean);

// A symbol is a Latin/Greek letter with an optional subscript, e.g. v, \theta, v_0, F_{net}.
const SYM = /(\\(?:theta|alpha|beta|gamma|delta|Delta|lambda|mu|rho|sigma|omega|Omega|phi|epsilon|varepsilon|tau|eta|pi)|[A-Za-z])(?:_\{[A-Za-z0-9]+\}|_[A-Za-z0-9])?/g;
const GREEK = new Set(['theta', 'alpha', 'beta', 'gamma', 'delta', 'Delta', 'lambda', 'mu', 'rho', 'sigma', 'omega', 'phi', 'epsilon', 'varepsilon', 'tau', 'eta']);

function symbolsIn(math) {
  const stripped = math
    .replace(/\\(?:text|mathrm|operatorname|mathbf)\{[^}]*\}/g, ' ')
    // Drop every LaTeX command (\int, \log, \leq ...) except Greek letters, so command letters are not read as variables.
    .replace(/\\([a-zA-Z]+)/g, (m, name) => (GREEK.has(name) ? m : ' '))
    .replace(/\$/g, ' ');
  return [...stripped.matchAll(SYM)].map((m) => m[0]);
}

function explained(sym, prose) {
  const s = sym.replace(/[\\_{}]/g, (c) => `\\${c}`);
  const re = new RegExp(`\\$[^$]*${s}[^$]*\\$[^.\\n]{0,40}\\b(?:is|are|means|represents|denotes|stands for|measures|=)\\b|\\b(?:let|where|call|with|and)\\b[^.\\n]{0,40}\\$[^$]*${s}[^$]*\\$`, 'i');
  return re.test(prose);
}

let withGap = 0, fixable = 0, applied = 0, total = 0;
const unknown = new Map();
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.yaml')).sort()) {
  const file = path.join(dir, f);
  const raw = fs.readFileSync(file, 'utf8');
  const doc = YAML.parse(raw);
  if (!doc?.blocks) continue;
  total++;
  if (doc.blocks.some((b) => b.title === KEY_TITLE)) continue;
  const teaching = doc.blocks.filter((b) => ['explain', 'definition', 'intuition', 'example', 'deeper'].includes(b.type));
  const prose = teaching.flatMap(blockTexts).join('\n');
  const used = new Set(), noKey = new Set();
  for (const m of prose.match(MATH) ?? []) for (const s of symbolsIn(m)) used.add(s);
  const topic = String(doc.topic ?? '');
  const meaning = (s) => DICT[`${subject}:${topic}`]?.[s] ?? DICT[`${subject}:${topic.split('.')[0]}`]?.[s] ?? DICT[subject]?.[s] ?? DICT.common?.[s];
  // Bare generic letters (the unknown x, a constant k ...) are clear from the sentence, so they are not keyed.
  const real = [...used].filter((s) => !(DICT.generic[subject] ?? []).includes(s)).filter((s) => !explained(s, prose));
  if (!real.length) continue;
  withGap++;
  const missing = real.filter((s) => meaning(s) === undefined);
  missing.forEach((s) => unknown.set(s, (unknown.get(s) ?? 0) + 1));
  if (flags.includes('--list')) console.log(`${f.replace('.yaml', '')} [${topic}] ${real.join(' ')}${missing.length ? '   ?? ' + missing.join(' ') : ''}`);
  if (missing.length) continue;
  fixable++;
  if (flags.includes('--apply')) {
    const rows = real.map((s) => `| $${s}$ | ${meaning(s)} |`).join('\n');
    const block = `  - type: explain\n    title: ${KEY_TITLE}\n    body: |\n      The main symbols used in this lesson:\n\n      | Symbol | Meaning |\n      | --- | --- |\n${rows.replace(/^/gm, '      ')}\n\n`;
    // Insert before the first explain/definition/intuition/example block after the objective block.
    const lines = raw.split('\n');
    const at = lines.findIndex((l, i) => /^  - type: (explain|definition|intuition|example)\b/.test(l) && i > lines.findIndex((x) => /^  - type: objective/.test(x)));
    if (at < 0) continue;
    lines.splice(at, 0, ...block.replace(/\n$/, '').split('\n'));
    fs.writeFileSync(file, lines.join('\n'));
    applied++;
  }
}
console.log(`\n${subject}: ${total} lessons, ${withGap} with unexplained symbols, ${fixable} fully covered by the dictionary, ${applied} keys written`);
console.log('symbols the dictionary lacks:', [...unknown].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([s, n]) => `${s}(${n})`).join(' '));
