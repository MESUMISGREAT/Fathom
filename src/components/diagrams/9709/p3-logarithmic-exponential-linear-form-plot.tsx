/**
 * y = 2 * 3^x plotted as ln y against x. The data fall on a straight line whose
 * gradient is ln 3 and whose intercept is ln 2, which is how the constants are
 * recovered from the graph.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'math-p3-logarithmic-exponential-linear-form-plot';

const W = 520;
const H = 360;

const { sx, sy } = axes({ width: W, height: H, pad: 56, x: [-0.8, 3.4], y: [0, 4.6] });

const lnK = Math.log(2);
const lnA = Math.log(3);
const line = (x: number) => lnK + x * lnA;
const data = [1, 2, 3];

export function P3LogarithmicExponentialLinearFormPlot() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        y = 2 &#215; 3ˣ becomes a straight line
      </Label>

      <line x1={sx(-0.8)} y1={sy(0)} x2={sx(3.4)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(4.6)} className="dg-line" />
      <Label x={sx(3.4)} y={sy(0) + 20} anchor="end" className="dg-text-small dg-text-muted">
        x
      </Label>
      <Label x={sx(0) - 10} y={sy(4.35)} anchor="end" className="dg-text-small dg-text-muted">
        ln y
      </Label>

      {[1, 2, 3].map((t) => (
        <Label key={t} x={sx(t)} y={sy(0) + 18} className="dg-text-small dg-text-muted">
          {t}
        </Label>
      ))}
      {[1, 2, 3, 4].map((t) => (
        <Label key={t} x={sx(0) - 8} y={sy(t)} anchor="end" className="dg-text-small dg-text-muted">
          {t}
        </Label>
      ))}

      <path d={graph(line, [0, 3.35], { sx, sy }, [0, 4.6])} className="dg-accent" />

      {data.map((x) => (
        <circle key={x} cx={sx(x)} cy={sy(line(x))} r={4} className="dg-dot-accent" />
      ))}

      {[1, 3].map((x) => (
        <line key={x} x1={sx(x)} y1={sy(0)} x2={sx(x)} y2={sy(line(x))} className="dg-muted dg-dashed" />
      ))}
      <line x1={sx(1)} y1={sy(line(1))} x2={sx(3)} y2={sy(line(1))} className="dg-line" />
      <line x1={sx(3)} y1={sy(line(1))} x2={sx(3)} y2={sy(line(3))} className="dg-line" />

      <Label x={sx(2)} y={sy(line(1)) + 18} className="dg-text-small dg-text-muted">
        run = 2
      </Label>
      <Label x={sx(3) + 10} y={sy((line(1) + line(3)) / 2)} anchor="start" className="dg-text-small dg-text-muted">
        rise
      </Label>

      <circle cx={sx(0)} cy={sy(lnK)} r={4} className="dg-dot" />
      <Label x={sx(-0.06)} y={sy(lnK)} anchor="end" className="dg-text-small dg-text-muted">
        ln 2
      </Label>

      <MathLabel x={sx(2.35)} y={sy(4.25)} tex="\text{gradient} = \ln 3" w={170} h={30} tone="accent" />
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        e to the gradient gives a = 3; e to the intercept gives k = 2
      </Label>
    </Svg>
  );
}

export default P3LogarithmicExponentialLinearFormPlot;
