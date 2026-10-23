/**
 * A memory map for the nine ions in syllabus 2.3.1(b).
 * Left: the four oxo-anions placed where their central atom sits in the
 * Periodic Table (groups 14-16, periods 2-3). Period 2 central atoms (C, N)
 * carry three O atoms; period 3 central atoms (P, S) carry four. Moving one
 * place left along a period adds one negative charge: NO₃⁻ → CO₃²⁻ and
 * SO₄²⁻ → PO₄³⁻.
 * Right: adding H⁺ raises the charge by one (CO₃²⁻ → HCO₃⁻, NH₃ → NH₄⁺), plus
 * the three single ions OH⁻, Zn²⁺ and Ag⁺.
 * Bottom: all nine sorted by charge.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-chemical-formulas-ion-patterns';

const W = 640;
const H = 400;
const CW = 100;
const CH = 74;
const GAP = 8;
const GX = 20;
const GY = 72;

const colX = (c: number) => GX + c * (CW + GAP);
const rowY = (r: number) => GY + r * (CH + GAP);

const OXO = [
  { col: 0, row: 0, el: 'C', ion: 'CO₃²⁻', name: 'carbonate' },
  { col: 1, row: 0, el: 'N', ion: 'NO₃⁻', name: 'nitrate' },
  { col: 1, row: 1, el: 'P', ion: 'PO₄³⁻', name: 'phosphate' },
  { col: 2, row: 1, el: 'S', ion: 'SO₄²⁻', name: 'sulfate' },
];

const SINGLES = [
  { ion: 'OH⁻', name: 'hydroxide', cls: 'dg-fill-accent-2' },
  { ion: 'Zn²⁺', name: 'zinc', cls: 'dg-fill-accent' },
  { ion: 'Ag⁺', name: 'silver', cls: 'dg-fill-accent' },
];

const BY_CHARGE: Array<[string, string, string]> = [
  ['1+', 'NH₄⁺  Ag⁺', 'dg-fill-accent'],
  ['2+', 'Zn²⁺', 'dg-fill-accent'],
  ['1−', 'OH⁻  NO₃⁻  HCO₃⁻', 'dg-fill-accent-2'],
  ['2−', 'CO₃²⁻  SO₄²⁻', 'dg-fill-accent-2'],
  ['3−', 'PO₄³⁻', 'dg-fill-accent-2'],
];

export function ChemicalFormulasIonPatterns() {
  const divider = 362;
  const rx = 380;
  return (
    <Svg width={W} height={H}>
      {/* ---- left: the -ate ions in Periodic Table positions ---- */}
      <Label x={GX} y={20} anchor="start" className="dg-text dg-bold">
        the four -ate ions sit like the Periodic Table
      </Label>
      {['group 14', 'group 15', 'group 16'].map((g, c) => (
        <Label key={g} x={colX(c) + CW / 2} y={54} className="dg-text-muted">
          {g}
        </Label>
      ))}

      {/* empty cells hold the row notes */}
      <rect x={colX(2)} y={rowY(0)} width={CW} height={CH} rx={8} className="dg-grid dg-dashed" />
      <Label x={colX(2) + CW / 2} y={rowY(0) + 26} className="dg-text-small dg-bold">
        period 2
      </Label>
      <Label x={colX(2) + CW / 2} y={rowY(0) + 46} className="dg-text-small">
        three O atoms
      </Label>
      <rect x={colX(0)} y={rowY(1)} width={CW} height={CH} rx={8} className="dg-grid dg-dashed" />
      <Label x={colX(0) + CW / 2} y={rowY(1) + 26} className="dg-text-small dg-bold">
        period 3
      </Label>
      <Label x={colX(0) + CW / 2} y={rowY(1) + 46} className="dg-text-small">
        four O atoms
      </Label>

      {OXO.map((o) => {
        const x = colX(o.col);
        const y = rowY(o.row);
        return (
          <g key={o.ion}>
            <rect x={x} y={y} width={CW} height={CH} rx={8} className="dg-fill-accent-2 dg-thin" />
            <Label x={x + 10} y={y + 14} anchor="start" className="dg-text-small dg-bold">
              {o.el}
            </Label>
            <Label x={x + CW / 2} y={y + 38} className="dg-text dg-bold">
              {o.ion}
            </Label>
            <Label x={x + CW / 2} y={y + 58} className="dg-text-small">
              {o.name}
            </Label>
          </g>
        );
      })}

      <Arrow x1={colX(2) + CW - 6} y1={rowY(2) + 8} x2={colX(0) + 6} y2={rowY(2) + 8} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={colX(1) + CW / 2} y={rowY(2) + 28} className="dg-text-small">
        one place left along a period = one more negative charge
      </Label>

      {/* ---- right: add H⁺, and the singles ---- */}
      <line x1={divider} y1={12} x2={divider} y2={282} className="dg-grid" />
      <Label x={rx} y={20} anchor="start" className="dg-text dg-bold">
        add H⁺: charge goes up by 1
      </Label>
      <Label x={rx} y={56} anchor="start" className="dg-text">
        CO₃²⁻ + H⁺ → HCO₃⁻
      </Label>
      <Label x={rx} y={76} anchor="start" className="dg-text-small">
        hydrogencarbonate
      </Label>
      <Label x={rx} y={110} anchor="start" className="dg-text">
        NH₃ + H⁺ → NH₄⁺
      </Label>
      <Label x={rx} y={130} anchor="start" className="dg-text-small">
        ammonium (ammonia, NH₃, has no charge)
      </Label>

      <Label x={rx} y={166} anchor="start" className="dg-text dg-bold">
        plus three singles
      </Label>
      {SINGLES.map((s, i) => {
        const x = rx + i * 84;
        return (
          <g key={s.ion}>
            <rect x={x} y={182} width={76} height={58} rx={8} className={`${s.cls} dg-thin`} />
            <Label x={x + 38} y={204} className="dg-text dg-bold">
              {s.ion}
            </Label>
            <Label x={x + 38} y={224} className="dg-text-small">
              {s.name}
            </Label>
          </g>
        );
      })}
      <Label x={rx} y={262} anchor="start" className="dg-text-small">
        Zn²⁺ and Ag⁺ are d-block ions with one
      </Label>
      <Label x={rx} y={278} anchor="start" className="dg-text-small">
        fixed charge: no Roman numeral needed
      </Label>

      {/* ---- bottom: all nine by charge ---- */}
      <line x1={20} y1={298} x2={W - 20} y2={298} className="dg-grid" />
      <Label x={20} y={316} anchor="start" className="dg-text-muted">
        all nine, sorted by charge
      </Label>
      {BY_CHARGE.map(([q, ions, cls], i) => {
        const bw = 116;
        const x = 20 + i * (bw + 4);
        return (
          <g key={q}>
            <rect x={x} y={330} width={bw} height={58} rx={8} className={`${cls} dg-thin`} />
            <Label x={x + bw / 2} y={350} className="dg-text dg-bold">
              {q}
            </Label>
            <Label x={x + bw / 2} y={372} className="dg-text-small">
              {ions}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}

export default ChemicalFormulasIonPatterns;
