/**
 * Validates all content: schemas, cross-references, maths rendering, diagram
 * keys and that every question's model answer passes the checker.
 * Usage: npm run content:check [-- --quiet] [-- --subject 9709] [-- --only name1,name2]
 * --only shows issues only for files whose path contains one of the given strings.
 */
import path from 'node:path';
import { loadContent } from '@/content/load';
import { validateContent } from '@/content/validate';
import { scanDiagrams } from './diagram-scan';

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const only = args.includes('--subject') ? args[args.indexOf('--subject') + 1] : undefined;
const match = args.includes('--only') ? args[args.indexOf('--only') + 1]!.split(',').filter(Boolean) : undefined;

const bundle = await loadContent();
// Diagram keys come from scanning the files, not importing them, so one broken diagram can't stop validation.
const scan = scanDiagrams();
for (const p of scan.problems) bundle.issues.push({ level: 'error', file: path.join(process.cwd(), p.split(':')[0]!), message: p.slice(p.indexOf(':') + 2) });
const { issues, coverage } = validateContent(bundle, new Set(scan.files.map((f) => f.key)));
// Forward slashes on every OS, so --only/--subject filters written as "lessons/foo" also match on Windows.
const rel = (f: string) => path.relative(process.cwd(), f).split(path.sep).join('/');
const shown = issues.filter(
  (i) => (!only || rel(i.file).includes(`/${only}/`)) && (!match || match.some((m) => rel(i.file).includes(m))),
);
const errors = shown.filter((i) => i.level === 'error');
const warnings = shown.filter((i) => i.level === 'warning');

for (const i of errors) console.log(`ERROR   ${rel(i.file)}: ${i.message}`);
if (!quiet) for (const i of warnings) console.log(`warning ${rel(i.file)}: ${i.message}`);

console.log('\nCoverage (objectives taught by a core lesson / with recall questions):');
for (const c of coverage) {
  if (only && c.code !== only) continue;
  const pct = (n: number) => (c.objectives ? Math.round((100 * n) / c.objectives) : 0);
  console.log(
    `  ${c.code}: ${c.withLesson}/${c.objectives} objectives (${pct(c.withLesson)}%) taught, ` +
      `${c.withQuestions}/${c.objectives} with questions; ${c.lessons} lessons, ${c.questions} questions`,
  );
}
console.log(`\n${errors.length} error(s), ${warnings.length} warning(s)`);
process.exit(errors.length > 0 ? 1 : 0);
