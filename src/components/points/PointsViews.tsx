/** Server-rendered points pieces: days studied this week, the level block, badge tiles and the XP rules. */
import { REVIEW_SESSION_MIN_ANSWERS, weekOf, XP, type LevelInfo, type LocalDay } from '@/domain/points';
import { BadgeArt } from '@/components/art/BadgeArt';
import { CheckIcon, LockIcon, StarFilledIcon } from '@/components/icons';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Seven dots, Monday to Sunday: filled for days with any XP. No streak, no warnings. */
export function WeekDots({ today, studied }: { today: LocalDay; studied: readonly LocalDay[] }) {
  const days = weekOf(today);
  const set = new Set(studied);
  const count = days.filter((d) => set.has(d)).length;
  return (
    <div className="week">
      <p className="week-count">
        <strong className="tabular">{count}</strong> {count === 1 ? 'day' : 'days'} studied this week
      </p>
      <ol className="week-dots" aria-label="Days studied this week">
        {days.map((d, i) => {
          const done = set.has(d);
          const isToday = d === today;
          const future = d > today;
          return (
            <li key={d} data-done={done || undefined} data-today={isToday || undefined} data-future={future || undefined}>
              <span className="week-dot" aria-hidden="true">
                {done && <CheckIcon />}
              </span>
              <span className="week-label" aria-hidden="true">
                {DAY_NAMES[i]![0]}
              </span>
              <span className="visually-hidden">
                {DAY_NAMES[i]}
                {isToday ? ' (today)' : ''}: {done ? 'studied' : future ? 'still to come' : 'not studied'}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Level coin, title, XP and the bar to the next level. */
export function LevelBlock({ level, totalXp, compact = false }: { level: LevelInfo; totalXp: number; compact?: boolean }) {
  const pct = Math.round(level.progress * 100);
  return (
    <div className={`level-block${compact ? ' compact' : ''}`}>
      <span className="level-coin lg" aria-hidden="true">
        {level.level}
      </span>
      <div className="level-text">
        <p className="level-title">
          Level {level.level} <span className="level-name">{level.title}</span>
        </p>
        <p className="level-xp tabular">
          <StarFilledIcon aria-hidden="true" /> {totalXp.toLocaleString('en-GB')} XP
        </p>
        <div
          className="meter meter-xp"
          role="progressbar"
          aria-label={`Progress to level ${level.level + 1}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          style={{ ['--value' as string]: pct }}
        >
          <span />
        </div>
        <p className="tiny muted tabular">
          {level.xpIntoLevel} / {level.xpForNextLevel} XP to level {level.level + 1}
          {level.nextTitle ? ` · ${level.nextTitle.title} at level ${level.nextTitle.level}` : ''}
        </p>
      </div>
    </div>
  );
}

/** The date in the student's own time zone, like their XP days and history. */
const dateLabel = (d: Date, timeZone: string) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone });

/**
 * An earned badge on the achievements shelf: its art and name, with what it
 * was for and when in a disclosure (an open one spans the whole row), so the
 * shelf stays a compact grid of medals rather than a column of identical tiles.
 */
export function BadgeMedal({
  badge,
  timeZone,
}: {
  badge: { id: string; name: string; description: string; earnedAt: Date | null };
  timeZone: string;
}) {
  return (
    <li className="badge-medal">
      <details>
        <summary>
          <BadgeArt id={badge.id} size={64} />
          <span className="badge-medal-name">{badge.name}</span>
          {badge.earnedAt && <span className="badge-medal-date">{dateLabel(badge.earnedAt, timeZone)}</span>}
        </summary>
        <p className="badge-medal-desc">
          {badge.description}
          {badge.earnedAt && (
            <>
              {' '}
              <span className="badge-tile-date">
                <CheckIcon aria-hidden="true" /> Earned {dateLabel(badge.earnedAt, timeZone)}
              </span>
            </>
          )}
        </p>
      </details>
    </li>
  );
}

export function BadgeTile({
  badge,
  timeZone,
}: {
  badge: { id: string; name: string; description: string; howToEarn: string; earned: boolean; earnedAt: Date | null; progress: { current: number; target: number } };
  /** IANA zone for the "Earned" date (canonicalTimeZone(user.timeZone)). */
  timeZone: string;
}) {
  const { current, target } = badge.progress;
  const pct = target > 0 ? Math.round((100 * current) / target) : 0;
  return (
    <li className="badge-tile" data-locked={!badge.earned || undefined}>
      <span className="badge-tile-art">
        <BadgeArt id={badge.id} size={72} locked={!badge.earned} />
        {!badge.earned && (
          <span className="badge-lock" aria-hidden="true">
            <LockIcon />
          </span>
        )}
      </span>
      <span className="badge-tile-text">
        <span className="badge-tile-name">{badge.name}</span>
        <span className="visually-hidden">{badge.earned ? ', earned. ' : ', locked. '}</span>
        <span className="badge-tile-desc">{badge.earned ? badge.description : badge.howToEarn}</span>
        {badge.earned && badge.earnedAt ? (
          <span className="badge-tile-date">
            <CheckIcon aria-hidden="true" /> Earned {dateLabel(badge.earnedAt, timeZone)}
          </span>
        ) : target > 1 ? (
          <span className="badge-tile-progress">
            <span
              className="meter meter-thin"
              role="progressbar"
              aria-label={`${badge.name} progress`}
              aria-valuemin={0}
              aria-valuemax={target}
              aria-valuenow={current}
              style={{ ['--value' as string]: pct }}
            >
              <span />
            </span>
            <span className="tiny tabular">
              {current.toLocaleString('en-GB')} / {target.toLocaleString('en-GB')}
            </span>
          </span>
        ) : null}
      </span>
    </li>
  );
}

/** Every way to earn XP, built from the one XP config (so the copy can't drift from the rules). */
export function XpRules({ className = '' }: { className?: string }) {
  return (
    <ul className={className}>
      <li>
        Right on your first try: {XP.firstTry[1]}, {XP.firstTry[2]} or {XP.firstTry[3]} XP by difficulty (half for partly right). Missed it? Get it
        right on another day: {XP.laterFix}. A retry straight after the answer was shown, or answering something you already got right, earns
        nothing, so points can&rsquo;t be farmed.
      </li>
      <li>
        A review answered while it&rsquo;s due: {XP.review.correct} ({XP.review.partial} if partly right). A review session of {REVIEW_SESSION_MIN_ANSWERS}{' '}
        or more due questions in a day: +{XP.reviewSession}. A question you once missed, now right in review: +{XP.comeback}.
      </li>
      <li>
        Finishing a lesson with every check answered: {XP.lesson} (+{XP.perfect} if every answer was right first time). Skipped a check? The lesson
        still counts as finished, and its XP arrives when you answer the rest. Every lesson in a topic finished: {XP.topic}. Every objective in a
        topic Secure: {XP.topicSecure}.
      </li>
      <li>
        Combos (new right answers in a row): +{XP.combo.at3} at 3, +{XP.combo.at5} at 5, +{XP.combo.at10AndEvery5} at 10 and every 5 after. Reaching your daily goal: +{XP.dailyGoal}.
      </li>
    </ul>
  );
}
