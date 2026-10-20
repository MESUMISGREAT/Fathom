'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { QuestionView } from '@/content/rendered';
import type { Outcome } from '@/domain/answers/check';
import type { PointsResult } from '@/domain/points';
import { finishReviewSession } from '@/server/actions/study';
import { QuestionCard } from './QuestionCard';
import { ArrowRightIcon } from '@/components/icons';
import { Spot } from '@/components/art/Spot';
import { usePoints } from '@/components/points/PointsProvider';

const DOT_STATE: Partial<Record<Outcome, string>> = { correct: 'correct', incorrect: 'missed', partial: 'partial' };

/** Due questions one at a time: answer, read the feedback, move on. */
export function ReviewSession({ items }: { items: Array<{ view: QuestionView; sourceHref: string; sourceTitle: string }> }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Map<string, Outcome>>(new Map());
  const [xp, setXp] = useState(0);
  const [bonus, setBonus] = useState<PointsResult | null | 'pending'>(null);
  const finished = useRef(false);
  const endRef = useRef<HTMLElement>(null);
  const points = usePoints();
  const showPoints = points?.prefs.showPoints ?? true;
  const item = items[index];
  const answered = item ? results.has(item.view.id) : false;

  // The session is over: the server decides whether it earns the review-session bonus.
  useEffect(() => {
    if (item || finished.current) return;
    finished.current = true;
    if (results.size > 0) points?.celebrate();
    setBonus('pending');
    void finishReviewSession().then((r) => {
      setBonus(r.points);
      points?.apply(r.points, endRef.current);
    });
  }, [item, results.size, points]);

  if (!item) {
    const correct = [...results.values()].filter((o) => o === 'correct').length;
    const bonusXp = bonus && bonus !== 'pending' ? bonus.gained : 0;
    return (
      <section ref={endRef} className="celebrate" aria-live="polite" aria-labelledby="review-done-title">
        <Spot name="review" size={120} />
        <h2 id="review-done-title">Review done</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          {correct} of {results.size} correct. Right answers move further apart; anything you missed comes back tomorrow.
        </p>
        <ul className="celebrate-stats">
          {showPoints && (
            <li className="celebrate-stat" data-kind="xp">
              <span className="celebrate-num">{bonus === 'pending' ? '…' : `+${xp + bonusXp}`}</span>
              <span className="celebrate-label">XP earned{bonusXp > 0 ? ' · session bonus' : ''}</span>
            </li>
          )}
          {results.size > 0 && (
            <li className="celebrate-stat" data-kind="accuracy">
              <span className="celebrate-num">{Math.round((100 * correct) / results.size)}%</span>
              <span className="celebrate-label">remembered</span>
            </li>
          )}
        </ul>
        <div className="celebrate-actions">
          <Link href="/" className="btn btn-primary btn-lg">
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="stack">
      <div className="row row-between">
        <div className="stack stack-xs">
          <p className="small muted tabular">
            Question {index + 1} of {items.length}
          </p>
          <ol className="review-progress" aria-hidden="true">
            {items.map((it, i) => {
              const o = results.get(it.view.id);
              const state = i === index ? 'current' : o ? (DOT_STATE[o] ?? 'partial') : i < index ? 'skipped' : undefined;
              return <li key={it.view.id} data-state={state} />;
            })}
          </ol>
        </div>
        <Link href={item.sourceHref} className="tiny">
          From: {item.sourceTitle}
        </Link>
      </div>
      <QuestionCard
        key={item.view.id}
        view={item.view}
        context="review"
        signedIn
        sourceHref={item.sourceHref}
        onFinal={(id, o) => setResults((m) => (m.has(id) ? m : new Map(m).set(id, o)))}
        onPoints={(p) => setXp((n) => n + p.gained)}
      />
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className={`btn ${answered ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setIndex((i) => i + 1)}>
          {answered ? (index + 1 < items.length ? 'Next question' : 'See summary') : 'Skip'} <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
