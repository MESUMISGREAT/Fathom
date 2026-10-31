/**
 * The vector from O to A(3, 2, 4) on 3D axes (x right, y into the page, z up), reached by the dashed path
 * 3 along x, 2 along y, 4 up z. On the right, the four ways to write it: column vector, i j k form,
 * bold letter a, and the directed segment OA.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-vectors-notation';

const W = 660;
const H = 330;
const O = { x: 110, y: 285 };
const P = (x: number, y: number, z: number) => ({ x: O.x + 45 * x + 22 * y, y: O.y - 45 * z - 14 * y });

type Pt = { x: number; y: number };
function Arrow({ from, to, className, head, width = 2 }: { from: Pt; to: Pt; className: string; head: string; width?: number }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 10;
  const tri = `${to.x},${to.y} ${to.x - s * ux - (s / 2) * uy},${to.y - s * uy + (s / 2) * ux} ${to.x - s * ux + (s / 2) * uy},${to.y - s * uy - (s / 2) * ux}`;
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={className} strokeWidth={width} />
      <polygon points={tri} className={head} />
    </g>
  );
}

export default function P3VectorsNotation() {
  const A = P(3, 2, 4);
  const X3 = P(3, 0, 0);
  const XY = P(3, 2, 0);
  return (
    <Svg width={W} height={H}>
      <Arrow from={O} to={P(6.5, 0, 0)} className="dg-line" head="dg-dot" width={1.5} />
      <Arrow from={O} to={P(0, 5, 0)} className="dg-line" head="dg-dot" width={1.5} />
      <Arrow from={O} to={P(0, 0, 5.6)} className="dg-line" head="dg-dot" width={1.5} />
      <MathLabel x={P(6.5, 0, 0).x + 14} y={P(6.5, 0, 0).y} tex="x" w={20} size="small" />
      <MathLabel x={P(0, 5, 0).x + 12} y={P(0, 5, 0).y - 4} tex="y" w={20} size="small" />
      <MathLabel x={P(0, 0, 5.6).x - 14} y={P(0, 0, 5.6).y + 4} tex="z" w={20} size="small" />
      <MathLabel x={O.x - 14} y={O.y + 12} tex="O" w={20} size="small" />

      <polyline points={`${O.x},${O.y} ${X3.x},${X3.y} ${XY.x},${XY.y} ${A.x},${A.y}`} className="dg-muted dg-dashed" fill="none" strokeWidth={1.5} />
      <Label x={(O.x + X3.x) / 2} y={O.y + 16} className="dg-text-small dg-text-muted">3 along x</Label>
      <Label x={(X3.x + XY.x) / 2 - 8} y={(X3.y + XY.y) / 2 - 10} anchor="end" className="dg-text-small dg-text-muted">2 along y</Label>
      <Label x={XY.x + 8} y={(XY.y + A.y) / 2} anchor="start" className="dg-text-small dg-text-muted">4 up z</Label>

      <Arrow from={O} to={A} className="dg-accent" head="dg-dot-accent" width={3} />
      <circle cx={A.x} cy={A.y} r={4} className="dg-dot-accent" />
      <MathLabel x={A.x + 10} y={A.y - 6} tex="A(3, 2, 4)" w={100} anchor="start" size="small" tone="accent" />

      <Label x={530} y={44} className="dg-text-small">The same vector, four ways</Label>
      <MathLabel x={530} y={102} tex="\begin{pmatrix} 3 \\ 2 \\ 4 \end{pmatrix}" w={120} h={76} />
      <MathLabel x={530} y={172} tex="3\mathbf{i} + 2\mathbf{j} + 4\mathbf{k}" w={200} h={32} />
      <MathLabel x={530} y={214} tex="\mathbf{a}" w={60} h={32} />
      <MathLabel x={530} y={258} tex="\overrightarrow{OA}" w={80} h={36} />
    </Svg>
  );
}
