/**
 * Potential difference: energy transferred per unit charge.
 * Shows a component with charge moving through it, gaining/losing energy.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-potential-difference-definition';

const W = 640;
const H = 320;

export function PotentialDifferenceDefinition() {
  return (
    <Svg width={W} height={H}>
      {/* Title */}
      <Label x={320} y={30} className="dg-text dg-bold">Potential difference = energy per unit charge</Label>

      {/* Component (resistor/lamp) */}
      <rect x={200} y={80} width={240} height={100} className="dg-fill-muted" rx={8} />
      <rect x={220} y={90} width={200} height={80} className="dg-fill-accent dg-accent" rx={4} />
      <MathLabel x={320} y={130} w={120} h={30} anchor="middle" tex="Component" size="large" tone="accent" />
      <Label x={320} y={155} className="dg-text-small dg-text-muted">(resistor, lamp, LED...)</Label>

      {/* Charge entering (left) */}
      <Arrow x1={150} y1={130} x2={200} y2={130} className="dg-line" head={10} />
      <Label x={100} y={115} className="dg-text-accent dg-bold">Charge Q enters</Label>
      <Label x={100} y={130} className="dg-text-small dg-text-accent">with energy E₁</Label>

      {/* Charge leaving (right) */}
      <Arrow x1={440} y1={130} x2={490} y2={130} className="dg-line" head={10} />
      <Label x={500} y={115} anchor="start" className="dg-text-accent-2 dg-bold">Charge Q leaves</Label>
      <Label x={500} y={130} anchor="start" className="dg-text-small dg-text-accent-2">with energy E₂</Label>

      {/* Energy transfer arrow */}
      <Arrow x1={320} y1={190} x2={320} y2={220} className="dg-accent" head={10} headClassName="dg-dot-accent" />
      <Label x={320} y={235} className="dg-text-accent dg-bold">Energy transferred = E₁ − E₂ = W</Label>

      {/* Definition box */}
      <g transform="translate(40, 250)">
        <rect x={0} y={0} width={560} height={60} className="dg-fill-muted" rx={4} />
        <MathLabel x={280} y={25} w={300} h={40} anchor="middle" tex="V = \frac{W}{Q}" size="large" tone="accent-2" />
        <Label x={280} y={55} className="dg-text-small dg-text-muted">Potential difference (V) = Work done (J) / Charge (C) | Unit: volt (V) = J/C</Label>
      </g>

      {/* Water analogy */}
      <g transform="translate(40, 80)">
        <Label x={0} y={0} className="dg-text dg-bold dg-text-accent">Analogy: Water pressure</Label>
        <Label x={0} y={20} className="dg-text-small">Charge Q ↔ Volume of water</Label>
        <Label x={0} y={35} className="dg-text-small">Energy W ↔ Work done by water pressure</Label>
        <Label x={0} y={50} className="dg-text-small">Voltage V ↔ Pressure difference (drives the flow)</Label>
        <Label x={0} y={65} className="dg-text-small dg-text-muted">(Analogy breaks down: water has mass, charge doesn't \"pile up\" the same way)</Label>
      </g>
    </Svg>
  );
}

export default PotentialDifferenceDefinition;