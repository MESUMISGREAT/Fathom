/**
 * The line y = x + 1 cuts the circle (x − 2)² + (y − 1)² = 10 at A(−1, 0) and B(3, 4),
 * on a square grid. Substituting gives x² − 2x − 3 = 0, so x = −1 or 3. The chord AB has
 * length 4√2 and midpoint M(1, 2). The line from the centre C(2, 1) to M has gradient −1,
 * perpendicular to the chord (gradient 1): a right-angle mark at M.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-chord-midpoint';

const W = 480;
const H = 460;
const PAD = 30;
const X: [number, number] = [-2.6, 6.4];
const ySpan = ((H - 2 * PAD) / (W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-2.9, -2.9 + ySpan];
const line = (x: number) => x + 1;

export default function CoordinateGeometryChordMidpoint() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const C = { x: 2, y: 1 };
  const A = { x: -1, y: 0 };
  const B = { x: 3, y: 4 };
  const M = { x: 1, y: 2 };
  const r = p.sx(Math.sqrt(10)) - p.sx(0);
  // unit vectors (maths units): along the chord, and from M towards C
  const u = { x: 1 / Math.SQRT2, y: 1 / Math.SQRT2 };
  const v = { x: 1 / Math.SQRT2, y: -1 / Math.SQRT2 };
  const s = 0.3;
  const corner = `M${p.sx(M.x + s * u.x)},${p.sy(M.y + s * u.y)} L${p.sx(M.x + s * (u.x + v.x))},${p.sy(M.y + s * (u.y + v.y))} L${p.sx(M.x + s * v.x)},${p.sy(M.y + s * v.y)}`;
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      {/* no y tick label at 2: M(1, 2) is labelled there */}
      <AxesXY p={p} xTicks={[-2, 2, 4, 6]} yTicks={[-2, 4]} />
      <circle cx={p.sx(C.x)} cy={p.sy(C.y)} r={r} className="dg-accent" />
      <path d={graph(line, X, p, [Y[0], Y[1] - 0.45])} className="dg-muted" />
      <line x1={p.sx(A.x)} y1={p.sy(A.y)} x2={p.sx(B.x)} y2={p.sy(B.y)} className="dg-accent-2" />
      <line x1={p.sx(C.x)} y1={p.sy(C.y)} x2={p.sx(M.x)} y2={p.sy(M.y)} className="dg-line dg-dashed" />
      <path d={corner} className="dg-thin" />
      <circle cx={p.sx(A.x)} cy={p.sy(A.y)} r={5} className="dg-dot-accent-2" />
      <circle cx={p.sx(B.x)} cy={p.sy(B.y)} r={5} className="dg-dot-accent-2" />
      <circle cx={p.sx(M.x)} cy={p.sy(M.y)} r={4} className="dg-dot" />
      <circle cx={p.sx(C.x)} cy={p.sy(C.y)} r={5} className="dg-dot" />

      <Label x={p.sx(A.x) - 8} y={p.sy(A.y) - 14} anchor="end" className="dg-text-accent-2">
        A(−1, 0)
      </Label>
      <Label x={p.sx(2.85)} y={p.sy(4.5)} anchor="end" className="dg-text-accent-2">
        B(3, 4)
      </Label>
      <Label x={p.sx(M.x) - 10} y={p.sy(M.y) - 8} anchor="end" className="dg-text dg-bold">
        M(1, 2)
      </Label>
      <Label x={p.sx(C.x) + 10} y={p.sy(C.y) + 14} anchor="start" className="dg-text dg-bold">
        C(2, 1)
      </Label>
      <Label x={p.sx(4.45)} y={p.sy(5.0)} anchor="start" className="dg-text-small">
        y = x + 1
      </Label>
      <Label x={p.sx(6.3)} y={p.sy(-2.3)} anchor="end" className="dg-text-accent">
        {'(x − 2)² + (y − 1)² = 10'}
      </Label>
    </Svg>
  );
}
