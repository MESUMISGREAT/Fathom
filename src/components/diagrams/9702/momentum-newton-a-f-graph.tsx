/**
 * Testing F = ma with a trolley: acceleration a against resultant force F,
 * drawn to scale. Two straight lines through the origin, a = F / m:
 *   m = 0.50 kg (gradient 2.0 kg⁻¹) and m = 1.00 kg (gradient 1.0 kg⁻¹).
 * Points every 0.25 N lie on the lines. A dashed gradient triangle on the
 * 0.50 kg line runs from F = 0.50 N to 1.50 N: Δa = 2.0 m s⁻², ΔF = 1.0 N.
 */
import { Arrow, Label, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-momentum-newton-a-f-graph';

const W = 520;
const H = 330;
const X: [number, number] = [0, 2];
const Y: [number, number] = [0, 4];
// Plot box: 70 px left margin, 40 px top, 40 px bottom.
const map = axes({ width: 460, height: 300, pad: 40, x: X, y: Y });
const sx = (x: number) => map.sx(x) + 40;
const sy = (y: number) => map.sy(y);
const m2 = { sx, sy };

export function MomentumNewtonAFGraph() {
  const xt = [0.5, 1.0, 1.5, 2.0];
  const yt = [1, 2, 3, 4];
  const pts = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  return (
    <Svg width={W} height={H}>
      {/* grid */}
      {xt.map((t) => (
        <line key={`gx${t}`} x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(4)} className="dg-grid" />
      ))}
      {yt.map((t) => (
        <line key={`gy${t}`} x1={sx(0)} y1={sy(t)} x2={sx(2)} y2={sy(t)} className="dg-grid" />
      ))}
      {/* axes */}
      <Arrow x1={sx(0)} y1={sy(0)} x2={sx(2) + 22} y2={sy(0)} head={8} />
      <Arrow x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(4) - 22} head={8} />
      {xt.map((t) => (
        <Label key={`lx${t}`} x={sx(t)} y={sy(0) + 15} className="dg-text-small">
          {t.toFixed(1)}
        </Label>
      ))}
      {yt.map((t) => (
        <Label key={`ly${t}`} x={sx(0) - 8} y={sy(t)} anchor="end" className="dg-text-small">
          {t.toFixed(1)}
        </Label>
      ))}
      <Label x={sx(0) - 8} y={sy(0) + 12} anchor="end" className="dg-text-small">
        0
      </Label>
      <Label x={sx(1)} y={sy(0) + 36} className="dg-text-small dg-italic">
        resultant force F / N
      </Label>
      <text
        x={sx(0) - 44}
        y={sy(2)}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${sx(0) - 44} ${sy(2)})`}
        className="dg-text-small dg-italic"
      >
        acceleration a / m s⁻²
      </text>

      {/* gradient triangle on the 0.50 kg line */}
      <path d={`M${sx(0.5)},${sy(1)} L${sx(1.5)},${sy(1)} L${sx(1.5)},${sy(3)}`} className="dg-thin dg-dashed" />
      <Label x={sx(1.22)} y={sy(1) + 14} className="dg-text-small">
        ΔF = 1.0 N
      </Label>
      <Label x={sx(1.5) + 6} y={sy(2.4)} anchor="start" className="dg-text-small">
        Δa = 2.0 m s⁻²
      </Label>

      {/* the two lines a = F / m */}
      <path d={graph((f) => f / 0.5, X, m2, Y)} className="dg-accent" />
      <path d={graph((f) => f / 1.0, X, m2, Y)} className="dg-accent-2" />
      {pts.map((f) => (
        <circle key={`a${f}`} cx={sx(f)} cy={sy(f / 0.5)} r={4} className="dg-dot-accent" />
      ))}
      {pts.map((f) => (
        <circle key={`b${f}`} cx={sx(f)} cy={sy(f / 1.0)} r={4} className="dg-dot-accent-2" />
      ))}
      <Label x={sx(2) - 4} y={sy(4) - 16} anchor="end" className="dg-text-accent">
        m = 0.50 kg
      </Label>
      <Label x={sx(2) + 6} y={sy(2) + 40} anchor="end" className="dg-text-accent-2">
        m = 1.00 kg
      </Label>
      {/* reading box */}
      <Label x={sx(0.06)} y={sy(3.75)} anchor="start" className="dg-text-small dg-bold">
        straight line through the origin: a ∝ F
      </Label>
      <Label x={sx(0.06)} y={sy(3.75) + 16} anchor="start" className="dg-text-small">
        gradient = 1 / m
      </Label>
      <Label x={sx(0.06)} y={sy(3.75) + 32} anchor="start" className="dg-text-small">
        2.0 kg⁻¹ → m = 0.50 kg
      </Label>
    </Svg>
  );
}

export default MomentumNewtonAFGraph;
