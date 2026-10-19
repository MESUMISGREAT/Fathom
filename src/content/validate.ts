/**
 * Cross-file content rules that a schema alone cannot express. Errors block
 * import; warnings are shown to authors and reviewers.
 */
import path from 'node:path';
import { checkAnswer, modelResponse } from '@/domain/answers/check';
import { parseExpression } from '@/domain/answers/expression';
import { parseUnit } from '@/domain/answers/units';
import type { ContentBundle, Issue } from './load';
import { renderCloze, renderInline, renderMd } from './markdown';
import type { Block, LessonFile, Question, SyllabusFile } from './schema';

export interface Validation {
  issues: Issue[];
  coverage: SubjectCoverage[];
}

export interface SubjectCoverage {
  code: string;
  objectives: number;
  withLesson: number;
  withQuestions: number;
  lessons: number;
  questions: number;
}

/** Every markdown string in a block, for rendering checks and word counts. */
export function blockText(b: Block): string[] {
  switch (b.type) {
    case 'example':
      return [b.problem, ...b.steps, ...(b.answer ? [b.answer] : [])];
    case 'diagram':
      return b.caption ? [b.caption] : [];
    case 'misconceptions':
      return b.items.flatMap((i) => [i.wrong, i.right]);
    case 'takeaways':
      return b.items;
    case 'check':
      return [];
    case 'definition':
      return [b.body];
    default:
      return [b.body];
  }
}

function questionText(q: Question): string[] {
  const out = [q.prompt, q.explanation];
  if (q.format === 'mcq') for (const o of q.options) out.push(o.text, ...(o.why ? [o.why] : []));
  if (q.format === 'spot-error') out.push(...q.lines, q.fix);
  if (q.format === 'text' || q.format === 'explain') out.push(q.model);
  if (q.format === 'expression') out.push(q.display);
  return out;
}

export function validateContent(bundle: ContentBundle, diagramKeys: Set<string>): Validation {
  const issues: Issue[] = [...bundle.issues];
  const err = (file: string, message: string) => issues.push({ level: 'error', file, message });
  const warn = (file: string, message: string) => issues.push({ level: 'warning', file, message });

  // --- Syllabus structure ---------------------------------------------------
  const objectivesBySubject = new Map<string, Map<string, { topic: string }>>();
  const topicsBySubject = new Map<string, Set<string>>();
  for (const { file, data } of bundle.syllabi) {
    validateSyllabus(file, data, err, warn);
    const objectives = new Map<string, { topic: string }>();
    const topics = new Set<string>();
    for (const s of data.sections) {
      for (const t of s.topics) {
        topics.add(t.code);
        for (const o of t.objectives) objectives.set(o.code, { topic: t.code });
      }
    }
    objectivesBySubject.set(data.subject.code, objectives);
    topicsBySubject.set(data.subject.code, topics);
  }

  // --- Lessons --------------------------------------------------------------
  const lessonIds = new Map<string, string>();
  for (const { file, data } of bundle.lessons) {
    if (lessonIds.has(data.id)) err(file, `duplicate lesson id "${data.id}" (also in ${lessonIds.get(data.id)})`);
    lessonIds.set(data.id, file);
  }
  const orderKeys = new Map<string, string>();
  const covered = new Map<string, { lesson: Set<string>; question: Set<string> }>();
  const counts = new Map<string, { lessons: number; questions: number }>();

  for (const { file, data } of bundle.lessons) {
    const folder = path.basename(path.dirname(path.dirname(file)));
    if (data.subject !== folder) err(file, `subject "${data.subject}" does not match folder "${folder}"`);
    if (path.basename(file, '.yaml') !== data.id) err(file, `file name must be "${data.id}.yaml"`);
    const objectives = objectivesBySubject.get(data.subject);
    if (!objectives) {
      err(file, `no syllabus.yaml for subject ${data.subject}`);
      continue;
    }
    if (!topicsBySubject.get(data.subject)?.has(data.topic)) err(file, `topic ${data.topic} is not in the ${data.subject} syllabus`);
    const orderKey = `${data.subject}/${data.topic}/${data.order}`;
    if (orderKeys.has(orderKey)) err(file, `order ${data.order} in topic ${data.topic} is also used by ${orderKeys.get(orderKey)}`);
    orderKeys.set(orderKey, data.id);

    for (const code of data.objectives) {
      const o = objectives.get(code);
      if (!o) err(file, `objective ${code} is not in the ${data.subject} syllabus`);
      else if (o.topic !== data.topic) warn(file, `objective ${code} belongs to topic ${o.topic}, not ${data.topic}`);
    }
    for (const p of data.prerequisites) if (!lessonIds.has(p)) err(file, `prerequisite "${p}" does not exist`);

    validateProvenance(file, data, err);
    validateBlocks(file, data, diagramKeys, err, warn);
    validateQuestions(file, data, objectives, err, warn);

    const c = counts.get(data.subject) ?? { lessons: 0, questions: 0 };
    c.lessons++;
    c.questions += data.questions.length;
    counts.set(data.subject, c);
    const cov = covered.get(data.subject) ?? { lesson: new Set(), question: new Set() };
    if (data.kind === 'core') for (const o of data.objectives) cov.lesson.add(o);
    for (const q of data.questions) for (const o of q.objectives) cov.question.add(o);
    covered.set(data.subject, cov);
  }

  const coverage: SubjectCoverage[] = bundle.syllabi.map(({ data }) => {
    const all = [...(objectivesBySubject.get(data.subject.code)?.keys() ?? [])];
    const cov = covered.get(data.subject.code);
    const c = counts.get(data.subject.code) ?? { lessons: 0, questions: 0 };
    return {
      code: data.subject.code,
      objectives: all.length,
      withLesson: all.filter((o) => cov?.lesson.has(o)).length,
      withQuestions: all.filter((o) => cov?.question.has(o)).length,
      lessons: c.lessons,
      questions: c.questions,
    };
  });

  return { issues, coverage };
}

function validateSyllabus(
  file: string,
  data: SyllabusFile,
  err: (f: string, m: string) => void,
  warn: (f: string, m: string) => void,
) {
  const folder = path.basename(path.dirname(file));
  if (data.subject.code !== folder) err(file, `subject.code ${data.subject.code} does not match folder ${folder}`);
  const sections = new Set<string>();
  const topics = new Set<string>();
  for (const s of data.sections) {
    if (sections.has(s.code)) err(file, `duplicate section ${s.code}`);
    sections.add(s.code);
    for (const t of s.topics) {
      if (topics.has(t.code)) err(file, `duplicate topic ${t.code}`);
      topics.add(t.code);
      if (t.code.split('.')[0] !== s.code) err(file, `topic ${t.code} is not numbered under section ${s.code}`);
      t.objectives.forEach((o, i) => {
        const expected = `${t.code}.${i + 1}`;
        if (o.code !== expected) err(file, `objective ${o.code} should be ${expected} (objectives are numbered in order)`);
      });
      if (t.objectives.length > 25) warn(file, `topic ${t.code} has ${t.objectives.length} objectives; check sub-points were not split out`);
    }
  }
}

function validateProvenance(file: string, data: LessonFile, err: (f: string, m: string) => void) {
  const p = data.provenance;
  if (p.status === 'human-reviewed' && (!p.reviewedBy || !p.reviewedAt)) {
    err(file, 'provenance: human-reviewed content needs reviewedBy and reviewedAt');
  }
}

function tryRender(file: string, where: string, md: string, err: (f: string, m: string) => void, inline = false) {
  try {
    if (inline) renderInline(md);
    else renderMd(md);
  } catch (e) {
    err(file, `${where}: ${(e as Error).message} in "${md.slice(0, 80).replace(/\s+/g, ' ')}"`);
  }
}

function validateBlocks(
  file: string,
  data: LessonFile,
  diagramKeys: Set<string>,
  err: (f: string, m: string) => void,
  warn: (f: string, m: string) => void,
) {
  if (data.blocks[0]?.type !== 'objective') warn(file, 'lessons should open with an objective block');
  const questionIds = new Set(data.questions.map((q) => q.id));
  const placed = new Map<string, number>();
  let words = 0;
  data.blocks.forEach((b, i) => {
    const where = `blocks[${i}] (${b.type})`;
    for (const md of blockText(b)) {
      tryRender(file, where, md, err);
      words += md.split(/\s+/).length;
    }
    if (b.type === 'diagram' && !diagramKeys.has(b.diagram)) {
      err(file, `${where}: diagram "${b.diagram}" is not registered in src/components/diagrams`);
    }
    if (b.type === 'check') {
      for (const id of b.questions) {
        if (!questionIds.has(id)) err(file, `${where}: question "${id}" is not defined`);
        placed.set(id, (placed.get(id) ?? 0) + 1);
      }
    }
  });
  for (const id of questionIds) {
    const n = placed.get(id) ?? 0;
    if (n === 0) err(file, `question "${id}" is not placed in any check block`);
    if (n > 1) err(file, `question "${id}" is placed in ${n} check blocks`);
  }
  if (!data.blocks.some((b) => b.type === 'check')) warn(file, 'lesson has no active-recall check');
  const readingMinutes = words / 180;
  if (readingMinutes > data.minutes + 3) {
    warn(file, `about ${Math.round(readingMinutes)} min of reading but minutes is ${data.minutes}; consider splitting`);
  }
}

function validateQuestions(
  file: string,
  data: LessonFile,
  objectives: Map<string, { topic: string }>,
  err: (f: string, m: string) => void,
  warn: (f: string, m: string) => void,
) {
  const ids = new Set<string>();
  for (const q of data.questions) {
    const where = `question "${q.id}"`;
    if (ids.has(q.id)) err(file, `${where}: duplicate id`);
    ids.add(q.id);
    for (const o of q.objectives) {
      if (!objectives.has(o)) err(file, `${where}: objective ${o} is not in the syllabus`);
      else if (!data.objectives.includes(o)) warn(file, `${where}: objective ${o} is not listed on the lesson`);
    }
    for (const md of questionText(q)) tryRender(file, where, md, err);

    switch (q.format) {
      case 'mcq': {
        const correct = q.options.filter((o) => o.correct).length;
        if (correct !== 1) err(file, `${where}: needs exactly one correct option (has ${correct})`);
        if (q.options.some((o) => !o.correct && !o.why)) warn(file, `${where}: explain why each distractor is wrong ("why")`);
        break;
      }
      case 'spot-error':
        if (q.errorLine > q.lines.length) err(file, `${where}: errorLine ${q.errorLine} is past the last line`);
        break;
      case 'cloze':
        try {
          renderCloze(q.prompt, q.blanks.length);
        } catch (e) {
          err(file, `${where}: ${(e as Error).message}`);
        }
        break;
      case 'expression':
        try {
          parseExpression(q.answer, { variables: q.variables });
        } catch (e) {
          err(file, `${where}: answer "${q.answer}" does not parse: ${(e as Error).message}`);
        }
        break;
      case 'numeric':
        for (const f of q.fields) {
          for (const u of f.acceptUnits ?? []) if (parseUnit(u).length === 0) err(file, `${where}: unit "${u}" is not recognised`);
          if (f.unit && f.acceptUnits) warn(file, `${where}: use either unit (display only) or acceptUnits (typed), not both`);
        }
        if (q.fields.length > 1 && q.fields.some((f) => !f.label)) err(file, `${where}: multi-field questions need a label on every field`);
        break;
    }

    try {
      const { response, self } = modelResponse(q);
      const r = checkAnswer(q, response, self);
      if (r.outcome !== 'correct') err(file, `${where}: the checker does not accept the model answer (${r.outcome}${r.note ? `: ${r.note}` : ''})`);
    } catch (e) {
      err(file, `${where}: checker threw ${(e as Error).message}`);
    }
  }
}
