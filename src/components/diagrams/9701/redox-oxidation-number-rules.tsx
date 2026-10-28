/**
 * The oxidation-number rules as a priority table. Fixed values come first; anything not covered is
 * found by making the numbers add up to the overall charge.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-redox-oxidation-number-rules';

const W = 620;
const H = 470;
const ROW = 42;
const TOP = 74;

type Row = { what: string; example: string; value: string };

const rows: Row[] = [
  { what: 'Uncombined element', example: '\\text{Fe},\\ \\text{O}_2', value: '0' },
  { what: 'Monatomic ion', example: '\\text{Mg}^{2+},\\ \\text{Cl}^-', value: '\\text{ion charge}' },
  { what: 'Fluorine in a compound', example: '\\text{in a compound}', value: '-1' },
  { what: 'Oxygen in a compound', example: '\\text{usually}', value: '-2' },
  { what: 'Hydrogen in a compound', example: '\\text{usually}', value: '+1' },
  { what: 'Group 1 / Group 2 / Al', example: '\\text{in compounds}', value: '+1\\ /\\ +2\\ /\\ +3' },
  { what: 'Total in a compound', example: '\\text{or an ion}', value: '0\\ /\\ \\text{ion charge}' },
];

export function RedoxOxidationNumberRules() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Oxidation-number rules, in priority order
      </Label>
      <Label x={W / 2} y={48} className="dg-text-small dg-text-muted">
        Earlier rows win when two rules disagree
      </Label>

      {rows.map((r, i) => {
        const y = TOP + i * ROW;
        return (
          <g key={r.what}>
            <rect
              x={16}
              y={y}
              width={W - 32}
              height={ROW - 6}
              rx={7}
              className={i % 2 === 0 ? 'dg-fill-accent' : 'dg-fill-muted'}
              opacity={i % 2 === 0 ? 0.55 : 0.35}
            />
            <Label x={30} y={y + 18} anchor="start" className="dg-text-small">
              {r.what}
            </Label>
            <MathLabel
              x={352}
              y={y + 18}
              tex={r.example}
              w={190}
              h={26}
              size="small"
              tone="muted"
            />
            <MathLabel
              x={520}
              y={y + 18}
              tex={r.value}
              w={110}
              h={26}
              size="small"
              tone="accent"
            />
          </g>
        );
      })}

      <Label x={30} y={TOP + rows.length * ROW + 16} anchor="start" className="dg-text-small dg-text-muted">
        Exceptions you must know:
      </Label>
      <MathLabel
        x={40}
        y={TOP + rows.length * ROW + 44}
        anchor="start"
        tex="\text{O is } -1 \text{ in peroxides, } +2 \text{ in OF}_2"
        w={520}
        h={26}
        size="small"
        tone="accent-2"
      />
      <MathLabel
        x={40}
        y={TOP + rows.length * ROW + 70}
        anchor="start"
        tex="\text{H is } -1 \text{ in metal hydrides such as NaH}"
        w={520}
        h={26}
        size="small"
        tone="accent-2"
      />
    </Svg>
  );
}

export default RedoxOxidationNumberRules;
