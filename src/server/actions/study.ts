'use server';
/**
 * Study actions: answering questions, lesson progress, enrolment, bookmarks.
 * Guests can read lessons and answer questions (feedback works), but nothing
 * is saved until they have an account.
 */
import { revalidatePath } from 'next/cache';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';
import { clientIp, getSessionUser } from '@/server/auth/session';
import { hit, LIMITS } from '@/server/rate-limit';
import { checkAnswer, type CheckResult } from '@/domain/answers/check';
import { nextReview } from '@/domain/schedule';
import type { PointsResult } from '@/domain/points';
import { awardAnswer, awardLessonCompletion, awardReviewSession, lockUserPoints } from '@/server/points';
import type { QuestionReveal } from '@/content/rendered';

const ResponseSchema = z.discriminatedUnion('format', [
  z.object({ format: z.literal('mcq'), choice: z.number().int().min(0).max(10) }),
  z.object({ format: z.literal('numeric'), values: z.array(z.string().max(120)).min(1).max(4) }),
  z.object({ format: z.literal('expression'), value: z.string().max(300) }),
  z.object({ format: z.literal('text'), value: z.string().max(400) }),
  z.object({ format: z.literal('cloze'), values: z.array(z.string().max(120)).min(1).max(6) }),
  z.object({ format: z.literal('spot-error'), line: z.number().int().min(1).max(20) }),
  z.object({ format: z.literal('explain'), value: z.string().max(4000) }),
]);

const SubmitSchema = z.object({
  questionId: z.string().min(3).max(200),
  response: ResponseSchema,
  self: z.object({ correct: z.boolean().optional(), points: z.array(z.number().int().min(0).max(10)).max(10).optional() }).optional(),
  context: z.enum(['lesson', 'review']),
});

export interface SubmitResult {
  result: CheckResult;
  /** Sent once there is something to compare against (never before answering). */
  reveal?: QuestionReveal;
  recorded: boolean;
  signedIn: boolean;
  error?: string;
  /**
   * XP, combo, level, daily goal, streak and new badges after this answer.
   * Null when nothing was recorded (guests, unreadable answers, self-check
   * prompts). Always set by submitAnswer; optional only so that results built
   * in the browser (e.g. "Choose an answer first") still type-check.
   */
  points?: PointsResult | null;
}

export async function submitAnswer(input: z.input<typeof SubmitSchema>): Promise<SubmitResult> {
  const parsed = SubmitSchema.safeParse(input);
  const invalid = (note: string): SubmitResult => ({
    result: { outcome: 'invalid', score: 0, selfAssessed: false, parts: [], note },
    recorded: false,
    signedIn: false,
    points: null,
  });
  if (!parsed.success) return invalid('That answer could not be read. Please try again.');
  const { questionId, response, self, context } = parsed.data;

  const user = await getSessionUser();
  const ip = user ? null : await clientIp();
  const limit = user
    ? hit(`answer:${user.id}`, LIMITS.answer)
    : hit(ip ? `answer:${ip}` : 'answer:unknown-ip', ip ? LIMITS.answer : LIMITS.answerUnknownIp);
  if (!limit.ok) return { ...invalid(`You're answering very fast. Take a breath and try again in ${limit.retryAfterS}s.`), signedIn: !!user };

  const db = await getDb();
  const rows = await db.select().from(t.questions).where(and(eq(t.questions.id, questionId), isNull(t.questions.archivedAt)));
  const q = rows[0];
  if (!q) return invalid('This question is no longer available.');

  const result = checkAnswer(q.spec, response, self);
  const outcome = result.outcome;
  if (outcome === 'invalid') return { result, recorded: false, signedIn: !!user, points: null };
  if (outcome === 'self-check') return { result, reveal: q.reveal, recorded: false, signedIn: !!user, points: null };

  let recorded = false;
  let points: PointsResult | null = null;
  if (user) {
    // The attempt, the review schedule and the XP are recorded together or not at all.
    points = await db.transaction(async (tx) => {
      const now = await lockUserPoints(tx, user.id);
      const prevRows = await tx
        .select()
        .from(t.reviewItems)
        .where(and(eq(t.reviewItems.userId, user.id), eq(t.reviewItems.questionId, questionId)))
        .for('update');
      const prev = prevRows[0];
      const award = await awardAnswer(tx, {
        userId: user.id,
        questionId,
        lessonId: q.lessonId,
        difficulty: q.difficulty,
        outcome,
        score: result.score,
        selfAssessed: result.selfAssessed,
        review: prev ? { dueAt: prev.dueAt, paysXp: prev.paysXp } : null,
        now,
      });
      await tx.insert(t.attempts).values({
        id: award.attemptId,
        userId: user.id,
        questionId,
        response,
        outcome,
        score: result.score,
        selfAssessed: result.selfAssessed,
        context,
        combo: award.attemptCombo,
        localDay: award.localDay,
        dueReview: award.dueReview,
        createdAt: now,
      });
      const schedule = nextReview(prev ? { box: prev.box, dueAt: prev.dueAt, lapses: prev.lapses, lastReviewedAt: prev.lastReviewedAt } : null, result.score, now);
      // A due date set by an early repeat pays no review XP (see dueDatePaysXp); an unchanged one keeps its flag.
      const moved = !prev || schedule.dueAt.getTime() !== prev.dueAt.getTime();
      const next = { ...schedule, paysXp: moved ? award.nextDuePaysXp : prev.paysXp };
      await tx
        .insert(t.reviewItems)
        .values({ userId: user.id, questionId, ...next })
        .onConflictDoUpdate({ target: [t.reviewItems.userId, t.reviewItems.questionId], set: next });
      return award.finish();
    });
    recorded = true;
  }
  return { result, reveal: q.reveal, recorded, signedIn: !!user, points };
}

const StepSchema = z.object({
  lessonId: z.string().min(1).max(120),
  stepReached: z.number().int().min(0).max(100),
  stepCount: z.number().int().min(1).max(100),
  completed: z.boolean(),
});

export interface LessonStepResult {
  saved: boolean;
  /**
   * XP for finishing the lesson (20 the first time, +10 if perfect, +50 if
   * it completes its topic), with the level, daily goal, streak and new
   * badges. Set when a signed-in student saves a completed lesson (gained is
   * 0 when it was already paid, or when checks are still unanswered); null
   * for guests, failed saves and steps that don't complete the lesson.
   */
  points: PointsResult | null;
  /**
   * Checks in the lesson the student has never answered. The lesson is
   * finished either way, but its XP waits until every check has been
   * answered once (it is then paid with that answer). 0 when not completing.
   */
  unanswered: number;
}

export async function recordLessonStep(input: z.input<typeof StepSchema>): Promise<LessonStepResult> {
  const parsed = StepSchema.safeParse(input);
  const user = await getSessionUser();
  const failed: LessonStepResult = { saved: false, points: null, unanswered: 0 };
  if (!parsed.success || !user) return failed;
  if (!hit(`write:${user.id}`, LIMITS.write).ok) return failed;
  const { lessonId, stepReached, stepCount, completed } = parsed.data;
  const db = await getDb();
  const exists = await db.select({ id: t.lessons.id }).from(t.lessons).where(and(eq(t.lessons.id, lessonId), isNull(t.lessons.archivedAt)));
  if (!exists.length) return failed;
  const result = await db.transaction(async (tx) => {
    // Completions are serialised with the student's other point awards; plain step saves don't need to be.
    const now = completed ? await lockUserPoints(tx, user.id) : new Date();
    await tx
      .insert(t.lessonProgress)
      .values({ userId: user.id, lessonId, stepReached, stepCount, openedAt: now, lastViewedAt: now, completedAt: completed ? now : null })
      .onConflictDoUpdate({
        target: [t.lessonProgress.userId, t.lessonProgress.lessonId],
        set: {
          stepReached: sql`greatest(${t.lessonProgress.stepReached}, ${stepReached})`,
          stepCount,
          lastViewedAt: now,
          // Completion is sticky: revisiting a finished lesson doesn't undo it.
          completedAt: completed ? sql`coalesce(${t.lessonProgress.completedAt}, ${now.toISOString()}::timestamptz)` : sql`${t.lessonProgress.completedAt}`,
        },
      });
    return completed ? awardLessonCompletion(tx, { userId: user.id, lessonId, now }) : null;
  });
  if (completed) revalidatePath('/', 'layout');
  return { saved: true, points: result?.points ?? null, unanswered: result?.unanswered ?? 0 };
}

export interface ReviewSessionResult {
  /**
   * XP for the finished review session (15, once per local day, when at
   * least five different questions were answered in review today), with the
   * level, daily goal, streak and new badges. `gained` is 0 when nothing was
   * paid (too few answers, or already paid today). Null for guests and when
   * rate-limited.
   */
  points: PointsResult | null;
}

/** Call when a review session ends (the queue is finished or the student stops). Safe to call more than once. */
export async function finishReviewSession(): Promise<ReviewSessionResult> {
  const user = await getSessionUser();
  if (!user || !hit(`write:${user.id}`, LIMITS.write).ok) return { points: null };
  const db = await getDb();
  const points = await db.transaction(async (tx) => awardReviewSession(tx, { userId: user.id, now: await lockUserPoints(tx, user.id) }));
  if (points.gained > 0) revalidatePath('/', 'layout');
  return { points };
}

const EnrollSchema = z.object({ subjectCode: z.string().regex(/^\d{4}$/), targetLevel: z.enum(['AS', 'A']) });

export async function enroll(input: z.input<typeof EnrollSchema>): Promise<{ ok: boolean; error?: string }> {
  const parsed = EnrollSchema.safeParse(input);
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Sign in to add subjects.' };
  if (!parsed.success) return { ok: false, error: 'Unknown subject.' };
  if (!hit(`write:${user.id}`, LIMITS.write).ok) return { ok: false, error: 'Too many changes; try again shortly.' };
  const db = await getDb();
  const versions = await db
    .select({ id: t.syllabusVersions.id })
    .from(t.syllabusVersions)
    .where(and(eq(t.syllabusVersions.subjectCode, parsed.data.subjectCode), eq(t.syllabusVersions.isCurrent, true)));
  const versionId = versions[0]?.id;
  if (!versionId) return { ok: false, error: 'Unknown subject.' };
  await db
    .insert(t.enrollments)
    .values({ userId: user.id, subjectCode: parsed.data.subjectCode, versionId, targetLevel: parsed.data.targetLevel })
    .onConflictDoUpdate({ target: [t.enrollments.userId, t.enrollments.subjectCode], set: { targetLevel: parsed.data.targetLevel, versionId } });
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function unenroll(input: { subjectCode: string }): Promise<{ ok: boolean }> {
  const user = await getSessionUser();
  if (!user || !/^\d{4}$/.test(input.subjectCode)) return { ok: false };
  const db = await getDb();
  // Progress and attempts are kept, so re-adding the subject restores everything.
  await db.delete(t.enrollments).where(and(eq(t.enrollments.userId, user.id), eq(t.enrollments.subjectCode, input.subjectCode)));
  revalidatePath('/', 'layout');
  return { ok: true };
}

const BookmarkSchema = z.object({ kind: z.enum(['lesson', 'question']), targetId: z.string().min(1).max(200) });

export async function toggleBookmark(input: z.input<typeof BookmarkSchema>): Promise<{ bookmarked: boolean; error?: string }> {
  const parsed = BookmarkSchema.safeParse(input);
  const user = await getSessionUser();
  if (!user) return { bookmarked: false, error: 'Sign in to save things for later.' };
  if (!parsed.success) return { bookmarked: false, error: 'Unknown item.' };
  if (!hit(`write:${user.id}`, LIMITS.write).ok) return { bookmarked: false, error: 'Too many changes; try again shortly.' };
  const { kind, targetId } = parsed.data;
  const db = await getDb();
  const table = kind === 'lesson' ? t.lessons : t.questions;
  const exists = await db.select({ id: table.id }).from(table).where(eq(table.id, targetId));
  if (!exists.length) return { bookmarked: false, error: 'Unknown item.' };
  const where = and(eq(t.bookmarks.userId, user.id), eq(t.bookmarks.kind, kind), eq(t.bookmarks.targetId, targetId));
  const existing = await db.select().from(t.bookmarks).where(where);
  if (existing.length) {
    await db.delete(t.bookmarks).where(where);
    revalidatePath('/saved');
    return { bookmarked: false };
  }
  await db.insert(t.bookmarks).values({ userId: user.id, kind, targetId });
  revalidatePath('/saved');
  return { bookmarked: true };
}

const ReportSchema = z.object({
  kind: z.enum(['lesson', 'question']),
  targetId: z.string().min(1).max(200),
  reason: z.enum(['wrong-answer', 'error-in-content', 'unclear', 'other']),
  message: z.string().trim().min(3, 'Tell us a little about the problem.').max(2000),
});

/** Report a problem with a lesson or question. Works for guests too. */
export async function reportProblem(input: z.input<typeof ReportSchema>): Promise<{ ok: boolean; error?: string }> {
  const parsed = ReportSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check the form.' };
  const user = await getSessionUser();
  const ip = user ? null : await clientIp();
  const key = user ? `report:${user.id}` : ip ? `report:${ip}` : 'report:unknown-ip';
  if (!hit(key, user || ip ? LIMITS.report : { max: 200, windowMs: 60 * 60_000 }).ok) {
    return { ok: false, error: 'Thanks. You have sent a lot of reports recently; please try again later.' };
  }
  const db = await getDb();
  const table = parsed.data.kind === 'lesson' ? t.lessons : t.questions;
  const exists = await db.select({ id: table.id }).from(table).where(eq(table.id, parsed.data.targetId));
  if (!exists.length) return { ok: false, error: 'Unknown item.' };
  await db.insert(t.contentReports).values({ ...parsed.data, userId: user?.id ?? null });
  return { ok: true };
}
