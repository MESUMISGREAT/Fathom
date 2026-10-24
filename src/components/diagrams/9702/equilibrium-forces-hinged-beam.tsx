/**
 * A horizontal uniform beam hinged to a wall and held up by a cable (outcomes 4.2.1, 4.2.2), drawn to
 * scale (180 px per metre; force arrows 0.3 px per newton). Beam 2.0 m long, weight 80 N at its
 * centre; a 120 N load hangs from the far end E; the cable is attached at E at 30° to the beam.
 * The perpendicular distance from the hinge to the cable's line of action is 2.0 sin 30° = 1.0 m.
 * Moments about the hinge: T × 1.0 = 80 × 1.0 + 120 × 2.0, so T = 320 N. The hinge force H then has
 * components 277 N (horizontal, away from the wall) and 40 N (up): 280 N at 8.2° above the
 * horizontal, which is the direction drawn.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Dimension, Force, RightAngle, Wall, add, arcPath, dir, foot, sub, unit } from './turning-effects-kit';

export const diagramKey = 'phys-equilibrium-forces-hinged-beam';

const W = 640;
const H = 306;
const PX = 180;
const K = 0.3;

export function EquilibriumForcesHingedBeam() {
  const hinge = { x: 80, y: 236 };
  const E = { x: hinge.x + 2.0 * PX, y: hinge.y };
  const top = { x: hinge.x, y: hinge.y - 2.0 * PX * Math.tan(Math.PI / 6) };
  const cable = unit(sub(top, E));
  const N = foot(hinge, E, cable);
  const hn = unit(sub(hinge, N));
  const mid = { x: hinge.x + 1.0 * PX, y: hinge.y };
  const hingeDir = dir(8.2);
  const tTip = add(E, cable, 320 * K);
  return (
    <Svg width={W} height={H}>
      <Wall x={hinge.x} y1={14} y2={262} />
      <line x1={top.x} y1={top.y} x2={E.x} y2={E.y} className="dg-thin" />
      <circle cx={top.x} cy={top.y} r={3} className="dg-dot" />
      <rect x={hinge.x} y={hinge.y - 5} width={2.0 * PX} height={10} rx={3} className="dg-fill-muted dg-line" />
      <circle cx={hinge.x} cy={hinge.y} r={6} className="dg-fill-surface dg-line" />

      <line x1={hinge.x} y1={hinge.y} x2={N.x} y2={N.y} className="dg-accent-2 dg-dashed" />
      <RightAngle c={N} u={hn} v={{ x: -cable.x, y: -cable.y }} />
      <MathLabel x={132} y={176} w={110} h={26} anchor="start" tone="accent-2" tex="d = 1.0\ \text{m}" />

      <path d={arcPath(E, 44, 150, 180)} className="dg-thin" />
      <Label x={add(E, dir(165), 60).x} y={add(E, dir(165), 60).y} className="dg-text">
        30°
      </Label>

      <Force p={E} u={cable} l={320 * K} tone="accent" />
      <Label x={tTip.x + 4} y={tTip.y - 14} className="dg-text-accent">
        T
      </Label>
      <Force p={{ x: mid.x, y: hinge.y + 5 }} u={{ x: 0, y: 1 }} l={80 * K} label="80 N" dx={8} dy={-6} anchor="start" />
      <Force p={{ x: E.x, y: hinge.y + 5 }} u={{ x: 0, y: 1 }} l={120 * K} label="120 N (load)" dx={8} dy={-6} anchor="start" />
      <Force p={hinge} u={hingeDir} l={280 * K} tone="accent-2" />
      <Label x={hinge.x + 280 * K * hingeDir.x + 10} y={hinge.y + 280 * K * hingeDir.y - 4} anchor="start" className="dg-text-accent-2">
        H
      </Label>
      <Label x={hinge.x + 8} y={hinge.y + 22} anchor="start" className="dg-text-small">
        hinge
      </Label>
      <Label x={E.x + 10} y={E.y - 6} anchor="start" className="dg-text dg-bold">
        E
      </Label>
      <Label x={(top.x + E.x) / 2 + 30} y={(top.y + E.y) / 2 - 6} anchor="start" className="dg-text-small dg-text-muted">
        cable
      </Label>

      <Dimension a={{ x: hinge.x, y: 292 }} b={{ x: E.x, y: 292 }} />
      <Label x={E.x + 12} y={292} anchor="start" className="dg-text">
        2.0 m
      </Label>
    </Svg>
  );
}

export default EquilibriumForcesHingedBeam;
