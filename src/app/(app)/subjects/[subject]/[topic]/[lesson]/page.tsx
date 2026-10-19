import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { and, eq, inArray } from 'drizzle-orm';
import { getSessionUser } from '@/server/auth/session';
import { getDb } from '@/server/db';
import { bookmarks, lessonProgress } from '@/server/db/schema';
import { getLesson, getSubject, getTopic, lessonHref, topicCodeFromParam, topicHref, lessonsInOrder } from '@/server/queries/catalog';
import type { RenderedBlock } from '@/content/rendered';
import { BlockView } from '@/components/lesson/Blocks';
import { LessonPlayer, type PlayerStep } from '@/components/lesson/LessonPlayer';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { BookmarkButton } from '@/components/study/BookmarkButton';
import { ReportProblem } from '@/components/study/ReportProblem';
import { ClockIcon, TargetIcon } from '@/components/icons';
import { Crumbs, LevelBadge, ProvenanceLabel } from '@/components/ui';

type Params = Promise<{ subject: string; topic: string; lesson: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const found = await getLesson((await params).lesson);
  return { title: found?.lesson.title ?? 'Lesson', description: found?.lesson.summary };
}

export default async function LessonPage({ params }: { params: Params }) {
  const p = await params;
  const subject = await getSubject(p.subject);
  if (!subject) notFound();
  const topicFound = await getTopic(subject.version.id, topicCodeFromParam(p.topic));
  const found = await getLesson(p.lesson);
  if (!topicFound || !found || found.lesson.topicId !== topicFound.topic.id) notFound();
  const { section, topic } = topicFound;
  const { lesson, questions, objectives } = found;

  const user = await getSessionUser();
  const db = await getDb();
  const [progressRow, saved] = user
    ? await Promise.all([
        db.select().from(lessonProgress).where(and(eq(lessonProgress.userId, user.id), eq(lessonProgress.lessonId, lesson.id))),
        db
          .select({ kind: bookmarks.kind, targetId: bookmarks.targetId })
          .from(bookmarks)
          .where(and(eq(bookmarks.userId, user.id), inArray(bookmarks.targetId, [lesson.id, ...questions.map((q) => q.id)]))),
      ])
    : [[], []];
  const savedSet = new Set(saved.map((b) => `${b.kind}:${b.targetId}`));
  const progress = progressRow[0];

  // Next lesson in syllabus order.
  const ordered = await lessonsInOrder(subject.version.id);
  const idx = ordered.findIndex((l) => l.id === lesson.id);
  const nextLesson = idx >= 0 ? ordered[idx + 1] : undefined;
  const next = nextLesson ? { href: lessonHref(subject.slug, nextLesson.topic.code, nextLesson.id), title: nextLesson.title } : undefined;

  // Split blocks into steps that each end with a check.
  const views = new Map(questions.map((q) => [q.id, q]));
  const steps: PlayerStep[] = [];
  let current: RenderedBlock[] = [];
  const flush = (check?: Extract<RenderedBlock, { type: 'check' }>) => {
    if (!current.length && !check) return;
    const blocks = current;
    const ids = (check?.questionIds ?? []).filter((id) => views.has(id));
    let n = steps.reduce((s, st) => s + st.questionIds.length, 0);
    steps.push({
      questionIds: ids,
      content: (
        <>
          {blocks.map((b, i) => (b.type === 'check' ? null : <BlockView key={i} block={b} />))}
          {check && ids.length > 0 && (
            <div className="check" role="group" aria-label={check.title ?? 'Quick check'}>
              <div className="check-head">
                <TargetIcon /> {check.title ?? 'Quick check'}
              </div>
              {ids.map((id) => (
                <QuestionCard
                  key={id}
                  view={views.get(id)!}
                  context="lesson"
                  number={++n}
                  signedIn={!!user}
                  bookmarked={savedSet.has(`question:${id}`)}
                />
              ))}
            </div>
          )}
        </>
      ),
    });
    current = [];
  };
  for (const b of lesson.blocks) {
    if (b.type === 'check') flush(b);
    else current.push(b);
  }
  flush();

  return (
    <div className="container-narrow">
      <LessonPlayer
        lessonId={lesson.id}
        steps={steps}
        initialStep={progress?.stepReached ?? 0}
        completed={!!progress?.completedAt}
        mode={user?.lessonMode ?? 'steps'}
        signedIn={!!user}
        topicHref={topicHref(subject.slug, topic.code)}
        topicLabel={`${topic.code} ${topic.title}`}
        title={lesson.title}
        next={next}
        header={
          <header className="lesson-head">
            <Crumbs
              items={[
                { href: `/subjects/${subject.slug}`, label: subject.name },
                { href: topicHref(subject.slug, topic.code), label: `${topic.code} ${topic.title}` },
              ]}
            />
            <h1>{lesson.title}</h1>
            <div className="row" style={{ ['--gap' as string]: '10px' }}>
              <span className="tiny faint row" style={{ ['--gap' as string]: '4px' }}>
                <ClockIcon width={14} height={14} /> {lesson.minutes} min
              </span>
              <LevelBadge level={section.level} />
              {lesson.kind === 'enrichment' && <span className="badge">Beyond the syllabus</span>}
              {objectives.map((o) => (
                <span key={o.id} className="chip" title={o.text}>
                  {o.code}
                </span>
              ))}
            </div>
            <div className="row" style={{ ['--gap' as string]: '16px' }}>
            <ProvenanceLabel provenance={lesson.provenance} />
            <ReportProblem kind="lesson" targetId={lesson.id} />
          </div>
          </header>
        }
        bookmark={user ? <BookmarkButton kind="lesson" targetId={lesson.id} initial={savedSet.has(`lesson:${lesson.id}`)} label="Save lesson" /> : null}
      />
    </div>
  );
}
