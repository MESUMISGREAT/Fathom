/**
 * The convergence interval for the binomial series: the expansion of (1 + x)^n
 * converges only for |x| < 1. The interval (-1, 1) is shaded; outside it the
 * terms grow, so adding more makes the estimate worse.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'math-p3-algebra-binomial-validity';

const W = 560;
const H = 202;
const X0 = 60;
const X1 = 520;
const AXIS_Y = 112;

const sx = (x: number) => X0 + ((x + 3) / 6) * (X1 - X0);

export function P3AlgebraBinomialValidity() {
  const ticks = [-3, -2, -1, 0, 1, 2, 3];
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Where the series converges
      </Label>

      <rect
        x={sx(-1)}
        y={AXIS_Y - 34}
        width={sx(1) - sx(-1)}
        height={30}
        className="dg-fill-accent dg-thin"
      />

      <line x1={X0} y1={AXIS_Y} x2={X1} y2={AXIS_Y} className="dg-line" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={AXIS_Y} x2={sx(t)} y2={AXIS_Y + 6} className="dg-muted" />
          <Label x={sx(t)} y={AXIS_Y + 22} className="dg-text-small dg-text-muted">
            {t < 0 ? `\u2212${Math.abs(t)}` : t}
          </Label>
        </g>
      ))}

      <circle cx={sx(-1)} cy={AXIS_Y} r={4.5} className="dg-dot" />
      <circle cx={sx(1)} cy={AXIS_Y} r={4.5} className="dg-dot" />

      <Label x={sx(0)} y={AXIS_Y - 48} className="dg-text-small dg-text-accent">
        valid: |x| &lt; 1
      </Label>
      <Label x={sx(-2.35)} y={AXIS_Y + 48} className="dg-text-small dg-text-muted">
        terms grow, so it diverges
      </Label>
      <Label x={sx(2.35)} y={AXIS_Y + 48} className="dg-text-small dg-text-muted">
        terms grow, so it diverges
      </Label>

      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        at x = &#177;1 the expansion is not valid
      </Label>
    </Svg>
  );
}

export default P3AlgebraBinomialValidity;
