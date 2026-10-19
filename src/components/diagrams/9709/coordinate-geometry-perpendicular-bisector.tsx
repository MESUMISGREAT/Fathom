/**
 * The perpendicular bisector of A(−1, 2) and B(5, 6), on a square grid.
 * The midpoint is M(2, 4); AB has gradient 2/3, so the bisector has gradient −3/2
 * and equation 3x + 2y = 14. A right-angle mark at M and tick marks on AM and MB
 * show it is perpendicular to AB and cuts it in half.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-perpendicular-bisector';

const W = 500;
const H = 470;
const PAD = 30;
const X: [number, number] = [-2.4, 6.6];
const ySpan = ((H - 2 * PAD) / (W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-0.9, -0.9 + ySpan];
const bis = (x: number) => (14 - 3 * x) / 2;

export default function CoordinateGeometryPerpendicularBisector() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const A = { x: -1, y: 2 };
  const B = { x: 5, y: 6 };
  const M = { x: 2, y: 4 };
  // unit vectors along AB and along the bisector, in maths units
  const L = Math.hypot(6, 4);
  const u = { x: 6 / L, y: 4 / L };
  const v = { x: -4 / L, y: 6 / L };
  const k = 0.32;
  const tick = (cx: number, cy: number) => {
    const t = 0.18;
    return (
      <line
        x1={p.sx(cx - t * v.x)}
        y1={p.sy(cy - t * v.y)}
        x2={p.sx(cx + t * v.x)}
        y2={p.sy(cy + t * v.y)}
        className="dg-line"
      />
    );
  };
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, -1, 1, 2, 3, 4, 5, 6]} yTicks={[1, 2, 3, 4, 5, 6, 7]} />
      <line x1={p.sx(A.x)} y1={p.sy(A.y)} x2={p.sx(B.x)} y2={p.sy(B.y)} className="dg-accent" />
      <path d={graph(bis, X, p, Y)} className="dg-accent-2" />
      <path
        d={`M${p.sx(M.x + k * u.x)},${p.sy(M.y + k * u.y)} L${p.sx(M.x + k * (u.x + v.x))},${p.sy(M.y + k * (u.y + v.y))} L${p.sx(M.x + k * v.x)},${p.sy(M.y + k * v.y)}`}
        className="dg-thin"
      />
      {tick((A.x + M.x) / 2, (A.y + M.y) / 2)}
      {tick((M.x + B.x) / 2, (M.y + B.y) / 2)}
      <circle cx={p.sx(A.x)} cy={p.sy(A.y)} r={5} className="dg-dot" />
      <circle cx={p.sx(B.x)} cy={p.sy(B.y)} r={5} className="dg-dot" />
      <circle cx={p.sx(M.x)} cy={p.sy(M.y)} r={5} className="dg-dot-accent-2" />
      <Label x={p.sx(A.x) - 6} y={p.sy(A.y) + 18} anchor="end" className="dg-text dg-bold">
        A(−1, 2)
      </Label>
      <Label x={p.sx(B.x) + 4} y={p.sy(B.y) + 20} anchor="start" className="dg-text dg-bold">
        B(5, 6)
      </Label>
      <Label x={p.sx(M.x) + 14} y={p.sy(M.y) + 9} anchor="start" className="dg-text-accent-2">
        M(2, 4)
      </Label>
      <Label x={p.sx(4.5)} y={p.sy(2.6)} anchor="start" className="dg-text-small">
        {'AB: gradient 2/3'}
      </Label>
      <Label x={p.sx(4.3)} y={p.sy(1.35)} anchor="start" className="dg-text-accent-2">
        3x + 2y = 14
      </Label>
      <Label x={p.sx(4.3)} y={p.sy(1.35) + 18} anchor="start" className="dg-text-small">
        {'gradient −3/2'}
      </Label>
    </Svg>
  );
}
