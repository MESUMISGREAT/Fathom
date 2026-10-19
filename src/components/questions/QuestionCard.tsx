'use client';
/**
 * One recall question. Answers are checked on the server (the browser never
 * sees the answer key before submitting). Feedback explains why; students
 * can always try again.
 */
import Link from 'next/link';
import { useContext, useEffect, useId, useRef, useState, useTransition, type FormEvent } from 'react';
import type { QuestionView } from '@/content/rendered';
import type { StudentResponse } from '@/domain/answers/check';
import { submitAnswer, type SubmitResult } from '@/server/actions/study';
import { AlertIcon, CheckCircleIcon, HalfCircleIcon, RefreshIcon, XCircleIcon } from '@/components/icons';
import { BookmarkButton } from '@/components/study/BookmarkButton';
import { LessonCheckContext } from '@/components/lesson/context';
import { ReportProblem } from '@/components/study/ReportProblem';

const LETTERS = 'ABCDEF';

const TITLES: Record<string, { text: string; Icon: typeof CheckCircleIcon }> = {
  correct: { text: 'Correct', Icon: CheckCircleIcon },
  partial: { text: 'Partly right', Icon: HalfCircleIcon },
  incorrect: { text: 'Not quite', Icon: XCircleIcon },
  'self-check': { text: 'Check it yourself', Icon: AlertIcon },
};

const DIFFICULTY = ['', 'Recall', 'Apply', 'Stretch'];

export function QuestionCard({
  view,
  context,
  number,
  bookmarked,
  signedIn,
  onFinal,
  sourceHref,
}: {
  view: QuestionView;
  context: 'lesson' | 'review';
  number?: number;
  bookmarked?: boolean;
  signedIn: boolean;
  /** Called once per answer when there is a final outcome (not invalid, not awaiting self-check). */
  onFinal?: (questionId: string, outcome: SubmitResult['result']['outcome']) => void;
  /** Link back to the lesson (used in review). */
  sourceHref?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const promptId = useId();
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [response, setResponse] = useState<StudentResponse | null>(null);
  const [points, setPoints] = useState<number[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [pending, start] = useTransition();
  const lesson = useContext(LessonCheckContext);
  // Lets tests (and styles) tell when the form is interactive rather than server-rendered HTML.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const outcome = result?.result.outcome;
  const locked = !!outcome && outcome !== 'invalid';
  const reveal = result?.reveal;

  function readResponse(form: HTMLFormElement): StudentResponse | null {
    const fd = new FormData(form);
    const s = (k: string) => String(fd.get(k) ?? '');
    switch (view.format) {
      case 'mcq': {
        const v = fd.get('choice');
        return v === null ? null : { format: 'mcq', choice: Number(v) };
      }
      case 'spot-error': {
        const v = fd.get('line');
        return v === null ? null : { format: 'spot-error', line: Number(v) };
      }
      case 'numeric':
        return { format: 'numeric', values: (view.fields ?? []).map((_, i) => s(`field-${i}`)) };
      case 'cloze':
        return { format: 'cloze', values: Array.from({ length: view.blankCount ?? 0 }, (_, i) => s(`blank-${i + 1}`)) };
      case 'expression':
        return { format: 'expression', value: s('value') };
      case 'text':
        return { format: 'text', value: s('value') };
      case 'explain':
        return { format: 'explain', value: s('value') };
    }
  }

  function send(r: StudentResponse, self?: { correct?: boolean; points?: number[] }) {
    start(async () => {
      const res = await submitAnswer({ questionId: view.id, response: r, self, context });
      setResult(res);
      const o = res.result.outcome;
      if (o !== 'invalid' && o !== 'self-check') {
        onFinal?.(view.id, o);
        lesson?.report(view.id, o);
      }
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (locked) return;
    const r = readResponse(e.currentTarget);
    if (!r) {
      setResult({
        result: { outcome: 'invalid', score: 0, selfAssessed: false, parts: [], note: 'Choose an answer first.' },
        recorded: false,
        signedIn,
      });
      return;
    }
    setResponse(r);
    send(r);
  }

  function retry() {
    setResult(null);
    setResponse(null);
    setPoints([]);
    setAttempt((n) => n + 1); // remounts inputs, clearing them
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('input, textarea')?.focus());
  }

  const markFor = (i: number): 'right' | 'wrong' | undefined => {
    if (!locked || !reveal) return undefined;
    const correctIndex = view.format === 'mcq' ? reveal.correctOption : (reveal.errorLine ?? 0) - 1;
    const chosen = response?.format === 'mcq' ? response.choice : response?.format === 'spot-error' ? response.line - 1 : -1;
    if (i === correctIndex) return 'right';
    if (i === chosen) return 'wrong';
    return undefined;
  };

  return (
    <article className="question" id={`q-${view.id.replace(/[^a-z0-9-]/gi, '-')}`} data-outcome={locked ? outcome : undefined} aria-labelledby={promptId}>
      <div className="q-meta">
        <span className="badge badge-accent">{view.label}</span>
        <span className="tiny faint grow">
          {number ? `Question ${number} · ` : ''}
          {DIFFICULTY[view.difficulty]}
        </span>
        {signedIn && <BookmarkButton kind="question" targetId={view.id} initial={!!bookmarked} label="Save question" />}
      </div>

      <form ref={formRef} onSubmit={onSubmit} key={attempt} data-hydrated={hydrated || undefined}>
        <fieldset className="q-fieldset" disabled={locked || pending} aria-labelledby={promptId}>
          {/* For cloze questions the prompt HTML contains the blank inputs. */}
          <div id={promptId} className="q-prompt prose" dangerouslySetInnerHTML={{ __html: view.promptHtml }} />

          <div className="q-body">
            {view.format === 'mcq' && (
              <div className="options" role="radiogroup" aria-labelledby={promptId}>
                {view.options!.map((html, i) => (
                  <label key={i} className="option" data-mark={markFor(i)}>
                    <input type="radio" name="choice" value={i} aria-label={`Option ${LETTERS[i]}`} aria-describedby={`${promptId}-o${i}`} />
                    <span className="option-key" aria-hidden="true">
                      {LETTERS[i]}
                    </span>
                    <span id={`${promptId}-o${i}`} className="prose" dangerouslySetInnerHTML={{ __html: html }} />
                    {locked && reveal?.whyHtml?.[i] && <span className="option-why" dangerouslySetInnerHTML={{ __html: reveal.whyHtml[i]! }} />}
                  </label>
                ))}
              </div>
            )}

            {view.format === 'spot-error' && (
              <div className="options" role="radiogroup" aria-label="Which line contains the error?">
                <p className="small muted">Which line contains the first error?</p>
                {view.lines!.map((html, i) => (
                  <label key={i} className="option line-option" data-mark={markFor(i)}>
                    <input type="radio" name="line" value={i + 1} aria-label={`Line ${i + 1}`} aria-describedby={`${promptId}-l${i}`} />
                    <span className="option-key" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span id={`${promptId}-l${i}`} className="prose" dangerouslySetInnerHTML={{ __html: html }} />
                  </label>
                ))}
              </div>
            )}

            {view.format === 'numeric' &&
              view.fields!.map((f, i) => {
                const part = result?.result.parts[i];
                return (
                  <div key={i} className="numeric-field">
                    {f.labelHtml && (
                      <label className="numeric-label" htmlFor={`${promptId}-f${i}`} dangerouslySetInnerHTML={{ __html: f.labelHtml }} />
                    )}
                    <input
                      id={`${promptId}-f${i}`}
                      className="input input-mono"
                      name={`field-${i}`}
                      autoComplete="off"
                      spellCheck={false}
                      inputMode={f.typedUnit ? 'text' : 'decimal'}
                      placeholder={f.typedUnit ? 'value and unit, e.g. 9.81 m s^-2' : 'answer'}
                      aria-label={f.labelHtml ? undefined : 'Your answer'}
                    />
                    {f.unit && <span className="unit">{f.unit}</span>}
                    {f.sigFigs && <span className="tiny faint">to {f.sigFigs} s.f.</span>}
                    {locked && part && (
                      <span className="tiny" style={{ color: part.correct ? 'var(--good)' : 'var(--bad)' }}>
                        {part.correct ? 'Right' : 'Not this one'}
                      </span>
                    )}
                  </div>
                );
              })}

            {view.format === 'expression' && (
              <div className="field">
                <input
                  className="input input-mono"
                  name="value"
                  autoComplete="off"
                  spellCheck={false}
                  autoCapitalize="off"
                  aria-label="Your expression"
                  placeholder={`e.g. 3${view.variables?.[0] ?? 'x'}^2 - 4/${view.variables?.[0] ?? 'x'}`}
                />
                <p className="help">
                  Use <span className="kbd">^</span> for powers, <span className="kbd">*</span> or nothing for times, <span className="kbd">/</span> to
                  divide, and functions like <span className="mono">sqrt( )</span>, <span className="mono">sin( )</span>, <span className="mono">ln( )</span>.
                  Any equivalent form is accepted.
                </p>
              </div>
            )}

            {view.format === 'text' && (
              <input className="input" name="value" autoComplete="off" aria-label="Your answer" placeholder="Your answer" />
            )}

            {view.format === 'explain' && (
              <textarea className="textarea" name="value" aria-label="Your explanation" placeholder="Explain it in your own words…" rows={4} />
            )}
          </div>
        </fieldset>

        {!locked && (
          <div className="q-actions" style={{ marginTop: 14 }}>
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? 'Checking…' : 'Check answer'}
            </button>
            {result?.result.outcome === 'invalid' && (
              <p className="note-invalid" role="alert" style={{ margin: 0 }}>
                {result.result.note}
              </p>
            )}
          </div>
        )}
      </form>

      <div aria-live="polite">
        {locked && result && reveal && (
          <Feedback
            view={view}
            result={result}
            points={points}
            setPoints={setPoints}
            pending={pending}
            onSelf={(self) => response && send(response, self)}
            onRetry={retry}
            signedIn={signedIn}
            sourceHref={sourceHref}
          />
        )}
      </div>
    </article>
  );
}

function Feedback({
  view,
  result,
  points,
  setPoints,
  pending,
  onSelf,
  onRetry,
  signedIn,
  sourceHref,
}: {
  view: QuestionView;
  result: SubmitResult;
  points: number[];
  setPoints: (p: number[]) => void;
  pending: boolean;
  onSelf: (self: { correct?: boolean; points?: number[] }) => void;
  onRetry: () => void;
  signedIn: boolean;
  sourceHref?: string;
}) {
  const r = result.result;
  const reveal = result.reveal!;
  const t = TITLES[r.outcome] ?? TITLES.incorrect!;
  const selfPending = r.outcome === 'self-check';

  return (
    <div className="feedback" data-outcome={r.outcome}>
      <div className="feedback-title">
        <t.Icon /> {t.text}
        {r.selfAssessed && <span className="badge" style={{ marginLeft: 6 }}>self-marked</span>}
      </div>
      {r.note && <p className="small" style={{ marginBottom: 8 }}>{r.note}</p>}

      {reveal.expected && r.outcome !== 'correct' && (
        <div className="feedback-section">
          <div className="feedback-label">Expected</div>
          <p className="mono">{reveal.expected.join(';  ')}</p>
        </div>
      )}
      {reveal.blanks && r.outcome !== 'correct' && (
        <div className="feedback-section">
          <div className="feedback-label">Blanks</div>
          <ol className="small" style={{ margin: 0, paddingLeft: '1.3em' }}>
            {reveal.blanks.map((b, i) => (
              <li key={i}>
                {b} {r.parts[i] && (r.parts[i]!.correct ? '✓' : '')}
              </li>
            ))}
          </ol>
        </div>
      )}
      {view.format === 'spot-error' && reveal.fixHtml && (
        <div className="feedback-section">
          <div className="feedback-label">Line {reveal.errorLine} should be</div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: reveal.fixHtml }} />
        </div>
      )}
      {reveal.answerHtml && (
        <div className="feedback-section">
          <div className="feedback-label">{view.format === 'expression' ? 'One correct form' : 'Model answer'}</div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: reveal.answerHtml }} />
        </div>
      )}

      {selfPending && view.format === 'text' && (
        <div className="feedback-section row">
          <span className="small">Did your answer mean the same thing?</span>
          <button type="button" className="btn btn-sm" disabled={pending} onClick={() => onSelf({ correct: true })}>
            Yes, I had it
          </button>
          <button type="button" className="btn btn-sm btn-ghost" disabled={pending} onClick={() => onSelf({ correct: false })}>
            No, not quite
          </button>
        </div>
      )}
      {selfPending && view.format === 'explain' && reveal.keyPoints && (
        <div className="feedback-section">
          <div className="feedback-label">Which of these did your explanation cover?</div>
          <div className="keypoints">
            {reveal.keyPoints.map((k, i) => (
              <label key={i} className="checkbox">
                <input
                  type="checkbox"
                  checked={points.includes(i)}
                  onChange={(e) => setPoints(e.target.checked ? [...points, i] : points.filter((p) => p !== i))}
                />
                <span className="small">{k}</span>
              </label>
            ))}
          </div>
          <button type="button" className="btn btn-sm btn-primary" disabled={pending} onClick={() => onSelf({ points })}>
            {pending ? 'Saving…' : 'Done'}
          </button>
        </div>
      )}
      {!selfPending && view.format === 'explain' && reveal.keyPoints && (
        <div className="feedback-section">
          <div className="feedback-label">Key points</div>
          <ul className="small" style={{ margin: 0, paddingLeft: '1.2em' }}>
            {reveal.keyPoints.map((k, i) => (
              <li key={i}>{k}</li>
            ))}
          </ul>
        </div>
      )}

      {!selfPending && (
        <div className="feedback-section">
          <div className="feedback-label">Why</div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: reveal.explanationHtml }} />
        </div>
      )}

      {!selfPending && (
        <div className="q-actions" style={{ marginTop: 12 }}>
          <button type="button" className="btn btn-sm" onClick={onRetry}>
            <RefreshIcon /> Try again
          </button>
          {sourceHref && (
            <Link href={sourceHref} className="btn btn-sm btn-ghost">
              Open the lesson
            </Link>
          )}
          {!signedIn && (
            <span className="tiny faint">
              <Link href="/signup">Create an account</Link> to save your progress.
            </span>
          )}
        </div>
      )}
      {!selfPending && (
        <div style={{ marginTop: 10 }}>
          <ReportProblem kind="question" targetId={view.id} />
        </div>
      )}
    </div>
  );
}
