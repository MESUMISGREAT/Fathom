/** Everything the home dashboard needs, in one place. */
import 'server-only';
import { and, desc, eq, gte, inArray } from 'drizzle-orm';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';
import { recommendNext, type LessonCandidate, type NextStep, type RevisitCandidate } from '@/domain/recommend';
import { shouldRevisit } from '@/domain/mastery';
import { lessonHref, lessonLocations, lessonsInOrder, listSubjects, type SubjectSummary } from './catalog';
import { getSubjectProgress, type SubjectProgress } from './progress';
import { countDue } from './review';

export interface EnrolledSubject {
  subject: SubjectSummary;
  targetLevel: 'AS' | 'A';
  progress: SubjectProgress;
}

export async function getEnrolled(userId: string): Promise<EnrolledSubject[]> {
  const db = await getDb();
  const [rows, subjects] = await Promise.all([db.select().from(t.enrollments).where(eq(t.enrollments.userId, userId)), listSubjects()]);
  const out: EnrolledSubject[] = [];
  for (const subject of subjects) {
    const e = rows.find((r) => r.subjectCode === subject.code);
    if (!e) continue;
    out.push({ subject, targetLevel: e.targetLevel, progress: await getSubjectProgress(userId, subject.version.id, e.targetLevel) });
  }
  return out;
}

export interface RecentLessonResult {
  lessonId: string;
  title: string;
  href: string;
  subjectName: string;
  answered: number;
  correct: number;
  at: Date;
}

export interface Dashboard {
  enrolled: EnrolledSubject[];
  next: NextStep;
  upNext: LessonCandidate[];
  dueCount: number;
  revisit: Array<RevisitCandidate & { subjectName: string; topicTitle: string }>;
  recent: RecentLessonResult[];
  week: { answered: number; correct: number; lessonsCompleted: number };
}

const DAY = 86_400_000;

export async function getDashboard(userId: string): Promise<Dashboard> {
  const db = await getDb();
  const [enrolled, dueCount] = await Promise.all([getEnrolled(userId), countDue(userId)]);

  // Lesson candidates in syllabus order, limited to the level the student is aiming for.
  const candidates: LessonCandidate[] = [];
  const revisit: Dashboard['revisit'] = [];
  for (const e of enrolled) {
    const ordered = (await lessonsInOrder(e.subject.version.id)).filter((l) => e.targetLevel === 'A' || l.section.level === 'AS');
    ordered.forEach((l, i) => {
      const st = e.progress.lessons.get(l.id);
      candidates.push({
        id: l.id,
        href: lessonHref(e.subject.slug, l.topic.code, l.id),
        title: l.title,
        subjectName: e.subject.name,
        topicTitle: `${l.topic.code} ${l.topic.title}`,
        minutes: l.minutes,
        order: i,
        status: st?.status ?? 'not-started',
        lastViewedAt: st?.lastViewedAt ?? null,
        prerequisites: l.prerequisites,
        subjectLastActive: e.progress.lastActive,
      });
    });
    const titles = new Map(ordered.map((l) => [l.id, { title: l.title, topic: `${l.topic.code} ${l.topic.title}`, href: lessonHref(e.subject.slug, l.topic.code, l.id) }]));
    const weak = [...e.progress.objectives.values()]
      .filter((o) => shouldRevisit(o.mastery) && o.lessonIds.some((id) => titles.has(id)))
      .sort((a, b) => (b.mastery.lastActivity?.getTime() ?? 0) - (a.mastery.lastActivity?.getTime() ?? 0));
    for (const o of weak) {
      const lessonId = o.lessonIds.find((id) => titles.has(id))!;
      const l = titles.get(lessonId)!;
      if (revisit.some((r) => r.lessonId === lessonId)) continue;
      revisit.push({ lessonId, href: l.href, title: l.title, objectiveCode: o.code, subjectName: e.subject.name, topicTitle: l.topic });
    }
  }

  const next = recommendNext({ enrolledCount: enrolled.length, dueReviews: dueCount, lessons: candidates, revisit });
  const nextId = next.kind === 'start' || next.kind === 'resume' ? next.lesson.id : null;
  const upNext = candidates
    .filter((c) => c.status === 'not-started' && c.id !== nextId)
    .sort((a, b) => (b.subjectLastActive?.getTime() ?? 0) - (a.subjectLastActive?.getTime() ?? 0) || a.order - b.order)
    .slice(0, 3);

  // Recent results, grouped by lesson.
  const since = new Date(Date.now() - 7 * DAY);
  const attempts = await db
    .select({ questionId: t.attempts.questionId, score: t.attempts.score, at: t.attempts.createdAt, lessonId: t.questions.lessonId })
    .from(t.attempts)
    .innerJoin(t.questions, eq(t.questions.id, t.attempts.questionId))
    .where(and(eq(t.attempts.userId, userId), gte(t.attempts.createdAt, since)))
    .orderBy(desc(t.attempts.createdAt))
    .limit(400);
  const byLesson = new Map<string, { answered: number; correct: number; at: Date }>();
  for (const a of attempts) {
    const g = byLesson.get(a.lessonId) ?? { answered: 0, correct: 0, at: a.at };
    g.answered++;
    if (a.score >= 0.99) g.correct++;
    byLesson.set(a.lessonId, g);
  }
  const locs = await lessonLocations([...byLesson.keys()].slice(0, 5));
  const recent: RecentLessonResult[] = [...byLesson.entries()].slice(0, 5).flatMap(([lessonId, g]) => {
    const loc = locs.get(lessonId);
    return loc ? [{ lessonId, title: loc.title, href: loc.href, subjectName: loc.subjectName, ...g }] : [];
  });
  const lessonIds = candidates.map((c) => c.id);
  const completedThisWeek = lessonIds.length
    ? await db
        .select({ id: t.lessonProgress.lessonId })
        .from(t.lessonProgress)
        .where(and(eq(t.lessonProgress.userId, userId), inArray(t.lessonProgress.lessonId, lessonIds), gte(t.lessonProgress.completedAt, since)))
    : [];

  return {
    enrolled,
    next,
    upNext,
    dueCount,
    revisit: revisit.slice(0, 4),
    recent,
    week: { answered: attempts.length, correct: attempts.filter((a) => a.score >= 0.99).length, lessonsCompleted: completedThisWeek.length },
  };
}
