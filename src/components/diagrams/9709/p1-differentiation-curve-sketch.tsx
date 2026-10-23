/**
 * Sketch of y = x³ − 6x² + 9x = x(x − 3)². Stationary points: maximum (1, 4)
 * and minimum (3, 0), where the curve touches the x-axis (repeated root).
 * Crosses the axes at the origin. y → −∞ as x → −∞ and y → ∞ as x → ∞.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, makePlot } from './kit';

export const diagramKey = 'p1-differentiation-curve-sketch';

const W = 560;
const H = 400;
const X: [number, number] = [-0.9, 4.6];
const Y: [number, number] = [-3.2, 6.6];
const f = (x: number) => x * (x - 3) ** 2;

export default function P1DifferentiationCurveSketch() {
  const p = makePlot({ width: W, height: H, pad: 34, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      <AxesXY p={p} />
      {/* dashed guides to the maximum */}
      <line x1={p.sx(1)} y1={p.sy(0)} x2={p.sx(1)} y2={p.sy(4)} className="dg-grid dg-dashed" />
      <line x1={p.sx(0)} y1={p.sy(4)} x2={p.sx(1)} y2={p.sy(4)} className="dg-grid dg-dashed" />

      <path d={graph(f, X, p, Y)} className="dg-accent" />

      <circle cx={p.sx(1)} cy={p.sy(4)} r={5} className="dg-dot-accent-2" />
      <circle cx={p.sx(3)} cy={p.sy(0)} r={5} className="dg-dot-accent-2" />
      <circle cx={p.sx(0)} cy={p.sy(0)} r={4} className="dg-dot" />

      <Label x={p.sx(1)} y={p.sy(4) - 34} className="dg-text-accent-2">
        maximum (1, 4)
      </Label>
      <Label x={p.sx(1)} y={p.sy(4) - 15} className="dg-text-small">
        d²y/dx² = −6
      </Label>
      <Label x={p.sx(3)} y={p.sy(0) + 22} className="dg-text-accent-2">
        minimum (3, 0)
      </Label>
      <Label x={p.sx(3)} y={p.sy(0) + 41} className="dg-text-small">
        touches the x-axis: repeated root
      </Label>
      <Label x={p.sx(1)} y={p.sy(0) + 15} className="dg-text-small">
        1
      </Label>
      <Label x={p.sx(0) - 8} y={p.sy(4)} anchor="end" className="dg-text-small">
        4
      </Label>

      <Label x={p.sx(3.95)} y={p.sy(5.9)} anchor="end" className="dg-text">
        y = x(x − 3)²
      </Label>
      <Label x={p.sx(0.12)} y={p.sy(-2.5)} anchor="start" className="dg-text-muted">
        as x → −∞, y → −∞
      </Label>
    </Svg>
  );
}
