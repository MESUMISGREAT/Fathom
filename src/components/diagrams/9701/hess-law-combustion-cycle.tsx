/**
 * A combustion cycle: the compound at the top, the shared oxides at the bottom, and the elements
 * on the sides. Both routes finish at the same oxides, so the totals are equal.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-hess-law-combustion-cycle';

const W = 660;
const H = 420;

export function HessLawCombustionCycle() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Everything burns to the same oxides
      </Label>

      {/* compound */}
      <rect x={230} y={64} width={200} height={50} rx={8} className="dg-fill-muted" />
      <Label x={330} y={82} className="dg-text-small">
        compound (1 mol)
      </Label>
      <Label x={330} y={100} className="dg-text-small dg-text-muted">
        e.g. C₂H₆(g)
      </Label>

      {/* oxides */}
      <rect x={196} y={286} width={268} height={50} rx={8} className="dg-fill-muted" />
      <Label x={330} y={304} className="dg-text-small">
        complete combustion products
      </Label>
      <Label x={330} y={322} className="dg-text-small dg-text-muted">
        CO₂(g) + H₂O(l)
      </Label>

      {/* direct combustion */}
      <Arrow x1={330} y1={118} x2={330} y2={282} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={346} y={200} tex="\Delta H_c^{\ominus}(\text{compound})" w={230} h={30} size="small" anchor="start" />

      {/* elements */}
      <rect x={34} y={176} width={150} height={50} rx={8} className="dg-fill-muted" />
      <Label x={109} y={194} className="dg-text-small">
        its elements
      </Label>
      <Label x={109} y={212} className="dg-text-small dg-text-muted">
        2C(s) + 3H₂(g)
      </Label>

      <Arrow x1={238} y1={100} x2={148} y2={172} className="dg-line" />
      <MathLabel x={128} y={132} tex="-\Delta H_f^{\ominus}" w={110} h={28} size="small" anchor="end" />

      <Arrow x1={136} y1={228} x2={214} y2={282} className="dg-line" />
      <MathLabel x={40} y={352} tex="\text{via the elements: } \sum \Delta H_c^{\ominus}(\text{elements})" w={300} h={30} size="small" anchor="start" />

      <MathLabel
        x={W / 2}
        y={H - 34}
        tex="\Delta H_f^{\ominus}(\text{compound}) = \Delta H_c^{\ominus}(\text{compound}) - \sum \Delta H_c^{\ominus}(\text{elements})"
        w={600}
        h={32}
        size="small"
      />
    </Svg>
  );
}

export default HessLawCombustionCycle;
