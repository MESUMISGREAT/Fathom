/**
 * The three motion graphs for a ball thrown straight up and caught at the
 * same height, taking upwards as positive, with no air resistance. Launch
 * speed u = 9.81 m s⁻¹, so the ball reaches the top at t = 1.00 s
 * (s = 4.905 m) and is caught at t = 2.00 s. All three are drawn to scale on a
 * shared time axis:
 *   s = 9.81t − 4.905t²   (an upside-down parabola)
 *   v = 9.81 − 9.81t      (a straight line, gradient −9.81 m s⁻²)
 *   a = −9.81 m s⁻²       (a horizontal line, the same at the top)
 * A dashed line at t = 1 s links the top of the flight on all three graphs.
 */
import { Label, Svg } from '../primitives';
import { MotionAxes, curve, makePlot } from './equations-motion-kit';

export const diagramKey = 'phys-equations-motion-throw-graphs';

const W = 600;
const H = 540;
const G = 9.81;
const LEFT = 92;
const WIDTH = 380;
const X: [number, number] = [0, 2.15];
const fmt2 = (n: number) => (n < 0 ? `−${Math.abs(n).toFixed(2)}` : n.toFixed(2));
const fmt1 = (n: number) => `${n}`;

export function EquationsMotionThrowGraphs() {
  const ps = makePlot({ left: LEFT, top: 38, width: WIDTH, height: 110, x: X, y: [0, 6] });
  const pv = makePlot({ left: LEFT, top: 210, width: WIDTH, height: 130, x: X, y: [-12, 12] });
  const pa = makePlot({ left: LEFT, top: 400, width: WIDTH, height: 90, x: X, y: [-12, 3] });
  const tTop = 1;
  return (
    <Svg width={W} height={H}>
      {/* link the top of the flight across all three graphs */}
      <line x1={ps.sx(tTop)} y1={ps.sy(6)} x2={ps.sx(tTop)} y2={ps.sy(0)} className="dg-muted dg-dashed" />
      <line x1={pv.sx(tTop)} y1={pv.sy(12)} x2={pv.sx(tTop)} y2={pv.sy(-12)} className="dg-muted dg-dashed" />
      <line x1={pa.sx(tTop)} y1={pa.sy(0) + 22} x2={pa.sx(tTop)} y2={pa.sy(-12)} className="dg-muted dg-dashed" />

      {/* ---------- displacement ---------- */}
      <MotionAxes p={ps} xLabel="t / s" yLabel="s / m" xTicks={[0.5, 1, 1.5, 2]} yTicks={[2, 4]} fmtX={fmt1} />
      <line x1={ps.sx(0)} y1={ps.sy(4.905)} x2={ps.sx(tTop)} y2={ps.sy(4.905)} className="dg-grid" />
      <path d={curve(ps, (t) => G * t - 0.5 * G * t * t, 0, 2)} className="dg-accent" />
      <circle cx={ps.sx(tTop)} cy={ps.sy(4.905)} r={4} className="dg-dot" />
      <Label x={ps.sx(tTop) + 10} y={ps.sy(4.905) - 12} anchor="start" className="dg-text-small">
        top: gradient 0, so v = 0
      </Label>
      <Label x={ps.sx(2) + 4} y={ps.sy(0) - 14} anchor="start" className="dg-text-small dg-text-muted">
        caught
      </Label>

      {/* ---------- velocity ---------- */}
      <MotionAxes p={pv} xLabel="t / s" yLabel="v / m s⁻¹" xTicks={[0.5, 1.5, 2]} yTicks={[-G, G]} fmtX={fmt1} fmtY={fmt2} />
      <path d={curve(pv, (t) => G - G * t, 0, 2)} className="dg-accent" />
      <circle cx={pv.sx(tTop)} cy={pv.sy(0)} r={4} className="dg-dot" />
      <Label x={pv.sx(tTop) + 8} y={pv.sy(0) - 14} anchor="start" className="dg-text-small">
        v = 0 at the top
      </Label>
      <Label x={pv.sx(0.3)} y={pv.sy(11)} anchor="start" className="dg-text-small">
        going up: v positive
      </Label>
      <Label x={pv.sx(1.08)} y={pv.sy(-11)} anchor="start" className="dg-text-small">
        coming down: v negative
      </Label>
      <Label x={pv.sx(1.08)} y={pv.sy(7)} anchor="start" className="dg-text-small">
        straight line, gradient −9.81 m s⁻²
      </Label>

      {/* ---------- acceleration ---------- */}
      <MotionAxes p={pa} xLabel="t / s" yLabel="a / m s⁻²" xTicks={[0.5, 1, 1.5, 2]} yTicks={[-G]} fmtX={fmt1} fmtY={fmt2} />
      <path d={curve(pa, () => -G, 0, 2)} className="dg-accent" />
      <circle cx={pa.sx(tTop)} cy={pa.sy(-G)} r={4} className="dg-dot" />
      <Label x={pa.sx(1.05)} y={pa.sy(-G) - 14} anchor="start" className="dg-text-small">
        still −9.81 m s⁻² at the top
      </Label>

      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        ball thrown up at 9.81 m s⁻¹, upwards positive, no air resistance
      </Label>
    </Svg>
  );
}

export default EquationsMotionThrowGraphs;
