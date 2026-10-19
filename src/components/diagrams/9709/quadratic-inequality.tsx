/**
 * y = x² − x − 6 = (x + 2)(x − 3), to scale. The arms where y > 0 are drawn in
 * the accent colour, the part where y < 0 in accent-2 with the region shaded.
 * Below, a sign diagram on the same x-scale: + for x < −2, − for −2 < x < 3,
 * + for x > 3, with open circles at the critical values.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

const W = 560;
const H = 470;
const X: [number, number] = [-4, 5];
const Y: [number, number] = [-7.5, 8.5];
const f = (x: number) => (x + 2) * (x - 3);

export default function QuadraticInequality() {
  // Graph occupies the top 370 px; the sign diagram sits below it.
  const p = makePlot({ width: W, height: 370, pad: 34, x: X, y: Y });
  const below = graph(f, [-2, 3], p, Y);
  const shade = `M${p.sx(-2)},${p.sy(0)} ${below.replace(/^M/, 'L')} L${p.sx(3)},${p.sy(0)} Z`;
  const lineY = 418;
  const left = p.sx(X[0]);
  const right = p.sx(X[1]);
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <path d={shade} className="dg-fill-accent-2" />
      <AxesXY p={p} xTicks={[-3, -1, 1, 2, 4]} yTicks={[-4, -2, 2, 4, 6, 8]} />
      <path d={graph(f, [X[0], -2], p, Y)} className="dg-accent" />
      <path d={below} className="dg-accent-2" />
      <path d={graph(f, [3, X[1]], p, Y)} className="dg-accent" />
      {[-2, 3].map((r) => (
        <circle key={r} cx={p.sx(r)} cy={p.sy(0)} r={5} className="dg-fill-surface dg-line" />
      ))}
      <Label x={p.sx(-2) - 8} y={p.sy(0) + 15} anchor="end" className="dg-text dg-bold">
        −2
      </Label>
      <Label x={p.sx(3) + 9} y={p.sy(0) + 15} anchor="start" className="dg-text dg-bold">
        3
      </Label>

      <Label x={p.sx(-3.1)} y={p.sy(3.2)} anchor="end" className="dg-text-accent">
        y &gt; 0
      </Label>
      <Label x={p.sx(4.1)} y={p.sy(3.2)} anchor="start" className="dg-text-accent">
        y &gt; 0
      </Label>
      <Label x={p.sx(0.5)} y={p.sy(-3.2)} className="dg-text-accent-2">
        y &lt; 0
      </Label>
      <Label x={p.sx(1.25)} y={p.sy(7.4)} anchor="start" className="dg-text">
        y = (x + 2)(x − 3)
      </Label>

      {/* sign diagram on the same x-scale */}
      <Label x={left} y={lineY - 34} anchor="start" className="dg-text-small">
        sign of y
      </Label>
      <line x1={left} y1={lineY} x2={p.sx(-2)} y2={lineY} className="dg-accent" />
      <line x1={p.sx(-2)} y1={lineY} x2={p.sx(3)} y2={lineY} className="dg-accent-2" />
      <line x1={p.sx(3)} y1={lineY} x2={right} y2={lineY} className="dg-accent" />
      {[-2, 3].map((r) => (
        <g key={r}>
          <line x1={p.sx(r)} y1={p.sy(0)} x2={p.sx(r)} y2={lineY} className="dg-muted dg-dashed" />
          <circle cx={p.sx(r)} cy={lineY} r={5} className="dg-fill-surface dg-line" />
        </g>
      ))}
      <Label x={(left + p.sx(-2)) / 2} y={lineY - 14} className="dg-text-accent">
        +
      </Label>
      <Label x={(p.sx(-2) + p.sx(3)) / 2} y={lineY - 14} className="dg-text-accent-2">
        −
      </Label>
      <Label x={(p.sx(3) + right) / 2} y={lineY - 14} className="dg-text-accent">
        +
      </Label>
      <Label x={(left + p.sx(-2)) / 2} y={lineY + 20} className="dg-text-small">
        x &lt; −2
      </Label>
      <Label x={(p.sx(-2) + p.sx(3)) / 2} y={lineY + 20} className="dg-text-small">
        −2 &lt; x &lt; 3
      </Label>
      <Label x={(p.sx(3) + right) / 2} y={lineY + 20} className="dg-text-small">
        x &gt; 3
      </Label>
    </Svg>
  );
}
