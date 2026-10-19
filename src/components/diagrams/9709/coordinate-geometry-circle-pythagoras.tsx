/**
 * Where the circle equation comes from. Centre C(2, 1), radius 5, on a square grid.
 * For a point P(x, y) on the circle, the right-angled triangle with legs x − 2 and
 * y − 1 has hypotenuse CP = 5, so (x − 2)² + (y − 1)² = 25. The point drawn is P(5, 5),
 * with legs 3 and 4.
 */
import { Label, Svg } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-circle-pythagoras';

const W = 480;
const H = 470;
const PAD = 28;
const X: [number, number] = [-3.6, 8.2];
const ySpan = ((H - 2 * PAD) / (W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-4.6, -4.6 + ySpan];

export default function CoordinateGeometryCirclePythagoras() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const C = { x: p.sx(2), y: p.sy(1) };
  const P = { x: p.sx(5), y: p.sy(5) };
  const F = { x: p.sx(5), y: p.sy(1) };
  const r = p.sx(5) - p.sx(0);
  const s = 11;
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, 2, 4, 6, 8]} yTicks={[-4, -2, 2, 4, 6]} />
      <circle cx={C.x} cy={C.y} r={r} className="dg-accent" />
      <polygon points={`${C.x},${C.y} ${F.x},${F.y} ${P.x},${P.y}`} className="dg-fill-accent-2" />
      <line x1={C.x} y1={C.y} x2={F.x} y2={F.y} className="dg-accent-2" />
      <line x1={F.x} y1={F.y} x2={P.x} y2={P.y} className="dg-accent-2" />
      <line x1={C.x} y1={C.y} x2={P.x} y2={P.y} className="dg-line" />
      <path d={`M${F.x - s},${F.y} L${F.x - s},${F.y - s} L${F.x},${F.y - s}`} className="dg-thin" />
      <circle cx={C.x} cy={C.y} r={5} className="dg-dot" />
      <circle cx={P.x} cy={P.y} r={5} className="dg-dot" />

      <Label x={C.x - 8} y={C.y + 16} anchor="end" className="dg-text dg-bold">
        C(2, 1)
      </Label>
      <Label x={P.x + 10} y={P.y - 10} anchor="start" className="dg-text dg-bold">
        P(x, y)
      </Label>
      <Label x={(C.x + F.x) / 2} y={C.y + 16} className="dg-text-accent-2">
        x − 2
      </Label>
      <Label x={F.x + 8} y={(F.y + P.y) / 2} anchor="start" className="dg-text-accent-2">
        y − 1
      </Label>
      <Label x={(C.x + P.x) / 2 - 10} y={(C.y + P.y) / 2 - 10} anchor="end" className="dg-text dg-bold">
        r = 5
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text-accent">
        {'(x − 2)² + (y − 1)² = 5²'}
      </Label>
    </Svg>
  );
}
