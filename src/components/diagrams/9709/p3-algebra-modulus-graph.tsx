/**
 * y = |2x − 5| as a V with its vertex on the x-axis at x = 2.5, cut by the line
 * y = 7 at the two solutions x = −1 and x = 6.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'math-p3-algebra-modulus-graph';

const W = 520;
const H = 340;

const { sx, sy } = axes({ width: W, height: H, pad: 46, x: [-3, 8], y: [-4, 13] });

export function P3AlgebraModulusGraph() {
  const f = (x: number) => Math.abs(2 * x - 5);
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        y = |2x − 5|, cut by y = 7
      </Label>

      <line x1={sx(-3)} y1={sy(0)} x2={sx(8)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(-4)} x2={sx(0)} y2={sy(13)} className="dg-line" />
      <Label x={sx(8)} y={sy(0) + 18} anchor="end" className="dg-text-small dg-text-muted">
        x
      </Label>
      <Label x={sx(0) - 10} y={sy(12.6)} anchor="end" className="dg-text-small dg-text-muted">
        y
      </Label>

      {[2, 4, 6].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(0) + 5} className="dg-muted" />
          <Label x={sx(t)} y={sy(0) + 18} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}

      <path d={graph(f, [-3, 8], { sx, sy }, [-4, 13])} className="dg-accent" />

      <line x1={sx(-3)} y1={sy(7)} x2={sx(8)} y2={sy(7)} className="dg-muted dg-dashed" />
      <Label x={sx(7.6)} y={sy(7) - 12} anchor="end" className="dg-text-small dg-text-muted">
        y = 7
      </Label>

      {[
        { x: -1, label: '−1' },
        { x: 6, label: '6' },
      ].map((p) => (
        <g key={p.x}>
          <circle cx={sx(p.x)} cy={sy(7)} r={4} className="dg-dot-accent" />
          <line x1={sx(p.x)} y1={sy(7)} x2={sx(p.x)} y2={sy(0)} className="dg-muted dg-dashed" />
          <Label
            x={sx(p.x) + (p.x < 0 ? -12 : 12)}
            y={sy(7) + 24}
            anchor={p.x < 0 ? 'end' : 'start'}
            className="dg-text-small dg-text-accent"
          >
            x = {p.label}
          </Label>
        </g>
      ))}

      <circle cx={sx(2.5)} cy={sy(0)} r={4} className="dg-dot" />
      <Label x={sx(2.5) + 16} y={sy(0) + 44} anchor="start" className="dg-text-small dg-text-muted">
        vertex at (2.5, 0)
      </Label>
      <MathLabel x={W / 2} y={H - 16} tex="y = |2x - 5|" w={160} h={26} />
    </Svg>
  );
}

export default P3AlgebraModulusGraph;
