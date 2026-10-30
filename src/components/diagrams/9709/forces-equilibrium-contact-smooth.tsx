/**
 * Left: a block on a rough floor pulled right by P, with normal reaction R, friction F, weight mg and the single contact
 * force (R and F combined). Right: a block on a smooth slope at angle α, with R perpendicular to the
 * slope, the weight mg, and its components mg sin α down the slope and mg cos α into the slope.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'forces-equilibrium-contact-smooth';

const W = 680;
const H = 330;

type Pt = { x: number; y: number };

function Arrow({ from, to, className, head }: { from: Pt; to: Pt; className: string; head: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 11;
  const tri = `${to.x},${to.y} ${to.x - s * ux - (s / 2) * uy},${to.y - s * uy + (s / 2) * ux} ${to.x - s * ux + (s / 2) * uy},${to.y - s * uy - (s / 2) * ux}`;
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={className} strokeWidth={2.5} />
      <polygon points={tri} className={head} />
    </g>
  );
}

// Slope at 30°: u points up the slope, n points out of the slope (both in SVG coordinates).
const A = (30 * Math.PI) / 180;
const base = { x: 380, y: 280 };
const u = { x: Math.cos(A), y: -Math.sin(A) };
const n = { x: -Math.sin(A), y: -Math.cos(A) };
const along = (d: number) => ({ x: base.x + d * u.x, y: base.y + d * u.y });
const top = along(323);
const touch = along(185);
const C = { x: touch.x + 18 * n.x, y: touch.y + 18 * n.y };
const at = (v: Pt, k: number) => ({ x: C.x + k * v.x, y: C.y + k * v.y });
const rTip = at(n, 85);
const wTip = { x: C.x, y: C.y + 90 };
const sinTip = at({ x: -u.x, y: -u.y }, 45);
const cosTip = at({ x: -n.x, y: -n.y }, 78);

export default function ForcesEquilibriumContactSmooth() {
  return (
    <Svg width={W} height={H}>
      <Label x={165} y={28} className="dg-text-small">Rough floor, pulled by P: R and F</Label>
      <line x1={30} y1={230} x2={300} y2={230} className="dg-line" strokeWidth={3} />
      <rect x={110} y={180} width={80} height={50} rx={4} className="dg-fill-surface dg-line" />
      <Arrow from={{ x: 150, y: 180 }} to={{ x: 150, y: 90 }} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={{ x: 110, y: 222 }} to={{ x: 50, y: 222 }} className="dg-accent-2" head="dg-dot-accent-2" />
      <Arrow from={{ x: 150, y: 205 }} to={{ x: 150, y: 295 }} className="dg-line" head="dg-dot" />
      <Arrow from={{ x: 150, y: 180 }} to={{ x: 90, y: 90 }} className="dg-muted dg-dashed" head="dg-dot" />
      <MathLabel x={168} y={98} tex="R" w={30} tone="accent" />
      <MathLabel x={62} y={204} tex="F" w={30} tone="accent-2" />
      <Arrow from={{ x: 190, y: 205 }} to={{ x: 255, y: 205 }} className="dg-line" head="dg-dot" />
      <MathLabel x={240} y={186} tex="P" w={30} />
      <MathLabel x={176} y={286} tex="mg" w={40} />
      <Label x={80} y={74} className="dg-text-small dg-text-muted">contact force</Label>

      <Label x={520} y={28} className="dg-text-small">Smooth slope: R only, no friction</Label>
      <path d={`M${base.x},${base.y} L${top.x},${base.y} L${top.x},${top.y} Z`} className="dg-line" fill="none" />
      <rect
        x={C.x - 30}
        y={C.y - 18}
        width={60}
        height={36}
        rx={3}
        className="dg-fill-surface dg-line"
        transform={`rotate(-30 ${C.x} ${C.y})`}
      />
      <Arrow from={C} to={rTip} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={C} to={wTip} className="dg-line" head="dg-dot" />
      <Arrow from={C} to={sinTip} className="dg-accent-2 dg-dashed" head="dg-dot-accent-2" />
      <Arrow from={C} to={cosTip} className="dg-accent-2 dg-dashed" head="dg-dot-accent-2" />
      <MathLabel x={rTip.x - 16} y={rTip.y - 4} tex="R" w={30} tone="accent" />
      <MathLabel x={wTip.x - 22} y={wTip.y + 4} tex="mg" w={40} />
      <MathLabel x={sinTip.x - 44} y={sinTip.y - 18} tex="mg\sin\alpha" w={90} tone="accent-2" size="small" />
      <MathLabel x={cosTip.x + 50} y={cosTip.y - 4} tex="mg\cos\alpha" w={90} tone="accent-2" size="small" />
      <path
        d={`M${base.x + 42},${base.y} A42,42 0 0 0 ${base.x + 42 * u.x},${base.y + 42 * u.y}`}
        className="dg-line"
        fill="none"
      />
      <MathLabel x={base.x + 56} y={base.y - 11} tex="\alpha" w={24} size="small" />
      <path
        d={`M${C.x},${C.y + 30} A30,30 0 0 0 ${C.x - 30 * n.x},${C.y - 30 * n.y}`}
        className="dg-line"
        fill="none"
      />
      <MathLabel x={C.x + 7} y={C.y + 42} tex="\alpha" w={24} size="small" />
    </Svg>
  );
}
