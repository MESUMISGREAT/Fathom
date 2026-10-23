/**
 * y = 1 − 2cos 2x for 0 ≤ x ≤ π (radians), with y = cos 2x dashed for comparison.
 * Period π, centre line y = 1, maximum 3 at x = π/2, minimum −1 at x = 0 and x = π,
 * and x-intercepts where cos 2x = ½: x = π/6 and x = 5π/6.
 */
import { Label, Svg, graph } from '../primitives';
import { GraphFrame, frame } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-transformed-cos';

const W = 600;
const H = 330;
const PI = Math.PI;
const f = (x: number) => 1 - 2 * Math.cos(2 * x);

export default function P1TrigonometryTransformedCos() {
  const p = frame(60, 30, 470, 250, [-0.12, 3.35], [-1.6, 3.6]);
  const pts: { x: number; y: number; label: string; dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }[] = [
    { x: 0, y: -1, label: '(0, −1)', dx: 8, dy: 17, anchor: 'start' },
    { x: PI / 2, y: 3, label: '(π/2, 3)', dx: 0, dy: -14, anchor: 'middle' },
    { x: PI, y: -1, label: '(π, −1)', dx: -4, dy: 17, anchor: 'end' },
  ];
  return (
    <Svg width={W} height={H}>
      <GraphFrame
        p={p}
        xTicks={[
          { v: PI / 4, label: 'π/4' },
          { v: PI / 2, label: 'π/2' },
          { v: (3 * PI) / 4, label: '3π/4' },
          { v: PI, label: 'π' },
        ]}
        yTicks={[
          { v: 3, label: '3' },
          { v: 2, label: '2' },
          { v: 1, label: '1' },
          { v: -1, label: '−1' },
        ]}
      />
      <line x1={p.sx(0)} y1={p.sy(1)} x2={p.sx(PI)} y2={p.sy(1)} className="dg-muted dg-dashed" />
      <path d={graph((x) => Math.cos(2 * x), [0, PI], p, p.y)} className="dg-muted dg-dashed" />
      <path d={graph(f, [0, PI], p, p.y)} className="dg-accent" />
      {pts.map((q) => (
        <g key={q.label}>
          <circle cx={p.sx(q.x)} cy={p.sy(q.y)} r={4} className="dg-dot-accent" />
          <Label x={p.sx(q.x) + q.dx} y={p.sy(q.y) + q.dy} anchor={q.anchor} className="dg-text-small">
            {q.label}
          </Label>
        </g>
      ))}
      {[
        { x: PI / 6, label: 'π/6', dx: -8, anchor: 'end' as const },
        { x: (5 * PI) / 6, label: '5π/6', dx: 8, anchor: 'start' as const },
      ].map((q) => (
        <g key={q.label}>
          <circle cx={p.sx(q.x)} cy={p.sy(0)} r={4} className="dg-dot" />
          <Label x={p.sx(q.x) + q.dx} y={p.sy(0) - 12} anchor={q.anchor} className="dg-text-small dg-bold">
            {q.label}
          </Label>
        </g>
      ))}
      <Label x={p.sx(PI) + 20} y={p.sy(1)} anchor="start" className="dg-text-small">
        y = 1
      </Label>
      <Label x={p.sx(1.05)} y={p.sy(2.55)} anchor="end" className="dg-text-accent">
        y = 1 − 2cos 2x
      </Label>
      <Label x={p.sx(PI / 2)} y={p.sy(-1.3)} className="dg-text-small">
        y = cos 2x (dashed)
      </Label>
    </Svg>
  );
}
