/**
 * Syllabus and notes search. Exact syllabus codes (e.g. "1.1.3" or
 * "9709 1.1") rank first, then title matches, then text matches.
 * Plain ILIKE over a small corpus; Postgres full-text or a search service
 * can replace this without changing callers.
 */
import 'server-only';
import { and, eq, ilike, isNull, or, sql, type AnyColumn, type SQL } from 'drizzle-orm';
import { getDb } from '@/server/db';
import * as t from '@/server/db/schema';
import { lessonHref, topicHref } from './catalog';

export type ResultKind = 'topic' | 'objective' | 'lesson' | 'question';

export interface SearchResult {
  kind: ResultKind;
  id: string;
  title: string;
  snippet: string;
  href: string;
  subject: { code: string; name: string };
  code?: string;
  level: 'AS' | 'A';
  score: number;
  difficulty?: number;
  format?: string;
}

export interface SearchFilters {
  subject?: string;
  kind?: ResultKind;
  level?: 'AS' | 'A';
  difficulty?: number;
  format?: string;
}

const escapeLike = (s: string) => s.replace(/[\\%_]/g, (m) => `\\${m}`);

export async function search(qRaw: string, f: SearchFilters = {}): Promise<SearchResult[]> {
  const q = qRaw.trim().slice(0, 100);
  if (q.length < 2 && !/^\d/.test(q)) return [];
  const db = await getDb();

  // "9709 1.1.2" or "1.1.2"
  const codeMatch = /^(?:(\d{4})\s+)?(\d{1,2}\.\d{1,2}(?:\.\d{1,2})?)$/.exec(q);
  const subjectFromQuery = codeMatch?.[1];
  const code = codeMatch?.[2];
  const terms = q
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 6);
  if (!code && terms.length === 0 && q !== '*') return [];
  const allTerms = (col: SQL | AnyColumn) => and(...terms.map((w) => ilike(col, `%${escapeLike(w)}%`)));
  const subjectCode = f.subject ?? subjectFromQuery;

  const base = db
    .select({
      subjectCode: t.subjects.code,
      subjectName: t.subjects.name,
      subjectSlug: t.subjects.slug,
      topicCode: t.topics.code,
      topicTitle: t.topics.title,
      level: t.syllabusSections.level,
    })
    .from(t.topics)
    .innerJoin(t.syllabusSections, eq(t.syllabusSections.id, t.topics.sectionId))
    .innerJoin(t.syllabusVersions, and(eq(t.syllabusVersions.id, t.topics.versionId), eq(t.syllabusVersions.isCurrent, true)))
    .innerJoin(t.subjects, eq(t.subjects.code, t.syllabusVersions.subjectCode))
    .$dynamic();
  const scope = (extra?: SQL) =>
    and(subjectCode ? eq(t.subjects.code, subjectCode) : undefined, f.level ? eq(t.syllabusSections.level, f.level) : undefined, extra);

  const results: SearchResult[] = [];
  const want = (k: ResultKind) => !f.kind || f.kind === k;
  const lower = q.toLowerCase();

  if (want('topic') && !f.difficulty && !f.format) {
    const where = code ? eq(t.topics.code, code.split('.').slice(0, 2).join('.')) : allTerms(t.topics.title);
    const rows = await base.where(scope(where)).limit(30);
    for (const r of rows) {
      const exactCode = !!code && code.split('.').length === 2;
      results.push({
        kind: 'topic',
        id: `${r.subjectCode}:${r.topicCode}`,
        title: `${r.topicCode} ${r.topicTitle}`,
        snippet: `${r.level === 'AS' ? 'AS Level' : 'A Level'} topic`,
        href: topicHref(r.subjectSlug, r.topicCode),
        subject: { code: r.subjectCode, name: r.subjectName },
        code: r.topicCode,
        level: r.level,
        score: exactCode ? 100 : r.topicTitle.toLowerCase() === lower ? 90 : 60,
      });
    }
  }

  if (want('objective') && !f.difficulty && !f.format) {
    const rows = await db
      .select({
        id: t.objectives.id,
        code: t.objectives.code,
        text: t.objectives.text,
        guidance: t.objectives.guidance,
        topicCode: t.topics.code,
        subjectCode: t.subjects.code,
        subjectName: t.subjects.name,
        subjectSlug: t.subjects.slug,
        level: t.syllabusSections.level,
      })
      .from(t.objectives)
      .innerJoin(t.topics, eq(t.topics.id, t.objectives.topicId))
      .innerJoin(t.syllabusSections, eq(t.syllabusSections.id, t.topics.sectionId))
      .innerJoin(t.syllabusVersions, and(eq(t.syllabusVersions.id, t.objectives.versionId), eq(t.syllabusVersions.isCurrent, true)))
      .innerJoin(t.subjects, eq(t.subjects.code, t.syllabusVersions.subjectCode))
      .where(
        scope(
          code
            ? code.split('.').length === 3
              ? eq(t.objectives.code, code)
              : eq(t.topics.code, code)
            : or(allTerms(t.objectives.text), allTerms(sql`coalesce(${t.objectives.guidance}, '')`)),
        ),
      )
      .limit(40);
    for (const r of rows) {
      results.push({
        kind: 'objective',
        id: r.id,
        title: r.code,
        snippet: r.text,
        href: `${topicHref(r.subjectSlug, r.topicCode)}#objectives-title`,
        subject: { code: r.subjectCode, name: r.subjectName },
        code: r.code,
        level: r.level,
        score: code && r.code === code ? 100 : code ? 70 : 50,
      });
    }
  }

  if (want('lesson') && !f.difficulty && !f.format && !code) {
    const rows = await db
      .select({
        id: t.lessons.id,
        title: t.lessons.title,
        summary: t.lessons.summary,
        topicCode: t.topics.code,
        subjectCode: t.subjects.code,
        subjectName: t.subjects.name,
        subjectSlug: t.subjects.slug,
        level: t.syllabusSections.level,
      })
      .from(t.lessons)
      .innerJoin(t.topics, eq(t.topics.id, t.lessons.topicId))
      .innerJoin(t.syllabusSections, eq(t.syllabusSections.id, t.topics.sectionId))
      .innerJoin(t.syllabusVersions, eq(t.syllabusVersions.id, t.lessons.versionId))
      .innerJoin(t.subjects, eq(t.subjects.code, t.syllabusVersions.subjectCode))
      .where(scope(and(isNull(t.lessons.archivedAt), or(allTerms(t.lessons.title), allTerms(t.lessons.searchText)))))
      .limit(30);
    for (const r of rows) {
      const inTitle = terms.every((w) => r.title.toLowerCase().includes(w));
      results.push({
        kind: 'lesson',
        id: r.id,
        title: r.title,
        snippet: r.summary,
        href: lessonHref(r.subjectSlug, r.topicCode, r.id),
        subject: { code: r.subjectCode, name: r.subjectName },
        code: r.topicCode,
        level: r.level,
        score: r.title.toLowerCase() === lower ? 95 : inTitle ? 80 : 45,
      });
    }
  }

  if (want('question') && !code) {
    const rows = await db
      .select({
        id: t.questions.id,
        prompt: sql<string>`${t.questions.spec}->>'prompt'`,
        label: sql<string>`${t.questions.view}->>'label'`,
        difficulty: t.questions.difficulty,
        format: t.questions.format,
        lessonId: t.lessons.id,
        lessonTitle: t.lessons.title,
        topicCode: t.topics.code,
        subjectCode: t.subjects.code,
        subjectName: t.subjects.name,
        subjectSlug: t.subjects.slug,
        level: t.syllabusSections.level,
      })
      .from(t.questions)
      .innerJoin(t.lessons, eq(t.lessons.id, t.questions.lessonId))
      .innerJoin(t.topics, eq(t.topics.id, t.lessons.topicId))
      .innerJoin(t.syllabusSections, eq(t.syllabusSections.id, t.topics.sectionId))
      .innerJoin(t.syllabusVersions, eq(t.syllabusVersions.id, t.questions.versionId))
      .innerJoin(t.subjects, eq(t.subjects.code, t.syllabusVersions.subjectCode))
      .where(
        scope(
          and(
            isNull(t.questions.archivedAt),
            f.difficulty ? eq(t.questions.difficulty, f.difficulty) : undefined,
            f.format ? eq(t.questions.format, f.format) : undefined,
            q === '*' ? undefined : allTerms(sql`${t.questions.spec}->>'prompt'`),
          ),
        ),
      )
      .limit(30);
    for (const r of rows) {
      results.push({
        kind: 'question',
        id: r.id,
        title: `${r.label} · ${r.lessonTitle}`,
        snippet: r.prompt.replace(/\$\$?([^$]*)\$\$?/g, '$1').replace(/[*_`#>]/g, '').slice(0, 180),
        href: `${lessonHref(r.subjectSlug, r.topicCode, r.lessonId)}#q-${r.id.replace(/[^a-z0-9-]/gi, '-')}`,
        subject: { code: r.subjectCode, name: r.subjectName },
        code: r.topicCode,
        level: r.level,
        score: 30,
        difficulty: r.difficulty,
        format: r.format,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 60);
}
