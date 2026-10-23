/**
 * Force–time graphs for stopping a 0.50 kg ball moving at 4.0 m s⁻¹
 * (Δp = 2.0 N s), drawn to scale as half-sine pulses F = F₀ sin(πt / T):
 *   hard surface: contact time T = 4.0 ms, peak F₀ = πΔp / (2T) = 785 N;
 *   soft cushion: contact time T = 16 ms, peak F₀ = 196 N.
 * Both shaded areas equal Δp = 2.0 N s. Four times the contact time gives a
 * quarter of the peak force.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-force-time';

const W = 620;
const H = 320;
const DP = 2.0; // N s
const left = 78;
const top = 34;
const pw = 470;
const ph = 220;
const X: [number, number] = [0, 20]; // ms
const Y: [number, number] = [0, 900]; // N
const sx = (t: number) => left + ((t - X[0]) / (X[1] - X[0])) * pw;
const sy = (f: number) => top + ph - ((f - Y[0]) / (Y[1] - Y[0])) * ph;

function pulse(Tms: number) {
  const T = Tms / 1000;
  const F0 = (Math.PI * DP) / (2 * T);
  const n = 120;
  let d = `M${sx(0).toFixed(2)},${sy(0).toFixed(2)}`;
  for (let i = 0; i <= n; i++) {
    const t = (Tms * i) / n;
    d += ` L${sx(t).toFixed(2)},${sy(F0 * Math.sin((Math.PI * t) / Tms)).toFixed(2)}`;
  }
  return { line: d, area: `${d} Z`, F0 };
}

export function MomentumNewtonForceTime() {
  const hard = pulse(4);
  const soft = pulse(16);
  const xt = [4, 8, 12, 16, 20];
  const yt = [200, 400, 600, 800];
  return (
    <Svg width={W} height={H}>
      {xt.map((t) => (
        <line key={`gx${t}`} x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(900)} className="dg-grid" />
      ))}
      {yt.map((f) => (
        <line key={`gy${f}`} x1={sx(0)} y1={sy(f)} x2={sx(20)} y2={sy(f)} className="dg-grid" />
      ))}
      <path d={soft.area} className="dg-fill-accent-2" />
      <path d={hard.area} className="dg-fill-accent" />
      <path d={soft.line} className="dg-accent-2" />
      <path d={hard.line} className="dg-accent" />
      <Arrow x1={sx(0)} y1={sy(0)} x2={sx(20) + 22} y2={sy(0)} head={8} />
      <Arrow x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(900) - 18} head={8} />
      {xt.map((t) => (
        <Label key={`lx${t}`} x={sx(t)} y={sy(0) + 15} className="dg-text-small">
          {t}
        </Label>
      ))}
      <Label x={sx(0) - 8} y={sy(0) + 10} anchor="end" className="dg-text-small">
        0
      </Label>
      {yt.map((f) => (
        <Label key={`ly${f}`} x={sx(0) - 8} y={sy(f)} anchor="end" className="dg-text-small">
          {f}
        </Label>
      ))}
      <Label x={sx(10)} y={sy(0) + 36} className="dg-text-small dg-italic">
        time t / ms
      </Label>
      <text
        x={22}
        y={sy(450)}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 22 ${sy(450)})`}
        className="dg-text-small dg-italic"
      >
        force F / N
      </text>
      {/* labels */}
      <Label x={sx(2) + 14} y={sy(hard.F0) + 2} anchor="start" className="dg-text-small dg-text-accent">
        hard floor: 4.0 ms, peak 785 N
      </Label>
      <Label x={sx(8) + 6} y={sy(soft.F0) - 16} anchor="start" className="dg-text-small dg-text-accent-2">
        cushion: 16 ms, peak 196 N
      </Label>
      <Label x={sx(13)} y={sy(640) - 20} anchor="start" className="dg-text-small dg-text-muted">
        0.50 kg ball, 4.0 m s⁻¹ → rest
      </Label>
      <Label x={sx(13)} y={sy(640)} anchor="start" className="dg-text-small dg-bold">
        same Δp = 2.0 N s
      </Label>
      <Label x={sx(13)} y={sy(640) + 16} anchor="start" className="dg-text-small">
        = area under each graph
      </Label>
      <Label x={sx(13)} y={sy(640) + 32} anchor="start" className="dg-text-small">
        4 × the time, ¼ of the peak force
      </Label>
    </Svg>
  );
}

export default MomentumNewtonForceTime;
