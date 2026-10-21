/**
 * Mastery states per syllabus objective, computed from evidence. Pure and
 * deterministic so the rules can be tested and explained to students
 * (see /about/progress, which renders MASTERY_RULES).
 *
 * Principles:
 * - One correct answer is never enough: "secure" needs several different
 *   questions answered correctly, on at least two different days.
 * - Retrying straight after seeing the answer is weak evidence.
 * - Self-marked answers count for half.
 * - Knowledge fades: secure objectives that haven't been seen for a while,
 *   or whose reviews are well overdue, become "needs revision".
 */

export type MasteryState = 'not-started' | 'learning' | 'practising' | 'secure' | 'needs-revision';

export const MASTERY_LABEL: Record<MasteryState, string> = {
  'not-started': 'Not started',
  learning: 'Learning',
  practising: 'Practising',
  secure: 'Secure',
  'needs-revision': 'Needs revision',
};

export interface AttemptEvidence {
  questionId: string;
  /** 0..1 */
  score: number;
  selfAssessed: boolean;
  at: Date;
}

export interface ObjectiveEvidence {
  lessonOpened: boolean;
  lessonCompleted: boolean;
  attempts: AttemptEvidence[];
  /** Review items for this objective's questions that are more than OVERDUE_DAYS late. */
  overdueReviews: number;
}

export interface MasteryResult {
  state: MasteryState;
  /** Weighted evidence points toward "secure". */
  points: number;
  correctDays: number;
  /** Weighted accuracy over the most recent attempts, null if none. */
  recentAccuracy: number | null;
  attempts: number;
  lastActivity: Date | null;
}

export const RULES = {
  secureMinPoints: 3,
  secureMinDays: 2,
  secureMinRecentAccuracy: 0.8,
  recentWindow: 8,
  retryWindowMinutes: 10,
  staleAfterDays: 45,
  overdueDays: 7,
  slippingBelowAccuracy: 0.6,
  strugglingBelowAccuracy: 0.5,
  /** A spaced repeat on another day can add at most this many points per question. */
  maxDaysPerQuestion: 2,
};

export const MASTERY_RULES: Array<{ state: MasteryState; rule: string }> = [
  { state: 'not-started', rule: "You haven't opened a lesson or answered a question for this objective yet." },
  { state: 'learning', rule: "You've started, but there isn't enough correct evidence yet, or recent answers have mostly been wrong." },
  { state: 'practising', rule: "You're getting questions right. To be secure, you need several different questions right, on at least two different days." },
  {
    state: 'secure',
    rule: `At least ${RULES.secureMinPoints} points of evidence (one per different question answered fully correctly, plus one more if you got it right again on a later day), correct answers on ${RULES.secureMinDays}+ different days, and ${Math.round(RULES.secureMinRecentAccuracy * 100)}%+ accuracy on your last ${RULES.recentWindow} answers. Self-marked answers count for half, and a retry straight after seeing the answer counts for half.`,
  },
  {
    state: 'needs-revision',
    rule: `You showed you knew this before, but your recent answers have slipped below ${Math.round(RULES.slippingBelowAccuracy * 100)}%, you haven't answered a question on it for ${RULES.staleAfterDays} days, or its reviews are over ${RULES.overdueDays} days overdue.`,
  },
];

const DAY = 86_400_000;
const dayKey = (d: Date) => Math.floor(d.getTime() / DAY);

export function computeMastery(ev: ObjectiveEvidence, now: Date): MasteryResult {
  const attempts = [...ev.attempts].sort((a, b) => a.at.getTime() - b.at.getTime());
  const lastActivity = attempts.at(-1)?.at ?? null;
  if (attempts.length === 0) {
    return {
      state: ev.lessonOpened || ev.lessonCompleted ? 'learning' : 'not-started',
      points: 0,
      correctDays: 0,
      recentAccuracy: null,
      attempts: 0,
      lastActivity,
    };
  }

  // Weight each attempt: self-marked x0.5; a retry within minutes of a wrong answer x0.5.
  const lastWrongAt = new Map<string, number>();
  const weighted = attempts.map((a) => {
    let w = a.selfAssessed ? 0.5 : 1;
    const wrongAt = lastWrongAt.get(a.questionId);
    if (wrongAt !== undefined && a.at.getTime() - wrongAt < RULES.retryWindowMinutes * 60_000) w *= 0.5;
    if (a.score < 0.99) lastWrongAt.set(a.questionId, a.at.getTime());
    return { ...a, w };
  });

  // Evidence points: for each question whose latest attempt is fully correct,
  // count the distinct days it was answered fully correctly (capped), weighted.
  const byQuestion = new Map<string, typeof weighted>();
  for (const a of weighted) byQuestion.set(a.questionId, [...(byQuestion.get(a.questionId) ?? []), a]);
  let points = 0;
  for (const list of byQuestion.values()) {
    const latest = list.at(-1)!;
    if (latest.score < 0.99) continue;
    const days = new Map<number, number>();
    for (const a of list) if (a.score >= 0.99) days.set(dayKey(a.at), Math.max(days.get(dayKey(a.at)) ?? 0, a.w));
    const best = [...days.values()].sort((x, y) => y - x).slice(0, RULES.maxDaysPerQuestion);
    points += best.reduce((s, w) => s + w, 0);
  }

  const correctDays = new Set(weighted.filter((a) => a.score >= 0.99).map((a) => dayKey(a.at))).size;
  const recent = weighted.slice(-RULES.recentWindow);
  const wsum = recent.reduce((s, a) => s + a.w, 0);
  const recentAccuracy = wsum > 0 ? recent.reduce((s, a) => s + a.w * a.score, 0) / wsum : null;
  const distinctCorrectEver = new Set(weighted.filter((a) => a.score >= 0.99).map((a) => a.questionId)).size;
  const lastCorrect = [...weighted].reverse().find((a) => a.score >= 0.99)?.at ?? null;

  const demonstrated = correctDays >= RULES.secureMinDays && distinctCorrectEver >= 2;
  const stale = lastCorrect !== null && now.getTime() - lastCorrect.getTime() > RULES.staleAfterDays * DAY;
  const slipping = recentAccuracy !== null && recentAccuracy < RULES.slippingBelowAccuracy;
  const base = { points, correctDays, recentAccuracy, attempts: attempts.length, lastActivity };

  if (demonstrated && (slipping || stale || ev.overdueReviews > 0)) return { ...base, state: 'needs-revision' };
  if (
    points >= RULES.secureMinPoints &&
    correctDays >= RULES.secureMinDays &&
    recentAccuracy !== null &&
    recentAccuracy >= RULES.secureMinRecentAccuracy
  ) {
    return { ...base, state: 'secure' };
  }
  if (recentAccuracy !== null && recentAccuracy < RULES.strugglingBelowAccuracy) return { ...base, state: 'learning' };
  return { ...base, state: 'practising' };
}

/**
 * Topic (or any group) state from its objectives' states. Callers pass every
 * objective in the topic, including ones with no learning material yet
 * (they are 'not-started'), so 'secure' means every objective is Secure.
 */
export function aggregateState(states: MasteryState[]): MasteryState {
  if (states.length === 0 || states.every((s) => s === 'not-started')) return 'not-started';
  if (states.includes('needs-revision')) return 'needs-revision';
  if (states.every((s) => s === 'secure')) return 'secure';
  if (states.some((s) => s === 'practising' || s === 'secure')) return 'practising';
  return 'learning';
}

/** True when an objective's recent answers suggest the student should go back to the lesson. */
export function shouldRevisit(m: MasteryResult): boolean {
  return m.state === 'needs-revision' || (m.state === 'learning' && m.attempts >= 2 && (m.recentAccuracy ?? 1) < RULES.strugglingBelowAccuracy);
}
