/**
 * Kirchhoff's first law: the currents meeting at a junction.
 * Two currents arrive (2.0 A and 1.2 A), two leave (0.80 A and I), so the
 * student can see that charge is not used up at a junction.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { CurrentArrow, Node, Wire } from './kirchhoffs-laws-kit';

export const diagramKey = 'phys-kirchhoffs-laws-junction';

const W = 640;
const H = 330;

export function KirchhoffsLawsJunction() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={24} className="dg-text dg-bold">
        A junction: charge in = charge out
      </Label>

      {/* Wires meeting at the node */}
      <Wire x1={110} y1={150} x2={300} y2={150} />
      <Wire x1={300} y1={40} x2={300} y2={150} />
      <Wire x1={300} y1={150} x2={490} y2={150} />
      <Wire x1={300} y1={150} x2={300} y2={250} />

      {/* Current arrows: two in, two out */}
      <CurrentArrow x1={150} y1={150} x2={230} y2={150} label="2.0 A" labelX={190} labelY={126} />
      <CurrentArrow x1={300} y1={70} x2={300} y2={125} label="1.2 A" labelX={324} labelY={92} anchor="start" />
      <CurrentArrow x1={360} y1={150} x2={440} y2={150} label="0.80 A" labelX={400} labelY={126} />
      <CurrentArrow x1={300} y1={180} x2={300} y2={235} label="I" labelX={324} labelY={205} anchor="start" />

      <Node x={300} y={150} />

      <Label x={300} y={278} className="dg-text-small dg-text-muted">
        steady state: no charge piles up at the dot
      </Label>

      <MathLabel
        x={320}
        y={308}
        w={460}
        h={34}
        tex="2.0\ \text{A} + 1.2\ \text{A} = 0.80\ \text{A} + I"
        tone="accent"
      />
    </Svg>
  );
}

export default KirchhoffsLawsJunction;
