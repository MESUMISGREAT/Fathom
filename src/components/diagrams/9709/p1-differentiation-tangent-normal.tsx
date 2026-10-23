/**
 * y = x² − 2x + 3 with its tangent and normal at P(2, 3), drawn with equal
 * scales on both axes so the right angle is a true right angle.
 * dy/dx = 2x − 2 = 2 at x = 2: tangent y = 2x − 1, normal y = −½x + 4.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'p1-differentiation-tangent-normal';

// 50 px per unit on both axes.
const X: [number, number] = [-1.5, 6.5];
const Y: [number, number] = [-1.5, 7.5];
const PAD = 30;
const W = 8 * 50 + 2 * PAD;
const H = 9 * 50 + 2 * PAD;
const f = (x: number) => x * x - 2 * x + 3;

export default function P1DifferentiationTangentNormal() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const P = { x: 2, y: 3 };
  // unit directions in maths space
  const t = { x: 1 / Math.sqrt(5), y: 2 / Math.sqrt(5) };
  const n = { x: -2 / Math.sqrt(5), y: 1 / Math.sqrt(5) };
  const s = 0.32; // right-angle marker size (units)
  const corner = (a: number, b: number) => ({ x: P.x + a * t.x + b * n.x, y: P.y + a * t.y + b * n.y });
  const c1 = corner(s, 0);
  const c2 = corner(s, s);
  const c3 = corner(0, s);
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-1, 1, 2, 3, 4, 5, 6]} yTicks={[-1, 1, 2, 3, 4, 5, 6, 7]} />

      {/* tangent y = 2x − 1 */}
      <path d={graph((x) => 2 * x - 1, [-0.25, 4.2], p, Y)} className="dg-accent-2" />
      {/* normal y = −x/2 + 4 */}
      <path d={graph((x) => -0.5 * x + 4, [-1.5, 6.5], p, Y)} className="dg-line dg-dashed" />
      {/* curve */}
      <path d={graph(f, X, p, Y)} className="dg-accent" />

      {/* right-angle marker */}
      <path
        d={`M${p.sx(c1.x)},${p.sy(c1.y)} L${p.sx(c2.x)},${p.sy(c2.y)} L${p.sx(c3.x)},${p.sy(c3.y)}`}
        className="dg-thin"
      />

      <circle cx={p.sx(P.x)} cy={p.sy(P.y)} r={5} className="dg-dot" />
      <Label x={p.sx(P.x) + 12} y={p.sy(P.y) + 14} anchor="start" className="dg-text dg-bold">
        P(2, 3)
      </Label>

      <Label x={p.sx(3.95)} y={p.sy(7.15)} anchor="end" className="dg-text-accent-2">
        tangent y = 2x − 1
      </Label>
      <Label x={p.sx(3.95)} y={p.sy(7.15) + 18} anchor="end" className="dg-text-small">
        gradient 2
      </Label>
      <Label x={p.sx(6.4)} y={p.sy(0.75)} anchor="end" className="dg-text dg-bold">
        normal y = −½x + 4
      </Label>
      <Label x={p.sx(6.4)} y={p.sy(0.75) + 18} anchor="end" className="dg-text-small">
        gradient −½
      </Label>
      <Label x={p.sx(-1.35)} y={p.sy(6.1)} anchor="start" className="dg-text-accent">
        y = x² − 2x + 3
      </Label>
    </Svg>
  );
}
