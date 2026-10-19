/**
 * Presentational building blocks for points and celebrations. They only
 * render what they are given (no data fetching, no state), so they work in
 * server and client components alike. Styles live in src/styles/fun.css;
 * /styleguide shows every one of them.
 *
 * Motion: pops, bumps and confetti respect prefers-reduced-motion and
 * <html data-celebrations="off"> in CSS, so callers need not check.
 * To replay an animation (a new XP total, another combo step), change the
 * element's React key so it remounts.
 */
import type { CSSProperties, ReactNode } from 'react';
import { BoltIcon, CheckIcon, FlameIcon, LockIcon, MedalIcon, SnowflakeIcon, TrophyIcon } from '@/components/icons';

const css = (vars: Record<string, string | number>) => vars as CSSProperties;

/** Gold XP total, e.g. today's XP in the top bar. */
export function XpChip({ xp, solid, bump, label = 'XP' }: { xp: number; solid?: boolean; bump?: boolean; label?: string }) {
  return (
    <span className="xp-chip" data-variant={solid ? 'solid' : undefined} data-bump={bump || undefined}>
      <BoltIcon />
      {xp.toLocaleString('en-GB')}
      <span className="xp-chip-unit">{label}</span>
    </span>
  );
}

export type StreakState = 'lit' | 'cold' | 'frozen';

/** Streak flame with the day count. "cold" = today not done yet (never a warning). */
export function StreakChip({ days, state = 'lit', bump }: { days: number; state?: StreakState; bump?: boolean }) {
  return (
    <span className="streak-chip" data-state={state} data-bump={bump || undefined}>
      {state === 'frozen' ? <SnowflakeIcon /> : <FlameIcon />}
      {days}
      <span className="visually-hidden"> day streak</span>
    </span>
  );
}

/** Level number in a hexagon gem. Every fifth level can use the gold tier. */
export function LevelGem({ level, size, gold, bump }: { level: number; size?: 'sm' | 'lg'; gold?: boolean; bump?: boolean }) {
  return (
    <span className={`level-badge${size ? ` ${size}` : ''}`} data-tier={gold ? 'gold' : undefined} data-bump={bump || undefined} role="img" aria-label={`Level ${level}`}>
      <span aria-hidden="true">{level}</span>
    </span>
  );
}

/** Level, title and progress to the next level. */
export function LevelProgress({ level, title, into, needed }: { level: number; title: string; into: number; needed: number }) {
  const pct = needed > 0 ? Math.max(0, Math.min(100, Math.round((100 * into) / needed))) : 100;
  return (
    <div className="level-line">
      <LevelGem level={level} />
      <div className="level-progress grow">
        <div className="level-progress-meta">
          <span>
            <span className="level-name">Level {level}</span> <span className="level-title">{title}</span>
          </span>
          <span>
            {into.toLocaleString('en-GB')} / {needed.toLocaleString('en-GB')} XP
          </span>
        </div>
        <div
          className="meter meter-gold"
          role="progressbar"
          aria-label={`Progress to level ${level + 1}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          style={css({ '--value': pct })}
        >
          <span />
        </div>
      </div>
    </div>
  );
}

/** Today's XP against the daily goal as a ring. */
export function GoalRing({ xp, goal, size, bump }: { xp: number; goal: number; size?: 'lg'; bump?: boolean }) {
  const pct = goal > 0 ? Math.max(0, Math.min(1, xp / goal)) : 0;
  const complete = xp >= goal;
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <span
      className={`goal-ring${size ? ` ${size}` : ''}`}
      data-complete={complete || undefined}
      data-bump={bump || undefined}
      role="img"
      aria-label={complete ? `Daily goal reached: ${xp} of ${goal} XP` : `Daily goal: ${xp} of ${goal} XP`}
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="track" cx="24" cy="24" r={r} />
        <circle className="fill" cx="24" cy="24" r={r} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
      </svg>
      <span className="goal-ring-label" aria-hidden="true">
        {size === 'lg' ? (
          <span className="goal-ring-big">
            {xp}
            <small>of {goal} XP</small>
          </span>
        ) : complete ? (
          <CheckIcon />
        ) : (
          xp
        )}
      </span>
    </span>
  );
}

/** Floating "+15 XP". Place inside a .pop-anchor; give it a new key for each award. Visual only. */
export function XpPop({ amount, inline }: { amount: number; inline?: boolean }) {
  return (
    <span className="xp-pop" data-inline={inline || undefined} aria-hidden="true">
      <BoltIcon />+{amount} XP
    </span>
  );
}

/** "Combo ×3". Tier 2 from 5 in a row, tier 3 from 10. Remount (new key) on each step to bump. */
export function Combo({ count }: { count: number }) {
  const tier = count >= 10 ? 3 : count >= 5 ? 2 : 1;
  return (
    <span className="combo" data-tier={tier}>
      <FlameIcon />
      Combo <span className="combo-x">×{count}</span>
    </span>
  );
}

export type ToastKind = 'badge' | 'level' | 'goal' | 'streak';
const TOAST_ICON: Record<ToastKind, ReactNode> = {
  badge: <MedalIcon />,
  level: <TrophyIcon />,
  goal: <CheckIcon />,
  streak: <FlameIcon />,
};

/** Fixed region for toasts: bottom on phones (above the tab bar), top-right on desktop. */
export function ToastRegion({ children }: { children: ReactNode }) {
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {children}
    </div>
  );
}

/** A badge, level-up, goal or streak toast. Set leaving while it animates out. */
export function Toast({ kind, title, body, icon, leaving, action }: { kind: ToastKind; title: string; body?: ReactNode; icon?: ReactNode; leaving?: boolean; action?: ReactNode }) {
  return (
    <div className="toast" data-kind={kind} data-state={leaving ? 'leaving' : undefined}>
      <span className="toast-icon" aria-hidden="true">
        {icon ?? TOAST_ICON[kind]}
      </span>
      <div style={{ minWidth: 0 }}>
        <p className="toast-title">{title}</p>
        {body && <p className="toast-body">{body}</p>}
      </div>
      {action ?? <span />}
    </div>
  );
}

export type MedalHue = 'gold' | 'violet' | 'cyan' | 'orange' | 'green' | 'pink';

/** A badge in the gallery. Locked badges are greyed and say how to earn them. */
export function BadgeTile({
  name,
  description,
  earned,
  earnedOn,
  hue = 'gold',
  icon,
  isNew,
}: {
  name: string;
  description: string;
  earned: boolean;
  earnedOn?: string;
  hue?: MedalHue;
  icon?: ReactNode;
  isNew?: boolean;
}) {
  return (
    <div className="badge-tile" data-earned={earned} data-hue={hue === 'gold' ? undefined : hue} data-new={isNew || undefined}>
      <span className="badge-medal" aria-hidden="true">
        {icon ?? <MedalIcon />}
        {!earned && (
          <span className="badge-lock">
            <LockIcon />
          </span>
        )}
      </span>
      <p className="badge-name">
        {name}
        {!earned && <span className="visually-hidden"> (locked)</span>}
      </p>
      <p className="badge-desc">{description}</p>
      {earned && earnedOn && <p className="badge-when">Earned {earnedOn}</p>}
    </div>
  );
}

export interface CelebrationStat {
  label: string;
  value: ReactNode;
  hue?: 'gold' | 'good' | 'accent' | 'flame';
  icon?: ReactNode;
}

/** The end-of-lesson (or end-of-review) card. Put buttons in children. */
export function CelebrationCard({
  title,
  subtitle,
  stats = [],
  icon,
  tone = 'gold',
  headingId,
  children,
  label,
}: {
  title: string;
  subtitle?: ReactNode;
  stats?: CelebrationStat[];
  icon?: ReactNode;
  tone?: 'gold' | 'good';
  headingId?: string;
  children?: ReactNode;
  label?: string;
}) {
  return (
    <section className="celebrate" aria-live="polite" aria-label={label} aria-labelledby={label ? undefined : headingId}>
      <div className="celebrate-icon" data-tone={tone === 'good' ? 'good' : undefined} aria-hidden="true">
        {icon ?? <TrophyIcon />}
      </div>
      <h2 id={headingId}>{title}</h2>
      {subtitle && <div className="celebrate-sub">{subtitle}</div>}
      {stats.length > 0 && (
        <div className="celebrate-stats">
          {stats.map((s, i) => (
            <div key={s.label} className="celebrate-stat" data-hue={s.hue && s.hue !== 'gold' ? s.hue : undefined} style={css({ '--i': i })}>
              <span className="celebrate-stat-label">{s.label}</span>
              <span className="celebrate-stat-value">
                {s.icon}
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}
      {children && <div className="celebrate-actions">{children}</div>}
    </section>
  );
}

const CONFETTI_COLOURS = ['var(--xp)', 'var(--primary-hi)', 'var(--sub-9618-hi)', 'var(--sub-9702-hi)', 'var(--sub-9701-hi)', 'var(--sub-9709-hi)', '#ff7ad9'];

/** Deterministic confetti (same markup on server and client). Remount with a new seed to fire again. */
export function Confetti({ pieces = 40, seed = 1 }: { pieces?: number; seed?: number }) {
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: pieces }, (_, i) => {
        const w = 6 + Math.round(rand() * 6);
        const round = rand() > 0.7;
        return (
          <i
            key={i}
            style={css({
              '--x': `${Math.round(rand() * 1000) / 10}%`,
              '--c': CONFETTI_COLOURS[i % CONFETTI_COLOURS.length]!,
              '--w': `${w}px`,
              '--h': `${round ? w : w + 4 + Math.round(rand() * 6)}px`,
              '--r': round ? '50%' : '2px',
              '--delay': `${Math.round(rand() * 500)}ms`,
              '--dur': `${2000 + Math.round(rand() * 1400)}ms`,
              '--drift': `${Math.round((rand() - 0.5) * 240)}px`,
              '--spin': `${360 + Math.round(rand() * 900)}deg`,
            })}
          />
        );
      })}
    </div>
  );
}

export type DayState = 'done' | 'frozen' | 'today' | 'missed' | 'future';

/** The last 7 days of the streak. Missed days are just empty, never red. */
export function WeekDots({ days, label = 'Last 7 days' }: { days: Array<{ label: string; state: DayState; name?: string }>; label?: string }) {
  const word: Record<DayState, string> = { done: 'studied', frozen: 'covered by a freeze', today: 'today', missed: 'no study', future: 'to come' };
  return (
    <ol className="week-dots" aria-label={label}>
      {days.map((d, i) => (
        <li key={i} className="week-dot" data-state={d.state}>
          <span className="week-dot-mark" aria-hidden="true">
            {d.state === 'done' ? <CheckIcon /> : d.state === 'frozen' ? <SnowflakeIcon /> : null}
          </span>
          <span aria-hidden="true">{d.label}</span>
          <span className="visually-hidden">
            {d.name ?? d.label}: {word[d.state]}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** XP per day as bars (e.g. the last 14 days on Progress). */
export function XpBars({ days, height = 120, label = 'XP per day' }: { days: Array<{ label: string; xp: number; today?: boolean; name?: string }>; height?: number; label?: string }) {
  const max = Math.max(1, ...days.map((d) => d.xp));
  return (
    <ol className="xp-bars" aria-label={label} style={css({ '--n': days.length, '--bars-h': `${height}px` })}>
      {days.map((d, i) => (
        <li key={i} className="xp-bar" data-today={d.today || undefined} data-empty={d.xp === 0 || undefined} style={css({ '--h': Math.round((100 * d.xp) / max), '--i': i })}>
          <span className="xp-bar-col" aria-hidden="true">
            <span className="xp-bar-fill" />
          </span>
          <span className="xp-bar-label" aria-hidden="true">
            {d.label}
          </span>
          <span className="visually-hidden">
            {d.name ?? d.label}: {d.xp} XP
          </span>
        </li>
      ))}
    </ol>
  );
}
