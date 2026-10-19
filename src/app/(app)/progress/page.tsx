import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/server/auth/session';
import { getEnrolled } from '@/server/queries/dashboard';
import { getSyllabusTree, topicHref } from '@/server/queries/catalog';
import { EmptyState, MasteryBar, PageHead, StatusPill, SubjectTile } from '@/components/ui';
import { ChartIcon, InfoIcon } from '@/components/icons';
import type { MasteryState } from '@/domain/mastery';

export const metadata: Metadata = { title: 'Progress' };

export default async function ProgressPage() {
  const user = await requireUser('/progress');
  const enrolled = await getEnrolled(user.id);

  return (
    <div className="container">
      <PageHead
        title="Progress"
        lede={
          <>
            Based on what you&rsquo;ve actually answered, not time spent. <Link href="/about#progress">How statuses are decided</Link>
          </>
        }
      />
      {enrolled.length === 0 ? (
        <EmptyState icon={<ChartIcon />} title="No subjects yet">
          <Link href="/subjects" className="btn btn-primary">
            Choose subjects
          </Link>
        </EmptyState>
      ) : (
        <div className="stack stack-xl">
          {await Promise.all(
            enrolled.map(async ({ subject, targetLevel, progress }) => {
              const tree = (await getSyllabusTree(subject.version.id)).filter((s) => targetLevel === 'A' || s.level === 'AS');
              const counts: Partial<Record<MasteryState, number>> = {};
              for (const o of progress.objectives.values()) {
                if (targetLevel === 'AS' && o.level === 'A') continue;
                counts[o.mastery.state] = (counts[o.mastery.state] ?? 0) + 1;
              }
              const s = progress.summary;
              const pct = (n: number) => (s.objectives ? Math.round((100 * n) / s.objectives) : 0);
              const started = tree.flatMap((sec) => sec.topics).filter((tp) => progress.topics.get(tp.id)?.state !== 'not-started');
              return (
                <section key={subject.code} aria-labelledby={`p-${subject.code}`} className="card card-pad stack stack-lg">
                  <div className="row row-nowrap">
                    <SubjectTile code={subject.code} />
                    <div className="grow">
                      <h2 id={`p-${subject.code}`}>{subject.name}</h2>
                      <p className="tiny faint">
                        Aiming for {targetLevel === 'AS' ? 'AS Level' : 'A Level'} · syllabus {subject.version.label}
                      </p>
                    </div>
                  </div>
                  <div className="row" style={{ ['--gap' as string]: '36px' }}>
                    <div className="stat">
                      <span className="stat-value">{pct(s.studied)}%</span>
                      <span className="stat-label">objectives studied ({s.studied}/{s.objectives})</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{pct(s.practised)}%</span>
                      <span className="stat-label">practised</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{pct(s.secure)}%</span>
                      <span className="stat-label">secure</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{s.needsRevision}</span>
                      <span className="stat-label">need revision</span>
                    </div>
                  </div>
                  <MasteryBar counts={counts} total={s.objectives} />
                  {s.withContent < s.objectives && (
                    <p className="notice small">
                      <InfoIcon />
                      <span>
                        Lessons cover {s.withContent} of the {s.objectives} objectives in your syllabus so far, so a full picture isn&rsquo;t possible yet.{' '}
                        <Link href={`/subjects/${subject.slug}/coverage`}>See coverage</Link>
                      </span>
                    </p>
                  )}
                  <div>
                    <h3 style={{ marginBottom: 8 }}>Topics you&rsquo;ve started</h3>
                    {started.length === 0 ? (
                      <p className="small muted">None yet.</p>
                    ) : (
                      <div className="card" style={{ overflow: 'hidden' }}>
                        {started.map((tp) => {
                          const st = progress.topics.get(tp.id)!;
                          return (
                            <Link key={tp.id} href={topicHref(subject.slug, tp.code)} className="topic-row">
                              <span className="topic-code">{tp.code}</span>
                              <span className="grow">
                                <span style={{ display: 'block', fontWeight: 600 }}>{tp.title}</span>
                                <span className="tiny faint">
                                  {st.secure}/{st.withContent} objectives secure · {st.studied} studied
                                </span>
                              </span>
                              <span className="topic-meta">
                                <StatusPill state={st.state} />
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </section>
              );
            }),
          )}
          <section className="card card-pad stack stack-sm" aria-labelledby="grades">
            <div className="row row-between">
              <h2 id="grades" className="h3">
                Estimated grades
              </h2>
              <span className="badge">Planned</span>
            </div>
            <p className="small muted">
              Grade estimates are not available yet. They will need full, timed practice papers marked against mark schemes, and will be shown
              as a range with the uncertainty explained, separate from what you&rsquo;ve demonstrated so far. They will never be presented as
              official Cambridge results.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
