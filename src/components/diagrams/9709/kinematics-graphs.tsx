/**
 * The same journey as a displacement-time graph and a velocity-time graph.
 * On s-t the gradient is the velocity; on v-t the gradient is the
 * acceleration and the signed area is the displacement.
 *
 * Motion: accelerate at 2 m/s^2 from rest for 4 s, hold 8 m/s for 4 s, then
 * decelerate at 4 m/s^2 to rest at t = 10 s.
 * Displacement by areas: 16 + 32 + 8 = 56 m, which matches s(10) = 56 m.
 */
import { Label, Svg, axes } from '../primitives';

export const diagramKey = 'kinematics-graphs';

const W = 660;

const top = axes({ width: W, height: 240, pad: 56, x: [0, 10], y: [0, 60] });
const bottom = axes({ width: W, height: 240, pad: 56, x: [0, 10], y: [0, 10] });

const sOf = (t: number) => (t <= 4 ? t * t : t <= 8 ? 16 + 8 * (t - 4) : 48 + 8 * (t - 8) - 2 * (t - 8) ** 2);
const vOf = (t: number) => (t <= 4 ? 2 * t : t <= 8 ? 8 : 8 - 4 * (t - 8));

function curve(map: { sx: (n: number) => number; sy: (n: number) => number }, f: (t: number) => number) {
  let d = '';
  for (let i = 0; i <= 400; i++) {
    const t = (10 * i) / 400;
    d += `${d === '' ? 'M' : 'L'}${map.sx(t).toFixed(1)},${map.sy(f(t)).toFixed(1)} `;
  }
  return d.trim();
}

export function KinematicsGraphs() {
  return (
    <Svg width={W} height={500}>
      <g transform="translate(0,18)">
        <Label x={56} y={16} anchor="start" className="dg-text dg-bold">
          displacement–time: gradient = velocity
        </Label>
        <line x1={top.sx(0)} y1={top.sy(0)} x2={top.sx(10)} y2={top.sy(0)} className="dg-line" />
        <line x1={top.sx(0)} y1={top.sy(0)} x2={top.sx(0)} y2={top.sy(60)} className="dg-line" />
        {[0, 20, 40, 60].map((s) => (
          <Label key={s} x={top.sx(0) - 10} y={top.sy(s)} anchor="end" className="dg-text-small dg-text-muted">
            {s}
          </Label>
        ))}
        {[2, 4, 6, 8, 10].map((t) => (
          <Label key={t} x={top.sx(t)} y={top.sy(0) + 18} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        ))}
        <Label x={top.sx(10) + 8} y={top.sy(0)} anchor="start" className="dg-text-small dg-text-muted">
          t (s)
        </Label>
        <Label x={top.sx(0) + 6} y={top.sy(60) + 2} anchor="start" className="dg-text-small dg-text-muted">
          s (m)
        </Label>
        <path d={curve(top, sOf)} className="dg-accent" strokeWidth={2.5} />
        <Label x={top.sx(5.6)} y={top.sy(46)} className="dg-text-small dg-text-accent">
          gradient 8
        </Label>
        <Label x={top.sx(8.6)} y={top.sy(56) - 18} className="dg-text-small dg-text-accent">
          gradient falls to 0
        </Label>
      </g>

      <g transform="translate(0,270)">
        <Label x={56} y={16} anchor="start" className="dg-text dg-bold">
          velocity–time: gradient = acceleration, area = displacement
        </Label>
        <line x1={bottom.sx(0)} y1={bottom.sy(0)} x2={bottom.sx(10)} y2={bottom.sy(0)} className="dg-line" />
        <line x1={bottom.sx(0)} y1={bottom.sy(0)} x2={bottom.sx(0)} y2={bottom.sy(10)} className="dg-line" />
        {[0, 4, 8, 10].map((v) => (
          <Label key={v} x={bottom.sx(0) - 10} y={bottom.sy(v)} anchor="end" className="dg-text-small dg-text-muted">
            {v}
          </Label>
        ))}
        {[2, 4, 6, 8, 10].map((t) => (
          <Label key={t} x={bottom.sx(t)} y={bottom.sy(0) + 18} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        ))}
        <Label x={bottom.sx(10) + 8} y={bottom.sy(0)} anchor="start" className="dg-text-small dg-text-muted">
          t (s)
        </Label>
        <Label x={bottom.sx(0) + 6} y={bottom.sy(10) + 2} anchor="start" className="dg-text-small dg-text-muted">
          v (m s⁻¹)
        </Label>
        <path d={curve(bottom, vOf)} className="dg-accent" strokeWidth={2.5} />
        <Label x={bottom.sx(2.1)} y={bottom.sy(7.4)} className="dg-text-small dg-text-accent">
          +16 m
        </Label>
        <Label x={bottom.sx(6)} y={bottom.sy(6.6)} className="dg-text-small dg-text-accent">
          +32 m
        </Label>
        <Label x={bottom.sx(9.2)} y={bottom.sy(6.2)} className="dg-text-small dg-text-accent">
          +8 m
        </Label>
        <Label x={bottom.sx(1.2)} y={bottom.sy(4.6)} className="dg-text-small dg-text-muted">
          a = 2
        </Label>
        <Label x={bottom.sx(7.2)} y={bottom.sy(9.4)} className="dg-text-small dg-text-muted">
          a = 0
        </Label>
        <Label x={bottom.sx(8.4)} y={bottom.sy(1.2)} className="dg-text-small dg-text-muted">
          a = −4
        </Label>
      </g>
    </Svg>
  );
}

export default KinematicsGraphs;
