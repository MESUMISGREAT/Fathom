/**
 * One mole of four substances, drawn to scale as bars of mass: carbon
 * 12.0 g, water 18.0 g, sodium chloride 58.5 g, calcium carbonate 100.1 g
 * (molar masses from Data Booklet relative atomic masses). Every bar holds
 * the same number of particles, 6.022 × 10²³, but the particles differ:
 * atoms, molecules or formula units. A mole is a number, not a mass.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-mole-avogadro-same-count';

const W = 640;
const H = 330;
const X0 = 190;
const PX = 3.6; // pixels per gram
const BAR = 22;

const ROWS = [
  { name: 'carbon, C', mass: 12.0, particles: 'C atoms' },
  { name: 'water, H₂O', mass: 18.0, particles: 'H₂O molecules' },
  { name: 'sodium chloride, NaCl', mass: 58.5, particles: 'NaCl formula units' },
  { name: 'calcium carbonate, CaCO₃', mass: 100.1, particles: 'CaCO₃ formula units' },
];

export function MoleAvogadroSameCount() {
  const top = 46;
  const step = 60;
  const axisY = top + ROWS.length * step - 6;
  const x = (g: number) => X0 + g * PX;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={18} className="dg-text dg-bold">
        1 mol of each: the same number of particles, different masses
      </Label>
      {[0, 20, 40, 60, 80, 100].map((g) => (
        <line key={g} x1={x(g)} y1={top - 6} x2={x(g)} y2={axisY} className="dg-grid" />
      ))}
      {ROWS.map((r, i) => {
        const y = top + i * step;
        return (
          <g key={r.name}>
            <Label x={X0 - 10} y={y + BAR / 2} anchor="end" className="dg-text">
              {r.name}
            </Label>
            <rect x={X0} y={y} width={r.mass * PX} height={BAR} rx={3} className="dg-fill-accent dg-accent" />
            <Label x={x(r.mass) + 8} y={y + BAR / 2} anchor="start" className="dg-text dg-bold">
              {`${r.mass.toFixed(1)} g`}
            </Label>
            <Label x={X0} y={y + BAR + 13} anchor="start" className="dg-text-small">
              {`6.022 × 10²³ ${r.particles}`}
            </Label>
          </g>
        );
      })}
      <line x1={X0} y1={axisY} x2={x(105)} y2={axisY} className="dg-line" />
      {[0, 20, 40, 60, 80, 100].map((g) => (
        <g key={g}>
          <line x1={x(g)} y1={axisY} x2={x(g)} y2={axisY + 5} className="dg-thin" />
          <Label x={x(g)} y={axisY + 17} className="dg-text-small">
            {String(g)}
          </Label>
        </g>
      ))}
      <Label x={x(52)} y={axisY + 40} className="dg-text">
        mass of one mole / g
      </Label>
    </Svg>
  );
}

export default MoleAvogadroSameCount;
