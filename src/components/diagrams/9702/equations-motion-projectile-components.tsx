/**
 * Trajectory of a projectile launched from level ground at u = 20 m s⁻¹ and
 * θ = 55° above the horizontal (g = 9.81 m s⁻², no air resistance), drawn to
 * scale at 11 px per metre:
 *   u cos θ = 11.47 m s⁻¹, u sin θ = 16.38 m s⁻¹
 *   time of flight T = 2u sin θ / g = 3.34 s
 *   maximum height = (u sin θ)² / 2g = 13.7 m, range = 38.3 m
 * Velocity components (3.5 px per m s⁻¹) are drawn at t = 0, T/4, T/2, 3T/4
 * and T: the horizontal one is the same every time; the vertical one is
 * +16.4, +8.2, 0, −8.2, −16.4 m s⁻¹.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-equations-motion-projectile-components';

const W = 600;
const H = 420;
const G = 9.81;
const U = 20;
const TH = (55 * Math.PI) / 180;
const UX = U * Math.cos(TH);
const UY = U * Math.sin(TH);
const T = (2 * UY) / G;
const HMAX = (UY * UY) / (2 * G);
const RANGE = UX * T;
const PX = 11; // px per metre
const VPX = 3.5; // px per m s⁻¹
const OX = 54;
const GROUND = 286;
const px = (x: number) => OX + x * PX;
const py = (y: number) => GROUND - y * PX;
const at = (t: number) => ({ x: UX * t, y: UY * t - 0.5 * G * t * t, vy: UY - G * t });

export function EquationsMotionProjectileComponents() {
  let path = '';
  for (let i = 0; i <= 120; i++) {
    const p = at((T * i) / 120);
    path += `${i === 0 ? 'M' : 'L'}${px(p.x).toFixed(2)},${py(p.y).toFixed(2)} `;
  }
  const marks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({ f, ...at(f * T) }));
  const top = marks[2]!;
  const end = marks[4]!;
  const arcR = 30;
  return (
    <Svg width={W} height={H}>
      {/* ground */}
      <line x1={24} y1={GROUND} x2={W - 24} y2={GROUND} className="dg-line" />

      {/* maximum height */}
      <line x1={px(top.x)} y1={py(top.y) + 8} x2={px(top.x)} y2={GROUND} className="dg-muted dg-dashed" />
      <Label x={px(top.x) + 8} y={GROUND - 64} anchor="start" className="dg-text-small">
        max height
      </Label>
      <Label x={px(top.x) + 8} y={GROUND - 48} anchor="start" className="dg-text-small">
        {`= ${HMAX.toFixed(1)} m`}
      </Label>

      {/* trajectory */}
      <path d={path.trim()} className="dg-accent" />

      {/* launch: resultant u, its angle, and its components */}
      <path
        d={`M${OX + arcR},${GROUND} A${arcR},${arcR} 0 0 0 ${OX + arcR * Math.cos(TH)},${GROUND - arcR * Math.sin(TH)}`}
        className="dg-thin"
      />
      <Label x={OX + 40} y={GROUND - 14} anchor="start" className="dg-text-small dg-italic">
        θ
      </Label>
      <Arrow x1={OX} y1={GROUND} x2={OX + U * VPX * Math.cos(TH)} y2={GROUND - U * VPX * Math.sin(TH)} className="dg-line" head={9} />
      <Label
        x={OX + U * VPX * Math.cos(TH) - 14 * Math.sin(TH)}
        y={GROUND - U * VPX * Math.sin(TH) - 14 * Math.cos(TH)}
        className="dg-text dg-bold"
      >
        u
      </Label>

      {/* components at each quarter of the flight */}
      {marks.map((m) => {
        const x = px(m.x);
        const y = py(m.y);
        const hx = UX * VPX;
        const vyLen = m.vy * VPX;
        return (
          <g key={m.f}>
            <circle cx={x} cy={y} r={4} className="dg-dot" />
            <Arrow x1={x} y1={y} x2={x + hx} y2={y} className="dg-accent-2" headClassName="dg-dot-accent-2" head={7} />
            {Math.abs(vyLen) > 1 && (
              <Arrow x1={x} y1={y} x2={x} y2={y - vyLen} className="dg-accent-2" headClassName="dg-dot-accent-2" head={7} />
            )}
          </g>
        );
      })}
      <Label x={px(0) + UX * VPX + 6} y={GROUND + 14} anchor="start" className="dg-text-small dg-text-accent-2">
        u cos θ
      </Label>
      <Label x={OX - 6} y={GROUND - 26} anchor="end" className="dg-text-small dg-text-accent-2">
        u sin θ
      </Label>

      {/* top */}
      <Label x={px(top.x)} y={py(top.y) - 30} className="dg-text-small">
        <tspan className="dg-bold">top:</tspan> vertical component = 0
      </Label>
      <Label x={px(top.x)} y={py(top.y) - 14} className="dg-text-small">
        velocity = u cos θ, horizontal
      </Label>

      {/* landing */}
      <Label x={px(end.x) - 8} y={GROUND + 44} anchor="end" className="dg-text-small">
        lands at u, θ below
      </Label>
      <Label x={px(end.x) - 8} y={GROUND + 60} anchor="end" className="dg-text-small">
        the horizontal
      </Label>

      {/* range */}
      <Arrow x1={px(0) + 1} y1={GROUND + 92} x2={px(RANGE) - 1} y2={GROUND + 92} className="dg-thin" head={7} double />
      <Label x={px(RANGE / 2)} y={GROUND + 106} className="dg-text-small">
        {`range = ${RANGE.toFixed(1)} m`}
      </Label>
      <line x1={px(RANGE)} y1={GROUND + 64} x2={px(RANGE)} y2={GROUND + 98} className="dg-grid" />
      <line x1={px(0)} y1={GROUND + 4} x2={px(0)} y2={GROUND + 98} className="dg-grid" />

      {/* key */}
      <Label x={W - 20} y={30} anchor="end" className="dg-text-small dg-text-accent-2">
        horizontal arrow: the same all the way
      </Label>
      <Label x={W - 20} y={50} anchor="end" className="dg-text-small dg-text-accent-2">
        vertical arrow: shrinks, 0 at the top, grows downwards
      </Label>
      <Label x={W / 2} y={H - 8} className="dg-text-small dg-text-muted">
        to scale: u = 20 m s⁻¹ at 55°, g = 9.81 m s⁻², no air resistance
      </Label>
    </Svg>
  );
}

export default EquationsMotionProjectileComponents;
