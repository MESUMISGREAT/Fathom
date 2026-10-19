/**
 * f(x) = x² − 4x + 1 = (x − 2)² − 3 for 0 ≤ x ≤ 5. The vertex (2, −3) lies
 * inside the domain, so the least value is −3, not f(0) = 1. The greatest
 * value is at the far end, f(5) = 6. Range −3 ≤ f(x) ≤ 6, shaded on the
 * y-axis. The parabola outside the domain is dashed.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'functions-quadratic-range';

const W = 540;
const H = 400;
const X: [number, number] = [-1.6, 6.6];
const Y: [number, number] = [-4.6, 8.4];
const f = (x: number) => x * x - 4 * x + 1;

export default function FunctionsQuadraticRange() {
  const p = makePlot({ width: W, height: H, pad: 30, x: X, y: Y });
  const x0 = p.sx(0);
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <rect x={x0 - 6} y={p.sy(6)} width={12} height={p.sy(-3) - p.sy(6)} className="dg-fill-accent-2" />
      <AxesXY p={p} xTicks={[-1, 1, 2, 3, 4, 5, 6]} yTicks={[-4, -2, 2, 4, 8]} />

      <path d={graph(f, [X[0], 0], p, Y)} className="dg-muted dg-dashed" />
      <path d={graph(f, [5, X[1]], p, Y)} className="dg-muted dg-dashed" />
      <path d={graph(f, [0, 5], p, Y)} className="dg-accent" />

      <line x1={x0} y1={p.sy(6)} x2={p.sx(5)} y2={p.sy(6)} className="dg-muted dg-dashed" />
      <line x1={x0} y1={p.sy(-3)} x2={p.sx(2)} y2={p.sy(-3)} className="dg-muted dg-dashed" />
      <line x1={x0 - 6} y1={p.sy(6)} x2={x0 + 6} y2={p.sy(6)} className="dg-accent-2" />
      <line x1={x0 - 6} y1={p.sy(-3)} x2={x0 + 6} y2={p.sy(-3)} className="dg-accent-2" />

      <circle cx={p.sx(0)} cy={p.sy(1)} r={5} className="dg-dot-accent" />
      <circle cx={p.sx(5)} cy={p.sy(6)} r={5} className="dg-dot-accent" />
      <circle cx={p.sx(2)} cy={p.sy(-3)} r={5} className="dg-dot-accent-2" />

      <Label x={p.sx(0) + 10} y={p.sy(1) + 2} anchor="start" className="dg-text-small">
        (0, 1)
      </Label>
      <Label x={p.sx(5) + 10} y={p.sy(6) + 14} anchor="start" className="dg-text-small">
        (5, 6)
      </Label>
      <Label x={p.sx(2)} y={p.sy(-3) + 17} className="dg-text-accent-2">
        vertex (2, −3)
      </Label>
      <Label x={x0 - 10} y={p.sy(6)} anchor="end" className="dg-text-small">
        6
      </Label>
      <Label x={x0 - 10} y={p.sy(-3)} anchor="end" className="dg-text-small">
        −3
      </Label>
      <Label x={x0 + 14} y={p.sy(7.5)} anchor="start" className="dg-text-accent-2">
        {'range: −3 ≤ f(x) ≤ 6'}
      </Label>
      <Label x={p.sx(0.45)} y={p.sy(4.5)} anchor="start" className="dg-text-accent">
        {'y = (x − 2)² − 3, 0 ≤ x ≤ 5'}
      </Label>
      <Label x={p.sx(6.4)} y={p.sy(-1.4)} anchor="end" className="dg-text-muted">
        dashed: outside the domain
      </Label>
    </Svg>
  );
}
