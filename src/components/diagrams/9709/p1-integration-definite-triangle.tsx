/**
 * Checking a definite integral another way: y = 2x drawn on equal-scale axes with the triangle
 * under it from x = 0 to x = 2 shaded (base 2, height 4). Right: the triangle's area,
 * ½ × 2 × 4 = 4, matches ∫₀² 2x dx = [x²]₀² = 4 − 0 = 4.
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';
import { regionPath } from './p1-integration-kit';

export const diagramKey = 'p1-integration-definite-triangle';

// 56 px per unit on both axes; the plot fills the left part, the working sits on the right.
const X: [number, number] = [-0.6, 3.2];
const Y: [number, number] = [-0.6, 5.4];
const PAD = 30;
const PW = 3.8 * 56 + 2 * PAD;
const H = 6 * 56 + 2 * PAD;
const W = 640;

export default function P1IntegrationDefiniteTriangle() {
  const p = makePlot({ width: PW, height: H, pad: PAD, x: X, y: Y });
  const f = (x: number) => 2 * x;
  const RX = PW + 20;
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <path d={regionPath(p, f, () => 0, 0, 2)} className="dg-fill-accent" />
      <AxesXY p={p} xTicks={[1, 2, 3]} yTicks={[1, 2, 3, 4, 5]} />
      <path d={graph(f, [0, 2.65], p, Y)} className="dg-accent" />
      <line x1={p.sx(2)} y1={p.sy(0)} x2={p.sx(2)} y2={p.sy(4)} className="dg-line dg-dashed" />
      <circle cx={p.sx(2)} cy={p.sy(4)} r={4.5} className="dg-dot" />
      <Label x={p.sx(2) + 10} y={p.sy(4) + 2} anchor="start" className="dg-text-small">
        (2, 4)
      </Label>
      <Label x={p.sx(1.05)} y={p.sy(2.5)} anchor="end" className="dg-text-accent">
        y = 2x
      </Label>

      <Label x={RX} y={92} anchor="start" className="dg-text dg-bold">
        Triangle
      </Label>
      <MathLabel x={RX} y={130} anchor="start" w={W - RX - 10} h={48} size="large" tex="\dfrac12 \times 2 \times 4 = 4" />
      <Label x={RX} y={206} anchor="start" className="dg-text dg-bold">
        Integral
      </Label>
      <MathLabel x={RX} y={248} anchor="start" w={W - RX - 10} h={52} size="large" tex="\int_0^2 2x\,dx = \Big[x^2\Big]_0^2" />
      <MathLabel x={RX} y={300} anchor="start" w={W - RX - 10} h={40} size="large" tex="= 4 - 0 = 4\ \checkmark" />
    </Svg>
  );
}
