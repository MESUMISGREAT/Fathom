'use server';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDb } from '@/server/db';
import { users } from '@/server/db/schema';
import { dummyHash, hashPassword, PASSWORD_MAX, PASSWORD_MIN, verifyPassword } from '@/server/auth/password';
import { clientIp, createSession, destroySession, setThemeCookie } from '@/server/auth/session';
import { hit, LIMITS } from '@/server/rate-limit';

export interface AuthState {
  error?: string;
  fields?: { email?: string; displayName?: string };
}

const Email = z.email({ message: 'Enter a valid email address.' }).max(254).transform((e) => e.trim().toLowerCase());

const SignUpSchema = z.object({
  email: Email,
  password: z
    .string()
    .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters.`)
    .max(PASSWORD_MAX, 'That password is too long.'),
  displayName: z
    .string()
    .trim()
    .max(40, 'Keep your name under 40 characters.')
    .transform((s) => s || null),
  ageConfirmed: z.literal('on', { message: 'Please confirm the age statement to continue.' }),
});

/** Only allow redirects to paths on this site. */
function safeNext(next: unknown): string | null {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : null;
}

export async function signUp(_prev: AuthState, form: FormData): Promise<AuthState> {
  const raw = {
    email: String(form.get('email') ?? ''),
    password: String(form.get('password') ?? ''),
    displayName: String(form.get('displayName') ?? ''),
    ageConfirmed: form.get('ageConfirmed') ?? undefined,
  };
  const fields = { email: raw.email, displayName: raw.displayName };
  if (!hit(`signup:${await clientIp()}`, LIMITS.signup).ok) {
    return { error: 'Too many sign-ups from this network. Please try again later.', fields };
  }
  const parsed = SignUpSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Check the form and try again.', fields };

  const db = await getDb();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, parsed.data.email));
  if (existing.length) return { error: 'That email is already registered. Try logging in instead.', fields };

  const [user] = await db
    .insert(users)
    .values({
      email: parsed.data.email,
      passwordHash: await hashPassword(parsed.data.password),
      displayName: parsed.data.displayName,
      ageConfirmedAt: new Date(),
    })
    .returning({ id: users.id });
  await createSession(user!.id);
  redirect('/subjects?welcome=1');
}

export async function logIn(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get('email') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const fields = { email };
  const ip = await clientIp();
  if (!hit(`login-ip:${ip}`, LIMITS.loginIp).ok || !hit(`login:${email}`, LIMITS.login).ok) {
    return { error: 'Too many attempts. Wait a few minutes and try again.', fields };
  }
  if (!email || !password || password.length > PASSWORD_MAX) return { error: 'Enter your email and password.', fields };

  const db = await getDb();
  const rows = await db.select().from(users).where(eq(users.email, email));
  const user = rows[0];
  // Always run one hash comparison so response time doesn't reveal whether the email exists.
  const ok = await verifyPassword(password, user?.passwordHash ?? (await dummyHash()));
  if (!user || !ok) return { error: 'That email and password don’t match.', fields };

  await createSession(user.id);
  await setThemeCookie(user.theme);
  redirect(safeNext(form.get('next')) ?? '/');
}

export async function logOut(): Promise<void> {
  await destroySession();
  redirect('/');
}
