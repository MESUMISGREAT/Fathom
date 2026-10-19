/**
 * The points system end to end against an in-memory PostgreSQL (PGlite) with
 * the fixture content: real server actions, with Next's request APIs mocked.
 * Each scenario signs up a fresh student so its numbers are self-contained.
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { and, eq, sql } from 'drizzle-orm';

process.env.DATABASE_URL = 'memory';
process.env.CONTENT_DIR = 'tests/fixtures/content';

const jar = new Map<string, string>();
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
    set: (name: string, value: string) => void jar.set(name, value),
    delete: (name: string) => void jar.delete(name),
  }),
  headers: async () => new Headers({ 'x-real-ip': '203.0.113.9' }),
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
const { getSessionUser } = await import('@/server/auth/session');
const { getPointsSummary, getPointsHistory } = await import('@/server/queries/points');
const { insertXp, loadBadgeStats } = await import('@/server/points');
const { resetRateLimits } = await import('@/server/rate-limit');
const { addDays, BADGES, localDay } = await import('@/domain/points');
const exportRoute = await import('@/app/api/export/route');

type Submit = Parameters<typeof study.submitAnswer>[0];
type Points = NonNullable<Awaited<ReturnType<typeof study.submitAnswer>>['points']>;

const PASSWORD = 'correct horse battery';
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

let students = 0;
async function newStudent(extra: Record<string, string> = {}) {
  resetRateLimits();
  jar.clear();
  const email = `points${++students}@example.org`;
  await expectRedirect(auth.signUp({}, form({ email, password: PASSWORD, ageConfirmed: 'on', ...extra })));
  expect(await study.enroll({ subjectCode: '9709', targetLevel: 'A' })).toEqual({ ok: true });
  return (await getSessionUser())!;
}

const sq = (id: string) => `fixture-squares/${id}`;
const right: Record<string, Omit<Submit, 'context'>> = {
  'q-mcq': { questionId: sq('q-mcq'), response: { format: 'mcq', choice: 0 } },
  'q-numeric': { questionId: sq('q-numeric'), response: { format: 'numeric', values: ['3', '-4'] } },
  'q-expr': { questionId: sq('q-expr'), response: { format: 'expression', value: 'x^2 + 4x' } },
  'q-text': { questionId: sq('q-text'), response: { format: 'text', value: 'discriminant' } },
  'q-cloze': { questionId: sq('q-cloze'), response: { format: 'cloze', values: ['no'] } },
  'q-spot': { questionId: sq('q-spot'), response: { format: 'spot-error', line: 2 } },
  'q-explain': { questionId: sq('q-explain'), response: { format: 'explain', value: 'The square is never negative.' }, self: { points: [0, 1] } },
  'q-one': { questionId: 'fixture-functions/q-one', response: { format: 'mcq', choice: 0 } },
};
const SQUARES = ['q-mcq', 'q-numeric', 'q-expr', 'q-text', 'q-cloze', 'q-spot', 'q-explain'];

async function answer(id: keyof typeof right | string, context: 'lesson' | 'review' = 'lesson'): Promise<Points> {
  const res = await study.submitAnswer({ ...right[id]!, context });
  expect(res.recorded).toBe(true);
  return res.points!;
}
async function submit(input: Submit): Promise<Points> {
  const res = await study.submitAnswer(input);
  expect(res.recorded).toBe(true);
  return res.points!;
}
const kinds = (p: Points) => p.events.map((e) => `${e.kind}:${e.amount}`);

async function xpRows(userId: string) {
  const db = await getDb();
  return db.select().from(t.xpEvents).where(eq(t.xpEvents.userId, userId));
}
async function makeDue(userId: string, questionId: string, dueAt: Date) {
  const db = await getDb();
  await db.update(t.reviewItems).set({ dueAt }).where(and(eq(t.reviewItems.userId, userId), eq(t.reviewItems.questionId, questionId)));
}

beforeAll(async () => {
  await getDb();
});

describe('guests', () => {
  it('get feedback but no points', async () => {
    jar.clear();
    const res = await study.submitAnswer({ ...right['q-mcq']!, context: 'lesson' });
    expect(res).toMatchObject({ recorded: false, signedIn: false, points: null, result: { outcome: 'correct' } });
    expect(await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 9, stepCount: 10, completed: true })).toEqual({ saved: false, points: null });
    expect(await settings.setTimeZone('Europe/London')).toEqual({ ok: false });
  });
});

describe('answer XP', () => {
  it('awards a first correct answer once, with level, goal, streak and a first badge', async () => {
    const user = await newStudent();
    const first = await answer('q-mcq');
    expect(first).toMatchObject({
      gained: 10,
      events: [{ kind: 'answer', amount: 10, label: 'Correct first time' }],
      combo: 1,
      totalXp: 10,
      level: { level: 1, title: 'Curious', xpIntoLevel: 10, xpForNextLevel: 50 },
      leveledUp: false,
      today: { xp: 10, goal: 50, goalMet: false, justMetGoal: false },
      streak: { current: 1, activeToday: true, alive: true, freezesBanked: 0 },
      newBadges: [{ id: 'first-spark', name: 'First Spark' }],
    });
    expect(first.today.day).toBe(localDay(new Date(), 'UTC'));

    // Re-answering earns nothing and leaves the combo alone.
    const again = await answer('q-mcq');
    expect(again).toMatchObject({ gained: 0, events: [], combo: 1, totalXp: 10, newBadges: [] });
    expect(await xpRows(user.id)).toHaveLength(1);
    const db = await getDb();
    const attempts = await db.select({ combo: t.attempts.combo }).from(t.attempts).where(eq(t.attempts.userId, user.id)).orderBy(t.attempts.createdAt);
    expect(attempts.map((a) => a.combo)).toEqual([1, null]);
  });

  it('pays half for a partial first attempt and nothing more when it is corrected', async () => {
    await newStudent();
    const partial = await submit({ questionId: sq('q-numeric'), response: { format: 'numeric', values: ['3', '4'] }, context: 'lesson' });
    expect(partial).toMatchObject({ gained: 8, events: [{ kind: 'answer', amount: 8, label: 'Partly right' }], combo: 0 });
    expect((await answer('q-numeric')).gained).toBe(0);
  });

  it('pays 5 for fixing a wrong answer on a later attempt, once', async () => {
    await newStudent();
    await answer('q-mcq'); // combo 1
    const wrong = await submit({ questionId: sq('q-cloze'), response: { format: 'cloze', values: ['some'] }, context: 'lesson' });
    expect(wrong).toMatchObject({ gained: 0, combo: 0 }); // an eligible wrong answer breaks the combo
    const fixed = await answer('q-cloze');
    expect(fixed).toMatchObject({ gained: 5, events: [{ kind: 'answer', amount: 5, label: 'You fixed it' }], combo: 1 });
    expect((await answer('q-cloze')).gained).toBe(0);
  });

  it('pays self-assessed answers round(base × score × 0.5)', async () => {
    await newStudent();
    const half = await submit({ ...right['q-explain']!, self: { points: [0] }, context: 'lesson' });
    expect(half).toMatchObject({ gained: 5, events: [{ kind: 'answer', amount: 5, label: 'Self-checked' }] });
    await newStudent();
    const full = await answer('q-explain');
    expect(full.events).toEqual([{ kind: 'answer', amount: 10, label: 'Self-checked' }]);
    expect(full.combo).toBe(1);
  });

  it('pays a due review once per due date', async () => {
    const user = await newStudent();
    expect((await answer('q-mcq')).gained).toBe(10);
    const due1 = new Date(Date.now() - 60 * 60_000);
    await makeDue(user.id, sq('q-mcq'), due1);
    const review = await answer('q-mcq', 'review');
    expect(review).toMatchObject({ gained: 10, events: [{ kind: 'review', amount: 10, label: 'Review' }] });
    const rows = (await xpRows(user.id)).filter((r) => r.kind === 'review');
    expect(rows.map((r) => r.sourceId)).toEqual([`${sq('q-mcq')}@${due1.toISOString()}`]);

    // The review moved the due date forward: answering again is early, so nothing.
    expect((await answer('q-mcq', 'review')).gained).toBe(0);
    // Even if the same due date comes back, it has already paid.
    await makeDue(user.id, sq('q-mcq'), due1);
    expect((await answer('q-mcq', 'review')).gained).toBe(0);
    // A new due date pays again; a due question answered inside a lesson is its review.
    // (It is also the third scoring answer in a row: the repeats in between were neutral.)
    await makeDue(user.id, sq('q-mcq'), new Date(Date.now() - 60_000));
    expect(kinds(await answer('q-mcq', 'lesson'))).toEqual(['review:10', 'combo:5']);

    // Partly right while due: 5.
    await answer('q-numeric');
    await makeDue(user.id, sq('q-numeric'), new Date(Date.now() - 60_000));
    const partial = await submit({ questionId: sq('q-numeric'), response: { format: 'numeric', values: ['3', '4'] }, context: 'review' });
    expect(partial.events).toEqual([{ kind: 'review', amount: 5, label: 'Review, partly right' }]);

    // Memory Keeper counts the two correct due reviews, not the partly right one.
    const { stats } = await loadBadgeStats(await getDb(), user.id, { totalXp: 0, longestStreak: 0 });
    expect(stats.dueReviewsCorrect).toBe(2);
  });
});

describe('combos', () => {
  it('pays milestones at 3, 5 and 10, ignores repeats and breaks on a mistake', async () => {
    const user = await newStudent();
    expect((await answer('q-mcq')).combo).toBe(1);
    expect((await answer('q-expr')).combo).toBe(2);
    const three = await answer('q-text');
    expect(three.combo).toBe(3);
    expect(three.events).toContainEqual({ kind: 'combo', amount: 5, label: 'Combo ×3' });

    const repeat = await answer('q-mcq');
    expect(repeat).toMatchObject({ combo: 3, gained: 0 });

    expect((await answer('q-cloze')).combo).toBe(4);
    const five = await answer('q-spot');
    expect(five.combo).toBe(5);
    expect(five.events).toContainEqual({ kind: 'combo', amount: 10, label: 'Combo ×5' });
    expect(five.newBadges.map((b) => b.id)).toContain('combo-5');

    for (const id of ['q-numeric', 'q-explain', 'q-one']) await answer(id);
    // Two due reviews take it to 10.
    for (const id of ['q-mcq', 'q-expr', 'q-text']) await makeDue(user.id, sq(id), new Date(Date.now() - 60_000));
    expect((await answer('q-mcq', 'review')).combo).toBe(9);
    const ten = await answer('q-expr', 'review');
    expect(ten.combo).toBe(10);
    expect(ten.events).toContainEqual({ kind: 'combo', amount: 15, label: 'Combo ×10' });
    expect(ten.newBadges.map((b) => b.id)).toContain('combo-10');

    // A wrong due review breaks it.
    const broken = await submit({ questionId: sq('q-text'), response: { format: 'text', value: 'nope' }, self: { correct: false }, context: 'review' });
    expect(broken).toMatchObject({ combo: 0, gained: 0 });
    const combos = (await xpRows(user.id)).filter((r) => r.kind === 'combo').map((r) => r.amount);
    expect(combos).toEqual([5, 10, 15]);
  });

  it('ends a combo after 15 minutes without a scoring answer', async () => {
    const user = await newStudent();
    await answer('q-mcq');
    expect((await answer('q-expr')).combo).toBe(2);
    const db = await getDb();
    await db
      .update(t.attempts)
      .set({ createdAt: sql`${t.attempts.createdAt} - interval '16 minutes'` })
      .where(eq(t.attempts.userId, user.id));
    const next = await answer('q-text');
    expect(next.combo).toBe(1);
    expect(kinds(next)).toEqual(['answer:10']);
  });
});

describe('lessons', () => {
  it('pays 20 for a first completion plus 10 for a perfect lesson, once', async () => {
    const user = await newStudent();
    for (const id of SQUARES) await answer(id);
    const step = await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 3, stepCount: 10, completed: false });
    expect(step).toEqual({ saved: true, points: null });
    const before = (await getPointsSummary(user.id)).totalXp;
    const done = await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 9, stepCount: 10, completed: true });
    expect(done.saved).toBe(true);
    expect(done.points).toMatchObject({
      events: [
        { kind: 'lesson', amount: 20, label: 'Lesson finished' },
        { kind: 'perfect', amount: 10, label: 'Perfect lesson' },
      ],
      gained: 30,
      totalXp: before + 30,
    });
    expect(done.points!.newBadges.map((b) => b.id)).toEqual(expect.arrayContaining(['off-the-blocks', 'flawless']));
    const again = await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 9, stepCount: 10, completed: true });
    expect(again.points).toMatchObject({ gained: 0, events: [], totalXp: before + 30 });
  });

  it('is not perfect after a wrong or skipped first attempt', async () => {
    await newStudent();
    await submit({ questionId: sq('q-mcq'), response: { format: 'mcq', choice: 1 }, context: 'lesson' });
    for (const id of SQUARES) await answer(id);
    const done = await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 9, stepCount: 10, completed: true });
    expect(kinds(done.points!)).toEqual(['lesson:20']);

    await newStudent();
    await answer('q-mcq'); // the rest skipped
    const skipped = await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 9, stepCount: 10, completed: true });
    expect(kinds(skipped.points!)).toEqual(['lesson:20']);
  });
});

describe('daily goal', () => {
  it('only accepts the listed goals and pays the bonus once a day', async () => {
    const user = await newStudent();
    expect(await settings.updatePreferences({ dailyGoal: 30 })).toEqual({ ok: false });
    expect(await settings.updatePreferences({ dailyGoal: 20 })).toEqual({ ok: true });
    expect((await answer('q-mcq')).today).toMatchObject({ xp: 10, goal: 20, goalMet: false, justMetGoal: false });
    const met = await answer('q-expr');
    expect(kinds(met)).toEqual(['answer:10', 'daily-goal:10']);
    expect(met.today).toMatchObject({ xp: 30, goal: 20, goalMet: true, justMetGoal: true });
    expect(met.gained).toBe(20);
    const after = await answer('q-text');
    expect(kinds(after)).toEqual(['answer:10', 'combo:5']);
    expect(after.today).toMatchObject({ xp: 45, goalMet: true, justMetGoal: false });
    const goals = (await xpRows(user.id)).filter((r) => r.kind === 'daily-goal');
    expect(goals).toHaveLength(1);
    expect(goals[0]!.sourceId).toBe(met.today.day);
    expect(goals[0]!.localDay).toBe(met.today.day);
  });
});

describe('double submissions', () => {
  it('award once when the same answer arrives twice at the same time', async () => {
    const user = await newStudent();
    const [a, b] = await Promise.all([
      study.submitAnswer({ ...right['q-mcq']!, context: 'lesson' }),
      study.submitAnswer({ ...right['q-mcq']!, context: 'lesson' }),
    ]);
    expect(a.recorded && b.recorded).toBe(true);
    expect(a.points!.gained + b.points!.gained).toBe(10);
    expect(await xpRows(user.id)).toHaveLength(1);
    const db = await getDb();
    expect(await db.select().from(t.attempts).where(eq(t.attempts.userId, user.id))).toHaveLength(2);
  });

  it('count a combo milestone once when different answers arrive together', async () => {
    const user = await newStudent();
    await Promise.all(['q-mcq', 'q-expr', 'q-text'].map((id) => study.submitAnswer({ ...right[id]!, context: 'lesson' })));
    const rows = await xpRows(user.id);
    expect(rows.filter((r) => r.kind === 'answer')).toHaveLength(3);
    expect(rows.filter((r) => r.kind === 'combo').map((r) => r.amount)).toEqual([5]);
  });

  it('are refused by the unique index itself', async () => {
    const user = await newStudent();
    const db = await getDb();
    const award = { kind: 'answer' as const, amount: 10, label: 'x' };
    const now = new Date();
    expect(await insertXp(db, user.id, award, 'some/question', '2026-10-19', now)).toBe(true);
    expect(await insertXp(db, user.id, award, 'some/question', '2026-10-19', now)).toBe(false);
    await expect(
      db.insert(t.xpEvents).values({ userId: user.id, kind: 'answer', amount: 10, sourceId: 'some/question', localDay: '2026-10-19' }),
    ).rejects.toThrow();
  });
});

describe('time zones and settings', () => {
  it('validates and stores the browser time zone, and counts XP on that local day', async () => {
    const user = await newStudent();
    expect(user.timeZone).toBe('UTC');
    expect(await settings.setTimeZone('Not/AZone')).toEqual({ ok: false });
    expect(await settings.setTimeZone('+05:00')).toEqual({ ok: false });
    expect(await settings.setTimeZone('pacific/kiritimati')).toEqual({ ok: true, timeZone: 'Pacific/Kiritimati' });
    expect((await getSessionUser())!.timeZone).toBe('Pacific/Kiritimati');
    expect(await settings.setTimeZone('Pacific/Kiritimati')).toEqual({ ok: true, timeZone: 'Pacific/Kiritimati' });
    const p = await answer('q-mcq');
    const day = localDay(new Date(), 'Pacific/Kiritimati');
    expect(p.today.day).toBe(day);
    expect((await xpRows(user.id))[0]!.localDay).toBe(day);
  });

  it('takes a time zone at sign-up and ignores junk', async () => {
    expect((await newStudent({ timeZone: 'Asia/Karachi' })).timeZone).toBe('Asia/Karachi');
    expect((await newStudent({ timeZone: 'nowhere' })).timeZone).toBe('UTC');
  });

  it('saves the celebrations and sounds toggles', async () => {
    const user = await newStudent();
    expect(user).toMatchObject({ celebrations: true, sounds: false, dailyGoal: 50 });
    expect(await settings.updatePreferences({ celebrations: false, sounds: true })).toEqual({ ok: true });
    expect(await getSessionUser()).toMatchObject({ celebrations: false, sounds: true });
    expect(await settings.updatePreferences({ sounds: 'yes' as unknown as boolean })).toEqual({ ok: false });
    expect(await settings.updatePreferences({})).toEqual({ ok: true });
  });
});

describe('queries', () => {
  it('summarises XP, level, today, streak, the last 7 days and latest badges', async () => {
    const user = await newStudent();
    const db = await getDb();
    const today = localDay(new Date(), 'UTC');
    // Seven earlier days in a row (one freeze), then yesterday missed.
    await db.insert(t.xpEvents).values(
      Array.from({ length: 7 }, (_, i) => ({ userId: user.id, kind: 'answer' as const, amount: 10, sourceId: `old/${i}`, localDay: addDays(today, -8 + i) })),
    );
    const p = await answer('q-mcq');
    expect(p.streak).toMatchObject({ current: 8, alive: true, activeToday: true, freezesBanked: 0, frozenDays: [addDays(today, -1)] });
    expect(p.newBadges.map((b) => b.id)).toEqual(expect.arrayContaining(['first-spark', 'on-a-roll', 'week-warrior']));

    const s = await getPointsSummary(user.id);
    expect(s).toMatchObject({
      totalXp: 80,
      level: { level: 2, xpIntoLevel: 30 },
      today: { day: today, xp: 10, goal: 50, goalMet: false },
      streak: { current: 8, longest: 8 },
      settings: { dailyGoal: 50, timeZone: 'UTC', celebrations: true, sounds: false },
      badgeCount: 3,
    });
    expect(s.week.map((d) => d.day)).toEqual(Array.from({ length: 7 }, (_, i) => addDays(today, i - 6)));
    expect(s.week.map((d) => (d.frozen ? 'F' : d.active ? 'A' : '-')).join('')).toBe('AAAAAFA');
    expect(s.week[6]).toMatchObject({ isToday: true, xp: 10, active: true });
    expect(s.latestBadges).toHaveLength(3);
  });

  it('gives 14 days of history and every badge, earned or locked, with progress', async () => {
    const user = await newStudent();
    for (const id of SQUARES) await answer(id);
    await study.recordLessonStep({ lessonId: 'fixture-squares', stepReached: 9, stepCount: 10, completed: true });
    const h = await getPointsHistory(user.id);
    expect(h.days).toHaveLength(14);
    expect(h.days[13]).toMatchObject({ isToday: true, active: true, goalMet: true });
    expect(h.days[13]!.xp).toBe(h.totalXp);
    expect(h.badges.map((b) => b.id)).toEqual(BADGES.map((b) => b.id));
    const byId = new Map(h.badges.map((b) => [b.id, b]));
    expect(byId.get('first-spark')).toMatchObject({ earned: true, progress: { current: 1, target: 1 } });
    expect(byId.get('first-spark')!.earnedAt).toBeInstanceOf(Date);
    expect(byId.get('flawless')).toMatchObject({ earned: true });
    expect(byId.get('ten-down')).toMatchObject({ earned: false, earnedAt: null, progress: { current: 1, target: 10 }, howToEarn: 'Finish 10 lessons.' });
    expect(byId.get('combo-5')).toMatchObject({ earned: true });
    expect(h.earnedCount).toBe(h.badges.filter((b) => b.earned).length);

    const { stats, earned } = await loadBadgeStats(await getDb(), user.id, { totalXp: h.totalXp, longestStreak: h.streak.longest });
    expect(stats).toEqual({
      correctAnswers: 7,
      lessonsFinished: 1,
      perfectLessons: 1,
      bestCombo: 7,
      longestStreak: 1,
      dueReviewsCorrect: 0,
      goalDays: 1,
      subjectsWithFinishedLessons: 1,
      totalXp: 135,
    });
    expect(earned.sort()).toEqual(h.badges.filter((b) => b.earned).map((b) => b.id).sort());
  });
});

describe('export and deletion', () => {
  it('exports XP events and badges, and deleting the account removes them', async () => {
    const user = await newStudent();
    await answer('q-mcq');
    const res = await exportRoute.GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.profile).toMatchObject({ dailyGoal: 50, timeZone: 'UTC', celebrations: true, sounds: false });
    expect(data.xpEvents).toEqual([expect.objectContaining({ kind: 'answer', amount: 10, sourceId: sq('q-mcq') })]);
    expect(data.badges).toEqual([expect.objectContaining({ badgeId: 'first-spark' })]);

    await expectRedirect(settings.deleteAccount({}, form({ password: PASSWORD, confirm: 'delete' })));
    const db = await getDb();
    expect(await xpRows(user.id)).toHaveLength(0);
    expect(await db.select().from(t.userBadges).where(eq(t.userBadges.userId, user.id))).toHaveLength(0);
    expect(await db.select().from(t.attempts).where(eq(t.attempts.userId, user.id))).toHaveLength(0);
  });
});
