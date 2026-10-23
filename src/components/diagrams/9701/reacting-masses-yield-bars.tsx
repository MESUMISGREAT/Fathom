/**
 * Percentage yield as two bars drawn to scale (50 px per gram). Making ethyl
 * ethanoate from 6.00 g of ethanoic acid: theoretical yield 8.80 g (0.100 mol
 * × 88.0 g mol⁻¹), actual yield 5.72 g. The 3.08 g gap (35.0% of the
 * theoretical yield) is drawn dashed, with the usual reasons listed below.
 * Percentage yield = 5.72 ÷ 8.80 × 100 = 65.0%.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-reacting-masses-yield-bars';

const W = 640;
const H = 330;
const X0 = 150;
const PX = 50; // pixels per gram
const BAR = 34;
const THEORY = 8.8;
const ACTUAL = 5.72;

export function ReactingMassesYieldBars() {
  const x = (g: number) => X0 + g * PX;
  const y1 = 44;
  const y2 = 104;
  const axisY = 160;
  return (
    <Svg width={W} height={H}>
      {/* theoretical */}
      <Label x={X0 - 12} y={y1 + BAR / 2 - 8} anchor="end" className="dg-text dg-bold">
        theoretical
      </Label>
      <Label x={X0 - 12} y={y1 + BAR / 2 + 9} anchor="end" className="dg-text-small">
        from the equation
      </Label>
      <rect x={x(0)} y={y1} width={THEORY * PX} height={BAR} rx={4} className="dg-fill-muted dg-line" />
      <Label x={x(THEORY) - 10} y={y1 + BAR / 2} anchor="end" className="dg-text dg-bold">
        8.80 g (100%)
      </Label>

      {/* actual + the gap */}
      <Label x={X0 - 12} y={y2 + BAR / 2 - 8} anchor="end" className="dg-text dg-bold">
        actual
      </Label>
      <Label x={X0 - 12} y={y2 + BAR / 2 + 9} anchor="end" className="dg-text-small">
        weighed at the end
      </Label>
      <rect x={x(0)} y={y2} width={ACTUAL * PX} height={BAR} rx={4} className="dg-fill-accent dg-accent" />
      <Label x={x(ACTUAL) - 10} y={y2 + BAR / 2} anchor="end" className="dg-text dg-bold">
        5.72 g
      </Label>
      <rect x={x(ACTUAL)} y={y2} width={(THEORY - ACTUAL) * PX} height={BAR} rx={4} className="dg-fill-accent-2 dg-accent-2 dg-dashed" />
      <Label x={(x(ACTUAL) + x(THEORY)) / 2} y={y2 + BAR / 2} className="dg-text-small dg-bold">
        3.08 g missing
      </Label>

      {/* axis */}
      <line x1={x(0)} y1={axisY} x2={x(9)} y2={axisY} className="dg-line" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
        <g key={g}>
          <line x1={x(g)} y1={axisY} x2={x(g)} y2={axisY + 5} className="dg-thin" />
          <Label x={x(g)} y={axisY + 16} className="dg-text-small">
            {String(g)}
          </Label>
        </g>
      ))}
      <Label x={(x(0) + x(9)) / 2} y={axisY + 36} className="dg-text-muted">
        mass of ethyl ethanoate / g
      </Label>

      {/* where it went */}
      <Label x={24} y={232} anchor="start" className="dg-text dg-bold">
        where the missing product goes:
      </Label>
      {[
        'reaction incomplete, or reversible so it reaches equilibrium',
        'side reactions make other products',
        'losses when transferring, filtering and purifying',
      ].map((t, i) => (
        <g key={t}>
          <circle cx={32} cy={254 + i * 20} r={3} className="dg-dot-accent-2" />
          <Label x={42} y={254 + i * 20} anchor="start" className="dg-text-small">
            {t}
          </Label>
        </g>
      ))}
      <Label x={W - 24} y={232} anchor="end" className="dg-text-accent">
        % yield = 5.72 ÷ 8.80 × 100
      </Label>
      <Label x={W - 24} y={254} anchor="end" className="dg-text-accent">
        = 65.0%
      </Label>
    </Svg>
  );
}

export default ReactingMassesYieldBars;
