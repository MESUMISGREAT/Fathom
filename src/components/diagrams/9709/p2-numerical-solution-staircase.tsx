/**
 * Staircase (cobweb) for the iteration x(n+1) = √(x(n) + 2), started at x₁ = 1.
 * Each vertical hop applies the formula (up to the curve); each horizontal hop carries the
 * answer across to y = x, ready to be the next input. The steps shrink towards (2, 2), the
 * point where the curve meets y = x: the fixed point, i.e. the root.
 */
import { MathLabel, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'p2-numerical-solution-staircase';

const W = 480;
const H = 400;
const X: [number, number] = [0, 2.4];
const Y: [number, number] = [0, 2.5];

const F = (x: number) => Math.sqrt(x + 2);

export default function P2NumericalSolutionStaircase() {
  const p = makePlot({ width: 430, height: 280, pad: 26, x: X, y: Y });

  // The staircase, built from the real iterates.
  const xs: number[] = [1];
  for (let i = 0; i < 4; i++) xs.push(F(xs[xs.length - 1]!));
  const path: Array<[number, number]> = [[xs[0]!, 0]];
  for (const x of xs) {
    path.push([x, F(x)]); // vertical: apply the formula
    path.push([F(x), F(x)]); // horizontal: across to y = x
  }

  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={22} tex="x_{n+1} = \sqrt{x_n + 2},\quad x_1 = 1" w={260} h={30} />
      <g transform="translate(22, 56)">
        <Grid p={p} />
        <AxesXY p={p} xTicks={[1, 2]} yTicks={[1, 2]} yTicksRight={[]} />
        {/* y = x */}
        <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(2.4)} y2={p.sy(2.4)} className="dg-line" />
        {/* the curve */}
        <path d={graph(F, [0, 2.4], p, Y)} className="dg-accent" />
        {/* staircase */}
        <polyline
          points={path.map(([x, y]) => `${p.sx(x)},${p.sy(y)}`).join(' ')}
          fill="none"
          className="dg-accent-2"
        />
        {/* starting point and fixed point */}
        <circle cx={p.sx(1)} cy={p.sy(0)} r={4} className="dg-dot" />
        <MathLabel
          x={p.sx(1)}
          y={p.sy(0) + 24}
          tex="x_1 = 1"
          w={80}
          h={26}
          size="small"
          tone="muted"
        />
        <circle cx={p.sx(2)} cy={p.sy(2)} r={5} className="dg-dot-accent" />
        <MathLabel
          x={p.sx(2) + 10}
          y={p.sy(2) + 26}
          tex="x = 2"
          anchor="start"
          w={70}
          h={26}
          size="small"
          tone="accent"
        />
        <MathLabel
          x={p.sx(0.62)}
          y={p.sy(2.28)}
          tex="y = \sqrt{x + 2}"
          anchor="start"
          w={130}
          h={28}
          size="small"
          tone="accent"
        />
        <MathLabel
          x={p.sx(0.42)}
          y={p.sy(0.66)}
          tex="y = x"
          anchor="start"
          w={70}
          h={26}
          size="small"
          tone="muted"
        />
      </g>
    </Svg>
  );
}
