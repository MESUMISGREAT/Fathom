/**
 * Following the atoms in combustion analysis. A weighed sample containing
 * C, H and O burns completely in excess oxygen. All of its carbon ends up in
 * CO₂, so m(C) = m(CO₂) × 12.0/44.0; all of its hydrogen ends up in H₂O, so
 * m(H) = m(H₂O) × 2.0/18.0. Oxygen atoms in the products come from both the
 * sample and the O₂, so the sample's oxygen is found by difference:
 * m(O) = m(sample) − m(C) − m(H).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-chemical-formulas-combustion-tracking';

const W = 640;
const H = 350;

export function ChemicalFormulasCombustionTracking() {
  return (
    <Svg width={W} height={H}>
      {/* sample */}
      <rect x={20} y={96} width={180} height={88} rx={12} className="dg-fill-accent dg-accent" />
      <Label x={110} y={120} className="dg-text dg-bold">
        weighed sample
      </Label>
      <Label x={110} y={142} className="dg-text">
        contains C, H, O
      </Label>
      <Label x={110} y={164} className="dg-text-small">
        mass known
      </Label>

      {/* burn */}
      <rect x={244} y={112} width={96} height={56} rx={28} className="dg-fill-muted dg-line" />
      <Label x={292} y={133} className="dg-text dg-bold">
        burns
      </Label>
      <Label x={292} y={151} className="dg-text-small">
        completely
      </Label>
      <Arrow x1={202} y1={140} x2={242} y2={140} />

      {/* oxygen */}
      <rect x={232} y={236} width={120} height={40} rx={10} className="dg-fill-surface dg-muted" />
      <Label x={292} y={256} className="dg-text">
        O₂ (excess)
      </Label>
      <Arrow x1={292} y1={234} x2={292} y2={170} className="dg-muted dg-dashed" headClassName="dg-dot" />

      {/* products */}
      <rect x={404} y={28} width={216} height={96} rx={12} className="dg-fill-surface dg-line" />
      <Label x={512} y={50} className="dg-text dg-bold">
        CO₂ (mass measured)
      </Label>
      <Label x={512} y={74} className="dg-text-small">
        holds ALL the carbon
      </Label>
      <Label x={512} y={100} className="dg-text-accent">
        m(C) = m(CO₂) × 12.0 ÷ 44.0
      </Label>

      <rect x={404} y={156} width={216} height={96} rx={12} className="dg-fill-surface dg-line" />
      <Label x={512} y={178} className="dg-text dg-bold">
        H₂O (mass measured)
      </Label>
      <Label x={512} y={202} className="dg-text-small">
        holds ALL the hydrogen
      </Label>
      <Label x={512} y={228} className="dg-text-accent">
        m(H) = m(H₂O) × 2.0 ÷ 18.0
      </Label>

      <Arrow x1={340} y1={126} x2={402} y2={84} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={362} y={92} className="dg-text-small dg-bold">
        C
      </Label>
      <Arrow x1={340} y1={154} x2={402} y2={198} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={362} y={190} className="dg-text-small dg-bold">
        H
      </Label>

      {/* oxygen by difference */}
      <rect x={20} y={290} width={600} height={50} rx={10} className="dg-fill-accent-2" />
      <Label x={320} y={306} className="dg-text-small">
        O atoms in CO₂ and H₂O come from the sample AND from the O₂, so find O by difference:
      </Label>
      <Label x={320} y={326} className="dg-text dg-bold">
        m(O) = m(sample) − m(C) − m(H)
      </Label>
    </Svg>
  );
}

export default ChemicalFormulasCombustionTracking;
