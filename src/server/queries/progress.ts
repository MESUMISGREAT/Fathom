/**
 * Student progress for one syllabus version: lesson statuses, objective
 * mastery (from src/domain/mastery) and topic roll-ups. Computed on read from
 * attempts; Phase 2 can cache this in a table once attempt volume grows.
 */
import 'server-only';
import { cache } from 'react';
import { and, eq, inArray, isNull, lt } from 'drizzle-orm';
import { getDb, type Db } from '@/server/db';
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

/** Everything the mastery rules look at for a set of objectives. */
interface Evidence {
  lessons: Map<string, LessonStatus>;
  /** Core, non-archived lessons teaching each objective. */
  lessonsByObjective: Map<string, string[]>;
  /** Non-archived questions testing each objective. */
  questionsByObjective: Map<string, Set<string>>;
  attemptsByQuestion: Map<string, AttemptEvidence[]>;
  /** Questions whose review is more than RULES.overdueDays late. */
  overdue: Set<string>;
}

type Link<K extends string> = { [P in K | 'objectiveId']: string };

/**
 * Loads the student's evidence for the given objective links. `lessonIds` is
 * every lesson whose status is wanted (a superset of the linked lessons).
 * Works with any handle, including a transaction.
 */
async function loadEvidence(
  db: Db,
  userId: string | null,
  links: { lessons: Link<'lessonId'>[]; questions: Link<'questionId'>[]; lessonIds: string[] },
  now: Date,
): Promise<Evidence> {
  const lessonIds = links.lessonIds;
  const questionIds = [...new Set(links.questions.map((q) => q.questionId))];
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
  for (const r of links.lessons) lessonsByObjective.set(r.objectiveId, [...(lessonsByObjective.get(r.objectiveId) ?? []), r.lessonId]);
  const questionsByObjective = new Map<string, Set<string>>();
  for (const r of links.questions) {
    const set = questionsByObjective.get(r.objectiveId) ?? new Set<string>();
    set.add(r.questionId);
    questionsByObjective.set(r.objectiveId, set);
  }
  const attemptsByQuestion = new Map<string, AttemptEvidence[]>();
  for (const a of attemptRows) attemptsByQuestion.set(a.questionId, [...(attemptsByQuestion.get(a.questionId) ?? []), a]);
  return { lessons, lessonsByObjective, questionsByObjective, attemptsByQuestion, overdue: new Set(overdueRows.map((r) => r.questionId)) };
}

/** One objective's mastery from the evidence. */
function objectiveMastery(objectiveId: string, ev: Evidence, now: Date) {
  const lessonIds = ev.lessonsByObjective.get(objectiveId) ?? [];
  const questionIds = [...(ev.questionsByObjective.get(objectiveId) ?? [])];
  const statuses = lessonIds.map((id) => ev.lessons.get(id) ?? NOT_STARTED);
  const mastery = computeMastery(
    {
      lessonOpened: statuses.some((s) => s.status !== 'not-started'),
      lessonCompleted: statuses.some((s) => s.status === 'completed'),
      attempts: questionIds.flatMap((q) => ev.attemptsByQuestion.get(q) ?? []),
      overdueReviews: questionIds.filter((q) => ev.overdue.has(q)).length,
    },
    now,
  );
  return {
    lessonIds,
    questionCount: questionIds.length,
    studied: statuses.some((s) => s.status === 'completed'),
    /** Has lessons or questions. Objectives without are Not started, which keeps their topic from being Secure. */
    hasContent: lessonIds.length > 0 || questionIds.length > 0,
    mastery,
  };
}

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
  const ev = await loadEvidence(db, userId, { lessons: lessonObjs, questions: questionObjs, lessonIds }, now);
  const lessons = ev.lessons;

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
        const { lessonIds: lIds, questionCount, studied, hasContent, mastery } = objectiveMastery(o.id, ev, now);
        objectives.set(o.id, { id: o.id, code: o.code, topicId: topic.id, level: section.level, lessonIds: lIds, questionCount, studied, mastery });
        if (hasContent) tp.withContent++;
        // Every objective counts towards the topic's state: one without lessons yet is Not started, so a
        // topic is Secure only when all of it is (docs/design/fun-and-points.md §4, Topic secured).
        states.push(mastery.state);
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

/**
 * The mastery state of each given topic for one student, by exactly the
 * rules getSubjectProgress uses (TopicProgress.state): every objective in
 * the topic counts, and one with no content yet is Not started, so 'secure'
 * means every objective is Secure. Takes the database handle so the points
 * engine can call it inside its transaction; not cached. Unknown topics and
 * topics with no content are 'not-started'.
 */
export async function getTopicStates(db: Db, userId: string, topicIds: readonly string[], now = new Date()): Promise<Map<string, MasteryState>> {
  const ids = [...new Set(topicIds)];
  const out = new Map<string, MasteryState>(ids.map((id) => [id, 'not-started']));
  if (!ids.length) return out;
  const objs = await db.select({ id: t.objectives.id, topicId: t.objectives.topicId }).from(t.objectives).where(inArray(t.objectives.topicId, ids));
  if (!objs.length) return out;
  const objectiveIds = objs.map((o) => o.id);
  const [lessonObjs, questionObjs] = await Promise.all([
    db
      .select({ lessonId: t.lessonObjectives.lessonId, objectiveId: t.lessonObjectives.objectiveId })
      .from(t.lessonObjectives)
      .innerJoin(t.lessons, eq(t.lessons.id, t.lessonObjectives.lessonId))
      .where(and(inArray(t.lessonObjectives.objectiveId, objectiveIds), isNull(t.lessons.archivedAt), eq(t.lessons.kind, 'core'))),
    db
      .select({ questionId: t.questionObjectives.questionId, objectiveId: t.questionObjectives.objectiveId })
      .from(t.questionObjectives)
      .innerJoin(t.questions, eq(t.questions.id, t.questionObjectives.questionId))
      .where(and(inArray(t.questionObjectives.objectiveId, objectiveIds), isNull(t.questions.archivedAt))),
  ]);
  const lessonIds = [...new Set(lessonObjs.map((l) => l.lessonId))];
  const ev = await loadEvidence(db, userId, { lessons: lessonObjs, questions: questionObjs, lessonIds }, now);
  const states = new Map<string, MasteryState[]>();
  for (const o of objs) {
    const m = objectiveMastery(o.id, ev, now);
    states.set(o.topicId, [...(states.get(o.topicId) ?? []), m.mastery.state]);
  }
  for (const [topicId, list] of states) out.set(topicId, aggregateState(list));
  return out;
}
