/**
 * Cookie sessions. The cookie holds a random token; the database holds its
 * SHA-256 and the expiry. Sessions last 30 days and renew when used in their
 * second half. The database is the source of truth for validity, so the
 * cookie itself is long-lived and renewal needs no cookie write.
 */
import 'server-only';
import { cache } from 'react';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { and, eq, gt, lt } from 'drizzle-orm';
import { getDb } from '@/server/db';
import { sessions, users, type User } from '@/server/db/schema';
import { hashToken, newSessionToken, SESSION_DAYS, SESSION_RENEW_DAYS } from './tokens';

export const SESSION_COOKIE = 'fathom_session';
export { THEME_COOKIE } from '@/lib/brand';
import { THEME_COOKIE } from '@/lib/brand';
const DAY = 86_400_000;
const secure = process.env.NODE_ENV === 'production' && process.env.INSECURE_COOKIES !== '1';

export type SessionUser = Pick<User, 'id' | 'email' | 'displayName' | 'role' | 'theme' | 'lessonMode' | 'createdAt'>;

export async function createSession(userId: string): Promise<void> {
  const db = await getDb();
  const token = newSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * DAY);
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt });
  // Opportunistic clean-up of this user's expired sessions.
  await db.delete(sessions).where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date())));
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: 400 * DAY / 1000 });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const db = await getDb();
    await db.delete(sessions).where(eq(sessions.id, hashToken(token)));
  }
  jar.delete(SESSION_COOKIE);
}

/** The signed-in user for this request, or null. Cached per request. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const db = await getDb();
  const id = hashToken(token);
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      theme: users.theme,
      lessonMode: users.lessonMode,
      createdAt: users.createdAt,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, id), gt(sessions.expiresAt, new Date())));
  const row = rows[0];
  if (!row) return null;
  if (row.expiresAt.getTime() - Date.now() < SESSION_RENEW_DAYS * DAY) {
    await db.update(sessions).set({ expiresAt: new Date(Date.now() + SESSION_DAYS * DAY) }).where(eq(sessions.id, id));
  }
  const { expiresAt: _ignored, ...user } = row;
  return user;
});

/** For pages and actions that need an account. */
export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : '/login');
  return user;
}

export async function setThemeCookie(theme: User['theme']) {
  (await cookies()).set(THEME_COOKIE, theme, { httpOnly: false, sameSite: 'lax', secure, path: '/', maxAge: 400 * DAY / 1000 });
}

/** Best-effort client IP for rate limiting. Only trust X-Forwarded-For behind a proxy you control. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  if (process.env.TRUST_PROXY === '1') {
    const fwd = h.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (fwd) return fwd;
  }
  return h.get('x-real-ip') ?? 'local';
}
