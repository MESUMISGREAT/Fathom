import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/server/auth/session';
import { getEnrolled } from '@/server/queries/dashboard';
import { getPointsHistory, type PointsHistory } from '@/server/queries/points';
import { BadgeArt } from '@/components/art/BadgeArt';
import { LevelBlock } from '@/components/points/PointsViews';
import { getSyllabusTree, topicHref } from '@/server/queries/catalog';
import { EmptyState, MasteryBar, PageHead, StatusPill, SubjectTile } from '@/components/ui';
import { CheckIcon, InfoIcon } from '@/components/icons';
import type { MasteryState } from '@/domain/mastery';

export const metadata: Metadata = { title: 'Progress' };

export default async function ProgressPage() {
  const user = await requireUser('/progress');
  const showPoints = user.showPoints !== false;
  const [enrolled, history] = await Promise.all([getEnrolled(user.id), showPoints ? getPointsHistory(user.id) : null]);

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
      {history && <Profile h={history} />}
      {enrolled.length === 0 ? (
        <EmptyState art="progress" title="No subjects yet">
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
                <section key={subject.code} aria-labelledby={`p-${subject.code}`} className="card card-pad stack stack-lg" data-subject={subject.code}>
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
                      <div className="topic-list">
                        {started.map((tp) => {
                          const st = progress.topics.get(tp.id)!;
                          return (
                            <Link key={tp.id} href={topicHref(subject.slug, tp.code)} className="topic-row">
                              <span className="topic-code">{tp.code}</span>
                              <span className="grow">
                                <span style={{ display: 'block', fontWeight: 700 }}>{tp.title}</span>
                                <span className="tiny muted">
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
          <section className="panel stack stack-sm" aria-labelledby="grades">
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

const weekday = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'narrow', timeZone: 'UTC' });
const longDay = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });

/** The student's profile: level, badges earned, XP over the last two weeks and a quiet longest-run stat. */
function Profile({ h }: { h: PointsHistory }) {
  const earned = h.badges.filter((b) => b.earned);
  const max = Math.max(1, ...h.days.map((d) => d.xp));
  const activeDays = h.days.filter((d) => d.active).length;
  return (
    <section className="profile" aria-labelledby="profile-title" style={{ marginBottom: 44 }}>
      <h2 id="profile-title" className="visually-hidden">
        Your profile
      </h2>
      <div className="panel panel-yellow stack">
        <LevelBlock level={h.level} totalXp={h.totalXp} />
        <div className="quiet-stats">
          <span>
            Longest run <strong className="tabular">{h.streak.longest}</strong> {h.streak.longest === 1 ? 'day' : 'days'}
          </span>
          <span>
            <strong className="tabular">{activeDays}</strong> of the last 14 days studied
          </span>
        </div>
      </div>
      <div className="stack">
        <div className="stack stack-sm">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <h3>
              Badges <span className="muted tabular">{h.earnedCount}/{h.badges.length}</span>
            </h3>
            <Link href="/achievements" className="small">
              All achievements
            </Link>
          </div>
          {earned.length === 0 ? (
            <p className="small muted">None yet. Finish a lesson for your first one.</p>
          ) : (
            <ul className="profile-badges">
              {earned.map((b) => (
                <li key={b.id}>
                  <BadgeArt id={b.id} size={52} />
                  {b.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="stack stack-sm">
          <h3>XP, last 14 days</h3>
          <ol className="xp-days">
            {h.days.map((d) => (
              <li key={d.day} data-active={d.active || undefined} data-goal={d.goalMet || undefined}>
                <span className="bar-wrap" aria-hidden="true">
                  <span className="bar" style={{ height: `${Math.max(4, (100 * d.xp) / max)}%` }}>
                    {d.goalMet && <CheckIcon className="bar-goal" />}
                  </span>
                </span>
                <span className="day" aria-hidden="true">
                  {weekday(d.day)}
                </span>
                <span className="visually-hidden">
                  {longDay(d.day)}: {d.xp} XP{d.goalMet ? ', daily goal reached' : ''}
                </span>
              </li>
            ))}
          </ol>
          <p className="tiny muted">Bars are XP earned each day; a tick means the daily goal was reached.</p>
        </div>
      </div>
    </section>
  );
}
