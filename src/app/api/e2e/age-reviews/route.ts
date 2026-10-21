/**
 * End-to-end test hook: makes the signed-in student's review questions due
 * now, so the review flow can be tested without waiting days. Exists only
 * when the server runs with E2E_HOOKS=1 (playwright.config.ts sets it for
 * its throwaway database); everywhere else it is a 404. It only ever touches
 * the caller's own schedule.
 */
import { eq, sql } from 'drizzle-orm';
import { getSessionUser } from '@/server/auth/session';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';

export const dynamic = 'force-dynamic';

export async function POST() {
  if (process.env.E2E_HOOKS !== '1') return new Response('Not found', { status: 404 });
  const user = await getSessionUser();
  if (!user) return new Response('Sign in first.', { status: 401 });
  const db = await getDb();
  const rows = await db
    .update(t.reviewItems)
    .set({ dueAt: sql`now() - interval '1 hour'` })
    .where(eq(t.reviewItems.userId, user.id))
    .returning({ questionId: t.reviewItems.questionId });
  return Response.json({ due: rows.length });
}
