/** Data export: everything stored about the signed-in student, as JSON. */
import { eq } from 'drizzle-orm';
import { getSessionUser } from '@/server/auth/session';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';
import { hit, LIMITS } from '@/server/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return new Response('Sign in first.', { status: 401 });
  if (!hit(`export:${user.id}`, { max: 10, windowMs: 60 * 60_000 }).ok) return new Response('Too many exports; try later.', { status: 429 });
  const db = await getDb();
  const [profile] = await db
    .select({ email: t.users.email, displayName: t.users.displayName, theme: t.users.theme, lessonMode: t.users.lessonMode, createdAt: t.users.createdAt, ageConfirmedAt: t.users.ageConfirmedAt })
    .from(t.users)
    .where(eq(t.users.id, user.id));
  const [enrollments, lessonProgress, attempts, reviewItems, bookmarks] = await Promise.all([
    db.select({ subjectCode: t.enrollments.subjectCode, versionId: t.enrollments.versionId, targetLevel: t.enrollments.targetLevel, createdAt: t.enrollments.createdAt }).from(t.enrollments).where(eq(t.enrollments.userId, user.id)),
    db.select({ lessonId: t.lessonProgress.lessonId, stepReached: t.lessonProgress.stepReached, stepCount: t.lessonProgress.stepCount, openedAt: t.lessonProgress.openedAt, lastViewedAt: t.lessonProgress.lastViewedAt, completedAt: t.lessonProgress.completedAt }).from(t.lessonProgress).where(eq(t.lessonProgress.userId, user.id)),
    db.select({ questionId: t.attempts.questionId, response: t.attempts.response, outcome: t.attempts.outcome, score: t.attempts.score, selfAssessed: t.attempts.selfAssessed, context: t.attempts.context, createdAt: t.attempts.createdAt }).from(t.attempts).where(eq(t.attempts.userId, user.id)),
    db.select({ questionId: t.reviewItems.questionId, box: t.reviewItems.box, dueAt: t.reviewItems.dueAt, lapses: t.reviewItems.lapses, lastReviewedAt: t.reviewItems.lastReviewedAt }).from(t.reviewItems).where(eq(t.reviewItems.userId, user.id)),
    db.select({ kind: t.bookmarks.kind, targetId: t.bookmarks.targetId, createdAt: t.bookmarks.createdAt }).from(t.bookmarks).where(eq(t.bookmarks.userId, user.id)),
  ]);
  const body = JSON.stringify({ exportedAt: new Date().toISOString(), profile, enrollments, lessonProgress, attempts, reviewItems, bookmarks }, null, 2);
  return new Response(body, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="my-study-data-${new Date().toISOString().slice(0, 10)}.json"`,
      'Cache-Control': 'no-store',
    },
  });
}
