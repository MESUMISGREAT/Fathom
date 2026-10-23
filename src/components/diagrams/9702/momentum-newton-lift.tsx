/**
 * Free-body diagrams for an 800 kg lift in three states, forces drawn to
 * scale (0.01 px per newton). Weight W = 800 × 9.81 = 7848 N in every panel.
 *   Accelerating upwards at 1.5 m s⁻²: T = m(g + a) = 9048 N, longer than W.
 *   Constant velocity: T = W = 7848 N.
 *   Accelerating downwards at 1.5 m s⁻²: T = m(g − a) = 6648 N, shorter than W.
 * The acceleration arrow (accent) points the same way as the resultant force.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-lift';

const W = 620;
const H = 330;
const G = 9.81;
const M = 800;
const K = 0.011; // px per newton

function Lift({ x0, a, title, line1, line2 }: { x0: number; a: number; title: string; line1: string; line2: string }) {
  const cx = x0 + 88;
  const cabTop = 140;
  const cabH = 64;
  const cy = cabTop + cabH / 2;
  const T = M * (G + a);
  const Wt = M * G;
  const ax = cx + 66;
  return (
    <g>
      <Label x={x0 + 103} y={18} className="dg-text dg-bold">
        {title}
      </Label>
      {/* cable */}
      <line x1={cx} y1={30} x2={cx} y2={cabTop} className="dg-muted" />
      {/* cab */}
      <rect x={cx - 30} y={cabTop} width={60} height={cabH} className="dg-fill-muted dg-thin" />
      <Label x={cx} y={cabTop + 15} className="dg-text-small">
        800 kg
      </Label>
      <Arrow x1={cx} y1={cabTop} x2={cx} y2={cabTop - T * K} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={cx} y1={cy} x2={cx} y2={cy + Wt * K} />
      <circle cx={cx} cy={cy} r={3} className="dg-dot" />
      <Label x={cx - 8} y={cabTop - 46} anchor="end" className="dg-text-accent-2">
        T
      </Label>
      <Label x={cx - 8} y={cy + 66} anchor="end" className="dg-text dg-bold">
        W
      </Label>
      {/* acceleration */}
      {a === 0 ? (
        <Label x={ax} y={cy} className="dg-text-small dg-text-accent">
          a = 0
        </Label>
      ) : (
        <g>
          <Arrow
            x1={ax}
            y1={a > 0 ? cy + 22 : cy - 22}
            x2={ax}
            y2={a > 0 ? cy - 22 : cy + 22}
            className="dg-accent"
            headClassName="dg-dot-accent"
          />
          <Label x={ax + 10} y={cy} anchor="start" className="dg-text-small dg-text-accent">
            a
          </Label>
        </g>
      )}
      <Label x={x0 + 103} y={296} className="dg-text-small dg-bold">
        {line1}
      </Label>
      <Label x={x0 + 103} y={314} className="dg-text-small">
        {line2}
      </Label>
    </g>
  );
}

export function MomentumNewtonLift() {
  return (
    <Svg width={W} height={H}>
      <Lift x0={0} a={1.5} title="Accelerating up" line1="T > W" line2="T = m(g + a) = 9050 N" />
      <line x1={206} y1={30} x2={206} y2={278} className="dg-grid" />
      <Lift x0={207} a={0} title="Constant velocity" line1="T = W" line2="T = mg = 7850 N" />
      <line x1={413} y1={30} x2={413} y2={278} className="dg-grid" />
      <Lift x0={414} a={-1.5} title="Accelerating down" line1="T < W" line2="T = m(g − a) = 6650 N" />
    </Svg>
  );
}

export default MomentumNewtonLift;
