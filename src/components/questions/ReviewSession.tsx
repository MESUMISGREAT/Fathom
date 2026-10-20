'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { QuestionView } from '@/content/rendered';
import type { Outcome } from '@/domain/answers/check';
import { QuestionCard } from './QuestionCard';
import { ArrowRightIcon } from '@/components/icons';
import { Ring } from '@/components/ui';

/** Due questions one at a time: answer, read the feedback, move on. */
export function ReviewSession({ items }: { items: Array<{ view: QuestionView; sourceHref: string; sourceTitle: string }> }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Map<string, Outcome>>(new Map());
  const item = items[index];
  const answered = item ? results.has(item.view.id) : false;

  if (!item) {
    const correct = [...results.values()].filter((o) => o === 'correct').length;
    return (
      <section className="card card-pad lesson-end" aria-live="polite">
        <Ring value={results.size ? (100 * correct) / results.size : 0} label="Correct" size={72} color="var(--good)" />
        <h2>Review done</h2>
        <p className="muted" style={{ marginTop: 6 }}>
          {correct} of {results.size} correct. Right answers move further apart; anything you missed comes back tomorrow.
        </p>
        <div className="row" style={{ justifyContent: 'center', marginTop: 18 }}>
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
        <p className="small muted tabular">
          Question {index + 1} of {items.length}
        </p>
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
      />
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className={`btn ${answered ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setIndex((i) => i + 1)}>
          {answered ? (index + 1 < items.length ? 'Next question' : 'See summary') : 'Skip'} <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
