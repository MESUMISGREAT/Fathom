/**
 * Spaced repetition with Leitner boxes. Each answered question lives in a
 * box; a correct answer moves it up a box (longer gap), a wrong answer back
 * to box 1. Simple, predictable and easy to explain, which matters more here
 * than the last few percent of efficiency from SM-2/FSRS-style schedulers.
 */

/** Days until the next review for each box (index = box - 1). */
export const BOX_INTERVAL_DAYS = [1, 3, 7, 16, 35] as const;
export const MAX_BOX = BOX_INTERVAL_DAYS.length;

export interface ReviewState {
  box: number;
  dueAt: Date;
  lapses: number;
  lastReviewedAt: Date;
}

const DAY = 86_400_000;

/**
 * Next review state after an answer. `score` >= 0.99 counts as correct;
 * partial credit keeps the item where it is.
 * Answers given before an item is due (e.g. re-doing a lesson) don't move it
 * up, so cramming can't skip the spacing; they can still move it down.
 */
export function nextReview(prev: ReviewState | null, score: number, now: Date): ReviewState {
  const correct = score >= 0.99;
  const partial = !correct && score >= 0.5;
  if (!prev) {
    const box = correct ? 2 : 1;
    return { box, dueAt: new Date(now.getTime() + BOX_INTERVAL_DAYS[box - 1]! * DAY), lapses: correct ? 0 : 1, lastReviewedAt: now };
  }
  const early = now.getTime() < prev.dueAt.getTime();
  let box = prev.box;
  let lapses = prev.lapses;
  if (correct) {
    if (early) return { ...prev, lastReviewedAt: now };
    box = Math.min(MAX_BOX, prev.box + 1);
  } else if (partial) {
    box = prev.box;
  } else {
    box = 1;
    lapses++;
  }
  return { box, dueAt: new Date(now.getTime() + BOX_INTERVAL_DAYS[box - 1]! * DAY), lapses, lastReviewedAt: now };
}

/** Items more than `days` past due. */
export function isOverdue(dueAt: Date, now: Date, days: number): boolean {
  return now.getTime() - dueAt.getTime() > days * DAY;
}
