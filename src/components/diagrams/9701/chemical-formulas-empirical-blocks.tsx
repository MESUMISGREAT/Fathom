/**
 * One empirical formula, three molecular formulas. Methanal (CH₂O, Mr 30.0),
 * ethanoic acid (C₂H₄O₂, Mr 60.0) and glucose (C₆H₁₂O₆, Mr 180.0) are drawn
 * as 1, 2 and 6 copies of the CH₂O block. The molecular formula is n times
 * the empirical formula, where n = Mr ÷ empirical formula mass (30.0).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-chemical-formulas-empirical-blocks';

const W = 640;
const H = 320;
const X0 = 200;
const BLOCK = 50;
const BH = 34;

const ROWS = [
  { name: 'methanal', formula: 'CH₂O', n: 1, mr: '30.0' },
  { name: 'ethanoic acid', formula: 'C₂H₄O₂', n: 2, mr: '60.0' },
  { name: 'glucose', formula: 'C₆H₁₂O₆', n: 6, mr: '180.0' },
];

export function ChemicalFormulasEmpiricalBlocks() {
  const top = 70;
  const step = 64;
  return (
    <Svg width={W} height={H}>
      <Label x={20} y={22} anchor="start" className="dg-text dg-bold">
        empirical formula CH₂O (empirical formula mass 30.0)
      </Label>
      <Label x={X0 - 14} y={50} anchor="end" className="dg-text-muted">
        molecular formula
      </Label>
      <Label x={X0} y={50} anchor="start" className="dg-text-muted">
        copies of CH₂O
      </Label>
      <Label x={W - 20} y={50} anchor="end" className="dg-text-muted">
        Mᵣ
      </Label>
      {ROWS.map((r, i) => {
        const y = top + i * step;
        return (
          <g key={r.name}>
            <Label x={X0 - 14} y={y + BH / 2 - 8} anchor="end" className="dg-text dg-bold">
              {r.formula}
            </Label>
            <Label x={X0 - 14} y={y + BH / 2 + 10} anchor="end" className="dg-text-small">
              {r.name}
            </Label>
            {Array.from({ length: r.n }, (_, k) => (
              <g key={k}>
                <rect x={X0 + k * BLOCK} y={y} width={BLOCK - 4} height={BH} rx={6} className="dg-fill-accent dg-accent" />
                <Label x={X0 + k * BLOCK + (BLOCK - 4) / 2} y={y + BH / 2 + 1} className="dg-text-small dg-bold">
                  CH₂O
                </Label>
              </g>
            ))}
            <Label x={X0 + r.n * BLOCK + 8} y={y + BH / 2} anchor="start" className="dg-text-accent">
              {`n = ${r.n}`}
            </Label>
            <Label x={W - 20} y={y + BH / 2} anchor="end" className="dg-text">
              {r.mr}
            </Label>
          </g>
        );
      })}
      <Label x={W / 2} y={top + 3 * step + 14} className="dg-text">
        molecular formula = n × empirical formula
      </Label>
      <Label x={W / 2} y={top + 3 * step + 36} className="dg-text-small">
        n = Mᵣ ÷ empirical formula mass, e.g. glucose: 180.0 ÷ 30.0 = 6
      </Label>
    </Svg>
  );
}

export default ChemicalFormulasEmpiricalBlocks;
