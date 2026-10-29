/**
 * DDL and DML side by side: the structural statements on the left, the data statements on the
 * right. The comparison sentence sits below both panels so nothing overlaps the statement list.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-sql-ddl-vs-dml';

const W = 640;
const H = 312;
const PW = 292;
const X1 = 16;
const X2 = X1 + PW + 24;
const TOP = 40;
const BOTTOM = 272;

const ddl = [
  { stmt: 'CREATE TABLE', does: 'makes a new table' },
  { stmt: 'ALTER TABLE', does: "changes a table's fields or keys" },
  { stmt: 'DROP TABLE', does: 'removes the table completely' },
];

const dml = [
  { stmt: 'SELECT', does: 'reads rows that match a condition' },
  { stmt: 'INSERT INTO', does: 'adds new rows' },
  { stmt: 'UPDATE', does: 'changes values in existing rows' },
  { stmt: 'DELETE FROM', does: 'removes rows' },
];

function Panel({
  x,
  heading,
  sub,
  rows,
  tone,
}: {
  x: number;
  heading: string;
  sub: string;
  rows: { stmt: string; does: string }[];
  tone: string;
}) {
  return (
    <g>
      <rect x={x} y={TOP} width={PW} height={BOTTOM - TOP} rx={10} className="dg-fill-surface dg-line" />
      <rect x={x} y={TOP} width={PW} height={40} rx={10} className={`${tone} dg-line`} />
      <rect x={x} y={TOP + 28} width={PW} height={12} className={tone} />
      <Label x={x + 14} y={TOP + 21} anchor="start" className="dg-text dg-bold">
        {heading}
      </Label>
      <Label x={x + PW - 12} y={TOP + 21} anchor="end" className="dg-text-small">
        {sub}
      </Label>
      {rows.map((r, i) => (
        <g key={r.stmt}>
          <Label x={x + 14} y={TOP + 64 + i * 44} anchor="start" className="dg-text dg-mono dg-bold">
            {r.stmt}
          </Label>
          <Label x={x + 14} y={TOP + 82 + i * 44} anchor="start" className="dg-text-small dg-text-muted">
            {r.does}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function SqlDdlVsDml() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        One language, two jobs
      </Label>

      <Panel x={X1} heading="DDL" sub="structure" rows={ddl} tone="dg-fill-accent" />
      <Panel x={X2} heading="DML" sub="data" rows={dml} tone="dg-fill-accent-2" />

      <Label x={W / 2} y={292} className="dg-text-small dg-text-muted">
        DDL changes what a table IS; DML works on the rows inside it.
      </Label>
      <Label x={W / 2} y={306} className="dg-text-small dg-text-muted">
        SQL is the industry standard for both.
      </Label>
    </Svg>
  );
}

export default SqlDdlVsDml;
