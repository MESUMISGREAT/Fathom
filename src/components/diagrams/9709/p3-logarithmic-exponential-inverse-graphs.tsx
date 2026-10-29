/**
 * y = e^x and y = ln x are inverses, so their graphs are mirror images in the
 * line y = x. The point (0, 1) on the exponential curve reflects to (1, 0) on
 * the logarithmic curve; the x-axis is the asymptote of one, the y-axis of the
 * other.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'math-p3-logarithmic-exponential-inverse-graphs';

const W = 500;
const H = 400;

const { sx, sy } = axes({ width: W, height: H, pad: 58, x: [-2.6, 3.3], y: [-2.6, 3.3] });

export function P3LogarithmicExponentialInverseGraphs() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Inverse functions: reflections in y = x
      </Label>

      <line x1={sx(-2.6)} y1={sy(0)} x2={sx(3.3)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(-2.6)} x2={sx(0)} y2={sy(3.3)} className="dg-line" />
      <Label x={sx(3.25)} y={sy(0) - 14} anchor="end" className="dg-text-small dg-text-muted">
        x
      </Label>
      <Label x={sx(0) + 12} y={sy(3.15)} anchor="start" className="dg-text-small dg-text-muted">
        y
      </Label>

      {[1, 2, 3].map((t) => (
        <g key={t}>
          <Label x={sx(t)} y={sy(0) + 17} className="dg-text-small dg-text-muted">
            {t}
          </Label>
          <Label x={sx(0) - 9} y={sy(t)} anchor="end" className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}

      <path d={graph((x) => x, [-2.6, 3.3], { sx, sy }, [-2.6, 3.3])} className="dg-muted dg-dashed" />
      <Label x={sx(-1.75)} y={sy(-1.28)} anchor="start" className="dg-text-small dg-text-muted">
        y = x
      </Label>

      <path d={graph((x) => Math.exp(x), [-2.6, 3.3], { sx, sy }, [-2.6, 3.3])} className="dg-accent" />
      <path d={graph((x) => Math.log(x), [0.03, 3.3], { sx, sy }, [-2.6, 3.3])} className="dg-accent-2" />

      <circle cx={sx(0)} cy={sy(1)} r={4} className="dg-dot-accent" />
      <circle cx={sx(1)} cy={sy(0)} r={4} className="dg-dot-accent-2" />

      <Label x={sx(-0.18)} y={sy(1.62)} anchor="end" className="dg-text-small dg-text-accent">
        (0, 1)
      </Label>
      <Label x={sx(1.12)} y={sy(-0.62)} anchor="start" className="dg-text-small dg-text-accent-2">
        (1, 0)
      </Label>

      <MathLabel x={sx(-1.35)} y={sy(2.6)} tex="y = e^{x}" w={110} h={30} tone="accent" />
      <MathLabel x={sx(2.45)} y={sy(1.28)} tex="y = \ln x" w={110} h={30} tone="accent-2" />

      <Label x={W / 2} y={H - 18} className="dg-text-small dg-text-muted">
        ln x is only defined for x &gt; 0, and e raised to any power is never zero
      </Label>
    </Svg>
  );
}

export default P3LogarithmicExponentialInverseGraphs;
