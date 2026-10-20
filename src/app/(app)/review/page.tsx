import type { Metadata } from 'next';
import { requireUser } from '@/server/auth/session';
import { getDueQuestions, nextDueAt } from '@/server/queries/review';
import { lessonLocations } from '@/server/queries/catalog';
import { ReviewSession } from '@/components/questions/ReviewSession';
import { EmptyState, PageHead } from '@/components/ui';
import { ChevronRightIcon } from '@/components/icons';
import { BOX_INTERVAL_DAYS } from '@/domain/schedule';
import { REVIEW_SESSION_MIN_ANSWERS } from '@/domain/points';

export const metadata: Metadata = { title: 'Review' };

function when(d: Date) {
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return 'later today';
  if (days === 1) return 'tomorrow';
  return `in ${days} days`;
}

/** Questions per session. */
const BATCH = 10;

export default async function ReviewPage() {
  const user = await requireUser('/review');
  const due = await getDueQuestions(user.id, BATCH);
  const locs = await lessonLocations([...new Set(due.map((d) => d.lessonId))]);
  const items = due.flatMap((d) => {
    const loc = locs.get(d.lessonId);
    return loc ? [{ view: d.view, sourceHref: loc.href, sourceTitle: loc.title }] : [];
  });
  const upcoming = items.length === 0 ? await nextDueAt(user.id) : null;

  return (
    <div className="container-narrow">
      <PageHead
        art="review"
        title="Review"
        lede="Questions you've answered before come back just before you're likely to forget them. A few minutes is plenty."
      />
      {/* Always mounted: a refresh mid-session (after the session bonus) must not replace the running session. */}
      <ReviewSession
        items={items}
        batchSize={BATCH}
        empty={
          <EmptyState art="done" title="Nothing to review right now">
            <p>
              {upcoming
                ? `Your next review question is due ${when(upcoming)}.`
                : 'Answer questions in a lesson and they’ll start appearing here at spaced intervals.'}
            </p>
          </EmptyState>
        }
      />
      <details className="disclosure" style={{ marginTop: 32 }}>
        <summary>
          <ChevronRightIcon className="disclosure-chevron" /> How review timing works
        </summary>
        <div className="disclosure-body prose small">
          <p>
            Each question sits in a box. Answer it correctly and it moves up a box, so it comes back after a longer gap (
            {BOX_INTERVAL_DAYS.map((d) => `${d} day${d === 1 ? '' : 's'}`).join(', ')}). Miss it and it goes back to box 1, so you see it again
            tomorrow. Answering early (for example re-doing a lesson) doesn&rsquo;t skip a box, so cramming can&rsquo;t fake the spacing.
          </p>
          <p>
            Review shows up to {BATCH} questions at a time, most overdue first. A due review answered right earns XP, and a session of{' '}
            {REVIEW_SESSION_MIN_ANSWERS} or more due questions in a day adds a small bonus (it still counts if you stop part-way). Miss a few days and it
            simply waits for you; nothing is lost.
          </p>
        </div>
      </details>
    </div>
  );
}
