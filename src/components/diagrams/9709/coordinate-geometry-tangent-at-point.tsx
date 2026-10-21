/**
 * The tangent to (x − 1)² + (y + 2)² = 20 at P(3, 2), on a square grid.
 * Centre C(1, −2), radius √20. The radius CP has gradient (2 − (−2))/(3 − 1) = 2, so the
 * tangent, which is perpendicular to it, has gradient −½: y − 2 = −½(x − 3), i.e.
 * x + 2y = 7. A right-angle mark at P shows tangent ⊥ radius.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-tangent-at-point';

const W = 480;
const H = 480;
const X: [number, number] = [-4.2, 8.2];
const Y: [number, number] = [-7.2, 5.2];
const tangent = (x: number) => (7 - x) / 2;

export default function CoordinateGeometryTangentAtPoint() {
  const p = makePlot({ width: W, height: H, pad: 30, x: X, y: Y });
  const C = { x: 1, y: -2 };
  const P = { x: 3, y: 2 };
  const r = p.sx(Math.sqrt(20)) - p.sx(0);
  // unit vectors (maths units): from P towards C, and along the tangent
  const toC = { x: -1 / Math.sqrt(5), y: -2 / Math.sqrt(5) };
  const along = { x: 2 / Math.sqrt(5), y: -1 / Math.sqrt(5) };
  const s = 0.38;
  const a = { x: P.x + s * toC.x, y: P.y + s * toC.y };
  const b = { x: a.x + s * along.x, y: a.y + s * along.y };
  const c = { x: P.x + s * along.x, y: P.y + s * along.y };
  const pt = (q: { x: number; y: number }) => `${p.sx(q.x)},${p.sy(q.y)}`;
  // the tangent's label runs along it (on screen the line falls 1 unit for every 2 across)
  const tAng = (Math.atan(0.5) * 180) / Math.PI;
  const tl = { x: p.sx(5.4), y: p.sy(tangent(5.4)) };
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, 2, 4, 6]} yTicks={[-4, -2, 2, 4]} />
      <circle cx={p.sx(C.x)} cy={p.sy(C.y)} r={r} className="dg-accent" />
      <path d={graph(tangent, X, p, Y)} className="dg-accent-2" />
      <line x1={p.sx(C.x)} y1={p.sy(C.y)} x2={p.sx(P.x)} y2={p.sy(P.y)} className="dg-line" />
      <path d={`M${pt(a)} L${pt(b)} L${pt(c)}`} className="dg-thin" />
      <circle cx={p.sx(C.x)} cy={p.sy(C.y)} r={5} className="dg-dot" />
      <circle cx={p.sx(P.x)} cy={p.sy(P.y)} r={5} className="dg-dot-accent-2" />

      <Label x={p.sx(C.x) + 10} y={p.sy(C.y) + 14} anchor="start" className="dg-text dg-bold">
        C(1, −2)
      </Label>
      <Label x={p.sx(P.x) + 10} y={p.sy(P.y) - 12} anchor="start" className="dg-text dg-bold">
        P(3, 2)
      </Label>
      <g transform={`rotate(${tAng} ${tl.x} ${tl.y})`}>
        <Label x={tl.x} y={tl.y - 12} className="dg-text-accent-2">
          tangent x + 2y = 7
        </Label>
      </g>
      <Label x={p.sx(1.85)} y={p.sy(-1)} anchor="start" className="dg-text-small">
        CP: gradient 2
      </Label>
      <Label x={p.sx(8.1)} y={p.sy(-6.85)} anchor="end" className="dg-text-accent">
        {'(x − 1)² + (y + 2)² = 20'}
      </Label>
    </Svg>
  );
}
