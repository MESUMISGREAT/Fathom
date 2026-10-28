/**
 * A formation cycle: reactants on the left, products on the right, and the elements in their
 * standard states at the bottom. The reaction goes directly across the top; the other route drops
 * to the elements and climbs back up.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-hess-law-formation-cycle';

const W = 660;
const H = 430;

export function HessLawFormationCycle() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Route the reaction through the elements
      </Label>

      {/* reactants / products */}
      <rect x={34} y={80} width={170} height={54} rx={8} className="dg-fill-muted" />
      <Label x={119} y={100} className="dg-text-small">
        reactants
      </Label>
      <Label x={119} y={118} className="dg-text-small dg-text-muted">
        as in the equation
      </Label>

      <rect x={456} y={80} width={170} height={54} rx={8} className="dg-fill-muted" />
      <Label x={541} y={100} className="dg-text-small">
        products
      </Label>
      <Label x={541} y={118} className="dg-text-small dg-text-muted">
        as in the equation
      </Label>

      {/* direct reaction */}
      <Arrow x1={208} y1={96} x2={452} y2={96} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={330} y={70} tex="\Delta H_r^{\ominus}" w={120} h={30} size="small" />

      {/* elements at the bottom */}
      <rect x={206} y={286} width={248} height={54} rx={8} className="dg-fill-muted" />
      <Label x={330} y={306} className="dg-text-small">
        elements in their standard states
      </Label>
      <Label x={330} y={324} className="dg-text-small dg-text-muted">
        e.g. C(s) + 2H₂(g) + ½O₂(g)
      </Label>

      {/* reactants down to elements */}
      <Arrow x1={150} y1={138} x2={272} y2={282} className="dg-line" />
      <MathLabel x={168} y={228} tex="-\sum \Delta H_f^{\ominus}(\text{reactants})" w={210} h={30} size="small" anchor="end" />

      {/* elements up to products */}
      <Arrow x1={390} y1={282} x2={512} y2={140} className="dg-line" />
      <MathLabel x={506} y={228} tex="+\sum \Delta H_f^{\ominus}(\text{products})" w={210} h={30} size="small" anchor="start" />

      <MathLabel
        x={W / 2}
        y={H - 40}
        tex="\Delta H_r^{\ominus} = \sum \Delta H_f^{\ominus}(\text{products}) - \sum \Delta H_f^{\ominus}(\text{reactants})"
        w={560}
        h={32}
      />
    </Svg>
  );
}

export default HessLawFormationCycle;
