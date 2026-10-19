import Link from 'next/link';
import { getSessionUser } from '@/server/auth/session';
import { getDashboard, type Dashboard } from '@/server/queries/dashboard';
import { lessonsInOrder, lessonHref, listSubjects } from '@/server/queries/catalog';
import { BRAND } from '@/lib/brand';
import {
  ArrowRightIcon,
  BookIcon,
  ChartIcon,
  CheckCircleIcon,
  FlagIcon,
  LayersIcon,
  PlayIcon,
  RefreshIcon,
  RepeatIcon,
  ShieldIcon,
  TargetIcon,
} from '@/components/icons';
import { EmptyState, MasteryBar, pluralise, Ring, SubjectTile } from '@/components/ui';
import type { MasteryState } from '@/domain/mastery';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const user = await getSessionUser();
  if (!user) return <Landing deleted={(await searchParams).deleted === '1'} />;
  const d = await getDashboard(user.id);
  return <DashboardView name={user.displayName} d={d} />;
}

function NextCard({ next }: { next: Dashboard['next'] }) {
  let title: string;
  let detail: string | null = null;
  let href: string;
  let cta: string;
  switch (next.kind) {
    case 'choose-subject':
      title = 'Choose your subjects';
      href = '/subjects';
      cta = 'Choose subjects';
      break;
    case 'review':
      title = `Review ${pluralise(next.count, 'question')}`;
      detail = 'About a minute each';
      href = next.href;
      cta = 'Start review';
      break;
    case 'resume':
    case 'start':
      title = next.lesson.title;
      detail = `${next.lesson.subjectName} · ${next.lesson.topicTitle} · ${next.lesson.minutes} min`;
      href = next.lesson.href;
      cta = next.kind === 'resume' ? 'Continue lesson' : 'Start lesson';
      break;
    case 'revisit':
      title = next.lesson.title;
      detail = `Objective ${next.lesson.objectiveCode}`;
      href = next.lesson.href;
      cta = 'Take another look';
      break;
    case 'all-done':
      title = 'All caught up';
      href = '/subjects';
      cta = 'Browse the syllabus';
      break;
  }
  return (
    <section className="card card-pad card-hero" aria-labelledby="next-title">
      <div className="stack stack-md">
        <p className="eyebrow">Up next for you</p>
        <div className="stack stack-xs">
          <h2 id="next-title" className="h1" style={{ fontSize: 'clamp(1.4rem, 1.2rem + 0.8vw, 1.75rem)' }}>
            {title}
          </h2>
          {detail && <p className="muted">{detail}</p>}
        </div>
        <p className="small muted">{next.reason}</p>
        <div>
          <Link href={href} className="btn btn-primary btn-lg">
            {next.kind === 'review' ? <RepeatIcon /> : <PlayIcon />}
            {cta}
          </Link>
        </div>
      </div>
    </section>
  );
}

function DashboardView({ name, d }: { name: string | null; d: Dashboard }) {
  const accuracy = d.week.answered ? Math.round((100 * d.week.correct) / d.week.answered) : null;
  return (
    <div className="container stack stack-xl">
      <header className="stack stack-xs">
        <h1>{name ? `Welcome back, ${name}` : 'Welcome back'}</h1>
        <p className="muted">Small steps add up. Here&rsquo;s where you are.</p>
      </header>

      <NextCard next={d.next} />

      {d.enrolled.length === 0 ? (
        <EmptyState icon={<BookIcon />} title="No subjects yet">
          <p>Pick the subjects you&rsquo;re taking and we&rsquo;ll lay out the syllabus for you.</p>
          <Link className="btn btn-primary" href="/subjects">
            Choose subjects
          </Link>
        </EmptyState>
      ) : (
        <>
          <section aria-labelledby="week-title">
            <div className="section-head">
              <h2 id="week-title">Last 7 days</h2>
            </div>
            <div className="card card-pad">
              <div className="row" style={{ ['--gap' as string]: '40px' }}>
                <div className="stat">
                  <span className="stat-value">{d.week.answered}</span>
                  <span className="stat-label">questions answered</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{accuracy === null ? '–' : `${accuracy}%`}</span>
                  <span className="stat-label">fully correct</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{d.week.lessonsCompleted}</span>
                  <span className="stat-label">lessons finished</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{d.dueCount}</span>
                  <span className="stat-label">due for review</span>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="subjects-title">
            <div className="section-head">
              <h2 id="subjects-title">Your subjects</h2>
              <Link href="/progress" className="small">
                All progress
              </Link>
            </div>
            <div className="grid-2">
              {d.enrolled.map(({ subject, targetLevel, progress }) => {
                const s = progress.summary;
                const counts: Partial<Record<MasteryState, number>> = {};
                for (const o of progress.objectives.values()) {
                  if (targetLevel === 'AS' && o.level === 'A') continue;
                  counts[o.mastery.state] = (counts[o.mastery.state] ?? 0) + 1;
                }
                return (
                  <Link key={subject.code} href={`/subjects/${subject.slug}`} className="card card-pad">
                    <div className="stack">
                      <div className="row row-nowrap">
                        <SubjectTile code={subject.code} />
                        <div className="grow">
                          <h3>{subject.name}</h3>
                          <p className="tiny faint">
                            {subject.code} · {subject.version.label} · aiming for {targetLevel === 'AS' ? 'AS Level' : 'A Level'}
                          </p>
                        </div>
                        <Ring value={s.objectives ? (100 * s.studied) / s.objectives : 0} label="Syllabus studied" size={52} />
                      </div>
                      <MasteryBar counts={counts} total={s.objectives} />
                      <p className="tiny muted">
                        {s.studied} of {s.objectives} syllabus objectives studied · lessons cover {s.withContent} so far
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="grid-2">
            <section aria-labelledby="revisit-title" className="card card-pad">
              <div className="section-head">
                <h2 id="revisit-title" className="h3">
                  Worth another look
                </h2>
              </div>
              {d.revisit.length === 0 ? (
                <p className="small muted">Nothing flagged. When answers on a topic start slipping, it&rsquo;ll show up here.</p>
              ) : (
                <ul className="list list-rows">
                  {d.revisit.map((r) => (
                    <li key={r.lessonId}>
                      <Link className="list-row" href={r.href}>
                        <RefreshIcon width={18} height={18} style={{ color: 'var(--st-revision)', flex: 'none' }} />
                        <span className="grow">
                          <span style={{ display: 'block', fontWeight: 600 }}>{r.title}</span>
                          <span className="tiny faint">
                            {r.subjectName} · {r.topicTitle} · objective {r.objectiveCode}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section aria-labelledby="upnext-title" className="card card-pad">
              <div className="section-head">
                <h2 id="upnext-title" className="h3">
                  Coming up
                </h2>
              </div>
              {d.upNext.length === 0 ? (
                <p className="small muted">No new lessons waiting in your subjects right now.</p>
              ) : (
                <ul className="list list-rows">
                  {d.upNext.map((l) => (
                    <li key={l.id}>
                      <Link className="list-row" href={l.href}>
                        <FlagIcon width={18} height={18} style={{ color: 'var(--text-3)', flex: 'none' }} />
                        <span className="grow">
                          <span style={{ display: 'block', fontWeight: 600 }}>{l.title}</span>
                          <span className="tiny faint">
                            {l.subjectName} · {l.topicTitle} · {l.minutes} min
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="grid-2">
            <section aria-labelledby="recent-title" className="card card-pad">
              <div className="section-head">
                <h2 id="recent-title" className="h3">
                  Recent results
                </h2>
                <Link href="/history" className="small">
                  History
                </Link>
              </div>
              {d.recent.length === 0 ? (
                <p className="small muted">Answer a few questions and your results will appear here.</p>
              ) : (
                <ul className="list list-rows">
                  {d.recent.map((r) => (
                    <li key={r.lessonId}>
                      <Link className="list-row" href={r.href}>
                        <CheckCircleIcon width={18} height={18} style={{ color: 'var(--good)', flex: 'none' }} />
                        <span className="grow">
                          <span style={{ display: 'block', fontWeight: 600 }}>{r.title}</span>
                          <span className="tiny faint">{r.subjectName}</span>
                        </span>
                        <span className="small tabular muted">
                          {r.correct}/{r.answered} correct
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section aria-labelledby="grade-title" className="card card-pad">
              <div className="section-head">
                <h2 id="grade-title" className="h3">
                  Estimated grades
                </h2>
                <span className="badge">Not available yet</span>
              </div>
              <p className="small muted">
                We won&rsquo;t guess a grade from short recall questions. Grade estimates need full, timed practice papers, and they&rsquo;ll
                arrive with exam practice. Even then, they&rsquo;ll be ranges with honest uncertainty, not promises.
              </p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

async function Landing({ deleted }: { deleted: boolean }) {
  const subjects = await listSubjects();
  const first = subjects[0] ? (await lessonsInOrder(subjects[0].version.id))[0] : undefined;
  const tryHref = first && subjects[0] ? lessonHref(subjects[0].slug, first.topic.code, first.id) : '/subjects';
  return (
    <div className="container stack stack-xl">
      {deleted && (
        <p className="form-ok" role="status">
          Your account and all of its data have been deleted.
        </p>
      )}
      <section className="landing-hero" style={{ marginTop: 24 }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>
          Cambridge International AS &amp; A Level
        </p>
        <h1 className="display">A Level, one small idea at a time.</h1>
        <p className="lede">
          Short, clear lessons mapped to the official Cambridge syllabus, with quick questions after each idea so you know you&rsquo;ve
          actually got it.
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link href="/signup" className="btn btn-primary btn-lg">
            Start for free
          </Link>
          <Link href={tryHref} className="btn btn-lg">
            Try a lesson <ArrowRightIcon />
          </Link>
        </div>
      </section>

      <section aria-labelledby="subjects-title">
        <div className="section-head">
          <h2 id="subjects-title">Subjects</h2>
        </div>
        <div className="grid-cards">
          {subjects.map((s) => (
            <Link key={s.code} href={`/subjects/${s.slug}`} className="card card-pad">
              <div className="stack stack-md">
                <SubjectTile code={s.code} large />
                <div>
                  <h3>{s.name}</h3>
                  <p className="tiny faint">
                    {s.code} · syllabus for {s.version.label}
                  </p>
                </div>
                <p className="small muted">{s.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-title" className="stack">
        <h2 id="how-title">How {BRAND} works</h2>
        <div className="feature-grid">
          {[
            { icon: <LayersIcon />, title: 'One idea per lesson', body: 'Two to five minutes each. Explanations, worked examples, diagrams and the exact wording examiners look for.' },
            { icon: <TargetIcon />, title: 'Check yourself as you go', body: 'Quick questions straight after each idea, with feedback that explains why, not just whether.' },
            { icon: <ChartIcon />, title: 'Progress you can trust', body: 'Topics are marked secure only after several right answers on different days. No streaks, no guilt.' },
            { icon: <ShieldIcon />, title: 'Mapped to the syllabus', body: 'Every lesson links to the official syllabus objectives it teaches, so you can see exactly what’s covered.' },
          ].map((f) => (
            <div key={f.title} className="card card-pad">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="small muted" style={{ marginTop: 6 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="card card-pad stack stack-md" aria-labelledby="status-title">
        <h2 id="status-title" className="h3">
          What&rsquo;s here today
        </h2>
        <p className="small muted">
          {BRAND} is early. Today you get the full syllabus structure for four subjects, a first set of lessons in each, instant-feedback
          questions, spaced review and progress tracking. Exam-style practice, an AI tutor that can read photos of your working, and grade
          estimates are planned next, and we&rsquo;ll label them clearly when they arrive. <Link href="/about">How we make and check content</Link>
        </p>
      </section>
    </div>
  );
}
