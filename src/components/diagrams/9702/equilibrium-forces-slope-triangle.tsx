/**
 * A block at rest on a rough slope inclined at θ = 30° (outcome 4.2.3). Three forces act: weight W
 * (vertical), normal contact force R (perpendicular to the slope) and friction F (up the slope).
 * Left: the forces on the block (2.4 px per newton for W = 50 N).
 * Right: the same forces tip to tail (3.2 px per newton): a right-angled triangle with the right
 * angle between R and F and the angle θ between W and R, so R = W cos θ and F = W sin θ.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';
import { Force, RightAngle, add, arcPath, dir, type Pt } from './turning-effects-kit';

export const diagramKey = 'phys-equilibrium-forces-slope-triangle';

const W = 640;
const H = 300;
const TH = 30;
const WN = 50;

export function EquilibriumForcesSlopeTriangle() {
  const t = (TH * Math.PI) / 180;
  const up = dir(TH); // up the slope
  const out = dir(TH + 90); // perpendicular, out of the slope
  // ---- left: block on slope ----
  const base: Pt = { x: 30, y: 250 };
  const run = 290;
  const top: Pt = { x: base.x + run, y: base.y - run * Math.tan(t) };
  const contact = add(base, up, 165);
  const c = add(contact, out, 22);
  const k1 = 2.4;

  // ---- right: triangle ----
  const k2 = 3.2;
  const S: Pt = { x: 488, y: 44 };
  const P1: Pt = { x: S.x, y: S.y + WN * k2 };
  const P2 = add(P1, out, WN * Math.cos(t) * k2);

  return (
    <Svg width={W} height={H}>
      {/* ---------- left ---------- */}
      <path d={`M${base.x},${base.y} L${top.x},${top.y} L${top.x},${base.y} Z`} className="dg-fill-muted" />
      <line x1={base.x} y1={base.y} x2={top.x} y2={top.y} className="dg-line" />
      <line x1={base.x - 10} y1={base.y} x2={top.x + 6} y2={base.y} className="dg-thin" />
      <path d={arcPath(base, 52, 0, TH)} className="dg-thin" />
      <Label x={add(base, dir(TH / 2), 66).x} y={add(base, dir(TH / 2), 66).y} className="dg-text dg-italic">
        θ
      </Label>
      <rect x={c.x - 22} y={c.y - 22} width={44} height={44} transform={`rotate(${-TH} ${c.x} ${c.y})`} className="dg-fill-accent dg-accent" />
      <Force p={c} u={{ x: 0, y: 1 }} l={WN * k1} label="W" dx={12} dy={-10} anchor="start" />
      <Force p={c} u={out} l={WN * Math.cos(t) * k1} label="R" dx={-8} dy={-6} anchor="end" tone="accent" />
      <Force p={c} u={up} l={WN * Math.sin(t) * k1} label="F" dx={6} dy={-12} tone="accent-2" />
      <circle cx={c.x} cy={c.y} r={3} className="dg-dot" />
      <Label x={170} y={286} className="dg-text-small dg-text-muted">
        block at rest: W, R and friction F
      </Label>

      {/* ---------- right ---------- */}
      <RightAngle c={P2} u={{ x: -out.x, y: -out.y }} v={up} s={10} />
      <path d={arcPath(P1, 32, 90, 90 + TH)} className="dg-thin" />
      <Label x={add(P1, dir(90 + TH / 2), 44).x} y={add(P1, dir(90 + TH / 2), 44).y} className="dg-text dg-italic">
        θ
      </Label>
      <Arrow x1={S.x} y1={S.y} x2={P1.x} y2={P1.y} head={11} />
      <Arrow x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} head={11} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={P2.x} y1={P2.y} x2={S.x} y2={S.y} head={11} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={S.x + 10} y={(S.y + P1.y) / 2} anchor="start" className="dg-text dg-bold">
        W
      </Label>
      <MathLabel x={(P1.x + P2.x) / 2 - 12} y={(P1.y + P2.y) / 2 + 8} w={110} h={26} anchor="end" tone="accent" tex="R = W\cos\theta" />
      <MathLabel x={(P2.x + S.x) / 2 - 10} y={(P2.y + S.y) / 2 - 16} w={110} h={26} anchor="end" tone="accent-2" tex="F = W\sin\theta" />
      <Label x={480} y={286} className="dg-text-small dg-text-muted">
        tip to tail: a right-angled triangle
      </Label>
    </Svg>
  );
}

export default EquilibriumForcesSlopeTriangle;
