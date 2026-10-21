/**
 * The four combinations of velocity and acceleration direction in a straight
 * line, with the positive direction to the right. Each row shows a cart with
 * its velocity arrow (above) and acceleration arrow (below), the signs of v
 * and a, and the result: same direction = speeding up, opposite directions =
 * slowing down.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-equations-motion-sign-cases';

const W = 600;
const H = 400;

type Row = { v: 1 | -1; a: 1 | -1; result: string };
const rows: Row[] = [
  { v: 1, a: 1, result: 'speeding up' },
  { v: 1, a: -1, result: 'slowing down' },
  { v: -1, a: -1, result: 'speeding up' },
  { v: -1, a: 1, result: 'slowing down' },
];

const sign = (n: number) => (n > 0 ? '+' : '−');

function Cart({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 26} y={y - 13} width={52} height={22} rx={5} className="dg-fill-accent dg-thin" />
      <circle cx={x - 14} cy={y + 13} r={5} className="dg-fill-muted dg-thin" />
      <circle cx={x + 14} cy={y + 13} r={5} className="dg-fill-muted dg-thin" />
    </g>
  );
}

export function EquationsMotionSignCases() {
  const top = 104;
  const gap = 82;
  const cx = 150; // cart centre
  return (
    <Svg width={W} height={H}>
      {/* positive direction */}
      <Arrow x1={60} y1={26} x2={170} y2={26} className="dg-line" head={10} />
      <Label x={180} y={26} anchor="start" className="dg-text dg-bold">
        positive direction
      </Label>
      {/* column headings */}
      <Label x={cx} y={58} className="dg-text-small dg-text-muted">
        v above, a below
      </Label>
      <Label x={330} y={58} className="dg-text-small dg-text-muted">
        signs
      </Label>
      <Label x={490} y={58} className="dg-text-small dg-text-muted">
        result
      </Label>
      {rows.map((r, i) => {
        const y = top + i * gap;
        const vx1 = cx - 40 * r.v;
        const vx2 = cx + 40 * r.v;
        const ax1 = cx - 32 * r.a;
        const ax2 = cx + 32 * r.a;
        const same = r.v === r.a;
        return (
          <g key={i}>
            {i > 0 && <line x1={30} y1={y - 42} x2={W - 30} y2={y - 42} className="dg-grid" />}
            <Arrow x1={vx1} y1={y - 26} x2={vx2} y2={y - 26} className="dg-accent" headClassName="dg-dot-accent" head={9} />
            <Label x={cx - 58} y={y - 26} anchor="end" className="dg-text-accent">
              v
            </Label>
            <Cart x={cx} y={y} />
            <Arrow x1={ax1} y1={y + 26} x2={ax2} y2={y + 26} className="dg-accent-2" headClassName="dg-dot-accent-2" head={9} />
            <Label x={cx - 58} y={y + 26} anchor="end" className="dg-text-accent-2">
              a
            </Label>
            <Label x={330} y={y} className="dg-text">
              {`v ${sign(r.v)},  a ${sign(r.a)}`}
            </Label>
            <Label x={490} y={y - 8} className="dg-text dg-bold">
              {r.result}
            </Label>
            <Label x={490} y={y + 11} className="dg-text-small dg-text-muted">
              {same ? 'same direction' : 'opposite directions'}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}

export default EquationsMotionSignCases;
