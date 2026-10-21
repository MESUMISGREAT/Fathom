/**
 * Charge tiles for writing ionic formulas. Each tile's length is
 * proportional to the size of the ion's charge, so a formula is correct when
 * the row of positive tiles and the row of negative tiles are the same
 * length. Aluminium oxide: 2 × Al³⁺ (+6) and 3 × O²⁻ (−6) gives Al₂O₃.
 * Calcium nitrate: 1 × Ca²⁺ (+2) and 2 × NO₃⁻ (−2) gives Ca(NO₃)₂.
 * Ammonium phosphate: 3 × NH₄⁺ (+3) and 1 × PO₄³⁻ (−3) gives (NH₄)₃PO₄.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-chemical-formulas-charge-balance';

const W = 640;
const H = 350;
const UNIT = 46;
const X0 = 150;
const TILE = 28;

interface Row {
  name: [string, string];
  pos: { ion: string; charge: number; n: number };
  neg: { ion: string; charge: number; n: number };
  total: number;
  formula: string;
}

const ROWS: Row[] = [
  { name: ['aluminium', 'oxide'], pos: { ion: 'Al³⁺', charge: 3, n: 2 }, neg: { ion: 'O²⁻', charge: 2, n: 3 }, total: 6, formula: 'Al₂O₃' },
  { name: ['calcium', 'nitrate'], pos: { ion: 'Ca²⁺', charge: 2, n: 1 }, neg: { ion: 'NO₃⁻', charge: 1, n: 2 }, total: 2, formula: 'Ca(NO₃)₂' },
  { name: ['ammonium', 'phosphate'], pos: { ion: 'NH₄⁺', charge: 1, n: 3 }, neg: { ion: 'PO₄³⁻', charge: 3, n: 1 }, total: 3, formula: '(NH₄)₃PO₄' },
];

function Tiles({ y, ion, charge, n, cls }: { y: number; ion: string; charge: number; n: number; cls: string }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={X0 + i * charge * UNIT} y={y} width={charge * UNIT} height={TILE} rx={5} className={`${cls} dg-thin`} />
          <Label x={X0 + i * charge * UNIT + (charge * UNIT) / 2} y={y + TILE / 2 + 1} className="dg-text dg-bold">
            {ion}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function ChemicalFormulasChargeBalance() {
  const top = 50;
  const step = 100;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        total positive charge = total negative charge
      </Label>
      {ROWS.map((r, i) => {
        const y = top + i * step;
        const end = X0 + r.total * UNIT;
        return (
          <g key={r.formula}>
            <Label x={20} y={y + TILE - 8} anchor="start" className="dg-text">
              {r.name[0]}
            </Label>
            <Label x={20} y={y + TILE + 10} anchor="start" className="dg-text">
              {r.name[1]}
            </Label>
            <Tiles y={y} {...r.pos} cls="dg-fill-accent" />
            <Tiles y={y + TILE + 6} {...r.neg} cls="dg-fill-accent-2" />
            <line x1={end + 10} y1={y} x2={end + 10} y2={y + 2 * TILE + 6} className="dg-thin" />
            <Label x={end + 22} y={y + TILE / 2 + 1} anchor="start" className="dg-text-small">
              {`${r.pos.n} × (+${r.pos.charge}) = +${r.total}`}
            </Label>
            <Label x={end + 22} y={y + TILE + 6 + TILE / 2 + 1} anchor="start" className="dg-text-small">
              {`${r.neg.n} × (−${r.neg.charge}) = −${r.total}`}
            </Label>
            <Label x={W - 20} y={y + TILE + 3} anchor="end" className="dg-text-accent">
              {r.formula}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}

export default ChemicalFormulasChargeBalance;
