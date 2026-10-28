/**
 * Solving 2^x = 5: the curve y = 2^x meets the horizontal line y = 5 at
 * x = log_2 5 = 2.32, and 2^x < 5 exactly to the left of that point.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'math-p3-logarithmic-exponential-index-graph';

const W = 520;
const H = 350;

const { sx, sy } = axes({ width: W, height: H, pad: 52, x: [-2.4, 4], y: [-1, 9] });

export function P3LogarithmicExponentialIndexGraph() {
  const xStar = Math.log(5) / Math.log(2);
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        2ˣ meets y = 5 at x = 2.32
      </Label>

      <line x1={sx(-2.4)} y1={sy(0)} x2={sx(4)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(-1)} x2={sx(0)} y2={sy(9)} className="dg-line" />
      <Label x={sx(3.88)} y={sy(0) - 14} anchor="end" className="dg-text-small dg-text-muted">
        x
      </Label>
      <Label x={sx(0) - 12} y={sy(8.5)} anchor="end" className="dg-text-small dg-text-muted">
        y
      </Label>

      {[2, 4, 6].map((t) => (
        <Label key={t} x={sx(0) - 8} y={sy(t)} anchor="end" className="dg-text-small dg-text-muted">
          {t}
        </Label>
      ))}
      {[1, 2, 3].map((t) => (
        <Label key={t} x={sx(t)} y={sy(0) + 16} className="dg-text-small dg-text-muted">
          {t}
        </Label>
      ))}

      <path d={graph((x) => Math.pow(2, x), [-2.4, 3.2], { sx, sy }, [-1, 9])} className="dg-accent" />

      <line x1={sx(-2.4)} y1={sy(5)} x2={sx(4)} y2={sy(5)} className="dg-muted dg-dashed" />
      <Label x={sx(3.85)} y={sy(5) - 12} anchor="end" className="dg-text-small dg-text-muted">
        y = 5
      </Label>

      <line x1={sx(xStar)} y1={sy(5)} x2={sx(xStar)} y2={sy(0)} className="dg-muted dg-dashed" />
      <circle cx={sx(xStar)} cy={sy(5)} r={4.5} className="dg-dot-accent" />
      <Label x={sx(xStar) + 10} y={sy(5) + 20} anchor="start" className="dg-text-small dg-text-accent">
        x = 2.32
      </Label>

      <MathLabel x={sx(2.2)} y={sy(8.1)} tex="y = 2^{x}" w={100} h={30} tone="accent" />
      <Label x={sx(-0.3)} y={sy(7.9)} anchor="end" className="dg-text-small dg-text-muted">
        2ˣ &lt; 5 for every x &lt; 2.32
      </Label>
    </Svg>
  );
}

export default P3LogarithmicExponentialIndexGraph;
