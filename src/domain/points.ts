/**
 * Points (XP), levels, daily goals, streaks, days studied and badges: the
 * rules from docs/design/fun-and-points.md (§1–§4) as pure functions and
 * constants.
 *
 * Nothing here reads the database or the clock, so every rule is unit-tested
 * and can be explained on its own. The server (src/server/points.ts) decides
 * what happened, asks these functions what it is worth, and stores the
 * result; the browser only displays what the server returns. This module is
 * also safe to import from client components (types, BADGES, levelFor…).
 *
 * Principles the rules follow:
 * - Reward learning, not clicking: XP only for doing something for the first
 *   time (a first answer, a fixed mistake, a due review, a finished lesson,
 *   a finished or secured topic).
 * - Never punish: XP is never taken away, and a missed day is covered by a
 *   streak freeze when one is banked.
 */
import type { Outcome } from '@/domain/answers/check';
import type { MasteryState } from '@/domain/mastery';

// --- XP rules ------------------------------------------------------------------

/** Every kind of XP event. Stored in `xp_events.kind`. */
export const XP_KINDS = [
  'answer',
  'review',
  'lesson',
  'perfect',
  'combo',
  'daily-goal',
  'topic',
  'review-session',
  'comeback',
  'topic-secure',
] as const;
export type XpKind = (typeof XP_KINDS)[number];

/** What each kind of award is called when shown to the student, unless the award gives its own label. */
export const XP_LABELS: Record<XpKind, string> = {
  answer: 'Correct first time',
  review: 'Review',
  lesson: 'Lesson finished',
  perfect: 'Perfect lesson',
  combo: 'Combo',
  'daily-goal': 'Daily goal reached',
  topic: 'Topic finished',
  'review-session': 'Review session',
  comeback: 'Comeback',
  'topic-secure': 'Topic secured',
};

/**
 * Every XP amount, in one place. See the tables in docs/design/fun-and-points.md
 * §1 and §4; nothing else hard-codes an amount.
 */
export const XP = {
  /** A question answered fully correctly on the first ever attempt, by difficulty (1–3). */
  firstTry: { 1: 10, 2: 15, 3: 20 } as Record<1 | 2 | 3, number>,
  /**
   * A question that had never earned XP, answered correctly on a later local
   * day than any earlier attempt at it ("you fixed it"). Not on the day of the
   * miss: the feedback shows the answer, so a retry straight after is clicking.
   */
  laterFix: 5,
  /** A review question answered while it was due. */
  review: { correct: 10, partial: 5 },
  /** A lesson finished for the first time. */
  lesson: 20,
  /** Bonus when every question in the lesson was right on the first attempt. */
  perfect: 10,
  /** Reaching the daily goal, once per local day. */
  dailyGoal: 10,
  /** Every core lesson in a syllabus topic finished, once per topic. */
  topic: 50,
  /** A review session finished (REVIEW_SESSION_MIN_ANSWERS review answers in one local day), once per day. */
  reviewSession: 15,
  /** Bonus for a question that was wrong before and is now right in a due review, once per question. */
  comeback: 5,
  /** Every objective in a topic reaches Secure, once per topic. */
  topicSecure: 30,
} as const;

/** A score at or above this counts as correct (the same threshold as the review scheduler). */
export const CORRECT_SCORE = 0.99;

/** One XP award, as shown to the student ("+15 XP · Correct first time"). */
export interface XpAward {
  kind: XpKind;
  amount: number;
  label: string;
}

/** Outcomes that are recorded (invalid and self-check answers are never recorded). */
export type RecordedOutcome = Extract<Outcome, 'correct' | 'partial' | 'incorrect'>;

/** Base XP for a question's difficulty; out-of-range difficulties are clamped to 1–3. */
export function baseXp(difficulty: number): number {
  const d = Math.min(3, Math.max(1, Math.round(Number.isFinite(difficulty) ? difficulty : 1))) as 1 | 2 | 3;
  return XP.firstTry[d];
}

export interface AnswerXpInput {
  /** Question difficulty, 1–3. */
  difficulty: number;
  outcome: RecordedOutcome;
  /** 0..1 */
  score: number;
  /** The score came from the student's own judgement (explain, unmatched text). */
  selfAssessed: boolean;
  /** No earlier recorded attempt at this question, in any context. */
  firstAttempt: boolean;
  /** This question has already earned XP before (an `answer` or `review` award). */
  alreadyAwarded: boolean;
  /**
   * The question's spaced-repetition review was due when it was answered,
   * and that due date pays XP (see `review_items.pays_xp`).
   */
  due: boolean;
  /** An earlier attempt at this question was recorded on the same local day (so its answer has been shown today). */
  answeredEarlierToday?: boolean;
}

export interface AnswerXpDecision {
  /**
   * Could this answer have earned XP? Only eligible answers touch the combo:
   * repeats of questions that already paid out and reviews answered early are
   * neutral, so they neither extend nor break it.
   */
  eligible: boolean;
  /** The award, or null when this answer earns nothing. */
  award: (XpAward & { kind: 'answer' | 'review' }) | null;
}

/**
 * XP for one recorded answer. An answer earns at most one base award, checked
 * in this order:
 * 1. First ever attempt (kind `answer`, once per question): correct → base XP
 *    by difficulty; partially correct → half, rounded; self-assessed →
 *    round(base × score × 0.5).
 * 2. A review answered while due (kind `review`, once per question per due
 *    date): correct 10, partial 5. "Due" comes from the review schedule, so a
 *    due question answered inside a lesson counts as its review too, exactly
 *    as the scheduler treats it.
 * 3. A later attempt, correct, on a question that never earned XP (kind
 *    `answer`): 5, but only on a later local day than every earlier attempt.
 *    A retry on the day of the miss comes straight after the feedback showed
 *    the answer, so it earns nothing and leaves the combo alone.
 * Anything else is a repeat and earns nothing.
 */
export function answerXp(input: AnswerXpInput): AnswerXpDecision {
  const { outcome, score, selfAssessed } = input;
  const base = baseXp(input.difficulty);
  if (input.firstAttempt) {
    let amount = 0;
    let label = 'Correct first time';
    if (selfAssessed) {
      amount = Math.round(base * clamp01(score) * 0.5);
      label = 'Self-checked';
    } else if (outcome === 'correct') {
      amount = base;
    } else if (outcome === 'partial') {
      amount = Math.round(base / 2);
      label = 'Partly right';
    }
    return { eligible: true, award: amount > 0 ? { kind: 'answer', amount, label } : null };
  }
  if (input.due) {
    if (outcome === 'correct') return { eligible: true, award: { kind: 'review', amount: XP.review.correct, label: 'Review' } };
    if (outcome === 'partial') return { eligible: true, award: { kind: 'review', amount: XP.review.partial, label: 'Review, partly right' } };
    return { eligible: true, award: null };
  }
  if (!input.alreadyAwarded && !input.answeredEarlierToday) {
    return { eligible: true, award: outcome === 'correct' ? { kind: 'answer', amount: XP.laterFix, label: 'You fixed it' } : null };
  }
  return { eligible: false, award: null };
}

/**
 * Whether the due date an answer sets can pay review XP. Every due date
 * does, except one set by an early answer (before the item was due) to a
 * question that has already earned XP: otherwise a deliberate wrong answer
 * to a question the student knows would move it to tomorrow and buy a paid
 * review every day. Learning is unchanged (the miss still brings the
 * question back sooner); only the XP is withheld, until the next on-time
 * answer sets a paying due date again.
 */
export function dueDatePaysXp(input: { firstAttempt: boolean; answeredWhileDue: boolean; alreadyAwarded: boolean }): boolean {
  return input.firstAttempt || input.answeredWhileDue || !input.alreadyAwarded;
}

/** `xp_events.source_id` for a review award: one per question per due date. */
export function reviewSourceId(questionId: string, dueAt: Date): string {
  return `${questionId}@${dueAt.toISOString()}`;
}

// --- Combos --------------------------------------------------------------------

/** A combo breaks after this long without a scoring-eligible answer. */
export const COMBO_WINDOW_MS = 15 * 60_000;

/**
 * The combo count after an answer.
 * - Not eligible (a repeat, an early review): unchanged.
 * - Correct and it actually earned XP: +1.
 * - Incorrect: back to 0.
 * - Partially correct: unchanged (it is not a mistake, but not a clean hit either).
 * `awarded` guards against a double submission: if the database refused the
 * award because it already existed, the answer does not extend the combo.
 */
export function nextCombo(previous: number, answer: { eligible: boolean; awarded: boolean; outcome: RecordedOutcome }): number {
  if (!answer.eligible) return previous;
  if (answer.outcome === 'incorrect') return 0;
  if (answer.outcome === 'correct' && answer.awarded) return previous + 1;
  return previous;
}

/**
 * The combo still running now, from the last scoring-eligible answer (its
 * stored combo count and time). Zero when there is none or it is more than
 * 15 minutes old.
 */
export function liveCombo(last: { combo: number; at: Date } | null | undefined, now: Date): number {
  if (!last || last.combo <= 0) return 0;
  return now.getTime() - last.at.getTime() <= COMBO_WINDOW_MS ? last.combo : 0;
}

/** Combo milestones: 3 in a row +5, 5 in a row +10, 10 and every 5 after +15. */
export function comboBonus(combo: number): number {
  if (combo === 3) return 5;
  if (combo === 5) return 10;
  if (combo >= 10 && combo % 5 === 0) return 15;
  return 0;
}

/** The combo award for reaching `combo`, or null if it is not a milestone. */
export function comboAward(combo: number): XpAward | null {
  const amount = comboBonus(combo);
  return amount > 0 ? { kind: 'combo', amount, label: `Combo ×${combo}` } : null;
}

// --- Lessons and the daily goal ---------------------------------------------

/**
 * A perfect lesson: it has at least one question and the student's first
 * attempt at every one of them was correct. `firstScores` has one entry per
 * question in the lesson: the score of the first attempt, or null if never
 * attempted (a skipped question means the lesson isn't perfect).
 */
export function isPerfectLesson(firstScores: ReadonlyArray<number | null | undefined>): boolean {
  return firstScores.length > 0 && firstScores.every((s) => typeof s === 'number' && s >= CORRECT_SCORE);
}

/** Awards for finishing a lesson. Only the first completion pays out. */
export function lessonXp(input: { firstCompletion: boolean; firstScores: ReadonlyArray<number | null | undefined> }): XpAward[] {
  if (!input.firstCompletion) return [];
  const out: XpAward[] = [{ kind: 'lesson', amount: XP.lesson, label: XP_LABELS.lesson }];
  if (isPerfectLesson(input.firstScores)) out.push({ kind: 'perfect', amount: XP.perfect, label: XP_LABELS.perfect });
  return out;
}

/**
 * Today's XP has reached the daily goal. A goal of 0 means "no goal": it is
 * never met, so there is no goal ring and no goal bonus.
 */
export function isGoalMet(todayXp: number, goal: number): boolean {
  return goal > 0 && todayXp >= goal;
}

/** The daily-goal bonus, when today's XP has reached the goal and it hasn't been paid today. */
export function dailyGoalAward(todayXp: number, goal: number, alreadyAwardedToday: boolean): XpAward | null {
  if (alreadyAwardedToday || !isGoalMet(todayXp, goal)) return null;
  return { kind: 'daily-goal', amount: XP.dailyGoal, label: XP_LABELS['daily-goal'] };
}

/** Daily goal options (XP per day). 0 turns the goal off. */
export const DAILY_GOALS = [
  { xp: 0, name: 'Off' },
  { xp: 20, name: 'Chill' },
  { xp: 50, name: 'Regular' },
  { xp: 100, name: 'Serious' },
  { xp: 150, name: 'Intense' },
] as const;
export type DailyGoal = (typeof DAILY_GOALS)[number]['xp'];
export const DEFAULT_DAILY_GOAL: DailyGoal = 50;

export function isDailyGoal(value: unknown): value is DailyGoal {
  return DAILY_GOALS.some((g) => g.xp === value);
}

// --- Topics, review sessions and comebacks (§4) -----------------------------

/**
 * A topic is finished when it has at least one core lesson (enrichment and
 * archived lessons don't count) and every one of them is finished.
 */
export function isTopicFinished(coreLessons: { total: number; finished: number }): boolean {
  return coreLessons.total > 0 && coreLessons.finished >= coreLessons.total;
}

/** 50 XP for a finished topic (kind `topic`, source id the topic id, so once per topic). */
export function topicFinishedAward(coreLessons: { total: number; finished: number }): XpAward | null {
  return isTopicFinished(coreLessons) ? { kind: 'topic', amount: XP.topic, label: XP_LABELS.topic } : null;
}

/**
 * 30 XP when every objective in a topic is Secure, judged by the mastery
 * rules in src/domain/mastery.ts (the topic's aggregate state). Kind
 * `topic-secure`, source id the topic id, so once per topic even if it later
 * slips and is secured again.
 */
export function topicSecureAward(topicState: MasteryState): XpAward | null {
  return topicState === 'secure' ? { kind: 'topic-secure', amount: XP.topicSecure, label: XP_LABELS['topic-secure'] } : null;
}

/** Different questions answered in review on one local day that make a review session. */
export const REVIEW_SESSION_MIN_ANSWERS = 5;

/**
 * 15 XP for finishing a review session: at least five different questions
 * answered in review today (right or wrong: showing up is what counts;
 * re-answering one question doesn't add to the count). Kind
 * `review-session`, source id the local day, so the unique index pays it at
 * most once per day.
 */
export function reviewSessionAward(differentQuestionsReviewedToday: number): XpAward | null {
  if (differentQuestionsReviewedToday < REVIEW_SESSION_MIN_ANSWERS) return null;
  return { kind: 'review-session', amount: XP.reviewSession, label: XP_LABELS['review-session'] };
}

/**
 * +5 for a comeback: a question whose earlier attempt was incorrect, now
 * answered fully correctly in a due review (`dueReview`: the answer earned a
 * `review` award). "Due" comes from the review schedule, as for review XP, so
 * the browser can't claim it. Kind `comeback`, source id the question id, so
 * once per question.
 */
export function comebackAward(input: { dueReview: boolean; outcome: RecordedOutcome; wrongBefore: boolean }): XpAward | null {
  if (!input.dueReview || input.outcome !== 'correct' || !input.wrongBefore) return null;
  return { kind: 'comeback', amount: XP.comeback, label: XP_LABELS.comeback };
}

// --- Levels --------------------------------------------------------------------

/** Titles unlocked every five levels. */
export const LEVEL_TITLES = [
  { level: 1, title: 'Curious' },
  { level: 5, title: 'Explorer' },
  { level: 10, title: 'Problem Solver' },
  { level: 15, title: 'Sharp Mind' },
  { level: 20, title: "Examiner's Nightmare" },
  { level: 25, title: 'Legend' },
] as const;

/** Total XP needed to reach `level`: 25 × (L − 1) × L (level 2 at 50, 3 at 150, 10 at 2,250). */
export function xpToReachLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return 25 * (l - 1) * l;
}

export interface LevelInfo {
  level: number;
  title: string;
  /** XP earned since reaching this level. */
  xpIntoLevel: number;
  /** XP between this level and the next (50 × level). */
  xpForNextLevel: number;
  /** 0..1 towards the next level. */
  progress: number;
  /** The next title to unlock, or null at the top. */
  nextTitle: { level: number; title: string } | null;
}

export function titleFor(level: number): string {
  let title: string = LEVEL_TITLES[0].title;
  for (const t of LEVEL_TITLES) if (level >= t.level) title = t.title;
  return title;
}

export function levelFor(totalXp: number): LevelInfo {
  const xp = Number.isFinite(totalXp) && totalXp > 0 ? Math.floor(totalXp) : 0;
  // Solve 25(L−1)L ≤ xp for L, then correct any floating-point drift.
  let level = Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * xp) / 25)) / 2));
  while (xpToReachLevel(level + 1) <= xp) level++;
  while (level > 1 && xpToReachLevel(level) > xp) level--;
  const start = xpToReachLevel(level);
  const xpForNextLevel = xpToReachLevel(level + 1) - start;
  const xpIntoLevel = xp - start;
  const next = LEVEL_TITLES.find((t) => t.level > level);
  return {
    level,
    title: titleFor(level),
    xpIntoLevel,
    xpForNextLevel,
    progress: xpIntoLevel / xpForNextLevel,
    nextTitle: next ? { level: next.level, title: next.title } : null,
  };
}

// --- Local days ----------------------------------------------------------------

/** A calendar date, `YYYY-MM-DD`, in the student's time zone. */
export type LocalDay = string;

const DAY_MS = 86_400_000;
const formatters = new Map<string, Intl.DateTimeFormat>();

function formatterFor(timeZone: string): Intl.DateTimeFormat | null {
  let f = formatters.get(timeZone);
  if (f) return f;
  try {
    f = new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', calendar: 'gregory', numberingSystem: 'latn' });
  } catch {
    return null;
  }
  if (formatters.size < 1000) formatters.set(timeZone, f);
  return f;
}

/** IANA zone names look like `UTC`, `Europe/London`, `America/Argentina/Buenos_Aires`, `Etc/GMT+5`. */
const ZONE_NAME = /^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+){0,2}$/;

/**
 * The canonical spelling of an IANA time zone name (`europe/london` →
 * `Europe/London`), or null if it is not one this runtime knows. Raw UTC
 * offsets like `+05:30` are rejected: they don't follow daylight saving.
 */
export function canonicalTimeZone(name: unknown): string | null {
  if (typeof name !== 'string' || name.length > 64 || !ZONE_NAME.test(name)) return null;
  const f = formatterFor(name);
  return f ? f.resolvedOptions().timeZone : null;
}

export function isValidTimeZone(name: unknown): name is string {
  return canonicalTimeZone(name) !== null;
}

/**
 * The local calendar day of `date` in `timeZone`, as `YYYY-MM-DD`. Uses the
 * runtime's time zone database, so daylight-saving changes are handled. An
 * unknown zone falls back to UTC rather than failing a student's answer.
 */
export function localDay(date: Date, timeZone: string): LocalDay {
  const f = formatterFor(timeZone) ?? formatterFor('UTC')!;
  const parts = f.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year').padStart(4, '0')}-${get('month')}-${get('day')}`;
}

const DAY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isLocalDay(value: unknown): value is LocalDay {
  if (typeof value !== 'string') return false;
  const m = DAY_PATTERN.exec(value);
  if (!m) return false;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  return d.toISOString().slice(0, 10) === value;
}

/**
 * The local day a student's activity counts towards now, and the zone that
 * decides it. Once-a-day rewards (the daily goal, the review session) and
 * study days are keyed by this day, so it must not be movable at will:
 * - while the student's current day (`day`, started in `dayZone`) is still
 *   running in the zone it started in, activity keeps counting towards it,
 *   whatever the time zone is now;
 * - once it is over there, the next day starts in the current `timeZone`,
 *   and never earlier than `day` (moving west can't reopen a past day).
 * So changing time zone (travel, or a forged setting) takes effect at the
 * next day boundary instead of starting "tomorrow" early.
 */
export function activeLocalDay(input: { now: Date; timeZone: string; day: LocalDay | null; dayZone: string | null }): { day: LocalDay; zone: string } {
  const { now, timeZone, day, dayZone } = input;
  if (!day || !isLocalDay(day) || !dayZone) return { day: localDay(now, timeZone), zone: timeZone };
  if (localDay(now, dayZone) <= day) return { day, zone: dayZone };
  const here = localDay(now, timeZone);
  return here <= day ? { day, zone: dayZone } : { day: here, zone: timeZone };
}

/** Calendar arithmetic on local days (no time zones involved, so no DST surprises). */
function dayNumber(day: LocalDay): number {
  const m = DAY_PATTERN.exec(day);
  if (!m) throw new RangeError(`Not a YYYY-MM-DD day: ${day}`);
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) / DAY_MS;
}
function fromDayNumber(n: number): LocalDay {
  return new Date(n * DAY_MS).toISOString().slice(0, 10);
}

export function addDays(day: LocalDay, n: number): LocalDay {
  return fromDayNumber(dayNumber(day) + n);
}

/** Whole days from `from` to `to` (positive when `to` is later). */
export function daysBetween(from: LocalDay, to: LocalDay): number {
  return dayNumber(to) - dayNumber(from);
}

/** The `count` days ending with `today`, oldest first. */
export function lastDays(today: LocalDay, count: number): LocalDay[] {
  return Array.from({ length: Math.max(0, count) }, (_, i) => addDays(today, i - count + 1));
}

/** The seven days of the Monday–Sunday week that contains `day`, Monday first. */
export function weekOf(day: LocalDay): LocalDay[] {
  const n = dayNumber(day);
  const sinceMonday = (new Date(n * DAY_MS).getUTCDay() + 6) % 7; // getUTCDay: Sunday 0 … Saturday 6
  return Array.from({ length: 7 }, (_, i) => fromDayNumber(n - sinceMonday + i));
}

/**
 * Days studied this week: the days in `activeDays` (days with XP) that fall
 * in the Monday–Sunday week containing `today`, oldest first, without
 * duplicates. Shown as dots on the home page instead of a streak.
 */
export function daysStudiedThisWeek(activeDays: readonly LocalDay[], today: LocalDay): LocalDay[] {
  const week = new Set(weekOf(today));
  return [...new Set(activeDays)].filter((d) => week.has(d)).sort();
}

// --- Streaks -------------------------------------------------------------------

/** Every 7 consecutive streak days earn one freeze… */
export const FREEZE_EVERY = 7;
/** …up to this many banked. */
export const MAX_FREEZES = 2;

export interface Streak {
  /** Streak days (days with XP) in the current streak. Frozen days keep it alive but don't add to it. */
  current: number;
  /** The longest streak ever, in streak days. */
  longest: number;
  /** Freezes available to cover future missed days (0–2). */
  freezesBanked: number;
  /** Missed days that a freeze covered, oldest first. */
  frozenDays: LocalDay[];
  /** Today already has XP. */
  activeToday: boolean;
  /**
   * The streak is still going: today has XP, or every day since the last
   * streak day is covered by a freeze ("Do one question to keep your 6-day
   * streak"). `current` is 0 when this is false.
   */
  alive: boolean;
}

/**
 * The streak, derived entirely from the days that had XP (so there is no
 * extra state to get out of sync).
 *
 * Walking the days in order:
 * - each streak day adds 1 to the streak and to a run of consecutive days;
 *   every 7th day of a run banks a freeze, up to 2;
 * - a gap of missed days is covered automatically when enough freezes are
 *   banked (those days become frozen and the run restarts); otherwise the
 *   streak starts again from zero. Freezes are only spent when they save the
 *   streak, so an uncoverable gap keeps them for next time.
 * Today does not count as missed until it is over, so a streak whose last day
 * was yesterday (or whose gap since is frozen) is still alive.
 *
 * `activeDays` may be unsorted or contain duplicates; days after `today`
 * (e.g. after moving to an earlier time zone) are ignored.
 */
export function computeStreak(activeDays: readonly LocalDay[], today: LocalDay): Streak {
  const end = dayNumber(today);
  const days = [...new Set(activeDays.filter(isLocalDay).map(dayNumber))].filter((d) => d <= end).sort((a, b) => a - b);
  let current = 0;
  let longest = 0;
  let banked = 0;
  let run = 0;
  const frozen: number[] = [];
  let prev: number | null = null;

  /** Covers `missed` days after `from` with freezes if possible; returns whether it did. */
  const cover = (from: number, missed: number): boolean => {
    if (missed > banked) return false;
    banked -= missed;
    for (let i = 1; i <= missed; i++) frozen.push(from + i);
    return true;
  };

  for (const d of days) {
    const missed = prev === null ? 0 : d - prev - 1;
    if (missed > 0) {
      if (!cover(prev!, missed)) current = 0;
      run = 0;
    }
    current++;
    run++;
    if (run % FREEZE_EVERY === 0 && banked < MAX_FREEZES) banked++;
    longest = Math.max(longest, current);
    prev = d;
  }

  const activeToday = prev === end;
  let alive = false;
  if (prev !== null) {
    const missedSinceLast = end - prev - 1; // -1 when active today, 0 when the last day was yesterday
    alive = missedSinceLast <= 0 || cover(prev, missedSinceLast);
  }
  return {
    current: alive ? current : 0,
    longest,
    freezesBanked: banked,
    frozenDays: frozen.map(fromDayNumber),
    activeToday,
    alive,
  };
}

// --- Badges --------------------------------------------------------------------

/** What badges are judged on. All counts are lifetime totals. */
export interface BadgeStats {
  lessonsFinished: number;
  perfectLessons: number;
  /** The longest combo reached. */
  bestCombo: number;
  /** Review sessions finished (`review-session` awards). */
  reviewSessions: number;
  /** Comebacks: questions wrong before, then right in a due review (`comeback` awards). */
  comebacks: number;
  /** Topics with every core lesson finished (`topic` awards). */
  topicsFinished: number;
  /** Different topics with at least one finished lesson. */
  topicsWithFinishedLessons: number;
  /** Topics that reached fully Secure (`topic-secure` awards). */
  topicsSecured: number;
  /** Topics that had objectives in Needs revision and then became fully Secure. */
  topicsRecovered: number;
  /** Different local days with XP (any days, not necessarily in a row). */
  studyDays: number;
  /** Reviews answered fully correctly while due. */
  dueReviewsCorrect: number;
  /** Days on which the daily goal was reached. */
  goalDays: number;
  /** Subjects with at least one finished lesson. */
  subjectsWithFinishedLessons: number;
  totalXp: number;
}

/**
 * Icon keys; the UI maps each to an icon. A few badges share a key (the two
 * memory badges, the two comeback badges, the two big milestones), so badge
 * art that must be unique should be keyed by badge id.
 */
export type BadgeIcon =
  | 'spark'
  | 'flag'
  | 'gem'
  | 'bolt'
  | 'rocket'
  | 'flame'
  | 'calendar'
  | 'mountain'
  | 'books'
  | 'trophy'
  | 'brain'
  | 'target'
  | 'compass'
  | 'star'
  | 'crown';

export interface BadgeDefinition {
  id: string;
  name: string;
  /** Shown once earned. */
  description: string;
  /** Shown on a locked badge. */
  howToEarn: string;
  icon: BadgeIcon;
  /** Earned when `stats[stat] >= target`. */
  stat: keyof BadgeStats;
  target: number;
}

/**
 * Every badge, in display order (docs/design/fun-and-points.md §4). Ids are
 * stored in `user_badges.badge_id`: never rename one without a migration
 * (drizzle/0003 moved the first catalogue's ids to these). There are no
 * streak badges on purpose.
 */
export const BADGES = [
  { id: 'first-steps', name: 'First Steps', description: 'You finished your first lesson.', howToEarn: 'Finish a lesson.', icon: 'flag', stat: 'lessonsFinished', target: 1 },
  { id: 'recall-rookie', name: 'Recall Rookie', description: 'Your first review session.', howToEarn: `Answer ${REVIEW_SESSION_MIN_ANSWERS} review questions in one day.`, icon: 'brain', stat: 'reviewSessions', target: 1 },
  { id: 'getting-warmer', name: 'Getting Warmer', description: 'You got a question right in review that you had wrong before.', howToEarn: 'Get a question you missed before right when it comes up for review.', icon: 'flame', stat: 'comebacks', target: 1 },
  { id: 'flawless', name: 'Flawless', description: 'Every question in a lesson right first time.', howToEarn: 'Get every question in a lesson right on your first try.', icon: 'gem', stat: 'perfectLessons', target: 1 },
  { id: 'on-a-roll', name: 'On a Roll', description: 'Five right answers in a row.', howToEarn: 'Get 5 new answers right in a row.', icon: 'bolt', stat: 'bestCombo', target: 5 },
  { id: 'in-the-zone', name: 'In the Zone', description: 'Ten right answers in a row.', howToEarn: 'Get 10 new answers right in a row.', icon: 'rocket', stat: 'bestCombo', target: 10 },
  { id: 'topic-finisher', name: 'Topic Finisher', description: 'Every lesson in a topic finished.', howToEarn: 'Finish every lesson in one topic.', icon: 'mountain', stat: 'topicsFinished', target: 1 },
  { id: 'curious-mind', name: 'Curious Mind', description: 'Lessons finished in five different topics.', howToEarn: 'Finish a lesson in 5 different topics.', icon: 'spark', stat: 'topicsWithFinishedLessons', target: 5 },
  { id: 'concept-master', name: 'Concept Master', description: 'Every objective in a topic Secure.', howToEarn: 'Get every objective in one topic to Secure.', icon: 'trophy', stat: 'topicsSecured', target: 1 },
  { id: 'comeback-arc', name: 'Comeback Arc', description: 'A topic that needed revision is fully Secure again.', howToEarn: 'Bring a topic with objectives in Needs revision back to fully Secure.', icon: 'flame', stat: 'topicsRecovered', target: 1 },
  { id: 'consistency-club', name: 'Consistency Club', description: 'You studied on five different days.', howToEarn: "Earn XP on 5 different days (they don't need to be in a row).", icon: 'calendar', stat: 'studyDays', target: 5 },
  { id: 'ten-down', name: 'Ten Down', description: 'Ten lessons finished.', howToEarn: 'Finish 10 lessons.', icon: 'books', stat: 'lessonsFinished', target: 10 },
  { id: 'half-century', name: 'Half Century', description: 'Fifty lessons finished.', howToEarn: 'Finish 50 lessons.', icon: 'trophy', stat: 'lessonsFinished', target: 50 },
  { id: 'memory-keeper', name: 'Memory Keeper', description: '25 reviews remembered on the day they were due.', howToEarn: 'Answer 25 due reviews correctly.', icon: 'brain', stat: 'dueReviewsCorrect', target: 25 },
  { id: 'goal-getter', name: 'Goal Getter', description: 'Daily goal reached on 5 different days.', howToEarn: 'Reach your daily goal on 5 days.', icon: 'target', stat: 'goalDays', target: 5 },
  { id: 'explorer', name: 'Explorer', description: 'Lessons finished in two subjects.', howToEarn: 'Finish a lesson in 2 different subjects.', icon: 'compass', stat: 'subjectsWithFinishedLessons', target: 2 },
  { id: 'club-500', name: '500 Club', description: '500 XP earned.', howToEarn: 'Earn 500 XP in total.', icon: 'star', stat: 'totalXp', target: 500 },
  { id: 'club-2500', name: '2.5K Club', description: '2,500 XP earned.', howToEarn: 'Earn 2,500 XP in total.', icon: 'crown', stat: 'totalXp', target: 2500 },
] as const satisfies readonly BadgeDefinition[];

export type BadgeId = (typeof BADGES)[number]['id'];

const BADGE_BY_ID = new Map<string, BadgeDefinition>(BADGES.map((b) => [b.id, b]));

/** The catalogue entry for a stored badge id, or undefined for an unknown (retired) id. */
export function getBadge(id: string): BadgeDefinition | undefined {
  return BADGE_BY_ID.get(id);
}

/** How far along a badge is, for locked badges ("3 / 10"). `current` is capped at `target`. */
export function badgeProgress(badge: BadgeDefinition, stats: BadgeStats): { current: number; target: number } {
  const value = Math.max(0, Math.floor(stats[badge.stat] ?? 0));
  return { current: Math.min(value, badge.target), target: badge.target };
}

/**
 * Badges the stats now qualify for that aren't in `alreadyEarned`, in
 * catalogue order. Badges are never taken away, so this only ever adds.
 */
export function evaluateBadges(stats: BadgeStats, alreadyEarned: Iterable<string>): BadgeId[] {
  const earned = new Set(alreadyEarned);
  return BADGES.filter((b) => !earned.has(b.id) && (stats[b.stat] ?? 0) >= b.target).map((b) => b.id);
}

// --- What the server returns ------------------------------------------------

/**
 * The `points` object returned by submitAnswer and recordLessonStep for a
 * signed-in student (null for guests). Everything here comes from the server.
 */
export interface PointsResult {
  /** XP earned by this action, including any combo and daily-goal bonus. */
  gained: number;
  /** What it was earned for, in the order awarded. Empty when nothing was earned. */
  events: XpAward[];
  /** The combo running after this action (0 when there is none). */
  combo: number;
  /** Lifetime XP after this action. */
  totalXp: number;
  level: LevelInfo;
  /** This action moved the student up at least one level. */
  leveledUp: boolean;
  today: {
    /** The student's local day, YYYY-MM-DD. */
    day: LocalDay;
    xp: number;
    goal: number;
    goalMet: boolean;
    /** This action reached the daily goal (celebrate once). */
    justMetGoal: boolean;
  };
  streak: Streak;
  /** Badges earned by this action (celebrate once). */
  newBadges: Array<{ id: BadgeId; name: string; description: string; icon: BadgeIcon }>;
}

function clamp01(n: number): number {
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0;
}
