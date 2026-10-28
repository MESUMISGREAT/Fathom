/**
 * Exothermic versus endothermic: two enthalpy-level pictures side by side, with a
 * thermometer showing what happens to the surroundings in each case.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-enthalpy-change-exo-endo';

const W = 620;
const H = 320;

export function EnthalpyChangeExoEndo() {
  return (
    <Svg width={W} height={H}>
      <Label x={160} y={26} className="dg-text dg-bold">
        Exothermic
      </Label>
      <Label x={462} y={26} className="dg-text dg-bold">
        Endothermic
      </Label>

      {/* enthalpy axes */}
      <line x1={44} y1={262} x2={44} y2={70} className="dg-muted" />
      <path d="M40,78 L44,68 L48,78 Z" className="dg-dot" />
      <Label x={30} y={92} anchor="middle" className="dg-text-small dg-text-muted">
        enthalpy
      </Label>
      <line x1={344} y1={262} x2={344} y2={70} className="dg-muted" />
      <path d="M340,78 L344,68 L348,78 Z" className="dg-dot" />
      <Label x={332} y={92} anchor="middle" className="dg-text-small dg-text-muted">
        enthalpy
      </Label>

      {/* left: reactants high, products low */}
      <line x1={60} y1={262} x2={300} y2={262} className="dg-grid" />
      <rect x={74} y={104} width={110} height={16} className="dg-fill-accent-2 dg-line" />
      <rect x={74} y={216} width={110} height={16} className="dg-fill-accent dg-line" />
      <Label x={129} y={86} className="dg-text-small">
        reactants
      </Label>
      <Label x={129} y={252} className="dg-text-small">
        products
      </Label>
      <Arrow x1={210} y1={122} x2={210} y2={212} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={232} y={168} tex="\Delta H < 0" w={86} h={26} anchor="start" tone="accent" size="small" />
      <Label x={180} y={290} className="dg-text-small dg-text-muted">
        surroundings warm up
      </Label>

      {/* right: reactants low, products high */}
      <line x1={360} y1={262} x2={600} y2={262} className="dg-grid" />
      <rect x={374} y={216} width={110} height={16} className="dg-fill-accent-2 dg-line" />
      <rect x={374} y={104} width={110} height={16} className="dg-fill-accent dg-line" />
      <Label x={429} y={252} className="dg-text-small">
        reactants
      </Label>
      <Label x={429} y={86} className="dg-text-small">
        products
      </Label>
      <Arrow x1={510} y1={212} x2={510} y2={122} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={532} y={168} tex="\Delta H > 0" w={70} h={26} anchor="start" tone="accent" size="small" />
      <Label x={480} y={290} className="dg-text-small dg-text-muted">
        surroundings cool down
      </Label>

      <Label x={W / 2} y={H - 8} className="dg-text-small dg-text-muted">
        total energy is conserved — it has only moved between chemicals and surroundings
      </Label>
    </Svg>
  );
}

export default EnthalpyChangeExoEndo;
