/**
 * Kirchhoff's second law: go once round a closed loop and the energy
 * transferred per unit charge by the cell equals the energy transferred per
 * unit charge in the resistors, so the e.m.f. equals the sum of the p.d.s.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Cell, CurrentArrow, Resistor, Wire } from './kirchhoffs-laws-kit';

export const diagramKey = 'phys-kirchhoffs-laws-loop';

const W = 640;
const H = 330;

export function KirchhoffsLawsLoop() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={24} className="dg-text dg-bold">
        One loop: e.m.f. = sum of the p.d.s
      </Label>

      {/* The loop: cell on the left, a resistor on the top and one on the bottom */}
      <Wire x1={150} y1={80} x2={150} y2={144} />
      <Cell x={150} y={156} vertical />
      <Wire x1={150} y1={168} x2={150} y2={230} />

      <Wire x1={150} y1={80} x2={275} y2={80} />
      <Resistor x={310} y={80} />
      <Wire x1={345} y1={80} x2={510} y2={80} />

      <Wire x1={510} y1={80} x2={510} y2={230} />

      <Wire x1={510} y1={230} x2={345} y2={230} />
      <Resistor x={310} y={230} />
      <Wire x1={275} y1={230} x2={150} y2={230} />

      {/* Conventional current, clockwise */}
      <CurrentArrow x1={390} y1={80} x2={455} y2={80} />
      <CurrentArrow x1={510} y1={120} x2={510} y2={185} />
      <CurrentArrow x1={255} y1={230} x2={190} y2={230} />
      <CurrentArrow x1={150} y1={136} x2={150} y2={112} />

      <Label x={420} y={58} className="dg-text-accent dg-bold dg-text-small">
        I = 2.0 A
      </Label>

      {/* Cell label outside the loop */}
      <MathLabel x={128} y={156} w={130} h={32} anchor="end" tex="12\ \text{V}" tone="accent" />
      <Label x={128} y={178} anchor="end" className="dg-text-small dg-text-muted">
        e.m.f.
      </Label>

      {/* Component values and p.d.s */}
      <MathLabel x={310} y={44} w={170} h={32} tex="R_1 = 4.0\ \Omega" />
      <MathLabel x={310} y={110} w={170} h={32} tex="V_1 = 8.0\ \text{V}" tone="accent-2" />
      <MathLabel x={310} y={266} w={170} h={32} tex="R_2 = 2.0\ \Omega" />
      <MathLabel x={310} y={200} w={170} h={32} tex="V_2 = 4.0\ \text{V}" tone="accent-2" />

      <MathLabel
        x={320}
        y={303}
        w={480}
        h={34}
        tex="12\ \text{V} = 8.0\ \text{V} + 4.0\ \text{V}"
        tone="accent"
      />
    </Svg>
  );
}

export default KirchhoffsLawsLoop;
