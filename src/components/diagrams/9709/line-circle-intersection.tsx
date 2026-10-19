/**
 * The circle x² + y² = 10 and the line y = 2x − 5, drawn with equal scales on
 * both axes so the circle is round. They meet at (1, −3) and (3, 1).
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'line-circle-intersection';

const W = 520;
const H = 400;
const PAD = 32;
// Equal scale: (W − 2·PAD) / xSpan = (H − 2·PAD) / ySpan.
const Y: [number, number] = [-4.5, 4.5];
const halfX = ((W - 2 * PAD) / (H - 2 * PAD)) * ((Y[1] - Y[0]) / 2);
const X: [number, number] = [-halfX, halfX];
const R = Math.sqrt(10);

export default function LineCircleIntersection() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const r = p.sx(R) - p.sx(0);
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-5, -4, -2, -1, 1, 2, 4, 5]} yTicks={[-4, -2, -1, 1, 2, 4]} />
      <circle cx={p.sx(0)} cy={p.sy(0)} r={r} className="dg-accent" />
      <path d={graph((x) => 2 * x - 5, X, p, Y)} className="dg-accent-2" />
      <circle cx={p.sx(1)} cy={p.sy(-3)} r={5} className="dg-dot" />
      <circle cx={p.sx(3)} cy={p.sy(1)} r={5} className="dg-dot" />
      <Label x={p.sx(1) + 12} y={p.sy(-3) + 6} anchor="start" className="dg-text dg-bold">
        (1, −3)
      </Label>
      <Label x={p.sx(3) + 12} y={p.sy(1) + 10} anchor="start" className="dg-text dg-bold">
        (3, 1)
      </Label>
      <Label x={p.sx(-2.45)} y={p.sy(2.75)} anchor="end" className="dg-text-accent">
        x² + y² = 10
      </Label>
      <Label x={p.sx(4.55) + 8} y={p.sy(3.9)} anchor="start" className="dg-text-accent-2">
        y = 2x − 5
      </Label>
    </Svg>
  );
}
