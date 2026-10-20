/**
 * Points read models: the header and home summary, and the progress page's
 * history and badge gallery. Aggregated in SQL (per local day) and finished
 * with the pure rules in src/domain/points.ts, so these always agree with
 * what the actions returned.
 */
import 'server-only';
import { cache } from 'react';
import { desc, eq, sql } from 'drizzle-orm';
import { getDb, type Db } from '@/server/db';
import * as t from '@/server/db/schema';
import { loadBadgeStats } from '@/server/points';
import {
  badgeProgress,
  BADGES,
  computeStreak,
  daysStudiedThisWeek,
  DEFAULT_DAILY_GOAL,
  getBadge,
  isGoalMet,
  lastDays,
  levelFor,
  localDay,
  type BadgeIcon,
  type BadgeId,
  type LevelInfo,
  type LocalDay,
  type Streak,
} from '@/domain/points';

export interface PointsDay {
  /** YYYY-MM-DD in the student's time zone. */
  day: LocalDay;
  xp: number;
  /** At least one XP event that day (a streak day). */
  active: boolean;
  /** A missed day covered by a streak freeze. */
  frozen: boolean;
  /** The daily-goal bonus was earned that day (today: XP has reached the current goal; never with no goal). */
  goalMet: boolean;
  isToday: boolean;
}

export interface EarnedBadge {
  id: BadgeId;
  name: string;
  description: string;
  icon: BadgeIcon;
  earnedAt: Date;
}

export interface PointsSettings {
  /** XP per day; 0 means no goal (no goal ring, no goal bonus). */
  dailyGoal: number;
  timeZone: string;
  celebrations: boolean;
  sounds: boolean;
  /** Off: hide XP, combos, goals and badges everywhere (XP is still recorded). */
  showPoints: boolean;
}

export interface PointsSummary {
  totalXp: number;
  level: LevelInfo;
  /** `goal` 0 means no goal, and then `goalMet` is always false. */
  today: { day: LocalDay; xp: number; goal: number; goalMet: boolean };
  streak: Streak;
  /** The last 7 local days, oldest first, ending today. */
  week: PointsDay[];
  /**
   * Days studied this week: the local days (YYYY-MM-DD) with XP in the
   * current Monday–Sunday week, oldest first. For the "days studied this
   * week" dots; weekOf(today.day) in @/domain/points gives all seven days.
   */
  daysThisWeek: LocalDay[];
  /** Most recent first, at most 3. */
  latestBadges: EarnedBadge[];
  badgeCount: number;
  settings: PointsSettings;
}

export interface BadgeStatus {
  id: BadgeId;
  name: string;
  description: string;
  howToEarn: string;
  icon: BadgeIcon;
  earned: boolean;
  earnedAt: Date | null;
  /** Towards the badge, capped at the target ("3 / 10"); equal to target once earned. */
  progress: { current: number; target: number };
}

export interface PointsHistory {
  totalXp: number;
  level: LevelInfo;
  streak: Streak;
  dailyGoal: number;
  /** The last 14 local days, oldest first, ending today. */
  days: PointsDay[];
  /** Every badge in catalogue order, earned or locked. */
  badges: BadgeStatus[];
  earnedCount: number;
}

interface Loaded {
  settings: PointsSettings;
  today: LocalDay;
  totalXp: number;
  byDay: Map<LocalDay, { xp: number; goal: boolean }>;
  streak: Streak;
  badges: Array<{ id: string; earnedAt: Date }>;
}

/** Three small queries: the user's settings, XP per local day, and earned badges. */
async function load(db: Db, userId: string, now: Date): Promise<Loaded> {
  const [prefs, dayRows, badgeRows] = await Promise.all([
    db
      .select({
        dailyGoal: t.users.dailyGoal,
        timeZone: t.users.timeZone,
        celebrations: t.users.celebrations,
        sounds: t.users.sounds,
        showPoints: t.users.showPoints,
      })
      .from(t.users)
      .where(eq(t.users.id, userId)),
    db
      .select({
        day: sql<string>`${t.xpEvents.localDay}::text`,
        xp: sql<number>`sum(${t.xpEvents.amount})`.mapWith(Number),
        goal: sql<boolean>`bool_or(${t.xpEvents.kind} = 'daily-goal')`,
      })
      .from(t.xpEvents)
      .where(eq(t.xpEvents.userId, userId))
      .groupBy(t.xpEvents.localDay),
    db
      .select({ id: t.userBadges.badgeId, earnedAt: t.userBadges.earnedAt })
      .from(t.userBadges)
      .where(eq(t.userBadges.userId, userId))
      .orderBy(desc(t.userBadges.earnedAt), t.userBadges.badgeId),
  ]);
  const settings: PointsSettings = prefs[0] ?? { dailyGoal: DEFAULT_DAILY_GOAL, timeZone: 'UTC', celebrations: true, sounds: false, showPoints: true };
  const today = localDay(now, settings.timeZone);
  const byDay = new Map(dayRows.map((r) => [r.day, { xp: r.xp, goal: r.goal }]));
  const totalXp = dayRows.reduce((sum, r) => sum + r.xp, 0);
  const streak = computeStreak([...byDay.keys()], today);
  return { settings, today, totalXp, byDay, streak, badges: badgeRows.filter((b) => getBadge(b.id)) };
}

function daysView(l: Loaded, count: number): PointsDay[] {
  const frozen = new Set(l.streak.frozenDays);
  return lastDays(l.today, count).map((day) => {
    const d = l.byDay.get(day);
    const xp = d?.xp ?? 0;
    const isToday = day === l.today;
    return { day, xp, active: !!d, frozen: frozen.has(day), goalMet: !!d?.goal || (isToday && isGoalMet(xp, l.settings.dailyGoal)), isToday };
  });
}

function earnedView(b: { id: string; earnedAt: Date }): EarnedBadge {
  const def = getBadge(b.id)!;
  return { id: def.id as BadgeId, name: def.name, description: def.description, icon: def.icon, earnedAt: b.earnedAt };
}

/** For the top bar and home: XP, level, today against the goal, streak, the last 7 days, days studied this week, latest badges. */
export const getPointsSummary = cache(async (userId: string): Promise<PointsSummary> => {
  const db = await getDb();
  const l = await load(db, userId, new Date());
  const todayXp = l.byDay.get(l.today)?.xp ?? 0;
  return {
    totalXp: l.totalXp,
    level: levelFor(l.totalXp),
    today: { day: l.today, xp: todayXp, goal: l.settings.dailyGoal, goalMet: isGoalMet(todayXp, l.settings.dailyGoal) },
    streak: l.streak,
    week: daysView(l, 7),
    daysThisWeek: daysStudiedThisWeek([...l.byDay.keys()], l.today),
    latestBadges: l.badges.slice(0, 3).map(earnedView),
    badgeCount: l.badges.length,
    settings: l.settings,
  };
});

/** For the progress page: XP per day for the last 14 days and every badge, earned or locked. */
export const getPointsHistory = cache(async (userId: string): Promise<PointsHistory> => {
  const db = await getDb();
  const l = await load(db, userId, new Date());
  const { stats } = await loadBadgeStats(db, userId, { totalXp: l.totalXp });
  const earnedAt = new Map(l.badges.map((b) => [b.id, b.earnedAt]));
  const badges: BadgeStatus[] = BADGES.map((b) => {
    const at = earnedAt.get(b.id) ?? null;
    const progress = badgeProgress(b, stats);
    return {
      id: b.id,
      name: b.name,
      description: b.description,
      howToEarn: b.howToEarn,
      icon: b.icon,
      earned: at !== null,
      earnedAt: at,
      progress: at !== null ? { current: progress.target, target: progress.target } : progress,
    };
  });
  return {
    totalXp: l.totalXp,
    level: levelFor(l.totalXp),
    streak: l.streak,
    dailyGoal: l.settings.dailyGoal,
    days: daysView(l, 14),
    badges,
    earnedCount: badges.filter((b) => b.earned).length,
  };
});
