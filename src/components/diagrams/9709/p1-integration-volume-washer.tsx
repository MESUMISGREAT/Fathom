/**
 * A volume with a hole: the region between y = 5 − x² and the line y = 1 (shaded, x from −2 to 2)
 * spun about the x-axis. Its mirror image below the axis is dashed. The slice at x = 1 is a
 * washer: outer radius R = 5 − x² = 4 and inner radius r = 1, with the hole left unshaded.
 * Bottom: V = π∫(R² − r²) dx.
 */
import { Arrow, Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, makePlot } from './kit';
import { ellipsePath, regionPath } from './p1-integration-kit';

export const diagramKey = 'p1-integration-volume-washer';

const UX = 60;
const UY = 40;
const X: [number, number] = [-2.9, 3.3];
const Y: [number, number] = [-5.5, 5.7];
const PAD = 30;
const W = 6.2 * UX + 2 * PAD;
const PH = 11.2 * UY + 2 * PAD;
const H = PH + 64;
const f = (x: number) => 5 - x * x;
const PERSP = 0.2;

export default function P1IntegrationVolumeWasher() {
  const p = makePlot({ width: W, height: PH, pad: PAD, x: X, y: Y });
  const xs = 1;
  const cx = p.sx(xs);
  const y0 = p.sy(0);
  const R = f(xs) * UY;
  const r = 1 * UY;
  return (
    <Svg width={W} height={H}>
      <path d={regionPath(p, f, () => 1, -2, 2)} className="dg-fill-accent" />
      {/* no tick at 5: the curve's vertex sits on it */}
      <AxesXY p={p} xTicks={[-2, -1, 2]} yTicks={[-4, 4]} />
      {/* mirror image below the axis */}
      <path d={graph((x) => -f(x), [-2, 2], p, Y)} className="dg-muted dg-dashed" />
      <line x1={p.sx(-2)} y1={p.sy(-1)} x2={p.sx(2)} y2={p.sy(-1)} className="dg-muted dg-dashed" />
      {/* the two graphs */}
      <path d={graph(f, [-2.45, 2.45], p, Y)} className="dg-accent" />
      <line x1={p.sx(-2.9)} y1={p.sy(1)} x2={p.sx(3.3)} y2={p.sy(1)} className="dg-line" />

      {/* washer at x = 1: outer and inner circles seen at an angle, hole unshaded */}
      <path
        d={`${ellipsePath(cx, y0, R * PERSP, R)} ${ellipsePath(cx, y0, r * PERSP, r)}`}
        fillRule="evenodd"
        className="dg-accent-2 dg-fill-accent-2"
      />
      <Arrow x1={cx} y1={y0} x2={cx} y2={y0 - R + 3} className="dg-line" head={8} />
      <Arrow x1={cx} y1={y0} x2={cx} y2={y0 - r + 2} className="dg-line" head={7} />
      <MathLabel x={cx + R * PERSP + 6} y={p.sy(3.1)} anchor="start" w={150} h={34} tex="R = 5 - x^2" />
      <line x1={cx + 4} y1={p.sy(0.5)} x2={p.sx(2.28)} y2={p.sy(0.5)} className="dg-thin" />
      <MathLabel x={p.sx(2.32)} y={p.sy(0.5)} anchor="start" w={70} h={34} tex="r = 1" />

      <MathLabel x={p.sx(-2.8)} y={p.sy(5.2)} anchor="start" w={130} h={34} tone="accent" tex="y = 5 - x^2" />
      <Label x={p.sx(3.25)} y={p.sy(1) - 12} anchor="end" className="dg-text">
        y = 1
      </Label>

      <line x1={16} y1={PH + 2} x2={W - 16} y2={PH + 2} className="dg-grid" />
      <MathLabel x={W / 2} y={PH + 34} w={W - 20} h={50} size="large" tex="V = \pi\int_{-2}^{2} \big(R^2 - r^2\big)\,dx" />
    </Svg>
  );
}
