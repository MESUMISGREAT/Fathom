/**
 * StudentID determines TutorID, and TutorID determines TutorName, so TutorName
 * depends transitively on the key. Moving it into a Tutor table removes the
 * chain; Student keeps TutorID as a foreign key.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-database-concepts-transitive-dependency';

const W = 620;
const H = 380;

function Box({ x, y, w, text, tone = 'accent' }: { x: number; y: number; w: number; text: string; tone?: 'accent' | 'accent-2' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={44} rx={6} className={tone === 'accent' ? 'dg-fill-accent dg-thin' : 'dg-fill-accent-2 dg-thin'} />
      <Label x={x + w / 2} y={y + 22} className="dg-text-small dg-bold dg-mono">
        {text}
      </Label>
    </g>
  );
}

function Table({ x, y, w, title, rows }: { x: number; y: number; w: number; title: string; rows: string[] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26 + rows.length * 24} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={x + w / 2} y={y + 14} className="dg-text-small dg-bold">
        {title}
      </Label>
      {rows.map((r, i) => (
        <g key={r}>
          <line x1={x} y1={y + 26 + i * 24} x2={x + w} y2={y + 26 + i * 24} className="dg-thin" />
          <Label x={x + w / 2} y={y + 38 + i * 24} className="dg-text-small dg-mono">
            {r}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function DatabaseConceptsTransitiveDependency() {
  return (
    <Svg width={W} height={H}>
      <Box x={48} y={56} w={130} text="StudentID" />
      <Box x={245} y={56} w={130} text="TutorID" />
      <Box x={442} y={56} w={130} text="TutorName" tone="accent-2" />

      <Arrow x1={178} y1={78} x2={245} y2={78} />
      <Arrow x1={375} y1={78} x2={442} y2={78} />
      <Label x={211} y={116} className="dg-text-small dg-text-muted">
        determines
      </Label>
      <Label x={408} y={116} className="dg-text-small dg-text-muted">
        determines
      </Label>

      <path d="M105,102 L105,140 L500,140 L500,102" className="dg-accent-2 dg-dashed" fill="none" />
      <Label x={302} y={158} className="dg-text-small dg-text-accent-2">
        transitive dependency
      </Label>

      <Table x={48} y={200} w={230} title="Student" rows={['StudentID (PK)', 'StudentName', 'TutorID (FK)']} />
      <Table x={380} y={200} w={160} title="Tutor" rows={['TutorID (PK)', 'TutorName']} />

      <Arrow x1={280} y1={290} x2={380} y2={290} />
      <Label x={330} y={278} className="dg-text-small dg-text-accent">
        FK
      </Label>

      <Label x={310} y={352} className="dg-text-small dg-text-muted">
        TutorName moves to the table keyed by TutorID, and Student keeps TutorID as a link.
      </Label>
    </Svg>
  );
}

export default DatabaseConceptsTransitiveDependency;
