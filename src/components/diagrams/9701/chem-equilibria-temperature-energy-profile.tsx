/**
 * Energy profile for an exothermic reversible reaction.
 *
 * Reactants sit higher than products, so the forward reaction releases energy (ΔH negative). The
 * reverse reaction must climb the whole step from products up to the transition state, so its
 * activation energy is larger by exactly |ΔH|. That is why heating helps the reverse reaction
 * more than the forward one, and why heating shifts this equilibrium to the left.
 *
 * The two activation-energy arrows are drawn in the flat regions either side of the hump, so
 * neither crosses the curve; a dashed line at the transition-state energy shows what they measure
 * up to. Levels are a sketch, not energy data.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-equilibria-temperature-energy-profile';

const W = 640;
const H = 460;

const Y_REACT = 250;
const Y_PROD = 330;
const Y_PEAK = 116;

const X0 = 70;
const X1 = 490;

const curve = `M${X0},${Y_REACT} L200,${Y_REACT} C255,${Y_REACT} 260,${Y_PEAK} 310,${Y_PEAK} C360,${Y_PEAK} 365,${Y_PROD} 420,${Y_PROD} L${X1},${Y_PROD}`;

export function ChemEquilibriaTemperatureEnergyProfile() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        The reverse reaction has further to climb
      </Label>

      {/* transition-state guide */}
      <line x1={170} y1={Y_PEAK} x2={430} y2={Y_PEAK} className="dg-grid dg-dashed" />

      {/* axes */}
      <line x1={50} y1={Y_PROD + 34} x2={X1 + 40} y2={Y_PROD + 34} className="dg-line" />
      <line x1={50} y1={Y_PROD + 34} x2={50} y2={Y_PEAK - 34} className="dg-line" />
      <Label x={W / 2} y={Y_PROD + 58} className="dg-text-small dg-text-muted">
        reaction progress
      </Label>
      <Label x={58} y={Y_PEAK - 44} anchor="start" className="dg-text-small dg-text-muted">
        energy
      </Label>

      {/* energy levels */}
      <line x1={X0} y1={Y_REACT} x2={210} y2={Y_REACT} className="dg-grid dg-dashed" />
      <line x1={420} y1={Y_PROD} x2={X1} y2={Y_PROD} className="dg-grid dg-dashed" />

      {/* profile */}
      <path d={curve} className="dg-accent" strokeWidth={2.5} fill="none" />

      {/* reactant and product labels */}
      <Label x={X0 + 24} y={Y_REACT - 16} anchor="start" className="dg-text-small dg-text-accent">
        reactants
      </Label>
      <Label x={X1 - 8} y={Y_PROD + 18} anchor="end" className="dg-text-small dg-text-accent-2">
        products
      </Label>

      {/* activation energy: forward, in the flat reactant region */}
      <Arrow x1={186} y1={Y_REACT} x2={186} y2={Y_PEAK} double className="dg-thin" headClassName="dg-dot" />
      <Label x={174} y={(Y_REACT + Y_PEAK) / 2} anchor="end" className="dg-text-small">
        Ea forward
      </Label>

      {/* activation energy: reverse, in the flat product region */}
      <Arrow
        x1={444}
        y1={Y_PROD}
        x2={444}
        y2={Y_PEAK}
        double
        className="dg-accent-2"
        headClassName="dg-dot-accent"
      />
      <Label x={456} y={(Y_PROD + Y_PEAK) / 2} anchor="start" className="dg-text-small dg-text-accent-2">
        Ea reverse
      </Label>
      <Label x={456} y={(Y_PROD + Y_PEAK) / 2 + 18} anchor="start" className="dg-text-small dg-text-muted">
        larger
      </Label>

      {/* enthalpy change */}
      <line x1={X1} y1={Y_REACT} x2={566} y2={Y_REACT} className="dg-grid dg-dashed" />
      <line x1={X1} y1={Y_PROD} x2={566} y2={Y_PROD} className="dg-grid dg-dashed" />
      <Arrow x1={552} y1={Y_REACT} x2={552} y2={Y_PROD} className="dg-thin" headClassName="dg-dot" />
      <Label x={560} y={(Y_REACT + Y_PROD) / 2} anchor="start" className="dg-text-small dg-text-muted">
        {'ΔH < 0'}
      </Label>

      <Label x={W / 2} y={H - 46} className="dg-text">
        {'Ea(reverse) = Ea(forward) + |ΔH|'}
      </Label>
      <Label x={W / 2} y={H - 20} className="dg-text-small dg-text-muted">
        The larger barrier gains more from heating, so the reverse direction is favoured.
      </Label>
    </Svg>
  );
}

export default ChemEquilibriaTemperatureEnergyProfile;
