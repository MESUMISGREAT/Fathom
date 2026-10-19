import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/server/auth/session';
import { getSubject, getTopic, lessonHref, topicCodeFromParam } from '@/server/queries/catalog';
import { getSubjectProgress } from '@/server/queries/progress';
import { Crumbs, LevelBadge, pluralise, StatusPill } from '@/components/ui';
import { CheckIcon, ChevronRightIcon, ClockIcon } from '@/components/icons';

type Params = Promise<{ subject: string; topic: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await params;
  const s = await getSubject(p.subject);
  const t = s ? await getTopic(s.version.id, topicCodeFromParam(p.topic)) : null;
  return { title: t ? `${t.topic.code} ${t.topic.title}` : 'Topic' };
}

export default async function TopicPage({ params }: { params: Params }) {
  const p = await params;
  const subject = await getSubject(p.subject);
  if (!subject) notFound();
  const found = await getTopic(subject.version.id, topicCodeFromParam(p.topic));
  if (!found) notFound();
  const { section, topic } = found;
  const user = await getSessionUser();
  const progress = await getSubjectProgress(user?.id ?? null, subject.version.id);
  const tp = progress.topics.get(topic.id);
  const lessonTitle = new Map(topic.lessons.map((l) => [l.id, l.title]));

  return (
    <div className="container-narrow" data-subject={subject.code}>
      <header className="page-head">
        <Crumbs
          items={[
            { href: '/subjects', label: 'Subjects' },
            { href: `/subjects/${subject.slug}`, label: subject.name },
            { label: `${topic.code} ${topic.title}` },
          ]}
        />
        <div className="row" style={{ ['--gap' as string]: '10px' }}>
          <span className="eyebrow">{subject.code === '9709' ? section.title : `${section.code} ${section.title}`}</span>
          <LevelBadge level={section.level} />
        </div>
        <div className="row row-between" style={{ alignItems: 'flex-start' }}>
          <h1 className="grow">
            <span className="hue-text tabular">{topic.code}</span> {topic.title}
          </h1>
          {user && tp && topic.lessons.length > 0 && <StatusPill state={tp.state} />}
        </div>
        {tp && (
          <p className="small muted">
            {tp.withContent} of {tp.objectives} objectives have lessons · {tp.studied} studied · {tp.secure} secure
          </p>
        )}
      </header>

      <section aria-labelledby="lessons-title" className="stack" style={{ marginBottom: 40 }}>
        <h2 id="lessons-title">Lessons</h2>
        {topic.lessons.length === 0 ? (
          <div className="card card-pad">
            <p className="muted">
              Lessons for this topic haven&rsquo;t been written yet. The objectives below show exactly what the syllabus expects, so you can
              plan with them in the meantime.
            </p>
          </div>
        ) : (
          <ol className="list stack stack-md lesson-path">
            {topic.lessons.map((l, i) => {
              const st = progress.lessons.get(l.id)?.status ?? 'not-started';
              return (
                <li key={l.id}>
                  <Link href={lessonHref(subject.slug, topic.code, l.id)} className="card card-pad lesson-card">
                    <span className="lesson-num" data-status={st} aria-hidden="true">
                      {st === 'completed' ? <CheckIcon /> : i + 1}
                    </span>
                    <span className="stack stack-xs">
                      <span className="h3" style={{ fontSize: '1.15rem' }}>{l.title}</span>
                      <span className="small muted">{l.summary}</span>
                      <span className="tiny faint row" style={{ ['--gap' as string]: '6px' }}>
                        <ClockIcon width={14} height={14} /> {l.minutes} min
                        {l.kind === 'enrichment' && <span className="badge">Beyond the syllabus</span>}
                        <span className="visually-hidden">
                          {st === 'completed' ? ', finished' : st === 'in-progress' ? ', in progress' : ', not started'}
                        </span>
                      </span>
                    </span>
                    <ChevronRightIcon className="chev" width={22} height={22} />
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <section aria-labelledby="objectives-title">
        <div className="section-head">
          <h2 id="objectives-title">Syllabus objectives</h2>
          <span className="tiny faint">{pluralise(topic.objectives.length, 'objective')}</span>
        </div>
        <p className="small muted" style={{ marginBottom: 12 }}>
          What Cambridge says you should be able to do, in our words. Codes are the topic number plus the objective&rsquo;s position.
        </p>
        <div className="card card-pad objective-list">
          {topic.objectives.map((o) => {
            const op = progress.objectives.get(o.id);
            const teaching = (op?.lessonIds ?? []).map((id) => lessonTitle.get(id)).filter(Boolean);
            return (
              <div key={o.id} className="objective">
                <span className="objective-code">{o.code}</span>
                <div className="stack stack-xs">
                  <p>{o.text}</p>
                  {o.guidance && <p className="small faint">{o.guidance}</p>}
                  <p className="tiny faint">
                    {teaching.length ? `Taught in: ${teaching.join(', ')}` : 'No lesson yet'}
                    {op && op.questionCount > 0 && ` · ${pluralise(op.questionCount, 'question')}`}
                  </p>
                </div>
                <div>{user && op && (teaching.length > 0 || op.questionCount > 0) && <StatusPill state={op.mastery.state} />}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
