/**
 * Spot illustrations for empty states, the lesson-complete card, not-found
 * and error pages. Small, decorative (aria-hidden) and drawn with theme
 * tokens, so they work in light and dark.
 */
export type SpotName = 'review' | 'saved' | 'history' | 'search' | 'subjects' | 'progress' | 'badges' | 'done' | 'lost' | 'oops' | 'welcome';

const SPOTS: Record<SpotName, React.ReactNode> = {
  review: (
    <>
      <rect className="a-paper a-ink" x="30" y="30" width="62" height="44" rx="9" transform="rotate(-8 61 52)" />
      <rect className="a-paper a-ink" x="40" y="24" width="62" height="44" rx="9" transform="rotate(5 71 46)" />
      <path className="a-faint-thick" d="M52 40h28M52 50h20" transform="rotate(5 71 46)" />
      <circle className="a-mint a-ink" cx="100" cy="66" r="13" />
      <path className="a-ink" d="m94 66 4 4 8-8.5" />
    </>
  ),
  saved: (
    <>
      <path className="a-yellow a-ink" d="M50 16h40v68L70 70 50 84z" />
      <path className="a-ink" d="M60 34h20" />
      <path className="a-coral" d="M104 20l2.4 6.6 6.6 2.4-6.6 2.4-2.4 6.6-2.4-6.6-6.6-2.4 6.6-2.4z" />
      <circle className="a-dot" cx="30" cy="40" r="3" />
    </>
  ),
  history: (
    <>
      <path className="a-faint-thick" d="M18 76c22 0 18-26 40-26s18-24 40-24" strokeDasharray="1 9" />
      <circle className="a-mint a-ink" cx="18" cy="76" r="6" />
      <circle className="a-yellow a-ink" cx="58" cy="50" r="6" />
      <path className="a-ink" d="M98 26V8" />
      <path className="a-coral a-ink" d="M98 8h16l-4 5 4 5H98" />
    </>
  ),
  search: (
    <>
      <rect className="a-paper a-ink" x="18" y="18" width="70" height="60" rx="9" />
      <path className="a-faint-thick" d="M30 34h44M30 46h30M30 58h38" />
      <rect className="a-coral-soft" x="28" y="42" width="34" height="8" rx="4" />
      <circle className="a-paper a-ink-thick" cx="88" cy="58" r="15" />
      <path className="a-ink-thick" d="m99 69 13 13" />
    </>
  ),
  subjects: (
    <>
      <path className="a-paper a-ink" d="M20 26c14-6 28-6 40 2 12-8 26-8 40-2v52c-14-6-28-6-40 2-12-8-26-8-40-2z" />
      <path className="a-ink" d="M60 28v52" />
      <rect className="a-coral a-ink" x="28" y="14" width="10" height="18" rx="3" />
      <rect className="a-mint a-ink" x="42" y="10" width="10" height="20" rx="3" />
      <rect className="a-sky a-ink" x="70" y="12" width="10" height="20" rx="3" />
      <rect className="a-lavender a-ink" x="84" y="16" width="10" height="18" rx="3" />
    </>
  ),
  progress: (
    <>
      <path className="a-paper a-ink" d="M14 82V66h24V52h24V38h24V24h20v58z" />
      <path className="a-ink" d="M96 24V8" />
      <path className="a-mint a-ink" d="M96 8h14l-3.5 4.5L110 17H96" />
      <circle className="a-yellow a-ink" cx="26" cy="58" r="5" />
    </>
  ),
  badges: (
    <>
      <path className="a-coral a-ink" d="M48 10h12l6 22H54zM72 10h-12l-6 22h12z" />
      <circle className="a-yellow a-ink" cx="60" cy="56" r="24" />
      <circle className="a-ink" cx="60" cy="56" r="16" />
      <path className="a-ink" d="m60 45 3.4 6.9 7.6 1.1-5.5 5.3 1.3 7.5L60 62.3l-6.8 3.5 1.3-7.5-5.5-5.3 7.6-1.1z" />
    </>
  ),
  done: (
    <>
      <path className="a-coral" d="M18 30l5-3 2 6zM100 22l6 1-2 5zM104 70l4 4-5 2zM14 72l6-1-1 6z" />
      <circle className="a-yellow" cx="28" cy="52" r="3" />
      <circle className="a-lavender" cx="96" cy="46" r="3.5" />
      <path className="a-sky" d="M88 12l2.2 5.8L96 20l-5.8 2.2L88 28l-2.2-5.8L80 20l5.8-2.2z" />
      <circle className="a-mint a-ink" cx="60" cy="48" r="28" />
      <path className="a-ink-thick" d="m47 48 9 9 17-18" />
    </>
  ),
  lost: (
    <>
      <path className="a-sky-soft" d="M0 30c10-6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 30 0v66H0z" />
      <path className="a-ink" d="M0 30c10-6 20-6 30 0s20 6 30 0 20-6 30 0 20 6 30 0" />
      <path className="a-ink" d="M60 6v52" strokeDasharray="3 5" />
      <path className="a-coral a-ink" d="M60 56c5 0 8 3.6 8 7.8a8 8 0 0 1-16 0c0-4.2 3-7.8 8-7.8z" />
      <path className="a-yellow a-ink" d="M84 72c6-6 14-6 20 0-6 6-14 6-20 0zM84 72l-6-5v10z" />
      <circle className="a-dot" cx="99" cy="71" r="1.6" />
    </>
  ),
  oops: (
    <>
      <path className="a-ink-thick" d="M14 70c18 0 20-40 38-40 14 0 6 26 18 26s8-30 20-30c8 0 10 10 16 10" />
      <circle className="a-coral a-ink" cx="52" cy="30" r="5" />
      <circle className="a-yellow a-ink" cx="90" cy="26" r="5" />
      <path className="a-faint-thick" d="M20 84h80" />
    </>
  ),
  welcome: (
    <>
      <rect className="a-paper a-ink" x="14" y="20" width="92" height="60" rx="10" />
      <path className="a-faint-thick" d="M26 36h40M26 48h28" />
      <rect className="a-mint-soft a-ink" x="26" y="58" width="52" height="12" rx="6" />
      <path className="a-ink" d="m31 64 3 3 5-5.5" />
      <rect className="a-yellow a-ink" x="72" y="8" width="40" height="20" rx="10" />
      <path className="a-ink" d="m84 11.5 1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" />
      <path className="a-ink" d="M95 18h9" />
    </>
  ),
};

export function Spot({ name, size = 120, className }: { name: SpotName; size?: number; className?: string }) {
  return (
    <svg
      className={`art spot${className ? ` ${className}` : ''}`}
      viewBox="0 0 120 96"
      width={size}
      height={(size * 96) / 120}
      aria-hidden="true"
      focusable="false"
    >
      {SPOTS[name]}
    </svg>
  );
}
