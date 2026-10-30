/**
 * Two cobweb diagrams side by side.
 * Left: x = ∛(2x + 5) converges (staircase/spiral in).
 * Right: x = (x³ - 5)/2 diverges (spiral out).
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'p3-numerical-solution-rearranging-cobweb';

const W = 560;
const H = 320;
const X: [number, number] = [-0.5, 3.5];
const Y: [number, number] = [-0.5, 3.5];

const F1 = (x: number) => Math.cbrt(2 * x + 5);
const F2 = (x: number) => (x ** 3 - 5) / 2;

function cobwebPoints(F: (x: number) => number, x0: number, steps: number): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  let x = x0;
  pts.push([x, 0]);
  for (let i = 0; i < steps; i++) {
    const y = F(x);
    pts.push([x, y]);
    pts.push([y, y]);
    x = y;
  }
  return pts;
}

export default function P3NumericalSolutionRearrangingCobweb() {
  const p = makePlot({ width: 240, height: 240, pad: 16, x: X, y: Y });

  const conv = cobwebPoints(F1, 2.0, 6);
  const div = cobwebPoints(F2, 2.0, 4);

  return (
    <Svg width={W} height={H}>
      <MathLabel x={140} y={24} tex="x = \sqrt[3]{2x + 5}" w={200} h={28} size="small" tone="accent" />
      <MathLabel x={420} y={24} tex="x = (x^3 - 5)/2" w={200} h={28} size="small" tone="muted" />
      {/* Converging */}
      <g transform="translate(20, 50)">
        <Grid p={p} />
        <AxesXY p={p} xTicks={[1, 2, 3]} yTicks={[1, 2, 3]} yTicksRight={[]} />
        <line x1={p.sx(-0.5)} y1={p.sy(-0.5)} x2={p.sx(3.5)} y2={p.sy(3.5)} className="dg-line" />
        <path d={graph(F1, X, p, Y)} className="dg-accent" />
        <polyline points={conv.map(([x, y]) => `${p.sx(x)},${p.sy(y)}`).join(' ')} fill="none" className="dg-accent-2" strokeWidth={2} />
        <circle cx={p.sx(2.095)} cy={p.sy(2.095)} r={4} className="dg-dot-accent-2" />
      </g>
      {/* Diverging */}
      <g transform="translate(300, 50)">
        <Grid p={p} />
        <AxesXY p={p} xTicks={[1, 2, 3]} yTicks={[1, 2, 3]} yTicksRight={[]} />
        <line x1={p.sx(-0.5)} y1={p.sy(-0.5)} x2={p.sx(3.5)} y2={p.sy(3.5)} className="dg-line" />
        <path d={graph(F2, X, p, Y)} className="dg-accent" />
        <polyline points={div.map(([x, y]) => `${p.sx(x)},${p.sy(y)}`).join(' ')} fill="none" className="dg-accent-2" strokeWidth={2} />
        <circle cx={p.sx(2.095)} cy={p.sy(2.095)} r={4} className="dg-dot" />
      </g>
      <Label x={W / 2} y={H - 16} className="dg-text-small dg-bold">
        Same equation, two rearrangements. Left converges; right diverges.
      </Label>
    </Svg>
  );
}