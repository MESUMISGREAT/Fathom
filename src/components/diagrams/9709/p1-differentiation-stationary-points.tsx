/**
 * y = x³ − 3x + 2 = (x − 1)²(x + 2). dy/dx = 3x² − 3 = 0 at x = ±1.
 * Maximum (−1, 4) where d²y/dx² = 6x = −6 < 0; minimum (1, 0) where
 * d²y/dx² = 6 > 0. Short horizontal tangents mark both stationary points and
 * the sign of dy/dx is shown on each stretch of the curve.
 */
import { Label, Svg, graph, MathLabel } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'p1-differentiation-stationary-points';

const W = 580;
const H = 420;
const X: [number, number] = [-2.7, 2.5];
const Y: [number, number] = [-1.6, 6.4];
const f = (x: number) => x ** 3 - 3 * x + 2;

export default function P1DifferentiationStationaryPoints() {
  const p = makePlot({ width: W, height: H, pad: 34, x: X, y: Y });
  const flat = (x: number, y: number) => (
    <line x1={p.sx(x - 0.42)} y1={p.sy(y)} x2={p.sx(x + 0.42)} y2={p.sy(y)} className="dg-accent-2" />
  );
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-1, 1, 2]} yTicks={[2, 4, 6]} />
      <path d={graph(f, X, p, Y)} className="dg-accent" />

      {flat(-1, 4)}
      {flat(1, 0)}
      <circle cx={p.sx(-1)} cy={p.sy(4)} r={5} className="dg-dot-accent-2" />
      <circle cx={p.sx(1)} cy={p.sy(0)} r={5} className="dg-dot-accent-2" />

      <Label x={p.sx(-1)} y={p.sy(4) - 64} className="dg-text-accent-2">
        maximum (−1, 4)
      </Label>
      <MathLabel x={p.sx(-1)} y={p.sy(4) - 32} w={270} h={46} size="small" tex={"\\dfrac{dy}{dx} = 0,\\quad \\dfrac{d^2y}{dx^2} = -6 < 0"} />
      <Label x={p.sx(1.12)} y={p.sy(0) + 30} anchor="start" className="dg-text-accent-2">
        minimum (1, 0)
      </Label>
      <MathLabel x={p.sx(1.12)} y={p.sy(0) + 60} anchor="start" w={250} h={46} size="small" tex={"\\dfrac{dy}{dx} = 0,\\quad \\dfrac{d^2y}{dx^2} = 6 > 0"} />

      {/* gradient signs along the curve */}
      <MathLabel x={p.sx(-2.05)} y={p.sy(2.6)} anchor="end" w={125} h={46} tone="accent" tex={"\\dfrac{dy}{dx} > 0"} />
      <MathLabel x={p.sx(0.12)} y={p.sy(2.6)} anchor="start" w={125} h={46} tone="accent" tex={"\\dfrac{dy}{dx} < 0"} />
      <MathLabel x={p.sx(1.65)} y={p.sy(4.6)} anchor="end" w={125} h={46} tone="accent" tex={"\\dfrac{dy}{dx} > 0"} />

      <Label x={p.sx(1.9)} y={p.sy(6.0)} anchor="end" className="dg-text">
        y = x³ − 3x + 2
      </Label>
    </Svg>
  );
}
