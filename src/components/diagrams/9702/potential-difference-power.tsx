/**
 * Electrical power: P = VI = I²R = V²/R
 * Shows the three equivalent forms with a circuit diagram.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-potential-difference-power';

const W = 640;
const H = 340;

export function PotentialDifferencePower() {
  return (
    <Svg width={W} height={H}>
      {/* Title */}
      <Label x={320} y={30} className="dg-text dg-bold">Electrical power: three equivalent formulas</Label>

      {/* Simple circuit */}
      <g transform="translate(80, 60)">
        {/* Battery */}
        <line x1={20} y1={60} x2={20} y2={140} className="dg-line" strokeWidth={3} />
        <line x1={20} y1={70} x2={40} y2={70} className="dg-line" strokeWidth={3} />
        <line x1={20} y1={130} x2={40} y2={130} className="dg-line" strokeWidth={1.5} />
        <Label x={30} y={50} className="dg-text dg-bold">+</Label>
        <Label x={30} y={150} className="dg-text dg-bold">−</Label>
        <Label x={30} y={170} className="dg-text-small dg-text-muted">V volts</Label>

        {/* Wires */}
        <line x1={40} y1={100} x2={100} y2={100} className="dg-line" />
        <line x1={160} y1={100} x2={220} y2={100} className="dg-line" />
        <line x1={220} y1={100} x2={220} y2={140} className="dg-line" />
        <line x1={20} y1={140} x2={220} y2={140} className="dg-line" />

        {/* Resistor */}
        <rect x={100} y={80} width={60} height={40} className="dg-fill-muted" rx={2} />
        <line x1={105} y1={85} x2={155} y2={85} className="dg-thin" />
        <line x1={105} y1={95} x2={155} y2={95} className="dg-thin" />
        <line x1={105} y1={105} x2={155} y2={105} className="dg-thin" />
        <Label x={130} y={70} className="dg-text dg-bold">R</Label>

        {/* Current arrow */}
        <Arrow x1={70} y1={70} x2={70} y2={85} className="dg-accent" head={8} headClassName="dg-dot-accent" />
        <Label x={70} y={55} className="dg-text-accent dg-bold">I</Label>

        {/* Voltage across R */}
        <Arrow x1={100} y1={65} x2={160} y2={65} className="dg-accent-2" head={8} headClassName="dg-dot-accent-2" double />
        <Label x={130} y={50} className="dg-text-accent-2 dg-bold">V</Label>
      </g>

      {/* Three power formulas */}
      <g transform="translate(380, 60)">
        <rect x={0} y={0} width={240} height={260} className="dg-fill-muted" rx={8} />
        <Label x={120} y={30} className="dg-text dg-bold">Power dissipated in R</Label>

        <MathLabel x={20} y={70} w={200} h={40} anchor="start" tex="P = V I" size="large" tone="accent" />
        <Label x={20} y={105} className="dg-text-small dg-text-muted">Most general: works for any component</Label>

        <MathLabel x={20} y={135} w={200} h={40} anchor="start" tex="P = I^2 R" size="large" tone="accent-2" />
        <Label x={20} y={170} className="dg-text-small dg-text-muted">Use when you know I and R (e.g. heating in wires)</Label>

        <MathLabel x={20} y={200} w={200} h={40} anchor="start" tex="P = \frac{V^2}{R}" size="large" tone="accent" />
        <Label x={20} y={235} className="dg-text-small dg-text-muted">Use when you know V and R (e.g. lamp brightness)</Label>
      </g>

      {/* Derivation box at bottom */}
      <g transform="translate(40, 240)">
        <rect x={0} y={0} width={560} height={90} className="dg-fill-muted" rx={4} />
        <Label x={10} y={20} className="dg-text dg-bold">Derivation (substitute V = IR from Ohm's law):</Label>
        <MathLabel x={10} y={50} w={260} h={30} anchor="start" tex="P = V I = (I R) I = I^2 R" size="small" />
        <MathLabel x={290} y={50} w={260} h={30} anchor="start" tex="P = V I = V \left(\frac{V}{R}\right) = \frac{V^2}{R}" size="small" />
        <Label x={10} y={80} className="dg-text-small dg-text-muted">All three give the same answer — pick the one matching what you know!</Label>
      </g>
    </Svg>
  );
}

export default PotentialDifferencePower;