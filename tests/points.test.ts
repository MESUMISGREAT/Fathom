/** Unit tests for the pure points rules (src/domain/points.ts). */
import { describe, expect, it } from 'vitest';
import {
  addDays,
  answerXp,
  badgeProgress,
  BADGES,
  baseXp,
  canonicalTimeZone,
  comboAward,
  comboBonus,
  COMBO_WINDOW_MS,
  computeStreak,
  DAILY_GOALS,
  dailyGoalAward,
  daysBetween,
  DEFAULT_DAILY_GOAL,
  evaluateBadges,
  getBadge,
  isDailyGoal,
  isLocalDay,
  isPerfectLesson,
  isValidTimeZone,
  lastDays,
  lessonXp,
  levelFor,
  liveCombo,
  localDay,
  MAX_FREEZES,
  nextCombo,
  reviewSourceId,
  titleFor,
  xpToReachLevel,
  type AnswerXpInput,
  type BadgeStats,
} from '@/domain/points';

const answer = (o: Partial<AnswerXpInput> = {}): AnswerXpInput => ({
  difficulty: 1,
  outcome: 'correct',
  score: 1,
  selfAssessed: false,
  firstAttempt: true,
  alreadyAwarded: false,
  due: false,
  ...o,
});

describe('answer XP', () => {
  it('pays base XP by difficulty for a correct first attempt', () => {
    expect(answerXp(answer({ difficulty: 1 })).award).toEqual({ kind: 'answer', amount: 10, label: 'Correct first time' });
    expect(answerXp(answer({ difficulty: 2 })).award?.amount).toBe(15);
    expect(answerXp(answer({ difficulty: 3 })).award?.amount).toBe(20);
    expect(answerXp(answer()).eligible).toBe(true);
  });

  it('clamps unexpected difficulties', () => {
    expect(baseXp(0)).toBe(10);
    expect(baseXp(7)).toBe(20);
    expect(baseXp(Number.NaN)).toBe(10);
    expect(baseXp(2.4)).toBe(15);
  });

  it('pays half, rounded, for a partially correct first attempt', () => {
    expect(answerXp(answer({ difficulty: 1, outcome: 'partial', score: 0.5 })).award).toMatchObject({ amount: 5, label: 'Partly right' });
    expect(answerXp(answer({ difficulty: 2, outcome: 'partial', score: 0.5 })).award?.amount).toBe(8); // 7.5 rounds up
    expect(answerXp(answer({ difficulty: 3, outcome: 'partial', score: 0.25 })).award?.amount).toBe(10);
  });

  it('pays round(base × score × 0.5) for self-assessed answers', () => {
    expect(answerXp(answer({ difficulty: 3, selfAssessed: true, score: 1 })).award).toMatchObject({ amount: 10, label: 'Self-checked' });
    expect(answerXp(answer({ difficulty: 3, selfAssessed: true, outcome: 'partial', score: 0.5 })).award?.amount).toBe(5);
    expect(answerXp(answer({ difficulty: 2, selfAssessed: true, outcome: 'partial', score: 0.5 })).award?.amount).toBe(4); // 3.75 → 4
    expect(answerXp(answer({ difficulty: 1, selfAssessed: true, score: 1 })).award?.amount).toBe(5);
  });

  it('pays nothing for a wrong first attempt, but it is still eligible (it breaks a combo)', () => {
    expect(answerXp(answer({ outcome: 'incorrect', score: 0 }))).toEqual({ eligible: true, award: null });
    expect(answerXp(answer({ selfAssessed: true, outcome: 'incorrect', score: 0 }))).toEqual({ eligible: true, award: null });
  });

  it('pays 5 for fixing a question on a later attempt, only if it never earned XP', () => {
    const later = { firstAttempt: false };
    expect(answerXp(answer({ ...later })).award).toEqual({ kind: 'answer', amount: 5, label: 'You fixed it' });
    expect(answerXp(answer({ ...later, outcome: 'incorrect', score: 0 }))).toEqual({ eligible: true, award: null });
    expect(answerXp(answer({ ...later, outcome: 'partial', score: 0.5 }))).toEqual({ eligible: true, award: null });
    // Already earned XP (first try, partial, or a review): a repeat, not eligible.
    expect(answerXp(answer({ ...later, alreadyAwarded: true }))).toEqual({ eligible: false, award: null });
    expect(answerXp(answer({ ...later, alreadyAwarded: true, outcome: 'incorrect', score: 0 }))).toEqual({ eligible: false, award: null });
  });

  it('pays a due review 10, or 5 when partly right, whatever happened before', () => {
    const due = { firstAttempt: false, alreadyAwarded: true, due: true };
    expect(answerXp(answer({ ...due })).award).toEqual({ kind: 'review', amount: 10, label: 'Review' });
    expect(answerXp(answer({ ...due, difficulty: 3 })).award?.amount).toBe(10);
    expect(answerXp(answer({ ...due, outcome: 'partial', score: 0.5 })).award).toMatchObject({ kind: 'review', amount: 5 });
    expect(answerXp(answer({ ...due, outcome: 'incorrect', score: 0 }))).toEqual({ eligible: true, award: null });
    // A due review takes precedence over the fix award (one base award per answer).
    expect(answerXp(answer({ ...due, alreadyAwarded: false })).award?.kind).toBe('review');
  });

  it('treats an early review of an awarded question as a neutral repeat', () => {
    expect(answerXp(answer({ firstAttempt: false, alreadyAwarded: true, due: false }))).toEqual({ eligible: false, award: null });
  });

  it('names review sources by question and due date', () => {
    expect(reviewSourceId('l/q', new Date('2026-10-19T09:00:00Z'))).toBe('l/q@2026-10-19T09:00:00.000Z');
  });
});

describe('combos', () => {
  it('extends on scoring correct answers and breaks on eligible wrong ones', () => {
    let c = 0;
    c = nextCombo(c, { eligible: true, awarded: true, outcome: 'correct' });
    c = nextCombo(c, { eligible: true, awarded: true, outcome: 'correct' });
    expect(c).toBe(2);
    expect(nextCombo(c, { eligible: true, awarded: false, outcome: 'incorrect' })).toBe(0);
  });

  it('ignores answers that could not score, partial answers and refused awards', () => {
    expect(nextCombo(4, { eligible: false, awarded: false, outcome: 'incorrect' })).toBe(4);
    expect(nextCombo(4, { eligible: false, awarded: false, outcome: 'correct' })).toBe(4);
    expect(nextCombo(4, { eligible: true, awarded: true, outcome: 'partial' })).toBe(4);
    // A double submission: the database already had the award, so no extension.
    expect(nextCombo(4, { eligible: true, awarded: false, outcome: 'correct' })).toBe(4);
  });

  it('expires 15 minutes after the last scoring-eligible answer', () => {
    const at = new Date('2026-10-19T10:00:00Z');
    expect(liveCombo({ combo: 4, at }, new Date(at.getTime() + COMBO_WINDOW_MS))).toBe(4);
    expect(liveCombo({ combo: 4, at }, new Date(at.getTime() + COMBO_WINDOW_MS + 1))).toBe(0);
    expect(liveCombo(null, at)).toBe(0);
    expect(liveCombo({ combo: 0, at }, at)).toBe(0);
  });

  it('pays milestones at 3, 5, 10 and every 5 after', () => {
    const paid = Array.from({ length: 31 }, (_, n) => [n, comboBonus(n)] as const).filter(([, b]) => b > 0);
    expect(paid).toEqual([
      [3, 5],
      [5, 10],
      [10, 15],
      [15, 15],
      [20, 15],
      [25, 15],
      [30, 15],
    ]);
    expect(comboAward(5)).toEqual({ kind: 'combo', amount: 10, label: 'Combo ×5' });
    expect(comboAward(4)).toBeNull();
  });
});

describe('lessons and the daily goal', () => {
  it('pays 20 for the first completion and 10 more when perfect', () => {
    expect(lessonXp({ firstCompletion: true, firstScores: [1, 0.5] })).toEqual([{ kind: 'lesson', amount: 20, label: 'Lesson finished' }]);
    expect(lessonXp({ firstCompletion: true, firstScores: [1, 1] }).map((a) => [a.kind, a.amount])).toEqual([
      ['lesson', 20],
      ['perfect', 10],
    ]);
    expect(lessonXp({ firstCompletion: false, firstScores: [1, 1] })).toEqual([]);
  });

  it('needs every question answered and right first time for a perfect lesson', () => {
    expect(isPerfectLesson([1, 1, 0.995])).toBe(true);
    expect(isPerfectLesson([1, null])).toBe(false); // skipped
    expect(isPerfectLesson([1, 0.9])).toBe(false);
    expect(isPerfectLesson([])).toBe(false); // nothing to be perfect at
  });

  it('pays the daily goal once, when reached', () => {
    expect(dailyGoalAward(49, 50, false)).toBeNull();
    expect(dailyGoalAward(50, 50, false)).toEqual({ kind: 'daily-goal', amount: 10, label: 'Daily goal reached' });
    expect(dailyGoalAward(80, 50, true)).toBeNull();
  });

  it('offers four daily goals, Regular by default', () => {
    expect(DAILY_GOALS.map((g) => `${g.xp} ${g.name}`)).toEqual(['20 Chill', '50 Regular', '100 Serious', '150 Intense']);
    expect(DEFAULT_DAILY_GOAL).toBe(50);
    expect(isDailyGoal(100)).toBe(true);
    expect(isDailyGoal(30)).toBe(false);
    expect(isDailyGoal('50')).toBe(false);
  });
});

describe('levels', () => {
  it('needs 25 × (L − 1) × L XP for level L', () => {
    expect([1, 2, 3, 4, 5, 10, 20].map(xpToReachLevel)).toEqual([0, 50, 150, 300, 500, 2250, 9500]);
  });

  it('places totals on the right level, with progress to the next', () => {
    expect(levelFor(0)).toEqual({ level: 1, title: 'Curious', xpIntoLevel: 0, xpForNextLevel: 50, progress: 0, nextTitle: { level: 5, title: 'Explorer' } });
    expect(levelFor(49)).toMatchObject({ level: 1, xpIntoLevel: 49, progress: 0.98 });
    expect(levelFor(50)).toMatchObject({ level: 2, xpIntoLevel: 0, xpForNextLevel: 100 });
    expect(levelFor(149).level).toBe(2);
    expect(levelFor(150).level).toBe(3);
    expect(levelFor(500)).toMatchObject({ level: 5, title: 'Explorer' });
    expect(levelFor(2249)).toMatchObject({ level: 9, title: 'Explorer', xpIntoLevel: 449, xpForNextLevel: 450 });
    expect(levelFor(2250)).toMatchObject({ level: 10, title: 'Problem Solver' });
    expect(levelFor(9500)).toMatchObject({ level: 20, title: "Examiner's Nightmare" });
    expect(levelFor(25 * 24 * 25)).toMatchObject({ level: 25, title: 'Legend', nextTitle: null });
  });

  it('is exact at every boundary and never goes backwards', () => {
    let prev = 1;
    for (let l = 1; l <= 200; l++) {
      expect(levelFor(xpToReachLevel(l)).level).toBe(l);
      if (l > 1) expect(levelFor(xpToReachLevel(l) - 1).level).toBe(l - 1);
    }
    for (let xp = 0; xp < 20_000; xp += 7) {
      const info = levelFor(xp);
      expect(info.level).toBeGreaterThanOrEqual(prev);
      expect(info.progress).toBeGreaterThanOrEqual(0);
      expect(info.progress).toBeLessThan(1);
      prev = info.level;
    }
  });

  it('treats odd totals as zero', () => {
    expect(levelFor(-5).level).toBe(1);
    expect(levelFor(Number.NaN).level).toBe(1);
    expect(levelFor(50.9).level).toBe(2);
  });

  it('unlocks a title every five levels', () => {
    expect([1, 4, 5, 9, 10, 14, 15, 19, 20, 24, 25, 99].map(titleFor)).toEqual([
      'Curious',
      'Curious',
      'Explorer',
      'Explorer',
      'Problem Solver',
      'Problem Solver',
      'Sharp Mind',
      'Sharp Mind',
      "Examiner's Nightmare",
      "Examiner's Nightmare",
      'Legend',
      'Legend',
    ]);
  });
});

describe('local days', () => {
  it('uses the time zone to pick the calendar day', () => {
    const late = new Date('2026-10-19T23:30:00Z');
    expect(localDay(late, 'UTC')).toBe('2026-10-19');
    expect(localDay(late, 'Asia/Karachi')).toBe('2026-10-20'); // UTC+5
    expect(localDay(late, 'America/Los_Angeles')).toBe('2026-10-19');
    expect(localDay(new Date('2026-10-19T03:00:00Z'), 'America/Los_Angeles')).toBe('2026-10-18');
    expect(localDay(new Date('2026-10-19T10:30:00Z'), 'Pacific/Kiritimati')).toBe('2026-10-20'); // UTC+14
    expect(localDay(new Date('2026-10-19T10:30:00Z'), 'Pacific/Pago_Pago')).toBe('2026-10-18'); // UTC−11
    expect(localDay(new Date('2026-10-19T18:29:59Z'), 'Asia/Kolkata')).toBe('2026-10-19'); // UTC+5:30
    expect(localDay(new Date('2026-10-19T18:30:00Z'), 'Asia/Kolkata')).toBe('2026-10-20');
  });

  it('follows daylight saving time changes', () => {
    // New York: EST (UTC−5) until 2026-03-08 02:00, then EDT (UTC−4).
    expect(localDay(new Date('2026-03-08T04:59:59Z'), 'America/New_York')).toBe('2026-03-07');
    expect(localDay(new Date('2026-03-08T05:00:00Z'), 'America/New_York')).toBe('2026-03-08');
    expect(localDay(new Date('2026-03-09T03:59:59Z'), 'America/New_York')).toBe('2026-03-08');
    expect(localDay(new Date('2026-03-09T04:00:00Z'), 'America/New_York')).toBe('2026-03-09');
    // London: BST (UTC+1) until 2026-10-25 02:00, then GMT.
    expect(localDay(new Date('2026-10-24T22:59:59Z'), 'Europe/London')).toBe('2026-10-24');
    expect(localDay(new Date('2026-10-24T23:00:00Z'), 'Europe/London')).toBe('2026-10-25');
    expect(localDay(new Date('2026-10-25T23:59:59Z'), 'Europe/London')).toBe('2026-10-25');
    expect(localDay(new Date('2026-10-26T00:00:00Z'), 'Europe/London')).toBe('2026-10-26');
    // Sydney: AEDT (UTC+11) starts 2026-10-04.
    expect(localDay(new Date('2026-10-03T13:59:59Z'), 'Australia/Sydney')).toBe('2026-10-03');
    expect(localDay(new Date('2026-10-04T12:59:59Z'), 'Australia/Sydney')).toBe('2026-10-04');
    expect(localDay(new Date('2026-10-04T13:00:00Z'), 'Australia/Sydney')).toBe('2026-10-05');
  });

  it('falls back to UTC for an unknown zone', () => {
    expect(localDay(new Date('2026-10-19T23:30:00Z'), 'Mars/Olympus_Mons')).toBe('2026-10-19');
  });

  it('accepts only IANA zone names, in canonical form', () => {
    expect(canonicalTimeZone('Europe/London')).toBe('Europe/London');
    expect(canonicalTimeZone('europe/london')).toBe('Europe/London');
    expect(canonicalTimeZone('UTC')).toBe('UTC');
    // Three-part names are accepted (ICU may spell the canonical form differently, e.g. America/Buenos_Aires).
    expect(isValidTimeZone(canonicalTimeZone('America/Argentina/Buenos_Aires'))).toBe(true);
    expect(isValidTimeZone('Etc/GMT+5')).toBe(true);
    for (const bad of ['Mars/Olympus_Mons', '+05:30', '-0800', '', 'Europe/London; drop table', 'a'.repeat(80), 42, null, undefined]) {
      expect(canonicalTimeZone(bad)).toBeNull();
    }
  });

  it('does calendar arithmetic across months, years and leap days', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    // No DST surprises: day arithmetic is calendar-based.
    expect(addDays('2026-03-07', 2)).toBe('2026-03-09');
    expect(daysBetween('2026-10-01', '2026-10-19')).toBe(18);
    expect(lastDays('2026-10-02', 4)).toEqual(['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
    expect(isLocalDay('2026-02-29')).toBe(false);
    expect(isLocalDay('2028-02-29')).toBe(true);
    expect(isLocalDay('2026-1-01')).toBe(false);
  });
});

describe('streaks', () => {
  const today = '2026-10-19';
  /** `n` consecutive days ending `endOffset` days before today. */
  const run = (n: number, endOffset = 0) => Array.from({ length: n }, (_, i) => addDays(today, -endOffset - (n - 1 - i)));

  it('is empty with no activity', () => {
    expect(computeStreak([], today)).toEqual({ current: 0, longest: 0, freezesBanked: 0, frozenDays: [], activeToday: false, alive: false });
  });

  it('counts consecutive streak days ending today', () => {
    expect(computeStreak(run(4), today)).toEqual({ current: 4, longest: 4, freezesBanked: 0, frozenDays: [], activeToday: true, alive: true });
  });

  it('stays alive when today has no activity yet but yesterday did', () => {
    expect(computeStreak(run(6, 1), today)).toMatchObject({ current: 6, activeToday: false, alive: true, frozenDays: [] });
  });

  it('breaks after a missed day without a freeze', () => {
    const days = [...run(3, 5), ...run(2)]; // three days, a gap of three, then two
    expect(computeStreak(days, today)).toMatchObject({ current: 2, longest: 3, alive: true });
    // Single-day gap, no freeze banked.
    const single = ['2026-10-15', '2026-10-16', '2026-10-18', '2026-10-19'];
    expect(computeStreak(single, today)).toMatchObject({ current: 2, longest: 2, frozenDays: [] });
    // Last streak day two days ago, nothing banked: broken, not alive.
    expect(computeStreak(run(3, 2), today)).toMatchObject({ current: 0, longest: 3, alive: false, activeToday: false });
  });

  it('earns a freeze every 7 consecutive days and uses it for a single missed day', () => {
    const seven = run(7, 2); // ends the day before yesterday
    expect(computeStreak(seven, addDays(today, -2))).toMatchObject({ current: 7, freezesBanked: 1 });
    // Yesterday missed, today active: the freeze covers yesterday.
    expect(computeStreak([...seven, today], today)).toEqual({
      current: 8,
      longest: 8,
      freezesBanked: 0,
      frozenDays: [addDays(today, -1)],
      activeToday: true,
      alive: true,
    });
  });

  it('uses a freeze for a missed yesterday while today is still open', () => {
    expect(computeStreak(run(7, 2), today)).toMatchObject({ current: 7, alive: true, activeToday: false, freezesBanked: 0, frozenDays: [addDays(today, -1)] });
  });

  it('covers a two-day gap only with two freezes', () => {
    // 7 days (1 freeze), then a two-day gap: broken, and the freeze is kept.
    const one = [...run(7, 3)];
    expect(computeStreak([...one, today], today)).toMatchObject({ current: 1, longest: 7, freezesBanked: 1, frozenDays: [] });
    // 14 days (2 freezes), then a two-day gap: covered.
    const two = [...run(14, 3)];
    expect(computeStreak([...two, today], today)).toMatchObject({
      current: 15,
      freezesBanked: 0,
      frozenDays: [addDays(today, -2), addDays(today, -1)],
    });
  });

  it('banks at most 2 freezes', () => {
    expect(computeStreak(run(21), today)).toMatchObject({ current: 21, freezesBanked: MAX_FREEZES });
    expect(computeStreak(run(35), today).freezesBanked).toBe(2);
    // With 2 banked, a three-day gap still breaks the streak.
    expect(computeStreak([...run(21, 4), today], today)).toMatchObject({ current: 1, longest: 21, freezesBanked: 2 });
  });

  it('restarts the run that earns freezes after a frozen day', () => {
    // 7 days → freeze; a frozen day; then 6 more days: no new freeze yet.
    const days = [...run(6), ...run(7, 7)];
    const s = computeStreak(days, today);
    expect(s).toMatchObject({ current: 13, freezesBanked: 0, frozenDays: [addDays(today, -6)] });
    // Seven consecutive days after the frozen day earn the next one.
    expect(computeStreak([...run(7, 8), ...run(7)], today)).toMatchObject({ current: 14, freezesBanked: 1, frozenDays: [addDays(today, -7)] });
  });

  it('keeps the longest streak across breaks', () => {
    const days = [...run(10, 20), ...run(3)];
    expect(computeStreak(days, today)).toMatchObject({ current: 3, longest: 10 });
  });

  it('ignores duplicates, order, malformed and future days', () => {
    const days = [today, addDays(today, -1), today, 'not-a-day', addDays(today, 2), addDays(today, -2)];
    expect(computeStreak(days, today)).toMatchObject({ current: 3, longest: 3, activeToday: true });
  });

  it('works across a DST change because days are calendar dates', () => {
    // Activity at 23:30 local in New York each evening across the March change.
    const instants = ['2026-03-07T04:30:00Z', '2026-03-08T04:30:00Z', '2026-03-09T03:30:00Z', '2026-03-10T03:30:00Z'];
    const days = instants.map((i) => localDay(new Date(i), 'America/New_York'));
    expect(days).toEqual(['2026-03-06', '2026-03-07', '2026-03-08', '2026-03-09']);
    expect(computeStreak(days, '2026-03-09')).toMatchObject({ current: 4, activeToday: true });
  });

  it('respects day boundaries in the student’s time zone', () => {
    // Two answers 2 hours apart: different UTC days, the same day in Los Angeles.
    const a = localDay(new Date('2026-10-19T23:00:00Z'), 'America/Los_Angeles');
    const b = localDay(new Date('2026-10-20T01:00:00Z'), 'America/Los_Angeles');
    expect(a).toBe(b);
    expect(computeStreak([a, b], a)).toMatchObject({ current: 1 });
    // In Karachi the same two instants are on consecutive days.
    const c = localDay(new Date('2026-10-19T18:00:00Z'), 'Asia/Karachi');
    const d = localDay(new Date('2026-10-19T20:00:00Z'), 'Asia/Karachi');
    expect(daysBetween(c, d)).toBe(1);
  });
});

describe('badges', () => {
  const zero: BadgeStats = {
    correctAnswers: 0,
    lessonsFinished: 0,
    perfectLessons: 0,
    bestCombo: 0,
    longestStreak: 0,
    dueReviewsCorrect: 0,
    goalDays: 0,
    subjectsWithFinishedLessons: 0,
    totalXp: 0,
  };

  it('has the catalogue from the spec, with unique ids and icons', () => {
    expect(BADGES.map((b) => b.name)).toEqual([
      'First Spark',
      'Off the Blocks',
      'Flawless',
      'Combo ×5',
      'Combo ×10',
      'On a Roll',
      'Week Warrior',
      'Unstoppable',
      'Ten Down',
      'Half Century',
      'Memory Keeper',
      'Goal Getter',
      'Explorer',
      '500 Club',
      '2.5K Club',
    ]);
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
    expect(new Set(BADGES.map((b) => b.icon)).size).toBe(BADGES.length);
    for (const b of BADGES) expect(b.description && b.howToEarn).toBeTruthy();
  });

  it('earns nothing from nothing', () => {
    expect(evaluateBadges(zero, [])).toEqual([]);
  });

  it('earns each badge at its threshold', () => {
    const cases: Array<[Partial<BadgeStats>, string[]]> = [
      [{ correctAnswers: 1 }, ['first-spark']],
      [{ lessonsFinished: 1 }, ['off-the-blocks']],
      [{ perfectLessons: 1 }, ['flawless']],
      [{ bestCombo: 4 }, []],
      [{ bestCombo: 5 }, ['combo-5']],
      [{ bestCombo: 10 }, ['combo-5', 'combo-10']],
      [{ longestStreak: 2 }, []],
      [{ longestStreak: 3 }, ['on-a-roll']],
      [{ longestStreak: 7 }, ['on-a-roll', 'week-warrior']],
      [{ longestStreak: 30 }, ['on-a-roll', 'week-warrior', 'unstoppable']],
      [{ lessonsFinished: 10 }, ['off-the-blocks', 'ten-down']],
      [{ lessonsFinished: 50 }, ['off-the-blocks', 'ten-down', 'half-century']],
      [{ dueReviewsCorrect: 24 }, []],
      [{ dueReviewsCorrect: 25 }, ['memory-keeper']],
      [{ goalDays: 5 }, ['goal-getter']],
      [{ subjectsWithFinishedLessons: 1 }, []],
      [{ subjectsWithFinishedLessons: 2 }, ['explorer']],
      [{ totalXp: 499 }, []],
      [{ totalXp: 500 }, ['club-500']],
      [{ totalXp: 2500 }, ['club-500', 'club-2500']],
    ];
    for (const [stats, expected] of cases) expect(evaluateBadges({ ...zero, ...stats }, [])).toEqual(expected);
  });

  it('returns only newly earned badges', () => {
    const stats = { ...zero, correctAnswers: 3, lessonsFinished: 10 };
    expect(evaluateBadges(stats, ['first-spark', 'off-the-blocks'])).toEqual(['ten-down']);
    expect(evaluateBadges(stats, new Set(['first-spark', 'off-the-blocks', 'ten-down']))).toEqual([]);
  });

  it('reports progress towards locked badges', () => {
    const tenDown = getBadge('ten-down')!;
    expect(badgeProgress(tenDown, { ...zero, lessonsFinished: 3 })).toEqual({ current: 3, target: 10 });
    expect(badgeProgress(tenDown, { ...zero, lessonsFinished: 30 })).toEqual({ current: 10, target: 10 });
    expect(getBadge('no-such-badge')).toBeUndefined();
  });
});
