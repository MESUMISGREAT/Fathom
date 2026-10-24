/**
 * Why a loaded line can never be pulled straight (outcome 4.2.3).
 * Left: a plot of T/W = 1/(2 cos θ) for a weight W hung symmetrically from two strings, each at θ
 * to the vertical (θ from 0° to where T/W reaches 4, at 82.8°). T/W = 0.5 at θ = 0, T = W at 60°,
 * and T grows without limit as θ approaches 90°.
 * Right: the set-up: a picture hung from a nail by two strings, each at θ to the vertical, with
 * 2T cos θ = W.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Force, add, arcPath, dir, sub, unit } from './turning-effects-kit';

export const diagramKey = 'phys-equilibrium-forces-tension-angle';

const W = 640;
const H = 300;
const L = 64;
const T0 = 30;
const PW = 320;
const PH = 210;
const XMAX = 90;
const YMAX = 4;

const sx = (x: number) => L + (x / XMAX) * PW;
const sy = (y: number) => T0 + PH - (y / YMAX) * PH;

export function EquilibriumForcesTensionAngle() {
  let d = '';
  for (let i = 0; i <= 200; i++) {
    const th = (82.8 * i) / 200;
    const y = 1 / (2 * Math.cos((th * Math.PI) / 180));
    d += `${i === 0 ? 'M' : 'L'}${sx(th).toFixed(2)},${sy(y).toFixed(2)} `;
  }
  const xt = [0, 15, 30, 45, 60, 75, 90];
  const yt = [0, 1, 2, 3, 4];

  // ---- right: picture on two strings ----
  const nail = { x: 530, y: 64 };
  const half = 52;
  const drop = 64;
  const cl = { x: nail.x - half, y: nail.y + drop };
  const cr = { x: nail.x + half, y: nail.y + drop };
  const th = (Math.atan(half / drop) * 180) / Math.PI; // angle to the vertical
  const toNailL = unit(sub(nail, cl));
  const toNailR = unit(sub(nail, cr));

  return (
    <Svg width={W} height={H}>
      {yt.map((y) => (
        <g key={`y${y}`}>
          <line x1={sx(0)} y1={sy(y)} x2={sx(XMAX)} y2={sy(y)} className="dg-grid" />
          <Label x={sx(0) - 8} y={sy(y)} anchor="end" className="dg-text-small">
            {y}
          </Label>
        </g>
      ))}
      {xt.map((x) => (
        <g key={`x${x}`}>
          <line x1={sx(x)} y1={sy(0)} x2={sx(x)} y2={sy(YMAX)} className="dg-grid" />
          <Label x={sx(x)} y={sy(0) + 14} className="dg-text-small">
            {x}
          </Label>
        </g>
      ))}
      <line x1={sx(0)} y1={sy(0)} x2={sx(XMAX)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(YMAX)} className="dg-line" />
      <Label x={sx(45)} y={sy(0) + 36} className="dg-text">
        angle of each string to the vertical, θ / °
      </Label>
      <MathLabel x={22} y={sy(2)} w={40} h={44} tex="\dfrac{T}{W}" />
      <line x1={sx(90)} y1={sy(0)} x2={sx(90)} y2={sy(YMAX)} className="dg-muted dg-dashed" />
      <path d={d.trim()} className="dg-accent" />
      <line x1={sx(0)} y1={sy(1)} x2={sx(60)} y2={sy(1)} className="dg-accent-2 dg-dashed" />
      <line x1={sx(60)} y1={sy(0)} x2={sx(60)} y2={sy(1)} className="dg-accent-2 dg-dashed" />
      <circle cx={sx(60)} cy={sy(1)} r={4.5} className="dg-dot-accent-2" />
      <Label x={sx(60) - 8} y={sy(1) - 14} anchor="end" className="dg-text-accent-2">
        T = W at 60°
      </Label>
      <MathLabel x={sx(8)} y={sy(3)} w={140} h={46} anchor="start" tone="accent" tex="\dfrac{T}{W} = \dfrac{1}{2\cos\theta}" />

      {/* ---------- the set-up ---------- */}
      <line x1={nail.x} y1={nail.y} x2={nail.x} y2={cl.y + 14} className="dg-muted dg-dashed" />
      <line x1={cl.x} y1={cl.y} x2={nail.x} y2={nail.y} className="dg-thin" />
      <line x1={cr.x} y1={cr.y} x2={nail.x} y2={nail.y} className="dg-thin" />
      <circle cx={nail.x} cy={nail.y} r={4} className="dg-dot" />
      <path d={arcPath(nail, 30, 270 - th, 270)} className="dg-thin" />
      <path d={arcPath(nail, 30, 270, 270 + th)} className="dg-thin" />
      <Label x={add(nail, dir(270 - th / 2), 42).x} y={add(nail, dir(270 - th / 2), 42).y} className="dg-text-small dg-italic">
        θ
      </Label>
      <Label x={add(nail, dir(270 + th / 2), 42).x} y={add(nail, dir(270 + th / 2), 42).y} className="dg-text-small dg-italic">
        θ
      </Label>
      <rect x={cl.x - 14} y={cl.y} width={2 * half + 28} height={72} rx={3} className="dg-fill-accent dg-accent" />
      <Force p={cl} u={toNailL} l={44} tone="accent-2" />
      <Force p={cr} u={toNailR} l={44} tone="accent-2" />
      <Label x={cl.x - 26} y={cl.y - 24} className="dg-text-accent-2">
        T
      </Label>
      <Label x={cr.x + 26} y={cr.y - 24} className="dg-text-accent-2">
        T
      </Label>
      <Force p={{ x: nail.x, y: cl.y + 36 }} u={{ x: 0, y: 1 }} l={64} label="W" dx={12} dy={-8} anchor="start" />
      <MathLabel x={nail.x} y={268} w={160} h={30} tex="2T\cos\theta = W" />
    </Svg>
  );
}

export default EquilibriumForcesTensionAngle;
