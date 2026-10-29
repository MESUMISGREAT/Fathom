/**
 * E_P against height for a 2.0 kg mass: a straight line through the origin whose
 * gradient is the weight mg = 19.6 N. Points mark 1.0 m, 2.0 m and 3.0 m, and a
 * step shows that a rise of Δh adds mgΔh.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-gpe-ke-gpe-height-graph';

const W = 600;
const H = 340;
const X0 = 86;
const Y0 = 286;
/** 130 px per metre. */
const px = (metres: number) => X0 + metres * 130;
/** 2.4 px per joule (70 J fits above the axis). */
const py = (joules: number) => Y0 - joules * 2.4;

export function GpeKeGpeHeightGraph() {
  const line = (m: number) => 2.0 * 9.81 * m;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Gravitational energy against height (2.0 kg mass)
      </Label>

      {/* axes */}
      <line x1={X0} y1={Y0} x2={530} y2={Y0} className="dg-line" />
      <line x1={X0} y1={Y0} x2={X0} y2={56} className="dg-line" />
      <MathLabel x={530} y={Y0 - 14} tex="h\ /\ \text{m}" w={80} h={24} anchor="end" tone="muted" size="small" />
      <MathLabel x={62} y={48} tex="E_P\ /\ \text{J}" w={96} h={26} anchor="middle" tone="muted" size="small" />

      {/* ticks */}
      {[1, 2, 3].map((m) => (
        <g key={m}>
          <line x1={px(m)} y1={Y0} x2={px(m)} y2={Y0 + 5} className="dg-muted" />
          <Label x={px(m)} y={Y0 + 18} className="dg-text-small dg-text-muted">
            {m.toFixed(1)}
          </Label>
        </g>
      ))}
      {[20, 40, 60].map((j) => (
        <g key={j}>
          <line x1={X0 - 5} y1={py(j)} x2={X0} y2={py(j)} className="dg-muted" />
          <Label x={X0 - 10} y={py(j)} anchor="end" className="dg-text-small dg-text-muted">
            {j}
          </Label>
        </g>
      ))}

      {/* the line */}
      <line x1={X0} y1={Y0} x2={px(3.3)} y2={py(line(3.3))} className="dg-accent" />

      {/* marked points */}
      {[
        { m: 1, j: line(1) },
        { m: 2, j: line(2) },
        { m: 3, j: line(3) },
      ].map(({ m, j }) => (
        <g key={m}>
          <circle cx={px(m)} cy={py(j)} r={4} className="dg-dot-accent" />
          <Label x={px(m) - 10} y={py(j) - 14} anchor="end" className="dg-text-small dg-text-accent">
            {j.toFixed(1)} J
          </Label>
        </g>
      ))}

      {/* step: Δh from 2 to 3 m adds 19.6 J */}
      <line x1={px(2)} y1={py(line(2))} x2={px(3)} y2={py(line(2))} className="dg-muted dg-dashed" />
      <line x1={px(3)} y1={py(line(2))} x2={px(3)} y2={py(line(3))} className="dg-muted dg-dashed" />
      <Arrow x1={px(2.55)} y1={py(line(2)) - 6} x2={px(2.95)} y2={py(line(2)) - 6} head={7} className="dg-muted" />
      <MathLabel x={px(2.5)} y={py(line(2)) + 24} tex="\Delta h" w={44} h={24} tone="muted" size="small" />
      <MathLabel x={px(3) + 14} y={py(line(2)) + 30} tex="\text{adds } mg\Delta h" w={130} h={24} anchor="start" size="small" />

      <MathLabel x={380} y={96} tex="\text{gradient} = mg = 19.6\ \text{N}" w={220} h={28} tone="accent" size="small" />
      <Label x={W / 2} y={H - 8} className="dg-text-small dg-text-muted">
        only differences in height are physical, so any zero level works
      </Label>
    </Svg>
  );
}

export default GpeKeGpeHeightGraph;
