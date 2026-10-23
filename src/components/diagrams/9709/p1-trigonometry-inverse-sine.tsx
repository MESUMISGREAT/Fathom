/**
 * Equal scales on both axes. y = sin x restricted to −π/2 ≤ x ≤ π/2 (solid) is
 * one-one, and its reflection in y = x is y = sin⁻¹x for −1 ≤ x ≤ 1, running from
 * (−1, −π/2) to (1, π/2). The rest of y = sin x (dashed) is not used, because it
 * would repeat y-values.
 */
import { Label, Svg, graph } from '../primitives';
import { GraphFrame, frame } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-inverse-sine';

const W = 640;
const H = 390;
const H2 = Math.PI / 2;

export default function P1TrigonometryInverseSine() {
  const k = 80;
  const p = frame(46, 28, 4.6 * k, 4 * k, [-2.3, 2.3], [-2, 2]);
  const lx = 440;
  return (
    <Svg width={W} height={H}>
      <GraphFrame
        p={p}
        xTicks={[
          { v: -H2, label: '−π/2', dx: -6 },
          { v: -1, label: '−1', dx: 6 },
          { v: 1, label: '1', dx: -6 },
          { v: H2, label: 'π/2', dx: 6 },
        ]}
        yTicks={[
          { v: H2, label: 'π/2' },
          { v: 1, label: '1' },
          { v: -1, label: '−1' },
          { v: -H2, label: '−π/2' },
        ]}
      />
      <line x1={p.sx(-2)} y1={p.sy(-2)} x2={p.sx(2)} y2={p.sy(2)} className="dg-thin dg-dashed" />
      <path d={graph(Math.sin, [-2.3, -H2], p, p.y)} className="dg-muted dg-dashed" />
      <path d={graph(Math.sin, [H2, 2.3], p, p.y)} className="dg-muted dg-dashed" />
      <path d={graph(Math.sin, [-H2, H2], p, p.y)} className="dg-accent" />
      <path d={graph(Math.asin, [-1, 1], p, p.y, 400)} className="dg-accent-2" />
      {[
        [-H2, -1, 'dg-dot-accent'],
        [H2, 1, 'dg-dot-accent'],
        [-1, -H2, 'dg-dot-accent-2'],
        [1, H2, 'dg-dot-accent-2'],
      ].map(([x, y, c]) => (
        <circle key={`${x},${y}`} cx={p.sx(x as number)} cy={p.sy(y as number)} r={4} className={c as string} />
      ))}
      <Label x={p.sx(1.95)} y={p.sy(2) + 14} anchor="end" className="dg-text-small">
        y = x
      </Label>

      <g>
        <line x1={lx} y1={70} x2={lx + 28} y2={70} className="dg-accent" />
        <Label x={lx + 36} y={70} anchor="start" className="dg-text-accent">
          y = sin x
        </Label>
        <Label x={lx + 36} y={90} anchor="start" className="dg-text-small">
          for −π/2 ≤ x ≤ π/2 (one-one)
        </Label>
        <line x1={lx} y1={130} x2={lx + 28} y2={130} className="dg-accent-2" />
        <Label x={lx + 36} y={130} anchor="start" className="dg-text-accent-2">
          y = sin⁻¹x
        </Label>
        <Label x={lx + 36} y={150} anchor="start" className="dg-text-small">
          for −1 ≤ x ≤ 1
        </Label>
        <line x1={lx} y1={190} x2={lx + 28} y2={190} className="dg-thin dg-dashed" />
        <Label x={lx + 36} y={190} anchor="start" className="dg-text-small">
          mirror line y = x
        </Label>
        <line x1={lx} y1={230} x2={lx + 28} y2={230} className="dg-muted dg-dashed" />
        <Label x={lx + 36} y={230} anchor="start" className="dg-text-small">
          rest of y = sin x
        </Label>
        <Label x={lx + 36} y={248} anchor="start" className="dg-text-small">
          (not used)
        </Label>
      </g>
    </Svg>
  );
}
