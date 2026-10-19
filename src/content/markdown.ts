/**
 * Markdown + KaTeX rendering for content fields. Runs at import/validation
 * time (never in the browser), so maths errors surface as validation errors
 * instead of reaching students. Raw HTML in markdown is dropped.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';

export class MarkdownError extends Error {}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype) // allowDangerousHtml is off: raw HTML is not passed through
  .use(rehypeKatex, { strict: 'ignore', output: 'htmlAndMathml' })
  .use(rehypeStringify);

/** Render a markdown field to HTML. Throws MarkdownError on KaTeX errors. */
export function renderMd(md: string): string {
  const file = processor.processSync(md);
  const problems = file.messages.filter((m) => m.fatal !== null || m.source === 'rehype-katex');
  if (problems.length > 0) {
    throw new MarkdownError(problems.map((m) => m.reason).join('; '));
  }
  return String(file).trim();
}

/** Render a short field (option, label) without the wrapping paragraph. */
export function renderInline(md: string): string {
  const html = renderMd(md);
  const m = /^<p>([\s\S]*)<\/p>$/.exec(html);
  return m && !m[1]!.includes('<p>') ? m[1]! : html;
}

/**
 * Cloze prompts mark blanks as {{1}}, {{2}}. After rendering we swap the
 * markers for labelled text inputs, which the lesson form submits by name.
 */
export function renderCloze(md: string, blankCount: number): string {
  const html = renderMd(md);
  const seen = new Set<number>();
  const out = html.replace(/\{\{(\d+)\}\}/g, (_, n: string) => {
    const i = Number(n);
    seen.add(i);
    return `<input class="cloze-input" type="text" name="blank-${i}" aria-label="Blank ${i}" autocomplete="off" autocapitalize="off" spellcheck="false" />`;
  });
  for (let i = 1; i <= blankCount; i++) {
    if (!seen.has(i)) throw new MarkdownError(`cloze prompt is missing blank {{${i}}}`);
  }
  if (seen.size !== blankCount) throw new MarkdownError('cloze prompt has blanks without accepted answers');
  return out;
}
