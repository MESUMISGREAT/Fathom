/**
 * Illustrative results for the falling-ball experiment, plotted to scale as
 * h against t². Six heights (0.200 to 1.200 m), each time the mean of
 * repeats:
 *   h / m : 0.200   0.400   0.600   0.800   1.000   1.200
 *   t / s : 0.203   0.285   0.351   0.403   0.453   0.494
 *   t²/s² : 0.0412  0.0812  0.1232  0.1624  0.2052  0.2440
 * Best-fit line through the origin: h = 4.90 t² (least squares through the
 * origin gives 4.901). Gradient triangle from (0.020, 0.098) to
 * (0.220, 1.078): 0.980 / 0.200 = 4.90 m s⁻², so g = 2 × 4.90 = 9.80 m s⁻².
 */
import { Label, Svg } from '../primitives';
import { MotionAxes, makePlot, poly } from './equations-motion-kit';

export const diagramKey = 'phys-equations-motion-g-graph';

const W = 600;
const H = 340;
const data: Array<[number, number]> = [
  [0.203 ** 2, 0.2],
  [0.285 ** 2, 0.4],
  [0.351 ** 2, 0.6],
  [0.403 ** 2, 0.8],
  [0.453 ** 2, 1.0],
  [0.494 ** 2, 1.2],
];
const GRAD = 4.9;

export function EquationsMotionGGraph() {
  const p = makePlot({ left: 70, top: 44, width: 320, height: 240, x: [0, 0.26], y: [0, 1.3] });
  const a: [number, number] = [0.02, GRAD * 0.02];
  const b: [number, number] = [0.22, GRAD * 0.22];
  return (
    <Svg width={W} height={H}>
      <MotionAxes
        p={p}
        xLabel="t² / s²"
        yLabel="h / m"
        xTicks={[0.05, 0.1, 0.15, 0.2]}
        yTicks={[0.2, 0.4, 0.6, 0.8, 1.0, 1.2]}
        fmtX={(n) => n.toFixed(2)}
        fmtY={(n) => n.toFixed(1)}
        grid
        xLabelBelow
      />
      {/* gradient triangle */}
      <path d={`M${p.sx(a[0])},${p.sy(a[1])} L${p.sx(b[0])},${p.sy(a[1])} L${p.sx(b[0])},${p.sy(b[1])}`} className="dg-accent-2 dg-dashed" />
      <Label x={p.sx(0.14)} y={p.sy(a[1]) - 13} className="dg-text-small dg-text-accent-2">
        Δ(t²) = 0.200 s²
      </Label>
      <Label x={p.sx(b[0]) + 8} y={p.sy(0.6)} anchor="start" className="dg-text-small dg-text-accent-2">
        Δh =
      </Label>
      <Label x={p.sx(b[0]) + 8} y={p.sy(0.6) + 16} anchor="start" className="dg-text-small dg-text-accent-2">
        0.980 m
      </Label>
      {/* best-fit line */}
      <path d={poly(p, [[0, 0], [0.258, GRAD * 0.258]])} className="dg-accent" />
      {/* data points as crosses */}
      {data.map(([x, y]) => (
        <g key={x}>
          <line x1={p.sx(x) - 4} y1={p.sy(y) - 4} x2={p.sx(x) + 4} y2={p.sy(y) + 4} className="dg-line" />
          <line x1={p.sx(x) - 4} y1={p.sy(y) + 4} x2={p.sx(x) + 4} y2={p.sy(y) - 4} className="dg-line" />
        </g>
      ))}
      <Label x={p.sx(0.05)} y={p.sy(1.12)} anchor="start" className="dg-text-small dg-text-accent">
        best-fit line through the origin
      </Label>

      {/* working panel */}
      <rect x={426} y={70} width={166} height={180} rx={10} className="dg-fill-muted" />
      <Label x={438} y={94} anchor="start" className="dg-text-small dg-bold">
        From rest: h = ½gt²
      </Label>
      <Label x={438} y={118} anchor="start" className="dg-text-small">
        so gradient = g / 2
      </Label>
      <Label x={438} y={150} anchor="start" className="dg-text-small">
        gradient = 0.980 / 0.200
      </Label>
      <Label x={438} y={168} anchor="start" className="dg-text-small">
        = 4.90 m s⁻²
      </Label>
      <Label x={438} y={200} anchor="start" className="dg-text-small">
        g = 2 × gradient
      </Label>
      <Label x={438} y={222} anchor="start" className="dg-text dg-bold">
        = 9.80 m s⁻²
      </Label>
    </Svg>
  );
}

export default EquationsMotionGGraph;
