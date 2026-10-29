/**
 * Potential difference and energy transfer in circuits.
 * Shows energy per coulomb (voltage) across battery and components.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-potential-difference-energy';

const W = 720;
const H = 380;

export function PotentialDifferenceEnergy() {
  return (
    <Svg width={W} height={H}>
      {/* Title */}
      <Label x={W / 2} y={25} className="dg-text dg-bold" anchor="middle">
        Potential difference = energy per unit charge
      </Label>

      {/* ==================== Battery (source) ==================== */}
      <Label x={80} y={60} className="dg-text dg-bold" anchor="middle">Battery (source)</Label>

      {/* Battery symbol */}
      <rect x={30} y={80} width={20} height={60} className="dg-fill-muted" rx={2} />
      <rect x={33} y={85} width={14} height={20} className="dg-fill-accent" rx={1} />
      <rect x={33} y={125} width={14} height={15} className="dg-fill-accent-2" rx={1} />
      <Label x={40} y={72} anchor="middle" className="dg-text-small">+</Label>
      <Label x={40} y={148} anchor="middle" className="dg-text-small">−</Label>

      {/* Energy arrow UP (chemical work on charges) */}
      <Arrow x1={80} y1={90} x2={80} y2={110} className="dg-accent" head={10} headClassName="dg-dot-accent" />
      <Label x={95} y={100} className="dg-text-accent dg-bold">emf ε</Label>
      <MathLabel x={95} y={115} w={80} h={30} tex="W = \\varepsilon Q" size="small" tone="accent" />
      <Label x={95} y={135} className="dg-text-small dg-text-muted">Chemical → electrical energy</Label>

      {/* Charge flow arrow */}
      <Arrow x1={80} y1={155} x2={80} y2={180} className="dg-line" head={8} headClassName="dg-dot" />
      <Label x={95} y={170} className="dg-text-small">Charge flow</Label>

      {/* ==================== Wire (zero p.d.) ==================== */}
      <Label x={200} y={60} className="dg-text dg-bold" anchor="middle">Connecting wires</Label>
      <line x1={110} y1={110} x2={290} y2={110} className="dg-line" strokeWidth={3} />
      <MathLabel x={200} y={95} w={120} h={30} anchor="middle" tex="V \\approx 0" size="small" tone="muted" />
      <Label x={200} y={130} className="dg-text-small dg-text-muted">Ideal wire: no energy loss</Label>

      {/* ==================== Resistor (load) ==================== */}
      <Label x={400} y={60} className="dg-text dg-bold" anchor="middle">Resistor / bulb (load)</Label>

      {/* Resistor symbol */}
      <rect x={350} y={85} width={100} height={50} className="dg-fill-muted" rx={4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={355 + i * 18}
          y1={85}
          x2={365 + i * 18}
          y2={135}
          className="dg-accent"
          strokeWidth={2}
        />
      ))}
      <Label x={400} y={80} anchor="middle" className="dg-text-small dg-text-accent">+</Label>
      <Label x={400} y={140} anchor="middle" className="dg-text-small dg-text-accent-2">−</Label>

      {/* Voltage label */}
      <Arrow x1={350} y1={70} x2={450} y2={70} className="dg-accent" head={8} headClassName="dg-dot-accent" double={true} />
      <MathLabel x={400} y={55} w={100} h={30} anchor="middle" tex="V = \\frac{W}{Q}" size="large" tone="accent" />
      <Label x={400} y={160} className="dg-text-small dg-text-muted">V = 12 V → 12 J per coulomb</Label>

      {/* Energy transfer arrow DOWN */}
      <Arrow x1={400} y1={145} x2={400} y2={180} className="dg-accent-2" head={10} headClassName="dg-dot-accent-2" />
      <Label x={380} y={170} className="dg-text-accent-2 dg-bold">Heating</Label>
      <MathLabel x={420} y={165} w={120} h={30} tex="W = V Q = I^2 R t" size="small" tone="accent-2" />

      {/* ==================== Energy accounting ==================== */}
      <Label x={590} y={60} className="dg-text dg-bold" anchor="middle">Energy accounting</Label>

      {/* Battery box */}
      <rect x={520} y={85} width={170} height={100} className="dg-fill-muted" rx={6} />
      <Label x={605} y={100} className="dg-text dg-bold" anchor="middle">Battery (source)</Label>
      <Label x={535} y={120} className="dg-text-small">Supplies: +εQ</Label>
      <Label x={535} y={140} className="dg-text-small">Chemical energy ↓</Label>
      <Label x={535} y={160} className="dg-text-small">Electrical energy ↑</Label>

      {/* Resistor box */}
      <rect x={520} y={205} width={170} height={100} className="dg-fill-muted" rx={6} />
      <Label x={605} y={220} className="dg-text dg-bold" anchor="middle">Resistor (load)</Label>
      <Label x={535} y={240} className="dg-text-small">Receives: +VQ</Label>
      <Label x={535} y={260} className="dg-text-small">Electrical energy ↓</Label>
      <Label x={535} y={280} className="dg-text-small">Thermal energy ↑</Label>

      {/* Conservation note */}
      <rect x={520} y={320} width={170} height={45} className="dg-fill-accent" rx={6} opacity={0.15} />
      <MathLabel x={605} y={330} w={160} h={30} anchor="middle" tex="\varepsilon = \\sum V" size="large" tone="accent" />
      <Label x={605} y={355} className="dg-text-small dg-text-accent" anchor="middle">Energy conserved around loop</Label>
    </Svg>
  );
}

export default PotentialDifferenceEnergy;