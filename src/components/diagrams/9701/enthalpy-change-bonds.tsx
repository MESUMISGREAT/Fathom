/**
 * Bond breaking costs energy, bond forming releases it; the balance decides the
 * sign of ΔH.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-enthalpy-change-bonds';

const W = 620;
const H = 300;

export function EnthalpyChangeBonds() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Two halves of every reaction
      </Label>

      <rect x={60} y={54} width={220} height={130} className="dg-fill-muted dg-thin" />
      <Label x={170} y={80} className="dg-text dg-bold">
        break bonds
      </Label>
      <Label x={170} y={104} className="dg-text-small dg-text-muted">
        in the reactants
      </Label>
      <Arrow x1={90} y1={170} x2={90} y2={136} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={108} y={128} tex="\text{energy in}" w={110} h={24} anchor="start" tone="accent" size="small" />
      <MathLabel x={108} y={158} tex="+\Sigma\ \text{bond energies}" w={200} h={24} anchor="start" tone="muted" size="small" />

      <rect x={340} y={54} width={220} height={130} className="dg-fill-muted dg-thin" />
      <Label x={450} y={80} className="dg-text dg-bold">
        form bonds
      </Label>
      <Label x={450} y={104} className="dg-text-small dg-text-muted">
        in the products
      </Label>
      <Arrow x1={370} y1={136} x2={370} y2={170} head={8} className="dg-accent-2" headClassName="dg-dot" />
      <MathLabel x={388} y={128} tex="\text{energy out}" w={110} h={24} anchor="start" tone="accent-2" size="small" />
      <MathLabel x={388} y={158} tex="-\Sigma\ \text{bond energies}" w={200} h={24} anchor="start" tone="muted" size="small" />

      <MathLabel x={W / 2} y={224} tex="\Delta H = \Sigma(\text{broken}) - \Sigma(\text{formed})" w={320} h={30} />

      <Label x={W / 2} y={262} className="dg-text-small dg-text-muted">
        more energy released than absorbed: exothermic, and the surroundings warm up
      </Label>
    </Svg>
  );
}

export default EnthalpyChangeBonds;
