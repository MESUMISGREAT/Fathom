/**
 * End-to-end server flow against an in-memory PostgreSQL (PGlite) with the
 * fixture content: the real server actions, with Next's request APIs mocked.
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { eq } from 'drizzle-orm';

process.env.DATABASE_URL = 'memory';
process.env.CONTENT_DIR = 'tests/fixtures/content';

const jar = new Map<string, string>();
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
    set: (name: string, value: string) => void jar.set(name, value),
    delete: (name: string) => void jar.delete(name),
  }),
  headers: async () => new Headers({ 'x-real-ip': '203.0.113.7' }),
}));
vi.mock('next/cache', () => ({ revalidatePath: () => {} }));
vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw Object.assign(new Error(`REDIRECT ${url}`), { url });
  },
}));

const { getDb } = await import('@/server/db');
const t = await import('@/server/db/schema');
const auth = await import('@/server/actions/auth');
const study = await import('@/server/actions/study');
const settings = await import('@/server/actions/settings');
const editor = await import('@/server/actions/editor');
const { getSessionUser } = await import('@/server/auth/session');
const { listSubjects } = await import('@/server/queries/catalog');
const { getSubjectProgress } = await import('@/server/queries/progress');
const { getDashboard } = await import('@/server/queries/dashboard');
const { search } = await import('@/server/queries/search');
const { importContent } = await import('@/server/db/content-sync');
const { loadContent } = await import('@/content/load');
const { resetRateLimits } = await import('@/server/rate-limit');

const form = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};
async function expectRedirect(p: Promise<unknown>): Promise<string> {
  try {
    await p;
  } catch (e) {
    if ((e as { url?: string }).url) return (e as { url: string }).url;
    throw e;
  }
  throw new Error('expected a redirect');
}

beforeAll(async () => {
  await getDb();
});

describe('content import', () => {
  it('imports the syllabus tree and lessons', async () => {
    const subjects = await listSubjects();
    expect(subjects).toHaveLength(1);
    expect(subjects[0]).toMatchObject({ code: '9709', counts: { topics: 3, objectives: 4, lessons: 2 } });
  });

  it('never stores answers in the public question view', async () => {
    const db = await getDb();
    const rows = await db.select({ view: t.questions.view }).from(t.questions);
    const json = JSON.stringify(rows);
    expect(json).not.toContain('"correct"');
    expect(json).not.toContain('errorLine');
    expect(json).not.toContain('keyPoints');
  });
});

describe('student flow', () => {
  it('signs up, rejects duplicates and bad input', async () => {
    const bad = await auth.signUp({}, form({ email: 'not-an-email', password: 'longenoughpw', ageConfirmed: 'on' }));
    expect(bad.error).toMatch(/valid email/);
    const noAge = await auth.signUp({}, form({ email: 'sam@example.org', password: 'longenoughpw' }));
    expect(noAge.error).toMatch(/age/);
    const url = await expectRedirect(auth.signUp({}, form({ email: 'Sam@Example.org', password: 'correct horse battery', displayName: 'Sam', ageConfirmed: 'on' })));
    expect(url).toBe('/subjects?welcome=1');
    expect(jar.get('fathom_session')).toBeTruthy();
    const user = await getSessionUser();
    expect(user).toMatchObject({ email: 'sam@example.org', displayName: 'Sam' });
    const dup = await auth.signUp({}, form({ email: 'sam@example.org', password: 'another password', ageConfirmed: 'on' }));
    expect(dup.error).toMatch(/already registered/);
  });

  it('stores only a hash of the session token and of the password', async () => {
    const db = await getDb();
    const [s] = await db.select().from(t.sessions);
    expect(s!.id).not.toBe(jar.get('fathom_session'));
    expect(s!.id).toMatch(/^[0-9a-f]{64}$/);
    const [u] = await db.select().from(t.users);
    expect(u!.passwordHash.startsWith('scrypt$')).toBe(true);
  });

  it('enrols, answers questions and schedules reviews', async () => {
    expect(await study.enroll({ subjectCode: '9709', targetLevel: 'A' })).toEqual({ ok: true });

    const right = await study.submitAnswer({ questionId: 'fixture-squares/q-mcq', response: { format: 'mcq', choice: 0 }, context: 'lesson' });
    expect(right.result.outcome).toBe('correct');
    expect(right.recorded).toBe(true);
    expect(right.reveal?.correctOption).toBe(0);
    expect(right.reveal?.whyHtml?.[1]).toContain('half of 6');

    const wrongParts = await study.submitAnswer({ questionId: 'fixture-squares/q-numeric', response: { format: 'numeric', values: ['3', '4'] }, context: 'lesson' });
    expect(wrongParts.result).toMatchObject({ outcome: 'partial', score: 0.5 });

    const unreadable = await study.submitAnswer({ questionId: 'fixture-squares/q-numeric', response: { format: 'numeric', values: ['three', '4'] }, context: 'lesson' });
    expect(unreadable.result.outcome).toBe('invalid');
    expect(unreadable.recorded).toBe(false);
    expect(unreadable.reveal).toBeUndefined();

    const expr = await study.submitAnswer({ questionId: 'fixture-squares/q-expr', response: { format: 'expression', value: 'x(x+4)' }, context: 'lesson' });
    expect(expr.result.outcome).toBe('correct');

    const unmatched = await study.submitAnswer({ questionId: 'fixture-squares/q-text', response: { format: 'text', value: 'discrimnant' }, context: 'lesson' });
    expect(unmatched).toMatchObject({ recorded: false, result: { outcome: 'self-check' } });
    const selfMarked = await study.submitAnswer({
      questionId: 'fixture-squares/q-text',
      response: { format: 'text', value: 'discrimnant' },
      self: { correct: true },
      context: 'lesson',
    });
    expect(selfMarked).toMatchObject({ recorded: true, result: { outcome: 'correct', selfAssessed: true } });

    const db = await getDb();
    const reviews = await db.select().from(t.reviewItems);
    const mcq = reviews.find((r) => r.questionId === 'fixture-squares/q-mcq')!;
    const numeric = reviews.find((r) => r.questionId === 'fixture-squares/q-numeric')!;
    expect(mcq.box).toBe(2);
    expect(numeric.box).toBe(1);
  });

  it('rejects malformed and unknown submissions', async () => {
    const r1 = await study.submitAnswer({ questionId: 'fixture-squares/q-mcq', response: { format: 'mcq', choice: -1 } as never, context: 'lesson' });
    expect(r1.result.outcome).toBe('invalid');
    const r2 = await study.submitAnswer({ questionId: 'nope/q', response: { format: 'mcq', choice: 0 }, context: 'lesson' });
    expect(r2.result.outcome).toBe('invalid');
    const r3 = await study.submitAnswer({ questionId: 'fixture-squares/q-mcq', response: { format: 'text', value: 'A' }, context: 'lesson' });
    expect(r3.result.outcome).toBe('invalid');
  });

  it('tracks lesson progress and computes mastery from evidence', async () => {
    await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 1, stepCount: 3, completed: false });
    await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 0, stepCount: 3, completed: false });
    await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 2, stepCount: 3, completed: true });
    await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 2, stepCount: 3, completed: false });
    const user = (await getSessionUser())!;
    const versionId = (await listSubjects())[0]!.version.id;
    const p = await getSubjectProgress(user.id, versionId);
    const lesson = p.lessons.get('fixture-squares')!;
    expect(lesson.status).toBe('completed'); // completion is sticky
    expect(lesson.stepReached).toBe(2); // never goes backwards
    const o1 = p.objectives.get(`${versionId}:1.1.1`)!;
    expect(o1.studied).toBe(true);
    expect(o1.mastery.state).toBe('practising'); // right answers, but all on one day
    expect(p.summary).toMatchObject({ objectives: 4, studied: 2, lessonsCompleted: 1, lessonsTotal: 2 });
    const asOnly = await getSubjectProgress(user.id, versionId, 'AS');
    expect(asOnly.summary.objectives).toBe(3);
  });

  it('recommends a next step and lists recent results on the dashboard', async () => {
    const user = (await getSessionUser())!;
    const d = await getDashboard(user.id);
    expect(d.enrolled).toHaveLength(1);
    expect(d.next).toMatchObject({ kind: 'start', lesson: { id: 'fixture-functions' } });
    expect(d.recent[0]).toMatchObject({ lessonId: 'fixture-squares' });
    expect(d.week.answered).toBeGreaterThanOrEqual(4);
  });

  it('searches with exact syllabus codes first', async () => {
    const byCode = await search('1.1.2');
    expect(byCode[0]).toMatchObject({ kind: 'objective', code: '1.1.2' });
    const byWord = await search('discriminant');
    expect(byWord.some((r) => r.kind === 'objective' && r.code === '1.1.2')).toBe(true);
    expect(byWord.some((r) => r.kind === 'lesson' && r.id === 'fixture-squares')).toBe(true);
    const questionsOnly = await search('discriminant', { kind: 'question', format: 'cloze' });
    expect(questionsOnly.every((r) => r.kind === 'question' && r.format === 'cloze')).toBe(true);
    expect(await search('a')).toEqual([]);
    expect(await search('100%_\\')).toEqual([]);
  });

  it('toggles bookmarks', async () => {
    expect(await study.toggleBookmark({ kind: 'lesson', targetId: 'fixture-squares' })).toEqual({ bookmarked: true });
    expect(await study.toggleBookmark({ kind: 'lesson', targetId: 'fixture-squares' })).toEqual({ bookmarked: false });
    expect((await study.toggleBookmark({ kind: 'lesson', targetId: 'missing' })).error).toBeTruthy();
  });

  it('accepts content reports and lets only editors triage them', async () => {
    const bad = await study.reportProblem({ kind: 'question', targetId: 'fixture-squares/q-mcq', reason: 'wrong-answer', message: '' });
    expect(bad.ok).toBe(false);
    expect(await study.reportProblem({ kind: 'question', targetId: 'nope', reason: 'other', message: 'Something odd' })).toMatchObject({ ok: false });
    expect(await study.reportProblem({ kind: 'question', targetId: 'fixture-squares/q-mcq', reason: 'wrong-answer', message: 'Option B looks right to me' })).toEqual({ ok: true });
    const db = await getDb();
    const [report] = await db.select().from(t.contentReports);
    expect(report).toMatchObject({ status: 'open', reason: 'wrong-answer' });
    expect(await editor.setReportStatus({ id: report!.id, status: 'fixed' })).toEqual({ ok: false }); // students can't
    const user = (await getSessionUser())!;
    await db.update(t.users).set({ role: 'editor' }).where(eq(t.users.id, user.id));
    expect(await editor.setReportStatus({ id: report!.id, status: 'fixed' })).toEqual({ ok: true });
    await db.update(t.users).set({ role: 'student' }).where(eq(t.users.id, user.id));
  });

  it('archives removed content instead of deleting it, keeping attempts', async () => {
    const db = await getDb();
    const bundle = await loadContent();
    bundle.lessons = bundle.lessons.filter((l) => l.data.id !== 'fixture-squares');
    await importContent(db, bundle, 'test-hash-without-squares');
    const [lesson] = await db.select().from(t.lessons).where(eq(t.lessons.id, 'fixture-squares'));
    expect(lesson!.archivedAt).not.toBeNull();
    expect((await db.select().from(t.attempts)).length).toBeGreaterThan(0);
    expect((await listSubjects())[0]!.counts.lessons).toBe(1);
    await importContent(db, await loadContent(), 'test-hash-restored');
    const [restored] = await db.select().from(t.lessons).where(eq(t.lessons.id, 'fixture-squares'));
    expect(restored!.archivedAt).toBeNull();
  });

  it('logs out, rate-limits bad logins and logs back in', async () => {
    await expectRedirect(auth.logOut());
    expect(await getSessionUser()).toBeNull();
    const guest = await study.submitAnswer({ questionId: 'fixture-squares/q-mcq', response: { format: 'mcq', choice: 0 }, context: 'lesson' });
    expect(guest).toMatchObject({ recorded: false, signedIn: false, result: { outcome: 'correct' } });
    const wrong = await auth.logIn({}, form({ email: 'sam@example.org', password: 'wrong password' }));
    expect(wrong.error).toMatch(/don.t match/);
    const unknown = await auth.logIn({}, form({ email: 'nobody@example.org', password: 'whatever pw' }));
    expect(unknown.error).toBe(wrong.error); // no account enumeration
    expect(await expectRedirect(auth.logIn({}, form({ email: 'sam@example.org', password: 'correct horse battery', next: '//evil.example' })))).toBe('/');
    for (let i = 0; i < 12; i++) await auth.logIn({}, form({ email: 'sam@example.org', password: 'nope nope nope' }));
    const limited = await auth.logIn({}, form({ email: 'sam@example.org', password: 'correct horse battery' }));
    expect(limited.error).toMatch(/Too many/);
    resetRateLimits();
  });

  it('deletes the account and everything linked to it', async () => {
    const wrong = await settings.deleteAccount({}, form({ password: 'correct horse battery', confirm: 'nope' }));
    expect(wrong.error).toMatch(/delete/);
    await expectRedirect(settings.deleteAccount({}, form({ password: 'correct horse battery', confirm: 'delete' })));
    const db = await getDb();
    expect(await db.select().from(t.users)).toHaveLength(0);
    expect(await db.select().from(t.attempts)).toHaveLength(0);
    expect(await db.select().from(t.reviewItems)).toHaveLength(0);
    expect(await db.select().from(t.sessions)).toHaveLength(0);
  });
});
