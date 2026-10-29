/**
 * Why a rearranged iteration can fail. Cobweb for x(n+1) = x(n)² − 3 started at x₁ = 2:
 * the path goes 2 → 1 → −2 → 1 → −2 … and retraces the same square for ever instead of
 * closing in on a root. The roots are where y = x² − 3 meets y = x (x ≈ 2.30 and x ≈ −1.30),
 * and the iteration never reaches either of them.
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'p2-numerical-solution-divergence';

const W = 480;
const H = 420;
const X: [number, number] = [-2.6, 2.6];
const Y: [number, number] = [-3.2, 3.2];

const F = (x: number) => x * x - 3;
const ROOT_A = 2.3028;
const ROOT_B = -1.3028;

export default function P2NumericalSolutionDivergence() {
  const p = makePlot({ width: 430, height: 300, pad: 26, x: X, y: Y });

  const orbit: Array<[number, number]> = [
    [2, 0],
    [2, 1],
    [1, 1],
    [1, -2],
    [-2, -2],
    [-2, 1],
    [1, 1],
  ];

  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={22} tex="x_{n+1} = x_n^2 - 3,\quad x_1 = 2" w={260} h={30} />
      <g transform="translate(22, 56)">
        <Grid p={p} />
        <AxesXY p={p} xTicks={[-2, -1, 1, 2]} yTicks={[-2, -1, 1, 2]} yTicksRight={[]} />
        <line x1={p.sx(-2.6)} y1={p.sy(-2.6)} x2={p.sx(2.6)} y2={p.sy(2.6)} className="dg-line" />
        <path d={graph(F, X, p, Y)} className="dg-accent" />
        <polyline
          points={orbit.map(([x, y]) => `${p.sx(x)},${p.sy(y)}`).join(' ')}
          fill="none"
          className="dg-accent-2"
        />
        {/* the roots: where the curve meets y = x */}
        <circle cx={p.sx(ROOT_A)} cy={p.sy(ROOT_A)} r={5} className="dg-dot" />
        <circle cx={p.sx(ROOT_B)} cy={p.sy(ROOT_B)} r={5} className="dg-dot" />
        <MathLabel
          x={p.sx(ROOT_A) - 10}
          y={p.sy(ROOT_A) - 26}
          tex="x \approx 2.30"
          anchor="end"
          w={110}
          h={26}
          size="small"
          tone="muted"
        />
        <MathLabel
          x={p.sx(ROOT_B) - 12}
          y={p.sy(ROOT_B) + 2}
          tex="x \approx -1.30"
          anchor="end"
          w={110}
          h={26}
          size="small"
          tone="muted"
        />
        {/* the orbit's values */}
        <MathLabel
          x={p.sx(2) - 14}
          y={p.sy(0) - 20}
          tex="x_1 = 2"
          anchor="end"
          w={80}
          h={26}
          size="small"
          tone="accent-2"
        />
        <MathLabel
          x={p.sx(1) - 12}
          y={p.sy(1) - 16}
          tex="x_2 = 1"
          anchor="end"
          w={80}
          h={26}
          size="small"
          tone="accent-2"
        />
        <MathLabel
          x={p.sx(-2)}
          y={p.sy(-2) + 26}
          tex="x_3 = -2"
          anchor="middle"
          w={90}
          h={26}
          size="small"
          tone="accent-2"
        />
        <MathLabel
          x={p.sx(0.1)}
          y={p.sy(2.55)}
          tex="y = x^2 - 3"
          anchor="start"
          w={120}
          h={28}
          size="small"
          tone="accent"
        />
        <MathLabel
          x={p.sx(-2.45)}
          y={p.sy(0.3)}
          tex="y = x"
          anchor="start"
          w={70}
          h={26}
          size="small"
          tone="muted"
        />
      </g>
      <Label x={W / 2} y={H - 32} className="dg-text-small dg-bold">
        Loops between 1 and −2: it never settles.
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text-small dg-text-muted">
        The roots (dots) are never reached, so the iteration fails.
      </Label>
    </Svg>
  );
}
