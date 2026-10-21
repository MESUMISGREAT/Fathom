'use client';
/**
 * Runs a lesson as a sequence of small steps. Each step ends with a quick
 * check; the next step appears once the check is answered (or skipped).
 * Students who prefer can show the whole lesson at once. Finishing a lesson
 * shows a small celebration with the XP the server awarded.
 */
import Link from 'next/link';
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Outcome } from '@/domain/answers/check';
import { XP_LABELS, type PointsResult, type XpKind } from '@/domain/points';
import { recordLessonStep } from '@/server/actions/study';
import { updatePreferences } from '@/server/actions/settings';
import { ArrowRightIcon, CheckCircleIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, StarIcon, TrophyIcon } from '@/components/icons';
import { Spot } from '@/components/art/Spot';
import { prefersReducedMotion, usePoints } from '@/components/points/PointsProvider';
import { XpChip } from '@/components/points/XpChips';
import { LessonCheckContext } from './context';

const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const countWord = (n: number) => NUMBER_WORDS[n] ?? String(n);

export interface PlayerStep {
  content: ReactNode;
  questionIds: string[];
}

export interface LessonLink {
  href: string;
  title: string;
}

/**
 * What the completion card lists, in this order, from every award this visit
 * (each answer's and the finish's): answers and due reviews share one line,
 * every bonus gets its own.
 */
const BREAKDOWN: Array<{ key: string; label: string; kinds: XpKind[] }> = [
  { key: 'answers', label: 'Answers', kinds: ['answer', 'review'] },
  ...(['lesson', 'perfect', 'topic', 'topic-secure', 'comeback', 'combo', 'daily-goal'] as const).map((k) => ({ key: k, label: XP_LABELS[k], kinds: [k] })),
];

export function LessonPlayer({
  lessonId,
  subjectCode,
  steps,
  initialStep,
  completed: initiallyCompleted,
  mode: initialMode,
  signedIn,
  topicHref,
  topicLabel,
  title,
  next,
  prev,
  completionNext,
  topicLessons,
  header,
  bookmark,
}: {
  lessonId: string;
  subjectCode: string;
  steps: PlayerStep[];
  initialStep: number;
  completed: boolean;
  mode: 'steps' | 'full';
  signedIn: boolean;
  topicHref: string;
  topicLabel: string;
  title: string;
  /** The next and previous lessons in syllabus order (the footer navigation). */
  next?: LessonLink;
  prev?: LessonLink;
  /**
   * Where the completion card's main button goes: the next lesson with work
   * left (unfinished, in this topic first), or none (back to the topic).
   */
  completionNext?: LessonLink;
  /** Every lesson in this topic, in order, for the lesson menu (`done`: finished by this student). */
  topicLessons: Array<LessonLink & { id: string; done: boolean }>;
  header: ReactNode;
  bookmark?: ReactNode;
}) {
  const total = steps.length;
  const [mode, setMode] = useState(initialMode);
  const [revealed, setRevealed] = useState(initiallyCompleted ? total : Math.min(Math.max(initialStep, 0) + 1, total));
  const [done, setDone] = useState<Map<string, Outcome | 'skipped'>>(new Map());
  const [first, setFirst] = useState<Map<string, Outcome>>(new Map());
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [justFinished, setJustFinished] = useState(false);
  const [justRevealed, setJustRevealed] = useState<number | null>(null);
  /** XP earned on this visit, by kind (every answer's awards, then the finish's). */
  const [earned, setEarned] = useState<ReadonlyMap<XpKind, number>>(new Map());
  const [lessonPoints, setLessonPoints] = useState<PointsResult | null | 'pending'>(null);
  /** Checks never answered: the lesson's XP waits for them (the server says how many). */
  const [unanswered, setUnanswered] = useState(0);
  const [saveFailed, setSaveFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const endRef = useRef<HTMLElement>(null);
  const doneTitleRef = useRef<HTMLHeadingElement>(null);
  const allQuestions = useMemo(() => steps.flatMap((s) => s.questionIds), [steps]);
  const points = usePoints();
  const showPoints = signedIn && (points?.prefs.showPoints ?? true);

  // Mark the lesson as opened.
  useEffect(() => {
    if (signedIn && !initiallyCompleted) void recordLessonStep({ lessonId, stepReached: Math.max(0, revealed - 1), stepCount: total, completed: false });
    // Only on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addEarned = useCallback((result: PointsResult | null) => {
    if (!result?.events.length) return;
    setEarned((m) => {
      const n = new Map(m);
      for (const e of result.events) n.set(e.kind, (n.get(e.kind) ?? 0) + e.amount);
      return n;
    });
  }, []);

  const report = useCallback(
    (qid: string, outcome: Outcome, result: PointsResult | null) => {
      setDone((m) => new Map(m).set(qid, outcome));
      setFirst((m) => (m.has(qid) ? m : new Map(m).set(qid, outcome)));
      addEarned(result);
      // Answering the last skipped check pays the lesson's XP: the "answer it to earn this lesson's XP" note is done.
      if (result?.events.some((e) => e.kind === 'lesson')) setUnanswered(0);
    },
    [addEarned],
  );
  const ctx = useMemo(() => ({ report }), [report]);

  const visible = mode === 'full' ? total : revealed;
  const stepDone = (i: number) => steps[i]!.questionIds.every((q) => done.has(q));
  const lastIndex = visible - 1;

  function reveal() {
    const nextCount = Math.min(revealed + 1, total);
    setRevealed(nextCount);
    setJustRevealed(nextCount - 1);
    if (signedIn) void recordLessonStep({ lessonId, stepReached: nextCount - 1, stepCount: total, completed: false });
  }

  useEffect(() => {
    if (justRevealed === null) return;
    const el = stepRefs.current[justRevealed];
    if (!el) return;
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }, [justRevealed]);

  // Bring the celebration into view once it renders, and put focus on its heading (the button pressed has gone).
  useEffect(() => {
    if (!justFinished) return;
    doneTitleRef.current?.focus({ preventScroll: true });
    endRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'end' });
  }, [justFinished]);

  // The lesson menu closes on Escape or a click outside it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Focus may be inside the menu, which is about to go: return it to the button that opened it.
      menuButtonRef.current?.focus();
      setMenuOpen(false);
    };
    const onDown = (e: PointerEvent) => !menuRef.current?.contains(e.target as Node) && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [menuOpen]);

  function skip(i: number) {
    setDone((m) => {
      const n = new Map(m);
      for (const q of steps[i]!.questionIds) if (!n.has(q)) n.set(q, 'skipped');
      return n;
    });
  }

  function save() {
    setLessonPoints('pending');
    setSaveFailed(false);
    recordLessonStep({ lessonId, stepReached: total - 1, stepCount: total, completed: true })
      .then((r) => {
        if (!r.saved) setSaveFailed(true);
        setLessonPoints(r.points);
        setUnanswered(r.unanswered);
        addEarned(r.points);
        points?.apply(r.points);
      })
      .catch(() => {
        setLessonPoints(null);
        setSaveFailed(true);
      });
  }

  function finish() {
    setCompleted(true);
    setJustFinished(true);
    points?.celebrate();
    points?.play('complete');
    if (signedIn) save();
  }

  function switchMode(m: 'steps' | 'full') {
    setMode(m);
    if (m === 'full') setRevealed(total);
    if (signedIn) void updatePreferences({ lessonMode: m });
  }

  const answeredFirst = [...first.values()];
  const firstCorrect = answeredFirst.filter((o) => o === 'correct').length;
  const missed = answeredFirst.length - firstCorrect;
  // Steps mode: steps revealed (half a step while its check is open). Whole lesson: checks dealt with, the finish counting as one more.
  const progressPct = completed
    ? 100
    : mode === 'full'
      ? Math.round((100 * allQuestions.filter((q) => done.has(q)).length) / (allQuestions.length + 1))
      : Math.round((100 * (visible - (stepDone(lastIndex) ? 0 : 0.5))) / total);
  const accuracy = allQuestions.length ? Math.round((100 * firstCorrect) / allQuestions.length) : 0;
  const totalEarned = [...earned.values()].reduce((n, v) => n + v, 0);
  const topicDone = earned.has('topic');
  const breakdown = BREAKDOWN.flatMap((b) => {
    const amount = b.kinds.reduce((n, k) => n + (earned.get(k) ?? 0), 0);
    return amount > 0 ? [{ key: b.key, label: b.label, amount }] : [];
  });
  const currentIndex = topicLessons.findIndex((l) => l.id === lessonId);

  return (
    <LessonCheckContext.Provider value={ctx}>
      <div className="lesson-player" data-subject={subjectCode}>
        <div className="lesson-top">
          <div className="lesson-top-inner">
            <Link href={topicHref} className="icon-btn" aria-label={`Back to ${topicLabel}`}>
              <ChevronLeftIcon />
            </Link>
            <div className="grow stack stack-xs lesson-menu" style={{ minWidth: 0 }} ref={menuRef}>
              <button
                type="button"
                ref={menuButtonRef}
                className="lesson-top-title"
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => setMenuOpen((o) => !o)}
              >
                <span className="lesson-top-name">{title}</span>
                {topicLessons.length > 1 && currentIndex >= 0 && (
                  <span className="lesson-top-count tabular">
                    {/* Says "lesson": the bar below measures steps, so a bare "5/9" would read as a step count. */}
                    <span className="lesson-top-count-word">Lesson</span> {currentIndex + 1}/{topicLessons.length}
                  </span>
                )}
                <ChevronRightIcon aria-hidden="true" className="lesson-top-chevron" />
                <span className="visually-hidden">: lessons in {topicLabel}</span>
              </button>
              {menuOpen && (
                <div className="lesson-menu-panel" id={menuId}>
                  <p className="tiny muted">Lessons in {topicLabel}</p>
                  <ol>
                    {topicLessons.map((l) => (
                      <li key={l.id}>
                        <Link
                          href={l.href}
                          aria-current={l.id === lessonId ? 'page' : undefined}
                          data-done={l.done || (l.id === lessonId && completed) || undefined}
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="lesson-menu-mark" aria-hidden="true">
                            {l.done || (l.id === lessonId && completed) ? <CheckIcon /> : null}
                          </span>
                          <span className="grow">{l.title}</span>
                          {(l.done || (l.id === lessonId && completed)) && <span className="visually-hidden">(finished)</span>}
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <Link href={topicHref} className="small tap-pad" onClick={() => setMenuOpen(false)}>
                    Topic overview
                  </Link>
                </div>
              )}
              <div
                className="meter meter-thin"
                role="progressbar"
                aria-label="Lesson progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPct}
                style={{ ['--value' as string]: progressPct }}
              >
                <span />
              </div>
            </div>
            <div className="segmented" role="group" aria-label="How to show the lesson">
              <button type="button" aria-pressed={mode === 'steps'} onClick={() => switchMode('steps')} title="Reveal one step at a time">
                Steps
              </button>
              <button type="button" aria-pressed={mode === 'full'} onClick={() => switchMode('full')} title="Show the whole lesson">
                All
              </button>
            </div>
            {bookmark}
            {/* On phones the lesson bar replaces the top bar, so the XP total lives here. */}
            <span className="lesson-top-xp">
              <XpChip />
            </span>
          </div>
        </div>

        <div className="lesson">
          {header}
          {steps.slice(0, visible).map((step, i) => {
            const isLast = i === total - 1;
            const showContinue = mode === 'steps' && i === revealed - 1 && !isLast;
            const unanswered = step.questionIds.filter((q) => !done.has(q)).length;
            return (
              <section
                key={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={`step${justRevealed === i ? ' step-enter' : ''}`}
                tabIndex={-1}
                aria-label={`Step ${i + 1} of ${total}`}
              >
                {step.content}
                {showContinue && (
                  <div className="continue-bar">
                    {stepDone(i) ? (
                      <button type="button" className="btn btn-primary btn-lg" onClick={reveal}>
                        Continue <ArrowRightIcon />
                      </button>
                    ) : (
                      <div className="stack stack-xs" style={{ alignItems: 'center' }}>
                        <p className="small muted">Answer the {unanswered === 1 ? 'question' : `${unanswered} questions`} above to continue.</p>
                        <button
                          type="button"
                          className="link-btn small"
                          onClick={() => {
                            skip(i);
                            reveal();
                          }}
                        >
                          Skip for now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}

          {visible === total && !completed && (
            <div className="continue-bar">
              {stepDone(total - 1) ? (
                <button type="button" className="btn btn-primary btn-lg" onClick={finish}>
                  <CheckCircleIcon /> Finish lesson
                </button>
              ) : (
                <div className="stack stack-xs" style={{ alignItems: 'center' }}>
                  <p className="small muted">Answer the last check to finish.</p>
                  <button
                    type="button"
                    className="link-btn small"
                    onClick={() => {
                      skip(total - 1);
                      finish();
                    }}
                  >
                    Finish without answering
                  </button>
                </div>
              )}
            </div>
          )}

          {completed && (
            <section ref={endRef} className="celebrate" aria-labelledby="lesson-done-title">
              <Spot name="done" size={116} />
              <h2 id="lesson-done-title" ref={doneTitleRef} tabIndex={-1}>
                Lesson complete
              </h2>
              {justFinished && topicDone && (
                <p className="celebrate-topic">
                  <TrophyIcon aria-hidden="true" /> {topicLabel} finished
                </p>
              )}
              <p className="muted" style={{ marginTop: 10, maxWidth: '46ch', marginInline: 'auto' }}>
                {!justFinished
                  ? 'You finished this one before. Answer the checks again any time.'
                  : answeredFirst.length === 0
                    ? 'Nice work.'
                    : missed === 0
                      ? firstCorrect === allQuestions.length
                        ? 'Every one right first time. They’ll come back for a quick review in a few days to make them stick.'
                        : 'Every check you answered was right first time.'
                      : missed === 1
                        ? 'The one you missed comes back in tomorrow’s review. That’s exactly how it’s meant to work.'
                        : `The ${countWord(missed)} you missed come back in tomorrow’s review. That’s exactly how it’s meant to work.`}
              </p>
              {justFinished && (showPoints || answeredFirst.length > 0) && (
                <ul className="celebrate-stats">
                  {showPoints && (
                    <li className="celebrate-stat" data-kind="xp">
                      <span className="celebrate-num">{lessonPoints === 'pending' ? '…' : `+${totalEarned}`}</span>
                      <span className="celebrate-label">XP earned</span>
                    </li>
                  )}
                  {answeredFirst.length > 0 && (
                    <li className="celebrate-stat" data-kind="accuracy">
                      <span className="celebrate-num">{accuracy}%</span>
                      <span className="celebrate-label">
                        right first time ({firstCorrect}/{allQuestions.length})
                      </span>
                    </li>
                  )}
                </ul>
              )}
              {justFinished && showPoints && breakdown.length > 1 && (
                <ul className="celebrate-breakdown" aria-label="What the XP was for">
                  {breakdown.map((b) => (
                    <li key={b.key}>
                      {b.label} <strong className="tabular">+{b.amount}</strong>
                    </li>
                  ))}
                </ul>
              )}
              {justFinished && signedIn && unanswered > 0 && (
                <p className="celebrate-note">
                  Finished, with {unanswered === 1 ? 'one check' : `${unanswered} checks`} skipped. Answer {unanswered === 1 ? 'it' : 'them'} any time to
                  earn this lesson&rsquo;s XP.
                </p>
              )}
              {saveFailed && (
                <p className="celebrate-note" role="alert">
                  That didn&rsquo;t save. Check your connection and{' '}
                  <button type="button" className="link-btn" onClick={save}>
                    try again
                  </button>
                  .
                </p>
              )}
              {!signedIn && (
                <p className="guest-xp" style={{ justifyContent: 'center', marginTop: 14 }}>
                  <StarIcon aria-hidden="true" />
                  <span>
                    <Link href="/signup">Create a free account</Link> to keep your XP, save progress and get spaced review.
                  </span>
                </p>
              )}
              <div className="celebrate-actions">
                {completionNext ? (
                  <Link href={completionNext.href} className="btn btn-primary btn-next">
                    <span className="btn-next-title">Next: {completionNext.title}</span> <ArrowRightIcon />
                  </Link>
                ) : null}
                <Link href={topicHref} className={`btn ${completionNext ? 'btn-ghost' : 'btn-primary btn-lg'}`}>
                  Back to {topicLabel}
                </Link>
              </div>
            </section>
          )}

          {/* Always there: step back or skip ahead without finishing (the completion card has the big Next). */}
          {(prev || next) && (
            <nav className="lesson-nav" aria-label="Previous and next lessons">
              {prev ? (
                <Link href={prev.href} className="lesson-nav-link" data-dir="prev">
                  <ChevronLeftIcon aria-hidden="true" />
                  <span className="lesson-nav-text">
                    <span className="lesson-nav-kicker">Previous lesson</span>
                    <span className="lesson-nav-title">{prev.title}</span>
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={next.href} className="lesson-nav-link" data-dir="next">
                  <span className="lesson-nav-text">
                    <span className="lesson-nav-kicker">Next lesson</span>
                    <span className="lesson-nav-title">{next.title}</span>
                  </span>
                  <ChevronRightIcon aria-hidden="true" />
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </LessonCheckContext.Provider>
  );
}
