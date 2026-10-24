/**
 * The moment of a force at an angle (outcome 4.1.2). A lever of length L is pivoted at O and a
 * force F acts at its end A at θ = 40° to the lever. Drawn to scale.
 * Left (method 1): the line of action of F is extended (dashed) and the perpendicular from O meets
 *   it at a right angle; that perpendicular distance is d = L sin θ, so moment = F × L sin θ.
 * Right (method 2): F is resolved at A into F sin θ at right angles to the lever and F cos θ along
 *   it. F cos θ passes through O, so only F sin θ has a moment: moment = F sin θ × L.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';
import { Dimension, RightAngle, add, arcPath, dir, unit, sub, type Pt } from './turning-effects-kit';

export const diagramKey = 'phys-turning-effects-angled-force';

const W = 640;
const H = 310;
const L = 190;
const TH = 40;
const FL = 95;

function Lever({ O, A }: { O: Pt; A: Pt }) {
  return (
    <g>
      <rect x={O.x} y={O.y - 6} width={A.x - O.x} height={12} rx={4} className="dg-fill-muted dg-line" />
      <circle cx={O.x} cy={O.y} r={6} className="dg-fill-surface dg-line" />
      <circle cx={O.x} cy={O.y} r={2} className="dg-dot" />
      <Label x={O.x} y={O.y - 20} className="dg-text dg-bold">
        O
      </Label>
      <line x1={A.x} y1={A.y} x2={A.x + 56} y2={A.y} className="dg-muted dg-dashed" />
      <path d={arcPath(A, 32, 0, TH)} className="dg-thin" />
      <Label x={add(A, dir(TH / 2), 44).x} y={add(A, dir(TH / 2), 44).y} className="dg-text dg-italic">
        θ
      </Label>
    </g>
  );
}

export function TurningEffectsAngledForce() {
  const u = dir(TH);

  // ---- method 1 ----
  const O1 = { x: 36, y: 140 };
  const A1 = { x: O1.x + L, y: O1.y };
  const N = add(A1, u, -L * Math.cos(TH * Math.PI / 180));
  const lineEnd = add(A1, u, -L * Math.cos(TH * Math.PI / 180) - 26);
  const F1 = add(A1, u, FL);
  const on = unit(sub(O1, N));

  // ---- method 2 ----
  const O2 = { x: 356, y: 140 };
  const A2 = { x: O2.x + L, y: O2.y };
  const Fx = add(A2, { x: 1, y: 0 }, FL * Math.cos(TH * Math.PI / 180));
  const Fy = add(A2, { x: 0, y: -1 }, FL * Math.sin(TH * Math.PI / 180));
  const F2 = add(A2, u, FL);

  return (
    <Svg width={W} height={H}>
      {/* ================= method 1 ================= */}
      <Label x={160} y={22} className="dg-text dg-bold">
        Method 1: perpendicular distance
      </Label>
      <line x1={lineEnd.x} y1={lineEnd.y} x2={A1.x} y2={A1.y} className="dg-muted dg-dashed" />
      <Lever O={O1} A={A1} />
      <Arrow x1={A1.x} y1={A1.y} x2={F1.x} y2={F1.y} head={11} />
      <Label x={F1.x - 8} y={F1.y - 10} anchor="end" className="dg-text dg-bold">
        F
      </Label>
      <line x1={O1.x} y1={O1.y} x2={N.x} y2={N.y} className="dg-accent-2" />
      <RightAngle c={N} u={on} v={unit({ x: -u.x, y: -u.y })} />
      <MathLabel x={126} y={180} w={100} h={28} tone="accent-2" tex="d = L\sin\theta" />
      <Dimension a={{ x: O1.x, y: 104 }} b={{ x: A1.x, y: 104 }} />
      <Label x={(O1.x + A1.x) / 2} y={92} className="dg-text dg-italic">
        L
      </Label>
      <Label x={lineEnd.x + 10} y={lineEnd.y + 10} anchor="start" className="dg-text-small dg-text-muted">
        line of action of F
      </Label>
      <MathLabel x={160} y={290} w={260} h={30} tex="\text{moment} = F \times L\sin\theta" />

      {/* ================= method 2 ================= */}
      <Label x={480} y={22} className="dg-text dg-bold">
        Method 2: perpendicular component
      </Label>
      <Lever O={O2} A={A2} />
      <line x1={Fx.x} y1={Fx.y} x2={F2.x} y2={F2.y} className="dg-muted dg-dashed" />
      <line x1={Fy.x} y1={Fy.y} x2={F2.x} y2={F2.y} className="dg-muted dg-dashed" />
      <Arrow x1={A2.x} y1={A2.y} x2={Fx.x} y2={Fx.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={A2.x} y1={A2.y} x2={Fy.x} y2={Fy.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={A2.x} y1={A2.y} x2={F2.x} y2={F2.y} head={11} />
      <Label x={F2.x + 6} y={F2.y - 10} anchor="middle" className="dg-text dg-bold">
        F
      </Label>
      <Label x={Fy.x - 8} y={Fy.y + 4} anchor="end" className="dg-text-accent-2">
        F sin θ
      </Label>
      <Label x={(A2.x + Fx.x) / 2} y={Fx.y + 22} anchor="middle" className="dg-text-accent-2">
        F cos θ
      </Label>
      <Dimension a={{ x: O2.x, y: 104 }} b={{ x: A2.x - 14, y: 104 }} />
      <Label x={(O2.x + A2.x) / 2} y={92} className="dg-text dg-italic">
        L
      </Label>
      <Label x={480} y={208} className="dg-text-small dg-text-muted">
        F cos θ acts along the lever, through O,
      </Label>
      <Label x={480} y={226} className="dg-text-small dg-text-muted">
        so it has no moment about O
      </Label>
      <MathLabel x={480} y={290} w={260} h={30} tex="\text{moment} = F\sin\theta \times L" />
    </Svg>
  );
}

export default TurningEffectsAngledForce;
