import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/server/auth/session';
import { getPointsHistory } from '@/server/queries/points';
import { XP } from '@/domain/points';
import { EmptyState, PageHead } from '@/components/ui';
import { BadgeTile, LevelBlock } from '@/components/points/PointsViews';

export const metadata: Metadata = { title: 'Achievements' };

export default async function AchievementsPage() {
  const user = await requireUser('/achievements');
  if (user.showPoints === false) {
    return (
      <div className="container-narrow">
        <PageHead title="Achievements" />
        <EmptyState art="badges" title="Points and badges are hidden">
          <p>You turned them off. XP is still recorded, so turning them back on shows your real history.</p>
          <Link href="/settings#s-points" className="btn btn-primary">
            Open settings
          </Link>
        </EmptyState>
      </div>
    );
  }
  const h = await getPointsHistory(user.id);
  const earned = h.badges.filter((b) => b.earned);
  const locked = h.badges.filter((b) => !b.earned);

  return (
    <div className="container">
      <div className="achieve-head">
        <PageHead
          title="Achievements"
          lede={`${h.earnedCount} of ${h.badges.length} badges earned. Locked ones show what to do next and how close you are.`}
        />
        <div className="panel panel-yellow">
          <LevelBlock level={h.level} totalXp={h.totalXp} />
        </div>
      </div>

      <div className="stack stack-xl">
        {earned.length > 0 && (
          <section aria-labelledby="earned-title">
            <div className="section-head">
              <h2 id="earned-title">Earned</h2>
              <span className="small muted tabular">{earned.length}</span>
            </div>
            <ul className="badge-grid">
              {earned.map((b) => (
                <BadgeTile key={b.id} badge={b} />
              ))}
            </ul>
          </section>
        )}
        {locked.length > 0 && (
          <section aria-labelledby="locked-title">
            <div className="section-head">
              <h2 id="locked-title">Still to earn</h2>
              <span className="small muted tabular">{locked.length}</span>
            </div>
            <ul className="badge-grid">
              {locked.map((b) => (
                <BadgeTile key={b.id} badge={b} />
              ))}
            </ul>
          </section>
        )}
        <section className="panel stack stack-sm" aria-labelledby="xp-rules">
          <h2 id="xp-rules" className="h3">
            How XP works
          </h2>
          <p className="small muted">
            Right first time earns {XP.firstTry[1]}–{XP.firstTry[3]} XP depending on difficulty, a due review {XP.review.correct}, and a finished lesson{' '}
            {XP.lesson} (+{XP.perfect} if every answer was right first time). Answering something you already got right earns nothing, and XP never goes
            down. <Link href="/about#points">More about points</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
