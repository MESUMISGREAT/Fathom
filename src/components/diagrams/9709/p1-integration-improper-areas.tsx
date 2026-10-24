/**
 * Two "improper" integrals that still have a value. Left: y = 1/x² with the region from x = 1
 * to the right edge shaded and an arrow saying it carries on for ever; its area is 1.
 * Right: y = 1/√x for 0 < x ≤ 1, shooting up beside the y-axis, region shaded; its area is 2.
 */
import { Arrow, Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, makePlot } from './kit';
import { regionPath } from './p1-integration-kit';

export const diagramKey = 'p1-integration-improper-areas';

const W = 640;
const H = 380;
const PW = 310;
const TOP = 64;

export default function P1IntegrationImproperAreas() {
  // left panel: y = 1/x², x from 1 to 6 shown
  const L = makePlot({ width: PW, height: H - TOP, pad: 30, x: [-0.5, 6.2], y: [-0.4, 2.6] });
  const f = (x: number) => 1 / (x * x);
  // right panel: y = 1/√x, x from 0 to 2.2 shown, region shaded from 0 to 1
  const R = makePlot({ width: PW, height: H - TOP, pad: 30, x: [-0.3, 2.2], y: [-0.6, 5.4] });
  const g = (x: number) => 1 / Math.sqrt(x);
  const gTop = 5.4;
  const x0 = 1 / (gTop * gTop); // where 1/√x leaves the top of the plot
  return (
    <Svg width={W} height={H}>
      <MathLabel x={PW / 2} y={30} w={PW - 10} h={52} size="large" tex="\int_1^{\infty} \dfrac{1}{x^2}\,dx = 1" />
      <MathLabel x={W - PW / 2} y={30} w={PW - 10} h={52} size="large" tex="\int_0^{1} \dfrac{1}{\sqrt{x}}\,dx = 2" />
      <line x1={W / 2} y1={56} x2={W / 2} y2={H - 12} className="dg-grid" />

      <g transform={`translate(0, ${TOP})`}>
        <path d={regionPath(L, f, () => 0, 1, 6.2)} className="dg-fill-accent" />
        <AxesXY p={L} xTicks={[1, 2, 3, 4, 5]} yTicks={[1, 2]} />
        <path d={graph(f, [0.62, 6.2], L, [-0.4, 2.6])} className="dg-accent" />
        <line x1={L.sx(1)} y1={L.sy(0)} x2={L.sx(1)} y2={L.sy(1)} className="dg-thin dg-dashed" />
        <Arrow x1={L.sx(3.4)} y1={L.sy(0.55)} x2={L.sx(5.9)} y2={L.sy(0.55)} className="dg-thin" head={8} />
        <Label x={L.sx(4.65)} y={L.sy(0.55) - 14} className="dg-text-small">
          carries on for ever
        </Label>
        <MathLabel x={L.sx(1.3)} y={L.sy(1.3)} anchor="start" w={140} h={44} tone="accent" tex="y = \dfrac{1}{x^2}" />
      </g>

      <g transform={`translate(${W - PW}, ${TOP})`}>
        <path d={regionPath(R, (x) => Math.min(g(x), gTop), () => 0, x0 / 4, 1)} className="dg-fill-accent" />
        <AxesXY p={R} xTicks={[1, 2]} yTicks={[1, 2, 3, 4, 5]} />
        <path d={graph(g, [x0, 2.2], R, [-0.6, gTop])} className="dg-accent" />
        <line x1={R.sx(1)} y1={R.sy(0)} x2={R.sx(1)} y2={R.sy(1)} className="dg-thin dg-dashed" />
        <Label x={R.sx(0.22)} y={R.sy(4.6)} anchor="start" className="dg-text-small">
          shoots up beside the y-axis
        </Label>
        <MathLabel x={R.sx(1.05)} y={R.sy(1.9)} anchor="start" w={120} h={50} tone="accent" tex="y = \dfrac{1}{\sqrt{x}}" />
      </g>
    </Svg>
  );
}
