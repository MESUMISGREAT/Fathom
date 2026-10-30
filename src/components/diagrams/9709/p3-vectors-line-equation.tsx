/**
 * The line r = a + tb: the position vector a drawn from the origin O to the point A (t = 0), the direction
 * vector b drawn from A along the line, and the points for t = −1, 1 and 2 marked on the line.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-vectors-line-equation';

const W = 600;
const H = 380;
const O = { x: 330, y: 330 };
const A = { x: 230, y: 230 };
const B = { x: 110, y: -46 }; // one step of the direction vector, in pixels
const pt = (t: number) => ({ x: A.x + t * B.x, y: A.y + t * B.y });

function Arrow({ from, to, className, head }: { from: { x: number; y: number }; to: { x: number; y: number }; className: string; head: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 12;
  const tri = `${to.x},${to.y} ${to.x - s * ux - (s / 2) * uy},${to.y - s * uy + (s / 2) * ux} ${to.x - s * ux + (s / 2) * uy},${to.y - s * uy - (s / 2) * ux}`;
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={className} strokeWidth={3} />
      <polygon points={tri} className={head} />
    </g>
  );
}

export default function P3VectorsLineEquation() {
  const start = pt(-1.9);
  const end = pt(2.9);
  return (
    <Svg width={W} height={H}>
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} className="dg-line" strokeWidth={2} />
      <Arrow from={O} to={A} className="dg-accent-2" head="dg-dot-accent-2" />
      <Arrow from={A} to={pt(1)} className="dg-accent" head="dg-dot-accent" />
      <circle cx={O.x} cy={O.y} r={4} className="dg-dot" />
      <MathLabel x={O.x - 16} y={O.y + 14} tex="O" w={30} />
      <MathLabel x={(O.x + A.x) / 2 + 22} y={(O.y + A.y) / 2 + 6} tex="\mathbf{a}" w={30} tone="accent-2" />
      <MathLabel x={(A.x + pt(1).x) / 2 + 6} y={(A.y + pt(1).y) / 2 + 26} tex="\mathbf{b}" w={30} tone="accent" />

      {[-1, 0, 1, 2].map((t) => {
        const p = pt(t);
        return (
          <g key={t}>
            <circle cx={p.x} cy={p.y} r={5} className="dg-dot" />
            <MathLabel x={p.x - 8} y={p.y - 30} tex={`t = ${t}`} w={70} size="small" />
          </g>
        );
      })}
      <MathLabel x={A.x - 46} y={A.y + 4} tex="A" w={30} />
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        Start at A (t = 0) and move t steps of b. Negative t goes backwards.
      </Label>
    </Svg>
  );
}
