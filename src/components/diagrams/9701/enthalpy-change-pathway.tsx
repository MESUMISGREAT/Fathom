/**
 * Reaction pathway diagrams. Left: exothermic, with the products below the
 * reactants. Right: endothermic, with the products above. Both show the
 * activation energy from the reactants to the peak, and ΔH between the levels.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-enthalpy-change-pathway';

const W = 620;
const H = 344;

/** A hump from (x0,yStart) up to (x0+len/2, yPeak) and down to (x0+len,yEnd). */
function hump(x0: number, len: number, yStart: number, yPeak: number, yEnd: number) {
  const xm = x0 + len / 2;
  const x1 = x0 + len * 0.32;
  const x2 = x0 + len * 0.68;
  return `M${x0},${yStart} C${x1},${yStart} ${x1},${yPeak} ${xm},${yPeak} C${x2},${yPeak} ${x2},${yEnd} ${x0 + len},${yEnd}`;
}

export function EnthalpyChangePathway() {
  return (
    <Svg width={W} height={H}>
      <Label x={160} y={26} className="dg-text dg-bold">
        Exothermic
      </Label>
      <Label x={462} y={26} className="dg-text dg-bold">
        Endothermic
      </Label>

      {/* left */}
      <line x1={54} y1={286} x2={286} y2={286} className="dg-line" />
      <line x1={54} y1={286} x2={54} y2={70} className="dg-line" />
      <Label x={52} y={56} anchor="start" className="dg-text-small dg-text-muted">
        enthalpy
      </Label>
      <Label x={280} y={306} anchor="end" className="dg-text-small dg-text-muted">
        progress
      </Label>
      <line x1={62} y1={150} x2={96} y2={150} className="dg-line" />
      <line x1={244} y1={232} x2={278} y2={232} className="dg-line" />
      <path d={hump(96, 148, 150, 92, 232)} className="dg-accent" />
      <Label x={70} y={138} className="dg-text-small">
        R
      </Label>
      <Label x={272} y={220} className="dg-text-small">
        P
      </Label>
      <Arrow x1={176} y1={150} x2={176} y2={98} head={7} className="dg-muted" double />
      <MathLabel x={176} y={80} tex="E_a" w={40} h={24} tone="muted" size="small" />
      <line x1={96} y1={150} x2={256} y2={150} className="dg-muted dg-dashed" />
      <Arrow x1={256} y1={150} x2={256} y2={228} head={7} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={268} y={188} tex="\Delta H" w={46} h={26} anchor="start" tone="accent" size="small" />

      {/* right */}
      <line x1={356} y1={286} x2={588} y2={286} className="dg-line" />
      <line x1={356} y1={286} x2={356} y2={70} className="dg-line" />
      <Label x={354} y={56} anchor="start" className="dg-text-small dg-text-muted">
        enthalpy
      </Label>
      <Label x={582} y={306} anchor="end" className="dg-text-small dg-text-muted">
        progress
      </Label>
      <line x1={364} y1={244} x2={398} y2={244} className="dg-line" />
      <line x1={546} y1={166} x2={580} y2={166} className="dg-line" />
      <path d={hump(398, 148, 244, 96, 166)} className="dg-accent" />
      <Label x={372} y={232} className="dg-text-small">
        R
      </Label>
      <Label x={574} y={154} className="dg-text-small">
        P
      </Label>
      <Arrow x1={472} y1={244} x2={472} y2={102} head={7} className="dg-muted" double />
      <MathLabel x={472} y={84} tex="E_a" w={40} h={24} tone="muted" size="small" />
      <line x1={398} y1={244} x2={558} y2={244} className="dg-muted dg-dashed" />
      <Arrow x1={558} y1={244} x2={558} y2={170} head={7} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={572} y={210} tex="\Delta H" w={46} h={26} anchor="start" tone="accent" size="small" />

      <Label x={W / 2} y={H - 10} className="dg-text-small dg-text-muted">
        Ea is measured from the reactants to the peak; ΔH between the two levels
      </Label>
    </Svg>
  );
}

export default EnthalpyChangePathway;
