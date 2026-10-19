'use client';
/**
 * Runs a lesson as a sequence of small steps. Each step ends with a quick
 * check; the next step appears once the check is answered (or skipped).
 * Students who prefer can show the whole lesson at once.
 */
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Outcome } from '@/domain/answers/check';
import { recordLessonStep } from '@/server/actions/study';
import { updatePreferences } from '@/server/actions/settings';
import { ArrowRightIcon, CheckCircleIcon, ChevronLeftIcon, SparkIcon, TargetIcon, TrophyIcon } from '@/components/icons';
import { CelebrationCard } from '@/components/fun';
import { LessonCheckContext } from './context';

export interface PlayerStep {
  content: ReactNode;
  questionIds: string[];
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function LessonPlayer({
  lessonId,
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
  const [justRevealed, setJustRevealed] = useState<number | null>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const allQuestions = useMemo(() => steps.flatMap((s) => s.questionIds), [steps]);

  // Mark the lesson as opened.
  useEffect(() => {
    if (signedIn && !initiallyCompleted) void recordLessonStep({ lessonId, stepReached: Math.max(0, revealed - 1), stepCount: total, completed: false });
    // Only on first render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const report = useCallback((qid: string, outcome: Outcome) => {
    setDone((m) => new Map(m).set(qid, outcome));
    setFirst((m) => (m.has(qid) ? m : new Map(m).set(qid, outcome)));
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

  function skip(i: number) {
    setDone((m) => {
      const n = new Map(m);
      for (const q of steps[i]!.questionIds) if (!n.has(q)) n.set(q, 'skipped');
      return n;
    });
  }

  function finish() {
    setCompleted(true);
    if (signedIn) void recordLessonStep({ lessonId, stepReached: total - 1, stepCount: total, completed: true });
  }

  function switchMode(m: 'steps' | 'full') {
    setMode(m);
    if (m === 'full') setRevealed(total);
    if (signedIn) void updatePreferences({ lessonMode: m });
  }

  const answeredFirst = [...first.values()];
  const firstCorrect = answeredFirst.filter((o) => o === 'correct').length;
  const progressPct = completed ? 100 : Math.round((100 * (visible - (stepDone(lastIndex) ? 0 : 0.5))) / total);

  return (
    <LessonCheckContext.Provider value={ctx}>
      <div className="lesson-top">
        <div className="lesson-top-inner">
          <Link href={topicHref} className="icon-btn" aria-label={`Back to ${topicLabel}`}>
            <ChevronLeftIcon />
          </Link>
          <div className="grow stack stack-xs" style={{ minWidth: 0 }}>
            <span className="lesson-top-title">{title}</span>
            <div
              className="meter meter-lesson"
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
                    <div className="stack stack-sm" style={{ alignItems: 'center' }}>
                      <p className="small faint">
                        Answer the {unanswered === 1 ? 'question' : `${unanswered} questions`} above to continue.
                      </p>
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
              <div className="stack stack-sm" style={{ alignItems: 'center' }}>
                <p className="small faint">Answer the last check to finish.</p>
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
          <div className="lesson-end">
            <CelebrationCard
              label="Lesson complete"
              headingId="lesson-complete-title"
              title="Lesson complete"
              icon={answeredFirst.length > 0 && firstCorrect === allQuestions.length ? <TrophyIcon /> : <CheckCircleIcon />}
              tone={answeredFirst.length > 0 && firstCorrect === allQuestions.length ? 'gold' : 'good'}
              stats={
                answeredFirst.length > 0
                  ? [
                      { label: 'Right first time', value: `${firstCorrect}/${allQuestions.length}`, hue: 'good', icon: <CheckCircleIcon /> },
                      { label: 'Accuracy', value: `${Math.round((100 * firstCorrect) / Math.max(1, allQuestions.length))}%`, hue: 'accent', icon: <TargetIcon /> },
                    ]
                  : []
              }
              subtitle={
                answeredFirst.length > 0 ? (
                  <p>
                    {firstCorrect === allQuestions.length
                      ? 'Lovely. These will come back for a quick review in a few days to make them stick.'
                      : 'The ones you missed will come back in your review tomorrow, which is exactly how this is meant to work.'}
                  </p>
                ) : (
                  <p>{initiallyCompleted ? 'You finished this one before. Answer the checks again any time.' : 'Nice work.'}</p>
                )
              }
            >
              {next ? (
                <Link href={next.href} className="btn btn-primary btn-lg">
                  Next: {next.title} <ArrowRightIcon />
                </Link>
              ) : null}
              <Link href={topicHref} className="btn btn-lg">
                Back to {topicLabel}
              </Link>
            </CelebrationCard>
            {!signedIn && (
              <p className="notice small" style={{ marginTop: 16, textAlign: 'left' }}>
                <SparkIcon />
                <span>
                  <Link href="/signup">Create a free account</Link> to save progress and get spaced review.
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </LessonCheckContext.Provider>
  );
}
