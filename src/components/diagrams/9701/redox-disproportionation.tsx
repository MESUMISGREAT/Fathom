/**
 * Disproportionation of chlorine in cold alkali: from oxidation number 0, some chlorine is reduced
 * to -1 (chloride) and some is oxidised to +1 (chlorate(I)). One element goes both ways.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-redox-disproportionation';

const W = 560;
const H = 380;

export function RedoxDisproportionation() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Chlorine disproportionates in cold alkali
      </Label>

      {/* start box */}
      <rect x={40} y={150} width={170} height={86} rx={10} className="dg-fill-muted" opacity={0.5} />
      <Label x={125} y={172} className="dg-text-small dg-text-muted">
        chlorine in
      </Label>
      <MathLabel x={125} y={192} tex="\text{Cl}_2" w={70} h={26} size="small" />
      <Label x={125} y={214} className="dg-text-small dg-text-muted">
        oxidation number
      </Label>
      <Label x={125} y={230} className="dg-text-accent">
        0
      </Label>

      {/* reduced box */}
      <rect x={350} y={62} width={170} height={86} rx={10} className="dg-fill-accent" opacity={0.75} />
      <Label x={435} y={88} className="dg-text-small dg-text-muted">
        chloride in NaCl
      </Label>
      <MathLabel
        x={435}
        y={112}
        tex="\text{Cl}^-"
        w={80}
        h={28}
        size="small"
        tone="accent"
      />
      <Label x={435} y={136} className="dg-text-accent">
        -1 (reduced)
      </Label>

      {/* oxidised box */}
      <rect x={350} y={238} width={170} height={86} rx={10} className="dg-fill-accent-2" opacity={0.75} />
      <Label x={435} y={264} className="dg-text-small dg-text-muted">
        chlorate(I) in NaOCl
      </Label>
      <MathLabel
        x={435}
        y={288}
        tex="\text{ClO}^-"
        w={80}
        h={28}
        size="small"
        tone="accent-2"
      />
      <Label x={435} y={312} className="dg-text-accent-2">
        +1 (oxidised)
      </Label>

      {/* arrows */}
      <Arrow x1={218} y1={170} x2={340} y2={112} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow
        x1={218}
        y1={216}
        x2={340}
        y2={274}
        className="dg-accent-2"
        headClassName="dg-dot-accent-2"
      />
      <Label x={286} y={118} className="dg-text-small dg-text-accent">
        gains e⁻
      </Label>
      <Label x={286} y={266} className="dg-text-small dg-text-accent-2">
        loses e⁻
      </Label>

      <MathLabel
        x={W / 2}
        y={350}
        tex="\text{Cl}_2 + 2\text{NaOH} \rightarrow \text{NaCl} + \text{NaOCl} + \text{H}_2\text{O}"
        w={430}
        h={28}
        size="small"
      />
    </Svg>
  );
}

export default RedoxDisproportionation;
