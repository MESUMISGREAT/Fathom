/**
 * Spectator ions in a precipitation reaction. Silver nitrate solution
 * (Ag⁺ and NO₃⁻ ions) is mixed with sodium chloride solution (Na⁺ and Cl⁻
 * ions). After mixing, Ag⁺ and Cl⁻ have joined to form a solid precipitate
 * of silver chloride at the bottom, while Na⁺ and NO₃⁻ are still free in
 * solution, unchanged: they are spectator ions and are left out of the
 * ionic equation Ag⁺(aq) + Cl⁻(aq) → AgCl(s).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-chemical-formulas-spectator-ions';

const W = 640;
const H = 350;
const TOP = 46;
const DEPTH = 150;

function Beaker({ x, w }: { x: number; w: number }) {
  const y = TOP;
  const b = y + DEPTH;
  return (
    <g>
      <path d={`M${x + 4},${y + 34} L${x + 4},${b - 10} Q${x + 4},${b - 4} ${x + 12},${b - 4} L${x + w - 12},${b - 4} Q${x + w - 4},${b - 4} ${x + w - 4},${b - 10} L${x + w - 4},${y + 34} Z`} className="dg-fill-accent" />
      <path d={`M${x - 6},${y} L${x},${y + 6} L${x},${b - 12} Q${x},${b} ${x + 12},${b} L${x + w - 12},${b} Q${x + w},${b} ${x + w},${b - 12} L${x + w},${y + 6} L${x + w + 6},${y}`} className="dg-line" />
      <line x1={x + 4} y1={y + 34} x2={x + w - 4} y2={y + 34} className="dg-thin" />
    </g>
  );
}

type Ion = [number, number, string, boolean?];

function Ions({ list }: { list: Ion[] }) {
  return (
    <g>
      {list.map(([x, y, t, spectator], i) => (
        <Label key={i} x={x} y={y} className={spectator ? 'dg-text-accent-2' : 'dg-text dg-bold'}>
          {t}
        </Label>
      ))}
    </g>
  );
}

export function ChemicalFormulasSpectatorIons() {
  const b1 = 20;
  const b2 = 190;
  const b3 = 420;
  return (
    <Svg width={W} height={H}>
      <Beaker x={b1} w={140} />
      <Ions list={[[b1 + 40, TOP + 62, 'Ag⁺'], [b1 + 100, TOP + 82, 'NO₃⁻', true], [b1 + 45, TOP + 108, 'NO₃⁻', true], [b1 + 102, TOP + 126, 'Ag⁺']]} />
      <Label x={b1 + 70} y={TOP + DEPTH + 22} className="dg-text">
        AgNO₃(aq)
      </Label>

      <Label x={(b1 + 140 + b2) / 2} y={TOP + 85} className="dg-text dg-bold">
        +
      </Label>

      <Beaker x={b2} w={140} />
      <Ions list={[[b2 + 42, TOP + 64, 'Na⁺', true], [b2 + 100, TOP + 84, 'Cl⁻'], [b2 + 40, TOP + 110, 'Cl⁻'], [b2 + 98, TOP + 128, 'Na⁺', true]]} />
      <Label x={b2 + 70} y={TOP + DEPTH + 22} className="dg-text">
        NaCl(aq)
      </Label>

      <Arrow x1={346} y1={TOP + 85} x2={404} y2={TOP + 85} />
      <Label x={375} y={TOP + 68} className="dg-text-small">
        mix
      </Label>

      <Beaker x={b3} w={200} />
      <Ions list={[[b3 + 40, TOP + 56, 'Na⁺', true], [b3 + 100, TOP + 60, 'NO₃⁻', true], [b3 + 162, TOP + 54, 'Na⁺', true], [b3 + 52, TOP + 92, 'NO₃⁻', true], [b3 + 108, TOP + 96, 'Na⁺', true], [b3 + 164, TOP + 90, 'NO₃⁻', true]]} />
      {/* precipitate of AgCl at the bottom */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={b3 + 20 + i * 12} y={TOP + DEPTH - 24 + (i % 2) * 4} width={10} height={10} rx={2} className="dg-fill-muted dg-thin" />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={`t${i}`} x={b3 + 38 + i * 12} y={TOP + DEPTH - 34 + (i % 2) * 3} width={10} height={10} rx={2} className="dg-fill-muted dg-thin" />
      ))}
      <Label x={b3 + 160} y={TOP + DEPTH - 22} anchor="middle" className="dg-text-small dg-bold">
        AgCl(s)
      </Label>
      <Label x={b3 + 100} y={TOP + DEPTH + 22} className="dg-text">
        after mixing
      </Label>

      <Label x={20} y={TOP + DEPTH + 64} anchor="start" className="dg-text-accent-2">
        spectator ions: Na⁺(aq) and NO₃⁻(aq), unchanged before and after
      </Label>
      <Label x={20} y={TOP + DEPTH + 94} anchor="start" className="dg-text-accent">
        ionic equation: Ag⁺(aq) + Cl⁻(aq) → AgCl(s)
      </Label>
      <Label x={20} y={TOP + DEPTH + 124} anchor="start" className="dg-text-small">
        Only the ions that change appear in the ionic equation.
      </Label>
    </Svg>
  );
}

export default ChemicalFormulasSpectatorIons;
