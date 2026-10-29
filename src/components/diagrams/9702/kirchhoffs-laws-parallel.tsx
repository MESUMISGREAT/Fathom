/**
 * Resistors in parallel: each branch has the same p.d. across it, the
 * junction rule splits the current between the branches, and the combined
 * resistance is smaller than either branch.
 */
import { Label, MathLabel, Svg } from '../primitives';
import { Cell, CurrentArrow, Node, Resistor, Wire } from './kirchhoffs-laws-kit';

export const diagramKey = 'phys-kirchhoffs-laws-parallel';

const W = 640;
const H = 345;

export function KirchhoffsLawsParallel() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={24} className="dg-text dg-bold">
        Parallel: the same p.d. across each branch
      </Label>

      {/* Cell on the left, two branches on the right */}
      <Wire x1={110} y1={80} x2={110} y2={158} />
      <Cell x={110} y={170} vertical />
      <Wire x1={110} y1={182} x2={110} y2={260} />

      <Wire x1={110} y1={80} x2={450} y2={80} />
      <Wire x1={110} y1={260} x2={450} y2={260} />

      <Wire x1={310} y1={80} x2={310} y2={135} />
      <Resistor x={310} y={170} horizontal={false} />
      <Wire x1={310} y1={205} x2={310} y2={260} />

      <Wire x1={450} y1={80} x2={450} y2={135} />
      <Resistor x={450} y={170} horizontal={false} />
      <Wire x1={450} y1={205} x2={450} y2={260} />

      <Node x={310} y={80} />
      <Node x={310} y={260} />

      {/* Currents: I in, I1 and I2 down the branches */}
      <CurrentArrow x1={165} y1={80} x2={225} y2={80} label="I = 6.0 A" labelX={195} labelY={56} />
      <CurrentArrow x1={310} y1={92} x2={310} y2={126} label="I₁ = 2.0 A" labelX={334} labelY={106} anchor="start" />
      <CurrentArrow x1={450} y1={92} x2={450} y2={126} label="I₂ = 4.0 A" labelX={474} labelY={106} anchor="start" />
      <CurrentArrow x1={400} y1={260} x2={340} y2={260} />
      <CurrentArrow x1={240} y1={260} x2={180} y2={260} />

      <MathLabel x={88} y={170} w={120} h={32} anchor="end" tex="12\ \text{V}" tone="accent" />

      <MathLabel x={292} y={170} w={110} h={32} anchor="end" tex="6.0\ \Omega" />
      <MathLabel x={432} y={170} w={110} h={32} anchor="end" tex="3.0\ \Omega" />

      <Label x={310} y={288} className="dg-text-small dg-text-muted">
        each branch has the full 12 V across it
      </Label>

      <MathLabel
        x={320}
        y={320}
        w={600}
        h={46}
        size="small"
        tex="\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2} = \dfrac{1}{6.0} + \dfrac{1}{3.0} \ \Rightarrow\ R = 2.0\ \Omega"
        tone="accent"
      />
    </Svg>
  );
}

export default KirchhoffsLawsParallel;
