/** Spaced-repetition queue queries. */
import 'server-only';
import { and, asc, count, eq, isNull, lte } from 'drizzle-orm';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';

export async function countDue(userId: string, now = new Date()): Promise<number> {
  const db = await getDb();
  const [row] = await db
    .select({ n: count() })
    .from(t.reviewItems)
    .innerJoin(t.questions, eq(t.questions.id, t.reviewItems.questionId))
    .innerJoin(t.enrollments, and(eq(t.enrollments.userId, t.reviewItems.userId), eq(t.enrollments.versionId, t.questions.versionId)))
    .where(and(eq(t.reviewItems.userId, userId), lte(t.reviewItems.dueAt, now), isNull(t.questions.archivedAt)));
  return row?.n ?? 0;
}

/** Due questions for enrolled subjects, most overdue first. */
export async function getDueQuestions(userId: string, limit = 10, now = new Date()) {
  const db = await getDb();
  return db
    .select({ id: t.questions.id, lessonId: t.questions.lessonId, view: t.questions.view, box: t.reviewItems.box, dueAt: t.reviewItems.dueAt })
    .from(t.reviewItems)
    .innerJoin(t.questions, eq(t.questions.id, t.reviewItems.questionId))
    .innerJoin(t.enrollments, and(eq(t.enrollments.userId, t.reviewItems.userId), eq(t.enrollments.versionId, t.questions.versionId)))
    .where(and(eq(t.reviewItems.userId, userId), lte(t.reviewItems.dueAt, now), isNull(t.questions.archivedAt)))
    .orderBy(asc(t.reviewItems.dueAt))
    .limit(limit);
}

/** The next time something becomes due, for the "all caught up" state. Same scope as the queue (enrolled subjects), so the two never disagree. */
export async function nextDueAt(userId: string): Promise<Date | null> {
  const db = await getDb();
  const rows = await db
    .select({ dueAt: t.reviewItems.dueAt })
    .from(t.reviewItems)
    .innerJoin(t.questions, eq(t.questions.id, t.reviewItems.questionId))
    .innerJoin(t.enrollments, and(eq(t.enrollments.userId, t.reviewItems.userId), eq(t.enrollments.versionId, t.questions.versionId)))
    .where(and(eq(t.reviewItems.userId, userId), isNull(t.questions.archivedAt)))
    .orderBy(asc(t.reviewItems.dueAt))
    .limit(1);
  return rows[0]?.dueAt ?? null;
}
