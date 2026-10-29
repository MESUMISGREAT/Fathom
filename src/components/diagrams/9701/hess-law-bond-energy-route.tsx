/**
 * An energy-level picture of a bond-enthalpy calculation: reactants, up to separate gaseous atoms
 * (bonds broken), then down to products (bonds formed). The net drop is the reaction enthalpy.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-hess-law-bond-energy-route';

const W = 660;
const H = 400;

const Y_REACT = 300;
const Y_ATOMS = 96;
const Y_PROD = 214;

export function HessLawBondEnergyRoute() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Break every bond, then make the product bonds
      </Label>

      {/* reactant level */}
      <line x1={70} y1={Y_REACT} x2={210} y2={Y_REACT} className="dg-line" strokeWidth={3} />
      <Label x={140} y={Y_REACT + 26} className="dg-text-small">
        reactants
      </Label>

      {/* atoms level */}
      <line x1={250} y1={Y_ATOMS} x2={410} y2={Y_ATOMS} className="dg-accent" strokeWidth={3} />
      <Label x={330} y={Y_ATOMS - 22} className="dg-text-small dg-text-accent">
        separate gaseous atoms
      </Label>

      {/* product level */}
      <line x1={470} y1={Y_PROD} x2={610} y2={Y_PROD} className="dg-line" strokeWidth={3} />
      <Label x={540} y={Y_PROD + 26} className="dg-text-small">
        products
      </Label>

      {/* up: break bonds */}
      <Arrow x1={212} y1={Y_REACT - 6} x2={256} y2={Y_ATOMS + 8} className="dg-line" />
      <Label x={60} y={150} anchor="start" className="dg-text-small dg-text-muted">
        break bonds:
      </Label>
      <MathLabel x={70} y={172} tex="+\sum \text{bond enthalpies broken}" w={210} h={30} size="small" anchor="start" />

      {/* down: form bonds */}
      <Arrow x1={404} y1={Y_ATOMS + 8} x2={466} y2={Y_PROD - 6} className="dg-line" />
      <Label x={462} y={148} anchor="start" className="dg-text-small dg-text-muted">
        form bonds:
      </Label>
      <MathLabel x={462} y={174} tex="-\sum \text{bond enthalpies formed}" w={230} h={30} size="small" anchor="start" />

      {/* net */}
      <Arrow x1={640} y1={Y_PROD} x2={640} y2={Y_REACT} className="dg-muted" head={7} headClassName="dg-dot-muted" />
      <MathLabel x={634} y={278} tex="\Delta H_r" w={90} h={28} size="small" anchor="end" />

      <Label x={W / 2} y={H - 46} className="dg-text-small dg-text-muted">
        the atoms in the middle are the same on both routes
      </Label>
      <MathLabel
        x={W / 2}
        y={H - 18}
        tex="\Delta H_r = \sum \text{broken} - \sum \text{formed}"
        w={330}
        h={30}
      />
    </Svg>
  );
}

export default HessLawBondEnergyRoute;
