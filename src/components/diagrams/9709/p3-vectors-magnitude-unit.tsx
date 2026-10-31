/**
 * v = 3i + 4j on a grid. Dashed legs of length 3 (across) and 4 (up) make a right-angled triangle whose
 * hypotenuse, the arrow v, has length 5 by Pythagoras. A short thick arrow along v is the unit vector
 * (1/5)(3i + 4j), of length 1. Formulas on the right.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-vectors-magnitude-unit';

const W = 660;
const H = 320;
const O = { x: 70, y: 280 };
const S = 55;
const P = (x: number, y: number) => ({ x: O.x + S * x, y: O.y - S * y });

type Pt = { x: number; y: number };
function Arrow({ from, to, className, head, width = 2.5 }: { from: Pt; to: Pt; className: string; head: string; width?: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 11;
  const tri = `${to.x},${to.y} ${to.x - s * ux - (s / 2) * uy},${to.y - s * uy + (s / 2) * ux} ${to.x - s * ux + (s / 2) * uy},${to.y - s * uy - (s / 2) * ux}`;
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={className} strokeWidth={width} />
      <polygon points={tri} className={head} />
    </g>
  );
}

export default function P3VectorsMagnitudeUnit() {
  const V = P(3, 4);
  const U = P(0.6, 0.8);
  return (
    <Svg width={W} height={H}>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1={P(i, 0).x} y1={P(0, 0).y} x2={P(i, 4.5).x} y2={P(0, 4.5).y} className="dg-grid" />
          <line x1={P(0, i).x} y1={P(0, i).y} x2={P(4.5, i).x} y2={P(4.5, i).y} className="dg-grid" />
        </g>
      ))}
      <line x1={O.x} y1={O.y} x2={P(4.5, 0).x} y2={O.y} className="dg-line" />
      <line x1={O.x} y1={O.y} x2={O.x} y2={P(0, 4.5).y} className="dg-line" />
      <MathLabel x={O.x - 14} y={O.y + 12} tex="O" w={20} size="small" />

      <line x1={O.x} y1={O.y} x2={P(3, 0).x} y2={O.y} className="dg-muted dg-dashed" strokeWidth={2} />
      <line x1={P(3, 0).x} y1={O.y} x2={V.x} y2={V.y} className="dg-muted dg-dashed" strokeWidth={2} />
      <MathLabel x={P(1.5, 0).x} y={O.y + 16} tex="3" w={20} size="small" />
      <MathLabel x={P(3, 0).x + 14} y={P(0, 2).y} tex="4" w={20} size="small" />

      <Arrow from={O} to={V} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={O} to={U} className="dg-accent-2" head="dg-dot-accent-2" width={5} />
      <MathLabel x={P(1.1, 2.6).x} y={P(1.1, 2.6).y} tex="\mathbf{v} = 3\mathbf{i} + 4\mathbf{j}" w={130} size="small" tone="accent" />
      <MathLabel x={P(1.2, 0.55).x + 30} y={P(1.2, 0.55).y + 4} tex="\hat{\mathbf{v}}\ (\text{length } 1)" w={120} size="small" tone="accent-2" />

      <MathLabel x={500} y={80} tex="\lvert\mathbf{v}\rvert = \sqrt{3^2 + 4^2} = 5" w={260} />
      <MathLabel x={500} y={140} tex="\hat{\mathbf{v}} = \tfrac{1}{5}(3\mathbf{i} + 4\mathbf{j})" w={260} h={36} />
      <Label x={500} y={196} className="dg-text-small dg-text-muted">same direction as v, length 1</Label>
      <MathLabel x={500} y={250} tex="\text{3D: } \lvert x\mathbf{i} + y\mathbf{j} + z\mathbf{k}\rvert = \sqrt{x^2 + y^2 + z^2}" w={300} size="small" />
    </Svg>
  );
}
