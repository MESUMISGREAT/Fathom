/**
 * Volume of revolution as a stack of discs: the region under y = √x from x = 0 to x = 4 (shaded)
 * spun about the x-axis. The solid's outline is the curve and its mirror image y = −√x, with an
 * elliptical end face at x = 4. One thin disc at x = 2.25 has radius y = 1.5 and a small
 * thickness, so its volume is about πy² × thickness; adding them all gives V = π∫y² dx.
 */
import { Arrow, Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, makePlot } from './kit';
import { ellipsePath, regionPath } from './p1-integration-kit';

export const diagramKey = 'p1-integration-volume-disc';

// 80 px per unit on both axes.
const U = 80;
const X: [number, number] = [-0.5, 5.3];
const Y: [number, number] = [-2.5, 2.7];
const PAD = 30;
const W = 5.8 * U + 2 * PAD;
const PH = 5.2 * U + 2 * PAD;
const H = PH + 64;
const f = (x: number) => Math.sqrt(x);
const PERSP = 0.22; // ellipse width ÷ height, for the "seen at an angle" circles

export default function P1IntegrationVolumeDisc() {
  const p = makePlot({ width: W, height: PH, pad: PAD, x: X, y: Y });
  const xs = 2.25;
  const dx = 0.32;
  const ry = f(xs) * U;
  const rx = ry * PERSP;
  const x1 = p.sx(xs);
  const x2 = p.sx(xs + dx);
  const y0 = p.sy(0);
  const endR = f(4) * U;
  return (
    <Svg width={W} height={H}>
      <path d={regionPath(p, f, () => 0, 0, 4)} className="dg-fill-accent" />
      <AxesXY p={p} xTicks={[1, 2, 3, 4]} yTicks={[-2, -1, 1, 2]} />
      {/* solid outline: curve, mirror image and end face */}
      <path d={graph((x) => -f(x), [0, 4], p, Y)} className="dg-muted dg-dashed" />
      <path d={ellipsePath(p.sx(4), y0, endR * PERSP, endR)} className="dg-muted" />
      <path d={graph(f, [0, 4], p, Y)} className="dg-accent" />

      {/* one disc */}
      <path d={ellipsePath(x1, y0, rx, ry)} className="dg-accent-2 dg-fill-accent-2" />
      <rect x={x1} y={y0 - ry} width={x2 - x1} height={2 * ry} className="dg-fill-accent-2" />
      <line x1={x1} y1={y0 - ry} x2={x2} y2={y0 - ry} className="dg-accent-2" />
      <line x1={x1} y1={y0 + ry} x2={x2} y2={y0 + ry} className="dg-accent-2" />
      <path d={ellipsePath(x2, y0, rx, ry)} className="dg-accent-2 dg-fill-accent-2" />

      <Arrow x1={x2} y1={y0} x2={x2} y2={y0 - ry + 3} className="dg-line" head={8} />
      <Label x={x2 + 8} y={p.sy(0.75)} anchor="start" className="dg-text dg-bold">
        radius y
      </Label>
      <Arrow x1={x1 - 8} y1={y0 - ry - 18} x2={x2 + 8} y2={y0 - ry - 18} className="dg-thin" head={6} double />
      <Label x={(x1 + x2) / 2} y={y0 - ry - 34} className="dg-text dg-bold">
        thickness
      </Label>
      <MathLabel x={p.sx(3.2)} y={p.sy(2.35)} anchor="start" w={110} h={36} tone="accent" tex="y = \sqrt{x}" />

      <line x1={16} y1={PH + 2} x2={W - 16} y2={PH + 2} className="dg-grid" />
      <MathLabel
        x={W / 2}
        y={PH + 34}
        w={W - 20}
        h={50}
        size="large"
        tex="\text{one disc} \approx \pi y^2 \times \text{thickness} \quad\Longrightarrow\quad V = \pi\int_a^b y^2\,dx"
      />
    </Svg>
  );
}
