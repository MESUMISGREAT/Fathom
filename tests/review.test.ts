/**
 * Review findings for the points engine (docs/design/fun-and-points.md §1, §4).
 * Each test is a focused reproduction of a logic bug: it fails on the code as
 * reviewed and should pass once the bug is fixed. Real server actions against
 * an in-memory PostgreSQL (PGlite) with the fixture content; only `Date` is
 * faked, to move the clock the way the scenario needs.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { and, eq } from 'drizzle-orm';

process.env.DATABASE_URL = 'memory';
process.env.CONTENT_DIR = 'tests/fixtures/content';

const jar = new Map<string, string>();
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name)! } : undefined),
    set: (name: string, value: string) => void jar.set(name, value),
    delete: (name: string) => void jar.delete(name),
  }),
  headers: async () => new Headers({ 'x-real-ip': '203.0.113.77' }),
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
const { getTopicStates } = await import('@/server/queries/progress');
const { resetRateLimits } = await import('@/server/rate-limit');

type Submit = Parameters<typeof study.submitAnswer>[0];
type Points = NonNullable<Awaited<ReturnType<typeof study.submitAnswer>>['points']>;

const VERSION = '9709-fixture';
const TOPIC_QUADRATICS = `${VERSION}:1.1`;
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
  const f = form({ email: `review${++students}@example.org`, password: 'correct horse battery', ageConfirmed: 'on' });
  await auth.signUp({}, f).catch((e: { url?: string }) => {
    if (!e.url) throw e;
  });
  expect(await study.enroll({ subjectCode: '9709', targetLevel: 'A' })).toEqual({ ok: true });
  return (await getSessionUser())!;
}

const sq = (id: string) => `fixture-squares/${id}`;
const right: Record<string, Omit<Submit, 'context'>> = {
  'q-mcq': { questionId: sq('q-mcq'), response: { format: 'mcq', choice: 0 } },
  'q-expr': { questionId: sq('q-expr'), response: { format: 'expression', value: 'x^2 + 4x' } },
  'q-text': { questionId: sq('q-text'), response: { format: 'text', value: 'discriminant' } },
  'q-cloze': { questionId: sq('q-cloze'), response: { format: 'cloze', values: ['no'] } },
  'q-spot': { questionId: sq('q-spot'), response: { format: 'spot-error', line: 2 } },
};
const wrong: Record<string, Omit<Submit, 'context'>> = {
  'q-mcq': { questionId: sq('q-mcq'), response: { format: 'mcq', choice: 1 } },
};

async function answer(id: string, context: 'lesson' | 'review' = 'lesson'): Promise<Points> {
  const res = await study.submitAnswer({ ...right[id]!, context });
  expect(res).toMatchObject({ recorded: true, result: { outcome: 'correct' } });
  return res.points!;
}
async function miss(id: string, context: 'lesson' | 'review' = 'lesson'): Promise<Points> {
  const res = await study.submitAnswer({ ...wrong[id]!, context });
  expect(res).toMatchObject({ recorded: true, result: { outcome: 'incorrect' } });
  return res.points!;
}
const kinds = (p: Points) => p.events.map((e) => `${e.kind}:${e.amount}`);

/** Pins `new Date()` / `Date.now()` (and nothing else) to `ms`. */
function clockAt(ms: number) {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(ms);
}
afterEach(() => {
  vi.useRealTimers();
});

beforeAll(async () => {
  await getDb();
});

describe('combo state follows app-server timestamps, not the order answers were processed', () => {
  it('pays the 3-in-a-row milestone twice for four answers when one answer is stamped earlier than the one before it', async () => {
    // submitAnswer takes `now` before the per-user lock, and currentCombo() reads the latest
    // attempt by created_at. Two tabs (or two app instances with slightly different clocks)
    // can therefore store an answer with an earlier created_at than one processed before it.
    // Here that happens to the third answer: it is processed after the second but stamped
    // 10 s before it, so the fourth answer re-reads the second answer's combo (2) and
    // reaches "3 in a row" again.
    await newStudent();
    const base = Date.now();
    clockAt(base);
    expect((await answer('q-mcq')).combo).toBe(1);
    clockAt(base + 20_000);
    expect((await answer('q-expr')).combo).toBe(2);
    clockAt(base + 10_000); // processed third, stamped second
    const third = await answer('q-text');
    expect(third.combo).toBe(3);
    expect(kinds(third)).toContain('combo:5');
    clockAt(base + 30_000);
    const fourth = await answer('q-cloze');

    // Four scoring answers in a row: the combo is 4 and "3 in a row" paid once.
    expect(fourth.combo).toBe(4);
    expect(kinds(fourth)).not.toContain('combo:5');
  });
});

describe('due-review XP can be farmed by answering a known question wrong on purpose', () => {
  it('pays review XP (and a comeback) the day after a deliberate early wrong answer', async () => {
    // Right first time, right again in its on-time review: the next review is 7 days away.
    // A deliberate wrong answer straight after is not scoring-eligible (it costs nothing and
    // doesn't even break the combo), but nextReview() moves the item to box 1, due tomorrow.
    // Tomorrow it pays the due review again, plus a "comeback" for the self-inflicted miss.
    // Repeated daily, every question the student knows pays 10+ XP a day (and feeds
    // Memory Keeper), which is exactly the farming §1 says can't happen.
    const user = await newStudent();
    const t0 = Date.now();
    clockAt(t0);
    expect(kinds(await answer('q-mcq'))).toEqual(['answer:10']);

    clockAt(t0 + 3 * DAY + 60_000); // due (box 2 = 3 days)
    expect(kinds(await answer('q-mcq', 'review'))).toContain('review:10');

    clockAt(t0 + 3 * DAY + 120_000); // straight away, on purpose
    const deliberate = await miss('q-mcq');
    expect(deliberate.gained).toBe(0);
    const db = await getDb();
    const [item] = await db
      .select()
      .from(t.reviewItems)
      .where(and(eq(t.reviewItems.userId, user.id), eq(t.reviewItems.questionId, sq('q-mcq'))));
    expect(item!.box).toBe(1); // the honest schedule had it in box 3, due in 7 days

    clockAt(t0 + 4 * DAY + 180_000); // the next day
    const farmed = await answer('q-mcq', 'review');
    expect(kinds(farmed)).not.toContain('review:10');
    expect(kinds(farmed)).not.toContain('comeback:5');
  });
});

describe('Topic secured pays while objectives in the topic are not Secure', () => {
  it('ignores objectives with no lessons or questions yet (§4: "every objective in the topic reaches Secure")', async () => {
    const db = await getDb();
    // Topic 1.1 gains a third objective that has no content yet (most real topics are only
    // partly covered: the progress page says "Lessons cover N of the M objectives").
    await db
      .insert(t.objectives)
      .values({ id: `${VERSION}:1.1.9`, versionId: VERSION, topicId: TOPIC_QUADRATICS, code: '1.1.9', text: 'An objective with no lesson yet', position: 9 })
      .onConflictDoNothing();

    const user = await newStudent();
    const t0 = Date.now();
    clockAt(t0 - 2 * DAY);
    for (const id of ['q-mcq', 'q-expr', 'q-spot', 'q-text', 'q-cloze']) await answer(id);
    clockAt(t0);
    await answer('q-mcq');
    const last = await answer('q-text');

    // 1.1.1 and 1.1.2 are Secure, 1.1.9 is Not started: the topic is not fully Secure,
    // so no "Topic secured" XP and no Concept Master.
    expect(kinds(last)).not.toContain('topic-secure:30');
    expect(last.newBadges.map((b) => b.id)).not.toContain('concept-master');
    expect((await getTopicStates(db, user.id, [TOPIC_QUADRATICS])).get(TOPIC_QUADRATICS)).not.toBe('secure');
  });
});

describe('lesson and topic XP need no learning at all', () => {
  it('pays Lesson finished + Topic finished for one forged call on a lesson never opened, with no check answered', async () => {
    // The server trusts `completed: true` and the step numbers the browser sends; nothing
    // checks that the lesson was opened or that any of its checks was answered. The UI
    // allows the same with "Skip for now" on every step and "Finish without answering".
    // With §4 the topic bonus makes this 70 XP (+10 daily goal) per one-lesson topic, so
    // clicking through the 50 real lessons pays roughly 2,000 XP and First Steps, Ten Down,
    // Half Century, Topic Finisher, Curious Mind and Explorer without a single answer.
    const user = await newStudent();
    const res = await study.recordLessonStep({ lessonId: 'fixture-functions', stepReached: 0, stepCount: 1, completed: true });
    const db = await getDb();
    const attempts = await db.select().from(t.attempts).where(eq(t.attempts.userId, user.id));
    expect(attempts).toHaveLength(0);
    expect(res.points!.events.map((e) => e.kind)).not.toContain('topic');
  });
});

describe('the daily goal is paid more than once a day by changing time zone', () => {
  it('pays the goal bonus twice within seconds after setTimeZone moves the local day forward', async () => {
    // At 11:00 UTC, UTC is day D and Pacific/Kiritimati (UTC+14) is already D+1. setTimeZone
    // accepts any IANA zone at any time, and the daily goal (and the review session, and
    // Consistency Club's study days) are keyed by the local day, so one real day can be
    // claimed as two or three.
    const now = new Date();
    const elevenUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 11, 0, 0);
    clockAt(elevenUtc);
    const user = await newStudent();
    expect(await settings.updatePreferences({ dailyGoal: 20 })).toEqual({ ok: true });
    await answer('q-mcq');
    expect(kinds(await answer('q-expr'))).toContain('daily-goal:10');

    clockAt(elevenUtc + 5_000);
    expect(await settings.setTimeZone('Pacific/Kiritimati')).toMatchObject({ ok: true });
    await answer('q-text');
    await answer('q-cloze');

    const db = await getDb();
    const goals = await db
      .select()
      .from(t.xpEvents)
      .where(and(eq(t.xpEvents.userId, user.id), eq(t.xpEvents.kind, 'daily-goal')));
    expect(goals).toHaveLength(1);
  });
});

// --- Second review pass ---------------------------------------------------------

/** The prior "objective with no content" reproduction adds 1.1.9 to topic 1.1; later tests here must not depend on it. */
async function dropExtraObjective() {
  const db = await getDb();
  await db.delete(t.objectives).where(eq(t.objectives.id, `${VERSION}:1.1.9`));
}
async function xpOf(userId: string, kind: string) {
  const db = await getDb();
  return db.select().from(t.xpEvents).where(and(eq(t.xpEvents.userId, userId), eq(t.xpEvents.kind, kind as never)));
}

describe('Comeback Arc is unlocked by getting an overdue question wrong', () => {
  it('awards "a topic that needed revision is fully Secure again" on an incorrect answer', async () => {
    // Mastery treats an objective with a review more than 7 days overdue as Needs revision.
    // Any answer reschedules that review, a wrong one included, so the overdue flag clears and
    // the topic flips from Needs revision straight to Secure on a *wrong* answer. settleTopics
    // compares before/after and records that as a recovery: Comeback Arc (and, for a topic
    // that was never paid, +30 "Topic secured") for getting it wrong.
    await dropExtraObjective();
    const user = await newStudent();
    const db = await getDb();
    const t0 = Date.now();
    const five = ['q-mcq', 'q-expr', 'q-spot', 'q-text', 'q-cloze'];
    clockAt(t0 - 20 * DAY);
    for (const id of five) await answer(id); // box 2, due in 3 days
    clockAt(t0 - 17 * DAY + 60_000);
    for (const id of five) await answer(id, 'review'); // on time: box 3, due in 7 days; the topic is Secure (paid here, legitimately)
    clockAt(t0 - 10 * DAY + 60_000);
    for (const id of ['q-mcq', 'q-expr', 'q-text', 'q-cloze']) await answer(id, 'review'); // on time again; q-spot is left due
    expect(await xpOf(user.id, 'topic-secure')).toHaveLength(1);

    clockAt(t0);
    // q-spot is now 10 days overdue, so the topic is in Needs revision.
    expect((await getTopicStates(db, user.id, [TOPIC_QUADRATICS])).get(TOPIC_QUADRATICS)).toBe('needs-revision');
    const res = await study.submitAnswer({ questionId: sq('q-spot'), response: { format: 'spot-error', line: 1 }, context: 'review' });
    expect(res).toMatchObject({ recorded: true, result: { outcome: 'incorrect' } });
    expect((await getTopicStates(db, user.id, [TOPIC_QUADRATICS])).get(TOPIC_QUADRATICS)).toBe('secure'); // after a wrong answer

    expect(res.points!.newBadges.map((b) => b.id)).not.toContain('comeback-arc');
  });
});

describe('the review-session bonus is paid twice in one real day by changing time zone', () => {
  it('pays 15 again for the same five due reviews after setTimeZone moves the local day forward', async () => {
    // awardReviewSession keys the session by localDay(now, current zone) and re-buckets the
    // stored review attempts by the *current* zone. At 11:00 UTC, Pacific/Kiritimati is
    // already tomorrow, so the five reviews just answered count again as "tomorrow's".
    await dropExtraObjective();
    const now = new Date();
    const elevenUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 11, 0, 0);
    clockAt(elevenUtc - 3 * DAY - 60_000);
    const user = await newStudent();
    const five = ['q-mcq', 'q-expr', 'q-spot', 'q-text', 'q-cloze'];
    for (const id of five) await answer(id);
    clockAt(elevenUtc);
    for (const id of five) expect(kinds(await answer(id, 'review'))).toContain('review:10'); // genuinely due
    expect(kinds((await study.finishReviewSession()).points!)).toContain('review-session:15');

    clockAt(elevenUtc + 5_000);
    expect(await settings.setTimeZone('Pacific/Kiritimati')).toMatchObject({ ok: true });
    await study.finishReviewSession(); // no new answers at all

    expect(await xpOf(user.id, 'review-session')).toHaveLength(1);
  });
});

describe('a topic finished before §4 shipped can never pay Topic finished', () => {
  it('stays unpaid through the student’s next XP-earning action when no lesson in the topic is left to finish', async () => {
    // awardLessonCompletion is the only place that checks topic completion, and it only runs
    // when recordLessonStep saves `completed: true`. The UI never sends that for a lesson that
    // is already finished (LessonPlayer skips its "opened" save when initiallyCompleted and only
    // shows "Finish lesson" while !completed), and migration 0003 backfills nothing. So a
    // Phase 1 student whose topic is fully finished (here 1.2, one core lesson) never gets the
    // 50 XP or Topic Finisher, although the builders' note says it pays "on the next lesson
    // finished there": there is none.
    const user = await newStudent();
    const db = await getDb();
    await db.insert(t.lessonProgress).values({ userId: user.id, lessonId: 'fixture-functions', stepReached: 0, stepCount: 1, completedAt: new Date(Date.now() - 7 * DAY) });

    const res = await study.submitAnswer({ questionId: 'fixture-functions/q-one', response: { format: 'mcq', choice: 0 }, context: 'lesson' });
    expect(kinds(res.points!)).toContain('answer:10'); // an XP-earning action, so badges were evaluated

    expect(await xpOf(user.id, 'topic')).toHaveLength(1);
  });
});
