/**
 * Area between a curve and a line: y = x² − 4x + 5 and y = x + 1 on equal-scale axes, meeting at
 * A(1, 2) and B(4, 5). The region between them is shaded. A double arrow at x = 3 runs from the
 * curve (bottom) up to the line (top), labelled top − bottom. Key, bottom right: top is the line,
 * bottom is the curve.
 */
import { Arrow, Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';
import { regionPath } from './p1-integration-kit';

export const diagramKey = 'p1-integration-area-between';

// 56 px per unit on both axes.
const X: [number, number] = [-0.6, 7.2];
const Y: [number, number] = [-0.6, 7.4];
const PAD = 30;
const W = 7.8 * 56 + 2 * PAD;
const H = 8 * 56 + 2 * PAD;
const curve = (x: number) => x * x - 4 * x + 5;
const line = (x: number) => x + 1;

export default function P1IntegrationAreaBetween() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <path d={regionPath(p, line, curve, 1, 4)} className="dg-fill-accent" />
      <AxesXY p={p} xTicks={[1, 2, 3, 4, 5]} yTicks={[1, 2, 3, 4, 5, 6, 7]} />
      {/* start just left of the y-axis so the curve doesn't run through the tick labels 6 and 7 */}
      <path d={graph(curve, [-0.17, X[1]], p, Y)} className="dg-line" />
      <path d={graph(line, [-0.6, 6.4], p, Y)} className="dg-accent-2" />

      <Arrow x1={p.sx(3)} y1={p.sy(curve(3))} x2={p.sx(3)} y2={p.sy(line(3))} className="dg-thin" head={7} double />
      <Label x={p.sx(2.9)} y={p.sy(2.4)} anchor="end" className="dg-text-small">
        top − bottom
      </Label>

      <circle cx={p.sx(1)} cy={p.sy(2)} r={4.5} className="dg-dot" />
      <circle cx={p.sx(4)} cy={p.sy(5)} r={4.5} className="dg-dot" />
      <Label x={p.sx(1) - 10} y={p.sy(2) - 14} anchor="end" className="dg-text dg-bold">
        A(1, 2)
      </Label>
      <Label x={p.sx(4) + 12} y={p.sy(5) + 12} anchor="start" className="dg-text dg-bold">
        B(4, 5)
      </Label>

      <Label x={p.sx(4.3)} y={p.sy(1.6)} anchor="start" className="dg-text-accent-2">
        top: y = x + 1
      </Label>
      <Label x={p.sx(4.3)} y={p.sy(0.9)} anchor="start" className="dg-text">
        bottom: y = x² − 4x + 5
      </Label>
    </Svg>
  );
}
