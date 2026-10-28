/**
 * Calorimetry apparatus: a copper can of water over a spirit burner, with a
 * thermometer, and the working q = mcΔT then ΔH = −mcΔT/n.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-enthalpy-change-calorimetry';

const W = 620;
const H = 320;

export function EnthalpyChangeCalorimetry() {
  return (
    <Svg width={W} height={H}>
      <Label x={170} y={22} className="dg-text dg-bold">
        Measuring the energy a fuel gives out
      </Label>

      {/* can */}
      <rect x={96} y={96} width={148} height={92} className="dg-fill-muted dg-line" />
      <rect x={98} y={132} width={144} height={54} className="dg-fill-accent dg-thin" />
      <Label x={170} y={164} className="dg-text-small">
        water, m
      </Label>
      {/* thermometer */}
      <line x1={120} y1={54} x2={120} y2={168} className="dg-line" />
      <circle cx={120} cy={172} r={7} className="dg-dot-accent" />
      <Label x={112} y={46} anchor="end" className="dg-text-small dg-text-muted">
        ΔT
      </Label>
      {/* stand */}
      <line x1={70} y1={96} x2={270} y2={96} className="dg-thin" />
      <line x1={78} y1={96} x2={78} y2={266} className="dg-thin" />
      <line x1={262} y1={96} x2={262} y2={266} className="dg-thin" />
      {/* burner */}
      <rect x={140} y={214} width={60} height={44} className="dg-fill-accent-2 dg-line" />
      <path d="M170,212 C160,200 180,198 170,190" className="dg-accent" />
      <Label x={170} y={278} className="dg-text-small dg-text-muted">
        spirit burner
      </Label>
      {/* draught shield */}
      <line x1={104} y1={266} x2={236} y2={266} className="dg-muted dg-dashed" />

      <MathLabel x={452} y={92} tex="q = mc\Delta T" w={240} h={30} />
      <MathLabel x={452} y={144} tex="\Delta H = -\dfrac{mc\Delta T}{n}" w={240} h={46} />
      <Label x={352} y={192} anchor="start" className="dg-text-small dg-text-muted">
        m = mass of water in grams
      </Label>
      <Label x={352} y={212} anchor="start" className="dg-text-small dg-text-muted">
        c = 4.18 J g⁻¹ K⁻¹
      </Label>
      <Label x={352} y={232} anchor="start" className="dg-text-small dg-text-muted">
        n = moles of fuel burned
      </Label>
      <Label x={352} y={266} anchor="start" className="dg-text-small dg-text-muted">
        find n by weighing the burner
      </Label>
      <Label x={352} y={286} anchor="start" className="dg-text-small dg-text-muted">
        before and after
      </Label>
    </Svg>
  );
}

export default EnthalpyChangeCalorimetry;
