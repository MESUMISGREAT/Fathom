/**
 * Database schema (PostgreSQL). Content tables are written only by the
 * content importer; student tables by server actions. IDs for content are
 * stable strings derived from the YAML (so attempts survive re-imports);
 * removed content is archived, never deleted, because attempts reference it.
 *
 * Later phases add tables alongside these (see docs/PLAN.md, Data model):
 * exam questions with parts and mark points, papers, submissions, AI
 * assessments, grade thresholds and grade estimates.
 */
import { sql } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import type { Provenance, Question } from '@/content/schema';
import type { RenderedBlock, QuestionReveal, QuestionView } from '@/content/rendered';
import type { CheckResult, StudentResponse } from '@/domain/answers/check';
// Relative (not '@/'): drizzle-kit loads this file without the tsconfig path aliases.
import { DEFAULT_DAILY_GOAL, XP_KINDS } from '../../domain/points';

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

// --- Content ----------------------------------------------------------------

export const subjects = pgTable('subjects', {
  code: text('code').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  shortName: text('short_name').notNull(),
  description: text('description').notNull(),
  position: integer('position').notNull(),
});

export const syllabusVersions = pgTable('syllabus_versions', {
  id: text('id').primaryKey(),
  subjectCode: text('subject_code').notNull().references(() => subjects.code),
  label: text('label').notNull(),
  examYears: integer('exam_years').array().notNull(),
  sourceUrl: text('source_url').notNull(),
  sourceVersion: text('source_version').notNull(),
  checkedAt: text('checked_at').notNull(),
  wording: text('wording').notNull(),
  notes: text('notes'),
  isCurrent: boolean('is_current').notNull().default(true),
});

export const syllabusSections = pgTable(
  'syllabus_sections',
  {
    id: text('id').primaryKey(),
    versionId: text('version_id').notNull().references(() => syllabusVersions.id),
    code: text('code').notNull(),
    title: text('title').notNull(),
    level: text('level', { enum: ['AS', 'A'] }).notNull(),
    papers: text('papers').array().notNull(),
    strand: text('strand'),
    position: integer('position').notNull(),
  },
  (t) => [index('sections_version_idx').on(t.versionId)],
);

export const topics = pgTable(
  'topics',
  {
    id: text('id').primaryKey(),
    versionId: text('version_id').notNull().references(() => syllabusVersions.id),
    sectionId: text('section_id').notNull().references(() => syllabusSections.id),
    code: text('code').notNull(),
    title: text('title').notNull(),
    position: integer('position').notNull(),
  },
  (t) => [index('topics_section_idx').on(t.sectionId)],
);

export const objectives = pgTable(
  'objectives',
  {
    id: text('id').primaryKey(),
    versionId: text('version_id').notNull().references(() => syllabusVersions.id),
    topicId: text('topic_id').notNull().references(() => topics.id),
    code: text('code').notNull(),
    text: text('text').notNull(),
    guidance: text('guidance'),
    position: integer('position').notNull(),
  },
  (t) => [index('objectives_topic_idx').on(t.topicId)],
);

export const lessons = pgTable(
  'lessons',
  {
    id: text('id').primaryKey(),
    versionId: text('version_id').notNull().references(() => syllabusVersions.id),
    topicId: text('topic_id').notNull().references(() => topics.id),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    summary: text('summary').notNull(),
    position: integer('position').notNull(),
    minutes: integer('minutes').notNull(),
    kind: text('kind', { enum: ['core', 'enrichment'] }).notNull(),
    prerequisites: text('prerequisites').array().notNull(),
    provenance: jsonb('provenance').$type<Provenance>().notNull(),
    blocks: jsonb('blocks').$type<RenderedBlock[]>().notNull(),
    /** Plain text of the lesson for search. */
    searchText: text('search_text').notNull(),
    contentHash: text('content_hash').notNull(),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('lessons_topic_idx').on(t.topicId)],
);

export const lessonObjectives = pgTable(
  'lesson_objectives',
  {
    lessonId: text('lesson_id').notNull().references(() => lessons.id),
    objectiveId: text('objective_id').notNull().references(() => objectives.id),
  },
  (t) => [primaryKey({ columns: [t.lessonId, t.objectiveId] }), index('lesson_objectives_obj_idx').on(t.objectiveId)],
);

export const questions = pgTable(
  'questions',
  {
    /** `<lessonId>/<questionId>` */
    id: text('id').primaryKey(),
    lessonId: text('lesson_id').notNull().references(() => lessons.id),
    versionId: text('version_id').notNull().references(() => syllabusVersions.id),
    format: text('format').notNull(),
    difficulty: integer('difficulty').notNull(),
    position: integer('position').notNull(),
    /** Full question including the answer key. Server-only. */
    spec: jsonb('spec').$type<Question>().notNull(),
    /** What the browser may see before answering. */
    view: jsonb('view').$type<QuestionView>().notNull(),
    /** Rendered answer/explanation, sent only after an answer is submitted. */
    reveal: jsonb('reveal').$type<QuestionReveal>().notNull(),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
  },
  (t) => [index('questions_lesson_idx').on(t.lessonId)],
);

export const questionObjectives = pgTable(
  'question_objectives',
  {
    questionId: text('question_id').notNull().references(() => questions.id),
    objectiveId: text('objective_id').notNull().references(() => objectives.id),
  },
  (t) => [primaryKey({ columns: [t.questionId, t.objectiveId] }), index('question_objectives_obj_idx').on(t.objectiveId)],
);

export const appMeta = pgTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

// --- Students -----------------------------------------------------------------

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  /** Stored lower-cased. */
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  /** Optional first name only; we don't need more. */
  displayName: text('display_name'),
  role: text('role', { enum: ['student', 'editor', 'admin'] }).notNull().default('student'),
  theme: text('theme', { enum: ['system', 'light', 'dark'] }).notNull().default('system'),
  /** Lessons reveal one step at a time ('steps') or show everything ('full'). */
  lessonMode: text('lesson_mode', { enum: ['steps', 'full'] }).notNull().default('steps'),
  /** XP per day to aim for: one of DAILY_GOALS in src/domain/points.ts. */
  dailyGoal: integer('daily_goal').notNull().default(DEFAULT_DAILY_GOAL),
  /** IANA time zone, detected from the browser; decides which local day XP counts towards. */
  timeZone: text('time_zone').notNull().default('UTC'),
  /** Confetti and pops (also off whenever the browser asks for reduced motion). */
  celebrations: boolean('celebrations').notNull().default(true),
  sounds: boolean('sounds').notNull().default(false),
  ageConfirmedAt: timestamp('age_confirmed_at', { withTimezone: true }).notNull(),
  createdAt: createdAt(),
});

export const sessions = pgTable(
  'sessions',
  {
    /** SHA-256 of the session token; the token itself is only in the cookie. */
    id: text('id').primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (t) => [index('sessions_user_idx').on(t.userId)],
);

export const enrollments = pgTable(
  'enrollments',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    subjectCode: text('subject_code').notNull().references(() => subjects.code),
    versionId: text('version_id').notNull().references(() => syllabusVersions.id),
    /** The qualification the student is aiming for. */
    targetLevel: text('target_level', { enum: ['AS', 'A'] }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.subjectCode] })],
);

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    lessonId: text('lesson_id').notNull().references(() => lessons.id),
    /** Furthest step reached (0-based). */
    stepReached: integer('step_reached').notNull().default(0),
    stepCount: integer('step_count').notNull(),
    openedAt: timestamp('opened_at', { withTimezone: true }).notNull().defaultNow(),
    lastViewedAt: timestamp('last_viewed_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.lessonId] })],
);

export const attempts = pgTable(
  'attempts',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    questionId: text('question_id').notNull().references(() => questions.id),
    response: jsonb('response').$type<StudentResponse>().notNull(),
    outcome: text('outcome').$type<CheckResult['outcome']>().notNull(),
    score: real('score').notNull(),
    selfAssessed: boolean('self_assessed').notNull(),
    context: text('context', { enum: ['lesson', 'review'] }).notNull(),
    /**
     * The combo count after this answer, for answers that could earn XP (0
     * when it broke the combo). Null for answers that could not earn XP
     * (repeats, early reviews), which leave the combo alone. The live combo is
     * read from the latest non-null row (see src/domain/points.ts).
     */
    combo: integer('combo'),
    createdAt: createdAt(),
  },
  (t) => [index('attempts_user_time_idx').on(t.userId, t.createdAt), index('attempts_user_question_idx').on(t.userId, t.questionId)],
);

/** Spaced-repetition state per question (Leitner boxes). */
export const reviewItems = pgTable(
  'review_items',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    questionId: text('question_id').notNull().references(() => questions.id),
    box: integer('box').notNull(),
    dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
    lapses: integer('lapses').notNull().default(0),
    lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.questionId] }), index('review_items_due_idx').on(t.userId, t.dueAt)],
);

export const bookmarks = pgTable(
  'bookmarks',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    kind: text('kind', { enum: ['lesson', 'question'] }).notNull(),
    targetId: text('target_id').notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.kind, t.targetId] })],
);

/**
 * Every XP award. The unique index on (user_id, kind, source_id) enforces the
 * limits in docs/design/fun-and-points.md at the database level, so a
 * double-submitted answer can never award twice. `source_id` is the question
 * id (answer), `questionId@dueAt` (review), the lesson id (lesson, perfect),
 * the local day (daily-goal) or the id of the answer that reached the
 * milestone (combo).
 */
export const xpEvents = pgTable(
  'xp_events',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    kind: text('kind', { enum: XP_KINDS }).notNull(),
    amount: integer('amount').notNull(),
    sourceId: text('source_id').notNull(),
    /** The day it was earned in the student's time zone at the time. */
    localDay: date('local_day', { mode: 'string' }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex('xp_events_source_uq').on(t.userId, t.kind, t.sourceId), index('xp_events_user_day_idx').on(t.userId, t.localDay)],
);

/** Badges earned (ids from BADGES in src/domain/points.ts). Never removed. */
export const userBadges = pgTable(
  'user_badges',
  {
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    badgeId: text('badge_id').notNull(),
    earnedAt: timestamp('earned_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.badgeId] })],
);

export type User = typeof users.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type QuestionRow = typeof questions.$inferSelect;
export type Attempt = typeof attempts.$inferSelect;
export type XpEvent = typeof xpEvents.$inferSelect;

/** Problems students report with content (wrong answer key, typo, unclear). Reviewed by editors. */
export const contentReports = pgTable(
  'content_reports',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    /** Null for guests, and set null if the reporter deletes their account. */
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    kind: text('kind', { enum: ['lesson', 'question'] }).notNull(),
    targetId: text('target_id').notNull(),
    reason: text('reason', { enum: ['wrong-answer', 'error-in-content', 'unclear', 'other'] }).notNull(),
    message: text('message').notNull(),
    status: text('status', { enum: ['open', 'fixed', 'dismissed'] }).notNull().default('open'),
    createdAt: createdAt(),
  },
  (t) => [index('content_reports_status_idx').on(t.status, t.createdAt)],
);
