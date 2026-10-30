/**
 * A car on a slope at angle α, moving up it: driving force D = P/v up the slope, resistance R down the
 * slope, weight mg vertically down, and the weight's components mg sin α (down the slope) and mg cos α (into
 * the slope), with the angle α marked both at the foot of the slope and between the weight and the normal.
 */
import { MathLabel, Svg } from '../primitives';

export const diagramKey = 'mech-car-on-slope';

const W = 640;
const H = 380;
const A = (20 * Math.PI) / 180;
const FOOT = { x: 60, y: 300 };
const u = { x: Math.cos(A), y: -Math.sin(A) }; // up the slope
const n = { x: -Math.sin(A), y: -Math.cos(A) }; // out of the slope
const at = (p: { x: number; y: number }, v: { x: number; y: number }, k: number) => ({ x: p.x + k * v.x, y: p.y + k * v.y });

function Arrow({ from, to, className }: { from: { x: number; y: number }; to: { x: number; y: number }; className: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 11;
  const head = `${to.x},${to.y} ${to.x - s * ux - (s / 2) * uy},${to.y - s * uy + (s / 2) * ux} ${to.x - s * ux + (s / 2) * uy},${to.y - s * uy - (s / 2) * ux}`;
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={className} strokeWidth={3} />
      <polygon points={head} className={className === 'dg-line' ? 'dg-dot' : className.replace('dg-', 'dg-dot-')} />
    </g>
  );
}

export default function MechCarOnSlope() {
  const top = at(FOOT, u, 560);
  const base = at(FOOT, u, 270); // where the car sits
  const C = at(base, n, 24); // centre of the car
  const mgLen = 130;
  const corners = [at(base, u, -45), at(base, u, 45), at(at(base, u, 45), n, 48), at(at(base, u, -45), n, 48)];
  const mgEnd = { x: C.x, y: C.y + mgLen };
  const into = at(C, n, -mgLen * Math.cos(A));
  const r = 42;
  const arcStart = { x: C.x, y: C.y + r };
  const arcEnd = at(C, n, -r);
  return (
    <Svg width={W} height={H}>
      <line x1={FOOT.x} y1={FOOT.y} x2={top.x} y2={FOOT.y} className="dg-line dg-dashed" />
      <line x1={FOOT.x} y1={FOOT.y} x2={top.x} y2={top.y} className="dg-line" strokeWidth={3} />
      <path d={`M ${FOOT.x + 70} ${FOOT.y} A 70 70 0 0 0 ${FOOT.x + 70 * u.x} ${FOOT.y + 70 * u.y}`} className="dg-accent-2" fill="none" strokeWidth={2} />
      <MathLabel x={FOOT.x + 92} y={FOOT.y - 14} tex="\alpha" w={30} tone="accent-2" />

      <polygon points={corners.map((p) => `${p.x},${p.y}`).join(' ')} className="dg-fill-surface dg-line" strokeWidth={2} />

      <line x1={into.x} y1={into.y} x2={mgEnd.x} y2={mgEnd.y} className="dg-muted dg-dashed" strokeWidth={2} />
      <line x1={C.x} y1={C.y} x2={into.x} y2={into.y} className="dg-muted dg-dashed" strokeWidth={2} />
      <path d={`M ${arcStart.x} ${arcStart.y} A ${r} ${r} 0 0 0 ${arcEnd.x} ${arcEnd.y}`} className="dg-accent-2" fill="none" strokeWidth={2} />
      <MathLabel x={C.x + 14} y={C.y + 58} tex="\alpha" w={30} tone="accent-2" size="small" />

      <Arrow from={C} to={mgEnd} className="dg-line" />
      <MathLabel x={mgEnd.x + 10} y={mgEnd.y + 16} tex="mg" w={40} />
      <Arrow from={at(C, u, 46)} to={at(C, u, 160)} className="dg-accent" />
      <MathLabel x={at(C, u, 160).x + 10} y={at(C, u, 160).y - 30} tex="D = \dfrac{P}{v}" w={110} tone="accent" />
      <Arrow from={at(at(C, u, -46), n, 14)} to={at(at(C, u, -150), n, 14)} className="dg-accent-2" />
      <MathLabel x={at(at(C, u, -150), n, 14).x - 8} y={at(at(C, u, -150), n, 14).y - 24} tex="R" w={30} tone="accent-2" />
      <MathLabel x={(into.x + mgEnd.x) / 2 + 40} y={(into.y + mgEnd.y) / 2 + 26} tex="mg\sin\alpha" w={110} tone="muted" size="small" />
      <MathLabel x={(C.x + into.x) / 2 + 66} y={(C.y + into.y) / 2 + 14} tex="mg\cos\alpha" w={110} tone="muted" size="small" />
    </Svg>
  );
}
