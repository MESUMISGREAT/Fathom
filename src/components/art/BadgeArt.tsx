/**
 * One small illustration per badge in the catalogue (src/domain/points.ts).
 * Every badge is a round sticker in its own tone with a navy motif, so the
 * set reads as one family. Locked badges are drawn in grey by CSS
 * ([data-locked]). Decorative: the badge name is always shown as text.
 */
import type { BadgeId } from '@/domain/points';

type Tone = 'mint' | 'lavender' | 'coral' | 'sky' | 'yellow' | 'pink';

const ART: Record<BadgeId, { tone: Tone; body: React.ReactNode }> = {
  'first-steps': {
    tone: 'mint',
    body: (
      <>
        <ellipse className="b-solid" cx="25.5" cy="38" rx="4.6" ry="7" transform="rotate(-12 25.5 38)" />
        <circle className="b-solid" cx="21.4" cy="28.4" r="1.7" />
        <circle className="b-solid" cx="25" cy="27.4" r="1.9" />
        <circle className="b-solid" cx="28.6" cy="28.2" r="1.6" />
        <ellipse className="b-solid" cx="38.5" cy="31" rx="4.6" ry="7" transform="rotate(12 38.5 31)" />
        <circle className="b-solid" cx="35.4" cy="21.2" r="1.6" />
        <circle className="b-solid" cx="39" cy="20.4" r="1.9" />
        <circle className="b-solid" cx="42.6" cy="21.6" r="1.7" />
      </>
    ),
  },
  'recall-rookie': {
    tone: 'lavender',
    body: (
      <>
        <path className="b-ink" d="M42 27.5a11 11 0 1 0 1 8" />
        <path className="b-ink" d="M43.5 21.5v6.5H37" />
        <path className="b-pop b-ink-thin" d="m32 25.5 1.9 3.9 4.3.6-3.1 3 .7 4.3-3.8-2-3.8 2 .7-4.3-3.1-3 4.3-.6z" />
      </>
    ),
  },
  'getting-warmer': {
    tone: 'coral',
    body: (
      <>
        <rect className="b-pop b-ink" x="28.5" y="15" width="7" height="24" rx="3.5" />
        <circle className="b-deep b-ink" cx="32" cy="43" r="6.5" />
        <path className="b-deep-line" d="M32 26v13" />
        <path className="b-ink-thin" d="M39.5 21h3M39.5 26h3M39.5 31h3" />
        <path className="b-ink-thin" d="M21 22c-2 2.5 2 4.5 0 7M17 25c-2 2.5 2 4.5 0 7" />
      </>
    ),
  },
  flawless: {
    tone: 'sky',
    body: (
      <>
        <path className="b-pop b-ink" d="M20 27l6.5-8h11l6.5 8L32 45z" />
        <path className="b-ink-thin" d="M20 27h24M28.5 19 32 27l3.5-8M26.5 27 32 45l5.5-18" />
      </>
    ),
  },
  'on-a-roll': {
    tone: 'yellow',
    body: <path className="b-pop b-ink" d="M35.5 14 23 34h8.5L28.5 50 41 29h-8.5z" />,
  },
  'in-the-zone': {
    tone: 'coral',
    body: (
      <>
        <path className="b-flame" d="M28.5 40c0 4.5 1.8 7.5 3.5 9.5 1.7-2 3.5-5 3.5-9.5z" />
        <path className="b-pop b-ink" d="M32 14c6.5 5 8.5 13 6.5 24h-13C23.5 27 25.5 19 32 14z" />
        <circle className="b-deep b-ink-thin" cx="32" cy="26" r="3.4" />
        <path className="b-ink" d="M25.8 32 20 39l6.3-.8M38.2 32 44 39l-6.3-.8" />
      </>
    ),
  },
  'topic-finisher': {
    tone: 'mint',
    body: (
      <>
        <path className="b-pop b-ink" d="M13 46l12.5-17.5 6 8 5-6.5L51 46z" />
        <path className="b-ink" d="M25.5 28.5V15" />
        <path className="b-flag b-ink-thin" d="M25.5 15H35l-2.8 3.5L35 22h-9.5" />
      </>
    ),
  },
  'curious-mind': {
    tone: 'lavender',
    body: (
      <>
        <circle className="b-pop b-ink" cx="29" cy="29" r="10" />
        <path className="b-ink-thick" d="m36.5 36.5 9 9" />
        <path className="b-deep" d="m29 23.5 1.5 3.7 3.7 1.5-3.7 1.5-1.5 3.7-1.5-3.7-3.7-1.5 3.7-1.5z" />
      </>
    ),
  },
  'concept-master': {
    tone: 'sky',
    body: (
      <>
        <path className="b-pop b-ink" d="M32 15l12.5 4.8v9.4c0 8.2-5.6 13.8-12.5 16.3-6.9-2.5-12.5-8.1-12.5-16.3v-9.4z" />
        <path className="b-ink" d="m25.5 31 4.7 4.7 8.3-9" />
      </>
    ),
  },
  'comeback-arc': {
    tone: 'pink',
    body: (
      <>
        <path className="b-ink-thick" d="M21 19v12a11 11 0 0 0 22 0v-6" />
        <path className="b-ink-thick" d="m37.5 28.5 5.5-6 5.5 6" />
        <circle className="b-pop b-ink-thin" cx="21" cy="17" r="3" />
      </>
    ),
  },
  'consistency-club': {
    tone: 'yellow',
    body: (
      <>
        <rect className="b-pop b-ink" x="17" y="19" width="30" height="27" rx="4.5" />
        <path className="b-ink" d="M17 27h30M24.5 15.5v6.5M39.5 15.5v6.5" />
        <circle className="b-deep" cx="24" cy="33" r="2.4" />
        <circle className="b-deep" cx="32" cy="33" r="2.4" />
        <circle className="b-deep" cx="40" cy="33" r="2.4" />
        <circle className="b-deep" cx="24" cy="40.5" r="2.4" />
        <circle className="b-deep" cx="32" cy="40.5" r="2.4" />
      </>
    ),
  },
  'ten-down': {
    tone: 'sky',
    body: (
      <>
        <rect className="b-coral b-ink" x="18" y="37" width="28" height="8" rx="2.5" />
        <rect className="b-pop b-ink" x="21" y="29" width="25" height="8" rx="2.5" />
        <rect className="b-mint b-ink" x="17" y="21" width="26" height="8" rx="2.5" />
        <path className="b-ink-thin" d="M23 21v8M41 29v8M24 37v8" />
      </>
    ),
  },
  'half-century': {
    tone: 'yellow',
    body: (
      <>
        <path className="b-pop b-ink" d="M23.5 16h17v8.5a8.5 8.5 0 0 1-17 0z" />
        <path className="b-ink" d="M23.5 19h-4a4.5 4.5 0 0 0 4.5 5.5M40.5 19h4a4.5 4.5 0 0 1-4.5 5.5M32 33v5" />
        <rect className="b-deep b-ink" x="25" y="38" width="14" height="7" rx="2" />
        <path className="b-ink-thin" d="M29 22h6" />
      </>
    ),
  },
  'memory-keeper': {
    tone: 'lavender',
    body: (
      <>
        <circle className="b-pop b-ink" cx="25" cy="27" r="8" />
        <circle className="b-deep" cx="25" cy="27" r="2.6" />
        <path className="b-ink-thick" d="m30.5 32.5 13 13" />
        <path className="b-ink" d="m37.5 39.5 3.4-3.4M41.5 43.5l3.4-3.4" />
      </>
    ),
  },
  'goal-getter': {
    tone: 'coral',
    body: (
      <>
        <circle className="b-pop b-ink" cx="30" cy="34" r="13" />
        <circle className="b-deep" cx="30" cy="34" r="7.5" />
        <circle className="b-pop" cx="30" cy="34" r="3" />
        <path className="b-ink" d="M30 34 44 20" />
        <path className="b-ink" d="M40 16.5V24h7.5" />
      </>
    ),
  },
  explorer: {
    tone: 'mint',
    body: (
      <>
        <circle className="b-pop b-ink" cx="32" cy="32" r="14" />
        <path className="b-flag b-ink-thin" d="m38.5 25.5-4 10.5-10.5 4 4-10.5z" />
        <circle className="b-solid" cx="32" cy="32" r="1.8" />
        <path className="b-ink-thin" d="M32 14.5v3M32 46.5v3M14.5 32h3M46.5 32h3" />
      </>
    ),
  },
  'club-500': {
    tone: 'yellow',
    body: (
      <>
        <path className="b-pop b-ink" d="m32 12.5 4.6 9.3 10.2 1.5-7.4 7.2 1.8 10.2L32 35.9l-9.2 4.8 1.8-10.2-7.4-7.2 10.2-1.5z" />
        <rect className="b-deep" x="20" y="41" width="24" height="10" rx="5" />
        <text className="b-label" x="32" y="48.6" textAnchor="middle">
          500
        </text>
      </>
    ),
  },
  'club-2500': {
    tone: 'pink',
    body: (
      <>
        <path className="b-pop b-ink" d="M18 37 16 20l9 7 7-12 7 12 9-7-2 17z" />
        <circle className="b-solid" cx="32" cy="29" r="2" />
        <rect className="b-deep" x="19" y="41" width="26" height="10" rx="5" />
        <text className="b-label" x="32" y="48.6" textAnchor="middle">
          2.5K
        </text>
      </>
    ),
  },
};

export function BadgeArt({ id, size = 56, locked = false, className }: { id: string; size?: number; locked?: boolean; className?: string }) {
  const art = ART[id as BadgeId];
  return (
    <svg
      className={`badge-art${className ? ` ${className}` : ''}`}
      data-tone={art?.tone ?? 'yellow'}
      data-locked={locked || undefined}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="b-rim" cx="32" cy="32" r="30" />
      <circle className="b-face" cx="32" cy="32" r="25" />
      {art ? art.body : <path className="b-pop b-ink" d="m32 18 4 8 9 1.3-6.5 6.3 1.5 8.9L32 38.3l-8 4.2 1.5-8.9-6.5-6.3 9-1.3z" />}
    </svg>
  );
}
