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
}

export async function submitAnswer(input: z.input<typeof SubmitSchema>): Promise<SubmitResult> {
  const parsed = SubmitSchema.safeParse(input);
  const invalid = (note: string): SubmitResult => ({
    result: { outcome: 'invalid', score: 0, selfAssessed: false, parts: [], note },
    recorded: false,
    signedIn: false,
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
  if (result.outcome === 'invalid') return { result, recorded: false, signedIn: !!user };
  if (result.outcome === 'self-check') return { result, reveal: q.reveal, recorded: false, signedIn: !!user };

  let recorded = false;
  if (user) {
    const now = new Date();
    await db.transaction(async (tx) => {
      await tx.insert(t.attempts).values({
        userId: user.id,
        questionId,
        response,
        outcome: result.outcome,
        score: result.score,
        selfAssessed: result.selfAssessed,
        context,
        createdAt: now,
      });
      const prevRows = await tx
        .select()
        .from(t.reviewItems)
        .where(and(eq(t.reviewItems.userId, user.id), eq(t.reviewItems.questionId, questionId)))
        .for('update');
      const prev = prevRows[0];
      const next = nextReview(prev ? { box: prev.box, dueAt: prev.dueAt, lapses: prev.lapses, lastReviewedAt: prev.lastReviewedAt } : null, result.score, now);
      await tx
        .insert(t.reviewItems)
        .values({ userId: user.id, questionId, ...next })
        .onConflictDoUpdate({ target: [t.reviewItems.userId, t.reviewItems.questionId], set: next });
    });
    recorded = true;
  }
  return { result, reveal: q.reveal, recorded, signedIn: !!user };
}

const StepSchema = z.object({
  lessonId: z.string().min(1).max(120),
  stepReached: z.number().int().min(0).max(100),
  stepCount: z.number().int().min(1).max(100),
  completed: z.boolean(),
});

export async function recordLessonStep(input: z.input<typeof StepSchema>): Promise<{ saved: boolean }> {
  const parsed = StepSchema.safeParse(input);
  const user = await getSessionUser();
  if (!parsed.success || !user) return { saved: false };
  if (!hit(`write:${user.id}`, LIMITS.write).ok) return { saved: false };
  const { lessonId, stepReached, stepCount, completed } = parsed.data;
  const db = await getDb();
  const exists = await db.select({ id: t.lessons.id }).from(t.lessons).where(and(eq(t.lessons.id, lessonId), isNull(t.lessons.archivedAt)));
  if (!exists.length) return { saved: false };
  const now = new Date();
  await db
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
  if (completed) revalidatePath('/', 'layout');
  return { saved: true };
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
