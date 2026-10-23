/**
 * f(x) = 1/x for x ≥ 1. The curve starts at the closed point (1, 1) and falls
 * towards the x-axis without reaching it, so the outputs fill 0 < f(x) ≤ 1,
 * shown as a shaded band on the y-axis (open at 0, closed at 1). The part of
 * y = 1/x for 0 < x < 1 is outside the domain and drawn dashed.
 */
import { Label, Svg, graph, MathLabel } from '../primitives';
import { AxesXY, makePlot } from './kit';

export const diagramKey = 'functions-reciprocal-range';

const W = 540;
const H = 320;
const X: [number, number] = [-0.9, 7.6];
const Y: [number, number] = [-0.32, 1.75];
const f = (x: number) => 1 / x;

export default function FunctionsReciprocalRange() {
  const p = makePlot({ width: W, height: H, pad: 30, x: X, y: Y });
  const x0 = p.sx(0);
  return (
    <Svg width={W} height={H}>
      {[0.5, 1, 1.5].map((y) => (
        <line key={y} x1={p.sx(X[0])} y1={p.sy(y)} x2={p.sx(X[1])} y2={p.sy(y)} className="dg-grid" />
      ))}
      {[1, 2, 3, 4, 5, 6, 7].map((x) => (
        <line key={x} x1={p.sx(x)} y1={p.sy(Y[0])} x2={p.sx(x)} y2={p.sy(Y[1])} className="dg-grid" />
      ))}
      {/* range band on the y-axis */}
      <rect x={x0 - 6} y={p.sy(1)} width={12} height={p.sy(0) - p.sy(1)} className="dg-fill-accent-2" />
      <AxesXY p={p} xTicks={[1, 2, 3, 4, 5, 6, 7]} yTicks={[0.5, 1, 1.5]} />
      <line x1={x0 - 6} y1={p.sy(1)} x2={x0 + 6} y2={p.sy(1)} className="dg-accent-2" />

      {/* outside the domain */}
      <path d={graph(f, [0.57, 1], p, Y)} className="dg-muted dg-dashed" />
      {/* the function */}
      <path d={graph(f, [1, X[1]], p, Y)} className="dg-accent" />
      <line x1={x0} y1={p.sy(1)} x2={p.sx(1)} y2={p.sy(1)} className="dg-muted dg-dashed" />
      <circle cx={p.sx(1)} cy={p.sy(1)} r={5} className="dg-dot-accent" />
      <circle cx={x0} cy={p.sy(1)} r={4.5} className="dg-dot-accent-2" />
      <circle cx={x0} cy={p.sy(0)} r={4.5} className="dg-accent-2 dg-fill-surface" />

      <Label x={p.sx(1) + 10} y={p.sy(1) - 14} anchor="start" className="dg-text">
        (1, 1)
      </Label>
      <MathLabel x={p.sx(3.1)} y={p.sy(0.62)} anchor="start" w={239} h={46} tone="accent" tex={"y = \\dfrac{1}{x},\\ \\text{domain } x \\ge 1"} />
      <Label x={p.sx(7.4)} y={p.sy(0.4)} anchor="end" className="dg-text-muted">
        gets close to 0, never reaches it
      </Label>
      <Label x={x0 + 14} y={p.sy(0.22)} anchor="start" className="dg-text-accent-2">
        {'range: 0 < f(x) ≤ 1'}
      </Label>
      <Label x={p.sx(0.92)} y={p.sy(1.5)} anchor="start" className="dg-text-muted">
        dashed: not in the domain
      </Label>
    </Svg>
  );
}
