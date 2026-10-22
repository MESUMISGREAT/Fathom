/**
 * Periods 1–5 of the Periodic Table with the charge of the simple ion each
 * main group usually forms: group 1 → 1+, group 2 → 2+, group 13 → 3+
 * (aluminium at AS), groups 15, 16, 17 → 3−, 2−, 1− (shaded for the
 * non-metals N, P, O, S, Se, F, Cl, Br, I, which form these anions). Group 14
 * usually bonds covalently and group 18 forms no ions. Many d-block metals
 * have variable charges, shown by a Roman numeral oxidation number; zinc
 * (Zn²⁺) and silver (Ag⁺) are outlined because their charges are fixed.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-chemical-formulas-ion-charges';

const W = 640;
const H = 356;
const C = 31;
const X0 = 62;
const Y0 = 80;

const PERIODS: string[][] = [
  ['H', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'He'],
  ['Li', 'Be', '', '', '', '', '', '', '', '', '', '', 'B', 'C', 'N', 'O', 'F', 'Ne'],
  ['Na', 'Mg', '', '', '', '', '', '', '', '', '', '', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'],
  ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'],
  ['Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe'],
];

/** Charge label above each group column (index = group - 1). */
const CHARGE: Record<number, string> = { 0: '1+', 1: '2+', 12: '3+', 13: '–', 14: '3−', 15: '2−', 16: '1−', 17: 'none' };

/** Non-metals in groups 15-17 that form simple negative ions. */
const ANION_FORMERS = new Set(['N', 'P', 'O', 'S', 'Se', 'F', 'Cl', 'Br', 'I']);

function fillFor(sym: string, col: number): string {
  if (col <= 1 && sym !== 'H') return 'dg-fill-accent';
  if (sym === 'Al') return 'dg-fill-accent';
  if (col >= 2 && col <= 11) return 'dg-fill-muted';
  if (ANION_FORMERS.has(sym)) return 'dg-fill-accent-2';
  return 'dg-fill-surface';
}

export function ChemicalFormulasIonCharges() {
  const cx = (col: number) => X0 + col * C;
  const cy = (row: number) => Y0 + row * C;
  return (
    <Svg width={W} height={H}>
      {/* group numbers and charges */}
      <Label x={X0 - 8} y={24} anchor="end" className="dg-text-muted">
        group
      </Label>
      <Label x={X0 - 8} y={50} anchor="end" className="dg-text-muted">
        ion
      </Label>
      {Array.from({ length: 18 }, (_, col) => (
        <Label key={col} x={cx(col) + C / 2} y={24} className="dg-text-small">
          {String(col + 1)}
        </Label>
      ))}
      {Object.entries(CHARGE).map(([col, q]) => (
        <Label key={col} x={cx(Number(col)) + C / 2} y={50} className={q === '–' || q === 'none' ? 'dg-text-small' : 'dg-text dg-bold'}>
          {q}
        </Label>
      ))}
      {/* d-block bracket */}
      <path d={`M${cx(2) + 2},${Y0 + 3 * C - 10} L${cx(2) + 2},${Y0 + 3 * C - 16} L${cx(12) - 2},${Y0 + 3 * C - 16} L${cx(12) - 2},${Y0 + 3 * C - 10}`} className="dg-thin" />
      <Label x={(cx(2) + cx(12)) / 2} y={Y0 + 3 * C - 44} className="dg-text dg-bold">
        d-block: many metals have variable charges
      </Label>
      <Label x={(cx(2) + cx(12)) / 2} y={Y0 + 3 * C - 27} className="dg-text-small">
        shown by a Roman numeral, e.g. iron(III) = Fe³⁺
      </Label>

      {/* cells */}
      {PERIODS.map((row, r) =>
        row.map((sym, col) =>
          sym ? (
            <g key={sym}>
              <rect x={cx(col)} y={cy(r)} width={C} height={C} className={`${fillFor(sym, col)} dg-thin`} />
              {(sym === 'Zn' || sym === 'Ag') && <rect x={cx(col) + 2} y={cy(r) + 2} width={C - 4} height={C - 4} className="dg-accent-2" />}
              <Label x={cx(col) + C / 2} y={cy(r) + C / 2 + 1} className="dg-text-small">
                {sym}
              </Label>
            </g>
          ) : null,
        ),
      )}
      {PERIODS.map((_, r) => (
        <Label key={r} x={X0 - 8} y={cy(r) + C / 2} anchor="end" className="dg-text-muted">
          {String(r + 1)}
        </Label>
      ))}

      {/* key */}
      {[
        { y: 262, cls: 'dg-fill-accent dg-thin', text: 'groups 1, 2 and Al: lose electrons to form positive ions (cations)' },
        { y: 286, cls: 'dg-fill-accent-2 dg-thin', text: 'non-metals in groups 15 to 17: gain electrons to form negative ions (anions)' },
        { y: 310, cls: 'dg-fill-surface dg-accent-2', text: 'Zn²⁺ and Ag⁺: fixed charges you must learn' },
      ].map((k) => (
        <g key={k.y}>
          <rect x={X0} y={k.y - 8} width={16} height={16} className={k.cls} />
          <Label x={X0 + 26} y={k.y} anchor="start" className="dg-text-small">
            {k.text}
          </Label>
        </g>
      ))}
      <Label x={X0} y={340} anchor="start" className="dg-text-small">
        Group 14 usually bonds covalently; group 18 (noble gases) forms no ions.
      </Label>
    </Svg>
  );
}

export default ChemicalFormulasIonCharges;
