/**
 * Three promises about the same data (9618 6.1.1). One card each for security, privacy and
 * integrity: security asks who can reach the data, privacy asks who may see a person's data,
 * integrity asks whether the values are still correct. Each card carries a small icon and a note
 * saying what breaks it.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-security-privacy-integrity';

const W = 640;
const H = 318;
const CARD_W = 196;
const GAP = 14;
const TOP = 12;
const CARD_H = 294;

type Card = {
  title: string;
  icon: 'lock' | 'person' | 'check';
  lines: string[];
  note: string[];
};

const cards: Card[] = [
  {
    title: 'SECURITY',
    icon: 'lock',
    lines: [
      'Protects data from',
      'unauthorised access,',
      'use, disclosure,',
      'modification or',
      'destruction.',
    ],
    note: ['Breached when', 'someone gets in', 'who should not.'],
  },
  {
    title: 'PRIVACY',
    icon: 'person',
    lines: [
      'Personal data kept',
      'to those entitled to',
      'see it, and used only',
      'for the purpose it',
      'was collected for.',
    ],
    note: ['Breached even', 'when the login', 'was valid.'],
  },
  {
    title: 'INTEGRITY',
    icon: 'check',
    lines: [
      'Data is accurate,',
      'consistent and',
      'complete: not',
      'altered, corrupted',
      'or lost.',
    ],
    note: ['Breached by typos,', 'crashes and', 'tampering.'],
  },
];

function Icon({ kind, cx, cy }: { kind: Card['icon']; cx: number; cy: number }) {
  if (kind === 'lock') {
    return (
      <g>
        <path d={`M${cx - 9},${cy - 2} v-7 a9,9 0 0 1 18,0 v7`} className="dg-thin" fill="none" />
        <rect x={cx - 14} y={cy - 2} width={28} height={22} rx={3} className="dg-fill-accent dg-thin" />
        <circle cx={cx} cy={cy + 8} r={2.5} className="dg-dot" />
        <line x1={cx} y1={cy + 10} x2={cx} y2={cy + 15} className="dg-muted" />
      </g>
    );
  }
  if (kind === 'person') {
    return (
      <g>
        <circle cx={cx} cy={cy - 8} r={8} className="dg-thin" fill="none" />
        <path d={`M${cx - 16},${cy + 20} q16,-20 32,0`} className="dg-thin" fill="none" />
      </g>
    );
  }
  return (
    <g>
      <rect x={cx - 13} y={cy - 14} width={26} height={30} rx={2} className="dg-thin" fill="none" />
      <line x1={cx - 8} y1={cy - 6} x2={cx + 8} y2={cy - 6} className="dg-grid" />
      <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} className="dg-grid" />
      <path d={`M${cx - 9},${cy + 8} l6,6 l12,-13`} className="dg-accent" fill="none" />
    </g>
  );
}

export function PrivacyIntegrityDiagram() {
  return (
    <Svg width={W} height={H}>
      {cards.map((card, i) => {
        const x0 = TOP + i * (CARD_W + GAP);
        const cx = x0 + CARD_W / 2;
        return (
          <g key={card.title}>
            <rect x={x0} y={TOP} width={CARD_W} height={CARD_H} rx={6} className="dg-fill-surface dg-thin" />
            <rect x={x0} y={TOP} width={CARD_W} height={32} rx={6} className="dg-fill-accent dg-thin" />
            <Label x={cx} y={TOP + 16} className="dg-text dg-bold">
              {card.title}
            </Label>
            <Icon kind={card.icon} cx={cx} cy={TOP + 66} />
            {card.lines.map((line, li) => (
              <Label key={line} x={cx} y={TOP + 118 + li * 19} className="dg-text-small">
                {line}
              </Label>
            ))}
            <line x1={x0 + 18} y1={TOP + 222} x2={x0 + CARD_W - 18} y2={TOP + 222} className="dg-grid" />
            {card.note.map((line, li) => (
              <Label key={line} x={cx} y={TOP + 242 + li * 17} className="dg-text-small dg-text-muted">
                {line}
              </Label>
            ))}
          </g>
        );
      })}
    </Svg>
  );
}

export default PrivacyIntegrityDiagram;
