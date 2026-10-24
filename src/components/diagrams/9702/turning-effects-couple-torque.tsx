/**
 * The torque of a couple (outcome 4.1.4).
 * Left: a couple of two forces F, up at A and down at B, with lines of action a perpendicular
 *   distance d apart. About any point P, a distance x from the nearer line of action, the moments
 *   are F(x + d) clockwise and Fx anticlockwise, so the resultant is F(x + d) − Fx = Fd: the same
 *   for every P.
 * Right: the two forces act at θ = 50° to a rod of length l (drawn to scale). The perpendicular
 *   distance between their lines of action is l sin θ, so the torque is F × l sin θ.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Dimension, Force, RightAngle, add, arcPath, dir, sub, unit } from './turning-effects-kit';

export const diagramKey = 'phys-turning-effects-couple-torque';

const W = 640;
const H = 300;

export function TurningEffectsCoupleTorque() {
  // ---- left ----
  const y0 = 150;
  const P = { x: 44, y: y0 };
  const A = { x: 140, y: y0 };
  const B = { x: 262, y: y0 };

  // ---- right ----
  const th = 50;
  const l = 170;
  const A2 = { x: 382, y: 176 };
  const B2 = { x: A2.x + l, y: A2.y };
  const u = dir(th);
  const N = add(A2, u, l * Math.cos((th * Math.PI) / 180));
  const lineA = add(A2, u, l * Math.cos((th * Math.PI) / 180) + 26);
  const lineB = add(B2, u, -40);
  const bn = unit(sub(B2, N));

  return (
    <Svg width={W} height={H}>
      {/* ================= left ================= */}
      <Label x={160} y={22} className="dg-text dg-bold">
        Torque about any point P
      </Label>
      <line x1={P.x} y1={y0} x2={A.x} y2={y0} className="dg-muted dg-dashed" />
      <line x1={A.x} y1={56} x2={A.x} y2={226} className="dg-grid" />
      <line x1={B.x} y1={74} x2={B.x} y2={226} className="dg-grid" />
      <rect x={A.x} y={y0 - 6} width={B.x - A.x} height={12} rx={4} className="dg-fill-muted dg-line" />
      <Force p={{ x: A.x, y: y0 - 6 }} u={{ x: 0, y: -1 }} l={66} label="F" dx={-12} dy={8} anchor="end" />
      <Force p={{ x: B.x, y: y0 + 6 }} u={{ x: 0, y: 1 }} l={66} label="F" dx={12} dy={-8} anchor="start" />
      <circle cx={P.x} cy={P.y} r={4.5} className="dg-dot-accent-2" />
      <Label x={P.x} y={P.y - 18} className="dg-text-accent-2">
        P
      </Label>
      <Dimension a={{ x: P.x, y: 240 }} b={{ x: A.x, y: 240 }} />
      <Label x={(P.x + A.x) / 2} y={226} className="dg-text dg-italic">
        x
      </Label>
      <Dimension a={{ x: A.x, y: 240 }} b={{ x: B.x, y: 240 }} />
      <Label x={(A.x + B.x) / 2} y={226} className="dg-text dg-italic">
        d
      </Label>
      <MathLabel x={160} y={278} w={300} h={30} tex="F(x + d) - Fx = Fd" />

      {/* ================= right ================= */}
      <Label x={480} y={22} className="dg-text dg-bold">
        Forces at an angle to the rod
      </Label>
      <line x1={A2.x} y1={A2.y} x2={lineA.x} y2={lineA.y} className="dg-muted dg-dashed" />
      <line x1={lineB.x} y1={lineB.y} x2={B2.x} y2={B2.y} className="dg-muted dg-dashed" />
      <line x1={B2.x} y1={B2.y} x2={B2.x + 44} y2={B2.y} className="dg-muted dg-dashed" />
      <line x1={A2.x} y1={A2.y} x2={A2.x - 44} y2={A2.y} className="dg-muted dg-dashed" />
      <rect x={A2.x} y={A2.y - 6} width={l} height={12} rx={4} className="dg-fill-muted dg-line" />
      <path d={arcPath(B2, 30, 0, th)} className="dg-thin" />
      <Label x={add(B2, dir(th / 2), 42).x} y={add(B2, dir(th / 2), 42).y} className="dg-text dg-italic">
        θ
      </Label>
      <path d={arcPath(A2, 30, 180, 180 + th)} className="dg-thin" />
      <Label x={add(A2, dir(180 + th / 2), 42).x} y={add(A2, dir(180 + th / 2), 42).y} className="dg-text dg-italic">
        θ
      </Label>
      <Force p={B2} u={u} l={60} label="F" dx={10} dy={0} anchor="start" />
      <Force p={A2} u={{ x: -u.x, y: -u.y }} l={60} label="F" dx={-10} dy={0} anchor="end" />
      <line x1={B2.x} y1={B2.y} x2={N.x} y2={N.y} className="dg-accent-2" />
      <RightAngle c={N} u={bn} v={u} />
      <MathLabel x={540} y={104} w={96} h={28} tone="accent-2" tex="d = l\sin\theta" />
      <Label x={(A2.x + B2.x) / 2} y={A2.y + 22} className="dg-text dg-italic">
        l
      </Label>
      <MathLabel x={480} y={278} w={300} h={30} tex="\text{torque} = F \times l\sin\theta" />
    </Svg>
  );
}

export default TurningEffectsCoupleTorque;
