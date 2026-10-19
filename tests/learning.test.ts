import { describe, expect, it } from 'vitest';
import { aggregateState, computeMastery, shouldRevisit, type AttemptEvidence } from '@/domain/mastery';
import { BOX_INTERVAL_DAYS, nextReview } from '@/domain/schedule';
import { recommendNext, type LessonCandidate } from '@/domain/recommend';

const DAY = 86_400_000;
const t0 = new Date('2026-09-01T10:00:00Z');
const at = (days: number, minutes = 0) => new Date(t0.getTime() + days * DAY + minutes * 60_000);
const a = (questionId: string, score: number, when: Date, selfAssessed = false): AttemptEvidence => ({ questionId, score, selfAssessed, at: when });
const ev = (attempts: AttemptEvidence[], extra: Partial<{ lessonOpened: boolean; overdueReviews: number }> = {}) => ({
  lessonOpened: true,
  lessonCompleted: false,
  overdueReviews: 0,
  attempts,
  ...extra,
});

describe('computeMastery', () => {
  it('starts at not-started, then learning once a lesson is opened', () => {
    expect(computeMastery(ev([], { lessonOpened: false }), t0).state).toBe('not-started');
    expect(computeMastery(ev([]), t0).state).toBe('learning');
  });

  it('never treats a single correct answer as secure', () => {
    expect(computeMastery(ev([a('q1', 1, at(0))]), at(0)).state).toBe('practising');
  });

  it('needs several questions on two different days for secure', () => {
    const sameDay = [a('q1', 1, at(0)), a('q2', 1, at(0, 2)), a('q3', 1, at(0, 4))];
    expect(computeMastery(ev(sameDay), at(0, 5)).state).toBe('practising');
    const spaced = [...sameDay, a('q1', 1, at(3))];
    expect(computeMastery(ev(spaced), at(3, 1))).toMatchObject({ state: 'secure', correctDays: 2 });
  });

  it('counts self-assessed answers and quick retries for half', () => {
    const selfOnly = [a('q1', 1, at(0), true), a('q2', 1, at(0), true), a('q3', 1, at(3), true), a('q1', 1, at(3), true)];
    expect(computeMastery(ev(selfOnly), at(3)).points).toBe(2);
    const retry = [a('q1', 0, at(0)), a('q1', 1, at(0, 1))];
    expect(computeMastery(ev(retry), at(0, 2)).points).toBe(0.5);
  });

  it('flags previously demonstrated knowledge that is slipping, stale or overdue', () => {
    const secure = [a('q1', 1, at(0)), a('q2', 1, at(0)), a('q3', 1, at(0)), a('q1', 1, at(3))];
    expect(computeMastery(ev(secure), at(60)).state).toBe('needs-revision');
    expect(computeMastery(ev(secure, { overdueReviews: 1 }), at(4)).state).toBe('needs-revision');
    const slipping = [...secure, a('q2', 0, at(5)), a('q3', 0, at(5)), a('q1', 0, at(5)), a('q2', 0, at(6))];
    const m = computeMastery(ev(slipping), at(6));
    expect(m.state).toBe('needs-revision');
    expect(shouldRevisit(m)).toBe(true);
  });

  it('keeps a struggling student in learning, not practising', () => {
    const m = computeMastery(ev([a('q1', 0, at(0)), a('q2', 0, at(0, 30)), a('q3', 1, at(0, 60))]), at(1));
    expect(m.state).toBe('learning');
    expect(shouldRevisit(m)).toBe(true);
  });
});

describe('aggregateState', () => {
  it('combines objective states into a topic state', () => {
    expect(aggregateState([])).toBe('not-started');
    expect(aggregateState(['not-started', 'not-started'])).toBe('not-started');
    expect(aggregateState(['secure', 'secure'])).toBe('secure');
    expect(aggregateState(['secure', 'learning'])).toBe('practising');
    expect(aggregateState(['learning', 'not-started'])).toBe('learning');
    expect(aggregateState(['secure', 'needs-revision'])).toBe('needs-revision');
  });
});

describe('nextReview (Leitner)', () => {
  it('places new items by first answer and climbs on correct reviews', () => {
    const first = nextReview(null, 1, t0);
    expect(first.box).toBe(2);
    expect(first.dueAt.getTime() - t0.getTime()).toBe(BOX_INTERVAL_DAYS[1] * DAY);
    const second = nextReview(first, 1, first.dueAt);
    expect(second.box).toBe(3);
  });

  it('drops to box 1 on a wrong answer and records the lapse', () => {
    const r = nextReview({ box: 4, dueAt: t0, lapses: 0, lastReviewedAt: t0 }, 0, at(1));
    expect(r).toMatchObject({ box: 1, lapses: 1 });
  });

  it('does not promote answers given before the item is due', () => {
    const first = nextReview(null, 0, t0);
    const retry = nextReview(first, 1, at(0, 1));
    expect(retry.box).toBe(1);
    expect(retry.dueAt).toEqual(first.dueAt);
  });
});

describe('recommendNext', () => {
  const lesson = (id: string, order: number, status: LessonCandidate['status'], extra: Partial<LessonCandidate> = {}): LessonCandidate => ({
    id,
    href: `/l/${id}`,
    title: id,
    subjectName: 'Maths',
    topicTitle: 'Quadratics',
    minutes: 4,
    order,
    status,
    lastViewedAt: null,
    prerequisites: [],
    subjectLastActive: null,
    ...extra,
  });

  it('asks for a subject first', () => {
    expect(recommendNext({ enrolledCount: 0, dueReviews: 0, lessons: [], revisit: [] }).kind).toBe('choose-subject');
  });

  it('prefers a pile of due reviews, then resuming, then revisiting, then the next lesson', () => {
    const lessons = [lesson('a', 1, 'completed'), lesson('b', 2, 'in-progress'), lesson('c', 3, 'not-started')];
    expect(recommendNext({ enrolledCount: 1, dueReviews: 6, lessons, revisit: [] }).kind).toBe('review');
    expect(recommendNext({ enrolledCount: 1, dueReviews: 1, lessons, revisit: [] }).kind).toBe('resume');
    const revisit = [{ lessonId: 'a', href: '/l/a', title: 'a', objectiveCode: '1.1.1' }];
    const noResume = lessons.map((l) => (l.id === 'b' ? { ...l, status: 'completed' as const } : l));
    expect(recommendNext({ enrolledCount: 1, dueReviews: 1, lessons: noResume, revisit }).kind).toBe('revisit');
    const next = recommendNext({ enrolledCount: 1, dueReviews: 1, lessons: noResume, revisit: [] });
    expect(next).toMatchObject({ kind: 'start', lesson: { id: 'c' } });
  });

  it('sends the student to an unfinished prerequisite first', () => {
    const lessons = [lesson('basics', 5, 'not-started'), lesson('advanced', 1, 'not-started', { prerequisites: ['basics'] })];
    expect(recommendNext({ enrolledCount: 1, dueReviews: 0, lessons, revisit: [] })).toMatchObject({ kind: 'start', lesson: { id: 'basics' } });
  });
});
