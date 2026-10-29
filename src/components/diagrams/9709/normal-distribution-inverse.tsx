/**
 * Working backwards from a probability: the shaded area 0.9 to the left of k
 * corresponds to z = 1.282, so k = μ + σz = 50 + 10(1.282) = 62.8.
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'normal-distribution-inverse';

const PW = 450;
const PH = 210;
const X: [number, number] = [20, 80];
const Y: [number, number] = [0, 0.046];
const MU = 50;
const SD = 10;
const K = 62.815;
const pdf = (x: number) => Math.exp(-0.5 * ((x - MU) / SD) ** 2) / (SD * Math.sqrt(2 * Math.PI));

export default function NormalDistributionInverse() {
  const p = makePlot({ width: PW, height: PH, pad: 18, x: X, y: Y });
  const axisY = p.sy(0);
  const shade = `${graph(pdf, [X[0], K], p, Y)} L${p.sx(K)},${axisY} L${p.sx(X[0])},${axisY} Z`;
  return (
    <Svg width={560} height={300}>
      <MathLabel x={280} y={24} tex="\text{P}(X < k) = 0.9" w={200} h={30} tone="accent" size="large" />
      <g transform="translate(45, 42)">
        <path d={shade} className="dg-fill-accent" />
        <path d={graph(pdf, X, p, Y)} className="dg-accent" />
        <line x1={p.sx(X[0])} y1={axisY} x2={p.sx(X[1]) + 8} y2={axisY} className="dg-thin" />
        <line x1={p.sx(K)} y1={axisY} x2={p.sx(K)} y2={p.sy(pdf(K))} className="dg-grid dg-dashed" />
        <line x1={p.sx(MU)} y1={axisY - 3} x2={p.sx(MU)} y2={axisY + 3} className="dg-thin" />
        <MathLabel x={p.sx(MU)} y={axisY + 17} tex="\mu = 50" w={80} h={22} size="small" />
        <MathLabel x={p.sx(K)} y={axisY + 17} tex="k = 62.8" w={90} h={22} size="small" />
        <MathLabel x={p.sx(40)} y={p.sy(0.008)} tex="\text{area} = 0.9" w={110} h={24} tone="accent" />
        <MathLabel x={p.sx(K) + 8} y={p.sy(pdf(K)) - 16} tex="z = 1.282" w={100} h={24} anchor="start" tone="accent" />
      </g>
      <MathLabel x={280} y={286} tex="k = \mu + \sigma z = 50 + 10(1.282) = 62.8" w={380} h={26} />
    </Svg>
  );
}
