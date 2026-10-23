import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, eq } from 'drizzle-orm';
import { getSessionUser } from '@/server/auth/session';
import { getDb } from '@/server/db';
import { enrollments } from '@/server/db/schema';
import { getSubject, getSyllabusTree, topicHref } from '@/server/queries/catalog';
import { getSubjectProgress } from '@/server/queries/progress';
import { EnrollControl } from '@/components/study/EnrollControl';
import { Crumbs, LevelBadge, pluralise, StatusPill } from '@/components/ui';
import { SubjectMotif } from '@/components/art/SubjectMotif';
import { ChevronRightIcon, ListIcon } from '@/components/icons';

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const s = await getSubject((await params).subject);
  return { title: s ? `${s.name} (${s.code})` : 'Subject' };
}

export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ subject: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const [{ subject: slug }, { level: levelParam }] = await Promise.all([params, searchParams]);
  const subject = await getSubject(slug);
  if (!subject) notFound();
  const user = await getSessionUser();
  const db = await getDb();
  const [enrolment] = user
    ? await db.select().from(enrollments).where(and(eq(enrollments.userId, user.id), eq(enrollments.subjectCode, subject.code)))
    : [];
  const level = levelParam === 'AS' || levelParam === 'A' ? levelParam : 'all';
  const [tree, progress] = await Promise.all([getSyllabusTree(subject.version.id), getSubjectProgress(user?.id ?? null, subject.version.id)]);
  const sections = tree.filter((s) => level === 'all' || s.level === level);
  // Group consecutive sections by strand, keeping syllabus order (9701 runs Physical, Inorganic,
  // Organic, Analysis at AS, then the same strands again at A Level).
  const groups: { strand: string | null; level: string; sections: typeof sections }[] = [];
  for (const s of sections) {
    const last = groups[groups.length - 1];
    if (last && last.strand === (s.strand ?? null)) last.sections.push(s);
    else groups.push({ strand: s.strand ?? null, level: s.level, sections: [s] });
  }
  const repeated = new Set(groups.map((g) => g.strand).filter((st, i, all) => st && all.indexOf(st) !== i));

  return (
    <div className="container">
      <header className="page-head" data-subject={subject.code}>
        <Crumbs items={[{ href: '/subjects', label: 'Subjects' }, { label: subject.name }]} />
        <div className="subject-hero">
          <div className="stack stack-md">
            <p className="eyebrow">
              Cambridge International AS &amp; A Level · {subject.code}
            </p>
            <h1>{subject.name}</h1>
            <p className="small muted">
              {pluralise(progress.summary.lessonsTotal, 'lesson')} so far · {progress.summary.withContent} of {progress.summary.objectives} objectives
              have lessons
            </p>
            <EnrollControl subjectCode={subject.code} subjectName={subject.shortName} enrolledLevel={enrolment?.targetLevel ?? null} signedIn={!!user} />
          </div>
          <div className="subject-hero-art" aria-hidden="true">
            <SubjectMotif code={subject.code} />
          </div>
        </div>
        <div className="notice small">
          <ListIcon />
          <span>
            Follows the official syllabus for examination in {subject.version.label} ({subject.version.sourceVersion}), checked against{' '}
            <a href={subject.version.sourceUrl} rel="noopener noreferrer" target="_blank" className="tap-inline">
              Cambridge&rsquo;s syllabus document
            </a>{' '}
            on {subject.version.checkedAt}.{' '}
            {subject.version.wording === 'paraphrased' && 'Objectives are paraphrased; the official document is the final word. '}
            <Link href={`/subjects/${subject.slug}/coverage`} className="tap-inline">
              See what&rsquo;s covered so far
            </Link>
          </span>
        </div>
      </header>

      <div className="row row-between" style={{ marginBottom: 24 }}>
        <nav className="segmented" aria-label="Filter by level">
          {[
            { key: 'all', label: 'Everything' },
            { key: 'AS', label: 'AS Level' },
            { key: 'A', label: 'A Level only' },
          ].map((f) => (
            <Link
              key={f.key}
              href={f.key === 'all' ? `/subjects/${subject.slug}` : `/subjects/${subject.slug}?level=${f.key}`}
              aria-current={level === f.key ? 'page' : undefined}
            >
              {f.label}
            </Link>
          ))}
        </nav>
      </div>

      {groups.map(({ strand, level: groupLevel, sections: groupSections }) => (
        <div key={`${strand ?? 'all'}-${groupSections[0]!.id}`} className="stack stack-lg" style={{ marginBottom: 32 }}>
          {strand && (
            <h2 className="h3 muted">
              {strand}
              {repeated.has(strand) && ` · ${groupLevel === 'A' ? 'A Level' : 'AS Level'}`}
            </h2>
          )}
          {groupSections.map((section) => (
              <section key={section.id} className="section-block" aria-labelledby={`sec-${section.code}`}>
                <div className="section-head">
                  <div className="row" style={{ ['--gap' as string]: '10px' }}>
                    <h2 id={`sec-${section.code}`}>
                      {subject.code === '9709' ? section.title : `${section.code} ${section.title}`}
                    </h2>
                    <LevelBadge level={section.level} />
                  </div>
                  <span className="tiny faint">{section.papers.join(', ')}</span>
                </div>
                <div className="topic-list" data-subject={subject.code}>
                  {section.topics.map((topic) => {
                    const tp = progress.topics.get(topic.id);
                    return (
                      <Link key={topic.id} href={topicHref(subject.slug, topic.code)} className="topic-row" data-empty={topic.lessons.length === 0 || undefined}>
                        <span className="topic-code">{topic.code}</span>
                        <span className="grow">
                          <span style={{ display: 'block', fontWeight: 700 }}>{topic.title}</span>
                          <span className="tiny muted">
                            {pluralise(topic.objectives.length, 'objective')} ·{' '}
                            {topic.lessons.length ? pluralise(topic.lessons.length, 'lesson') : 'lessons coming'}
                          </span>
                        </span>
                        <span className="topic-meta">
                          {user && topic.lessons.length > 0 && tp && <StatusPill state={tp.state} />}
                          <ChevronRightIcon width={18} height={18} className="topic-chevron" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
        </div>
      ))}
    </div>
  );
}
