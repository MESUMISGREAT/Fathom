/**
 * Trace-table layout (9618 4.2.3). The listing on the left is read in the order the processor
 * runs it: after 106 JPN the table returns to 102, so addresses repeat in the left column.
 * Only changed values are filled in; a blank cell means "unchanged".
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-assembly-language-trace-table';

const W = 640;
const H = 320;

const listing = [
  '100  LDM #3',
  '101  STO 200',
  '102  LDD 200',
  '103  SUB 201',
  '104  STO 200',
  '105  CMP #0',
  '106  JPN 102',
  '107  END',
];

const rows: [string, string, string, string][] = [
  ['100', '3', '', ''],
  ['101', '', '3', ''],
  ['102', '', '', ''],
  ['103', '2', '', ''],
  ['104', '', '2', ''],
  ['105', '', '', 'False'],
  ['106', '', '', ''],
];

const cols = [
  { x: 260, w: 84, head: 'Address' },
  { x: 344, w: 84, head: 'ACC' },
  { x: 428, w: 88, head: 'Mem 200' },
  { x: 516, w: 108, head: 'Compare' },
];

export function TraceTableDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={110} y={30} className="dg-text-small dg-text-muted">
        program listing
      </Label>
      <rect x={14} y={42} width={186} height={236} className="dg-fill-muted dg-thin" />
      {listing.map((line, i) => (
        <Label key={line} x={24} y={64 + i * 28} anchor="start" className="dg-text-small dg-mono">
          {line}
        </Label>
      ))}

      {cols.map((c) => (
        <g key={c.head}>
          <rect x={c.x} y={42} width={c.w} height={28} className="dg-fill-accent dg-thin" />
          <Label x={c.x + c.w / 2} y={56} className="dg-text-small dg-bold">
            {c.head}
          </Label>
        </g>
      ))}

      {rows.map((r, i) => {
        const y = 70 + i * 28;
        return (
          <g key={i}>
            {cols.map((c, j) => {
              const cell = r[j] ?? '';
              return (
                <g key={j}>
                  <rect x={c.x} y={y} width={c.w} height={28} className="dg-fill-surface dg-thin" />
                  {cell !== '' && (
                    <Label x={c.x + c.w / 2} y={y + 14} className="dg-text-small dg-mono">
                      {cell}
                    </Label>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}

      <path
        d="M258,238 C210,238 210,140 256,140"
        className="dg-dashed dg-muted"
        fill="none"
      />
      <Arrow x1={238} y1={140} x2={258} y2={140} head={8} className="dg-muted" />
      <Label x={228} y={122} className="dg-text-small dg-text-muted">
        jump
      </Label>
      <Label x={228} y={258} className="dg-text-small dg-text-muted">
        back
      </Label>

      <Label x={390} y={300} className="dg-text-small dg-text-muted">
        one row per instruction executed · blank = unchanged
      </Label>
    </Svg>
  );
}

export default TraceTableDiagram;
