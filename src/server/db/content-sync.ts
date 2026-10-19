/**
 * Loads /content into the database. Idempotent: keyed on a hash of every
 * content file, so it is cheap to call at start-up. Content that fails
 * validation is never imported; the previous content stays live.
 *
 * Lessons and questions removed from /content are archived rather than
 * deleted, so students' attempt history keeps its references.
 */
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { and, eq, inArray, isNull, notInArray, sql } from 'drizzle-orm';
import { loadContent, type ContentBundle, type Issue } from '@/content/load';
import { lessonSearchText, questionId, renderBlock, renderQuestion } from '@/content/rendered';
import { validateContent } from '@/content/validate';
import { diagrams } from '@/components/diagrams';
import type { Db } from './index';
import * as t from './schema';

/** Bump when the importer's output format changes, to force a re-import. */
const IMPORTER_VERSION = '3';

export class ContentInvalidError extends Error {
  constructor(public issues: Issue[]) {
    super(`content has ${issues.length} error(s)`);
  }
}

async function hashBundle(bundle: ContentBundle): Promise<string> {
  const h = createHash('sha256').update(IMPORTER_VERSION);
  const files = [...bundle.syllabi.map((s) => s.file), ...bundle.lessons.map((l) => l.file)].sort();
  for (const f of files) h.update(f).update(await readFile(f));
  return h.digest('hex');
}

const excluded = (cols: string[]) => Object.fromEntries(cols.map((c) => [c, sql.raw(`excluded."${c.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase())}"`)]));

export async function importContent(db: Db, bundle: ContentBundle, hash: string): Promise<{ lessons: number; questions: number }> {
  let counts = { lessons: 0, questions: 0 };
  await db.transaction(async (tx) => {
    // Serialise concurrent importers (several app instances starting at once).
    await tx.execute(sql`select pg_advisory_xact_lock(727274)`);
    const current = await tx.select().from(t.appMeta).where(eq(t.appMeta.key, 'content_hash'));
    if (current[0]?.value === hash) return;

    await tx.delete(t.lessonObjectives);
    await tx.delete(t.questionObjectives);

    const keepObjectives: string[] = [];
    const keepTopics: string[] = [];
    const keepSections: string[] = [];

    for (const [i, { data: s }] of bundle.syllabi.entries()) {
      await tx
        .insert(t.subjects)
        .values({ ...s.subject, position: i })
        .onConflictDoUpdate({ target: t.subjects.code, set: excluded(['slug', 'name', 'shortName', 'description', 'position']) });
      await tx
        .insert(t.syllabusVersions)
        .values({
          id: s.syllabus.id,
          subjectCode: s.subject.code,
          label: s.syllabus.label,
          examYears: s.syllabus.examYears,
          sourceUrl: s.syllabus.sourceUrl,
          sourceVersion: s.syllabus.sourceVersion,
          checkedAt: s.syllabus.checkedAt,
          wording: s.syllabus.wording,
          notes: s.syllabus.notes ?? null,
          isCurrent: true,
        })
        .onConflictDoUpdate({
          target: t.syllabusVersions.id,
          set: excluded(['label', 'examYears', 'sourceUrl', 'sourceVersion', 'checkedAt', 'wording', 'notes', 'isCurrent']),
        });
      // One current version per subject.
      await tx
        .update(t.syllabusVersions)
        .set({ isCurrent: false })
        .where(and(eq(t.syllabusVersions.subjectCode, s.subject.code), sql`${t.syllabusVersions.id} <> ${s.syllabus.id}`));

      const v = s.syllabus.id;
      const sectionRows = s.sections.map((sec, si) => ({
        id: `${v}:${sec.code}`,
        versionId: v,
        code: sec.code,
        title: sec.title,
        level: sec.level,
        papers: sec.papers,
        strand: sec.strand ?? null,
        position: si,
      }));
      const topicRows = s.sections.flatMap((sec) =>
        sec.topics.map((tp, ti) => ({ id: `${v}:${tp.code}`, versionId: v, sectionId: `${v}:${sec.code}`, code: tp.code, title: tp.title, position: ti })),
      );
      const objectiveRows = s.sections.flatMap((sec) =>
        sec.topics.flatMap((tp) =>
          tp.objectives.map((o, oi) => ({
            id: `${v}:${o.code}`,
            versionId: v,
            topicId: `${v}:${tp.code}`,
            code: o.code,
            text: o.text,
            guidance: o.guidance ?? null,
            position: oi,
          })),
        ),
      );
      keepSections.push(...sectionRows.map((r) => r.id));
      keepTopics.push(...topicRows.map((r) => r.id));
      keepObjectives.push(...objectiveRows.map((r) => r.id));

      await tx.insert(t.syllabusSections).values(sectionRows).onConflictDoUpdate({
        target: t.syllabusSections.id,
        set: excluded(['code', 'title', 'level', 'papers', 'strand', 'position']),
      });
      await tx.insert(t.topics).values(topicRows).onConflictDoUpdate({
        target: t.topics.id,
        set: excluded(['sectionId', 'code', 'title', 'position']),
      });
      for (let i = 0; i < objectiveRows.length; i += 500) {
        await tx.insert(t.objectives).values(objectiveRows.slice(i, i + 500)).onConflictDoUpdate({
          target: t.objectives.id,
          set: excluded(['topicId', 'code', 'text', 'guidance', 'position']),
        });
      }
    }

    const versionBySubject = new Map(bundle.syllabi.map(({ data }) => [data.subject.code, data.syllabus.id]));
    const liveLessons: string[] = [];
    const liveQuestions: string[] = [];

    for (const { data: l } of bundle.lessons) {
      const v = versionBySubject.get(l.subject)!;
      const blocks = l.blocks.map((b) => renderBlock(b, l.id));
      const lessonHash = createHash('sha256').update(JSON.stringify(l)).digest('hex').slice(0, 16);
      await tx
        .insert(t.lessons)
        .values({
          id: l.id,
          versionId: v,
          topicId: `${v}:${l.topic}`,
          slug: l.id,
          title: l.title,
          summary: l.summary,
          position: l.order,
          minutes: l.minutes,
          kind: l.kind,
          prerequisites: l.prerequisites,
          provenance: l.provenance,
          blocks,
          searchText: lessonSearchText(l),
          contentHash: lessonHash,
          archivedAt: null,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: t.lessons.id,
          set: excluded(['versionId', 'topicId', 'slug', 'title', 'summary', 'position', 'minutes', 'kind', 'prerequisites', 'provenance', 'blocks', 'searchText', 'contentHash', 'archivedAt', 'updatedAt']),
        });
      liveLessons.push(l.id);
      if (l.objectives.length) {
        await tx.insert(t.lessonObjectives).values(l.objectives.map((o) => ({ lessonId: l.id, objectiveId: `${v}:${o}` })));
      }

      for (const [qi, q] of l.questions.entries()) {
        const { view, reveal } = renderQuestion(q, l.id);
        const id = questionId(l.id, q.id);
        await tx
          .insert(t.questions)
          .values({ id, lessonId: l.id, versionId: v, format: q.format, difficulty: q.difficulty, position: qi, spec: q, view, reveal, archivedAt: null })
          .onConflictDoUpdate({
            target: t.questions.id,
            set: excluded(['lessonId', 'versionId', 'format', 'difficulty', 'position', 'spec', 'view', 'reveal', 'archivedAt']),
          });
        liveQuestions.push(id);
        await tx.insert(t.questionObjectives).values(q.objectives.map((o) => ({ questionId: id, objectiveId: `${v}:${o}` })));
      }
    }
    counts = { lessons: liveLessons.length, questions: liveQuestions.length };

    const now = new Date();
    await tx
      .update(t.lessons)
      .set({ archivedAt: now })
      .where(and(isNull(t.lessons.archivedAt), liveLessons.length ? notInArray(t.lessons.id, liveLessons) : sql`true`));
    await tx
      .update(t.questions)
      .set({ archivedAt: now })
      .where(and(isNull(t.questions.archivedAt), liveQuestions.length ? notInArray(t.questions.id, liveQuestions) : sql`true`));

    // Remove syllabus rows that no longer exist and that nothing references.
    if (keepObjectives.length) await tx.delete(t.objectives).where(notInArray(t.objectives.id, keepObjectives));
    const referencedTopics = (await tx.selectDistinct({ id: t.lessons.topicId }).from(t.lessons)).map((r) => r.id);
    const keepT = [...new Set([...keepTopics, ...referencedTopics])];
    if (keepT.length) {
      await tx.delete(t.topics).where(and(notInArray(t.topics.id, keepT), sql`not exists (select 1 from objectives o where o.topic_id = ${t.topics.id})`));
    }
    const referencedSections = (await tx.selectDistinct({ id: t.topics.sectionId }).from(t.topics)).map((r) => r.id);
    const keepS = [...new Set([...keepSections, ...referencedSections])];
    if (keepS.length) await tx.delete(t.syllabusSections).where(notInArray(t.syllabusSections.id, keepS));

    await tx
      .insert(t.appMeta)
      .values({ key: 'content_hash', value: hash })
      .onConflictDoUpdate({ target: t.appMeta.key, set: { value: hash } });
    await tx
      .insert(t.appMeta)
      .values({ key: 'content_imported_at', value: now.toISOString() })
      .onConflictDoUpdate({ target: t.appMeta.key, set: { value: now.toISOString() } });
  });
  return counts;
}

/** Validate and import. Throws ContentInvalidError (nothing imported) if there are errors. */
export async function importFromDisk(db: Db, opts: { force?: boolean } = {}) {
  const bundle = await loadContent();
  const { issues, coverage } = validateContent(bundle, new Set(Object.keys(diagrams)));
  const errors = issues.filter((i) => i.level === 'error');
  if (errors.length) throw new ContentInvalidError(errors);
  const hash = opts.force ? `${await hashBundle(bundle)}:${Date.now()}` : await hashBundle(bundle);
  const counts = await importContent(db, bundle, hash);
  return { ...counts, coverage, warnings: issues.length };
}

/** Called on start-up: import if content changed; on invalid content keep what is live. */
export async function syncContentIfChanged(db: Db): Promise<void> {
  const bundle = await loadContent();
  const hash = await hashBundle(bundle);
  const current = await db.select().from(t.appMeta).where(eq(t.appMeta.key, 'content_hash'));
  if (current[0]?.value === hash) return;
  const { issues } = validateContent(bundle, new Set(Object.keys(diagrams)));
  const errors = issues.filter((i) => i.level === 'error');
  if (errors.length) {
    console.error(`[content] not imported: ${errors.length} validation error(s). Run "npm run content:check". Serving previously imported content.`);
    for (const e of errors.slice(0, 10)) console.error(`[content]   ${e.file}: ${e.message}`);
    return;
  }
  const counts = await importContent(db, bundle, hash);
  console.log(`[content] imported ${counts.lessons} lessons, ${counts.questions} questions`);
}

/** Lesson ids that are live (not archived), for callers that need to filter. */
export async function liveLessonIds(db: Db, ids: string[]): Promise<Set<string>> {
  if (!ids.length) return new Set();
  const rows = await db.select({ id: t.lessons.id }).from(t.lessons).where(and(inArray(t.lessons.id, ids), isNull(t.lessons.archivedAt)));
  return new Set(rows.map((r) => r.id));
}
