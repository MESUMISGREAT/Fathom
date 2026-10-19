/**
 * Validates all content: schemas, cross-references, maths rendering, diagram
 * keys and that every question's model answer passes the checker.
 * Usage: npm run content:check [-- --quiet] [-- --subject 9709]
 */
import path from 'node:path';
import { loadContent } from '@/content/load';
import { validateContent } from '@/content/validate';
import { diagrams } from '@/components/diagrams';

const args = process.argv.slice(2);
const quiet = args.includes('--quiet');
const only = args.includes('--subject') ? args[args.indexOf('--subject') + 1] : undefined;

const bundle = await loadContent();
const { issues, coverage } = validateContent(bundle, new Set(Object.keys(diagrams)));
const rel = (f: string) => path.relative(process.cwd(), f);
const shown = issues.filter((i) => !only || rel(i.file).includes(`/${only}/`));
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
