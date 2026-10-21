'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { QuestionView } from '@/content/rendered';
import type { Outcome } from '@/domain/answers/check';
import { XP_LABELS, type PointsResult, type XpKind } from '@/domain/points';
import { finishReviewSession } from '@/server/actions/study';
import { QuestionCard } from './QuestionCard';
import { ArrowRightIcon } from '@/components/icons';
import { Spot } from '@/components/art/Spot';
import { usePoints } from '@/components/points/PointsProvider';

const DOT_STATE: Partial<Record<Outcome, string>> = { correct: 'correct', incorrect: 'missed', partial: 'partial' };

export type ReviewItem = { view: QuestionView; sourceHref: string; sourceTitle: string };

/**
 * Due questions one at a time: answer, read the feedback, move on.
 *
 * The session lives in this component's state, not in the page's props: the
 * page re-renders after the session bonus is paid (the server revalidates the
 * layout so the header total is right), and by then the questions are no
 * longer due. Keeping the batch here means that refresh can't swap the
 * summary for "Nothing to review" or the next batch.
 */
/** The summary's "what the XP was for" lines, in order. */
const SUMMARY: Array<{ key: string; label: string; kinds: XpKind[] }> = [
  { key: 'reviews', label: 'Reviews', kinds: ['review', 'answer'] },
  { key: 'combo', label: 'Combo', kinds: ['combo'] },
  { key: 'comeback', label: 'Comeback', kinds: ['comeback'] },
  { key: 'topic-secure', label: XP_LABELS['topic-secure'], kinds: ['topic-secure'] },
  { key: 'lesson', label: 'Lessons finished', kinds: ['lesson', 'perfect', 'topic'] },
  { key: 'daily-goal', label: XP_LABELS['daily-goal'], kinds: ['daily-goal'] },
  { key: 'session', label: 'Session bonus', kinds: ['review-session'] },
];

export function ReviewSession({ items, batchSize, empty }: { items: ReviewItem[]; batchSize: number; empty: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState(items);
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Map<string, Outcome>>(new Map());
  /** XP from this round's answers, by kind (reviews, combos, comebacks, the daily goal…). */
  const [earned, setEarned] = useState<ReadonlyMap<XpKind, number>>(new Map());
  /** The session bonus, whenever the server paid it (at the end, or when the student stepped away part-way). */
  const [bonus, setBonus] = useState<PointsResult | null>(null);
  const [ending, setEnding] = useState(false);
  const [wantMore, setWantMore] = useState(false);
  const finished = useRef(false);
  const claimedAt = useRef(0);
  const answeredRef = useRef(0);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const doneTitleRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const points = usePoints();
  const pointsRef = useRef(points);
  pointsRef.current = points;
  const showPoints = points?.prefs.showPoints ?? true;
  const item = session[index];
  const answered = item ? results.has(item.view.id) : false;
  answeredRef.current = results.size;

  /** Asks the server for the session bonus (it decides; safe to call more than once). */
  const claim = () => {
    claimedAt.current = answeredRef.current;
    return finishReviewSession()
      .then((r) => {
        if (r.points && r.points.gained > 0) setBonus(r.points);
        pointsRef.current?.apply(r.points);
        return r.points;
      })
      .catch(() => null);
  };

  // The session is over: the server decides whether it earns the review-session bonus.
  useEffect(() => {
    if (item || finished.current || session.length === 0) return;
    finished.current = true;
    if (answeredRef.current > 0) points?.celebrate();
    setEnding(true);
    void claim().finally(() => setEnding(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, session.length]);

  // Leaving part-way (another page, another tab, closing the app) still counts the reviews answered so far.
  useEffect(() => {
    const away = () => {
      if (document.visibilityState === 'hidden' && !finished.current && answeredRef.current > claimedAt.current) void claim();
    };
    document.addEventListener('visibilitychange', away);
    return () => {
      document.removeEventListener('visibilitychange', away);
      if (!finished.current && answeredRef.current > claimedAt.current) void claim();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A new question: tell keyboard and screen reader users where they are (not on first load).
  useEffect(() => {
    if (!moved.current) return;
    if (item) counterRef.current?.focus({ preventScroll: false });
    else doneTitleRef.current?.focus({ preventScroll: true });
  }, [index, item]);

  // "Review more": once the page has the next due questions, start a fresh round with them.
  useEffect(() => {
    if (!wantMore) return;
    setWantMore(false);
    const fresh = items.filter((i) => !results.has(i.view.id));
    if (!fresh.length) return;
    finished.current = false;
    claimedAt.current = 0;
    moved.current = false;
    setSession(fresh);
    setRound((n) => n + 1);
    setIndex(0);
    setResults(new Map());
    setEarned(new Map());
    setBonus(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const next = () => {
    moved.current = true;
    setIndex((i) => i + 1);
  };

  if (session.length === 0) return <>{empty}</>;

  if (!item) {
    const correct = [...results.values()].filter((o) => o === 'correct').length;
    // Everything this round earned: each answer's awards, then the session-end call's (the session bonus, and the daily goal if that took today over it).
    const all = new Map(earned);
    for (const e of bonus?.events ?? []) all.set(e.kind, (all.get(e.kind) ?? 0) + e.amount);
    const total = [...all.values()].reduce((n, v) => n + v, 0);
    const breakdown = SUMMARY.flatMap((b) => {
      const amount = b.kinds.reduce((n, k) => n + (all.get(k) ?? 0), 0);
      return amount > 0 ? [{ ...b, amount }] : [];
    });
    return (
      <section className="celebrate" aria-labelledby="review-done-title">
        <Spot name="review" size={120} />
        <h2 id="review-done-title" ref={doneTitleRef} tabIndex={-1}>
          Review done
        </h2>
        <p className="muted" style={{ marginTop: 10 }}>
          {results.size === 0
            ? 'You skipped these for now. They’ll wait for you.'
            : `${correct} of ${results.size} correct. Right answers move further apart; anything you missed comes back tomorrow.`}
        </p>
        <ul className="celebrate-stats">
          {showPoints && (
            <li className="celebrate-stat" data-kind="xp">
              <span className="celebrate-num">{ending ? '…' : `+${total}`}</span>
              <span className="celebrate-label">XP earned</span>
            </li>
          )}
          {results.size > 0 && (
            <li className="celebrate-stat" data-kind="accuracy">
              <span className="celebrate-num">{Math.round((100 * correct) / results.size)}%</span>
              <span className="celebrate-label">remembered</span>
            </li>
          )}
        </ul>
        {showPoints && !ending && breakdown.length > 1 && (
          <ul className="celebrate-breakdown" aria-label="What the XP was for">
            {breakdown.map((b) => (
              <li key={b.key}>
                {b.label} <strong className="tabular">+{b.amount}</strong>
              </li>
            ))}
          </ul>
        )}
        <div className="celebrate-actions">
          <Link href="/" className="btn btn-primary btn-lg">
            Back to home
          </Link>
          {session.length >= batchSize && (
            <button
              type="button"
              className="btn btn-ghost"
              aria-busy={wantMore || undefined}
              onClick={() => {
                setWantMore(true);
                router.refresh();
              }}
            >
              Review more
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="stack">
      <div className="row row-between">
        <div className="stack stack-xs">
          <p className="small muted tabular review-count" ref={counterRef} tabIndex={-1}>
            Question {index + 1} of {session.length}
          </p>
          <ol className="review-progress" aria-hidden="true">
            {session.map((it, i) => {
              const o = results.get(it.view.id);
              const state = i === index ? 'current' : o ? (DOT_STATE[o] ?? 'partial') : i < index ? 'skipped' : undefined;
              return <li key={it.view.id} data-state={state} />;
            })}
          </ol>
        </div>
        <Link href={item.sourceHref} className="tiny tap-pad">
          From: {item.sourceTitle}
        </Link>
      </div>
      <QuestionCard
        key={`${round}:${item.view.id}`}
        view={item.view}
        context="review"
        signedIn
        sourceHref={item.sourceHref}
        onFinal={(id, o) => setResults((m) => (m.has(id) ? m : new Map(m).set(id, o)))}
        onPoints={(p) =>
          setEarned((m) => {
            const n = new Map(m);
            for (const e of p.events) n.set(e.kind, (n.get(e.kind) ?? 0) + e.amount);
            return n;
          })
        }
      />
      <div className="row" style={{ justifyContent: 'flex-end' }}>
        {/* Different keys: a pressed Next must not turn into Skip under the student's finger (or focus). */}
        {answered ? (
          <button key={`next-${index}`} type="button" className="btn btn-primary" onClick={next}>
            {index + 1 < session.length ? 'Next question' : 'See summary'} <ArrowRightIcon />
          </button>
        ) : (
          <button key={`skip-${index}`} type="button" className="btn btn-ghost" onClick={next}>
            Skip <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
}
