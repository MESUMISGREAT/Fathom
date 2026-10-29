/**
 * A mixed circuit for the problem-solving lesson: a 2.0 ohm resistor in series
 * with a parallel pair, solved with the junction rule and the loop rule.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Cell, CurrentArrow, Node, Resistor, Wire } from './kirchhoffs-laws-kit';

export const diagramKey = 'phys-kirchhoffs-laws-mixed';

const W = 640;
const H = 360;

export function KirchhoffsLawsMixed() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={24} className="dg-text dg-bold">
        One supply, two loops: reduce, then check with Kirchhoff
      </Label>

      <Wire x1={110} y1={80} x2={110} y2={153} />
      <Cell x={110} y={165} vertical />
      <Wire x1={110} y1={177} x2={110} y2={265} />

      <Wire x1={110} y1={80} x2={250} y2={80} />
      <Resistor x={285} y={80} />
      <Wire x1={320} y1={80} x2={520} y2={80} />

      <Wire x1={110} y1={265} x2={520} y2={265} />

      <Wire x1={400} y1={80} x2={400} y2={137} />
      <Resistor x={400} y={172} horizontal={false} />
      <Wire x1={400} y1={207} x2={400} y2={265} />

      <Wire x1={520} y1={80} x2={520} y2={137} />
      <Resistor x={520} y={172} horizontal={false} />
      <Wire x1={520} y1={207} x2={520} y2={265} />

      <Node x={400} y={80} />
      <Node x={400} y={265} />

      <CurrentArrow x1={165} y1={80} x2={225} y2={80} label="I = 3.0 A" labelX={195} labelY={56} />
      <CurrentArrow x1={400} y1={92} x2={400} y2={126} label="I₁ = 1.0 A" labelX={370} labelY={106} anchor="end" />
      <CurrentArrow x1={520} y1={92} x2={520} y2={126} label="I₂ = 2.0 A" labelX={496} labelY={106} anchor="end" />
      <CurrentArrow x1={470} y1={265} x2={410} y2={265} />
      <CurrentArrow x1={330} y1={265} x2={270} y2={265} />

      <MathLabel x={88} y={165} w={120} h={32} anchor="end" tex="12\ \text{V}" tone="accent" />

      <MathLabel x={285} y={48} w={130} h={32} tex="2.0\ \Omega" />
      <MathLabel x={420} y={172} w={110} h={32} anchor="start" tex="6.0\ \Omega" />
      <MathLabel x={540} y={172} w={110} h={32} anchor="start" tex="3.0\ \Omega" />

      <Label x={455} y={295} className="dg-text-small dg-text-muted">
        p.d. across the parallel pair = 6.0 V
      </Label>

      <MathLabel
        x={320}
        y={332}
        w={560}
        h={46}
        size="small"
        tex="R = 2.0 + \dfrac{6.0 \times 3.0}{6.0 + 3.0} = 4.0\ \Omega"
        tone="accent"
      />
    </Svg>
  );
}

export default KirchhoffsLawsMixed;
