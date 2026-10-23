/**
 * The foot of the perpendicular from P(5, 1) to the line L: y = 2x + 1, on a square grid.
 * The perpendicular through P has gradient −½: y = −½x + 7/2. It meets L at F(1, 3),
 * the foot of the perpendicular. PF = √(4² + 2²) = 2√5 is the shortest (perpendicular)
 * distance from P to L. A right-angle mark at F.
 */
import { Label, Svg, graph, MathLabel } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-foot-of-perpendicular';

const W = 500;
const H = 460;
const PAD = 30;
const X: [number, number] = [-2.6, 7.4];
const ySpan = ((H - 2 * PAD) / (W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-1.6, -1.6 + ySpan];
const L = (x: number) => 2 * x + 1;
const perp = (x: number) => -0.5 * x + 3.5;

export default function CoordinateGeometryFootOfPerpendicular() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const P = { x: 5, y: 1 };
  const F = { x: 1, y: 3 };
  // unit vectors (maths units): along L, and from F towards P
  const along = { x: 1 / Math.sqrt(5), y: 2 / Math.sqrt(5) };
  const toP = { x: 2 / Math.sqrt(5), y: -1 / Math.sqrt(5) };
  const s = 0.36;
  const a = { x: F.x + s * along.x, y: F.y + s * along.y };
  const b = { x: a.x + s * toP.x, y: a.y + s * toP.y };
  const c = { x: F.x + s * toP.x, y: F.y + s * toP.y };
  const pt = (q: { x: number; y: number }) => `${p.sx(q.x)},${p.sy(q.y)}`;
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, -1, 1, 2, 3, 4, 5, 6, 7]} yTicks={[2, 4, 6]} yTicksRight={[-1]} />
      {/* the line L, kept below the top edge so it clears the y-axis label */}
      <path d={graph(L, X, p, [Y[0], 7.6])} className="dg-accent" />
      {/* the rest of the perpendicular line, faint */}
      <path d={graph(perp, X, p, Y)} className="dg-muted dg-dashed" />
      {/* the perpendicular distance PF */}
      <line x1={p.sx(P.x)} y1={p.sy(P.y)} x2={p.sx(F.x)} y2={p.sy(F.y)} className="dg-accent-2" />
      <path d={`M${pt(a)} L${pt(b)} L${pt(c)}`} className="dg-thin" />
      <circle cx={p.sx(P.x)} cy={p.sy(P.y)} r={5} className="dg-dot" />
      <circle cx={p.sx(F.x)} cy={p.sy(F.y)} r={5} className="dg-dot-accent-2" />

      <Label x={p.sx(P.x) + 8} y={p.sy(P.y) - 14} anchor="start" className="dg-text dg-bold">
        P(5, 1)
      </Label>
      <Label x={p.sx(F.x) - 12} y={p.sy(F.y) + 8} anchor="end" className="dg-text-accent-2">
        F(1, 3)
      </Label>
      <Label x={p.sx(1.62)} y={p.sy(3.8)} anchor="start" className="dg-text-small">
        foot of the perpendicular
      </Label>
      <Label x={p.sx(3.05)} y={p.sy(6.3)} anchor="start" className="dg-text-accent">
        L: y = 2x + 1
      </Label>
      <Label x={p.sx(3.05)} y={p.sy(6.3) + 18} anchor="start" className="dg-text-small">
        gradient 2
      </Label>
      <MathLabel x={p.sx(3.35)} y={p.sy(2.55)} anchor="start" w={182} h={46} size="small" tex={"PF\\text{: gradient } {-\\dfrac{1}{2}}"} />
      <MathLabel x={p.sx(7.3)} y={p.sy(-0.75)} anchor="end" w={239} h={30} size="small" tex={"PF = \\sqrt{4^2 + 2^2} = 2\\sqrt{5}"} />
    </Svg>
  );
}
