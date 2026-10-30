/**
 * Two uses of the scalar product. Left: vectors a and b from one point with the angle θ between them.
 * Right: a line through A with direction d, a point P off the line, and the foot F of the perpendicular,
 * with the right angle marked at F.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-vectors-scalar-product';

const W = 680;
const H = 320;

type Pt = { x: number; y: number };

function Arrow({ from, to, className, head }: { from: Pt; to: Pt; className: string; head: string }) {
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

// Left panel: a at 10° and b at 55° above the horizontal, from V.
const V = { x: 60, y: 240 };
const polar = (deg: number, r: number) => ({ x: V.x + r * Math.cos((deg * Math.PI) / 180), y: V.y - r * Math.sin((deg * Math.PI) / 180) });
const aEnd = polar(10, 230);
const bEnd = polar(55, 190);
const arcStart = polar(10, 50);
const arcEnd = polar(55, 50);
const thetaAt = polar(32, 70);

// Right panel: the line L(s) = L0 + s·dir, a point P, and the foot F of the perpendicular from P.
const L0 = { x: 370, y: 250 };
const dir = { x: 290, y: -120 };
const L = (s: number) => ({ x: L0.x + s * dir.x, y: L0.y + s * dir.y });
const len = Math.hypot(dir.x, dir.y);
const u = { x: dir.x / len, y: dir.y / len };
const P = { x: 560, y: 90 };
const proj = (P.x - L0.x) * u.x + (P.y - L0.y) * u.y;
const F = { x: L0.x + proj * u.x, y: L0.y + proj * u.y };
const pfLen = Math.hypot(P.x - F.x, P.y - F.y);
const n = { x: (P.x - F.x) / pfLen, y: (P.y - F.y) / pfLen };
const m = 12;
const corner = `M${F.x - m * u.x},${F.y - m * u.y} L${F.x - m * u.x + m * n.x},${F.y - m * u.y + m * n.y} L${F.x + m * n.x},${F.y + m * n.y}`;
const A = L(0.15);
const dTip = L(0.4);

export default function P3VectorsScalarProduct() {
  return (
    <Svg width={W} height={H}>
      <Label x={170} y={24} className="dg-text-small">Angle between two vectors</Label>
      <Arrow from={V} to={aEnd} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={V} to={bEnd} className="dg-accent-2" head="dg-dot-accent-2" />
      <path d={`M${arcStart.x},${arcStart.y} A50,50 0 0 0 ${arcEnd.x},${arcEnd.y}`} className="dg-line" fill="none" />
      <MathLabel x={thetaAt.x + 6} y={thetaAt.y} tex="\theta" w={30} />
      <MathLabel x={aEnd.x - 40} y={aEnd.y + 26} tex="\mathbf{a}" w={30} tone="accent" />
      <MathLabel x={bEnd.x - 30} y={bEnd.y + 6} tex="\mathbf{b}" w={30} tone="accent-2" />
      <MathLabel x={170} y={284} tex="\mathbf{a}\cdot\mathbf{b} = |\mathbf{a}|\,|\mathbf{b}|\cos\theta" w={300} />

      <Label x={515} y={24} className="dg-text-small">Foot of the perpendicular</Label>
      <line x1={L(-0.05).x} y1={L(-0.05).y} x2={L(1.05).x} y2={L(1.05).y} className="dg-line" strokeWidth={2} />
      <Arrow from={A} to={dTip} className="dg-accent" head="dg-dot-accent" />
      <line x1={P.x} y1={P.y} x2={F.x} y2={F.y} className="dg-accent-2 dg-dashed" strokeWidth={2} />
      <path d={corner} className="dg-line" fill="none" />
      <circle cx={A.x} cy={A.y} r={5} className="dg-dot" />
      <circle cx={P.x} cy={P.y} r={5} className="dg-dot" />
      <circle cx={F.x} cy={F.y} r={5} className="dg-dot-accent-2" />
      <MathLabel x={A.x - 4} y={A.y + 24} tex="A" w={30} />
      <MathLabel x={(A.x + dTip.x) / 2 + 6} y={(A.y + dTip.y) / 2 + 24} tex="\mathbf{d}" w={30} tone="accent" />
      <MathLabel x={P.x - 20} y={P.y - 8} tex="P" w={30} />
      <MathLabel x={F.x + 20} y={F.y + 16} tex="F" w={30} tone="accent-2" />
      <MathLabel x={515} y={284} tex="\overrightarrow{PF}\cdot\mathbf{d} = 0" w={300} />
    </Svg>
  );
}
