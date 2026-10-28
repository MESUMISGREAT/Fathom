/**
 * Bit masking (9618 4.3.2). ACC holds 0101 1010 throughout. AND with 0000 1000 tests bit 3;
 * OR with 0000 0100 sets bit 2; XOR with 0000 1111 flips the low nibble. Changed bits in the
 * result are highlighted.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-bit-manipulation-masking';

const W = 620;
const H = 432;
const CELL = 24;
const X_BITS = 214;

type Panel = {
  title: string;
  op: string;
  acc: string;
  mask: string;
  result: string;
  note: string;
  /** indices highlighted in the result */
  changed: number[];
};

const panels: Panel[] = [
  {
    title: 'AND — test bit 3',
    op: 'AND',
    acc: '01011010',
    mask: '00001000',
    result: '00001000',
    note: 'non-zero → bit 3 is set',
    changed: [3],
  },
  {
    title: 'OR — set bit 2',
    op: 'OR',
    acc: '01011010',
    mask: '00000100',
    result: '01011110',
    note: 'bit 2 set, rest unchanged',
    changed: [2],
  },
  {
    title: 'XOR — flip the low nibble',
    op: 'XOR',
    acc: '01011010',
    mask: '00001111',
    result: '01010101',
    note: 'low nibble inverted',
    changed: [0, 1, 2, 3],
  },
];

function Bits({
  bits,
  y,
  highlight = [],
}: {
  bits: string;
  y: number;
  highlight?: number[];
}) {
  return (
    <g>
      {[...bits].map((b, i) => (
        <g key={i}>
          <rect
            x={X_BITS + i * CELL}
            y={y}
            width={CELL}
            height={24}
            className={
              highlight.includes(i)
                ? 'dg-fill-accent dg-thin'
                : b === '1'
                  ? 'dg-fill-muted dg-thin'
                  : 'dg-fill-surface dg-thin'
            }
          />
          <Label x={X_BITS + i * CELL + CELL / 2} y={y + 12} className="dg-text-small dg-mono">
            {b}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function MaskingDiagram() {
  return (
    <Svg width={W} height={H}>
      {panels.map((p, pi) => {
        const y0 = 26 + pi * 138;
        return (
          <g key={p.title}>
            <Label x={14} y={y0 + 10} anchor="start" className="dg-text dg-bold">
              {p.title}
            </Label>
            <Label x={196} y={y0 + 40} anchor="end" className="dg-text-small dg-text-muted">
              ACC
            </Label>
            <Bits bits={p.acc} y={y0 + 28} />
            <Label x={196} y={y0 + 66} anchor="end" className="dg-text-small dg-text-muted">
              mask
            </Label>
            <Bits bits={p.mask} y={y0 + 54} />
            <Label x={196} y={y0 + 92} anchor="end" className="dg-text-small dg-text-accent dg-bold">
              {p.op}
            </Label>
            <Bits bits={p.result} y={y0 + 80} highlight={p.changed} />
            <Label x={X_BITS} y={y0 + 116} anchor="start" className="dg-text-small dg-text-muted">
              {p.note}
            </Label>
            {pi < panels.length - 1 && (
              <line x1={14} y1={y0 + 128} x2={W - 14} y2={y0 + 128} className="dg-grid" />
            )}
          </g>
        );
      })}
    </Svg>
  );
}

export default MaskingDiagram;
