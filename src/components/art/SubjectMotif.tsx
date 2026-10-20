/**
 * Small subject motifs: a parabola for Maths, bits and code for Computer
 * Science, a wave and an orbit for Physics, a ring and a flask for Chemistry.
 * Decorative (aria-hidden); colours come from the subject's tokens via
 * [data-subject] on an ancestor, so they follow light and dark themes.
 */
const MOTIFS: Record<string, React.ReactNode> = {
  '9709': (
    <>
      <path className="a-faint" d="M12 66h96M22 8v66" />
      <path className="a-faint" d="M12 46h96M12 26h96M52 8v66M82 8v66" strokeDasharray="2 5" />
      <path className="a-stroke" d="M30 14c7 52 37 52 48 0" />
      <circle className="a-fill-2 a-ink" cx="54" cy="53" r="5.5" />
      <path className="a-ink" d="M101 14H89l6 7-6 7h12" />
    </>
  ),
  '9618': (
    <>
      <rect className="a-fill a-ink" x="12" y="16" width="22" height="22" rx="6" />
      <rect className="a-paper a-ink" x="40" y="16" width="22" height="22" rx="6" />
      <rect className="a-fill a-ink" x="68" y="16" width="22" height="22" rx="6" />
      <path className="a-ink" d="M23 22v10M79 22v10" />
      <ellipse className="a-ink" cx="51" cy="27" rx="4" ry="5.5" />
      <path className="a-ink" d="M101 18l-6 9 6 9" />
      <path className="a-faint-thick" d="M12 52h30M48 52h18M12 64h14M32 64h40" />
      <rect className="a-fill-2" x="78" y="49" width="16" height="6" rx="3" />
    </>
  ),
  '9702': (
    <>
      <path className="a-faint" d="M8 40h104" />
      <path className="a-stroke" d="M8 40c10-26 20-26 30 0s20 26 30 0 20-26 30 0 10 13 14 6" />
      <ellipse className="a-ink" cx="88" cy="20" rx="16" ry="7" transform="rotate(-18 88 20)" />
      <circle className="a-fill-2 a-ink" cx="88" cy="20" r="4.5" />
      <circle className="a-dot" cx="74" cy="25" r="2.5" />
      <path className="a-ink" d="M18 66h24M36 60l6 6-6 6" />
    </>
  ),
  '9701': (
    <>
      <path className="a-paper a-ink" d="M30 12l17 10v20L30 52 13 42V22z" />
      <circle className="a-stroke-thin" cx="30" cy="32" r="9" />
      <path className="a-ink" d="M47 22l12-7M47 42l12 7" />
      <path className="a-paper a-ink" d="M78 10h14M81 10v18L69 58a4 4 0 0 0 3.6 6h24.8a4 4 0 0 0 3.6-6L89 28V10" />
      <path className="a-fill" d="M74.2 46h21.6l4.6 12.4a3 3 0 0 1-2.8 3.6H72.4a3 3 0 0 1-2.8-3.6z" />
      <circle className="a-fill-2 a-ink" cx="84" cy="38" r="3" />
      <circle className="a-fill-2 a-ink" cx="91" cy="30" r="2.2" />
    </>
  ),
};

export function SubjectMotif({ code, className }: { code: string; className?: string }) {
  return (
    <svg className={`art subject-motif${className ? ` ${className}` : ''}`} viewBox="0 0 120 80" aria-hidden="true" focusable="false" data-subject={code}>
      {MOTIFS[code] ?? MOTIFS['9709']}
    </svg>
  );
}
