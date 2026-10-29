/**
 * Microscopic view of current: I = nAvq
 * Shows a cross-section of a conductor with charge carriers drifting.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-electric-current-microscopic';

const W = 640;
const H = 320;

export function ElectricCurrentMicroscopic() {
  return (
    <Svg width={W} height={H}>
      {/* Title */}
      <Label x={320} y={30} className="dg-text dg-bold">Current at the microscopic level: I = n A v q</Label>

      {/* Wire cross-section */}
      <rect x={120} y={60} width={400} height={80} className="dg-fill-muted" rx={4} />
      <line x1={120} y1={100} x2={520} y2={100} className="dg-line" />

      {/* Labels for n, A, v, q */}
      <MathLabel x={70} y={100} w={60} h={40} anchor="end" tex="A" size="large" tone="accent" />
      <Label x={55} y={100} anchor="end" className="dg-text dg-bold">Cross-section</Label>
      <Label x={55} y={115} anchor="end" className="dg-text-small dg-text-muted">area</Label>

      <Arrow x1={320} y1={60} x2={320} y2={40} className="dg-accent" head={8} headClassName="dg-dot-accent" />
      <Label x={320} y={25} className="dg-text-accent dg-bold" anchor="middle">v (drift velocity)</Label>

      {/* Charge carriers in the volume */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <g key={i} transform={`translate(${140 + i * 40}, 100)`}>
          <circle cx={0} cy={0} r={7} className="dg-fill-accent-2 dg-accent-2" />
          <Label x={0} y={0} className="dg-text dg-bold dg-text-small">q</Label>
        </g>
      ))}

      {/* Volume element indication */}
      <line x1={140} y1={145} x2={500} y2={145} className="dg-thin dg-dashed" />
      <Arrow x1={140} y1={140} x2={140} y2={145} className="dg-thin" head={5} headClassName="dg-dot" />
      <Arrow x1={500} y1={140} x2={500} y2={145} className="dg-thin" head={5} headClassName="dg-dot" />
      <Label x={320} y={155} className="dg-text-small dg-text-muted">Length v × Δt — volume = A × v × Δt</Label>

      {/* Number density n */}
      <Label x={70} y={175} anchor="end" className="dg-text dg-bold">n = number density</Label>
      <Label x={70} y={190} anchor="end" className="dg-text-small dg-text-muted">(carriers per m³)</Label>

      {/* Charge q */}
      <Label x={70} y={215} anchor="end" className="dg-text dg-bold">q = charge per carrier</Label>
      <Label x={70} y={230} anchor="end" className="dg-text-small dg-text-muted">(e = 1.60 × 10⁻¹⁹ C for electrons)</Label>

      {/* Derivation boxes */}
      <g transform="translate(380, 170)">
        <rect x={0} y={0} width={240} height={130} className="dg-fill-muted" rx={4} />
        <Label x={10} y={20} className="dg-text dg-bold">In time Δt:</Label>
        <MathLabel x={10} y={50} w={220} h={30} anchor="start" tex="\text{Volume} = A \times v \Delta t" size="small" />
        <MathLabel x={10} y={80} w={220} h={30} anchor="start" tex="\text{Carriers in volume} = n A v \Delta t" size="small" />
        <MathLabel x={10} y={110} w={220} h={30} anchor="start" tex="\text{Charge passing} = n A v \Delta t \times q" size="small" tone="accent" />
        <MathLabel x={10} y={140} w={220} h={30} anchor="start" tex="I = \frac{\Delta Q}{\Delta t} = n A v q" size="small" tone="accent-2" />
      </g>

      {/* Typical values */}
      <g transform="translate(40, 250)">
        <Label x={0} y={0} className="dg-text dg-bold">Typical values for copper:</Label>
        <Label x={0} y={20} className="dg-text-small">n ≈ 8.5 × 10²⁸ m⁻³ | q = 1.60 × 10⁻¹⁹ C</Label>
        <Label x={0} y={40} className="dg-text-small">I = 1 A, A = 1 mm² → v ≈ 0.07 mm/s (slow drift!)</Label>
      </g>
    </Svg>
  );
}

export default ElectricCurrentMicroscopic;