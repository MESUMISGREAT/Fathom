/**
 * The line through P(−1, 5) and Q(2, −1), which is y = −2x + 3, on a square grid.
 * A gradient triangle from (1, 1) runs 1 to the right and falls 2, so m = −2; the
 * line cuts the y-axis at (0, 3), so c = 3. A panel on the right lists the same line
 * in the three forms: y = mx + c, y − y₁ = m(x − x₁) and ax + by + c = 0.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-line-forms';

const W = 620;
const PLOT_W = 330;
const H = 440;
const PAD = 28;
const X: [number, number] = [-2.4, 3.6];
const ySpan = ((H - 2 * PAD) / (PLOT_W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-2.6, -2.6 + ySpan];
const line = (x: number) => -2 * x + 3;

export default function CoordinateGeometryLineForms() {
  const p = makePlot({ width: PLOT_W, height: H, pad: PAD, x: X, y: Y });
  const tx = PLOT_W + 22;
  const forms = [
    { eq: 'y = −2x + 3', note: 'gradient m = −2, y-intercept c = 3' },
    { eq: 'y − 5 = −2(x + 1)', note: 'through (−1, 5) with gradient −2' },
    { eq: '2x + y − 3 = 0', note: 'the form ax + by + c = 0' },
  ];
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, -1, 1, 2, 3]} yTicks={[-2, 2, 4]} />
      <path d={graph(line, X, p, Y)} className="dg-accent" />
      {/* gradient triangle */}
      <path
        d={`M${p.sx(1)},${p.sy(1)} L${p.sx(2)},${p.sy(1)} L${p.sx(2)},${p.sy(-1)}`}
        className="dg-accent-2 dg-dashed"
      />
      <Label x={p.sx(1.5)} y={p.sy(1) - 12} className="dg-text-small">
        run 1
      </Label>
      <Label x={p.sx(2) + 8} y={p.sy(0.45)} anchor="start" className="dg-text-small">
        rise −2
      </Label>
      <circle cx={p.sx(-1)} cy={p.sy(5)} r={5} className="dg-dot" />
      <circle cx={p.sx(2)} cy={p.sy(-1)} r={5} className="dg-dot" />
      <circle cx={p.sx(0)} cy={p.sy(3)} r={5} className="dg-dot-accent-2" />
      <Label x={p.sx(-1) + 10} y={p.sy(5) - 6} anchor="start" className="dg-text dg-bold">
        P(−1, 5)
      </Label>
      <Label x={p.sx(2) - 10} y={p.sy(-1) + 4} anchor="end" className="dg-text dg-bold">
        Q(2, −1)
      </Label>
      <Label x={p.sx(0) + 10} y={p.sy(3) + 4} anchor="start" className="dg-text-accent-2">
        (0, 3)
      </Label>

      {/* the three forms */}
      <line x1={PLOT_W + 6} y1={40} x2={PLOT_W + 6} y2={H - 40} className="dg-grid" />
      <Label x={tx} y={70} anchor="start" className="dg-text dg-bold">
        One line, three outfits:
      </Label>
      {forms.map((f, i) => (
        <g key={f.eq}>
          <Label x={tx} y={130 + i * 90} anchor="start" className="dg-text-accent">
            {f.eq}
          </Label>
          <Label x={tx} y={152 + i * 90} anchor="start" className="dg-text-small">
            {f.note}
          </Label>
        </g>
      ))}
    </Svg>
  );
}
