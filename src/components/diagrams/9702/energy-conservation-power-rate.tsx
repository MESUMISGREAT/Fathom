/**
 * Power as the rate of energy transfer: two hoists each lift an identical
 * 600 J load, one in 4.0 s and one in 12 s, so their powers are 150 W and
 * 50 W — the same work done, but not at the same rate.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-energy-conservation-power-rate';

const W = 640;
const H = 300;

export function EnergyConservationPowerRate() {
  return (
    <Svg width={W} height={H}>
      {/* hoist A */}
      <Label x={170} y={26} className="dg-text dg-bold">
        Hoist A
      </Label>
      <line x1={120} y1={60} x2={220} y2={60} className="dg-line" />
      <line x1={170} y1={60} x2={170} y2={150} className="dg-thin" />
      <rect x={120} y={150} width={100} height={60} className="dg-fill-accent dg-accent" />
      <Label x={170} y={182} className="dg-text dg-bold">
        600 J
      </Label>
      <Label x={182} y={112} anchor="start" className="dg-text-small dg-text-muted">
        lifts the load in 4.0 s
      </Label>
      <MathLabel
        x={170}
        y={250}
        w={300}
        h={48}
        tex={String.raw`P = \dfrac{600\ \text{J}}{4.0\ \text{s}} = 150\ \text{W}`}
      />
      {/* hoist B */}
      <line x1={380} y1={40} x2={380} y2={276} className="dg-grid" />
      <Label x={470} y={26} className="dg-text dg-bold">
        Hoist B
      </Label>
      <line x1={420} y1={60} x2={520} y2={60} className="dg-line" />
      <line x1={470} y1={60} x2={470} y2={150} className="dg-thin" />
      <rect x={420} y={150} width={100} height={60} className="dg-fill-accent dg-accent" />
      <Label x={470} y={182} className="dg-text dg-bold">
        600 J
      </Label>
      <Label x={482} y={112} anchor="start" className="dg-text-small dg-text-muted">
        lifts the load in 12 s
      </Label>
      <MathLabel
        x={470}
        y={250}
        w={300}
        h={48}
        tex={String.raw`P = \dfrac{600\ \text{J}}{12\ \text{s}} = 50\ \text{W}`}
      />
      <Label x={320} y={288} className="dg-text-small dg-text-muted">
        same work done, different power
      </Label>
    </Svg>
  );
}

export default EnergyConservationPowerRate;
