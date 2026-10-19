'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { QuestionView } from '@/content/rendered';
import type { Outcome } from '@/domain/answers/check';
import { QuestionCard } from './QuestionCard';
import { ArrowRightIcon, CheckCircleIcon, TargetIcon } from '@/components/icons';
import { CelebrationCard } from '@/components/fun';

/** Due questions one at a time: answer, read the feedback, move on. */
export function ReviewSession({ items }: { items: Array<{ view: QuestionView; sourceHref: string; sourceTitle: string }> }) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Map<string, Outcome>>(new Map());
  const item = items[index];
  const answered = item ? results.has(item.view.id) : false;

  if (!item) {
    const correct = [...results.values()].filter((o) => o === 'correct').length;
    return (
      <CelebrationCard
        headingId="review-done-title"
        title="Review done"
        tone="good"
        icon={<CheckCircleIcon />}
        stats={[
          { label: 'Correct', value: `${correct}/${results.size}`, hue: 'good', icon: <CheckCircleIcon /> },
          { label: 'Accuracy', value: `${results.size ? Math.round((100 * correct) / results.size) : 0}%`, hue: 'accent', icon: <TargetIcon /> },
        ]}
        subtitle={<p>Right answers move further apart; anything you missed comes back tomorrow.</p>}
      >
        <Link href="/" className="btn btn-primary btn-lg">
          Back to home
        </Link>
      </CelebrationCard>
    );
  }

  return (
    <div className="stack">
      <div className="review-progress">
        <div className="row row-between">
          <p className="small tabular" style={{ fontWeight: 750 }}>
            Question {index + 1} of {items.length}
          </p>
          <Link href={item.sourceHref} className="tiny">
            From: {item.sourceTitle}
          </Link>
        </div>
        <div
          className="meter meter-lesson"
          role="progressbar"
          aria-label="Review progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((100 * index) / items.length)}
          style={{ ['--value' as string]: Math.round((100 * index) / items.length) }}
        >
          <span />
        </div>
      </div>
      <QuestionCard
        key={item.view.id}
        view={item.view}
        context="review"
        signedIn
        sourceHref={item.sourceHref}
        onFinal={(id, o) => setResults((m) => (m.has(id) ? m : new Map(m).set(id, o)))}
      />
      <div className="continue-bar" style={{ justifyContent: 'flex-end', marginTop: 4 }}>
        <button type="button" className={`btn btn-lg ${answered ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setIndex((i) => i + 1)}>
          {answered ? (index + 1 < items.length ? 'Next question' : 'See summary') : 'Skip'} <ArrowRightIcon />
        </button>
      </div>
    </div>
  );
}
