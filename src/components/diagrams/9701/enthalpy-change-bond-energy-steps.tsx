/**
 * The bond-energy calculation laid out as three columns: bonds broken, bonds
 * formed, then the subtraction.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-enthalpy-change-bond-energy-steps';

const W = 640;
const H = 316;

export function EnthalpyChangeBondEnergySteps() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        CH₄ + 2O₂ → CO₂ + 2H₂O, by bond energies
      </Label>

      {/* column 1 */}
      <rect x={20} y={42} width={190} height={170} className="dg-fill-muted dg-thin" />
      <Label x={115} y={64} className="dg-text-small dg-bold">
        bonds broken
      </Label>
      <Label x={115} y={92} className="dg-text-small">
        4 × C–H = 4 × 413
      </Label>
      <Label x={115} y={114} className="dg-text-small">
        = 1652
      </Label>
      <Label x={115} y={142} className="dg-text-small">
        2 × O=O = 2 × 498
      </Label>
      <Label x={115} y={164} className="dg-text-small">
        = 996
      </Label>
      <MathLabel x={115} y={192} tex="\Sigma = 2648" w={120} h={24} tone="accent" size="small" />

      {/* column 2 */}
      <rect x={226} y={42} width={190} height={170} className="dg-fill-muted dg-thin" />
      <Label x={321} y={64} className="dg-text-small dg-bold">
        bonds formed
      </Label>
      <Label x={321} y={92} className="dg-text-small">
        2 × C=O = 2 × 805
      </Label>
      <Label x={321} y={114} className="dg-text-small">
        = 1610
      </Label>
      <Label x={321} y={142} className="dg-text-small">
        4 × O–H = 4 × 464
      </Label>
      <Label x={321} y={164} className="dg-text-small">
        = 1856
      </Label>
      <MathLabel x={321} y={192} tex="\Sigma = 3466" w={120} h={24} tone="accent-2" size="small" />

      {/* column 3 */}
      <rect x={432} y={42} width={188} height={170} className="dg-fill-accent dg-thin" />
      <Label x={526} y={64} className="dg-text-small dg-bold">
        subtract
      </Label>
      <MathLabel x={526} y={104} tex="\Delta H = 2648 - 3466" w={170} h={26} size="small" />
      <MathLabel x={526} y={144} tex="= -818\ \text{kJ mol}^{-1}" w={170} h={26} size="small" />
      <Label x={526} y={180} className="dg-text-small dg-bold">
        exothermic
      </Label>

      <Label x={W / 2} y={242} className="dg-text-small dg-text-muted">
        values in kJ mol⁻¹; average C–H and O–H bond energies make this an estimate
      </Label>
      <Label x={W / 2} y={266} className="dg-text-small dg-text-muted">
        the data-book value is −890 kJ mol⁻¹, mostly because it refers to liquid water
      </Label>
    </Svg>
  );
}

export default EnthalpyChangeBondEnergySteps;
