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
import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import type { Db } from '@/server/db';
import * as t from '@/server/db/schema';
import {
  answerXp,
  badgeProgress,
  BADGES,
  comboAward,
  computeStreak,
  CORRECT_SCORE,
  COMBO_WINDOW_MS,
  dailyGoalAward,
  DEFAULT_DAILY_GOAL,
  evaluateBadges,
  getBadge,
  lessonXp,
  levelFor,
  liveCombo,
  localDay,
  nextCombo,
  reviewSourceId,
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

/** The latest scoring-eligible answer within the combo window, as SQL (null when none). */
const lastComboSql = (userId: string, now: Date) =>
  sql<number | null>`(select ${t.attempts.combo} from ${t.attempts}
    where ${t.attempts.userId} = ${userId} and ${t.attempts.combo} is not null
      and ${t.attempts.createdAt} >= ${new Date(now.getTime() - COMBO_WINDOW_MS).toISOString()}::timestamptz
    order by ${t.attempts.createdAt} desc limit 1)`;

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
 * Decides and stores the XP for one answer. Call inside the transaction that
 * records the attempt, after lockUserPoints and before inserting the attempt;
 * insert the attempt with the returned id and combo, then call `finish()`.
 */
export async function awardAnswer(tx: Db, input: AnswerPointsInput): Promise<AnswerPoints> {
  const { userId, questionId, now } = input;
  const [history] = await tx
    .select({
      timeZone: t.users.timeZone,
      dailyGoal: t.users.dailyGoal,
      priorAttempts: sql<number>`(select count(*) from ${t.attempts} where ${t.attempts.userId} = ${userId} and ${t.attempts.questionId} = ${questionId})`.mapWith(Number),
      alreadyAwarded: sql<boolean>`exists(select 1 from ${t.xpEvents} where ${t.xpEvents.userId} = ${userId} and (
        (${t.xpEvents.kind} = 'answer' and ${t.xpEvents.sourceId} = ${questionId})
        or (${t.xpEvents.kind} = 'review' and starts_with(${t.xpEvents.sourceId}, ${questionId + '@'}))))`,
      lastCombo: lastComboSql(userId, now),
      lastComboAt: sql<string | null>`(select ${t.attempts.createdAt}::text from ${t.attempts}
        where ${t.attempts.userId} = ${userId} and ${t.attempts.combo} is not null
        order by ${t.attempts.createdAt} desc limit 1)`,
    })
    .from(t.users)
    .where(eq(t.users.id, userId));
  const timeZone = history?.timeZone ?? 'UTC';
  const dailyGoal = history?.dailyGoal ?? DEFAULT_DAILY_GOAL;
  const day = localDay(now, timeZone);
  const previousCombo = Number(history?.lastCombo ?? 0);

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
  const combo = nextCombo(previousCombo, { eligible: decision.eligible, awarded, outcome: input.outcome });

  return {
    attemptId,
    attemptCombo: decision.eligible ? combo : null,
    finish: async () => {
      if (awarded && combo > previousCombo) {
        const bonus = comboAward(combo);
        if (bonus && (await insertXp(tx, userId, bonus, attemptId, day, now))) events.push(bonus);
      }
      return finishPoints(tx, { userId, now, day, dailyGoal, events, combo });
    },
  };
}

// --- Lessons -------------------------------------------------------------------

/**
 * XP for finishing a lesson: 20 the first time, +10 if every question in it
 * was right on the first attempt. Call inside the transaction that marks the
 * lesson complete, after lockUserPoints. `firstCompletion` is whether the
 * lesson had no completion time before this call.
 */
export async function awardLessonCompletion(
  tx: Db,
  input: { userId: string; lessonId: string; firstCompletion: boolean; now: Date },
): Promise<PointsResult> {
  const { userId, lessonId, now } = input;
  const [prefs] = await tx
    .select({ timeZone: t.users.timeZone, dailyGoal: t.users.dailyGoal, lastCombo: lastComboSql(userId, now) })
    .from(t.users)
    .where(eq(t.users.id, userId));
  const day = localDay(now, prefs?.timeZone ?? 'UTC');
  const firstScores = input.firstCompletion
    ? (
        await tx
          .select({
            first: sql<number | null>`(select ${t.attempts.score} from ${t.attempts}
              where ${t.attempts.userId} = ${userId} and ${t.attempts.questionId} = ${t.questions.id}
              order by ${t.attempts.createdAt} asc, ${t.attempts.id} asc limit 1)`.mapWith((v) => (v === null ? null : Number(v))),
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
  return finishPoints(tx, {
    userId,
    now,
    day,
    dailyGoal: prefs?.dailyGoal ?? DEFAULT_DAILY_GOAL,
    events,
    combo: Number(prefs?.lastCombo ?? 0),
  });
}

// --- Totals, daily goal, streak and badges -----------------------------------

async function finishPoints(
  tx: Db,
  input: { userId: string; now: Date; day: LocalDay; dailyGoal: number; events: XpAward[]; combo: number },
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
  if (earnedSomething) {
    const { stats, earned } = await loadBadgeStats(tx, userId, { totalXp, longestStreak: streak.longest });
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
    today: { day, xp: todayXp, goal: dailyGoal, goalMet: todayXp >= dailyGoal, justMetGoal },
    streak,
    newBadges,
  };
}

/**
 * Lifetime stats the badges are judged on, in one statement, plus the ids
 * already earned. `known` passes values the caller has already computed.
 */
export async function loadBadgeStats(
  tx: Db,
  userId: string,
  known: { totalXp: number; longestStreak: number },
): Promise<{ stats: BadgeStats; earned: string[] }> {
  const count = (expr: ReturnType<typeof sql>) => sql<number>`(${expr})`.mapWith(Number);
  const [row] = await tx
    .select({
      correctAnswers: count(sql`select count(*) from ${t.attempts} where ${t.attempts.userId} = ${userId} and ${t.attempts.score} >= ${CORRECT_SCORE}`),
      lessonsFinished: count(sql`select count(*) from ${t.lessonProgress} where ${t.lessonProgress.userId} = ${userId} and ${t.lessonProgress.completedAt} is not null`),
      perfectLessons: count(sql`select count(*) from ${t.xpEvents} where ${t.xpEvents.userId} = ${userId} and ${t.xpEvents.kind} = 'perfect'`),
      bestCombo: count(sql`select coalesce(max(${t.attempts.combo}), 0) from ${t.attempts} where ${t.attempts.userId} = ${userId}`),
      // Correct due reviews are the full-value review awards (partial ones are worth less).
      dueReviewsCorrect: count(
        sql`select count(*) from ${t.xpEvents} where ${t.xpEvents.userId} = ${userId} and ${t.xpEvents.kind} = 'review' and ${t.xpEvents.amount} >= ${XP.review.correct}`,
      ),
      goalDays: count(sql`select count(*) from ${t.xpEvents} where ${t.xpEvents.userId} = ${userId} and ${t.xpEvents.kind} = 'daily-goal'`),
      subjects: count(sql`select count(distinct ${t.syllabusVersions.subjectCode}) from ${t.lessonProgress}
        join ${t.lessons} on ${t.lessons.id} = ${t.lessonProgress.lessonId}
        join ${t.syllabusVersions} on ${t.syllabusVersions.id} = ${t.lessons.versionId}
        where ${t.lessonProgress.userId} = ${userId} and ${t.lessonProgress.completedAt} is not null`),
      earned: sql<string[]>`coalesce((select array_agg(${t.userBadges.badgeId}) from ${t.userBadges} where ${t.userBadges.userId} = ${userId}), '{}')`,
    })
    .from(t.users)
    .where(eq(t.users.id, userId));
  return {
    stats: {
      correctAnswers: row?.correctAnswers ?? 0,
      lessonsFinished: row?.lessonsFinished ?? 0,
      perfectLessons: row?.perfectLessons ?? 0,
      bestCombo: row?.bestCombo ?? 0,
      longestStreak: known.longestStreak,
      dueReviewsCorrect: row?.dueReviewsCorrect ?? 0,
      goalDays: row?.goalDays ?? 0,
      subjectsWithFinishedLessons: row?.subjects ?? 0,
      totalXp: known.totalXp,
    },
    earned: row?.earned ?? [],
  };
}

/** For the badge gallery: progress towards a badge from loaded stats. */
export function progressFor(badgeId: string, stats: BadgeStats): { current: number; target: number } | null {
  const badge = getBadge(badgeId);
  return badge ? badgeProgress(badge, stats) : null;
}

/** Re-export for callers that only need the live combo outside an award. */
export { liveCombo };
