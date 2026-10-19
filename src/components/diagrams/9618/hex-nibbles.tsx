/**
 * Binary to hexadecimal by nibbles: the 16-bit pattern 1011 0110 1111 0001 is
 * split into groups of four bits (8-4-2-1 weights), and each group becomes one
 * hex digit: B, 6, F, 1.
 */
import { Arrow, Label, Svg } from '../primitives';

const W = 600;
const H = 232;
const CELL = 30;
const GROUP = 4 * CELL;
const GAP = 24;
const X0 = (W - (4 * GROUP + 3 * GAP)) / 2;
const Y = 46;

const nibbles = [
  { bits: '1011', hex: 'B', sum: '8 + 2 + 1 = 11' },
  { bits: '0110', hex: '6', sum: '4 + 2 = 6' },
  { bits: '1111', hex: 'F', sum: '8 + 4 + 2 + 1 = 15' },
  { bits: '0001', hex: '1', sum: '1 = 1' },
];
const weights = ['8', '4', '2', '1'];

export function HexNibbles() {
  return (
    <Svg width={W} height={H}>
      {nibbles.map((n, g) => {
        const gx = X0 + g * (GROUP + GAP);
        const gcx = gx + GROUP / 2;
        return (
          <g key={g}>
            {[...n.bits].map((b, i) => {
              const cx = gx + i * CELL + CELL / 2;
              return (
                <g key={i}>
                  <Label x={cx} y={Y - 14} className="dg-text-small dg-text-muted">
                    {weights[i]}
                  </Label>
                  <rect
                    x={gx + i * CELL}
                    y={Y}
                    width={CELL}
                    height={38}
                    className={b === '1' ? 'dg-fill-accent dg-thin' : 'dg-fill-muted dg-thin'}
                  />
                  <Label x={cx} y={Y + 20} className="dg-text dg-mono">
                    {b}
                  </Label>
                </g>
              );
            })}
            <path d={`M${gx + 2},${Y + 46} L${gx + 2},${Y + 52} L${gx + GROUP - 2},${Y + 52} L${gx + GROUP - 2},${Y + 46}`} className="dg-muted" />
            <Arrow x1={gcx} y1={Y + 54} x2={gcx} y2={Y + 82} head={7} className="dg-muted" headClassName="dg-dot" />
            <Label x={gcx} y={Y + 100} className="dg-text-accent dg-mono">
              {n.hex}
            </Label>
            <Label x={gcx} y={Y + 124} className="dg-text-muted">
              {n.sum}
            </Label>
          </g>
        );
      })}
      <Label x={W / 2} y={H - 20} className="dg-text dg-bold">
        1011 0110 1111 0001 (binary) = B6F1 (hex)
      </Label>
    </Svg>
  );
}
