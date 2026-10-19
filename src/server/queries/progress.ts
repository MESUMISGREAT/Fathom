/**
 * Student progress for one syllabus version: lesson statuses, objective
 * mastery (from src/domain/mastery) and topic roll-ups. Computed on read from
 * attempts; Phase 2 can cache this in a table once attempt volume grows.
 */
import 'server-only';
import { cache } from 'react';
import { and, eq, inArray, isNull, lt } from 'drizzle-orm';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';
import { aggregateState, computeMastery, RULES, type AttemptEvidence, type MasteryResult, type MasteryState } from '@/domain/mastery';
import { getSyllabusTree } from './catalog';

export interface LessonStatus {
  status: 'not-started' | 'in-progress' | 'completed';
  stepReached: number;
  stepCount: number;
  lastViewedAt: Date | null;
  completedAt: Date | null;
}

export interface ObjectiveProgress {
  id: string;
  code: string;
  topicId: string;
  level: 'AS' | 'A';
  lessonIds: string[];
  questionCount: number;
  /** A completed lesson teaches this objective. */
  studied: boolean;
  mastery: MasteryResult;
}

export interface TopicProgress {
  state: MasteryState;
  objectives: number;
  withContent: number;
  studied: number;
  secure: number;
}

export interface ProgressSummary {
  objectives: number;
  withContent: number;
  studied: number;
  practised: number;
  secure: number;
  needsRevision: number;
  lessonsCompleted: number;
  lessonsTotal: number;
}

export interface SubjectProgress {
  objectives: Map<string, ObjectiveProgress>;
  topics: Map<string, TopicProgress>;
  lessons: Map<string, LessonStatus>;
  summary: ProgressSummary;
  lastActive: Date | null;
}

const NOT_STARTED: LessonStatus = { status: 'not-started', stepReached: 0, stepCount: 0, lastViewedAt: null, completedAt: null };

export const getSubjectProgress = cache(async (userId: string | null, versionId: string, scope: 'AS' | 'A' = 'A'): Promise<SubjectProgress> => {
  const db = await getDb();
  const tree = await getSyllabusTree(versionId);
  const now = new Date();

  const [lessonObjs, questionObjs] = await Promise.all([
    db
      .select({ lessonId: t.lessonObjectives.lessonId, objectiveId: t.lessonObjectives.objectiveId })
      .from(t.lessonObjectives)
      .innerJoin(t.lessons, eq(t.lessons.id, t.lessonObjectives.lessonId))
      .where(and(eq(t.lessons.versionId, versionId), isNull(t.lessons.archivedAt), eq(t.lessons.kind, 'core'))),
    db
      .select({ questionId: t.questionObjectives.questionId, objectiveId: t.questionObjectives.objectiveId })
      .from(t.questionObjectives)
      .innerJoin(t.questions, eq(t.questions.id, t.questionObjectives.questionId))
      .where(and(eq(t.questions.versionId, versionId), isNull(t.questions.archivedAt))),
  ]);

  const lessonIds = [...new Set(tree.flatMap((s) => s.topics.flatMap((tp) => tp.lessons.map((l) => l.id))))];
  const questionIds = [...new Set(questionObjs.map((q) => q.questionId))];

  const [progressRows, attemptRows, overdueRows] = userId
    ? await Promise.all([
        lessonIds.length
          ? db.select().from(t.lessonProgress).where(and(eq(t.lessonProgress.userId, userId), inArray(t.lessonProgress.lessonId, lessonIds)))
          : Promise.resolve([]),
        questionIds.length
          ? db
              .select({ questionId: t.attempts.questionId, score: t.attempts.score, selfAssessed: t.attempts.selfAssessed, at: t.attempts.createdAt })
              .from(t.attempts)
              .where(and(eq(t.attempts.userId, userId), inArray(t.attempts.questionId, questionIds)))
          : Promise.resolve([]),
        questionIds.length
          ? db
              .select({ questionId: t.reviewItems.questionId })
              .from(t.reviewItems)
              .where(
                and(
                  eq(t.reviewItems.userId, userId),
                  inArray(t.reviewItems.questionId, questionIds),
                  lt(t.reviewItems.dueAt, new Date(now.getTime() - RULES.overdueDays * 86_400_000)),
                ),
              )
          : Promise.resolve([]),
      ])
    : [[], [], []];

  const lessons = new Map<string, LessonStatus>();
  for (const id of lessonIds) lessons.set(id, NOT_STARTED);
  for (const p of progressRows) {
    lessons.set(p.lessonId, {
      status: p.completedAt ? 'completed' : 'in-progress',
      stepReached: p.stepReached,
      stepCount: p.stepCount,
      lastViewedAt: p.lastViewedAt,
      completedAt: p.completedAt,
    });
  }

  const lessonsByObjective = new Map<string, string[]>();
  for (const r of lessonObjs) lessonsByObjective.set(r.objectiveId, [...(lessonsByObjective.get(r.objectiveId) ?? []), r.lessonId]);
  const questionsByObjective = new Map<string, Set<string>>();
  for (const r of questionObjs) {
    const set = questionsByObjective.get(r.objectiveId) ?? new Set<string>();
    set.add(r.questionId);
    questionsByObjective.set(r.objectiveId, set);
  }
  const attemptsByQuestion = new Map<string, AttemptEvidence[]>();
  for (const a of attemptRows) attemptsByQuestion.set(a.questionId, [...(attemptsByQuestion.get(a.questionId) ?? []), a]);
  const overdue = new Set(overdueRows.map((r) => r.questionId));

  const objectives = new Map<string, ObjectiveProgress>();
  const topics = new Map<string, TopicProgress>();
  const summary: ProgressSummary = { objectives: 0, withContent: 0, studied: 0, practised: 0, secure: 0, needsRevision: 0, lessonsCompleted: 0, lessonsTotal: 0 };
  let lastActive: Date | null = null;

  for (const section of tree) {
    const inScope = scope === 'A' || section.level === 'AS';
    for (const topic of section.topics) {
      const states: MasteryState[] = [];
      const tp: TopicProgress = { state: 'not-started', objectives: topic.objectives.length, withContent: 0, studied: 0, secure: 0 };
      for (const o of topic.objectives) {
        const lIds = lessonsByObjective.get(o.id) ?? [];
        const qIds = [...(questionsByObjective.get(o.id) ?? [])];
        const statuses = lIds.map((id) => lessons.get(id) ?? NOT_STARTED);
        const attempts = qIds.flatMap((q) => attemptsByQuestion.get(q) ?? []);
        const mastery = computeMastery(
          {
            lessonOpened: statuses.some((s) => s.status !== 'not-started'),
            lessonCompleted: statuses.some((s) => s.status === 'completed'),
            attempts,
            overdueReviews: qIds.filter((q) => overdue.has(q)).length,
          },
          now,
        );
        const studied = statuses.some((s) => s.status === 'completed');
        const hasContent = lIds.length > 0 || qIds.length > 0;
        objectives.set(o.id, { id: o.id, code: o.code, topicId: topic.id, level: section.level, lessonIds: lIds, questionCount: qIds.length, studied, mastery });
        if (hasContent) {
          tp.withContent++;
          states.push(mastery.state);
        }
        if (studied) tp.studied++;
        if (mastery.state === 'secure') tp.secure++;
        if (mastery.lastActivity && (!lastActive || mastery.lastActivity > lastActive)) lastActive = mastery.lastActivity;
        if (inScope) {
          summary.objectives++;
          if (hasContent) summary.withContent++;
          if (studied) summary.studied++;
          if (mastery.attempts > 0) summary.practised++;
          if (mastery.state === 'secure') summary.secure++;
          if (mastery.state === 'needs-revision') summary.needsRevision++;
        }
      }
      tp.state = aggregateState(states);
      topics.set(topic.id, tp);
      if (inScope) {
        for (const l of topic.lessons) {
          summary.lessonsTotal++;
          if (lessons.get(l.id)?.status === 'completed') summary.lessonsCompleted++;
        }
      }
    }
  }
  for (const s of lessons.values()) if (s.lastViewedAt && (!lastActive || s.lastViewedAt > lastActive)) lastActive = s.lastViewedAt;

  return { objectives, topics, lessons, summary, lastActive };
});
