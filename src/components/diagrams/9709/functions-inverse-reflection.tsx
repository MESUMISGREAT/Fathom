/**
 * f(x) = (x − 1)² + 1 for x ≥ 1 and its inverse f⁻¹(x) = 1 + √(x − 1) for x ≥ 1,
 * drawn with equal scales so the reflection in y = x is true to life.
 * (3, 5) on f pairs with (5, 3) on f⁻¹; the segment joining them is cut at right
 * angles by y = x. The two graphs meet at (1, 1) and (2, 2), both on y = x.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'functions-inverse-reflection';

const W = 480;
const H = 480;
const X: [number, number] = [-0.9, 7.6];
const Y: [number, number] = [-0.9, 7.6];
const f = (x: number) => (x - 1) ** 2 + 1;
const finv = (x: number) => 1 + Math.sqrt(x - 1);

export default function FunctionsInverseReflection() {
  const p = makePlot({ width: W, height: H, pad: 30, x: X, y: Y });
  const m = { x: p.sx(6.15), y: p.sy(6.15) };
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[1, 2, 3, 4, 5, 6, 7]} yTicks={[1, 2, 3, 4, 5, 6, 7]} />
      <path d={graph((x) => x, [0.05, X[1]], p, Y)} className="dg-muted dg-dashed" />
      <g transform={`rotate(-45 ${m.x} ${m.y})`}>
        <Label x={m.x} y={m.y - 11} className="dg-text-muted">
          mirror line y = x
        </Label>
      </g>

      <path d={graph(f, [1, X[1]], p, Y)} className="dg-accent" />
      <path d={graph(finv, [1, X[1]], p, Y)} className="dg-accent-2" />

      {/* a pair of mirror-image points */}
      <line x1={p.sx(3)} y1={p.sy(5)} x2={p.sx(5)} y2={p.sy(3)} className="dg-thin dg-dashed" />
      <circle cx={p.sx(3)} cy={p.sy(5)} r={5} className="dg-dot-accent" />
      <circle cx={p.sx(5)} cy={p.sy(3)} r={5} className="dg-dot-accent-2" />
      <Label x={p.sx(3) - 10} y={p.sy(5)} anchor="end" className="dg-text">
        (3, 5)
      </Label>
      <Label x={p.sx(5) + 6} y={p.sy(3) + 18} anchor="start" className="dg-text">
        (5, 3)
      </Label>

      {/* where they meet */}
      <circle cx={p.sx(1)} cy={p.sy(1)} r={4.5} className="dg-dot" />
      <circle cx={p.sx(2)} cy={p.sy(2)} r={4.5} className="dg-dot" />
      <Label x={p.sx(0.9)} y={p.sy(1.3)} anchor="end" className="dg-text-small">
        (1, 1)
      </Label>
      <Label x={p.sx(1.85)} y={p.sy(2.35)} anchor="end" className="dg-text-small">
        (2, 2)
      </Label>

      <Label x={p.sx(3.25)} y={p.sy(7.05)} anchor="end" className="dg-text-accent">
        y = f(x)
      </Label>
      <Label x={p.sx(7.4)} y={p.sy(3.95)} anchor="end" className="dg-text-accent-2">
        {'y = f⁻¹(x)'}
      </Label>
    </Svg>
  );
}
