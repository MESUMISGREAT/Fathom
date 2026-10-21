/**
 * Awarding points on the server. The rules are pure functions in
 * src/domain/points.ts; this module reads the history they need, stores the
 * awards and builds the `points` object the actions return.
 *
 * Everything runs inside the caller's transaction (the one that records the
 * answer or the lesson completion), so an award is never stored without the
 * thing that earned it. Two guards stop double awards:
 * - a per-user advisory lock serialises award decisions, so a second request
 *   sees the first one's attempt, combo and daily-goal bonus;
 * - every award is an INSERT … ON CONFLICT DO NOTHING on the unique index
 *   (user_id, kind, source_id), and only rows actually inserted count, so even
 *   without the lock the database cannot award the same thing twice.
 */
import 'server-only';
import { randomUUID } from 'node:crypto';
import { and, asc, eq, isNull, sql, type SQL } from 'drizzle-orm';
import type { Db } from '@/server/db';
import * as t from '@/server/db/schema';
import { getTopicStates } from '@/server/queries/progress';
import type { MasteryState } from '@/domain/mastery';
import {
  activeLocalDay,
  answerXp,
  BADGES,
  comboAward,
  CORRECT_SCORE,
  comebackAward,
  computeStreak,
  dailyGoalAward,
  DEFAULT_DAILY_GOAL,
  dueDatePaysXp,
  evaluateBadges,
  isGoalMet,
  lessonXp,
  levelFor,
  liveCombo,
  localDay,
  nextCombo,
  reviewSessionAward,
  reviewSourceId,
  topicFinishedAward,
  topicSecureAward,
  XP,
  type BadgeStats,
  type LocalDay,
  type PointsResult,
  type RecordedOutcome,
  type XpAward,
} from '@/domain/points';

export type { PointsResult } from '@/domain/points';

/** Advisory-lock namespace for per-user point awards (the second key is a hash of the user id). */
const LOCK_NAMESPACE = 7272;

/**
 * Serialises point awards for one user until the transaction ends, and
 * returns the time to record the action at, read after the lock (a request
 * may have waited for it).
 */
export async function lockUserPoints(tx: Db, userId: string): Promise<Date> {
  await tx.execute(sql`select pg_advisory_xact_lock(${sql.raw(String(LOCK_NAMESPACE))}, hashtext(${userId}))`);
  return new Date();
}

/**
 * The local day this action counts towards (activeLocalDay: a day keeps the
 * zone it started in until it is over there), stored as the student's
 * current day, plus their daily goal. Call after lockUserPoints.
 */
export async function startPointsDay(tx: Db, userId: string, now: Date): Promise<{ day: LocalDay; zone: string; dailyGoal: number }> {
  const [u] = await tx
    .select({ timeZone: t.users.timeZone, dailyGoal: t.users.dailyGoal, activeDay: t.users.activeDay, activeDayZone: t.users.activeDayZone })
    .from(t.users)
    .where(eq(t.users.id, userId));
  const { day, zone } = activeLocalDay({ now, timeZone: u?.timeZone ?? 'UTC', day: u?.activeDay ?? null, dayZone: u?.activeDayZone ?? null });
  if (u && (u.activeDay !== day || u.activeDayZone !== zone)) {
    await tx.update(t.users).set({ activeDay: day, activeDayZone: zone }).where(eq(t.users.id, userId));
  }
  return { day, zone, dailyGoal: u?.dailyGoal ?? DEFAULT_DAILY_GOAL };
}

/** Stores one award; returns whether it was new (false when the unique index already had it). */
export async function insertXp(tx: Db, userId: string, award: XpAward, sourceId: string, day: LocalDay, now: Date): Promise<boolean> {
  const rows = await tx
    .insert(t.xpEvents)
    .values({ userId, kind: award.kind, amount: award.amount, sourceId, localDay: day, createdAt: now })
    .onConflictDoNothing({ target: [t.xpEvents.userId, t.xpEvents.kind, t.xpEvents.sourceId] })
    .returning({ id: t.xpEvents.id });
  return rows.length > 0;
}

/**
 * The combo running now (0 if it last moved over 15 minutes ago). Read from
 * the user's row, which only changes under the points lock, so it follows
 * the order answers were processed in whatever their timestamps say.
 */
export async function currentCombo(tx: Db, userId: string, now: Date): Promise<number> {
  const [u] = await tx.select({ combo: t.users.combo, at: t.users.comboAt }).from(t.users).where(eq(t.users.id, userId));
  return liveCombo(u?.at ? { combo: u.combo, at: u.at } : null, now);
}

// --- Answers -------------------------------------------------------------------

export interface AnswerPointsInput {
  userId: string;
  questionId: string;
  /** The lesson the question belongs to (answering its last unanswered check can pay the lesson's XP). */
  lessonId: string;
  difficulty: number;
  outcome: RecordedOutcome;
  score: number;
  selfAssessed: boolean;
  /** The question's review item before this answer, or null if it had never been answered. */
  review: { dueAt: Date; paysXp: boolean } | null;
  /** From lockUserPoints. */
  now: Date;
}

export interface AnswerPoints {
  /** Use as the attempt's id, so a combo award can name the answer that reached it. */
  attemptId: string;
  /** Store in `attempts.combo`. */
  attemptCombo: number | null;
  /** Store in `attempts.local_day`. */
  localDay: LocalDay;
  /** Store in `attempts.due_review`: answered while due, at a due date that pays XP. */
  dueReview: boolean;
  /** Store in `review_items.pays_xp`: whether the due date this answer leaves (`nextDueAt`, from the scheduler) pays review XP. */
  nextDuePaysXp: (nextDueAt: Date) => boolean;
  /** Call after the attempt is inserted, still inside the transaction. */
  finish: () => Promise<PointsResult>;
}

/**
 * Decides and stores the XP for one answer: the base award (first try, due
 * review or fix), a comeback bonus, then in `finish()` the combo milestone,
 * the lesson (if this was its last unanswered check), topic-secure, topic
 * finished and the daily goal. Call inside the transaction that records the
 * attempt, after lockUserPoints and before inserting the attempt or updating
 * its review item (the topic mastery "before" is read here); insert the
 * attempt with the returned id, combo, day and due flag, update the review
 * item, then call `finish()`.
 */
export async function awardAnswer(tx: Db, input: AnswerPointsInput): Promise<AnswerPoints> {
  const { userId, questionId, now } = input;
  const { day, zone, dailyGoal } = await startPointsDay(tx, userId, now);
  const [history] = await tx
    .select({
      priorAttempts: sql<number>`(select count(*) from attempts a where a.user_id = ${userId} and a.question_id = ${questionId})`.mapWith(Number),
      answeredEarlierToday: sql<boolean>`exists(select 1 from attempts a where a.user_id = ${userId} and a.question_id = ${questionId} and a.local_day = ${day})`,
      // Attempts stored before 0004 have no local day: judge "earlier today" by their time instead (see below).
      lastUndatedAt: sql<Date | null>`(select max(a.created_at) from attempts a where a.user_id = ${userId} and a.question_id = ${questionId} and a.local_day is null)`.mapWith(
        t.attempts.createdAt,
      ),
      missedBefore: sql<boolean>`exists(select 1 from attempts a where a.user_id = ${userId} and a.question_id = ${questionId} and a.score < ${CORRECT_SCORE})`,
      // "You fixed it" paid: an `answer` award stored after the question's first attempt (a first-try award has its time).
      fixPaid: sql<boolean>`exists(select 1 from xp_events e where e.user_id = ${userId} and e.kind = 'answer' and e.source_id = ${questionId}
        and e.created_at > (select min(a.created_at) from attempts a where a.user_id = ${userId} and a.question_id = ${questionId}))`,
      alreadyAwarded: sql<boolean>`exists(select 1 from xp_events e where e.user_id = ${userId} and (
        (e.kind = 'answer' and e.source_id = ${questionId})
        or (e.kind = 'review' and starts_with(e.source_id, ${questionId + '@'}))))`,
      // A miss that counted: one that could earn XP (stored with a combo) or the very first attempt.
      // A deliberate wrong answer to a question that already paid out is neither, so it can't set up a comeback.
      wrongBefore: sql<boolean>`exists(select 1 from attempts a where a.user_id = ${userId} and a.question_id = ${questionId} and a.outcome = 'incorrect'
        and (a.combo is not null or not exists(select 1 from attempts b where b.user_id = a.user_id and b.question_id = a.question_id and b.created_at < a.created_at)))`,
    })
    .from(t.users)
    .where(eq(t.users.id, userId));
  // Mastery of the question's topics before this answer, to compare with after it (see settleTopics).
  const topicsBefore = await getTopicStates(tx, userId, await topicsOfQuestion(tx, questionId), now);
  const previousCombo = await currentCombo(tx, userId, now);

  const firstAttempt = (history?.priorAttempts ?? 0) === 0;
  const alreadyAwarded = history?.alreadyAwarded ?? false;
  const answeredWhileDue = input.review !== null && input.review.dueAt.getTime() <= now.getTime();
  const due = answeredWhileDue && input.review!.paysXp;
  const undatedAt = history?.lastUndatedAt ?? null;
  const decision = answerXp({
    difficulty: input.difficulty,
    outcome: input.outcome,
    score: input.score,
    selfAssessed: input.selfAssessed,
    firstAttempt,
    alreadyAwarded,
    due,
    answeredEarlierToday: (history?.answeredEarlierToday ?? false) || (undatedAt !== null && localDay(undatedAt, zone) >= day),
    missedBefore: history?.missedBefore ?? false,
  });

  const attemptId = randomUUID();
  const events: XpAward[] = [];
  let awarded = false;
  if (decision.award) {
    const sourceId = decision.award.kind === 'review' ? reviewSourceId(questionId, input.review!.dueAt) : questionId;
    awarded = await insertXp(tx, userId, decision.award, sourceId, day, now);
    if (awarded) events.push(decision.award);
  }
  const comeback = comebackAward({
    dueReview: awarded && decision.award?.kind === 'review',
    outcome: input.outcome,
    wrongBefore: history?.wrongBefore ?? false,
    fixPaid: history?.fixPaid ?? false,
  });
  if (comeback && (await insertXp(tx, userId, comeback, questionId, day, now))) events.push(comeback);
  const combo = nextCombo(previousCombo, { eligible: decision.eligible, awarded, outcome: input.outcome });
  // Only answers that could earn XP touch the combo (see nextCombo).
  if (decision.eligible) await tx.update(t.users).set({ combo, comboAt: now }).where(eq(t.users.id, userId));

  return {
    attemptId,
    attemptCombo: decision.eligible ? combo : null,
    localDay: day,
    dueReview: due,
    nextDuePaysXp: (nextDueAt) => dueDatePaysXp({ firstAttempt, alreadyAwarded, outcome: input.outcome, previous: input.review, nextDueAt, now }),
    finish: async () => {
      if (awarded && combo > previousCombo) {
        const bonus = comboAward(combo);
        if (bonus && (await insertXp(tx, userId, bonus, attemptId, day, now))) events.push(bonus);
      }
      events.push(...(await settleLesson(tx, { userId, lessonId: input.lessonId, now, day })).events);
      const topics = await settleTopics(tx, userId, topicsBefore, now, day, { correct: input.outcome === 'correct', scored: awarded });
      events.push(...topics.events);
      return finishPoints(tx, { userId, now, day, dailyGoal, events, combo, checkBadges: topics.recovered });
    },
  };
}

// --- Lessons -------------------------------------------------------------------

/**
 * Lesson XP, once per lesson (by the unique index): 20 for a lesson that is
 * finished and has every one of its checks answered at least once (right or
 * wrong), +10 if every first attempt was right. Clicking "Finish" past
 * unanswered checks finishes the lesson but holds its XP back until the
 * remaining checks are answered, so the XP rewards the learning, not the
 * click. Returns the new awards and how many checks are still unanswered.
 */
async function settleLesson(
  tx: Db,
  input: { userId: string; lessonId: string; now: Date; day: LocalDay },
): Promise<{ events: XpAward[]; unanswered: number }> {
  const { userId, lessonId, now, day } = input;
  const [state] = await tx
    .select({
      completed: sql<boolean>`exists(select 1 from lesson_progress p where p.user_id = ${userId} and p.lesson_id = ${lessonId} and p.completed_at is not null)`,
      paid: sql<boolean>`exists(select 1 from xp_events e where e.user_id = ${userId} and e.kind = 'lesson' and e.source_id = ${lessonId})`,
    })
    .from(t.users)
    .where(eq(t.users.id, userId));
  if (!state?.completed || state.paid) return { events: [], unanswered: 0 };
  const firstScores = (
    await tx
      .select({
        first: sql<number | null>`(select a.score from attempts a
          where a.user_id = ${userId} and a.question_id = "questions"."id"
          order by a.created_at asc, a.id asc limit 1)`.mapWith((v) => (v === null ? null : Number(v))),
      })
      .from(t.questions)
      .where(and(eq(t.questions.lessonId, lessonId), isNull(t.questions.archivedAt)))
      .orderBy(asc(t.questions.position))
  ).map((r) => r.first);
  const unanswered = firstScores.filter((s) => s === null).length;
  if (unanswered > 0) return { events: [], unanswered };
  const events: XpAward[] = [];
  for (const award of lessonXp({ firstCompletion: true, firstScores })) {
    if (await insertXp(tx, userId, award, lessonId, day, now)) events.push(award);
  }
  return { events, unanswered: 0 };
}

/**
 * XP for finishing a lesson (see settleLesson), then the topic and daily
 * goal via finishPoints. Call inside the transaction that marks the lesson
 * complete, after lockUserPoints (pass its time) and after storing the
 * completion. `unanswered` is how many of the lesson's checks have never
 * been answered (its XP waits for them).
 */
export async function awardLessonCompletion(
  tx: Db,
  input: { userId: string; lessonId: string; now: Date },
): Promise<{ points: PointsResult; unanswered: number }> {
  const { userId, lessonId, now } = input;
  const { day, dailyGoal } = await startPointsDay(tx, userId, now);
  const lesson = await settleLesson(tx, { userId, lessonId, now, day });
  const points = await finishPoints(tx, { userId, now, day, dailyGoal, events: lesson.events, combo: await currentCombo(tx, userId, now) });
  return { points, unanswered: lesson.unanswered };
}

/**
 * Topic finished (50, once per topic): every core, non-archived lesson in a
 * topic is finished with all its checks answered. Checked after every
 * XP-earning action, for every topic the student has finished a lesson in,
 * so a topic completed before this rule existed (or whose last check was
 * answered after its lessons were finished) still pays, once.
 */
async function settleFinishedTopics(tx: Db, userId: string, now: Date, day: LocalDay): Promise<XpAward[]> {
  const rows = await tx
    .select({
      topicId: t.lessons.topicId,
      total: sql<number>`count(*)`.mapWith(Number),
      finished: sql<number>`count(*) filter (where ${t.lessonProgress.completedAt} is not null and not exists(
        select 1 from questions q where q.lesson_id = "lessons"."id" and q.archived_at is null
        and not exists(select 1 from attempts a where a.user_id = ${userId} and a.question_id = q.id)))`.mapWith(Number),
    })
    .from(t.lessons)
    .leftJoin(t.lessonProgress, and(eq(t.lessonProgress.lessonId, t.lessons.id), eq(t.lessonProgress.userId, userId)))
    .where(
      and(
        eq(t.lessons.kind, 'core'),
        isNull(t.lessons.archivedAt),
        sql`"lessons"."topic_id" in (select l.topic_id from lesson_progress p join lessons l on l.id = p.lesson_id
          where p.user_id = ${userId} and p.completed_at is not null)`,
        sql`not exists(select 1 from xp_events e where e.user_id = ${userId} and e.kind = 'topic' and e.source_id = "lessons"."topic_id")`,
      ),
    )
    .groupBy(t.lessons.topicId);
  const events: XpAward[] = [];
  for (const topic of rows) {
    const award = topicFinishedAward(topic);
    if (award && (await insertXp(tx, userId, award, topic.topicId, day, now))) events.push(award);
  }
  return events;
}

// --- Review sessions -----------------------------------------------------------

/**
 * XP for finishing a review session (15, once per local day): paid when the
 * student has answered at least five different questions as due reviews
 * today (right or wrong). "Due" is the server's schedule, stored on each
 * attempt, so the page an answer came from doesn't matter; "today" is the
 * stored local day of each attempt, so changing time zone can't count the
 * same answers twice. Call inside a transaction, after lockUserPoints (pass
 * its time). Always returns the points state; `gained` is 0 when nothing was
 * paid.
 */
export async function awardReviewSession(tx: Db, input: { userId: string; now: Date }): Promise<PointsResult> {
  const { userId, now } = input;
  const { day, dailyGoal } = await startPointsDay(tx, userId, now);
  const [row] = await tx
    .select({ questions: sql<number>`count(distinct ${t.attempts.questionId})`.mapWith(Number) })
    .from(t.attempts)
    .where(and(eq(t.attempts.userId, userId), eq(t.attempts.dueReview, true), eq(t.attempts.localDay, day)));
  const events: XpAward[] = [];
  const award = reviewSessionAward(row?.questions ?? 0);
  if (award && (await insertXp(tx, userId, award, day, day, now))) events.push(award);
  return finishPoints(tx, { userId, now, day, dailyGoal, events, combo: await currentCombo(tx, userId, now) });
}

// --- Topic mastery --------------------------------------------------------------

/** The topics whose objectives a question tests. */
async function topicsOfQuestion(tx: Db, questionId: string): Promise<string[]> {
  const rows = await tx
    .selectDistinct({ topicId: t.objectives.topicId })
    .from(t.questionObjectives)
    .innerJoin(t.objectives, eq(t.objectives.id, t.questionObjectives.objectiveId))
    .where(eq(t.questionObjectives.questionId, questionId));
  return rows.map((r) => r.topicId);
}

/**
 * After an answer is stored: compares the mastery of its topics before and
 * after it (the progress page's rules, via getTopicStates).
 * - A topic seen in Needs revision (before or after) is remembered in
 *   topic_recoveries, for Comeback Arc.
 * - When the answer was fully correct, a topic that is now fully Secure pays
 *   topic-secure (once per topic). A wrong answer never does: it can make a
 *   topic Secure on paper (answering an overdue review, even wrongly, clears
 *   the overdue flag), but that isn't learning.
 * - A topic remembered as slipped counts as recovered (Comeback Arc) when a
 *   fully correct answer either makes it Secure (it wasn't before) or, while
 *   it is Secure, earned XP itself (a due review, a first answer). So after
 *   a wrong answer made it Secure on paper, a repeat that earns nothing
 *   doesn't count; tomorrow's due review of the missed question does.
 */
async function settleTopics(
  tx: Db,
  userId: string,
  before: Map<string, MasteryState>,
  now: Date,
  day: LocalDay,
  answer: { correct: boolean; scored: boolean },
): Promise<{ events: XpAward[]; recovered: boolean }> {
  const events: XpAward[] = [];
  let recovered = false;
  if (!before.size) return { events, recovered };
  const after = await getTopicStates(tx, userId, [...before.keys()], now);
  for (const [topicId, state] of after) {
    if (before.get(topicId) === 'needs-revision' || state === 'needs-revision') {
      await tx.insert(t.topicRecoveries).values({ userId, topicId, slippedAt: now }).onConflictDoNothing();
    }
    if (!answer.correct) continue;
    const award = topicSecureAward(state);
    if (!award) continue;
    if (await insertXp(tx, userId, award, topicId, day, now)) events.push(award);
    if (before.get(topicId) === 'secure' && !answer.scored) continue;
    const rows = await tx
      .update(t.topicRecoveries)
      .set({ securedAt: now })
      .where(and(eq(t.topicRecoveries.userId, userId), eq(t.topicRecoveries.topicId, topicId), isNull(t.topicRecoveries.securedAt)))
      .returning({ topicId: t.topicRecoveries.topicId });
    if (rows.length) recovered = true;
  }
  return { events, recovered };
}

// --- Totals, daily goal, streak and badges -----------------------------------

/**
 * Totals, the daily-goal bonus, streak and new badges after an action.
 * Badges are checked when the action earned XP, or when `checkBadges` says
 * something a badge counts changed without XP (a topic's comeback).
 */
async function finishPoints(
  tx: Db,
  input: { userId: string; now: Date; day: LocalDay; dailyGoal: number; events: XpAward[]; combo: number; checkBadges?: boolean },
): Promise<PointsResult> {
  const { userId, day, dailyGoal, now } = input;
  const events = [...input.events];
  const [totals] = await tx
    .select({
      total: sql<number>`coalesce(sum(${t.xpEvents.amount}), 0)`.mapWith(Number),
      today: sql<number>`coalesce(sum(${t.xpEvents.amount}) filter (where ${t.xpEvents.localDay} = ${day}), 0)`.mapWith(Number),
      goalPaid: sql<boolean>`coalesce(bool_or(${t.xpEvents.kind} = 'daily-goal' and ${t.xpEvents.localDay} = ${day}), false)`,
      days: sql<string[]>`coalesce(array_agg(distinct ${t.xpEvents.localDay}::text), '{}')`,
    })
    .from(t.xpEvents)
    .where(eq(t.xpEvents.userId, userId));
  let totalXp = totals?.total ?? 0;
  let todayXp = totals?.today ?? 0;
  const days = totals?.days ?? [];
  let justMetGoal = false;

  // Any XP-earning action can complete a topic (its last lesson, or the last unanswered check in it).
  const earnedSomething = events.length > 0;
  if (earnedSomething) {
    for (const award of await settleFinishedTopics(tx, userId, now, day)) {
      events.push(award);
      totalXp += award.amount;
      todayXp += award.amount;
    }
  }

  // The daily-goal bonus follows an XP-earning action that takes today's XP to the goal.
  const goalBonus = earnedSomething ? dailyGoalAward(todayXp, dailyGoal, totals?.goalPaid ?? false) : null;
  if (goalBonus && (await insertXp(tx, userId, goalBonus, day, day, now))) {
    events.push(goalBonus);
    totalXp += goalBonus.amount;
    todayXp += goalBonus.amount;
    justMetGoal = true;
  }

  const streak = computeStreak(days, day);
  const gained = events.reduce((sum, e) => sum + e.amount, 0);

  let newBadges: PointsResult['newBadges'] = [];
  if (earnedSomething || input.checkBadges) {
    const { stats, earned } = await loadBadgeStats(tx, userId, { totalXp });
    const ids = evaluateBadges(stats, earned);
    if (ids.length) {
      const inserted = await tx
        .insert(t.userBadges)
        .values(ids.map((badgeId) => ({ userId, badgeId, earnedAt: now })))
        .onConflictDoNothing({ target: [t.userBadges.userId, t.userBadges.badgeId] })
        .returning({ badgeId: t.userBadges.badgeId });
      const fresh = new Set(inserted.map((r) => r.badgeId));
      newBadges = BADGES.filter((b) => fresh.has(b.id)).map((b) => ({ id: b.id, name: b.name, description: b.description, icon: b.icon }));
    }
  }

  const level = levelFor(totalXp);
  return {
    gained,
    events,
    combo: input.combo,
    totalXp,
    level,
    leveledUp: levelFor(totalXp - gained).level < level.level,
    today: { day, xp: todayXp, goal: dailyGoal, goalMet: isGoalMet(todayXp, dailyGoal), justMetGoal },
    streak,
    newBadges,
  };
}

/**
 * Lifetime stats the badges are judged on, in two statements, plus the ids
 * already earned. `known.totalXp` passes the total the caller already has.
 * (Subqueries use explicit aliases: drizzle leaves columns unqualified in
 * single-table selects, which would make correlated references ambiguous.)
 */
export async function loadBadgeStats(tx: Db, userId: string, known: { totalXp: number }): Promise<{ stats: BadgeStats; earned: string[] }> {
  const n = (expr: SQL) => sql<number>`${expr}`.mapWith(Number);
  const kind = (k: (typeof t.xpEvents.kind.enumValues)[number]) => n(sql`count(*) filter (where ${t.xpEvents.kind} = ${k})`);
  const [xp] = await tx
    .select({
      perfectLessons: kind('perfect'),
      // Correct due reviews are the full-value review awards (partly right ones are worth less).
      dueReviewsCorrect: n(sql`count(*) filter (where ${t.xpEvents.kind} = 'review' and ${t.xpEvents.amount} >= ${XP.review.correct})`),
      goalDays: kind('daily-goal'),
      reviewSessions: kind('review-session'),
      comebacks: kind('comeback'),
      topicsFinished: kind('topic'),
      topicsSecured: kind('topic-secure'),
      studyDays: n(sql`count(distinct ${t.xpEvents.localDay})`),
    })
    .from(t.xpEvents)
    .where(eq(t.xpEvents.userId, userId));
  const count = (expr: SQL) => n(sql`(${expr})`);
  // Lessons finished with every check answered: the ones that pay lesson XP (clicking past the checks doesn't count).
  const finished = sql`lesson_progress p join lessons l on l.id = p.lesson_id where p.user_id = ${userId} and p.completed_at is not null
    and not exists(select 1 from questions q where q.lesson_id = l.id and q.archived_at is null
      and not exists(select 1 from attempts a where a.user_id = p.user_id and a.question_id = q.id))`;
  const [row] = await tx
    .select({
      lessonsFinished: count(sql`select count(*) from ${finished}`),
      topicsWithFinishedLessons: count(sql`select count(distinct l.topic_id) from ${finished}`),
      subjects: count(sql`select count(distinct v.subject_code) from syllabus_versions v
        where v.id in (select l.version_id from ${finished})`),
      bestCombo: count(sql`select coalesce(max(a.combo), 0) from attempts a where a.user_id = ${userId}`),
      topicsRecovered: count(sql`select count(*) from topic_recoveries r where r.user_id = ${userId} and r.secured_at is not null`),
      earned: sql<string[]>`coalesce((select array_agg(b.badge_id) from user_badges b where b.user_id = ${userId}), '{}')`,
    })
    .from(t.users)
    .where(eq(t.users.id, userId));
  return {
    stats: {
      lessonsFinished: row?.lessonsFinished ?? 0,
      perfectLessons: xp?.perfectLessons ?? 0,
      bestCombo: row?.bestCombo ?? 0,
      reviewSessions: xp?.reviewSessions ?? 0,
      comebacks: xp?.comebacks ?? 0,
      topicsFinished: xp?.topicsFinished ?? 0,
      topicsWithFinishedLessons: row?.topicsWithFinishedLessons ?? 0,
      topicsSecured: xp?.topicsSecured ?? 0,
      topicsRecovered: row?.topicsRecovered ?? 0,
      studyDays: xp?.studyDays ?? 0,
      dueReviewsCorrect: xp?.dueReviewsCorrect ?? 0,
      goalDays: xp?.goalDays ?? 0,
      subjectsWithFinishedLessons: row?.subjects ?? 0,
      totalXp: known.totalXp,
    },
    earned: row?.earned ?? [],
  };
}
