/**
 * A(1, 1) and B(4, 5) on a square grid (equal scales). The right-angled triangle
 * A → C(4, 1) → B has legs x₂ − x₁ = 3 and y₂ − y₁ = 4, so AB = √(3² + 4²) = 5 and
 * the gradient is 4/3. The midpoint M(2.5, 3) averages the coordinates.
 */
import { Label, Svg } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-distance-triangle';

const W = 470;
const H = 440;
const PAD = 30;
const X: [number, number] = [-0.8, 7.2];
// Equal scales: (W − 2·PAD)/xSpan = (H − 2·PAD)/ySpan
const ySpan = ((H - 2 * PAD) / (W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-0.8, -0.8 + ySpan];

export default function CoordinateGeometryDistanceTriangle() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const A = { x: p.sx(1), y: p.sy(1) };
  const B = { x: p.sx(4), y: p.sy(5) };
  const C = { x: p.sx(4), y: p.sy(1) };
  const M = { x: p.sx(2.5), y: p.sy(3) };
  const s = 12;
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[1, 2, 3, 4, 5, 6]} yTicks={[1, 2, 3, 4, 5, 6]} />
      <polygon points={`${A.x},${A.y} ${C.x},${C.y} ${B.x},${B.y}`} className="dg-fill-accent-2" />
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} className="dg-accent-2" />
      <line x1={C.x} y1={C.y} x2={B.x} y2={B.y} className="dg-accent-2" />
      <path d={`M${C.x - s},${C.y} L${C.x - s},${C.y - s} L${C.x},${C.y - s}`} className="dg-thin" />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="dg-accent" />

      <circle cx={A.x} cy={A.y} r={5} className="dg-dot" />
      <circle cx={B.x} cy={B.y} r={5} className="dg-dot" />
      <circle cx={M.x} cy={M.y} r={5} className="dg-dot-accent" />

      <Label x={A.x - 10} y={A.y - 14} anchor="end" className="dg-text dg-bold">
        A(1, 1)
      </Label>
      <Label x={B.x + 10} y={B.y - 10} anchor="start" className="dg-text dg-bold">
        B(4, 5)
      </Label>
      <Label x={M.x - 12} y={M.y - 4} anchor="end" className="dg-text-accent">
        M(2.5, 3)
      </Label>
      <Label x={(A.x + C.x) / 2} y={A.y + 18} className="dg-text-accent-2">
        x₂ − x₁ = 3
      </Label>
      <Label x={C.x + 10} y={(C.y + B.y) / 2} anchor="start" className="dg-text-accent-2">
        y₂ − y₁ = 4
      </Label>
      <Label x={p.sx(4.3)} y={p.sy(6.35)} anchor="start" className="dg-text">
        {'AB = √(3² + 4²) = 5'}
      </Label>
      <Label x={p.sx(4.3)} y={p.sy(5.85)} anchor="start" className="dg-text">
        gradient = 4/3
      </Label>
    </Svg>
  );
}
