'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { and, eq, ne } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { getDb } from '@/server/db';
import { sessions, users } from '@/server/db/schema';
import { hashPassword, PASSWORD_MAX, PASSWORD_MIN, verifyPassword } from '@/server/auth/password';
import { destroySession, getSessionUser, requireUser, SESSION_COOKIE, setThemeCookie } from '@/server/auth/session';
import { hashToken } from '@/server/auth/tokens';
import { hit, LIMITS } from '@/server/rate-limit';
import { canonicalTimeZone, isDailyGoal } from '@/domain/points';

export interface FormState {
  ok?: boolean;
  message?: string;
  error?: string;
}

const PrefsSchema = z.object({
  theme: z.enum(['system', 'light', 'dark']).optional(),
  lessonMode: z.enum(['steps', 'full']).optional(),
  /** XP per day: only the options in DAILY_GOALS (20, 50, 100, 150). */
  dailyGoal: z.number().refine(isDailyGoal, 'Pick one of the daily goals.').optional(),
  /** Confetti and pops. */
  celebrations: z.boolean().optional(),
  /** Little sound effects (off by default). */
  sounds: z.boolean().optional(),
});

/** Saves any of: theme, lesson mode, daily goal, celebrations, sounds. An invalid value rejects the whole change. */
export async function updatePreferences(input: z.input<typeof PrefsSchema>): Promise<{ ok: boolean }> {
  const user = await requireUser();
  const parsed = PrefsSchema.safeParse(input);
  if (!parsed.success || !hit(`write:${user.id}`, LIMITS.write).ok) return { ok: false };
  const patch = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== undefined)) as typeof parsed.data;
  if (!Object.keys(patch).length) return { ok: true };
  const db = await getDb();
  await db.update(users).set(patch).where(eq(users.id, user.id));
  if (patch.theme) await setThemeCookie(patch.theme);
  revalidatePath('/', 'layout');
  return { ok: true };
}

/**
 * Stores the browser's time zone (from Intl.DateTimeFormat().resolvedOptions()
 * .timeZone), which decides the local day XP and streaks count towards. Only
 * IANA names are accepted; they are stored in canonical form. Safe to call
 * on every visit: guests get { ok: false } and an unchanged zone is not
 * written again.
 */
export async function setTimeZone(timeZone: string): Promise<{ ok: boolean; timeZone?: string }> {
  const user = await getSessionUser();
  if (!user) return { ok: false };
  const zone = canonicalTimeZone(timeZone);
  if (!zone) return { ok: false };
  if (zone === user.timeZone) return { ok: true, timeZone: zone };
  if (!hit(`write:${user.id}`, LIMITS.write).ok) return { ok: false };
  const db = await getDb();
  await db.update(users).set({ timeZone: zone }).where(eq(users.id, user.id));
  revalidatePath('/', 'layout');
  return { ok: true, timeZone: zone };
}

export async function updateProfile(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const name = String(form.get('displayName') ?? '').trim();
  if (name.length > 40) return { error: 'Keep your name under 40 characters.' };
  const db = await getDb();
  await db.update(users).set({ displayName: name || null }).where(eq(users.id, user.id));
  revalidatePath('/', 'layout');
  return { ok: true, message: 'Saved.' };
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  if (!hit(`login:${user.email}`, LIMITS.login).ok) return { error: 'Too many attempts. Try again in a few minutes.' };
  const current = String(form.get('current') ?? '');
  const next = String(form.get('next') ?? '');
  if (next.length < PASSWORD_MIN) return { error: `Use at least ${PASSWORD_MIN} characters for the new password.` };
  if (next.length > PASSWORD_MAX) return { error: 'That password is too long.' };
  const db = await getDb();
  const [row] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, user.id));
  if (!row || !(await verifyPassword(current, row.hash))) return { error: 'Your current password is not right.' };
  await db.update(users).set({ passwordHash: await hashPassword(next) }).where(eq(users.id, user.id));
  // Sign out every other device.
  const token = (await cookies()).get(SESSION_COOKIE)?.value ?? '';
  await db.delete(sessions).where(and(eq(sessions.userId, user.id), ne(sessions.id, hashToken(token))));
  return { ok: true, message: 'Password changed. Other devices have been signed out.' };
}

export async function deleteAccount(_prev: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  if (!hit(`login:${user.email}`, LIMITS.login).ok) return { error: 'Too many attempts. Try again in a few minutes.' };
  if (String(form.get('confirm') ?? '').trim().toLowerCase() !== 'delete') return { error: 'Type "delete" to confirm.' };
  const db = await getDb();
  const [row] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, user.id));
  if (!row || !(await verifyPassword(String(form.get('password') ?? ''), row.hash))) return { error: 'That password is not right.' };
  await destroySession();
  // Cascades to sessions, enrolments, progress, attempts, reviews, bookmarks, XP events and badges.
  await db.delete(users).where(eq(users.id, user.id));
  redirect('/?deleted=1');
}
