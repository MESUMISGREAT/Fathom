/** Read-only queries over syllabus and lesson content. */
import 'server-only';
import { cache } from 'react';
import { and, asc, count, countDistinct, eq, inArray, isNull, sql } from 'drizzle-orm';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';

export const topicParam = (code: string) => code.replace('.', '-');
export const topicCodeFromParam = (param: string) => param.replace('-', '.');
export const lessonHref = (subjectSlug: string, topicCode: string, lessonId: string) =>
  `/subjects/${subjectSlug}/${topicParam(topicCode)}/${lessonId}`;
export const topicHref = (subjectSlug: string, topicCode: string) => `/subjects/${subjectSlug}/${topicParam(topicCode)}`;

export interface SubjectSummary {
  code: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  version: { id: string; label: string; examYears: number[]; sourceUrl: string; sourceVersion: string; checkedAt: string; wording: string };
  counts: { topics: number; objectives: number; lessons: number };
}

export const listSubjects = cache(async (): Promise<SubjectSummary[]> => {
  const db = await getDb();
  const rows = await db
    .select({ s: t.subjects, v: t.syllabusVersions })
    .from(t.subjects)
    .innerJoin(t.syllabusVersions, and(eq(t.syllabusVersions.subjectCode, t.subjects.code), eq(t.syllabusVersions.isCurrent, true)))
    .orderBy(asc(t.subjects.position));
  const versionIds = rows.map((r) => r.v.id);
  if (!versionIds.length) return [];
  const [topicCounts, objectiveCounts, lessonCounts] = await Promise.all([
    // Count topics that still have objectives, so topics removed from the syllabus are not counted.
    db
      .select({ v: t.objectives.versionId, n: countDistinct(t.objectives.topicId) })
      .from(t.objectives)
      .where(inArray(t.objectives.versionId, versionIds))
      .groupBy(t.objectives.versionId),
    db.select({ v: t.objectives.versionId, n: count() }).from(t.objectives).where(inArray(t.objectives.versionId, versionIds)).groupBy(t.objectives.versionId),
    db
      .select({ v: t.lessons.versionId, n: count() })
      .from(t.lessons)
      .where(and(inArray(t.lessons.versionId, versionIds), isNull(t.lessons.archivedAt)))
      .groupBy(t.lessons.versionId),
  ]);
  const n = (list: Array<{ v: string; n: number }>, v: string) => list.find((x) => x.v === v)?.n ?? 0;
  return rows.map(({ s, v }) => ({
    code: s.code,
    slug: s.slug,
    name: s.name,
    shortName: s.shortName,
    description: s.description,
    version: { id: v.id, label: v.label, examYears: v.examYears, sourceUrl: v.sourceUrl, sourceVersion: v.sourceVersion, checkedAt: v.checkedAt, wording: v.wording },
    counts: { topics: n(topicCounts, v.id), objectives: n(objectiveCounts, v.id), lessons: n(lessonCounts, v.id) },
  }));
});

export const getSubject = cache(async (slug: string) => (await listSubjects()).find((s) => s.slug === slug) ?? null);
export const getSubjectByCode = cache(async (code: string) => (await listSubjects()).find((s) => s.code === code) ?? null);

export interface TreeLesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  position: number;
  kind: 'core' | 'enrichment';
  prerequisites: string[];
}
export interface TreeTopic {
  id: string;
  code: string;
  title: string;
  objectives: Array<{ id: string; code: string; text: string; guidance: string | null }>;
  lessons: TreeLesson[];
}
export interface TreeSection {
  id: string;
  code: string;
  title: string;
  level: 'AS' | 'A';
  papers: string[];
  strand: string | null;
  topics: TreeTopic[];
}

/** The whole syllabus for a version, with lessons attached to topics. */
export const getSyllabusTree = cache(async (versionId: string): Promise<TreeSection[]> => {
  const db = await getDb();
  const [sections, topics, objectives, lessons] = await Promise.all([
    db.select().from(t.syllabusSections).where(eq(t.syllabusSections.versionId, versionId)).orderBy(asc(t.syllabusSections.position)),
    db.select().from(t.topics).where(eq(t.topics.versionId, versionId)).orderBy(asc(t.topics.position)),
    db.select().from(t.objectives).where(eq(t.objectives.versionId, versionId)).orderBy(asc(t.objectives.position)),
    db
      .select({
        id: t.lessons.id,
        topicId: t.lessons.topicId,
        title: t.lessons.title,
        summary: t.lessons.summary,
        minutes: t.lessons.minutes,
        position: t.lessons.position,
        kind: t.lessons.kind,
        prerequisites: t.lessons.prerequisites,
      })
      .from(t.lessons)
      .where(and(eq(t.lessons.versionId, versionId), isNull(t.lessons.archivedAt)))
      .orderBy(asc(t.lessons.position)),
  ]);
  // A topic removed from syllabus.yaml keeps its row while archived lessons still point at it, but has no objectives left; hide it.
  return sections
    .map((s) => ({
      id: s.id,
      code: s.code,
      title: s.title,
      level: s.level,
      papers: s.papers,
      strand: s.strand,
      topics: topics
        .filter((tp) => tp.sectionId === s.id)
        .map((tp) => ({
          id: tp.id,
          code: tp.code,
          title: tp.title,
          objectives: objectives.filter((o) => o.topicId === tp.id).map((o) => ({ id: o.id, code: o.code, text: o.text, guidance: o.guidance })),
          lessons: lessons.filter((l) => l.topicId === tp.id),
        }))
        .filter((tp) => tp.objectives.length > 0 || tp.lessons.length > 0),
    }))
    .filter((s) => s.topics.length > 0);
});

export async function getTopic(versionId: string, code: string) {
  const tree = await getSyllabusTree(versionId);
  for (const section of tree) {
    const topic = section.topics.find((tp) => tp.code === code);
    if (topic) return { section, topic };
  }
  return null;
}

/** Lessons in syllabus order across the whole subject. */
export async function lessonsInOrder(versionId: string) {
  const tree = await getSyllabusTree(versionId);
  return tree.flatMap((s) => s.topics.flatMap((tp) => tp.lessons.map((l) => ({ ...l, topic: tp, section: s }))));
}

export const getLesson = cache(async (id: string) => {
  const db = await getDb();
  const rows = await db.select().from(t.lessons).where(and(eq(t.lessons.id, id), isNull(t.lessons.archivedAt)));
  const lesson = rows[0];
  if (!lesson) return null;
  const [qs, objs] = await Promise.all([
    db
      .select({ id: t.questions.id, view: t.questions.view })
      .from(t.questions)
      .where(and(eq(t.questions.lessonId, id), isNull(t.questions.archivedAt)))
      .orderBy(asc(t.questions.position)),
    db
      .select({ id: t.objectives.id, code: t.objectives.code, text: t.objectives.text })
      .from(t.lessonObjectives)
      .innerJoin(t.objectives, eq(t.objectives.id, t.lessonObjectives.objectiveId))
      .where(eq(t.lessonObjectives.lessonId, id))
      .orderBy(asc(t.objectives.code)),
  ]);
  return { lesson, questions: qs.map((q) => q.view), objectives: objs };
});

export async function getQuestionsByIds(ids: string[]) {
  if (!ids.length) return [];
  const db = await getDb();
  return db
    .select({ id: t.questions.id, lessonId: t.questions.lessonId, view: t.questions.view, prompt: sql<string>`${t.questions.spec}->>'prompt'` })
    .from(t.questions)
    .where(and(inArray(t.questions.id, ids), isNull(t.questions.archivedAt)));
}

/** Markdown/TeX to a short plain-text preview. */
export function plainPreview(md: string, max = 140): string {
  return md
    .replace(/\{\{\d+\}\}/g, '___')
    .replace(/\$\$?([^$]*)\$\$?/g, '$1')
    .replace(/\\(?:text|mathrm|mathbf)\{([^}]*)\}/g, '$1')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}*_`#>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Map lesson ids to their URL parts (subject slug, topic code). */
export async function lessonLocations(ids: string[]) {
  if (!ids.length) return new Map<string, { href: string; title: string; subjectName: string; subjectCode: string; topicCode: string; topicTitle: string }>();
  const db = await getDb();
  const rows = await db
    .select({
      id: t.lessons.id,
      title: t.lessons.title,
      topicCode: t.topics.code,
      topicTitle: t.topics.title,
      subjectSlug: t.subjects.slug,
      subjectName: t.subjects.name,
      subjectCode: t.subjects.code,
    })
    .from(t.lessons)
    .innerJoin(t.topics, eq(t.topics.id, t.lessons.topicId))
    .innerJoin(t.syllabusVersions, eq(t.syllabusVersions.id, t.lessons.versionId))
    .innerJoin(t.subjects, eq(t.subjects.code, t.syllabusVersions.subjectCode))
    .where(inArray(t.lessons.id, ids));
  return new Map(
    rows.map((r) => [
      r.id,
      { href: lessonHref(r.subjectSlug, r.topicCode, r.id), title: r.title, subjectName: r.subjectName, subjectCode: r.subjectCode, topicCode: r.topicCode, topicTitle: r.topicTitle },
    ]),
  );
}
