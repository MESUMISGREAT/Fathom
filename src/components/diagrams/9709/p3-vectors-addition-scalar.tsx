/**
 * Three panels. Triangle law: a, then b from the tip of a, and a + b from the start of a to the tip of b.
 * Parallelogram law: a and b from the same point, with dashed copies completing the parallelogram and
 * a + b as its diagonal. Scalar multiples: a, 2a, ½a and −a drawn as parallel arrows.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-vectors-addition-scalar';

const W = 680;
const H = 300;

type Pt = { x: number; y: number };
function Arrow({ from, to, className, head, dashed }: { from: Pt; to: Pt; className: string; head: string; dashed?: boolean }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 10;
  const tri = `${to.x},${to.y} ${to.x - s * ux - (s / 2) * uy},${to.y - s * uy + (s / 2) * ux} ${to.x - s * ux + (s / 2) * uy},${to.y - s * uy - (s / 2) * ux}`;
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={className} strokeWidth={2.5} strokeDasharray={dashed ? '6,5' : undefined} />
      <polygon points={tri} className={head} />
    </g>
  );
}

const a = { x: 100, y: -30 };
const b = { x: 30, y: -100 };
const add = (p: Pt, v: Pt, k = 1) => ({ x: p.x + k * v.x, y: p.y + k * v.y });

export default function P3VectorsAdditionScalar() {
  const P = { x: 40, y: 250 };
  const Q = { x: 270, y: 250 };
  return (
    <Svg width={W} height={H}>
      <Label x={120} y={30} className="dg-text-small">Triangle law</Label>
      <Arrow from={P} to={add(P, a)} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={add(P, a)} to={add(add(P, a), b)} className="dg-accent-2" head="dg-dot-accent-2" />
      <Arrow from={P} to={add(add(P, a), b)} className="dg-line" head="dg-dot" />
      <MathLabel x={P.x + 55} y={P.y - 2} tex="\mathbf{a}" w={24} tone="accent" />
      <MathLabel x={P.x + a.x + 32} y={P.y + a.y - 52} tex="\mathbf{b}" w={24} tone="accent-2" />
      <MathLabel x={P.x + 40} y={P.y - 96} tex="\mathbf{a} + \mathbf{b}" w={70} />

      <Label x={350} y={30} className="dg-text-small">Parallelogram law</Label>
      <Arrow from={Q} to={add(Q, a)} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={Q} to={add(Q, b)} className="dg-accent-2" head="dg-dot-accent-2" />
      <Arrow from={add(Q, b)} to={add(add(Q, b), a)} className="dg-accent" head="dg-dot-accent" dashed />
      <Arrow from={add(Q, a)} to={add(add(Q, a), b)} className="dg-accent-2" head="dg-dot-accent-2" dashed />
      <Arrow from={Q} to={add(add(Q, a), b)} className="dg-line" head="dg-dot" />
      <MathLabel x={Q.x + 55} y={Q.y + 2} tex="\mathbf{a}" w={24} tone="accent" />
      <MathLabel x={Q.x - 4} y={Q.y - 56} tex="\mathbf{b}" w={24} tone="accent-2" />
      <MathLabel x={Q.x + 168} y={Q.y - 128} tex="\mathbf{a} + \mathbf{b}" w={70} />
      <Arrow from={add(Q, b)} to={add(Q, a)} className="dg-muted" head="dg-dot" dashed />
      <MathLabel x={Q.x + a.x + 34} y={Q.y + a.y + 4} tex="\mathbf{a} - \mathbf{b}" w={70} tone="muted" />

      <Label x={575} y={30} className="dg-text-small">Scalar multiples</Label>
      <Arrow from={{ x: 500, y: 90 }} to={{ x: 560, y: 90 }} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={{ x: 500, y: 140 }} to={{ x: 620, y: 140 }} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={{ x: 500, y: 190 }} to={{ x: 530, y: 190 }} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={{ x: 560, y: 240 }} to={{ x: 500, y: 240 }} className="dg-accent-2" head="dg-dot-accent-2" />
      <MathLabel x={480} y={90} tex="\mathbf{a}" w={30} />
      <MathLabel x={480} y={140} tex="2\mathbf{a}" w={30} />
      <MathLabel x={480} y={190} tex="\tfrac12\mathbf{a}" w={30} h={36} />
      <MathLabel x={478} y={240} tex="-\mathbf{a}" w={34} />
      <Label x={575} y={278} className="dg-text-small dg-text-muted">parallel, new length</Label>
    </Svg>
  );
}
