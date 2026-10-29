/**
 * Lifting a load at a steady speed: the lifting force equals the load's weight,
 * so the work done is Fs and the power is W/t. A crane cable holds a 1500 N
 * load lifted through 6.0 m in 10 s, giving 9000 J of work and 900 W.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-energy-conservation-power-lift';

const W = 640;
const H = 340;

export function EnergyConservationPowerLift() {
  return (
    <Svg width={W} height={H}>
      <Label x={170} y={26} className="dg-text dg-bold">
        Lifting a load
      </Label>
      <line x1={150} y1={46} x2={150} y2={118} className="dg-line" />
      <Arrow x1={150} y1={116} x2={150} y2={70} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <rect x={110} y={118} width={80} height={64} className="dg-fill-accent dg-accent" />
      <Label x={150} y={140} className="dg-text-small">
        load
      </Label>
      <Label x={150} y={164} className="dg-text dg-bold">
        1500 N
      </Label>
      <Label x={162} y={58} anchor="start" className="dg-text-small dg-text-accent-2">
        F = 1500 N
      </Label>
      {/* height lifted */}
      <line x1={110} y1={118} x2={250} y2={118} className="dg-muted dg-dashed" />
      <line x1={110} y1={182} x2={250} y2={182} className="dg-muted dg-dashed" />
      <Arrow x1={268} y1={118} x2={268} y2={182} double className="dg-line" head={8} />
      <Label x={286} y={150} anchor="start" className="dg-text">
        6.0 m
      </Label>
      <Label x={150} y={206} className="dg-text-small dg-text-muted">
        steady speed, so the lifting force = the weight
      </Label>
      <MathLabel
        x={320}
        y={252}
        w={460}
        h={44}
        tex={String.raw`W = Fs = 1500\ \text{N} \times 6.0\ \text{m} = 9000\ \text{J}`}
      />
      <MathLabel
        x={320}
        y={302}
        w={460}
        h={44}
        tex={String.raw`P = \dfrac{W}{t} = \dfrac{9000\ \text{J}}{10\ \text{s}} = 900\ \text{W}`}
      />
    </Svg>
  );
}

export default EnergyConservationPowerLift;
