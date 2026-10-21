/**
 * y = x² − 2 and y = 1/x meet at three points, so x² − 2 = 1/x (equivalently
 * x³ − 2x − 1 = 0) has three real roots: x = −1, x = (1 − √5)/2 ≈ −0.618 and
 * x = (1 + √5)/2 ≈ 1.618. Both branches of the hyperbola are drawn.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-intersections-count';

const W = 520;
const H = 440;
const X: [number, number] = [-3.1, 3.1];
const Y: [number, number] = [-3.4, 4.6];
const q = (x: number) => x * x - 2;
const h = (x: number) => 1 / x;
const r1 = -1;
const r2 = (1 - Math.sqrt(5)) / 2;
const r3 = (1 + Math.sqrt(5)) / 2;

export default function CoordinateGeometryIntersectionsCount() {
  const p = makePlot({ width: W, height: H, pad: 30, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, 1, 2, 3]} yTicks={[-3, 2, 3, 4]} yTicksRight={[1]} />
      <path d={graph(q, X, p, Y)} className="dg-accent" />
      <path d={graph(h, [X[0], -0.05], p, Y)} className="dg-accent-2" />
      <path d={graph(h, [0.05, X[1]], p, Y)} className="dg-accent-2" />
      {[r1, r2, r3].map((x) => (
        <circle key={x} cx={p.sx(x)} cy={p.sy(q(x))} r={5.5} className="dg-dot" />
      ))}
      <Label x={p.sx(r1) - 10} y={p.sy(q(r1)) + 14} anchor="end" className="dg-text-small dg-bold">
        x = −1
      </Label>
      <Label x={p.sx(r2) - 10} y={p.sy(q(r2)) + 18} anchor="end" className="dg-text-small dg-bold">
        {'x ≈ −0.618'}
      </Label>
      <Label x={p.sx(r3) + 10} y={p.sy(q(r3)) + 16} anchor="start" className="dg-text-small dg-bold">
        {'x ≈ 1.618'}
      </Label>
      <Label x={p.sx(2.3)} y={p.sy(4.1)} anchor="end" className="dg-text-accent">
        y = x² − 2
      </Label>
      <Label x={p.sx(0.45)} y={p.sy(3.6)} anchor="start" className="dg-text-accent-2">
        y = 1/x
      </Label>
      <Label x={p.sx(2.95)} y={p.sy(-2.9)} anchor="end" className="dg-text">
        3 meeting points ⇒ 3 real roots
      </Label>
    </Svg>
  );
}
