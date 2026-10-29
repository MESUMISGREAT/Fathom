/**
 * Clause order: the order a query is written in, above the order the DBMS actually works it out in.
 * The notes are split into short lines so they never run off the edge of the viewBox.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-sql-select-clause-order';

const W = 640;
const H = 302;
const BW = 104;
const BH = 40;
const GAP = 13;
const X0 = (W - (5 * BW + 4 * GAP)) / 2;

const written = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY'];
const worked = ['FROM', 'WHERE', 'GROUP BY', 'SELECT', 'ORDER BY'];

const boxX = (i: number) => X0 + i * (BW + GAP);

function Row({ y, label, items, tone }: { y: number; label: string; items: string[]; tone: string }) {
  return (
    <g>
      <Label x={X0} y={y - 16} anchor="start" className="dg-text-small dg-text-muted">
        {label}
      </Label>
      {items.map((t, i) => (
        <g key={`${label}-${t}`}>
          <rect x={boxX(i)} y={y} width={BW} height={BH} rx={7} className={`${tone} dg-line`} />
          <Label x={boxX(i) + BW / 2} y={y + BH / 2} className="dg-text dg-bold">
            {t}
          </Label>
          {i < items.length - 1 && (
            <Arrow
              x1={boxX(i) + BW + 2}
              y1={y + BH / 2}
              x2={boxX(i + 1) - 2}
              y2={y + BH / 2}
              head={6}
              className="dg-muted"
            />
          )}
        </g>
      ))}
    </g>
  );
}

export function SqlSelectClauseOrder() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        You write SELECT first; the DBMS reads the table first
      </Label>

      <Row y={64} label="the order you write" items={written} tone="dg-fill-muted" />
      <Row y={152} label="the order the DBMS works it out" items={worked} tone="dg-fill-accent" />

      <Label x={W / 2} y={214} className="dg-text-small dg-text-muted">
        FROM gets the rows, WHERE keeps the matches,
      </Label>
      <Label x={W / 2} y={232} className="dg-text-small dg-text-muted">
        GROUP BY makes the groups, SELECT picks the fields to show.
      </Label>
      <Label x={W / 2} y={256} className="dg-text-small dg-text-muted">
        ORDER BY sorts last, whatever order you wrote the clauses in.
      </Label>
      <Label x={W / 2} y={282} className="dg-text-small dg-text-muted">
        That is why WHERE cannot use a nickname created by SELECT.
      </Label>
    </Svg>
  );
}

export default SqlSelectClauseOrder;
