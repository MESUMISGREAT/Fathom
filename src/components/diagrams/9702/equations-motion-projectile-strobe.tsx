/**
 * Strobe picture (to scale, 2.4 px per cm in both directions) of two balls
 * released at the same instant from the same height, no air resistance:
 * ball A is dropped from rest; ball B is launched horizontally at 2.0 m s⁻¹.
 * Flash interval 0.10 s, g = 9.81 m s⁻².
 *   t / s        : 0    0.1   0.2   0.3   0.4   0.5
 *   fallen / cm  : 0    4.9   19.6  44.1  78.5  122.6   (both balls)
 *   B across / cm: 0    20    40    60    80    100     (equal gaps)
 * Velocity components of B at t = 0.2 s and 0.4 s are drawn at 20 px per
 * m s⁻¹: v_x = 2.0 m s⁻¹ both times; v_y = 1.96 and 3.92 m s⁻¹ downwards.
 * B's path is the parabola y = (g / 2u²) x².
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-equations-motion-projectile-strobe';

const W = 600;
const H = 420;
const G = 9.81;
const U = 2.0;
const PX = 2.4; // px per cm
const VPX = 20; // px per m s⁻¹ for velocity arrows
const X_A = 58;
const X0 = 100;
const Y0 = 52;
const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
const fallen = (t: number) => 0.5 * G * t * t * 100; // cm
const sx = (t: number) => X0 + U * t * 100 * PX;
const sy = (t: number) => Y0 + fallen(t) * PX;
const BASE = sy(0.5) + 26;

export function EquationsMotionProjectileStrobe() {
  let path = '';
  for (let i = 0; i <= 60; i++) {
    const t = (0.52 * i) / 60;
    path += `${i === 0 ? 'M' : 'L'}${sx(t).toFixed(2)},${sy(t).toFixed(2)} `;
  }
  return (
    <Svg width={W} height={H}>
      {/* equal-height guides at each flash */}
      {times.map((t) => (
        <line key={`h${t}`} x1={X_A - 14} y1={sy(t)} x2={sx(t) + 12} y2={sy(t)} className="dg-grid" />
      ))}
      {/* equal horizontal gaps */}
      {times.map((t) => (
        <line key={`v${t}`} x1={sx(t)} y1={sy(t) + 8} x2={sx(t)} y2={BASE + 6} className="dg-grid" />
      ))}
      <line x1={sx(0)} y1={BASE} x2={sx(0.5)} y2={BASE} className="dg-thin" />
      {times.slice(1).map((t) => (
        <Label key={`g${t}`} x={(sx(t) + sx(t - 0.1)) / 2} y={BASE + 14} className="dg-text-small">
          20 cm
        </Label>
      ))}

      {/* B's parabolic path */}
      <path d={path.trim()} className="dg-muted dg-dashed" />

      {/* the two balls at each flash */}
      {times.map((t) => (
        <g key={`b${t}`}>
          <circle cx={X_A} cy={sy(t)} r={6} className="dg-fill-muted dg-line" />
          <circle cx={sx(t)} cy={sy(t)} r={6} className="dg-fill-accent dg-accent" />
        </g>
      ))}
      <Label x={X_A} y={Y0 - 22} className="dg-text-small dg-bold">
        A: dropped
      </Label>
      <Label x={X0 + 30} y={Y0 - 22} anchor="start" className="dg-text-small dg-bold dg-text-accent">
        B: launched sideways at 2.0 m s⁻¹
      </Label>
      <Arrow x1={X0 + 10} y1={Y0} x2={X0 + 48} y2={Y0} className="dg-accent" headClassName="dg-dot-accent" head={7} />

      {/* velocity components of B at 0.2 s and 0.4 s */}
      {[0.2, 0.4].map((t) => {
        const vy = G * t;
        return (
          <g key={`c${t}`}>
            <Arrow x1={sx(t) + 7} y1={sy(t)} x2={sx(t) + U * VPX + 7} y2={sy(t)} className="dg-accent-2" headClassName="dg-dot-accent-2" head={7} />
            <Arrow x1={sx(t)} y1={sy(t) + 7} x2={sx(t)} y2={sy(t) + vy * VPX + 7} className="dg-accent-2" headClassName="dg-dot-accent-2" head={7} />
            <Label x={sx(t) + U * VPX + 12} y={sy(t)} anchor="start" className="dg-text-small">
              v<tspan dy={3} fontSize={9}>x</tspan>
              <tspan dy={-3}>{` = ${U.toFixed(1)}`}</tspan>
            </Label>
            <Label x={sx(t) - 8} y={sy(t) + (vy * VPX) / 2 + 8} anchor="end" className="dg-text-small">
              v<tspan dy={3} fontSize={9}>y</tspan>
              <tspan dy={-3}>{` = ${vy.toFixed(2)}`}</tspan>
            </Label>
          </g>
        );
      })}

      {/* notes */}
      <rect x={404} y={120} width={186} height={196} rx={10} className="dg-fill-muted" />
      <Label x={416} y={142} anchor="start" className="dg-text-small dg-bold">
        Flashes every 0.10 s
      </Label>
      <Label x={416} y={170} anchor="start" className="dg-text-small">
        Across: equal gaps, so
      </Label>
      <Label x={416} y={186} anchor="start" className="dg-text-small">
        constant horizontal velocity
      </Label>
      <Label x={416} y={214} anchor="start" className="dg-text-small">
        Down: B matches A at every
      </Label>
      <Label x={416} y={230} anchor="start" className="dg-text-small">
        flash, accelerating at g
      </Label>
      <Label x={416} y={258} anchor="start" className="dg-text-small">
        So they land together.
      </Label>
      <Label x={416} y={290} anchor="start" className="dg-text-small dg-text-muted">
        velocities in m s⁻¹
      </Label>
    </Svg>
  );
}

export default EquationsMotionProjectileStrobe;
