/**
 * Content contract for syllabus trees, lessons and recall questions.
 *
 * Content lives as YAML in /content and is the reviewable source of truth
 * (changes go through code review). `npm run content:check` validates every
 * file against these schemas plus cross-file rules (see validate.ts), and
 * `npm run content:import` loads it into the database.
 *
 * Markdown fields (`Md`) support GitHub-flavoured markdown and KaTeX maths:
 * `$...$` inline, `$$...$$` display. Raw HTML is not allowed.
 */
import { z } from 'zod';

/**
 * A raw C0 control character that can only get into content by accident: a LaTeX
 * command written with a single backslash inside a *double-quoted* YAML scalar,
 * where \t becomes TAB, \r becomes CR and so on, so "\rightarrow" arrives as CR
 * followed by "ightarrow". Newline (U+000A) is excluded because block scalars
 * legitimately contain it.
 */
const CONTROL_CHAR = /[\u0000-\u0009\u000B-\u001F]/;
const CONTROL_NAMES: Record<number, string> = {
  0x00: 'NUL',
  0x07: 'BEL',
  0x08: 'backspace',
  0x09: 'TAB',
  0x0b: 'vertical tab',
  0x0c: 'form feed',
  0x0d: 'carriage return',
};

/** Markdown text. Rejects control characters, which always mean broken LaTeX. */
export const Md = z
  .string()
  .trim()
  .min(1)
  .superRefine((value, ctx) => {
    const hit = CONTROL_CHAR.exec(value);
    if (!hit) return;
    const code = hit[0].codePointAt(0)!;
    const name = CONTROL_NAMES[code] ?? 'control';
    const around = value.slice(Math.max(0, hit.index - 12), hit.index + 12).replace(CONTROL_CHAR, '␍');
    ctx.addIssue({
      code: 'custom',
      message:
        `contains a raw ${name} character (U+${code.toString(16).toUpperCase().padStart(4, '0')}) near "${around}" - ` +
        'this is a LaTeX command written with a single backslash inside a double-quoted YAML scalar. ' +
        "Put maths in a block scalar (| or >) or a single-quoted string, e.g. '\\rightarrow' or $\\rightarrow$, and never in \"...\" with single backslashes.",
    });
  });
const Slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'lowercase-kebab-case');
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD');

/** Topic codes follow the official numbering, e.g. "1.1", "13.2". */
export const TopicCode = z.string().regex(/^\d+\.\d+$/, 'topic code like "1.1"');
/**
 * Objective codes are `<topic>.<n>`, where n is the 1-based position of the
 * learning outcome under "Candidates should be able to" in the official
 * syllabus (9702/9701 number these officially; 9709/9618 use bullets, so the
 * ordinal is platform-assigned).
 */
export const ObjectiveCode = z.string().regex(/^\d+\.\d+\.\d+$/, 'objective code like "1.1.3"');

// ---------------------------------------------------------------------------
// Syllabus
// ---------------------------------------------------------------------------

export const ObjectiveSchema = z.strictObject({
  code: ObjectiveCode,
  text: z.string().trim().min(8),
  /** Paraphrase of the syllabus "Notes and examples"/guidance column, if any. */
  guidance: z.string().trim().min(1).optional(),
});

export const TopicSchema = z.strictObject({
  code: TopicCode,
  title: z.string().trim().min(2),
  objectives: z.array(ObjectiveSchema).min(1),
});

export const SectionSchema = z.strictObject({
  /** Integer string matching the topic prefix, e.g. "1" for topics 1.x. */
  code: z.string().regex(/^\d+$/),
  title: z.string().trim().min(2),
  /** AS = assessed at AS Level; A = A Level only content. */
  level: z.enum(['AS', 'A']),
  papers: z.array(z.string().trim().min(1)).min(1),
  /** Optional grouping shown in navigation, e.g. "Physical chemistry". */
  strand: z.string().trim().min(1).optional(),
  topics: z.array(TopicSchema).min(1),
});

export const SyllabusFileSchema = z.strictObject({
  subject: z.strictObject({
    code: z.string().regex(/^\d{4}$/),
    slug: Slug,
    name: z.string().trim().min(2),
    shortName: z.string().trim().min(2),
    description: z.string().trim().min(10),
  }),
  syllabus: z.strictObject({
    id: Slug,
    label: z.string().trim().min(4),
    examYears: z.array(z.number().int().min(2020).max(2040)).min(1),
    sourceUrl: z.url(),
    /** Version line from the official document, e.g. "Version 4, published December 2025". */
    sourceVersion: z.string().trim().min(3),
    /** When this file was last checked against the official document. */
    checkedAt: IsoDate,
    /** Whether objective text is the official wording or a paraphrase. */
    wording: z.enum(['paraphrased', 'verbatim']),
    notes: z.string().trim().min(1).optional(),
  }),
  sections: z.array(SectionSchema).min(1),
});

// ---------------------------------------------------------------------------
// Recall questions
// ---------------------------------------------------------------------------

const QuestionBase = {
  /** Unique within the lesson; the global id is `<lessonId>/<id>`. */
  id: Slug,
  prompt: Md,
  /** Shown after answering: why the answer is what it is. */
  explanation: Md,
  /** 1 = recall, 2 = apply, 3 = stretch. */
  difficulty: z.number().int().min(1).max(3),
  objectives: z.array(ObjectiveCode).min(1),
};

export const McqSchema = z.strictObject({
  ...QuestionBase,
  format: z.literal('mcq'),
  options: z
    .array(
      z.strictObject({
        text: Md,
        correct: z.boolean().default(false),
        /** Why this option is right or wrong; shown after answering. */
        why: Md.optional(),
      }),
    )
    .min(2)
    .max(6),
});

export const NumericFieldSchema = z.strictObject({
  /** Label before the input, e.g. "a =". Optional for single-field questions. */
  label: z.string().trim().min(1).optional(),
  answer: z.number(),
  /** Absolute and/or relative tolerance. Defaults to exact (1e-9 relative). */
  tolerance: z
    .strictObject({ abs: z.number().positive().optional(), rel: z.number().positive().optional() })
    .optional(),
  /** Displayed after the input when the student should not type a unit. */
  unit: z.string().trim().min(1).optional(),
  /** If set, the student must type a unit and it must be equivalent to one of these. */
  acceptUnits: z.array(z.string().trim().min(1)).min(1).optional(),
  /** If set, the answer must be given to exactly this many significant figures. */
  sigFigs: z.number().int().min(1).max(8).optional(),
});

export const NumericSchema = z.strictObject({
  ...QuestionBase,
  format: z.literal('numeric'),
  fields: z.array(NumericFieldSchema).min(1).max(4),
});

export const ExpressionSchema = z.strictObject({
  ...QuestionBase,
  format: z.literal('expression'),
  /** Plain-text maths, e.g. "3x^2 - 4/x^2". Checked by numerical equivalence. */
  answer: z.string().trim().min(1),
  variables: z.array(z.string().regex(/^[a-z]$/)).min(1).max(3),
  /** Restrict sampling to a domain where the expression is defined. */
  domain: z.strictObject({ min: z.number(), max: z.number() }).optional(),
  /** Shown as the expected answer (markdown/KaTeX). */
  display: Md,
});

export const TextSchema = z.strictObject({
  ...QuestionBase,
  format: z.literal('text'),
  /** How the question is labelled to the student. */
  style: z.enum(['one-line', 'definition', 'short']).default('one-line'),
  /** Accepted answers, compared after normalising case, spacing and punctuation. */
  accept: z.array(z.string().trim().min(1)).min(1),
  /** Model answer shown afterwards. Unmatched answers fall back to self-check against it. */
  model: Md,
});

export const ClozeSchema = z.strictObject({
  ...QuestionBase,
  format: z.literal('cloze'),
  /** Prompt contains blanks written as {{1}}, {{2}}, ... */
  blanks: z.array(z.strictObject({ accept: z.array(z.string().trim().min(1)).min(1) })).min(1).max(6),
});

export const SpotErrorSchema = z.strictObject({
  ...QuestionBase,
  format: z.literal('spot-error'),
  /** Lines of a worked solution or argument; exactly one contains the error. */
  lines: z.array(Md).min(3).max(10),
  /** 1-based index of the line containing the first error. */
  errorLine: z.number().int().min(1),
  /** What the line should have said. */
  fix: Md,
});

export const ExplainSchema = z.strictObject({
  ...QuestionBase,
  format: z.literal('explain'),
  model: Md,
  /** Points a good answer includes; the student self-checks against them. */
  keyPoints: z.array(z.string().trim().min(3)).min(2).max(6),
});

export const QuestionSchema = z.discriminatedUnion('format', [
  McqSchema,
  NumericSchema,
  ExpressionSchema,
  TextSchema,
  ClozeSchema,
  SpotErrorSchema,
  ExplainSchema,
]);

// ---------------------------------------------------------------------------
// Lessons (the "subtopic" unit: one concept, 2-5 minutes)
// ---------------------------------------------------------------------------

export const BlockSchema = z.discriminatedUnion('type', [
  /** 1. What the student will be able to do by the end. */
  z.strictObject({ type: z.literal('objective'), body: Md }),
  /** 2. Plain-language explanation. */
  z.strictObject({ type: z.literal('explain'), title: z.string().trim().min(1).optional(), body: Md }),
  /** 3. Precise definition in the terminology examiners expect. */
  z.strictObject({ type: z.literal('definition'), term: z.string().trim().min(1), body: Md }),
  /** 4. Why it works. */
  z.strictObject({ type: z.literal('intuition'), title: z.string().trim().min(1).optional(), body: Md }),
  /** 5. Worked example, revealed step by step. */
  z.strictObject({
    type: z.literal('example'),
    title: z.string().trim().min(1).optional(),
    problem: Md,
    steps: z.array(Md).min(1),
    answer: Md.optional(),
  }),
  /** 6. Diagram from the component registry (src/components/diagrams). */
  z.strictObject({
    type: z.literal('diagram'),
    diagram: Slug,
    alt: z.string().trim().min(10),
    caption: Md.optional(),
  }),
  /** 7. Common misconceptions. */
  z.strictObject({
    type: z.literal('misconceptions'),
    items: z.array(z.strictObject({ wrong: Md, right: Md })).min(1),
  }),
  /** 8. How this is assessed. */
  z.strictObject({ type: z.literal('exam'), body: Md }),
  /** 9. Key takeaways. */
  z.strictObject({ type: z.literal('takeaways'), items: z.array(Md).min(1) }),
  /** 10. Active-recall checkpoint: ids of questions defined below. */
  z.strictObject({
    type: z.literal('check'),
    title: z.string().trim().min(1).optional(),
    questions: z.array(Slug).min(1),
  }),
  /** Progressive disclosure: collapsed "go deeper" detail that is still examinable. */
  z.strictObject({ type: z.literal('deeper'), title: z.string().trim().min(1), body: Md }),
  /** Beyond the syllabus. Always labelled "not examinable". */
  z.strictObject({ type: z.literal('enrichment'), title: z.string().trim().min(1), body: Md }),
]);

export const ProvenanceSchema = z.strictObject({
  /** Who drafted the content. */
  origin: z.enum(['human', 'ai-drafted']),
  /**
   * draft: unchecked. ai-checked: passed automated/AI accuracy review only.
   * human-reviewed: checked by a qualified teacher (requires reviewedBy).
   */
  status: z.enum(['draft', 'ai-checked', 'human-reviewed']),
  reviewedBy: z.string().trim().min(1).optional(),
  reviewedAt: IsoDate.optional(),
  notes: z.string().trim().min(1).optional(),
});

export const LessonFileSchema = z.strictObject({
  id: Slug,
  subject: z.string().regex(/^\d{4}$/),
  topic: TopicCode,
  title: z.string().trim().min(2),
  /** One-sentence summary shown in lists and search. */
  summary: z.string().trim().min(10).max(200),
  /** Position within the topic. */
  order: z.number().int().min(1),
  minutes: z.number().int().min(1).max(10),
  /** core = examinable syllabus content; enrichment = beyond the syllabus. */
  kind: z.enum(['core', 'enrichment']).default('core'),
  objectives: z.array(ObjectiveCode).min(1),
  /** Lesson ids a student should know first. */
  prerequisites: z.array(Slug).default([]),
  provenance: ProvenanceSchema,
  blocks: z.array(BlockSchema).min(3),
  questions: z.array(QuestionSchema).default([]),
});

export type SyllabusFile = z.infer<typeof SyllabusFileSchema>;
export type LessonFile = z.infer<typeof LessonFileSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type QuestionFormat = Question['format'];
export type Provenance = z.infer<typeof ProvenanceSchema>;
