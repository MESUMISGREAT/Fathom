/**
 * A velocity-time graph: accelerate from rest at 2.5 m/s^2 for 4 s, hold
 * 10 m/s for 6 s, then decelerate at 5 m/s^2 for 2 s. The shaded area is a
 * trapezium: (1/2)(12 + 6)(10) = 90 m, the displacement.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'kinematics-vt-area';

const W = 640;
const H = 330;
const X0 = 90;
const Y0 = 250;
const PX = 40;

const x = (t: number) => X0 + t * PX;
const y = (v: number) => Y0 - v * 17;

export function KinematicsVtArea() {
  const area = `M${x(0)},${y(0)} L${x(4)},${y(10)} L${x(10)},${y(10)} L${x(12)},${y(0)} Z`;
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={26} className="dg-text dg-bold">
        Area under a velocity–time graph = displacement
      </Label>
      <Label x={320} y={48} className="dg-text-small dg-text-muted">
        gradients: 2.5 m s⁻² (0–4 s), 0 (4–10 s), −5 m s⁻² (10–12 s)
      </Label>

      <path d={area} className="dg-fill-accent" />
      <line x1={x(0)} y1={y(0)} x2={x(12)} y2={y(0)} className="dg-line" />
      <line x1={x(0)} y1={y(0)} x2={x(0)} y2={y(10) - 20} className="dg-line" />
      <path d={`M${x(0)},${y(0)} L${x(4)},${y(10)} L${x(10)},${y(10)} L${x(12)},${y(0)}`} className="dg-accent" strokeWidth={2.5} />

      {[4, 10, 12].map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={y(0)} x2={x(t)} y2={y(0) + 6} className="dg-muted" />
          <Label x={x(t)} y={y(0) + 22} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}
      <Label x={x(12) + 10} y={y(0)} anchor="start" className="dg-text-small dg-text-muted">
        t (s)
      </Label>
      <Label x={x(0) - 12} y={y(10)} anchor="end" className="dg-text-small dg-text-muted">
        10
      </Label>
      <Label x={x(0) - 12} y={y(0)} anchor="end" className="dg-text-small dg-text-muted">
        0
      </Label>
      <Label x={x(0) - 12} y={y(10) - 26} anchor="end" className="dg-text-small dg-text-muted">
        v (m s⁻¹)
      </Label>

      <Label x={x(6)} y={y(5)} className="dg-text dg-bold">
        area = 90 m
      </Label>

      <MathLabel x={320} y={300} tex="\tfrac{1}{2}(12+6)(10)=90\ \text{m}" w={260} h={40} tone="muted" />
    </Svg>
  );
}

export default KinematicsVtArea;
