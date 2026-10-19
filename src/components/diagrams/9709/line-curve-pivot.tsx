/**
 * The curve y = x² − 2x + 2 and four lines y = kx − 2, all through (0, −2):
 * k = 3 crosses the curve at (1, 1) and (4, 10); k = 2 and k = −6 are tangents
 * touching at (2, 2) and (−2, 10); k = 0 misses the curve. To scale.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'line-curve-pivot';

const W = 560;
const H = 440;
const X: [number, number] = [-3, 5];
const Y: [number, number] = [-3.5, 12.5];
const curve = (x: number) => x * x - 2 * x + 2;
const line = (k: number) => (x: number) => k * x - 2;

export default function LineCurvePivot() {
  const p = makePlot({ width: W, height: H, pad: 34, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, -1, 1, 2, 3, 4]} yTicks={[2, 4, 6, 8, 10, 12]} />

      <path d={graph(line(0), X, p, Y)} className="dg-muted dg-dashed" />
      <path d={graph(line(3), X, p, Y)} className="dg-line" />
      <path d={graph(line(2), X, p, Y)} className="dg-accent-2" />
      <path d={graph(line(-6), X, p, Y)} className="dg-accent-2" />
      <path d={graph(curve, X, p, Y)} className="dg-accent" />

      {/* pivot */}
      <circle cx={p.sx(0)} cy={p.sy(-2)} r={5} className="dg-dot" />
      <Label x={p.sx(0) + 10} y={p.sy(-2) + 15} anchor="start" className="dg-text-small">
        every line passes through (0, −2)
      </Label>

      {/* intersections */}
      <circle cx={p.sx(1)} cy={p.sy(1)} r={4.5} className="dg-dot" />
      <circle cx={p.sx(4)} cy={p.sy(10)} r={4.5} className="dg-dot" />
      <circle cx={p.sx(2)} cy={p.sy(2)} r={5} className="dg-dot-accent-2" />
      <circle cx={p.sx(-2)} cy={p.sy(10)} r={5} className="dg-dot-accent-2" />

      {/* line labels */}
      <Label x={p.sx(4) - 10} y={p.sy(11.6)} anchor="end" className="dg-text dg-bold">
        k = 3: two points
      </Label>
      <Label x={p.sx(4.25)} y={p.sy(5.4)} anchor="start" className="dg-text-accent-2">
        k = 2
      </Label>
      <Label x={p.sx(4.25)} y={p.sy(5.4) + 17} anchor="start" className="dg-text-small">
        tangent
      </Label>
      <Label x={p.sx(-2.1)} y={p.sy(8.6)} anchor="end" className="dg-text-accent-2">
        k = −6
      </Label>
      <Label x={p.sx(-2.1)} y={p.sy(8.6) + 17} anchor="end" className="dg-text-small">
        tangent
      </Label>
      <Label x={p.sx(4.9)} y={p.sy(-2) - 12} anchor="end" className="dg-text-muted">
        k = 0: misses
      </Label>
      <Label x={p.sx(0.2)} y={p.sy(7)} anchor="start" className="dg-text-accent">
        y = x² − 2x + 2
      </Label>
    </Svg>
  );
}
