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
import { and, asc, desc, eq, gt, isNotNull, isNull, sql, type SQL } from 'drizzle-orm';
import type { Db } from '@/server/db';
import * as t from '@/server/db/schema';
import { getTopicStates } from '@/server/queries/progress';
import type { MasteryState } from '@/domain/mastery';
import {
  answerXp,
  BADGES,
  comboAward,
  comebackAward,
  computeStreak,
  dailyGoalAward,
  DEFAULT_DAILY_GOAL,
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

/** Serialises point awards for one user until the transaction ends. */
export async function lockUserPoints(tx: Db, userId: string): Promise<void> {
  await tx.execute(sql`select pg_advisory_xact_lock(${sql.raw(String(LOCK_NAMESPACE))}, hashtext(${userId}))`);
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

/** The combo running now, from the user's latest scoring-eligible answer (0 if over 15 minutes ago). */
export async function currentCombo(tx: Db, userId: string, now: Date): Promise<number> {
  const [last] = await tx
    .select({ combo: t.attempts.combo, at: t.attempts.createdAt })
    .from(t.attempts)
    .where(and(eq(t.attempts.userId, userId), isNotNull(t.attempts.combo)))
    .orderBy(desc(t.attempts.createdAt))
    .limit(1);
  return liveCombo(last ? { combo: last.combo ?? 0, at: last.at } : null, now);
}

// --- Answers -------------------------------------------------------------------

export interface AnswerPointsInput {
  userId: string;
  questionId: string;
  difficulty: number;
  outcome: RecordedOutcome;
  score: number;
  selfAssessed: boolean;
  /** The question's review due date before this answer, or null if it had never been answered. */
  dueAt: Date | null;
  now: Date;
}

export interface AnswerPoints {
  /** Use as the attempt's id, so a combo award can name the answer that reached it. */
  attemptId: string;
  /** Store in `attempts.combo`. */
  attemptCombo: number | null;
  /** Call after the attempt is inserted, still inside the transaction. */
  finish: () => Promise<PointsResult>;
}

/**
 * Decides and stores the XP for one answer: the base award (first try, due
 * review or fix), a comeback bonus, then in `finish()` the combo milestone,
 * topic-secure and the daily goal. Call inside the transaction that records
 * the attempt, after lockUserPoints and before inserting the attempt or
 * updating its review item (the topic mastery "before" is read here); insert
 * the attempt with the returned id and combo, update the review item, then
 * call `finish()`.
 */
export async function awardAnswer(tx: Db, input: AnswerPointsInput): Promise<AnswerPoints> {
  const { userId, questionId, now } = input;
  const [history] = await tx
    .select({
      timeZone: t.users.timeZone,
      dailyGoal: t.users.dailyGoal,
      priorAttempts: sql<number>`(select count(*) from attempts a where a.user_id = ${userId} and a.question_id = ${questionId})`.mapWith(Number),
      alreadyAwarded: sql<boolean>`exists(select 1 from xp_events e where e.user_id = ${userId} and (
        (e.kind = 'answer' and e.source_id = ${questionId})
        or (e.kind = 'review' and starts_with(e.source_id, ${questionId + '@'}))))`,
      wrongBefore: sql<boolean>`exists(select 1 from attempts a where a.user_id = ${userId} and a.question_id = ${questionId} and a.outcome = 'incorrect')`,
    })
    .from(t.users)
    .where(eq(t.users.id, userId));
  // Mastery of the question's topics before this answer, to compare with after it (see settleTopics).
  const topicsBefore = await getTopicStates(tx, userId, await topicsOfQuestion(tx, questionId), now);
  const previousCombo = await currentCombo(tx, userId, now);
  const timeZone = history?.timeZone ?? 'UTC';
  const dailyGoal = history?.dailyGoal ?? DEFAULT_DAILY_GOAL;
  const day = localDay(now, timeZone);

  const due = input.dueAt !== null && input.dueAt.getTime() <= now.getTime();
  const decision = answerXp({
    difficulty: input.difficulty,
    outcome: input.outcome,
    score: input.score,
    selfAssessed: input.selfAssessed,
    firstAttempt: (history?.priorAttempts ?? 0) === 0,
    alreadyAwarded: history?.alreadyAwarded ?? false,
    due,
  });

  const attemptId = randomUUID();
  const events: XpAward[] = [];
  let awarded = false;
  if (decision.award) {
    const sourceId = decision.award.kind === 'review' ? reviewSourceId(questionId, input.dueAt!) : questionId;
    awarded = await insertXp(tx, userId, decision.award, sourceId, day, now);
    if (awarded) events.push(decision.award);
  }
  const comeback = comebackAward({
    dueReview: awarded && decision.award?.kind === 'review',
    outcome: input.outcome,
    wrongBefore: history?.wrongBefore ?? false,
  });
  if (comeback && (await insertXp(tx, userId, comeback, questionId, day, now))) events.push(comeback);
  const combo = nextCombo(previousCombo, { eligible: decision.eligible, awarded, outcome: input.outcome });

  return {
    attemptId,
    attemptCombo: decision.eligible ? combo : null,
    finish: async () => {
      if (awarded && combo > previousCombo) {
        const bonus = comboAward(combo);
        if (bonus && (await insertXp(tx, userId, bonus, attemptId, day, now))) events.push(bonus);
      }
      const topics = await settleTopics(tx, userId, topicsBefore, now, day);
      events.push(...topics.events);
      return finishPoints(tx, { userId, now, day, dailyGoal, events, combo, checkBadges: topics.recovered });
    },
  };
}

// --- Lessons -------------------------------------------------------------------

/**
 * XP for finishing a lesson: 20 the first time, +10 if every question in it
 * was right on the first attempt, +50 when it completes its topic. Call
 * inside the transaction that marks the lesson complete, after
 * lockUserPoints and after storing the completion. `firstCompletion` is
 * whether the lesson had no completion time before this call.
 */
export async function awardLessonCompletion(
  tx: Db,
  input: { userId: string; lessonId: string; firstCompletion: boolean; now: Date },
): Promise<PointsResult> {
  const { userId, lessonId, now } = input;
  const [prefs] = await tx.select({ timeZone: t.users.timeZone, dailyGoal: t.users.dailyGoal }).from(t.users).where(eq(t.users.id, userId));
  const day = localDay(now, prefs?.timeZone ?? 'UTC');
  const firstScores = input.firstCompletion
    ? (
        await tx
          .select({
            first: sql<number | null>`(select a.score from attempts a
              where a.user_id = ${userId} and a.question_id = "questions"."id"
              order by a.created_at asc, a.id asc limit 1)`.mapWith((v) => (v === null ? null : Number(v))),
          })
          .from(t.questions)
          .where(and(eq(t.questions.lessonId, lessonId), isNull(t.questions.archivedAt)))
          .orderBy(asc(t.questions.position))
      ).map((r) => r.first)
    : [];
  const events: XpAward[] = [];
  for (const award of lessonXp({ firstCompletion: input.firstCompletion, firstScores })) {
    if (await insertXp(tx, userId, award, lessonId, day, now)) events.push(award);
  }

  // Topic finished: every core (non-enrichment, non-archived) lesson in this lesson's topic is
  // finished. Checked on every completion, so finishing an enrichment lesson, or a topic that
  // was already complete before this rule existed, still pays (once, by the unique index).
  const [topic] = await tx
    .select({
      topicId: t.lessons.topicId,
      total: sql<number>`count(*)`.mapWith(Number),
      finished: sql<number>`count(${t.lessonProgress.completedAt})`.mapWith(Number),
    })
    .from(t.lessons)
    .leftJoin(t.lessonProgress, and(eq(t.lessonProgress.lessonId, t.lessons.id), eq(t.lessonProgress.userId, userId)))
    .where(
      and(
        eq(t.lessons.topicId, sql`(select l.topic_id from lessons l where l.id = ${lessonId})`),
        eq(t.lessons.kind, 'core'),
        isNull(t.lessons.archivedAt),
      ),
    )
    .groupBy(t.lessons.topicId);
  const topicAward = topic ? topicFinishedAward(topic) : null;
  if (topic && topicAward && (await insertXp(tx, userId, topicAward, topic.topicId, day, now))) events.push(topicAward);

  return finishPoints(tx, {
    userId,
    now,
    day,
    dailyGoal: prefs?.dailyGoal ?? DEFAULT_DAILY_GOAL,
    events,
    combo: await currentCombo(tx, userId, now),
  });
}

// --- Review sessions -----------------------------------------------------------

/**
 * XP for finishing a review session (15, once per local day): paid when the
 * student has answered at least five different questions in review today.
 * Call inside a transaction, after lockUserPoints. Always returns the points
 * state; `gained` is 0 when nothing was paid.
 */
export async function awardReviewSession(tx: Db, input: { userId: string; now: Date }): Promise<PointsResult> {
  const { userId, now } = input;
  const [prefs] = await tx.select({ timeZone: t.users.timeZone, dailyGoal: t.users.dailyGoal }).from(t.users).where(eq(t.users.id, userId));
  const timeZone = prefs?.timeZone ?? 'UTC';
  const day = localDay(now, timeZone);
  // A local day never starts more than 26 hours before now, so two days back is enough to find today's.
  const recent = await tx
    .select({ questionId: t.attempts.questionId, at: t.attempts.createdAt })
    .from(t.attempts)
    .where(and(eq(t.attempts.userId, userId), eq(t.attempts.context, 'review'), gt(t.attempts.createdAt, new Date(now.getTime() - 2 * 86_400_000))));
  const answeredToday = new Set(recent.filter((r) => localDay(r.at, timeZone) === day).map((r) => r.questionId)).size;
  const events: XpAward[] = [];
  const award = reviewSessionAward(answeredToday);
  if (award && (await insertXp(tx, userId, award, day, day, now))) events.push(award);
  return finishPoints(tx, {
    userId,
    now,
    day,
    dailyGoal: prefs?.dailyGoal ?? DEFAULT_DAILY_GOAL,
    events,
    combo: await currentCombo(tx, userId, now),
  });
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
 * - A topic that is now fully Secure pays topic-secure (once per topic) and,
 *   if it was remembered as slipped, counts as recovered.
 */
async function settleTopics(
  tx: Db,
  userId: string,
  before: Map<string, MasteryState>,
  now: Date,
  day: LocalDay,
): Promise<{ events: XpAward[]; recovered: boolean }> {
  const events: XpAward[] = [];
  let recovered = false;
  if (!before.size) return { events, recovered };
  const after = await getTopicStates(tx, userId, [...before.keys()], now);
  for (const [topicId, state] of after) {
    if (before.get(topicId) === 'needs-revision' || state === 'needs-revision') {
      await tx.insert(t.topicRecoveries).values({ userId, topicId, slippedAt: now }).onConflictDoNothing();
    }
    const award = topicSecureAward(state);
    if (!award) continue;
    if (await insertXp(tx, userId, award, topicId, day, now)) events.push(award);
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

  // The daily-goal bonus follows an XP-earning action that takes today's XP to the goal.
  const earnedSomething = events.length > 0;
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
  const finished = sql`lesson_progress p join lessons l on l.id = p.lesson_id where p.user_id = ${userId} and p.completed_at is not null`;
  const [row] = await tx
    .select({
      lessonsFinished: count(sql`select count(*) from ${finished}`),
      topicsWithFinishedLessons: count(sql`select count(distinct l.topic_id) from ${finished}`),
      subjects: count(sql`select count(distinct v.subject_code) from lesson_progress p
        join lessons l on l.id = p.lesson_id
        join syllabus_versions v on v.id = l.version_id
        where p.user_id = ${userId} and p.completed_at is not null`),
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
