/**
 * Electric current as a flow of charge carriers.
 * Left: conventional current direction (positive to negative) vs electron flow.
 * Right: charge carriers in a wire - electrons moving, but net charge flow.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-electric-current-flow';

const W = 640;
const H = 300;

export function ElectricCurrentFlow() {
  return (
    <Svg width={W} height={H}>
      {/* ================= left: conventional vs electron flow ================= */}
      <Label x={140} y={30} className="dg-text dg-bold">Conventional current vs electron flow</Label>

      {/* Wire */}
      <rect x={40} y={80} width={220} height={40} className="dg-fill-muted" rx={4} />
      <line x1={40} y1={100} x2={260} y2={100} className="dg-line" />

      {/* Conventional current arrow */}
      <Arrow x1={150} y1={60} x2={150} y2={80} className="dg-accent" head={10} headClassName="dg-dot-accent" />
      <Label x={150} y={45} className="dg-text-accent dg-bold">Conventional current</Label>
      <Label x={150} y={57} className="dg-text-small dg-text-accent">(+ → −)</Label>

      {/* Electron flow arrow */}
      <Arrow x1={110} y1={140} x2={110} y2={120} className="dg-accent-2" head={10} headClassName="dg-dot-accent-2" />
      <Label x={110} y={145} className="dg-text-accent-2 dg-bold">Electron flow</Label>
      <Label x={110} y={157} className="dg-text-small dg-text-accent-2">(− → +)</Label>

      {/* Battery symbols */}
      <Label x={50} y={100} anchor="end" className="dg-text">−</Label>
      <Label x={250} y={100} anchor="start" className="dg-text">+</Label>

      {/* ================= right: microscopic view ================= */}
      <Label x={490} y={30} className="dg-text dg-bold">Inside the wire (microscopic)</Label>

      {/* Wire cross-section */}
      <rect x={380} y={70} width={240} height={60} className="dg-fill-muted" rx={4} />
      <line x1={380} y1={100} x2={620} y2={100} className="dg-line" />

      {/* Positive ions (fixed) */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <g key={i} transform={`translate(${390 + i * 38}, 85)`}>
          <circle cx={0} cy={0} r={8} className="dg-fill-accent dg-accent" />
          <Label x={0} y={0} className="dg-text dg-bold dg-text-small">+</Label>
        </g>
      ))}

      {/* Moving electrons */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const phase = (i * 60) * Math.PI / 180;
        const x = 395 + i * 40 + 10 * Math.sin(phase);
        return (
          <g key={i} transform={`translate(${x}, 105)`}>
            <circle cx={0} cy={0} r={6} className="dg-fill-accent-2 dg-accent-2" />
            <Label x={0} y={0} className="dg-text dg-bold dg-text-small">−</Label>
          </g>
        );
      })}

      <Arrow x1={390} y1={145} x2={610} y2={145} className="dg-accent-2" head={10} headClassName="dg-dot-accent-2" />
      <Label x={500} y={160} className="dg-text-accent-2 dg-bold">Net electron drift</Label>
      <Label x={500} y={175} className="dg-text-small dg-text-muted">Drift speed ~ mm/s, but signal travels near light speed</Label>

      {/* Key formula */}
      <MathLabel x={320} y={240} w={300} h={50} anchor="middle" tex="I = \frac{Q}{t}" size="large" tone="accent" />
      <Label x={320} y={275} className="dg-text-small dg-text-muted">Current = charge / time | unit: ampere (A) = coulomb / second</Label>
    </Svg>
  );
}

export default ElectricCurrentFlow;