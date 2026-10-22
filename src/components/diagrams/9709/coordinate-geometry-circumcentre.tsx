/**
 * The circle through A(0, 6), B(6, 6) and C(7, −1), on a square grid.
 * The perpendicular bisector of chord AB is x = 3 (AB is horizontal, midpoint (3, 6)).
 * The perpendicular bisector of chord BC passes through its midpoint (6.5, 2.5) with
 * gradient 1/7 (BC has gradient −7). They meet at the centre (3, 2); the radius is 5,
 * so the circle is (x − 3)² + (y − 2)² = 25.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-circumcentre';

const W = 500;
const H = 500;
const PAD = 30;
const X: [number, number] = [-3.2, 9.2];
const Y: [number, number] = [-4.2, 8.2];
const bisBC = (x: number) => 2.5 + (x - 6.5) / 7;

export default function CoordinateGeometryCircumcentre() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const A = { x: 0, y: 6 };
  const B = { x: 6, y: 6 };
  const C = { x: 7, y: -1 };
  const O = { x: 3, y: 2 };
  const r = p.sx(5) - p.sx(0);
  const seg = (P: { x: number; y: number }, Q: { x: number; y: number }, cls: string) => (
    <line x1={p.sx(P.x)} y1={p.sy(P.y)} x2={p.sx(Q.x)} y2={p.sy(Q.y)} className={cls} />
  );
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, 2, 4, 6, 8]} yTicks={[-2, 2, 4]} />
      <circle cx={p.sx(O.x)} cy={p.sy(O.y)} r={r} className="dg-accent" />
      {/* chords AB and BC */}
      {seg(A, B, 'dg-line')}
      {seg(B, C, 'dg-line')}
      {/* perpendicular bisectors */}
      <line x1={p.sx(3)} y1={p.sy(-3.4)} x2={p.sx(3)} y2={p.sy(7.7)} className="dg-accent-2 dg-dashed" />
      <path d={graph(bisBC, [-2.6, 8.9], p, Y)} className="dg-accent-2 dg-dashed" />
      {/* midpoints */}
      <circle cx={p.sx(3)} cy={p.sy(6)} r={4} className="dg-dot-accent-2" />
      <circle cx={p.sx(6.5)} cy={p.sy(2.5)} r={4} className="dg-dot-accent-2" />
      {[A, B, C].map((q) => (
        <circle key={`${q.x},${q.y}`} cx={p.sx(q.x)} cy={p.sy(q.y)} r={5} className="dg-dot" />
      ))}
      <circle cx={p.sx(O.x)} cy={p.sy(O.y)} r={5.5} className="dg-dot-accent" />
      {seg(O, A, 'dg-thin dg-dashed')}

      <Label x={p.sx(A.x) - 10} y={p.sy(A.y) - 12} anchor="end" className="dg-text dg-bold">
        A(0, 6)
      </Label>
      <Label x={p.sx(B.x) + 10} y={p.sy(B.y) - 12} anchor="start" className="dg-text dg-bold">
        B(6, 6)
      </Label>
      <Label x={p.sx(C.x) + 10} y={p.sy(C.y) + 6} anchor="start" className="dg-text dg-bold">
        C(7, −1)
      </Label>
      <Label x={p.sx(O.x) + 10} y={p.sy(O.y) + 18} anchor="start" className="dg-text-accent">
        centre (3, 2)
      </Label>
      <Label x={p.sx(1.7)} y={p.sy(4.5)} anchor="start" className="dg-text-small">
        r = 5
      </Label>
      <Label x={p.sx(3) + 8} y={p.sy(7.45)} anchor="start" className="dg-text-small dg-bold">
        x = 3
      </Label>
      <Label x={p.sx(6.5) + 10} y={p.sy(2.5) + 16} anchor="start" className="dg-text-small">
        midpoint of BC
      </Label>
      <Label x={p.sx(9.1)} y={p.sy(-3.55)} anchor="end" className="dg-text-accent">
        {'(x − 3)² + (y − 2)² = 25'}
      </Label>
    </Svg>
  );
}
