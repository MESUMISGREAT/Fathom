/**
 * y = tan(x + π/6) (solid) and y = tan x (dashed) for 0 ≤ x ≤ 2π. The shifted
 * graph is y = tan x translated π/6 to the left: asymptotes move from π/2, 3π/2
 * to π/3, 4π/3, zeros from π, 2π to 5π/6, 11π/6, and the y-intercept is
 * tan(π/6) = 1/√3 ≈ 0.577.
 */
import { Arrow, FracLabel, Svg, graph, MathLabel } from '../primitives';
import { GraphFrame, frame } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-tan-shift';

const W = 620;
const H = 340;
const PI = Math.PI;

export default function P1TrigonometryTanShift() {
  const p = frame(50, 40, 500, 250, [-0.15, 2 * PI + 0.2], [-4, 4]);
  const top = p.sy(4);
  const bot = p.sy(-4);
  const g = (x: number) => Math.tan(x + PI / 6);
  const xa = Math.atan(2.6);
  return (
    <Svg width={W} height={H}>
      <GraphFrame
        p={p}
        xTicks={[
          { v: PI / 2, label: 'π/2' },
          { v: PI, label: 'π' },
          { v: (3 * PI) / 2, label: '3π/2' },
          { v: 2 * PI, label: '2π' },
        ]}
        yTicks={[
          { v: 2, label: '2' },
          { v: -2, label: '−2' },
        ]}
      />
      {[PI / 3, (4 * PI) / 3].map((a) => (
        <line key={a} x1={p.sx(a)} y1={top} x2={p.sx(a)} y2={bot} className="dg-accent-2 dg-dashed" style={{ strokeWidth: 1.5 }} />
      ))}
      <FracLabel x={p.sx(PI / 3)} y={top - 12} className="dg-text-accent-2">
        x = π/3
      </FracLabel>
      <FracLabel x={p.sx((4 * PI) / 3)} y={top - 12} className="dg-text-accent-2">
        x = 4π/3
      </FracLabel>
      <path d={graph(Math.tan, [0, 2 * PI], p, p.y, 600)} className="dg-muted dg-dashed" />
      <path d={graph(g, [0, 2 * PI], p, p.y, 600)} className="dg-accent" />
      <Arrow x1={p.sx(xa)} y1={p.sy(2.6)} x2={p.sx(xa - PI / 6) + 2} y2={p.sy(2.6)} className="dg-line" head={7} />
      <FracLabel x={p.sx(xa) + 8} y={p.sy(2.6)} anchor="start" className="dg-text-small">
        π/6 left
      </FracLabel>
      <circle cx={p.sx(0)} cy={p.sy(1 / Math.sqrt(3))} r={4} className="dg-dot-accent" />
      <MathLabel x={p.sx(0) - 8} y={p.sy(1 / Math.sqrt(3)) - 2} anchor="end" w={78} h={46} size="small" tex={"\\dfrac{1}{\\sqrt{3}}"} />
      {[
        { x: (5 * PI) / 6, label: '5π/6' },
        { x: (11 * PI) / 6, label: '11π/6' },
      ].map((q) => (
        <g key={q.label}>
          <circle cx={p.sx(q.x)} cy={p.sy(0)} r={4} className="dg-dot" />
          <FracLabel x={p.sx(q.x) - 8} y={p.sy(0) - 13} anchor="end" className="dg-text-small dg-bold">
            {q.label}
          </FracLabel>
        </g>
      ))}
      <FracLabel x={p.sx(2.45)} y={p.sy(-3.2)} anchor="start" className="dg-text-accent">
        y = tan(x + π/6)
      </FracLabel>
      <FracLabel x={p.sx(4.95)} y={p.sy(3.3)} anchor="start" className="dg-text-small">
        y = tan x (dashed)
      </FracLabel>
    </Svg>
  );
}
