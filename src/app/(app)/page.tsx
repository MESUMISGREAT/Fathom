import Link from 'next/link';
import { getSessionUser } from '@/server/auth/session';
import { getDashboard, type Dashboard } from '@/server/queries/dashboard';
import { getPointsSummary, type PointsSummary } from '@/server/queries/points';
import { lessonsInOrder, lessonHref, listSubjects } from '@/server/queries/catalog';
import { BRAND } from '@/lib/brand';
import { ArrowRightIcon, CheckCircleIcon, CheckIcon, FlagIcon, HalfCircleIcon, PlayIcon, RefreshIcon, RepeatIcon, StarFilledIcon } from '@/components/icons';
import { EmptyState, pluralise, Ring } from '@/components/ui';
import { SubjectMotif } from '@/components/art/SubjectMotif';
import { Spot } from '@/components/art/Spot';
import { BadgeArt } from '@/components/art/BadgeArt';
import { LevelBlock, WeekDots } from '@/components/points/PointsViews';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const user = await getSessionUser();
  if (!user) return <Landing deleted={(await searchParams).deleted === '1'} />;
  const showPoints = user.showPoints !== false;
  // The summary is always loaded: days studied this week stay on Home with points hidden (only XP and badges go).
  const [d, summary] = await Promise.all([getDashboard(user.id), getPointsSummary(user.id)]);
  return <DashboardView name={user.displayName} d={d} summary={summary} showPoints={showPoints} />;
}

const SMALL = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const countWord = (n: number) => SMALL[n] ?? String(n);
/** "1.2 Functions" → "Functions". */
const topicName = (t: string) => t.replace(/^[\d.]+\s+/, '');

/** One short line that reacts to what's going on. */
function welcomeLine(d: Dashboard): string {
  const reviews = d.dueCount > 0 ? `${countWord(d.dueCount)} ${d.dueCount === 1 ? 'review' : 'reviews'} waiting` : null;
  switch (d.next.kind) {
    case 'choose-subject':
      return 'Pick your subjects and we’ll lay out the syllabus.';
    case 'review':
      return d.resume ? `${reviews}, then back to ${topicName(d.resume.topicTitle)}.` : `${reviews}. A quick round helps them stick.`;
    case 'resume':
      return `Picking up ${topicName(d.next.lesson.topicTitle)}${reviews ? ` · ${reviews}` : ''}.`;
    case 'start':
      return d.week.lessonsCompleted === 0 && d.recent.length === 0
        ? `First up: ${topicName(d.next.lesson.topicTitle)}.`
        : `Next up: ${topicName(d.next.lesson.topicTitle)}${reviews ? ` · ${reviews}` : ''}.`;
    case 'revisit':
      return `${d.next.lesson.title} is worth another look${reviews ? ` · ${reviews}` : ''}.`;
    case 'all-done':
      return reviews ? `${reviews}.` : 'All caught up. Nice.';
  }
}

function ContinueCard({ next, resume, subjectCode }: { next: Dashboard['next']; resume: Dashboard['resume']; subjectCode: string | null }) {
  let eyebrow = 'Up next';
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
      eyebrow = 'Review';
      title = `Review ${pluralise(next.count, 'question')}`;
      detail = 'About a minute each';
      href = next.href;
      cta = 'Start review';
      break;
    case 'resume':
    case 'start':
      eyebrow = next.kind === 'resume' ? 'Continue' : 'Up next';
      title = next.lesson.title;
      detail = `${next.lesson.subjectName} · ${next.lesson.topicTitle} · ${next.lesson.minutes} min`;
      href = next.lesson.href;
      cta = next.kind === 'resume' ? 'Continue lesson' : 'Start lesson';
      break;
    case 'revisit':
      eyebrow = 'Worth another look';
      title = next.lesson.title;
      detail = `Objective ${next.lesson.objectiveCode}`;
      href = next.lesson.href;
      cta = 'Take another look';
      break;
    case 'all-done':
      eyebrow = 'All caught up';
      title = 'Browse the syllabus';
      href = '/subjects';
      cta = 'Browse the syllabus';
      break;
  }
  const art =
    next.kind === 'review' ? <Spot name="review" size={150} /> : subjectCode ? <SubjectMotif code={subjectCode} /> : <Spot name="subjects" size={150} />;
  return (
    <section className="continue-card" aria-labelledby="next-title" data-subject={subjectCode ?? undefined}>
      <div className="continue-body">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id="next-title" className="continue-title">
          {title}
        </h2>
        {detail && <p className="muted">{detail}</p>}
        {/* The welcome line already says why reviews come first. */}
        {next.kind !== 'review' && <p className="small muted">{next.reason}</p>}
        <div className="continue-cta">
          <Link href={href} className="btn btn-primary btn-lg">
            {next.kind === 'review' ? <RepeatIcon /> : <PlayIcon />}
            {cta}
          </Link>
        </div>
        {resume && (
          <p className="continue-also small">
            <span className="muted">Or pick up </span>
            <Link href={resume.href} className="tap-pad">
              {resume.title}
            </Link>
            <span className="muted"> · {resume.subjectName}</span>
          </p>
        )}
      </div>
      <div className="continue-art" aria-hidden="true">
        {art}
      </div>
    </section>
  );
}

function MePanel({ summary, showPoints }: { summary: PointsSummary; showPoints: boolean }) {
  const { today } = summary;
  if (!showPoints) {
    return (
      <section className="me-panel me-panel-quiet" aria-label="Days studied this week">
        <WeekDots today={today.day} studied={summary.daysThisWeek} />
      </section>
    );
  }
  return (
    <section className="me-panel" aria-labelledby="me-title">
      <h2 id="me-title" className="visually-hidden">
        Your XP
      </h2>
      <LevelBlock level={summary.level} totalXp={summary.totalXp} />
      {today.goal > 0 && (
        <div className="goal-row">
          <Ring value={(100 * Math.min(today.xp, today.goal)) / today.goal} label="Daily goal" size={48} />
          <p className="small">
            <strong className="tabular">
              {today.xp} / {today.goal} XP
            </strong>{' '}
            <span className="muted">{today.goalMet ? 'today. Goal reached.' : 'towards today’s goal'}</span>
          </p>
        </div>
      )}
      <WeekDots today={today.day} studied={summary.daysThisWeek} />
      {summary.latestBadges.length > 0 && (
        <div className="unlocks">
          <div className="row row-between">
            <h3 className="small" style={{ fontWeight: 800 }}>
              Recent unlocks
            </h3>
            <Link href="/achievements" className="tiny tap-pad" style={{ fontWeight: 700 }}>
              All achievements
            </Link>
          </div>
          <ul className="unlock-list">
            {summary.latestBadges.map((b) => (
              <li key={b.id}>
                <BadgeArt id={b.id} size={32} />
                {b.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {summary.latestBadges.length === 0 && (
        <p className="tiny muted">
          Badges unlock as you go. <Link href="/achievements">See what you can earn</Link>
        </p>
      )}
    </section>
  );
}

function DashboardView({ name, d, summary, showPoints }: { name: string | null; d: Dashboard; summary: PointsSummary; showPoints: boolean }) {
  const accuracy = d.week.answered ? Math.round((100 * d.week.correct) / d.week.answered) : null;
  const codeByName = new Map(d.enrolled.map((e) => [e.subject.name, e.subject.code]));
  const nextSubject =
    d.next.kind === 'start' || d.next.kind === 'resume'
      ? (codeByName.get(d.next.lesson.subjectName) ?? null)
      : d.next.kind === 'revisit'
        ? (d.revisit[0] ? (codeByName.get(d.revisit[0].subjectName) ?? null) : null)
        : null;
  // "Welcome back" only once there is something to come back to.
  const returning = d.dueCount > 0 || d.enrolled.some((e) => e.progress.lastActive !== null);
  const hello = returning ? 'Welcome back' : 'Welcome';
  return (
    <div className="container stack stack-xl">
      <div className="stack stack-lg">
        <header className="welcome">
          <h1>{name ? `${hello}, ${name}` : hello}</h1>
          <p className="welcome-line">{welcomeLine(d)}</p>
        </header>
        <div className="home-top">
          <ContinueCard next={d.next} resume={d.resume} subjectCode={nextSubject} />
          <MePanel summary={summary} showPoints={showPoints} />
        </div>
      </div>

      {d.enrolled.length === 0 ? (
        <EmptyState art="subjects" title="No subjects yet">
          <p>Pick the subjects you&rsquo;re taking and we&rsquo;ll lay out the syllabus for you.</p>
          <Link className="btn btn-primary" href="/subjects">
            Choose subjects
          </Link>
        </EmptyState>
      ) : (
        <>
          <section aria-labelledby="subjects-title">
            <div className="section-head">
              <h2 id="subjects-title">Your subjects</h2>
              <Link href="/progress" className="small">
                All progress
              </Link>
            </div>
            <div className="subject-strip">
              {d.enrolled.map(({ subject, targetLevel, progress }) => {
                const s = progress.summary;
                return (
                  <Link key={subject.code} href={`/subjects/${subject.slug}`} className="subject-card" data-subject={subject.code}>
                    <div className="subject-card-art" aria-hidden="true">
                      <SubjectMotif code={subject.code} />
                    </div>
                    <div className="subject-progress">
                      <div className="grow">
                        <h3>{subject.name}</h3>
                        <p className="tiny muted">
                          Aiming for {targetLevel === 'AS' ? 'AS Level' : 'A Level'} · {s.lessonsCompleted} of {s.lessonsTotal} lessons done
                        </p>
                      </div>
                      <Ring value={s.lessonsTotal ? (100 * s.lessonsCompleted) / s.lessonsTotal : 0} label="Lessons done" size={50} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="home-cols">
            <section aria-labelledby="upnext-title">
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
                      <Link className="list-row" href={l.href} data-subject={codeByName.get(l.subjectName)}>
                        <span className="row-glyph">
                          <FlagIcon />
                        </span>
                        <span className="grow">
                          <span style={{ display: 'block', fontWeight: 700 }}>{l.title}</span>
                          <span className="tiny muted">
                            {l.subjectName} · {l.topicTitle} · {l.minutes} min
                          </span>
                        </span>
                        <ArrowRightIcon width={18} height={18} style={{ color: 'var(--text-3)', flex: 'none' }} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section aria-labelledby="revisit-title">
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
                      <Link className="list-row" href={r.href} data-subject={codeByName.get(r.subjectName)}>
                        <span className="row-glyph">
                          <RefreshIcon />
                        </span>
                        <span className="grow">
                          <span style={{ display: 'block', fontWeight: 700 }}>{r.title}</span>
                          <span className="tiny muted">
                            {r.subjectName} · {r.topicTitle} · objective {r.objectiveCode}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section aria-labelledby="week-title">
            <div className="section-head">
              <h2 id="week-title">Last 7 days</h2>
              <Link href="/history" className="small">
                History
              </Link>
            </div>
            <div className="week-band">
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
            {d.recent.length > 0 && (
              <ul className="list list-rows" style={{ marginTop: 12 }} aria-label="Recent results">
                {d.recent.map((r) => (
                  <li key={r.lessonId}>
                    <Link className="list-row" href={r.href}>
                      {r.completed ? (
                        <CheckCircleIcon width={20} height={20} style={{ color: 'var(--good)', flex: 'none' }} aria-hidden="true" />
                      ) : (
                        <HalfCircleIcon width={20} height={20} style={{ color: 'var(--text-3)', flex: 'none' }} aria-hidden="true" />
                      )}
                      <span className="grow">
                        <span style={{ display: 'block', fontWeight: 700 }}>{r.title}</span>
                        <span className="tiny muted">
                          {r.subjectName} · {r.completed ? 'Finished' : 'In progress'}
                        </span>
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
      <section className="landing-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="row" style={{ ['--gap' as string]: '0' }} aria-hidden="true">
              {['9709', '9618', '9702', '9701'].map((c) => (
                <span key={c} className="subject-dot" data-subject={c} />
              ))}
            </span>
            Cambridge International AS &amp; A Level
          </p>
          <h1 id="hero-title" className="display">
            A Level, one <span className="hero-highlight">small idea</span> at a time.
          </h1>
          <p className="lede">
            Short lessons mapped to the official Cambridge syllabus, with a quick question after each idea. Get it right first time and you earn
            XP; get it wrong and you see why.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start for free
            </Link>
            <Link href={tryHref} className="btn btn-lg">
              Try a lesson <ArrowRightIcon />
            </Link>
          </div>
        </div>
        <SampleCheck />
      </section>

      <section aria-labelledby="subjects-title">
        <div className="section-head">
          <h2 id="subjects-title">Subjects</h2>
          <Link href="/subjects" className="small">
            All subjects
          </Link>
        </div>
        <div className="subject-row">
          {subjects.map((s) => (
            <Link key={s.code} href={`/subjects/${s.slug}`} className="subject-card" data-subject={s.code}>
              <div className="subject-card-art" aria-hidden="true">
                <SubjectMotif code={s.code} />
              </div>
              <p className="subject-card-code">{s.code}</p>
              <h3>{s.name}</h3>
              <p className="small muted">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="how-title" className="stack">
        <h2 id="how-title">How {BRAND} works</h2>
        <ol className="how-steps">
          {[
            { title: 'Read one idea', body: 'Two to five minutes: an explanation, a worked example or a diagram, and the exact wording examiners look for.' },
            { title: 'Check it straight away', body: 'A quick question right after. Feedback says why, not just whether, and you can always try again.' },
            { title: 'Come back just in time', body: 'Answers return for review before you’d forget them. Topics turn Secure only after right answers on different days.' },
          ].map((f, i) => (
            <li key={f.title} className="how-step">
              <span className="how-num" aria-hidden="true">
                {i + 1}
              </span>
              <div className="stack stack-xs">
                <h3>{f.title}</h3>
                <p className="small muted">{f.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="status-note" aria-labelledby="status-title">
        <h2 id="status-title" className="h3">
          What&rsquo;s here today
        </h2>
        <p className="small">
          {BRAND} is early. You get the full syllabus structure for four subjects, a first set of lessons in each, instant-feedback questions,
          XP and badges for real progress, spaced review and progress tracking. Exam-style practice, an AI tutor that can read photos of your
          working, and grade estimates come next, clearly labelled when they arrive. <Link href="/about">How we make and check content</Link>
        </p>
      </section>
    </div>
  );
}

/** A drawn example of a quick check, so the first screen shows what studying here feels like. */
function SampleCheck() {
  return (
    <div className="sample" aria-hidden="true">
      <span className="sample-badge">
        <BadgeArt id="first-steps" size={40} />
        <span className="sample-badge-text">
          <span className="sample-badge-kicker">Badge unlocked</span>
          <span className="sample-badge-name">First Steps</span>
        </span>
      </span>
      <div className="sample-head">
        <span className="badge badge-accent">Quick check</span>
        <span className="tiny muted">Question 1 · Recall</span>
      </div>
      <p className="sample-q">How many real roots does x² − 6x + 9 = 0 have?</p>
      <div className="sample-opt">
        <span className="sample-key">A</span> Two different roots
      </div>
      <div className="sample-opt" data-mark="right">
        <span className="sample-key">B</span> One repeated root
      </div>
      <div className="sample-opt">
        <span className="sample-key">C</span> No real roots
      </div>
      <div className="sample-foot">
        <CheckIcon /> Correct
        <span className="xp-pop">
          <StarFilledIcon />
          +10 XP
        </span>
      </div>
    </div>
  );
}
