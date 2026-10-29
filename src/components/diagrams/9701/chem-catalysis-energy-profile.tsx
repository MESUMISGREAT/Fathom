/**
 * Reaction pathway for the same reaction with and without a catalyst.
 *
 * Both routes start at the same reactant energy and finish at the same product energy, so the
 * enthalpy change is unchanged. The catalysed route goes over two lower humps with an
 * intermediate in between: a different mechanism, with a smaller activation energy.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-catalysis-energy-profile';

const W = 680;
const H = 450;

const Y_REACT = 300;
const Y_PROD = 250;
const Y_PEAK_UNCAT = 90;
const Y_PEAK_CAT_1 = 170;
const Y_TROUGH = 215;
const Y_PEAK_CAT_2 = 165;

const X0 = 70;
const X1 = 620;

const uncat = `M${X0},${Y_REACT} L150,${Y_REACT} C215,${Y_REACT} 225,${Y_PEAK_UNCAT} 300,${Y_PEAK_UNCAT} C375,${Y_PEAK_UNCAT} 390,${Y_PROD} 450,${Y_PROD} L${X1},${Y_PROD}`;
const cat = `M${X0},${Y_REACT} L150,${Y_REACT} C190,${Y_REACT} 200,${Y_PEAK_CAT_1} 245,${Y_PEAK_CAT_1} C290,${Y_PEAK_CAT_1} 300,${Y_TROUGH} 330,${Y_TROUGH} C360,${Y_TROUGH} 380,${Y_PEAK_CAT_2} 415,${Y_PEAK_CAT_2} C455,${Y_PEAK_CAT_2} 480,${Y_PROD} 520,${Y_PROD} L${X1},${Y_PROD}`;

export function ChemCatalysisEnergyProfile() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        A catalyst opens a route with a lower barrier
      </Label>

      {/* axes */}
      <line x1={50} y1={Y_REACT + 46} x2={X1 + 20} y2={Y_REACT + 46} className="dg-line" />
      <line x1={50} y1={Y_REACT + 46} x2={50} y2={60} className="dg-line" />
      <Label x={W / 2} y={Y_REACT + 72} className="dg-text-small dg-text-muted">
        reaction progress
      </Label>
      <Label x={58} y={52} anchor="start" className="dg-text-small dg-text-muted">
        energy
      </Label>

      {/* guides at the two catalysed peaks and the uncatalysed peak */}
      <line x1={150} y1={Y_PEAK_UNCAT} x2={470} y2={Y_PEAK_UNCAT} className="dg-grid dg-dashed" />
      <line x1={170} y1={Y_PEAK_CAT_1} x2={330} y2={Y_PEAK_CAT_1} className="dg-grid dg-dashed" />
      <line x1={330} y1={Y_PEAK_CAT_2} x2={540} y2={Y_PEAK_CAT_2} className="dg-grid dg-dashed" />

      {/* reactant and product levels */}
      <line x1={X0} y1={Y_REACT} x2={190} y2={Y_REACT} className="dg-grid dg-dashed" />
      <line x1={500} y1={Y_PROD} x2={X1} y2={Y_PROD} className="dg-grid dg-dashed" />

      {/* profiles */}
      <path d={uncat} className="dg-accent" strokeWidth={2.5} fill="none" />
      <path d={cat} className="dg-accent-2" strokeWidth={2.5} fill="none" />

      <Label x={76} y={Y_REACT + 20} anchor="start" className="dg-text-small">
        reactants
      </Label>
      <Label x={X1 - 4} y={Y_PROD + 20} anchor="end" className="dg-text-small">
        products
      </Label>

      {/* activation energies, both measured from the reactant level */}
      <Arrow x1={95} y1={Y_REACT} x2={95} y2={Y_PEAK_UNCAT} double className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={86} y={(Y_REACT + Y_PEAK_UNCAT) / 2} anchor="end" className="dg-text-small dg-text-accent">
        Ea
      </Label>
      <Arrow x1={135} y1={Y_REACT} x2={135} y2={Y_PEAK_CAT_1} double className="dg-accent-2" headClassName="dg-dot-accent" />
      <Label x={143} y={(Y_REACT + Y_PEAK_CAT_1) / 2 + 14} anchor="start" className="dg-text-small dg-text-accent-2">
        Ea′
      </Label>

      {/* intermediate */}
      <line x1={330} y1={Y_TROUGH} x2={330} y2={Y_REACT - 10} className="dg-grid dg-dashed" />
      <Label x={338} y={Y_REACT + 12} anchor="start" className="dg-text-small dg-text-muted">
        intermediate in the catalysed mechanism
      </Label>

      {/* legend */}
      <line x1={70} y1={402} x2={110} y2={402} className="dg-accent" strokeWidth={2.5} />
      <Label x={118} y={402} anchor="start" className="dg-text-small">
        uncatalysed
      </Label>
      <line x1={250} y1={402} x2={290} y2={402} className="dg-accent-2" strokeWidth={2.5} />
      <Label x={298} y={402} anchor="start" className="dg-text-small">
        catalysed: two lower humps
      </Label>
      <Label x={W / 2} y={432} className="dg-text-small dg-text-muted">
        Same start and finish, so ΔH is unchanged; only the route is different.
      </Label>
    </Svg>
  );
}

export default ChemCatalysisEnergyProfile;
