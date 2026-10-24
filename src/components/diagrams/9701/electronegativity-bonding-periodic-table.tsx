/**
 * Pauling electronegativity values (to 1 d.p.) laid out as part of the Periodic Table:
 * groups 1, 2 and 13–17 for periods 2 and 3, plus groups 1, 2 and 17 further down
 * (K, Ca, Br; Rb, I). Each cell has a bar whose length is proportional to the value
 * (full width = 4.0). Arrows: electronegativity increases across a period and decreases
 * down a group, so fluorine (4.0, top right) is the most electronegative element.
 * Values: Li 1.0, Be 1.6, B 2.0, C 2.6, N 3.0, O 3.4, F 4.0; Na 0.9, Mg 1.3, Al 1.6,
 * Si 1.9, P 2.2, S 2.6, Cl 3.2; K 0.8, Ca 1.0, Br 3.0; Rb 0.8, I 2.7.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-electronegativity-bonding-periodic-table';

const W = 640;
const H = 420;
const X0 = 124;
const Y0 = 100;
const CW = 66;
const CH = 58;
const GAP = 6;
const GROUPS = ['1', '2', '13', '14', '15', '16', '17'];
const PERIODS = [2, 3, 4, 5];

/** [symbol, column (0 = group 1), row (0 = period 2), Pauling electronegativity]. */
const CELLS: Array<[string, number, number, number]> = [
  ['Li', 0, 0, 1.0], ['Be', 1, 0, 1.6], ['B', 2, 0, 2.0], ['C', 3, 0, 2.6], ['N', 4, 0, 3.0], ['O', 5, 0, 3.4], ['F', 6, 0, 4.0],
  ['Na', 0, 1, 0.9], ['Mg', 1, 1, 1.3], ['Al', 2, 1, 1.6], ['Si', 3, 1, 1.9], ['P', 4, 1, 2.2], ['S', 5, 1, 2.6], ['Cl', 6, 1, 3.2],
  ['K', 0, 2, 0.8], ['Ca', 1, 2, 1.0], ['Br', 6, 2, 3.0],
  ['Rb', 0, 3, 0.8], ['I', 6, 3, 2.7],
];

export function ElectronegativityBondingPeriodicTable() {
  const x = (c: number) => X0 + c * (CW + GAP);
  const y = (r: number) => Y0 + r * (CH + GAP);
  const right = x(GROUPS.length - 1) + CW;
  const bottom = y(PERIODS.length - 1) + CH;
  return (
    <Svg width={W} height={H}>
      {/* trend arrows */}
      <Label x={(X0 + right) / 2} y={22} className="dg-text-accent">
        increases across a period
      </Label>
      <Arrow x1={X0} y1={44} x2={right} y2={44} className="dg-accent" headClassName="dg-dot-accent" />
      <text
        x={22}
        y={(Y0 + bottom) / 2}
        transform={`rotate(-90 22 ${(Y0 + bottom) / 2})`}
        textAnchor="middle"
        dominantBaseline="middle"
        className="dg-text-accent-2"
      >
        decreases down a group
      </text>
      <Arrow x1={44} y1={Y0} x2={44} y2={bottom} className="dg-accent-2" headClassName="dg-dot-accent-2" />

      {/* headers */}
      <Label x={X0 - 10} y={Y0 - 16} anchor="end" className="dg-text-muted">
        group
      </Label>
      {GROUPS.map((g, c) => (
        <Label key={g} x={x(c) + CW / 2} y={Y0 - 16} className="dg-text-muted">
          {g}
        </Label>
      ))}
      {PERIODS.map((p, r) => (
        <Label key={p} x={X0 - 10} y={y(r) + CH / 2} anchor="end" className="dg-text-muted">
          {`period ${p}`}
        </Label>
      ))}

      {/* cells */}
      {CELLS.map(([sym, c, r, v]) => {
        const cx = x(c);
        const cy = y(r);
        const top = sym === 'F';
        const track = CW - 14;
        return (
          <g key={sym}>
            <rect x={cx} y={cy} width={CW} height={CH} rx={6} className={top ? 'dg-accent dg-fill-accent' : 'dg-thin dg-fill-surface'} />
            <Label x={cx + CW / 2} y={cy + 16} className="dg-text dg-bold">
              {sym}
            </Label>
            <Label x={cx + CW / 2} y={cy + 33} className="dg-text-small">
              {v.toFixed(1)}
            </Label>
            <rect x={cx + 7} y={cy + 44} width={track} height={6} rx={3} className="dg-fill-muted" />
            <rect x={cx + 7} y={cy + 44} width={(track * v) / 4} height={6} rx={3} className="dg-dot-accent" />
          </g>
        );
      })}

      <Label x={X0} y={bottom + 24} anchor="start" className="dg-text-small">
        Pauling values (no units). Bar length ∝ value; a full bar is 4.0.
      </Label>
      <Label x={X0} y={bottom + 42} anchor="start" className="dg-text-small">
        Noble gases are left out: they rarely form bonds.
      </Label>
    </Svg>
  );
}

export default ElectronegativityBondingPeriodicTable;
