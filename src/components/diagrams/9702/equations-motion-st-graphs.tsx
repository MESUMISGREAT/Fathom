/**
 * Displacement–time graphs, drawn to scale.
 * Left: straight-line segments. 0–4 s: 0 to 12 m (gradient +3 m s⁻¹);
 *   4–7 s: flat at 12 m (at rest); 7–10 s: back to 0 (gradient −4 m s⁻¹).
 * Right: a curve s = 0.5 t² (uniform acceleration 1 m s⁻² from rest). The
 *   tangent at t = 4 s (s = 8 m) is s = 4t − 8; its gradient triangle runs from
 *   (3 s, 4 m) to (5.5 s, 4 m) to (5.5 s, 14 m): Δs = 10 m over Δt = 2.5 s,
 *   so the velocity at t = 4 s is 4.0 m s⁻¹.
 */
import { Label, Svg } from '../primitives';
import { MotionAxes, curve, makePlot, poly } from './equations-motion-kit';

export const diagramKey = 'phys-equations-motion-st-graphs';

const W = 640;
const H = 320;

export function EquationsMotionStGraphs() {
  const L = makePlot({ left: 52, top: 62, width: 220, height: 200, x: [0, 10], y: [0, 14] });
  const R = makePlot({ left: 376, top: 62, width: 210, height: 200, x: [0, 6], y: [0, 18] });
  const tan = (t: number) => 4 * t - 8;
  return (
    <Svg width={W} height={H}>
      {/* ---------- left: straight lines ---------- */}
      <Label x={162} y={18} className="dg-text dg-bold">
        Straight lines: constant velocity
      </Label>
      <MotionAxes p={L} xLabel="t / s" yLabel="s / m" xTicks={[2, 4, 6, 8, 10]} yTicks={[4, 8, 12]} grid />
      <path d={poly(L, [[0, 0], [4, 12], [7, 12], [10, 0]])} className="dg-accent" />
      <Label x={L.sx(2.2)} y={L.sy(4)} anchor="start" className="dg-text-small dg-bold">
        +3 m s⁻¹
      </Label>
      <Label x={L.sx(5.5)} y={L.sy(12) - 14} className="dg-text-small dg-bold">
        at rest
      </Label>
      <Label x={L.sx(8.75)} y={L.sy(8.4)} anchor="start" className="dg-text-small dg-bold">
        −4 m s⁻¹
      </Label>
      <Label x={L.sx(5)} y={300} className="dg-text-small dg-text-muted">
        gradient = velocity
      </Label>

      {/* ---------- right: curve and tangent ---------- */}
      <Label x={482} y={18} className="dg-text dg-bold">
        Curve: use a tangent
      </Label>
      <MotionAxes p={R} xLabel="t / s" yLabel="s / m" xTicks={[1, 2, 3, 4, 5, 6]} yTicks={[4, 8, 12, 16]} grid />
      <path d={curve(R, (t) => 0.5 * t * t, 0, 6)} className="dg-accent" />
      <path d={curve(R, tan, 2.2, 5.95)} className="dg-accent-2" />
      {/* gradient triangle */}
      <path
        d={`M${R.sx(3)},${R.sy(4)} L${R.sx(5.5)},${R.sy(4)} L${R.sx(5.5)},${R.sy(14)}`}
        className="dg-thin dg-dashed"
      />
      <circle cx={R.sx(4)} cy={R.sy(8)} r={4.5} className="dg-dot" />
      <Label x={R.sx(4.25)} y={R.sy(4) + 13} className="dg-text-small">
        Δt = 2.5 s
      </Label>
      <Label x={R.sx(5.5) + 6} y={R.sy(9)} anchor="start" className="dg-text-small">
        Δs = 10 m
      </Label>
      <Label x={R.sx(0.2)} y={R.sy(13.5)} anchor="start" className="dg-text-small dg-text-accent-2">
        tangent at t = 4 s
      </Label>
      <Label x={R.sx(3)} y={300} className="dg-text-small dg-text-muted">
        velocity at 4 s = 10 ÷ 2.5 = 4.0 m s⁻¹
      </Label>
    </Svg>
  );
}

export default EquationsMotionStGraphs;
