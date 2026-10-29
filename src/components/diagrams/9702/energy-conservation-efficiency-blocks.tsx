/**
 * Efficiency as a block diagram: 100 J of electrical energy goes into a motor,
 * which delivers 60 J of useful kinetic energy and dissipates 40 J as thermal
 * energy and sound, so the efficiency is 0.60 = 60%.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-energy-conservation-efficiency-blocks';

const W = 640;
const H = 320;

export function EnergyConservationEfficiencyBlocks() {
  return (
    <Svg width={W} height={H}>
      <Label x={240} y={26} className="dg-text dg-bold">
        Where the input energy goes
      </Label>
      <rect x={30} y={110} width={150} height={60} className="dg-fill-accent-2 dg-line" />
      <Label x={105} y={130} className="dg-text">
        energy input
      </Label>
      <Label x={105} y={154} className="dg-text dg-bold">
        100 J
      </Label>
      <Arrow x1={182} y1={140} x2={238} y2={140} className="dg-line" head={10} />
      <rect x={246} y={100} width={154} height={80} className="dg-fill-accent dg-accent" />
      <Label x={323} y={130} className="dg-text dg-bold">
        electric motor
      </Label>
      <Label x={323} y={154} className="dg-text-small dg-text-muted">
        efficiency 60%
      </Label>
      {/* useful branch */}
      <Arrow x1={400} y1={120} x2={470} y2={120} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={478} y={104} anchor="start" className="dg-text-small dg-text-accent-2">
        useful output
      </Label>
      <Label x={478} y={130} anchor="start" className="dg-text dg-bold">
        60 J
      </Label>
      <Label x={478} y={150} anchor="start" className="dg-text-small dg-text-muted">
        kinetic energy
      </Label>
      {/* dissipated branch */}
      <Arrow x1={400} y1={162} x2={470} y2={214} className="dg-muted" headClassName="dg-dot" />
      <Label x={478} y={196} anchor="start" className="dg-text dg-bold">
        40 J
      </Label>
      <Label x={478} y={220} anchor="start" className="dg-text-small dg-text-muted">
        dissipated
      </Label>
      <Label x={478} y={240} anchor="start" className="dg-text-small dg-text-muted">
        thermal + sound
      </Label>
      <MathLabel
        x={280}
        y={284}
        w={420}
        h={44}
        tex={String.raw`\text{efficiency} = \dfrac{60\ \text{J}}{100\ \text{J}} = 0.60 = 60\%`}
      />
    </Svg>
  );
}

export default EnergyConservationEfficiencyBlocks;
