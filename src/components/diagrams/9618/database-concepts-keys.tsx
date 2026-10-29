/**
 * Two tables linked by a foreign key. StudentID is underlined as the primary
 * key of Student; Loan.StudentID refers to it. The notes on the right define the
 * four kinds of key students must distinguish.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-database-concepts-keys';

const W = 620;
const H = 400;

// Student table: three columns at x = 40, 125, 210.
const S_TOP = 48;
const S_ROW_H = 30;
const S_BOTTOM = S_TOP + 32 + 2 * S_ROW_H;

// Loan table: four columns at x = 40, 110, 195, 265.
const L_TOP = 236;

function Header({ x, y, w, text, underline }: { x: number; y: number; w: number; text: string; underline?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={32} className="dg-fill-muted dg-thin" />
      <Label x={x + w / 2} y={y + 16} className="dg-text-small dg-bold">
        {text}
      </Label>
      {underline && <line x1={x + 5} y1={y + 26} x2={x + w - 5} y2={y + 26} className="dg-line" />}
    </g>
  );
}

function Cell({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return (
    <Label x={x + w / 2} y={y + 15} className="dg-text-small dg-mono">
      {text}
    </Label>
  );
}

const NOTES: Array<[string, string]> = [
  ['Primary key', 'uniquely identifies a record'],
  ['Candidate key', 'could have been the key'],
  ['Secondary key', 'indexed for searching'],
  ['Foreign key', 'a key from another table'],
];

export function DatabaseConceptsKeys() {
  return (
    <Svg width={W} height={H}>
      <Label x={40} y={S_TOP - 14} anchor="start" className="dg-text-small dg-text-muted">
        Student table
      </Label>
      <Header x={40} y={S_TOP} w={85} text="StudentID" underline />
      <Header x={125} y={S_TOP} w={85} text="Forename" />
      <Header x={210} y={S_TOP} w={80} text="Surname" />

      <rect x={40} y={S_TOP + 32} width={250} height={60} className="dg-thin" />
      <line x1={125} y1={S_TOP + 32} x2={125} y2={S_BOTTOM} className="dg-thin" />
      <line x1={210} y1={S_TOP + 32} x2={210} y2={S_BOTTOM} className="dg-thin" />
      <line x1={40} y1={S_TOP + 62} x2={290} y2={S_TOP + 62} className="dg-thin" />
      <Cell x={40} y={S_TOP + 32} w={85} text="S01" />
      <Cell x={125} y={S_TOP + 32} w={85} text="Amina" />
      <Cell x={210} y={S_TOP + 32} w={80} text="Khan" />
      <Cell x={40} y={S_TOP + 62} w={85} text="S02" />
      <Cell x={125} y={S_TOP + 62} w={85} text="Ben" />
      <Cell x={210} y={S_TOP + 62} w={80} text="Osei" />

      <Label x={40} y={L_TOP - 14} anchor="start" className="dg-text-small dg-text-muted">
        Loan table
      </Label>
      <Header x={40} y={L_TOP} w={70} text="LoanID" />
      <Header x={110} y={L_TOP} w={85} text="StudentID" />
      <Header x={195} y={L_TOP} w={70} text="BookID" />
      <Header x={265} y={L_TOP} w={75} text="DueDate" />

      <rect x={40} y={L_TOP + 32} width={300} height={60} className="dg-thin" />
      <line x1={110} y1={L_TOP + 32} x2={110} y2={L_TOP + 92} className="dg-thin" />
      <line x1={195} y1={L_TOP + 32} x2={195} y2={L_TOP + 92} className="dg-thin" />
      <line x1={265} y1={L_TOP + 32} x2={265} y2={L_TOP + 92} className="dg-thin" />
      <line x1={40} y1={L_TOP + 62} x2={340} y2={L_TOP + 62} className="dg-thin" />
      <Cell x={40} y={L_TOP + 32} w={70} text="L1" />
      <Cell x={110} y={L_TOP + 32} w={85} text="S01" />
      <Cell x={195} y={L_TOP + 32} w={70} text="B1042" />
      <Cell x={265} y={L_TOP + 32} w={75} text="03 Nov" />
      <Cell x={40} y={L_TOP + 62} w={70} text="L2" />
      <Cell x={110} y={L_TOP + 62} w={85} text="S01" />
      <Cell x={195} y={L_TOP + 62} w={70} text="B1088" />
      <Cell x={265} y={L_TOP + 62} w={75} text="10 Nov" />

      <path d="M152,232 L152,205 L82,205 L82,142" className="dg-accent-2 dg-dashed" fill="none" />
      <Label x={158} y={212} anchor="start" className="dg-text-small dg-text-accent-2">
        foreign key
      </Label>

      {NOTES.map(([term, meaning], i) => (
        <g key={term}>
          <Label x={380} y={70 + i * 56} anchor="start" className="dg-text-small dg-bold">
            {term}
          </Label>
          <Label x={380} y={88 + i * 56} anchor="start" className="dg-text-small dg-text-muted">
            {meaning}
          </Label>
        </g>
      ))}

      <Label x={310} y={368} className="dg-text-small dg-text-muted">
        StudentID appears once as a key and many times as a link. That repetition is the relationship.
      </Label>
    </Svg>
  );
}

export default DatabaseConceptsKeys;
