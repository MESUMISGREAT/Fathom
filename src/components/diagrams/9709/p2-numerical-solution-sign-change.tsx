/**
 * y = x³ + x − 3 across x = 0…2.2. The curve is below the x-axis at x = 1 (f(1) = −1) and
 * above it at x = 2 (f(2) = 7), and it crosses the axis between them: one sign change, one
 * root, circled. Used to show why a sign change locates a root.
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'p2-numerical-solution-sign-change';

const W = 520;
const H = 350;
const X: [number, number] = [0, 2.2];
const Y: [number, number] = [-3, 8];

const f = (x: number) => x ** 3 + x - 3;
const ROOT = 1.2134;

export default function P2NumericalSolutionSignChange() {
  const p = makePlot({ width: 470, height: 240, pad: 26, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={24} tex="y = x^3 + x - 3" w={200} h={30} />
      <g transform="translate(20, 62)">
        <Grid p={p} />
        <AxesXY p={p} xTicks={[1, 2]} yTicks={[-2, 2, 4, 6]} yTicksRight={[]} />
        <path d={graph(f, X, p, Y)} className="dg-accent" />
        {/* the two values that are compared */}
        <circle cx={p.sx(1)} cy={p.sy(-1)} r={5} className="dg-fill-surface dg-accent" />
        <circle cx={p.sx(2)} cy={p.sy(7)} r={5} className="dg-fill-surface dg-accent" />
        <MathLabel
          x={p.sx(1) - 10}
          y={p.sy(-1) + 22}
          tex="f(1) = -1"
          anchor="middle"
          w={110}
          h={28}
          size="small"
          tone="muted"
        />
        <MathLabel
          x={p.sx(2) - 10}
          y={p.sy(7) - 18}
          tex="f(2) = 7"
          anchor="end"
          w={110}
          h={28}
          size="small"
          tone="muted"
        />
        {/* where it crosses */}
        <circle cx={p.sx(ROOT)} cy={p.sy(0)} r={5.5} className="dg-dot-accent-2" />
        <MathLabel
          x={p.sx(ROOT) - 10}
          y={p.sy(0) - 22}
          tex="f(x) = 0"
          anchor="end"
          w={100}
          h={28}
          size="small"
          tone="accent-2"
        />
        <Label x={p.sx(ROOT) + 14} y={p.sy(0) + 40} anchor="start" className="dg-text-small dg-text-muted">
          root between 1 and 2
        </Label>
      </g>
      <Label x={W / 2} y={H - 30} className="dg-text-small dg-bold">
        Negative at x = 1, positive at x = 2.
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text-small dg-text-muted">
        The continuous curve must cross between them.
      </Label>
    </Svg>
  );
}
