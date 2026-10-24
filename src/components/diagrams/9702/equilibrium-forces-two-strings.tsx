/**
 * A 60 N weight held by two strings at different angles (outcome 4.2.3).
 * Left: the forces at the knot: T1 at 35° to the vertical, T2 at 50° to the vertical, W = 60 N
 *   (1.6 px per newton).
 * Right: the closed vector triangle, drawn to scale (3.0 px per newton): W, then T1, then T2 back to
 *   the start. Its interior angles are 35° (opposite T2), 50° (opposite T1) and 95° (opposite W).
 *   The sine rule gives T1 = 60 sin 50° / sin 95° = 46.1 N and T2 = 60 sin 35° / sin 95° = 34.5 N.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';
import { Ceiling, Force, add, arcPath, dir, type Pt } from './turning-effects-kit';

export const diagramKey = 'phys-equilibrium-forces-two-strings';

const W = 640;
const H = 300;
const AL = 35;
const BE = 50;
const WN = 60;
const DEG = Math.PI / 180;
const T1 = (WN * Math.sin(BE * DEG)) / Math.sin((AL + BE) * DEG);
const T2 = (WN * Math.sin(AL * DEG)) / Math.sin((AL + BE) * DEG);

export function EquilibriumForcesTwoStrings() {
  // ---- left ----
  const K: Pt = { x: 168, y: 160 };
  const ceil = 30;
  const u1 = dir(90 + AL); // up-left, AL from the vertical
  const u2 = dir(90 - BE); // up-right, BE from the vertical
  const top1 = add(K, u1, (K.y - ceil) / Math.cos(AL * DEG));
  const top2 = add(K, u2, (K.y - ceil) / Math.cos(BE * DEG));
  const k1 = 1.6;

  // ---- right: triangle ----
  const k2 = 3.0;
  const S: Pt = { x: 492, y: 26 };
  const P1: Pt = { x: S.x, y: S.y + WN * k2 };
  const P2 = add(P1, u1, T1 * k2);

  return (
    <Svg width={W} height={H}>
      {/* ---------- left ---------- */}
      <Ceiling y={ceil} x1={top1.x - 24} x2={top2.x + 24} />
      <line x1={top1.x} y1={top1.y} x2={K.x} y2={K.y} className="dg-thin" />
      <line x1={top2.x} y1={top2.y} x2={K.x} y2={K.y} className="dg-thin" />
      <line x1={K.x} y1={K.y} x2={K.x} y2={K.y - 70} className="dg-muted dg-dashed" />
      <path d={arcPath(K, 46, 90, 90 + AL)} className="dg-thin" />
      <path d={arcPath(K, 38, 90 - BE, 90)} className="dg-thin" />
      <Label x={add(K, dir(90 + AL / 2), 60).x} y={add(K, dir(90 + AL / 2), 60).y} className="dg-text-small">
        35°
      </Label>
      <Label x={add(K, dir(90 - BE / 2), 52).x} y={add(K, dir(90 - BE / 2), 52).y} className="dg-text-small">
        50°
      </Label>
      <Force p={K} u={u1} l={T1 * k1} tone="accent" />
      <Force p={K} u={u2} l={T2 * k1} tone="accent-2" />
      <MathLabel x={add(K, u1, T1 * k1).x - 8} y={add(K, u1, T1 * k1).y + 16} w={30} h={24} anchor="end" tone="accent" tex="T_1" />
      <MathLabel x={add(K, u2, T2 * k1).x + 8} y={add(K, u2, T2 * k1).y + 16} w={30} h={24} anchor="start" tone="accent-2" tex="T_2" />
      <Force p={K} u={{ x: 0, y: 1 }} l={WN * k1} label="W = 60 N" dx={10} dy={-10} anchor="start" />
      <circle cx={K.x} cy={K.y} r={3.5} className="dg-dot" />
      <Label x={168} y={286} className="dg-text-small dg-text-muted">
        forces on the knot
      </Label>

      {/* ---------- right ---------- */}
      <Arrow x1={S.x} y1={S.y} x2={P1.x} y2={P1.y} head={11} />
      <Arrow x1={P1.x} y1={P1.y} x2={P2.x} y2={P2.y} head={11} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={P2.x} y1={P2.y} x2={S.x} y2={S.y} head={11} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <path d={arcPath(P1, 30, 90, 90 + AL)} className="dg-thin" />
      <Label x={add(P1, dir(90 + AL / 2), 44).x} y={add(P1, dir(90 + AL / 2), 44).y} className="dg-text-small">
        35°
      </Label>
      <path d={arcPath(S, 30, 270 - BE, 270)} className="dg-thin" />
      <Label x={add(S, dir(270 - BE / 2), 44).x} y={add(S, dir(270 - BE / 2), 44).y} className="dg-text-small">
        50°
      </Label>
      <Label x={P2.x + 34} y={P2.y + 6} className="dg-text-small">
        95°
      </Label>
      <Label x={S.x + 10} y={(S.y + P1.y) / 2} anchor="start" className="dg-text dg-bold">
        W = 60 N
      </Label>
      <MathLabel x={(P1.x + P2.x) / 2 - 10} y={(P1.y + P2.y) / 2 + 10} w={30} h={24} anchor="end" tone="accent" tex="T_1" />
      <MathLabel x={(P2.x + S.x) / 2 - 10} y={(P2.y + S.y) / 2 - 12} w={30} h={24} anchor="end" tone="accent-2" tex="T_2" />
      <MathLabel
        x={480}
        y={262}
        w={300}
        h={46}
        tex="\dfrac{T_1}{\sin 50^\circ} = \dfrac{T_2}{\sin 35^\circ} = \dfrac{W}{\sin 95^\circ}"
      />
    </Svg>
  );
}

export default EquilibriumForcesTwoStrings;
