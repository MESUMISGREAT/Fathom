/**
 * y = 2x² − 8x + 5 = 2(x − 2)² − 3, plotted to scale on an integer grid.
 * Marks the vertex (2, −3), the line of symmetry x = 2, the y-intercept (0, 5)
 * and the roots x = 2 ± √1.5 (≈ 0.78 and 3.22).
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

const W = 560;
const H = 400;
const X: [number, number] = [-1.5, 5.5];
const Y: [number, number] = [-4.5, 8.5];
const f = (x: number) => 2 * (x - 2) ** 2 - 3;
const r1 = 2 - Math.sqrt(1.5);
const r2 = 2 + Math.sqrt(1.5);

export default function QuadraticVertex() {
  const p = makePlot({ width: W, height: H, pad: 36, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-1, 1, 2, 3, 4, 5]} yTicks={[-4, -2, 2, 4]} yTicksRight={[6, 8]} />

      {/* line of symmetry */}
      <line x1={p.sx(2)} y1={p.sy(Y[0])} x2={p.sx(2)} y2={p.sy(Y[1])} className="dg-muted dg-dashed" />
      <Label x={p.sx(2) + 8} y={p.sy(8)} anchor="start" className="dg-text-muted">
        x = 2 (line of symmetry)
      </Label>

      <path d={graph(f, X, p, Y)} className="dg-accent" />

      {/* vertex */}
      <circle cx={p.sx(2)} cy={p.sy(-3)} r={5} className="dg-dot-accent" />
      <Label x={p.sx(2) + 12} y={p.sy(-3) + 16} anchor="start" className="dg-text-accent">
        vertex (2, −3): minimum point
      </Label>

      {/* y-intercept */}
      <circle cx={p.sx(0)} cy={p.sy(5)} r={4} className="dg-dot" />
      <Label x={p.sx(0) + 10} y={p.sy(5) - 3} anchor="start" className="dg-text">
        (0, 5)
      </Label>

      {/* roots */}
      <circle cx={p.sx(r1)} cy={p.sy(0)} r={4} className="dg-dot" />
      <circle cx={p.sx(r2)} cy={p.sy(0)} r={4} className="dg-dot" />
      <Label x={p.sx(r1) + 8} y={p.sy(0) - 13} anchor="start" className="dg-text-small">
        ≈ 0.78
      </Label>
      <Label x={p.sx(r2) - 8} y={p.sy(0) - 13} anchor="end" className="dg-text-small">
        ≈ 3.22
      </Label>

      {/* equation */}
      <Label x={p.sx(4.15)} y={p.sy(2.6)} anchor="start" className="dg-text">
        y = 2x² − 8x + 5
      </Label>
      <Label x={p.sx(4.15) + 13} y={p.sy(2.6) + 20} anchor="start" className="dg-text">
        = 2(x − 2)² − 3
      </Label>
    </Svg>
  );
}
