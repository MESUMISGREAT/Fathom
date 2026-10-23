/**
 * Why perpendicular gradients multiply to −1, drawn on a square grid.
 * Two lines cross at right angles at (1, 1): y = ½x + ½ (gradient ½) and
 * y = −2x + 3 (gradient −2). The gradient triangle on the first line (run 2, rise 1)
 * is rotated through 90° about (1, 1) to give the triangle on the second line
 * (rise 2, run −1). Run and rise swap and one changes sign, so ½ × (−2) = −1.
 */
import { Label, Svg, graph, MathLabel } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-perpendicular-gradients';

const W = 520;
const H = 400;
const PAD = 30;
const X: [number, number] = [-1.6, 4.6];
const ySpan = ((H - 2 * PAD) / (W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-0.8, -0.8 + ySpan];

export default function CoordinateGeometryPerpendicularGradients() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const P = (x: number, y: number) => `${p.sx(x)},${p.sy(y)}`;
  // right-angle marker at (1, 1) between directions (2, 1) and (−1, 2)
  const r = 0.28 / Math.sqrt(5);
  const a = { x: 1 + 2 * r, y: 1 + r };
  const c = { x: 1 - r, y: 1 + 2 * r };
  const b = { x: a.x + (c.x - 1), y: a.y + (c.y - 1) };
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-1, 1, 2, 3, 4]} yTicks={[1, 2, 3]} />
      <polygon points={`${P(1, 1)} ${P(3, 1)} ${P(3, 2)}`} className="dg-fill-accent" />
      <polygon points={`${P(1, 1)} ${P(1, 3)} ${P(0, 3)}`} className="dg-fill-accent-2" />
      <path d={`M${P(1, 1)} L${P(3, 1)} L${P(3, 2)}`} className="dg-accent dg-dashed" />
      <path d={`M${P(1, 1)} L${P(1, 3)} L${P(0, 3)}`} className="dg-accent-2 dg-dashed" />
      <path d={graph((x) => x / 2 + 0.5, X, p, Y)} className="dg-accent" />
      <path d={graph((x) => -2 * x + 3, X, p, Y)} className="dg-accent-2" />
      <path d={`M${P(a.x, a.y)} L${P(b.x, b.y)} L${P(c.x, c.y)}`} className="dg-thin" />
      <circle cx={p.sx(1)} cy={p.sy(1)} r={4} className="dg-dot" />

      <Label x={p.sx(2)} y={p.sy(1) + 15} className="dg-text-small">
        run 2
      </Label>
      <Label x={p.sx(3) + 8} y={p.sy(1.5)} anchor="start" className="dg-text-small">
        rise 1
      </Label>
      <Label x={p.sx(1) + 8} y={p.sy(2.2)} anchor="start" className="dg-text-small">
        rise 2
      </Label>
      <Label x={p.sx(0.5)} y={p.sy(3) - 13} className="dg-text-small">
        run −1
      </Label>
      <MathLabel x={p.sx(4.45)} y={p.sy(2.95)} anchor="end" w={211} h={46} tone="accent" tex={"\\text{gradient } 1 \\div 2 = \\dfrac{1}{2}"} />
      <Label x={p.sx(1.85)} y={p.sy(-0.45)} anchor="start" className="dg-text-accent-2">
        {'gradient 2 ÷ (−1) = −2'}
      </Label>
      <MathLabel x={p.sx(4.45)} y={p.sy(3.45)} anchor="end" w={163} h={46} tex={"\\dfrac{1}{2} \\times (-2) = -1"} />
    </Svg>
  );
}
