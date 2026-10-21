/**
 * The circle x² + y² = 5 (centre O, radius √5) and three parallel lines y = k − ½x,
 * drawn with equal scales. Substituting and multiplying by 4 gives
 * 5x² − 4kx + 4k² − 20 = 0, with discriminant 400 − 64k².
 * k = ½: two intersection points (discriminant > 0).
 * k = 5/2: tangent at (1, 2) (discriminant 0); the radius to (1, 2) is perpendicular to it.
 * k = 4: misses the circle (discriminant < 0).
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'coordinate-geometry-line-circle-cases';

const W = 540;
const H = 470;
const PAD = 28;
const X: [number, number] = [-3.8, 5.4];
const ySpan = ((H - 2 * PAD) / (W - 2 * PAD)) * (X[1] - X[0]);
const Y: [number, number] = [-3.9, -3.9 + ySpan];
const line = (k: number) => (x: number) => k - x / 2;

export default function CoordinateGeometryLineCircleCases() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const r = p.sx(Math.sqrt(5)) - p.sx(0);
  const x1 = (2 + Math.sqrt(384)) / 10;
  const x2 = (2 - Math.sqrt(384)) / 10;
  // right-angle mark at T(1, 2): towards O is (−1, −2)/√5, along the tangent is (2, −1)/√5
  const T = { x: 1, y: 2 };
  const s = 0.3 / Math.sqrt(5);
  const a = { x: T.x - s, y: T.y - 2 * s };
  const c = { x: T.x + 2 * s, y: T.y - s };
  const b = { x: a.x + 2 * s, y: a.y - s };
  const P = (x: number, y: number) => `${p.sx(x)},${p.sy(y)}`;
  const legend = [
    { cls: 'dg-line', text: 'k = ½: two points (b² − 4ac > 0)', tcls: 'dg-text-small' },
    { cls: 'dg-accent-2', text: 'k = 5/2: tangent (b² − 4ac = 0)', tcls: 'dg-text-small' },
    { cls: 'dg-muted dg-dashed', text: 'k = 4: misses (b² − 4ac < 0)', tcls: 'dg-text-small' },
  ];
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-3, -2, -1, 1, 2, 3, 4, 5]} yTicks={[-3, -2, -1, 1, 2, 3]} />
      <circle cx={p.sx(0)} cy={p.sy(0)} r={r} className="dg-accent" />
      <path d={graph(line(0.5), X, p, Y)} className="dg-line" />
      <path d={graph(line(2.5), X, p, Y)} className="dg-accent-2" />
      <path d={graph(line(4), X, p, Y)} className="dg-muted dg-dashed" />
      <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(T.x)} y2={p.sy(T.y)} className="dg-thin dg-dashed" />
      <path d={`M${P(a.x, a.y)} L${P(b.x, b.y)} L${P(c.x, c.y)}`} className="dg-thin" />

      <circle cx={p.sx(x1)} cy={p.sy(line(0.5)(x1))} r={5} className="dg-dot" />
      <circle cx={p.sx(x2)} cy={p.sy(line(0.5)(x2))} r={5} className="dg-dot" />
      <circle cx={p.sx(T.x)} cy={p.sy(T.y)} r={5.5} className="dg-dot-accent-2" />
      <circle cx={p.sx(0)} cy={p.sy(0)} r={3.5} className="dg-dot" />

      <Label x={p.sx(1.15)} y={p.sy(2.4)} anchor="start" className="dg-text-accent-2">
        (1, 2)
      </Label>
      <Label x={p.sx(1.7)} y={p.sy(-1.95)} anchor="start" className="dg-text-accent">
        {'x² + y² = 5'}
      </Label>
      {/* each label sits just above its own line */}
      <Label x={p.sx(4.3)} y={p.sy(line(4)(4.3) + 0.4)} className="dg-text-small dg-bold">
        k = 4
      </Label>
      <Label x={p.sx(4.3)} y={p.sy(line(2.5)(4.3) + 0.4)} className="dg-text-small dg-bold">
        k = 5/2
      </Label>
      <Label x={p.sx(4.3)} y={p.sy(line(0.5)(4.3) + 0.4)} className="dg-text-small dg-bold">
        k = ½
      </Label>

      <Label x={p.sx(0.95)} y={p.sy(-2.6)} anchor="start" className="dg-text-small dg-bold">
        {'lines y = k − ½x'}
      </Label>
      {legend.map((l, i) => {
        const y = p.sy(-3.0 - 0.38 * i);
        return (
          <g key={l.text}>
            <line x1={p.sx(0.95)} y1={y} x2={p.sx(0.95) + 24} y2={y} className={l.cls} />
            <Label x={p.sx(0.95) + 32} y={y} anchor="start" className={l.tcls}>
              {l.text}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}
