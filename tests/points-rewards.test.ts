/**
 * Spec §4 end to end (docs/design/fun-and-points.md): topic finished, review
 * sessions, comebacks, topic secured, the new badges, daily goal Off, the
 * "show points" preference and days studied this week. Real server actions
 * against an in-memory PostgreSQL (PGlite) with the fixture content, which
 * this file extends with a few extra topics and lessons of its own.
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
  headers: async () => new Headers({ 'x-real-ip': '203.0.113.10' }),
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
const { getSubjectProgress, getTopicStates } = await import('@/server/queries/progress');
const { insertXp, loadBadgeStats } = await import('@/server/points');
const { resetRateLimits } = await import('@/server/rate-limit');
const { addDays, localDay, weekOf } = await import('@/domain/points');

type Submit = Parameters<typeof study.submitAnswer>[0];
type Points = NonNullable<Awaited<ReturnType<typeof study.submitAnswer>>['points']>;

const VERSION = '9709-fixture';
const TOPIC_QUADRATICS = `${VERSION}:1.1`;
const TOPIC_FUNCTIONS = `${VERSION}:1.2`;
const PASSWORD = 'correct horse battery';
const DAY = 86_400_000;

const form = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};

let students = 0;
async function newStudent() {
  resetRateLimits();
  jar.clear();
  const f = form({ email: `rewards${++students}@example.org`, password: PASSWORD, ageConfirmed: 'on' });
  await auth.signUp({}, f).catch((e: { url?: string }) => {
    if (!e.url) throw e;
  });
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
const wrong: Record<string, Omit<Submit, 'context'>> = {
  'q-mcq': { questionId: sq('q-mcq'), response: { format: 'mcq', choice: 1 } },
  'q-cloze': { questionId: sq('q-cloze'), response: { format: 'cloze', values: ['some'] } },
};

async function answer(id: string, context: 'lesson' | 'review' = 'lesson'): Promise<Points> {
  const res = await study.submitAnswer({ ...right[id]!, context });
  expect(res.recorded).toBe(true);
  return res.points!;
}
async function miss(id: string, context: 'lesson' | 'review' = 'lesson'): Promise<Points> {
  const res = await study.submitAnswer({ ...wrong[id]!, context });
  expect(res).toMatchObject({ recorded: true, result: { outcome: 'incorrect' } });
  return res.points!;
}
const kinds = (p: Points) => p.events.map((e) => `${e.kind}:${e.amount}`);
const badges = (p: Points) => p.newBadges.map((b) => b.id);
const finish = (lessonId: string) => study.recordLessonStep({ lessonId, stepReached: 1, stepCount: 2, completed: true });

async function xpRows(userId: string, kind?: string) {
  const db = await getDb();
  const rows = await db.select().from(t.xpEvents).where(eq(t.xpEvents.userId, userId));
  return kind ? rows.filter((r) => r.kind === kind) : rows;
}
async function makeDue(userId: string, questionId: string, dueAt: Date) {
  const db = await getDb();
  await db.update(t.reviewItems).set({ dueAt }).where(and(eq(t.reviewItems.userId, userId), eq(t.reviewItems.questionId, questionId)));
}
/** Moves all of a student's attempts `days` days into the past. */
async function backdateAttempts(userId: string, days: number) {
  const db = await getDb();
  await db
    .update(t.attempts)
    .set({ createdAt: sql`${t.attempts.createdAt} - make_interval(days => ${days})` })
    .where(eq(t.attempts.userId, userId));
}
async function topicState(userId: string, topicId: string) {
  return (await getTopicStates(await getDb(), userId, [topicId])).get(topicId);
}
async function recoveries(userId: string) {
  const db = await getDb();
  return db.select().from(t.topicRecoveries).where(eq(t.topicRecoveries.userId, userId));
}

/** Extra content beyond the fixture files (this file's database only). */
async function addLesson(id: string, topicId: string, extra: { kind?: 'core' | 'enrichment'; archived?: boolean } = {}) {
  const db = await getDb();
  await db.insert(t.lessons).values({
    id,
    versionId: VERSION,
    topicId,
    slug: id,
    title: id,
    summary: 'Extra test lesson.',
    position: 9,
    minutes: 1,
    kind: extra.kind ?? 'core',
    prerequisites: [],
    provenance: { origin: 'ai-drafted', status: 'ai-checked' } as never,
    blocks: [],
    searchText: id,
    contentHash: id,
    archivedAt: extra.archived ? new Date() : null,
  });
}
async function addTopic(code: string) {
  const db = await getDb();
  const id = `${VERSION}:${code}`;
  await db.insert(t.topics).values({ id, versionId: VERSION, sectionId: `${VERSION}:1`, code, title: `Topic ${code}`, position: 10 + Number(code.split('.')[1]) });
  return id;
}

beforeAll(async () => {
  await getDb();
  // Topic 1.2 gets a second core lesson, an enrichment lesson and an archived core lesson.
  await addLesson('extra-functions-core', TOPIC_FUNCTIONS);
  await addLesson('extra-functions-enrichment', TOPIC_FUNCTIONS, { kind: 'enrichment' });
  await addLesson('extra-functions-archived', TOPIC_FUNCTIONS, { archived: true });
  // Three more topics with one core lesson each, for Curious Mind.
  for (const code of ['1.7', '1.8', '1.9']) await addLesson(`extra-lesson-${code}`, await addTopic(code));
});

describe('topic finished', () => {
  it('pays 50 once, when every core lesson in the topic is finished (enrichment and archived lessons don’t count)', async () => {
    const user = await newStudent();
    expect(kinds((await finish('fixture-functions')).points!)).toEqual(['lesson:20']); // no questions answered: not perfect
    expect(kinds((await finish('extra-functions-enrichment')).points!)).toEqual(['lesson:20']);

    const done = (await finish('extra-functions-core')).points!;
    expect(done.events).toEqual([
      { kind: 'lesson', amount: 20, label: 'Lesson finished' },
      { kind: 'topic', amount: 50, label: 'Topic finished' },
      { kind: 'daily-goal', amount: 10, label: 'Daily goal reached' },
    ]);
    expect(badges(done)).toEqual(['topic-finisher']);

    // Finishing any lesson in the topic again pays nothing more.
    expect((await finish('extra-functions-core')).points!.gained).toBe(0);
    expect((await finish('extra-functions-enrichment')).points!.gained).toBe(0);
    const rows = await xpRows(user.id, 'topic');
    expect(rows.map((r) => [r.sourceId, r.amount])).toEqual([[TOPIC_FUNCTIONS, 50]]);
  });

  it('pays for a topic completed before the rule existed on the next completion there, once', async () => {
    const user = await newStudent();
    const db = await getDb();
    // Both core lessons finished, but no topic award stored (as for an account from before §4).
    await db.insert(t.lessonProgress).values(
      ['fixture-functions', 'extra-functions-core'].map((lessonId) => ({ userId: user.id, lessonId, stepReached: 1, stepCount: 2, completedAt: new Date() })),
    );
    expect(kinds((await finish('extra-functions-enrichment')).points!)).toEqual(['lesson:20', 'topic:50', 'daily-goal:10']);
    expect(await xpRows(user.id, 'topic')).toHaveLength(1);
    const award = { kind: 'topic' as const, amount: 50, label: 'Topic finished' };
    expect(await insertXp(db, user.id, award, TOPIC_FUNCTIONS, '2026-10-20', new Date())).toBe(false);
  });
});

describe('review sessions', () => {
  it('pay 15 once a day for five different questions answered in review', async () => {
    jar.clear();
    expect(await study.finishReviewSession()).toEqual({ points: null }); // guests

    const user = await newStudent();
    for (const id of ['q-mcq', 'q-expr', 'q-text', 'q-cloze']) await answer(id, 'review');
    // Re-answering one question doesn't make a session.
    for (let i = 0; i < 3; i++) await answer('q-mcq', 'review');
    const short = await study.finishReviewSession();
    expect(short.points).toMatchObject({ gained: 0, events: [], newBadges: [] });

    await answer('q-spot', 'review');
    const done = (await study.finishReviewSession()).points!;
    expect(done.events).toEqual([{ kind: 'review-session', amount: 15, label: 'Review session' }]);
    expect(badges(done)).toContain('recall-rookie');
    expect(done.today.day).toBe(localDay(new Date(), 'UTC'));

    expect((await study.finishReviewSession()).points).toMatchObject({ gained: 0, events: [] });
    const rows = await xpRows(user.id, 'review-session');
    expect(rows.map((r) => [r.sourceId, r.localDay])).toEqual([[done.today.day, done.today.day]]);
  });

  it('count only review answers from today, in the student’s time zone', async () => {
    const user = await newStudent();
    for (const id of ['q-mcq', 'q-expr', 'q-text', 'q-cloze', 'q-spot']) await answer(id, 'lesson');
    expect((await study.finishReviewSession()).points!.gained).toBe(0); // lesson answers aren't a review session

    await newStudent();
    const reviewer = (await getSessionUser())!;
    for (const id of ['q-mcq', 'q-expr', 'q-text', 'q-cloze', 'q-spot']) await answer(id, 'review');
    await backdateAttempts(reviewer.id, 1);
    expect((await study.finishReviewSession()).points!.gained).toBe(0); // that was yesterday
    expect(await xpRows(user.id, 'review-session')).toHaveLength(0);
    expect(await xpRows(reviewer.id, 'review-session')).toHaveLength(0);
  });

  it('pay once when the session end arrives twice at the same time', async () => {
    const user = await newStudent();
    for (const id of ['q-mcq', 'q-expr', 'q-text', 'q-cloze', 'q-spot']) await answer(id, 'review');
    const [a, b] = await Promise.all([study.finishReviewSession(), study.finishReviewSession()]);
    expect(a.points!.gained + b.points!.gained).toBe(15);
    expect(await xpRows(user.id, 'review-session')).toHaveLength(1);
  });
});

describe('comebacks', () => {
  it('pay +5 once for a question that was wrong before and is right in a due review', async () => {
    const user = await newStudent();
    expect((await miss('q-mcq')).gained).toBe(0);
    await makeDue(user.id, sq('q-mcq'), new Date(Date.now() - 60_000));
    const back = await answer('q-mcq', 'review');
    expect(back.events.slice(0, 2)).toEqual([
      { kind: 'review', amount: 10, label: 'Review' },
      { kind: 'comeback', amount: 5, label: 'Comeback' },
    ]);
    expect(badges(back)).toContain('getting-warmer');

    // Once per question: the next due review pays the review only.
    await makeDue(user.id, sq('q-mcq'), new Date(Date.now() - 30_000));
    expect(kinds(await answer('q-mcq', 'review'))).toEqual(['review:10']);
    expect((await xpRows(user.id, 'comeback')).map((r) => r.sourceId)).toEqual([sq('q-mcq')]);
  });

  it('need an earlier wrong answer and a due review', async () => {
    const user = await newStudent();
    // Right first time, then right in a due review: a plain review.
    await answer('q-expr');
    await makeDue(user.id, sq('q-expr'), new Date(Date.now() - 60_000));
    expect(kinds(await answer('q-expr', 'review'))).not.toContain('comeback:5');
    // Wrong, then fixed straight away (not due, even when sent as a review): "you fixed it" only.
    await miss('q-cloze');
    expect(kinds(await answer('q-cloze', 'review'))).toEqual(['answer:5']);
    expect(await xpRows(user.id, 'comeback')).toHaveLength(0);
  });
});

/**
 * Gets topic 1.1 (objectives 1.1.1 and 1.1.2) to Secure: several different
 * questions right on two different days. Returns the answer that did it.
 */
async function secureQuadratics(userId: string): Promise<Points> {
  for (const id of ['q-mcq', 'q-expr', 'q-spot', 'q-text', 'q-cloze']) await answer(id);
  await backdateAttempts(userId, 2);
  const first = await answer('q-mcq'); // 1.1.1 is now Secure, 1.1.2 has one day of evidence
  expect(kinds(first)).not.toContain('topic-secure:30');
  expect(await topicState(userId, TOPIC_QUADRATICS)).toBe('practising');
  return answer('q-text');
}

describe('topic secured', () => {
  it('pays 30 once when every objective in the topic is Secure, with Concept Master', async () => {
    const user = await newStudent();
    const secured = await secureQuadratics(user.id);
    expect(secured.events).toEqual([{ kind: 'topic-secure', amount: 30, label: 'Topic secured' }]); // the repeat itself earns nothing
    expect(badges(secured)).toContain('concept-master');
    expect(await topicState(user.id, TOPIC_QUADRATICS)).toBe('secure');
    // The same rules as the progress page.
    const progress = await getSubjectProgress(user.id, VERSION);
    expect(progress.topics.get(TOPIC_QUADRATICS)!.state).toBe('secure');

    expect(kinds(await answer('q-cloze'))).toEqual([]);
    expect((await xpRows(user.id, 'topic-secure')).map((r) => r.sourceId)).toEqual([TOPIC_QUADRATICS]);
    expect(await recoveries(user.id)).toEqual([]); // it never needed revision
  });

  it('records a topic that slipped into Needs revision and gives Comeback Arc when it is Secure again', async () => {
    const user = await newStudent();
    await secureQuadratics(user.id);

    // A review more than a week overdue puts the topic in Needs revision.
    await makeDue(user.id, sq('q-cloze'), new Date(Date.now() - 8 * DAY));
    expect(await topicState(user.id, TOPIC_QUADRATICS)).toBe('needs-revision');

    // Answering it wrong clears the overdue review but not the evidence: no longer
    // Needs revision, not yet Secure. The slip is remembered.
    const slipped = await miss('q-cloze', 'review');
    expect(slipped.newBadges).toEqual([]);
    expect(await topicState(user.id, TOPIC_QUADRATICS)).toBe('practising');
    expect(await recoveries(user.id)).toEqual([expect.objectContaining({ topicId: TOPIC_QUADRATICS, securedAt: null })]);

    await answer('q-cloze');
    expect(await topicState(user.id, TOPIC_QUADRATICS)).toBe('practising');
    // Secure again. The topic-secure XP was already paid, so this answer earns
    // nothing, but the comeback still unlocks its badge.
    const back = await answer('q-text');
    expect(back).toMatchObject({ gained: 0, events: [] });
    expect(badges(back)).toEqual(['comeback-arc']);
    expect(await topicState(user.id, TOPIC_QUADRATICS)).toBe('secure');
    const [row] = await recoveries(user.id);
    expect(row!.securedAt).toBeInstanceOf(Date);
    expect(row!.securedAt!.getTime()).toBeGreaterThanOrEqual(row!.slippedAt.getTime());
    expect(await xpRows(user.id, 'topic-secure')).toHaveLength(1);

    const { stats } = await loadBadgeStats(await getDb(), user.id, { totalXp: 0 });
    expect(stats).toMatchObject({ topicsSecured: 1, topicsRecovered: 1 });
  });

  it('counts a slip and a recovery in the same answer', async () => {
    const user = await newStudent();
    await secureQuadratics(user.id);
    await makeDue(user.id, sq('q-cloze'), new Date(Date.now() - 8 * DAY));
    const back = await answer('q-cloze', 'review'); // the overdue review, right
    expect(kinds(back)).toContain('review:10');
    expect(badges(back)).toContain('comeback-arc');
    expect(await recoveries(user.id)).toEqual([expect.objectContaining({ topicId: TOPIC_QUADRATICS, securedAt: expect.any(Date) })]);
  });
});

describe('more badges', () => {
  it('Curious Mind: lessons finished in five different topics', async () => {
    const user = await newStudent();
    for (const id of ['fixture-squares', 'fixture-functions', 'extra-lesson-1.7', 'extra-lesson-1.8']) {
      expect(badges((await finish(id)).points!)).not.toContain('curious-mind');
    }
    const progress = (await getPointsHistory(user.id)).badges.find((b) => b.id === 'curious-mind');
    expect(progress).toMatchObject({ earned: false, progress: { current: 4, target: 5 } });
    expect(badges((await finish('extra-lesson-1.9')).points!)).toContain('curious-mind');
    const { stats } = await loadBadgeStats(await getDb(), user.id, { totalXp: 0 });
    // 1.1, 1.7, 1.8 and 1.9 are finished; 1.2 still has a core lesson to go.
    expect(stats).toMatchObject({ topicsWithFinishedLessons: 5, topicsFinished: 4, lessonsFinished: 5 });
  });

  it('Consistency Club: XP on five different days, not necessarily in a row', async () => {
    const user = await newStudent();
    const db = await getDb();
    const today = localDay(new Date(), 'UTC');
    await db.insert(t.xpEvents).values(
      [-20, -9, -5, -2].map((n, i) => ({ userId: user.id, kind: 'answer' as const, amount: 10, sourceId: `old/${i}`, localDay: addDays(today, n) })),
    );
    const before = (await getPointsHistory(user.id)).badges.find((b) => b.id === 'consistency-club');
    expect(before).toMatchObject({ earned: false, progress: { current: 4, target: 5 } });
    const p = await answer('q-mcq');
    expect(p.streak.current).toBe(1);
    expect(badges(p)).toEqual(['consistency-club']);
  });

  it('lists all 18 badges in the history, earned or locked', async () => {
    const user = await newStudent();
    const h = await getPointsHistory(user.id);
    expect(h.badges).toHaveLength(18);
    expect(h.badges.every((b) => !b.earned && b.earnedAt === null && b.progress.current === 0)).toBe(true);
    expect(h.badges.find((b) => b.id === 'comeback-arc')).toMatchObject({ name: 'Comeback Arc', progress: { current: 0, target: 1 } });
  });
});

describe('preferences', () => {
  it('daily goal Off: no goal ring, no goal bonus', async () => {
    const user = await newStudent();
    expect(await settings.updatePreferences({ dailyGoal: 0 })).toEqual({ ok: true });
    expect((await getSessionUser())!.dailyGoal).toBe(0);
    let last: Points | null = null;
    for (const id of ['q-mcq', 'q-expr', 'q-text', 'q-cloze', 'q-spot', 'q-numeric']) last = await answer(id);
    expect(last!.today).toMatchObject({ goal: 0, goalMet: false, justMetGoal: false });
    expect(last!.today.xp).toBeGreaterThan(50);
    expect(await xpRows(user.id, 'daily-goal')).toHaveLength(0);
    const s = await getPointsSummary(user.id);
    expect(s.today).toMatchObject({ goal: 0, goalMet: false });
    expect(s.settings.dailyGoal).toBe(0);
    expect(s.week[6]).toMatchObject({ isToday: true, goalMet: false });
    expect(await settings.updatePreferences({ dailyGoal: 10 })).toEqual({ ok: false });
  });

  it('show points: on by default, saved, and XP is still recorded while off', async () => {
    const user = await newStudent();
    expect(user.showPoints).toBe(true);
    expect(await settings.updatePreferences({ showPoints: false })).toEqual({ ok: true });
    expect((await getSessionUser())!.showPoints).toBe(false);
    expect((await answer('q-mcq')).gained).toBe(10);
    expect(await xpRows(user.id)).toHaveLength(1);
    const s = await getPointsSummary(user.id);
    expect(s).toMatchObject({ totalXp: 10, settings: { showPoints: false } });
    expect(await settings.updatePreferences({ showPoints: 'no' as unknown as boolean })).toEqual({ ok: false });
    expect(await settings.updatePreferences({ showPoints: true })).toEqual({ ok: true });
    expect((await getSessionUser())!.showPoints).toBe(true);
  });
});

describe('days studied this week', () => {
  it('lists the local days with XP in the current Monday–Sunday week', async () => {
    const user = await newStudent();
    const db = await getDb();
    const today = localDay(new Date(), 'UTC');
    const monday = weekOf(today)[0]!;
    await db.insert(t.xpEvents).values(
      [addDays(monday, -1), addDays(monday, -3), monday].map((d, i) => ({ userId: user.id, kind: 'answer' as const, amount: 5, sourceId: `wk/${i}`, localDay: d })),
    );
    await answer('q-mcq');
    const s = await getPointsSummary(user.id);
    expect(s.daysThisWeek).toEqual([...new Set([monday, today])].sort());
    expect(s.daysThisWeek.every((d) => weekOf(today).includes(d))).toBe(true);
  });
});
