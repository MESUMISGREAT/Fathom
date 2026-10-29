/**
 * Quick reminder of the three main logarithm laws.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p2-logarithmic-exponential-log-laws';

export default function P2LogarithmicExponentialLogLaws() {
  return (
    <Svg width={640} height={250}>
      <rect x={20} y={20} width={600} height={210} rx={12} className="dg-fill-muted" />
      <MathLabel x={320} y={66} tex="\log_a(xy) = \log_a x + \log_a y" w={540} h={42} tone="accent" />
      <MathLabel x={320} y={122} tex="\log_a\left(\dfrac{x}{y}\right) = \log_a x - \log_a y" w={540} h={42} tone="accent-2" />
      <MathLabel x={320} y={178} tex="\log_a(x^n) = n\log_a x" w={540} h={42} />
      <Label x={320} y={215} className="dg-text-small">Use the same base; each argument must be positive.</Label>
    </Svg>
  );
}
