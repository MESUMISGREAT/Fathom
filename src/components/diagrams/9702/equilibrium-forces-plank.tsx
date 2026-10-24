/**
 * A uniform plank on two supports (outcome 4.2.2), drawn to scale (120 px per metre; force arrows
 * 0.14 px per newton). Plank 4.0 m long, weight 200 N acting at its centre; a 600 N person stands
 * 1.0 m from support A. Moments about A give R_B = 250 N; balancing vertical forces gives
 * R_A = 550 N. Both conditions for equilibrium hold.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Dimension, Force, Pivot } from './turning-effects-kit';

export const diagramKey = 'phys-equilibrium-forces-plank';

const W = 640;
const H = 290;
const PX = 120;
const K = 0.14;
const X0 = 80;
const TOP = 120;

export function EquilibriumForcesPlank() {
  const xA = X0;
  const xB = X0 + 4.0 * PX;
  const xP = X0 + 1.0 * PX;
  const xC = X0 + 2.0 * PX;
  const bot = TOP + 12;
  return (
    <Svg width={W} height={H}>
      <rect x={xA - 14} y={TOP} width={xB - xA + 28} height={12} rx={3} className="dg-fill-muted dg-line" />
      <Pivot p={{ x: xA, y: bot }} />
      <Pivot p={{ x: xB, y: bot }} />
      <Label x={xA - 26} y={bot + 14} anchor="end" className="dg-text dg-bold">
        A
      </Label>
      <Label x={xB + 26} y={bot + 14} anchor="start" className="dg-text dg-bold">
        B
      </Label>

      <Force p={{ x: xA, y: TOP }} u={{ x: 0, y: -1 }} l={550 * K} tone="accent-2" />
      <MathLabel x={xA + 10} y={TOP - 550 * K + 6} w={50} h={26} anchor="start" tone="accent-2" tex="R_A" />
      <Force p={{ x: xB, y: TOP }} u={{ x: 0, y: -1 }} l={250 * K} tone="accent-2" />
      <MathLabel x={xB - 10} y={TOP - 250 * K + 6} w={50} h={26} anchor="end" tone="accent-2" tex="R_B" />

      <Force p={{ x: xP, y: bot }} u={{ x: 0, y: 1 }} l={600 * K} />
      <Label x={xP + 10} y={bot + 600 * K - 6} anchor="start" className="dg-text dg-bold">
        600 N (person)
      </Label>
      <Force p={{ x: xC, y: bot }} u={{ x: 0, y: 1 }} l={200 * K} />
      <Label x={xC + 10} y={bot + 200 * K - 4} anchor="start" className="dg-text dg-bold">
        200 N (plank, at its centre)
      </Label>

      {[xA, xP, xC, xB].map((x) => (
        <line key={x} x1={x} y1={x === xA || x === xB ? bot + 30 : bot + 600 * K + 8} x2={x} y2={258} className="dg-grid" />
      ))}
      <Dimension a={{ x: xA, y: 252 }} b={{ x: xP, y: 252 }} />
      <Dimension a={{ x: xP, y: 252 }} b={{ x: xC, y: 252 }} />
      <Dimension a={{ x: xC, y: 252 }} b={{ x: xB, y: 252 }} />
      <Label x={(xA + xP) / 2} y={272} className="dg-text">
        1.0 m
      </Label>
      <Label x={(xP + xC) / 2} y={272} className="dg-text">
        1.0 m
      </Label>
      <Label x={(xC + xB) / 2} y={272} className="dg-text">
        2.0 m
      </Label>
    </Svg>
  );
}

export default EquilibriumForcesPlank;
