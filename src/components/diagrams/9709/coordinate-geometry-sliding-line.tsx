/**
 * The curve y = x² − 3x + 6 and three parallel lines y = x + k.
 * Substituting gives x² − 4x + (6 − k) = 0 with discriminant 4k − 8.
 * k = 4: two intersection points, at x = 2 ± √2. k = 2: a tangent, touching at (2, 4).
 * k = 0: the line y = x misses the curve. To scale.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-sliding-line';

const W = 520;
const H = 460;
const X: [number, number] = [-1.4, 5.4];
const Y: [number, number] = [-1.4, 10.4];
const curve = (x: number) => x * x - 3 * x + 6;

export default function CoordinateGeometrySlidingLine() {
  const p = makePlot({ width: W, height: H, pad: 30, x: X, y: Y });
  const s = Math.SQRT2;
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-1, 1, 2, 3, 4, 5]} yTicks={[2, 4, 6, 8, 10]} />
      <path d={graph((x) => x + 4, X, p, Y)} className="dg-line" />
      <path d={graph((x) => x + 2, X, p, Y)} className="dg-accent-2" />
      <path d={graph((x) => x, X, p, Y)} className="dg-muted dg-dashed" />
      <path d={graph(curve, X, p, Y)} className="dg-accent" />

      <circle cx={p.sx(2 - s)} cy={p.sy(6 - s)} r={5} className="dg-dot" />
      <circle cx={p.sx(2 + s)} cy={p.sy(6 + s)} r={5} className="dg-dot" />
      <circle cx={p.sx(2)} cy={p.sy(4)} r={5.5} className="dg-dot-accent-2" />
      <Label x={p.sx(2) + 4} y={p.sy(4) + 20} anchor="start" className="dg-text-accent-2">
        (2, 4)
      </Label>

      <Label x={p.sx(5.3)} y={p.sy(8.3)} anchor="end" className="dg-text dg-bold">
        k = 4
      </Label>
      <Label x={p.sx(5.3)} y={p.sy(6.3)} anchor="end" className="dg-text-accent-2">
        k = 2
      </Label>
      <Label x={p.sx(5.3)} y={p.sy(4.3)} anchor="end" className="dg-text-muted">
        k = 0
      </Label>
      <Label x={p.sx(3.65)} y={p.sy(9.6)} anchor="end" className="dg-text-accent">
        y = x² − 3x + 6
      </Label>
      <Label x={p.sx(5.3)} y={p.sy(2.05)} anchor="end" className="dg-text-small dg-bold">
        lines y = x + k
      </Label>
      <Label x={p.sx(5.3)} y={p.sy(1.5)} anchor="end" className="dg-text-small">
        {'k = 4: crosses twice (b² − 4ac > 0)'}
      </Label>
      <Label x={p.sx(5.3)} y={p.sy(1.0)} anchor="end" className="dg-text-small">
        k = 2: tangent at (2, 4) (b² − 4ac = 0)
      </Label>
      <Label x={p.sx(5.3)} y={p.sy(0.5)} anchor="end" className="dg-text-small">
        {'k = 0: misses (b² − 4ac < 0)'}
      </Label>
    </Svg>
  );
}
