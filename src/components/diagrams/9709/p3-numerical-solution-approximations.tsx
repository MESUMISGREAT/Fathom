/**
 * Successive approximations to √2 from x_{n+1} = ½(x_n + 2/x_n), x_1 = 1, on a number line from 0.95 to
 * 1.55. Curved arrows show each step: x_1 = 1 → x_2 = 1.5 → x_3 ≈ 1.4167 → x_4 ≈ 1.4142. The steps shrink,
 * and x_4 is too close to α = √2 to tell apart at this scale.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-numerical-solution-approximations';

const W = 600;
const H = 250;
const LEFT = 0.95;
const RIGHT = 1.55;
const sx = (x: number) => 40 + ((x - LEFT) / (RIGHT - LEFT)) * 520;
const Y = 160;

const pts = [1, 1.5, 1.4166666667, 1.4142156863];
const ALPHA = Math.SQRT2;

function Hop({ from, to, lift, n }: { from: number; to: number; lift: number; n: number }) {
  const a = sx(from);
  const b = sx(to);
  const mid = (a + b) / 2;
  const top = Y - lift;
  // small arrowhead at the landing point, pointing down along the end of the curve
  const dir = b > a ? 1 : -1;
  return (
    <g>
      <path d={`M${a},${Y - 8} Q${mid},${top} ${b},${Y - 8}`} className="dg-accent" fill="none" strokeWidth={2} />
      <polygon points={`${b},${Y - 6} ${b - dir * 9},${Y - 14} ${b - dir * 2},${Y - 17}`} className="dg-dot-accent" />
      <Label x={mid} y={Y - lift / 2 - 18} className="dg-text-small dg-text-accent">{`step ${n}`}</Label>
    </g>
  );
}

export default function P3NumericalSolutionApproximations() {
  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={24} tex="x_{n+1} = \tfrac{1}{2}\left(x_n + \tfrac{2}{x_n}\right),\quad x_1 = 1" w={380} h={36} />
      <line x1={sx(LEFT)} y1={Y} x2={sx(RIGHT)} y2={Y} className="dg-line" strokeWidth={2} />
      {[1.0, 1.1, 1.2, 1.3, 1.4, 1.5].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={Y - 5} x2={sx(t)} y2={Y + 5} className="dg-line" />
          <Label x={sx(t)} y={Y + 20} className="dg-text-small dg-text-muted">{t.toFixed(1)}</Label>
        </g>
      ))}
      <Hop from={pts[0]!} to={pts[1]!} lift={120} n={1} />
      <Hop from={pts[1]!} to={pts[2]!} lift={60} n={2} />
      <line x1={sx(ALPHA)} y1={Y - 14} x2={sx(ALPHA)} y2={Y + 14} className="dg-accent-2" strokeWidth={3} />
      {pts.map((p, i) => (
        <circle key={i} cx={sx(p)} cy={Y} r={5} className="dg-dot" />
      ))}
      <MathLabel x={sx(1)} y={Y + 44} tex="x_1 = 1" w={80} size="small" />
      <MathLabel x={sx(1.5)} y={Y + 44} tex="x_2 = 1.5" w={90} size="small" />
      <MathLabel x={sx(ALPHA) - 50} y={Y + 44} tex="x_3 \approx 1.4167" w={110} size="small" />
      <MathLabel x={sx(ALPHA) - 40} y={Y + 70} tex="x_4 \approx 1.4142 \approx \alpha = \sqrt2" w={200} size="small" tone="accent-2" />
    </Svg>
  );
}
