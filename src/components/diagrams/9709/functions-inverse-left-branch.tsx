/**
 * Why the inverse of f(x) = (x + 2)² − 5 for x ≤ −2 takes the NEGATIVE square root.
 * f is the left half of the parabola, from its vertex (−2, −5) upwards to the left.
 * f⁻¹(x) = −2 − √(x + 5) for x ≥ −5 is its reflection in y = x, starting at (−5, −2).
 * The domain of f (x ≤ −2, band on the x-axis) becomes the range of f⁻¹ (y ≤ −2, band
 * on the y-axis), and −2 − √(…) is never above −2. Equal scales; (−4, −1) on f pairs
 * with (−1, −4) on f⁻¹. The graphs meet once, on y = x, at x = (−3 − √13)/2 ≈ −3.30.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'functions-inverse-left-branch';

const W = 480;
const H = 480;
const X: [number, number] = [-7.6, 2.4];
const Y: [number, number] = [-7.6, 2.4];
const f = (x: number) => (x + 2) ** 2 - 5;
const finv = (x: number) => -2 - Math.sqrt(x + 5);

export default function FunctionsInverseLeftBranch() {
  const p = makePlot({ width: W, height: H, pad: 30, x: X, y: Y });
  const x0 = p.sx(0);
  const y0 = p.sy(0);
  const m = { x: p.sx(1.35), y: p.sy(1.35) };
  const meet = (-3 - Math.sqrt(13)) / 2;
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      {/* domain of f on the x-axis, range of f⁻¹ on the y-axis: both "≤ −2" */}
      <rect x={p.sx(X[0])} y={y0 - 5} width={p.sx(-2) - p.sx(X[0])} height={10} className="dg-fill-accent" />
      <rect x={x0 - 5} y={p.sy(-2)} width={10} height={p.sy(Y[0]) - p.sy(-2)} className="dg-fill-accent-2" />
      <path d={graph((x) => x, [X[0], X[1] - 0.05], p, Y)} className="dg-muted dg-dashed" />
      {/* keep the origin's "O" readable where the mirror line passes through it */}
      <rect x={x0 - 16} y={y0 + 6} width={14} height={15} className="dg-fill-surface" />
      <AxesXY p={p} xTicks={[-6, -2]} yTicks={[-6, 2]} yTicksRight={[-4, -2]} />
      <g transform={`rotate(-45 ${m.x} ${m.y})`}>
        <Label x={m.x} y={m.y - 11} className="dg-text-muted">
          y = x
        </Label>
      </g>

      <path d={graph(f, [X[0], -2], p, Y)} className="dg-accent" />
      <path d={graph(finv, [-5, X[1]], p, Y)} className="dg-accent-2" />

      {/* a pair of mirror-image points */}
      <line x1={p.sx(-4)} y1={p.sy(-1)} x2={p.sx(-1)} y2={p.sy(-4)} className="dg-thin dg-dashed" />
      <circle cx={p.sx(-4)} cy={p.sy(-1)} r={4.5} className="dg-dot-accent" />
      <circle cx={p.sx(-1)} cy={p.sy(-4)} r={4.5} className="dg-dot-accent-2" />
      <Label x={p.sx(-4) + 10} y={p.sy(-1) - 2} anchor="start" className="dg-text-small">
        (−4, −1)
      </Label>
      <Label x={p.sx(-1) - 2} y={p.sy(-4) + 18} anchor="end" className="dg-text-small">
        (−1, −4)
      </Label>

      {/* end points */}
      <circle cx={p.sx(-2)} cy={p.sy(-5)} r={4.5} className="dg-dot-accent" />
      <circle cx={p.sx(-5)} cy={p.sy(-2)} r={4.5} className="dg-dot-accent-2" />
      <Label x={p.sx(-2) + 9} y={p.sy(-5) + 4} anchor="start" className="dg-text-small">
        (−2, −5)
      </Label>
      <Label x={p.sx(-5) - 8} y={p.sy(-2) - 12} anchor="end" className="dg-text-small">
        (−5, −2)
      </Label>
      <circle cx={p.sx(meet)} cy={p.sy(meet)} r={3.5} className="dg-dot" />

      <Label x={p.sx(-4.35)} y={p.sy(1.75)} anchor="start" className="dg-text-accent">
        {'y = f(x), x ≤ −2'}
      </Label>
      <Label x={p.sx(2.3)} y={p.sy(-5.45)} anchor="end" className="dg-text-accent-2">
        {'y = f⁻¹(x)'}
      </Label>
      <Label x={p.sx(-7.4)} y={y0 + 32} anchor="start" className="dg-text-accent">
        {'domain of f: x ≤ −2'}
      </Label>
      <Label x={x0 - 10} y={p.sy(-6.9)} anchor="end" className="dg-text-accent-2">
        {'range of f⁻¹: y ≤ −2'}
      </Label>
    </Svg>
  );
}
