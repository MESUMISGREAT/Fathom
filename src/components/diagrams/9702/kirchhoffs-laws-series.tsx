/**
 * Resistors in series: one path, so the same current passes through both
 * resistors, the p.d.s add and so do the resistances.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Cell, CurrentArrow, Resistor, Wire } from './kirchhoffs-laws-kit';

export const diagramKey = 'phys-kirchhoffs-laws-series';

const W = 640;
const H = 320;

export function KirchhoffsLawsSeries() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={24} className="dg-text dg-bold">
        Series: the same current through both resistors
      </Label>

      {/* Loop with the cell on the left and the two resistors along the top */}
      <Wire x1={110} y1={75} x2={110} y2={144} />
      <Cell x={110} y={156} vertical />
      <Wire x1={110} y1={168} x2={110} y2={225} />

      <Wire x1={110} y1={75} x2={255} y2={75} />
      <Resistor x={290} y={75} />
      <Wire x1={325} y1={75} x2={415} y2={75} />
      <Resistor x={450} y={75} />
      <Wire x1={485} y1={75} x2={570} y2={75} />

      <Wire x1={570} y1={75} x2={570} y2={225} />
      <Wire x1={570} y1={225} x2={110} y2={225} />

      {/* Current, clockwise */}
      <CurrentArrow x1={345} y1={75} x2={400} y2={75} />
      <CurrentArrow x1={570} y1={110} x2={570} y2={175} />
      <CurrentArrow x1={500} y1={225} x2={440} y2={225} />

      <Label x={372} y={52} className="dg-text-accent dg-bold dg-text-small">
        I = 1.2 A
      </Label>

      <MathLabel x={88} y={156} w={120} h={32} anchor="end" tex="12\ \text{V}" tone="accent" />
      <Label x={88} y={178} anchor="end" className="dg-text-small dg-text-muted">
        e.m.f.
      </Label>

      <MathLabel x={290} y={44} w={150} h={32} tex="R_1 = 4.0\ \Omega" />
      <MathLabel x={450} y={44} w={150} h={32} tex="R_2 = 6.0\ \Omega" />

      <MathLabel x={290} y={105} w={150} h={32} tex="V_1 = 4.8\ \text{V}" tone="accent-2" />
      <MathLabel x={450} y={105} w={150} h={32} tex="V_2 = 7.2\ \text{V}" tone="accent-2" />

      <Label x={320} y={255} className="dg-text-small dg-text-muted">
        the two p.d.s add up to the e.m.f.: 4.8 V + 7.2 V = 12 V
      </Label>

      <MathLabel
        x={320}
        y={291}
        w={480}
        h={34}
        tex="R = R_1 + R_2 = 4.0 + 6.0 = 10\ \Omega"
        tone="accent"
      />
    </Svg>
  );
}

export default KirchhoffsLawsSeries;
