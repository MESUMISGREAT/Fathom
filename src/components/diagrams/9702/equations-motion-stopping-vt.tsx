/**
 * Velocity–time graph (to scale) of the two-stage emergency stop from the
 * solving-suvat lesson: 20 m s⁻¹ held for a 0.70 s reaction time, then a
 * uniform deceleration of 6.5 m s⁻² to rest.
 *   braking time = 20 / 6.5 = 3.08 s, so the car stops at t = 3.78 s
 *   thinking distance = 20 × 0.70 = 14 m (rectangle)
 *   braking distance  = ½ × 3.08 × 20 = 30.8 m (triangle)
 *   total = 44.8 m
 */
import { Label, Svg } from '../primitives';
import { MotionAxes, makePlot, poly } from './equations-motion-kit';

export const diagramKey = 'phys-equations-motion-stopping-vt';

const W = 600;
const H = 300;
const V0 = 20;
const TR = 0.7;
const A = 6.5;
const TSTOP = TR + V0 / A;

export function EquationsMotionStoppingVt() {
  const p = makePlot({ left: 64, top: 50, width: 440, height: 196, x: [0, 4.2], y: [0, 24] });
  const fmtX = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(2));
  return (
    <Svg width={W} height={H}>
      {/* areas */}
      <path d={`${poly(p, [[0, 0], [0, V0], [TR, V0], [TR, 0]])} Z`} className="dg-fill-accent" />
      <path d={`${poly(p, [[TR, 0], [TR, V0], [TSTOP, 0]])} Z`} className="dg-fill-accent-2" />
      <MotionAxes p={p} xLabel="t / s" yLabel="v / m s⁻¹" xTicks={[TR, 1, 2, 3, TSTOP]} yTicks={[5, 10, 15, 20]} fmtX={fmtX} />
      <line x1={p.sx(TR)} y1={p.sy(V0)} x2={p.sx(TR)} y2={p.sy(0)} className="dg-muted dg-dashed" />
      {/* the graph */}
      <path d={poly(p, [[0, V0], [TR, V0], [TSTOP, 0]])} className="dg-accent" />

      {/* labels */}
      <Label x={p.sx(TR / 2)} y={p.sy(12)} className="dg-text-small dg-bold">
        thinking
      </Label>
      <Label x={p.sx(TR / 2)} y={p.sy(12) + 16} className="dg-text-small">
        14 m
      </Label>
      <Label x={p.sx(1.55)} y={p.sy(6.5)} className="dg-text-small dg-bold">
        braking
      </Label>
      <Label x={p.sx(1.55)} y={p.sy(6.5) + 16} className="dg-text-small">
        ½ × 3.08 × 20 = 30.8 m
      </Label>
      <Label x={p.sx(TR) + 8} y={p.sy(V0) - 12} anchor="start" className="dg-text-small">
        brakes on at 0.70 s
      </Label>
      <Label x={p.sx(2.55)} y={p.sy(13)} anchor="start" className="dg-text-small">
        gradient = −6.5 m s⁻²
      </Label>
      <Label x={W - 16} y={30} anchor="end" className="dg-text-small dg-bold">
        stopping distance = total area = 14 + 30.8 = 44.8 m
      </Label>
    </Svg>
  );
}

export default EquationsMotionStoppingVt;
