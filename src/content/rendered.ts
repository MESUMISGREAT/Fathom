/**
 * Turns validated content into what is stored and served: blocks with
 * pre-rendered HTML, a public view of each question (safe to send before
 * answering) and a reveal (answer + explanation, sent only after answering).
 */
import { toSigFigs } from '@/domain/answers/numbers';
import { renderCloze, renderInline, renderMd } from './markdown';
import type { Block, LessonFile, Question } from './schema';

export type RenderedBlock =
  | { type: 'objective'; html: string }
  | { type: 'explain'; title?: string; html: string }
  | { type: 'definition'; term: string; html: string }
  | { type: 'intuition'; title?: string; html: string }
  | { type: 'example'; title?: string; problemHtml: string; stepsHtml: string[]; answerHtml?: string }
  | { type: 'diagram'; diagram: string; alt: string; captionHtml?: string }
  | { type: 'misconceptions'; items: Array<{ wrongHtml: string; rightHtml: string }> }
  | { type: 'exam'; html: string }
  | { type: 'takeaways'; itemsHtml: string[] }
  | { type: 'check'; title?: string; questionIds: string[] }
  | { type: 'deeper'; title: string; html: string }
  | { type: 'enrichment'; title: string; html: string };

export interface QuestionView {
  id: string;
  format: Question['format'];
  difficulty: number;
  label: string;
  promptHtml: string;
  options?: string[];
  fields?: Array<{ labelHtml?: string; unit?: string; typedUnit: boolean; sigFigs?: number }>;
  variables?: string[];
  lines?: string[];
  blankCount?: number;
  keyPointCount?: number;
}

export interface QuestionReveal {
  explanationHtml: string;
  correctOption?: number;
  whyHtml?: Array<string | null>;
  expected?: string[];
  answerHtml?: string;
  blanks?: string[];
  errorLine?: number;
  fixHtml?: string;
  keyPoints?: string[];
}

export const questionId = (lessonId: string, localId: string) => `${lessonId}/${localId}`;

export function formatLabel(q: Question): string {
  switch (q.format) {
    case 'mcq':
      return 'Multiple choice';
    case 'numeric':
      return 'Calculate';
    case 'expression':
      return 'Write an expression';
    case 'text':
      return q.style === 'definition' ? 'Definition' : q.style === 'short' ? 'Short answer' : 'One-line answer';
    case 'cloze':
      return 'Fill in the blanks';
    case 'spot-error':
      return 'Spot the error';
    case 'explain':
      return 'In your own words';
  }
}

export function renderBlock(b: Block, lessonId: string): RenderedBlock {
  switch (b.type) {
    case 'objective':
    case 'exam':
      return { type: b.type, html: renderMd(b.body) };
    case 'explain':
    case 'intuition':
      return { type: b.type, title: b.title, html: renderMd(b.body) };
    case 'definition':
      return { type: 'definition', term: b.term, html: renderMd(b.body) };
    case 'example':
      return {
        type: 'example',
        title: b.title,
        problemHtml: renderMd(b.problem),
        stepsHtml: b.steps.map(renderMd),
        answerHtml: b.answer ? renderMd(b.answer) : undefined,
      };
    case 'diagram':
      return { type: 'diagram', diagram: b.diagram, alt: b.alt, captionHtml: b.caption ? renderInline(b.caption) : undefined };
    case 'misconceptions':
      return { type: 'misconceptions', items: b.items.map((i) => ({ wrongHtml: renderMd(i.wrong), rightHtml: renderMd(i.right) })) };
    case 'takeaways':
      return { type: 'takeaways', itemsHtml: b.items.map(renderInline) };
    case 'check':
      return { type: 'check', title: b.title, questionIds: b.questions.map((q) => questionId(lessonId, q)) };
    case 'deeper':
    case 'enrichment':
      return { type: b.type, title: b.title, html: renderMd(b.body) };
  }
}

export function renderQuestion(q: Question, lessonId: string): { view: QuestionView; reveal: QuestionReveal } {
  const id = questionId(lessonId, q.id);
  const base = { id, format: q.format, difficulty: q.difficulty, label: formatLabel(q) };
  const explanationHtml = renderMd(q.explanation);
  switch (q.format) {
    case 'mcq':
      return {
        view: { ...base, promptHtml: renderMd(q.prompt), options: q.options.map((o) => renderInline(o.text)) },
        reveal: {
          explanationHtml,
          correctOption: q.options.findIndex((o) => o.correct),
          whyHtml: q.options.map((o) => (o.why ? renderInline(o.why) : null)),
        },
      };
    case 'numeric':
      return {
        view: {
          ...base,
          promptHtml: renderMd(q.prompt),
          fields: q.fields.map((f) => ({ labelHtml: f.label ? renderInline(f.label) : undefined, unit: f.unit, typedUnit: !!f.acceptUnits, sigFigs: f.sigFigs })),
        },
        reveal: {
          explanationHtml,
          expected: q.fields.map((f) => {
            const v = f.sigFigs ? toSigFigs(f.answer, f.sigFigs) : String(f.answer);
            const unit = f.acceptUnits?.[0] ?? f.unit;
            return `${f.label ? `${f.label.replace(/\$/g, '')} ` : ''}${v}${unit ? ` ${unit}` : ''}`;
          }),
        },
      };
    case 'expression':
      return {
        view: { ...base, promptHtml: renderMd(q.prompt), variables: q.variables },
        reveal: { explanationHtml, answerHtml: renderInline(q.display) },
      };
    case 'text':
      return { view: { ...base, promptHtml: renderMd(q.prompt) }, reveal: { explanationHtml, answerHtml: renderMd(q.model) } };
    case 'cloze':
      return {
        view: { ...base, promptHtml: renderCloze(q.prompt, q.blanks.length), blankCount: q.blanks.length },
        reveal: { explanationHtml, blanks: q.blanks.map((b) => b.accept[0]!) },
      };
    case 'spot-error':
      return {
        view: { ...base, promptHtml: renderMd(q.prompt), lines: q.lines.map(renderInline) },
        reveal: { explanationHtml, errorLine: q.errorLine, fixHtml: renderMd(q.fix) },
      };
    case 'explain':
      return {
        view: { ...base, promptHtml: renderMd(q.prompt), keyPointCount: q.keyPoints.length },
        reveal: { explanationHtml, answerHtml: renderMd(q.model), keyPoints: q.keyPoints },
      };
  }
}

/** Plain text used for search. */
export function lessonSearchText(l: LessonFile): string {
  const parts: string[] = [l.title, l.summary];
  for (const b of l.blocks) {
    if ('title' in b && b.title) parts.push(b.title);
    if (b.type === 'definition') parts.push(b.term);
    if ('body' in b) parts.push(b.body);
    if (b.type === 'takeaways') parts.push(...b.items);
  }
  return parts
    .join(' ')
    .replace(/\$[^$]*\$/g, ' ')
    .replace(/[#*_`>|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
