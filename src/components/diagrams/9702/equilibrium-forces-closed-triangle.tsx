/**
 * Three coplanar forces in equilibrium form a closed vector triangle (outcome 4.2.3), drawn to scale
 * (3.2 px per newton). A lamp of weight 30 N hangs from a cable and is pulled sideways by a
 * horizontal 40 N force; the cable tension is 50 N at 53.1° to the vertical.
 * Left: the free-body diagram, all three forces acting at the lamp.
 * Right: the same three forces drawn tip to tail: W down, the 40 N pull across, and T back to the
 * start. The arrows chase each other round the triangle and it closes, so the resultant is zero.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Ceiling, Force, RightAngle, add, type Pt } from './turning-effects-kit';

export const diagramKey = 'phys-equilibrium-forces-closed-triangle';

const W = 640;
const H = 290;
const K = 3.2;

export function EquilibriumForcesClosedTriangle() {
  const P: Pt = { x: 212, y: 150 };
  const tDir = { x: -0.8, y: -0.6 };
  const ceilingY = 26;
  const cableTop = add(P, tDir, (P.y - ceilingY) / 0.6);

  const S: Pt = { x: 432, y: 52 };
  const P1 = { x: S.x, y: S.y + 30 * K };
  const P2 = { x: P1.x + 40 * K, y: P1.y };

  return (
    <Svg width={W} height={H}>
      {/* ---------- free-body diagram ---------- */}
      <Label x={160} y={272} className="dg-text-small dg-text-muted">
        free-body diagram of the lamp
      </Label>
      <Ceiling y={ceilingY} x1={cableTop.x - 30} x2={cableTop.x + 50} />
      <line x1={cableTop.x} y1={cableTop.y} x2={add(P, tDir, 13).x} y2={add(P, tDir, 13).y} className="dg-thin" />
      <circle cx={P.x} cy={P.y} r={13} className="dg-fill-accent dg-accent" />
      <Force p={add(P, tDir, 13)} u={tDir} l={50 * K - 13} tone="accent" />
      <Label x={P.x - 50 * K * 0.8 + 30} y={P.y - 50 * K * 0.6 - 6} anchor="start" className="dg-text-accent">
        T = 50 N
      </Label>
      <Force p={{ x: P.x, y: P.y + 13 }} u={{ x: 0, y: 1 }} l={30 * K - 13} label="W = 30 N" dx={10} dy={-8} anchor="start" />
      <Force p={{ x: P.x + 13, y: P.y }} u={{ x: 1, y: 0 }} l={40 * K - 13} tone="accent-2" />
      <Label x={P.x + 40 * K - 10} y={P.y - 16} className="dg-text-accent-2">
        40 N
      </Label>

      {/* ---------- vector triangle ---------- */}
      <Label x={490} y={272} className="dg-text-small dg-text-muted">
        tip to tail: the triangle closes
      </Label>
      <RightAngle c={P1} u={{ x: 0, y: -1 }} v={{ x: 1, y: 0 }} s={11} />
      <Arrow x1={S.x} y1={S.y} x2={P1.x} y2={P1.y} head={11} />
      <Arrow x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} head={11} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={P2.x} y1={P2.y} x2={S.x} y2={S.y} head={11} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={S.x - 10} y={(S.y + P1.y) / 2} anchor="end" className="dg-text dg-bold">
        30 N
      </Label>
      <Label x={(P1.x + P2.x) / 2} y={P1.y + 18} className="dg-text-accent-2">
        40 N
      </Label>
      <Label x={(S.x + P2.x) / 2 + 12} y={(S.y + P2.y) / 2 - 14} anchor="start" className="dg-text-accent">
        50 N
      </Label>
      <circle cx={S.x} cy={S.y} r={3.5} className="dg-dot" />
      <Label x={S.x - 8} y={S.y - 12} anchor="end" className="dg-text-small">
        start = finish
      </Label>
    </Svg>
  );
}

export default EquilibriumForcesClosedTriangle;
