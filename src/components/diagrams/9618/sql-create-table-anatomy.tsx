/**
 * A CREATE TABLE statement with its parts numbered. The statement is laid out in fixed columns
 * (field name, data type, extra rule) so the badges sit clear of the text whatever the font.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-sql-create-table-anatomy';

const W = 660;
const H = 300;

const Y0 = 70;
const DY = 26;
const NAME_X = 56;
const TYPE_X = 160;
const RULE_X = 268;

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={10} className="dg-fill-accent dg-line" />
      <Label x={x} y={y} className="dg-text-small dg-bold">
        {n}
      </Label>
    </g>
  );
}

const legend = [
  { n: 1, head: 'table name', tail: 'what is being defined' },
  { n: 2, head: 'field name', tail: 'one column' },
  { n: 3, head: 'data type', tail: 'what it may hold' },
  { n: 4, head: 'key rule', tail: 'unique, never empty' },
];

export function SqlCreateTableAnatomy() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Every field line says the same three things
      </Label>

      {/* Line 1: CREATE TABLE <name> ( */}
      <Label x={26} y={Y0} anchor="start" className="dg-text-small dg-mono">
        CREATE TABLE
      </Label>
      <Label x={124} y={Y0} anchor="start" className="dg-text-small dg-mono">
        Student
      </Label>
      <Label x={188} y={Y0} anchor="start" className="dg-text-small dg-mono">
        (
      </Label>
      <Badge x={216} y={Y0} n={1} />

      {/* Line 2: the annotated field line */}
      <Label x={NAME_X} y={Y0 + DY} anchor="start" className="dg-text-small dg-mono">
        StudentID
      </Label>
      <Badge x={138} y={Y0 + DY} n={2} />
      <Label x={TYPE_X} y={Y0 + DY} anchor="start" className="dg-text-small dg-mono">
        INTEGER
      </Label>
      <Badge x={228} y={Y0 + DY} n={3} />
      <Label x={RULE_X} y={Y0 + DY} anchor="start" className="dg-text-small dg-mono">
        PRIMARY KEY,
      </Label>
      <Badge x={376} y={Y0 + DY} n={4} />

      {/* The remaining field lines */}
      <Label x={NAME_X} y={Y0 + 2 * DY} anchor="start" className="dg-text-small dg-mono">
        FirstName
      </Label>
      <Label x={TYPE_X} y={Y0 + 2 * DY} anchor="start" className="dg-text-small dg-mono">
        VARCHAR(30),
      </Label>

      <Label x={NAME_X} y={Y0 + 3 * DY} anchor="start" className="dg-text-small dg-mono">
        FeePaid
      </Label>
      <Label x={TYPE_X} y={Y0 + 3 * DY} anchor="start" className="dg-text-small dg-mono">
        BOOLEAN,
      </Label>

      <Label x={NAME_X} y={Y0 + 4 * DY} anchor="start" className="dg-text-small dg-mono">
        Enrolled
      </Label>
      <Label x={TYPE_X} y={Y0 + 4 * DY} anchor="start" className="dg-text-small dg-mono">
        DATE
      </Label>

      <Label x={26} y={Y0 + 5 * DY} anchor="start" className="dg-text-small dg-mono">
        );
      </Label>

      <path d={`M26,${Y0 + 5 * DY + 16} L${W - 26},${Y0 + 5 * DY + 16}`} className="dg-grid" />

      {legend.map((item, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const lx = 26 + col * 320;
        const ly = 222 + row * 32;
        return (
          <g key={item.n}>
            <Badge x={lx + 10} y={ly} n={item.n} />
            <Label x={lx + 28} y={ly} anchor="start" className="dg-text">
              {item.head}
            </Label>
            <Label x={lx + 118} y={ly} anchor="start" className="dg-text-small dg-text-muted">
              — {item.tail}
            </Label>
          </g>
        );
      })}

      <Label x={W / 2} y={286} className="dg-text-small dg-text-muted">
        Commas separate the fields; the statement ends with a semicolon.
      </Label>
    </Svg>
  );
}

export default SqlCreateTableAnatomy;
