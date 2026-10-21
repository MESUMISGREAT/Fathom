/**
 * A velocity–time graph for a car journey, drawn to scale.
 * 0–4 s: 0 to 12 m s⁻¹ (gradient +3.0 m s⁻²); 4–10 s: constant 12 m s⁻¹
 * (gradient 0); 10–16 s: 12 m s⁻¹ to 0 (gradient −2.0 m s⁻²). Dashed gradient
 * triangles mark Δv and Δt for the two sloping sections.
 */
import { Label, Svg } from '../primitives';
import { MotionAxes, makePlot, poly } from './equations-motion-kit';

export const diagramKey = 'phys-equations-motion-vt-gradient';

const W = 600;
const H = 300;

export function EquationsMotionVtGradient() {
  const p = makePlot({ left: 64, top: 46, width: 470, height: 196, x: [0, 16], y: [0, 15] });
  return (
    <Svg width={W} height={H}>
      <MotionAxes p={p} xLabel="t / s" yLabel="v / m s⁻¹" xTicks={[2, 4, 6, 8, 10, 12, 14, 16]} yTicks={[3, 6, 9, 12, 15]} grid />
      {/* gradient triangles */}
      <path d={`M${p.sx(0)},${p.sy(0)} L${p.sx(4)},${p.sy(0)} L${p.sx(4)},${p.sy(12)}`} className="dg-thin dg-dashed" />
      <path d={`M${p.sx(10)},${p.sy(12)} L${p.sx(10)},${p.sy(0)} L${p.sx(16)},${p.sy(0)}`} className="dg-thin dg-dashed" />
      <path d={poly(p, [[0, 0], [4, 12], [10, 12], [16, 0]])} className="dg-accent" />
      {[[4, 12], [10, 12]].map(([t, v]) => (
        <circle key={t} cx={p.sx(t!)} cy={p.sy(v!)} r={4} className="dg-dot-accent" />
      ))}
      {/* segment 1 */}
      <Label x={p.sx(4) + 6} y={p.sy(6) - 8} anchor="start" className="dg-text-small">
        Δv =
      </Label>
      <Label x={p.sx(4) + 6} y={p.sy(6) + 8} anchor="start" className="dg-text-small">
        12 m s⁻¹
      </Label>
      <Label x={p.sx(2.6)} y={p.sy(1.6)} className="dg-text-small">
        Δt = 4 s
      </Label>
      <Label x={p.sx(0.3)} y={p.sy(10.6)} anchor="start" className="dg-text-small dg-bold">
        speeding up
      </Label>
      <Label x={p.sx(0.3)} y={p.sy(10.6) + 15} anchor="start" className="dg-text-small">
        a = +3.0 m s⁻²
      </Label>
      {/* segment 2 */}
      <Label x={p.sx(7)} y={p.sy(12) - 26} className="dg-text-small dg-bold">
        constant velocity
      </Label>
      <Label x={p.sx(7)} y={p.sy(12) - 11} className="dg-text-small">
        gradient 0, a = 0
      </Label>
      {/* segment 3 */}
      <Label x={p.sx(10) - 6} y={p.sy(6) - 8} anchor="end" className="dg-text-small">
        Δv =
      </Label>
      <Label x={p.sx(10) - 6} y={p.sy(6) + 8} anchor="end" className="dg-text-small">
        −12 m s⁻¹
      </Label>
      <Label x={p.sx(13)} y={p.sy(1.6)} className="dg-text-small">
        Δt = 6 s
      </Label>
      <Label x={p.sx(13.6)} y={p.sy(8.4)} anchor="start" className="dg-text-small dg-bold">
        slowing down
      </Label>
      <Label x={p.sx(13.6)} y={p.sy(8.4) + 15} anchor="start" className="dg-text-small">
        a = −2.0 m s⁻²
      </Label>
      <Label x={p.sx(8)} y={288} className="dg-text-small dg-text-muted">
        gradient of a velocity–time graph = acceleration
      </Label>
    </Svg>
  );
}

export default EquationsMotionVtGradient;
