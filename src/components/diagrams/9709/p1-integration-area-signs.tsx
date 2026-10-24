/**
 * Why areas below the x-axis need care: y = x² − 2x = x(x − 2) on equal-scale axes. The region
 * from x = 0 to 2 lies below the axis (integral −4/3, shaded in the second colour); the region
 * from x = 2 to 3 lies above (integral +4/3). The integral from 0 to 3 adds them to 0, but the
 * total shaded area is 8/3.
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';
import { regionPath } from './p1-integration-kit';

export const diagramKey = 'p1-integration-area-signs';

// 80 px per unit on both axes.
const X: [number, number] = [-0.8, 3.8];
const Y: [number, number] = [-1.6, 3.4];
const PAD = 30;
const W = 4.6 * 80 + 2 * PAD;
const PH = 5 * 80 + 2 * PAD;
const H = PH + 66;
const f = (x: number) => x * x - 2 * x;

export default function P1IntegrationAreaSigns() {
  const p = makePlot({ width: W, height: PH, pad: PAD, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <path d={regionPath(p, () => 0, f, 0, 2)} className="dg-fill-accent-2" />
      <path d={regionPath(p, f, () => 0, 2, 3)} className="dg-fill-accent" />
      <AxesXY p={p} xTicks={[1, 2, 3]} yTicks={[-1, 1, 2, 3]} />
      <line x1={p.sx(3)} y1={p.sy(0)} x2={p.sx(3)} y2={p.sy(3)} className="dg-thin dg-dashed" />
      <path d={graph(f, X, p, Y)} className="dg-line" />

      <MathLabel x={p.sx(1)} y={p.sy(-0.56)} w={80} h={46} tone="accent-2" tex="-\dfrac{4}{3}" />
      <Label x={p.sx(1)} y={p.sy(-1.25)} className="dg-text-small">
        below the axis
      </Label>
      <MathLabel x={p.sx(2.74)} y={p.sy(0.5)} w={60} h={46} size="large" tone="accent" tex="+\dfrac{4}{3}" />
      <Label x={p.sx(3.08)} y={p.sy(1.5)} anchor="start" className="dg-text-small">
        above
      </Label>
      <Label x={p.sx(3.14)} y={p.sy(3.15)} anchor="start" className="dg-text">
        y = x² − 2x
      </Label>

      <line x1={16} y1={PH + 4} x2={W - 16} y2={PH + 4} className="dg-grid" />
      <MathLabel
        x={W / 2}
        y={PH + 36}
        w={W - 20}
        h={52}
        tex="\int_0^3 (x^2 - 2x)\,dx = -\dfrac43 + \dfrac43 = 0, \text{ but the area is } \dfrac43 + \dfrac43 = \dfrac83"
      />
    </Svg>
  );
}
