'use client';
/**
 * Runs a lesson as a sequence of small steps. Each step ends with a quick
 * check; the next step appears once the check is answered (or skipped).
 * Students who prefer can show the whole lesson at once. Finishing a lesson
 * shows a small celebration with the XP the server awarded.
 */
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Outcome } from '@/domain/answers/check';
import type { PointsResult } from '@/domain/points';
import { recordLessonStep } from '@/server/actions/study';
import { updatePreferences } from '@/server/actions/settings';
import { ArrowRightIcon, CheckCircleIcon, ChevronLeftIcon, StarIcon } from '@/components/icons';
import { Spot } from '@/components/art/Spot';
import { prefersReducedMotion, usePoints } from '@/components/points/PointsProvider';
import { LessonCheckContext } from './context';

export interface PlayerStep {
  content: ReactNode;
  questionIds: string[];
}

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
  next?: { href: string; title: string };
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
  const [answerXp, setAnswerXp] = useState(0);
  const [lessonPoints, setLessonPoints] = useState<PointsResult | null | 'pending'>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const endRef = useRef<HTMLElement>(null);
  const allQuestions = useMemo(() => steps.flatMap((s) => s.questionIds), [steps]);
  const points = usePoints();
  const showPoints = signedIn && (points?.prefs.showPoints ?? true);

  // Mark the lesson as opened.
  useEffect(() => {
    if (signedIn && !initiallyCompleted) void recordLessonStep({ lessonId, stepReached: Math.max(0, revealed - 1), stepCount: total, completed: false });
    // Only on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const report = useCallback((qid: string, outcome: Outcome, result: PointsResult | null) => {
    setDone((m) => new Map(m).set(qid, outcome));
    setFirst((m) => (m.has(qid) ? m : new Map(m).set(qid, outcome)));
    if (result?.gained) setAnswerXp((n) => n + result.gained);
  }, []);
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

  // Bring the celebration into view once it renders.
  useEffect(() => {
    if (!justFinished) return;
    // Aligned to the bottom (above the phone tab bar, see scroll-margin), leaving room above for a badge toast.
    endRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'end' });
  }, [justFinished]);

  function skip(i: number) {
    setDone((m) => {
      const n = new Map(m);
      for (const q of steps[i]!.questionIds) if (!n.has(q)) n.set(q, 'skipped');
      return n;
    });
  }

  function finish() {
    setCompleted(true);
    setJustFinished(true);
    points?.celebrate();
    points?.play('complete');
    if (!signedIn) return;
    setLessonPoints('pending');
    void recordLessonStep({ lessonId, stepReached: total - 1, stepCount: total, completed: true }).then((r) => {
      setLessonPoints(r.points);
      points?.apply(r.points, endRef.current);
    });
  }

  function switchMode(m: 'steps' | 'full') {
    setMode(m);
    if (m === 'full') setRevealed(total);
    if (signedIn) void updatePreferences({ lessonMode: m });
  }

  const answeredFirst = [...first.values()];
  const firstCorrect = answeredFirst.filter((o) => o === 'correct').length;
  const progressPct = completed ? 100 : Math.round((100 * (visible - (stepDone(lastIndex) ? 0 : 0.5))) / total);
  const accuracy = allQuestions.length ? Math.round((100 * firstCorrect) / allQuestions.length) : 0;
  const lessonGained = lessonPoints && lessonPoints !== 'pending' ? lessonPoints.gained : 0;
  const perfect = lessonPoints && lessonPoints !== 'pending' && lessonPoints.events.some((e) => e.kind === 'perfect');

  return (
    <LessonCheckContext.Provider value={ctx}>
      <div className="lesson-player" data-subject={subjectCode}>
        <div className="lesson-top">
          <div className="lesson-top-inner">
            <Link href={topicHref} className="icon-btn" aria-label={`Back to ${topicLabel}`}>
              <ChevronLeftIcon />
            </Link>
            <div className="grow stack stack-xs" style={{ minWidth: 0 }}>
              <span className="lesson-top-title">{title}</span>
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
            <section ref={endRef} className="celebrate" aria-live="polite" aria-labelledby="lesson-done-title">
              <Spot name="done" size={116} />
              <h2 id="lesson-done-title">Lesson complete</h2>
              <p className="muted" style={{ marginTop: 6, maxWidth: '46ch', marginInline: 'auto' }}>
                {!justFinished
                  ? 'You finished this one before. Answer the checks again any time.'
                  : answeredFirst.length === 0
                    ? 'Nice work.'
                    : firstCorrect === allQuestions.length
                      ? 'Every one right first time. They’ll come back for a quick review in a few days to make them stick.'
                      : 'The ones you missed come back in tomorrow’s review. That’s exactly how it’s meant to work.'}
              </p>
              {justFinished && (showPoints || answeredFirst.length > 0) && (
                <ul className="celebrate-stats">
                  {showPoints && (
                    <li className="celebrate-stat" data-kind="xp">
                      <span className="celebrate-num">{lessonPoints === 'pending' ? '…' : `+${answerXp + lessonGained}`}</span>
                      <span className="celebrate-label">XP earned{perfect ? ' · perfect lesson' : ''}</span>
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
              {!signedIn && (
                <p className="guest-xp" style={{ justifyContent: 'center', marginTop: 14 }}>
                  <StarIcon aria-hidden="true" />
                  <span>
                    <Link href="/signup">Create a free account</Link> to keep your XP, save progress and get spaced review.
                  </span>
                </p>
              )}
              <div className="celebrate-actions">
                {next ? (
                  <Link href={next.href} className="btn btn-primary btn-next">
                    <span className="btn-next-title">Next: {next.title}</span> <ArrowRightIcon />
                  </Link>
                ) : null}
                <Link href={topicHref} className="btn btn-ghost">
                  Back to {topicLabel}
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </LessonCheckContext.Provider>
  );
}
