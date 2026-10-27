/**
 * Sankey diagram for a motor: 2000 J of energy input flows through the motor
 * and splits into a useful kinetic-energy branch (1400 J, 70% of the width)
 * and a dissipated branch (600 J, 30%). The branch widths are drawn to scale.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-energy-conservation-sankey';

const W = 640;
const H = 320;

export function EnergyConservationSankey() {
  return (
    <Svg width={W} height={H}>
      <Label x={240} y={26} className="dg-text dg-bold">
        A Sankey diagram of a motor
      </Label>
      <Label x={95} y={88} className="dg-text-small dg-text-muted">
        energy input
      </Label>
      <Label x={190} y={88} className="dg-text-small dg-text-muted">
        motor
      </Label>
      {/* input flow: 2000 J */}
      <rect x={40} y={100} width={110} height={120} className="dg-fill-accent-2 dg-line" />
      <Label x={95} y={152} className="dg-text dg-bold">
        2000 J
      </Label>
      <Label x={95} y={176} className="dg-text-small">
        in
      </Label>
      {/* motor */}
      <rect x={150} y={100} width={70} height={120} className="dg-fill-accent dg-accent" />
      {/* useful branch: 1400 J of 2000 J -> 84 of 120 px */}
      <rect x={220} y={100} width={250} height={84} className="dg-fill-accent-2 dg-line" />
      <Label x={345} y={130} className="dg-text-small">
        useful output: kinetic energy
      </Label>
      <Label x={345} y={156} className="dg-text dg-bold">
        1400 J (70%)
      </Label>
      {/* dissipated branch: 600 J -> 36 px */}
      <rect x={220} y={184} width={250} height={36} className="dg-fill-muted dg-line" />
      <Label x={345} y={202} className="dg-text-small dg-bold">
        dissipated: 600 J (30%)
      </Label>
      <MathLabel
        x={320}
        y={272}
        w={440}
        h={44}
        tex={String.raw`\text{efficiency} = \dfrac{1400\ \text{J}}{2000\ \text{J}} = 0.70 = 70\%`}
      />
      <Label x={320} y={308} className="dg-text-small dg-text-muted">
        the two branches always add back to 2000 J
      </Label>
    </Svg>
  );
}

export default EnergyConservationSankey;
