/**
 * The circle x² + y² − 6x + 4y − 12 = 0, i.e. (x − 3)² + (y + 2)² = 25, on a square grid.
 * Centre (3, −2), radius 5. It cuts the y-axis at (0, 2) and (0, −6) and the x-axis at
 * x = 3 ± √21 (about −1.58 and 7.58).
 */
import { Label, Svg, MathLabel } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-circle-expanded';

const W = 470;
const H = 450;
const PAD = 28;
const X: [number, number] = [-3.4, 9.2];
const ySpan = ((H - 2 * PAD) / (W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-8.2, -8.2 + ySpan];

export default function CoordinateGeometryCircleExpanded() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const C = { x: p.sx(3), y: p.sy(-2) };
  const r = p.sx(5) - p.sx(0);
  const rx = 3 + Math.sqrt(21);
  const lx = 3 - Math.sqrt(21);
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[2, 4, 6, 8]} yTicks={[-8, -4, -2]} />
      <circle cx={C.x} cy={C.y} r={r} className="dg-accent" />
      <line x1={C.x} y1={C.y} x2={p.sx(3 + 3)} y2={p.sy(-2 - 4)} className="dg-line" />
      <circle cx={C.x} cy={C.y} r={5} className="dg-dot-accent" />
      <Label x={C.x + 8} y={C.y - 12} anchor="start" className="dg-text-accent">
        centre (3, −2)
      </Label>
      <Label x={p.sx(4.75)} y={p.sy(-3.6)} anchor="start" className="dg-text dg-bold">
        r = 5
      </Label>
      {[2, -6].map((y) => (
        <g key={y}>
          <circle cx={p.sx(0)} cy={p.sy(y)} r={5} className="dg-dot" />
          <Label x={p.sx(0) - 10} y={p.sy(y) + (y > 0 ? -8 : 2)} anchor="end" className="dg-text-small dg-bold">
            {`(0, ${y < 0 ? '−' : ''}${Math.abs(y)})`}
          </Label>
        </g>
      ))}
      {[lx, rx].map((x) => (
        <circle key={x} cx={p.sx(x)} cy={p.sy(0)} r={4.5} className="dg-dot" />
      ))}
      <MathLabel x={p.sx(lx) - 6} y={p.sy(0) - 12} anchor="end" w={106} h={30} size="small" tex={"3 - \\sqrt{21}"} />
      <MathLabel x={p.sx(rx) + 4} y={p.sy(0) - 12} anchor="start" w={106} h={30} size="small" tex={"3 + \\sqrt{21}"} />
      <Label x={p.sx(9.0)} y={p.sy(-7.6)} anchor="end" className="dg-text-small">
        {'x² + y² − 6x + 4y − 12 = 0'}
      </Label>
    </Svg>
  );
}
