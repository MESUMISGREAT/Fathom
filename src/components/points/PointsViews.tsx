/** Server-rendered points pieces: days studied this week, the level block and badge tiles. */
import { weekOf, type LevelInfo, type LocalDay } from '@/domain/points';
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

const dateLabel = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function BadgeTile({
  badge,
}: {
  badge: { id: string; name: string; description: string; howToEarn: string; earned: boolean; earnedAt: Date | null; progress: { current: number; target: number } };
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
            <CheckIcon aria-hidden="true" /> Earned {dateLabel(badge.earnedAt)}
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
