/**
 * Area under a velocity–time graph, drawn to scale. A ball rolled up a ramp:
 * v = 8 − 2t (m s⁻¹) for 0 ≤ t ≤ 6 s. It stops at t = 4 s and rolls back.
 * Above the axis: triangle 0–4 s, area +16 m. Below: triangle 4–6 s, area
 * −4 m. A thin strip at t = 1 s shows that each strip v × Δt is a small
 * displacement. Side notes: displacement = 16 − 4 = 12 m, distance = 20 m.
 */
import { Label, Svg } from '../primitives';
import { MotionAxes, makePlot, poly } from './equations-motion-kit';

export const diagramKey = 'phys-equations-motion-vt-area';

const W = 620;
const H = 330;

export function EquationsMotionVtArea() {
  const p = makePlot({ left: 60, top: 40, width: 330, height: 250, x: [0, 6.5], y: [-6, 10] });
  const v = (t: number) => 8 - 2 * t;
  const s0 = 1;
  const s1 = 1.3;
  return (
    <Svg width={W} height={H}>
      <path d={`${poly(p, [[0, 0], [0, 8], [4, 0]])} Z`} className="dg-fill-accent" />
      <path d={`${poly(p, [[4, 0], [6, -4], [6, 0]])} Z`} className="dg-fill-accent-2" />
      {/* a thin strip of width Δt */}
      <path d={`${poly(p, [[s0, 0], [s0, v(s0)], [s1, v(s0)], [s1, 0]])} Z`} className="dg-thin" />
      <MotionAxes
        p={p}
        xLabel="t / s"
        yLabel="v / m s⁻¹"
        yTicks={[-4, 4, 8]}
        xLabelBelow
      />
      {/* t ticks: labels below the axis up to 4 s, above it after (the area below is shaded) */}
      {[1, 2, 3, 4, 5, 6].map((t) => (
        <g key={t}>
          <line x1={p.sx(t)} y1={p.sy(0) - 3} x2={p.sx(t)} y2={p.sy(0) + 3} className="dg-thin" />
          <Label x={p.sx(t)} y={t <= 4 ? p.sy(0) + 13 : p.sy(0) - 12} className="dg-text-small">
            {t}
          </Label>
        </g>
      ))}
      <line x1={p.sx(6)} y1={p.sy(-4)} x2={p.sx(6)} y2={p.sy(0)} className="dg-thin dg-dashed" />
      <path d={poly(p, [[0, 8], [6, -4]])} className="dg-accent" />
      <Label x={p.sx(2.1)} y={p.sy(1.9)} className="dg-text-small dg-bold">
        +16 m
      </Label>
      <Label x={p.sx(5.45)} y={p.sy(-1.3)} className="dg-text-small dg-bold">
        −4 m
      </Label>
      <Label x={p.sx(1.35) + 6} y={p.sy(v(s0)) - 32} anchor="start" className="dg-text-small">
        strip: v × Δt = Δs
      </Label>
      <line x1={p.sx(1.15)} y1={p.sy(v(s0)) - 4} x2={p.sx(1.5)} y2={p.sy(v(s0)) - 24} className="dg-thin" />
      <Label x={p.sx(4.2)} y={p.sy(0) - 34} anchor="start" className="dg-text-small">
        stops at 4 s
      </Label>

      {/* notes */}
      <rect x={424} y={70} width={184} height={176} rx={10} className="dg-fill-muted" />
      <Label x={436} y={94} anchor="start" className="dg-text-small dg-bold">
        Rolling up (0–4 s)
      </Label>
      <Label x={436} y={112} anchor="start" className="dg-text-small">
        ½ × 4 × 8 = +16 m
      </Label>
      <Label x={436} y={138} anchor="start" className="dg-text-small dg-bold">
        Rolling back (4–6 s)
      </Label>
      <Label x={436} y={156} anchor="start" className="dg-text-small">
        ½ × 2 × 4 = −4 m
      </Label>
      <Label x={436} y={190} anchor="start" className="dg-text-small dg-text-accent">
        displacement = 12 m
      </Label>
      <Label x={436} y={208} anchor="start" className="dg-text-small">
        (16 − 4: areas below subtract)
      </Label>
      <Label x={436} y={230} anchor="start" className="dg-text-small dg-bold">
        distance = 16 + 4 = 20 m
      </Label>
    </Svg>
  );
}

export default EquationsMotionVtArea;
