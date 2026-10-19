import type { Metadata } from 'next';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { requireUser } from '@/server/auth/session';
import { getDb } from '@/server/db';
import { bookmarks } from '@/server/db/schema';
import { getQuestionsByIds, lessonLocations, plainPreview } from '@/server/queries/catalog';
import { EmptyState, PageHead } from '@/components/ui';
import { BookIcon, BookmarkIcon, TargetIcon } from '@/components/icons';

export const metadata: Metadata = { title: 'Saved' };

export default async function SavedPage() {
  const user = await requireUser('/saved');
  const db = await getDb();
  const rows = await db.select().from(bookmarks).where(eq(bookmarks.userId, user.id)).orderBy(desc(bookmarks.createdAt));
  const lessonIds = rows.filter((r) => r.kind === 'lesson').map((r) => r.targetId);
  const qs = await getQuestionsByIds(rows.filter((r) => r.kind === 'question').map((r) => r.targetId));
  const locs = await lessonLocations([...new Set([...lessonIds, ...qs.map((q) => q.lessonId)])]);
  const qById = new Map(qs.map((q) => [q.id, q]));

  const lessons = lessonIds.flatMap((id) => (locs.get(id) ? [{ id, ...locs.get(id)! }] : []));
  const questions = rows
    .filter((r) => r.kind === 'question')
    .flatMap((r) => {
      const q = qById.get(r.targetId);
      const loc = q && locs.get(q.lessonId);
      if (!q || !loc) return [];
      return [{ id: q.id, label: q.view.label, lesson: loc, href: `${loc.href}#q-${q.id.replace(/[^a-z0-9-]/gi, '-')}`, preview: plainPreview(q.prompt) }];
    });

  return (
    <div className="container-narrow">
      <PageHead title="Saved" lede="Lessons and questions you've bookmarked. Tap the bookmark on any lesson or question to add it here." />
      {lessons.length === 0 && questions.length === 0 ? (
        <EmptyState icon={<BookmarkIcon />} title="Nothing saved yet">
          <p>Save tricky questions or lessons you want to come back to.</p>
        </EmptyState>
      ) : (
        <div className="stack stack-xl">
          {lessons.length > 0 && (
            <section aria-labelledby="saved-lessons">
              <h2 id="saved-lessons" style={{ marginBottom: 12 }}>
                Lessons
              </h2>
              <ul className="list card card-pad list-rows">
                {lessons.map((l) => (
                  <li key={l.id}>
                    <Link href={l.href} className="list-row">
                      <BookIcon width={18} height={18} style={{ color: 'var(--text-3)', flex: 'none' }} />
                      <span className="grow">
                        <span style={{ display: 'block', fontWeight: 600 }}>{l.title}</span>
                        <span className="tiny faint">
                          {l.subjectName} · {l.topicCode} {l.topicTitle}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {questions.length > 0 && (
            <section aria-labelledby="saved-questions">
              <h2 id="saved-questions" style={{ marginBottom: 12 }}>
                Questions
              </h2>
              <ul className="list card card-pad list-rows">
                {questions.map((q) => (
                  <li key={q.id}>
                    <Link href={q.href} className="list-row">
                      <TargetIcon width={18} height={18} style={{ color: 'var(--text-3)', flex: 'none' }} />
                      <span className="grow">
                        <span style={{ display: 'block', fontWeight: 600 }}>{q.preview || q.label}</span>
                        <span className="tiny faint">
                          {q.label} · {q.lesson.title} · {q.lesson.subjectName}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
