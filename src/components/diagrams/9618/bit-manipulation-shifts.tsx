/**
 * Shifts (9618 4.3.1). The same byte, 1001 0110, is shifted one place four ways: logical left,
 * logical right, arithmetic right (sign bit copied in) and cyclic left (the bit that leaves
 * re-enters). The bit entering is highlighted in accent; the bit leaving in the start row is
 * shown in the second accent colour.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-bit-manipulation-shifts';

const W = 640;
const H = 400;
const CELL = 25;
const X_START = 150;
const X_RESULT = 366;

type Row = {
  label: string[];
  start: string;
  result: string;
  note: string;
  /** index highlighted in the result row: the bit that entered */
  entered: number;
  /** index highlighted in the start row: the bit that left */
  left: number;
  value: string;
};

const rows: Row[] = [
  { label: ['logical left 1'], start: '10010110', result: '00101100', note: '0 in, 1 lost', entered: 7, left: 0, value: '= 44' },
  { label: ['logical right 1'], start: '10010110', result: '01001011', note: '0 in, 0 lost', entered: 0, left: 7, value: '= 75' },
  { label: ['arithmetic right 1'], start: '10010110', result: '11001011', note: 'sign bit copied in', entered: 0, left: 7, value: '= -53' },
  { label: ['cyclic left 1'], start: '10010110', result: '00101101', note: 'lost bit re-enters', entered: 7, left: 0, value: '= 45' },
];

function Bits({
  bits,
  x,
  y,
  hot,
  tone,
}: {
  bits: string;
  x: number;
  y: number;
  hot: number;
  tone: 'accent' | 'accent-2';
}) {
  return (
    <g>
      {[...bits].map((b, i) => (
        <g key={i}>
          <rect
            x={x + i * CELL}
            y={y}
            width={CELL}
            height={26}
            className={
              i === hot ? `dg-fill-${tone} dg-thin` : b === '1' ? 'dg-fill-muted dg-thin' : 'dg-fill-surface dg-thin'
            }
          />
          <Label x={x + i * CELL + CELL / 2} y={y + 13} className="dg-text-small dg-mono">
            {b}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function ShiftsDiagram() {
  return (
    <Svg width={W} height={H}>
      {rows.map((r, i) => {
        const y = 34 + i * 86;
        return (
          <g key={r.label[0]}>
            <Label x={14} y={y + 6} anchor="start" className="dg-text-small dg-bold">
              {r.label[0]}
            </Label>
            <Label x={14} y={y + 22} anchor="start" className="dg-text-small dg-text-muted">
              {r.note}
            </Label>
            <Bits bits={r.start} x={X_START} y={y} hot={r.left} tone="accent-2" />
            <Label x={X_START + 8 * CELL + 8} y={y + 13} className="dg-text dg-text-muted">
              →
            </Label>
            <Bits bits={r.result} x={X_RESULT} y={y} hot={r.entered} tone="accent" />
            <Label x={X_RESULT + 8 * CELL + 8} y={y + 13} anchor="start" className="dg-text-small dg-mono dg-text-muted">
              {r.value}
            </Label>
          </g>
        );
      })}
      <Label x={320} y={378} className="dg-text-small dg-text-muted">
        highlighted: the bit that enters (right) and the bit that leaves (left)
      </Label>
    </Svg>
  );
}

export default ShiftsDiagram;
