/**
 * The normal curve for X ~ N(μ, σ²): symmetric about μ, total area 1, with σ
 * setting the spread. The left half is shaded to show P(X < μ) = 0.5.
 */
import { Arrow, Label, MathLabel, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'normal-distribution-curve';

const PW = 460;
const PH = 220;
const X: [number, number] = [-3.8, 3.8];
const Y: [number, number] = [0, 0.46];
const pdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

export default function NormalDistributionCurve() {
  const p = makePlot({ width: PW, height: PH, pad: 18, x: X, y: Y });
  const axisY = p.sy(0);
  const shade = `${graph(pdf, [X[0], 0], p, Y)} L${p.sx(0)},${axisY} L${p.sx(X[0])},${axisY} Z`;
  return (
    <Svg width={560} height={300}>
      <MathLabel x={280} y={22} tex="X \sim \mathrm{N}(\mu, \sigma^2)" w={220} h={30} tone="accent" size="large" />
      <g transform="translate(50, 38)">
        <path d={shade} className="dg-fill-accent" />
        <line x1={p.sx(X[0])} y1={axisY} x2={p.sx(X[1]) + 10} y2={axisY} className="dg-thin" />
        <Label x={p.sx(X[1]) + 16} y={axisY} className="dg-text dg-italic">
          x
        </Label>
        <path d={graph(pdf, X, p, Y)} className="dg-accent" />
        <line x1={p.sx(0)} y1={axisY} x2={p.sx(0)} y2={p.sy(pdf(0))} className="dg-grid dg-dashed" />
        <Arrow
          x1={p.sx(0)}
          y1={p.sy(0.13)}
          x2={p.sx(1)}
          y2={p.sy(0.13)}
          className="dg-thin"
          head={7}
          double
        />
        <MathLabel x={(p.sx(0) + p.sx(1)) / 2} y={p.sy(0.13) - 13} tex="\sigma" w={40} h={24} size="small" />
        {[-2, -1, 0, 1, 2].map((t) => (
          <g key={t}>
            <line x1={p.sx(t)} y1={axisY - 3} x2={p.sx(t)} y2={axisY + 3} className="dg-thin" />
            <MathLabel
              x={p.sx(t)}
              y={axisY + 17}
              tex={t === 0 ? '\\mu' : t === -1 ? '\\mu-\\sigma' : t === 1 ? '\\mu+\\sigma' : t === -2 ? '\\mu-2\\sigma' : '\\mu+2\\sigma'}
              w={90}
              h={22}
              size="small"
            />
          </g>
        ))}
        <MathLabel x={p.sx(-0.55)} y={p.sy(0.045)} tex="\text{P}(X < \mu) = 0.5" w={120} h={24} tone="accent" size="small" />
      </g>
      <Label x={280} y={285} className="dg-text-small">
        symmetric bell curve, mean = median = mode at μ, total area = 1
      </Label>
    </Svg>
  );
}
