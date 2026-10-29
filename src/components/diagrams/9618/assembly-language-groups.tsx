/**
 * The five instruction groups (9618 4.2.4), with every opcode in the set placed in its group.
 * JPE and CMI are highlighted because they are the two placements students most often get wrong.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-assembly-language-groups';

const W = 640;
const H = 330;

type Group = { title: string[]; ops: string[]; highlight?: number };

const groups: Group[] = [
  { title: ['data', 'movement'], ops: ['LDM', 'LDD', 'LDI', 'LDX', 'LDR', 'MOV', 'STO'] },
  { title: ['input and', 'output', 'of data'], ops: ['IN', 'OUT'] },
  { title: ['arithmetic', 'operations'], ops: ['ADD', 'SUB', 'INC', 'DEC'] },
  { title: ['unconditional', 'and', 'conditional'], ops: ['JMP', 'JPE', 'JPN', 'END'], highlight: 1 },
  { title: ['compare', 'instructions'], ops: ['CMP', 'CMI'], highlight: 1 },
];

const BOX_W = 118;
const GAP = 8;
const X0 = 14;
const CHIP_Y = 104;

export function GroupsDiagram() {
  return (
    <Svg width={W} height={H}>
      {groups.map((g, gi) => {
        const x = X0 + gi * (BOX_W + GAP);
        return (
          <g key={g.ops[0]}>
            <rect x={x} y={26} width={BOX_W} height={272} className="dg-fill-surface dg-thin" />
            {g.title.map((t, ti) => (
              <Label key={t} x={x + BOX_W / 2} y={48 + ti * 16} className="dg-text-small dg-bold">
                {t}
              </Label>
            ))}
            {g.ops.map((op, oi) => {
              const hot = g.highlight === oi;
              return (
                <g key={op}>
                  <rect
                    x={x + 9}
                    y={CHIP_Y + oi * 25}
                    width={BOX_W - 18}
                    height={21}
                    className={hot ? 'dg-fill-accent dg-thin' : 'dg-fill-muted dg-thin'}
                  />
                  <Label x={x + BOX_W / 2} y={CHIP_Y + 10.5 + oi * 25} className="dg-text-small dg-mono">
                    {op}
                  </Label>
                </g>
              );
            })}
          </g>
        );
      })}
      <Label x={330} y={318} className="dg-text-small dg-text-muted">
        nineteen opcodes, five groups, no leftovers
      </Label>
    </Svg>
  );
}

export default GroupsDiagram;
