/**
 * "What should I do next?" Deterministic and explainable: every
 * recommendation carries the reason shown to the student.
 */

export interface LessonCandidate {
  id: string;
  href: string;
  title: string;
  subjectName: string;
  topicTitle: string;
  minutes: number;
  /** Position in the syllabus order for its subject. */
  order: number;
  status: 'not-started' | 'in-progress' | 'completed';
  lastViewedAt: Date | null;
  prerequisites: string[];
  /** Subject's last activity, used to prefer the subject the student is working on. */
  subjectLastActive: Date | null;
}

export interface RevisitCandidate {
  lessonId: string;
  href: string;
  title: string;
  objectiveCode: string;
}

export type NextStep =
  | { kind: 'review'; count: number; href: string; reason: string }
  | { kind: 'resume'; lesson: LessonCandidate; reason: string }
  | { kind: 'revisit'; lesson: RevisitCandidate; reason: string }
  | { kind: 'start'; lesson: LessonCandidate; reason: string }
  | { kind: 'choose-subject'; reason: string }
  | { kind: 'all-done'; reason: string };

/** Above this many due reviews, reviewing comes before new material. */
export const REVIEW_FIRST_AT = 5;

export function recommendNext(input: {
  enrolledCount: number;
  dueReviews: number;
  lessons: LessonCandidate[];
  revisit: RevisitCandidate[];
}): NextStep {
  const { lessons, dueReviews } = input;
  if (input.enrolledCount === 0) return { kind: 'choose-subject', reason: 'Pick a subject to get a study path.' };

  if (dueReviews >= REVIEW_FIRST_AT) {
    return { kind: 'review', count: dueReviews, href: '/review', reason: `${dueReviews} questions are due for review. A quick round now helps them stick.` };
  }

  const inProgress = lessons
    .filter((l) => l.status === 'in-progress')
    .sort((a, b) => (b.lastViewedAt?.getTime() ?? 0) - (a.lastViewedAt?.getTime() ?? 0))[0];
  if (inProgress) return { kind: 'resume', lesson: inProgress, reason: 'Pick up where you left off.' };

  const revisit = input.revisit[0];
  if (revisit) {
    return { kind: 'revisit', lesson: revisit, reason: `Recent answers on ${revisit.objectiveCode} suggest another look would help.` };
  }

  const completed = new Set(lessons.filter((l) => l.status === 'completed').map((l) => l.id));
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const next = [...lessons]
    .filter((l) => l.status === 'not-started')
    .sort(
      (a, b) =>
        (b.subjectLastActive?.getTime() ?? 0) - (a.subjectLastActive?.getTime() ?? 0) ||
        a.subjectName.localeCompare(b.subjectName) ||
        a.order - b.order,
    )[0];
  if (next) {
    const missing = next.prerequisites.map((p) => byId.get(p)).find((p) => p && !completed.has(p.id));
    if (missing) return { kind: 'start', lesson: missing, reason: `"${next.title}" builds on this, so start here.` };
    return { kind: 'start', lesson: next, reason: completed.size ? 'Next in your syllabus.' : 'A good first lesson.' };
  }

  if (dueReviews > 0) return { kind: 'review', count: dueReviews, href: '/review', reason: `${dueReviews} question${dueReviews === 1 ? ' is' : 's are'} due for review.` };
  return { kind: 'all-done', reason: "You've finished every lesson available so far. More are on the way." };
}
