import { Fragment } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { and, eq, inArray, isNotNull } from 'drizzle-orm';
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
import { CheckIcon, ClockIcon, TargetIcon } from '@/components/icons';
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

  // Previous and next lessons in syllabus order, and this topic's lessons for the lesson menu.
  const ordered = await lessonsInOrder(subject.version.id);
  const idx = ordered.findIndex((l) => l.id === lesson.id);
  const link = (l: (typeof ordered)[number] | undefined) => (l ? { href: lessonHref(subject.slug, l.topic.code, l.id), title: l.title } : undefined);
  const next = idx >= 0 ? link(ordered[idx + 1]) : undefined;
  const prev = idx > 0 ? link(ordered[idx - 1]) : undefined;
  const inTopic = ordered.filter((l) => l.topic.id === topic.id);
  const finished =
    user && ordered.length
      ? new Set(
          (
            await db
              .select({ lessonId: lessonProgress.lessonId })
              .from(lessonProgress)
              .where(and(eq(lessonProgress.userId, user.id), inArray(lessonProgress.lessonId, ordered.map((l) => l.id)), isNotNull(lessonProgress.completedAt)))
          ).map((r) => r.lessonId),
        )
      : new Set<string>();
  const topicLessons = inTopic.map((l) => ({ id: l.id, ...link(l)!, done: finished.has(l.id) }));
  // The completion card's main button: the next lesson with work left. First the rest of this topic (after this lesson,
  // then any skipped earlier), then the next unfinished lesson after this topic; none means "back to the topic".
  const open = (l: (typeof ordered)[number]) => l.id !== lesson.id && !finished.has(l.id);
  const topicStart = ordered.findIndex((l) => l.topic.id === topic.id);
  const afterTopic = topicStart >= 0 ? ordered.slice(topicStart + inTopic.length) : [];
  const completionNext = link(
    ordered.slice(idx + 1).find((l) => l.topic.id === topic.id && open(l)) ?? inTopic.find(open) ?? afterTopic.find(open),
  );

  // Split blocks into steps that each end with a check.
  const views = new Map(questions.map((q) => [q.id, q]));
  const steps: PlayerStep[] = [];
  let current: Array<Exclude<RenderedBlock, { type: 'check' }>> = [];
  const flush = (check?: Extract<RenderedBlock, { type: 'check' }>) => {
    if (!current.length && !check) return;
    const blocks = current;
    const ids = (check?.questionIds ?? []).filter((id) => views.has(id));
    let n = steps.reduce((s, st) => s + st.questionIds.length, 0);
    steps.push({
      questionIds: ids,
      // These elements cross to the client inside an array of steps: the Fragment and every child in it are keyed.
      content: (
        <Fragment key={`step-${steps.length}`}>
          {[
            ...blocks.map((b, i) => <BlockView key={`b${i}`} block={b} />),
            ...(check && ids.length > 0
              ? [
                  <div key="check" className="check" role="group" aria-label={check.title ?? 'Quick check'}>
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
                  </div>,
                ]
              : []),
          ]}
        </Fragment>
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
        subjectCode={subject.code}
        steps={steps}
        initialStep={progress?.stepReached ?? 0}
        completed={!!progress?.completedAt}
        mode={user?.lessonMode ?? 'steps'}
        signedIn={!!user}
        topicHref={topicHref(subject.slug, topic.code)}
        topicLabel={`${topic.code} ${topic.title}`}
        title={lesson.title}
        next={next}
        prev={prev}
        completionNext={completionNext}
        topicLessons={topicLessons}
        // Keyed: LessonPlayer renders these inside lists of children, and a refresh after a server action can stream
        // them as lazy references, which skip React's "static child" marking (a dev-only key warning otherwise).
        header={
          <header key="lesson-head" className="lesson-head">
            <Crumbs
              items={[
                { href: `/subjects/${subject.slug}`, label: subject.name },
                { href: topicHref(subject.slug, topic.code), label: `${topic.code} ${topic.title}` },
              ]}
            />
            <h1>{lesson.title}</h1>
            <div className="lesson-meta">
              {progress?.completedAt && (
                <span className="lesson-done-flag">
                  <CheckIcon aria-hidden="true" /> Finished
                </span>
              )}
              <span className="meta-time">
                <ClockIcon aria-hidden="true" /> {lesson.minutes} min
              </span>
              <LevelBadge level={section.level} />
              {lesson.kind === 'enrichment' && <span className="badge">Beyond the syllabus</span>}
              {objectives.map((o) => (
                <span key={o.id} className="chip" title={o.text}>
                  {o.code}
                </span>
              ))}
            </div>
            <div className="lesson-foot-links">
              <ProvenanceLabel provenance={lesson.provenance} />
              <ReportProblem kind="lesson" targetId={lesson.id} />
            </div>
          </header>
        }
        bookmark={user ? <BookmarkButton key="bookmark" kind="lesson" targetId={lesson.id} initial={savedSet.has(`lesson:${lesson.id}`)} label="Save lesson" /> : null}
      />
    </div>
  );
}
