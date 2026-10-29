/**
 * What INNER JOIN does to rows: Class and Student are paired on ClassID, and rows with no match
 * on either side never reach the result. Row positions are derived from the row height so every
 * row sits inside its table box.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-sql-inner-join-rows';

const W = 680;
const H = 460;

const ROW = 20;
const HEAD = 26;
const HDR_Y = HEAD + 14; // column headings
const ROW0 = HEAD + 34; // first data row
const PAD = 14;

const classes = [
  { id: '1', teacher: 'Mr Okafor' },
  { id: '2', teacher: 'Ms Lindqvist' },
  { id: '3', teacher: 'Mr Adeyemi' },
];

const students = [
  { name: 'Ada', classId: '1' },
  { name: 'Ben', classId: '2' },
  { name: 'Cleo', classId: '1' },
  { name: 'Dev', classId: '2' },
  { name: 'Eve', classId: '1' },
  { name: 'Finn', classId: '4' },
  { name: 'Gus', classId: '1' },
];

const result = [
  { name: 'Ada', teacher: 'Mr Okafor' },
  { name: 'Ben', teacher: 'Ms Lindqvist' },
  { name: 'Cleo', teacher: 'Mr Okafor' },
  { name: 'Dev', teacher: 'Ms Lindqvist' },
  { name: 'Eve', teacher: 'Mr Okafor' },
  { name: 'Gus', teacher: 'Mr Okafor' },
];

const boxH = (rows: number) => ROW0 + (rows - 1) * ROW + PAD;

const CLASS_BOX = { x: 12, y: 70, w: 330 };
const STUDENT_BOX = { x: 12, y: 200, w: 330 };
const RESULT_BOX = { x: 366, y: 200, w: 294 };

function Frame({ box, h }: { box: { x: number; y: number; w: number }; h: number }) {
  return (
    <rect x={box.x} y={box.y} width={box.w} height={h} rx={6} className="dg-fill-surface dg-line" />
  );
}

function Header({ box, text, tone }: { box: { x: number; y: number; w: number }; text: string; tone: string }) {
  return (
    <g>
      <rect x={box.x} y={box.y} width={box.w} height={HEAD} rx={6} className={`${tone} dg-line`} />
      <rect x={box.x} y={box.y + HEAD - 8} width={box.w} height={8} className={tone} />
      <Label x={box.x + 10} y={box.y + HEAD / 2} anchor="start" className="dg-text dg-bold">
        {text}
      </Label>
    </g>
  );
}

export function SqlInnerJoinRows() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        An INNER JOIN pairs rows on a matching key
      </Label>

      <rect x={12} y={34} width={16} height={12} className="dg-fill-surface dg-accent-2 dg-dashed" />
      <Label x={36} y={40} anchor="start" className="dg-text-small dg-text-muted">
        dashed row = no match in the other table, so it is dropped
      </Label>

      {/* Class, the parent */}
      <Frame box={CLASS_BOX} h={boxH(classes.length)} />
      <Header box={CLASS_BOX} text="Class" tone="dg-fill-accent" />
      <Label x={CLASS_BOX.x + 10} y={CLASS_BOX.y + HDR_Y} anchor="start" className="dg-text-small dg-text-accent">
        ClassID (PK)
      </Label>
      <Label x={CLASS_BOX.x + 140} y={CLASS_BOX.y + HDR_Y} anchor="start" className="dg-text-small dg-text-muted">
        Teacher
      </Label>
      {classes.map((c, i) => {
        const y = CLASS_BOX.y + ROW0 + i * ROW;
        const dropped = c.id === '3';
        return (
          <g key={c.id}>
            {dropped && (
              <rect
                x={CLASS_BOX.x + 5}
                y={y - 9}
                width={CLASS_BOX.w - 10}
                height={ROW}
                className="dg-fill-surface dg-accent-2 dg-dashed"
              />
            )}
            <Label x={CLASS_BOX.x + 10} y={y} anchor="start" className="dg-text-small dg-mono">
              {c.id}
            </Label>
            <Label x={CLASS_BOX.x + 140} y={y} anchor="start" className="dg-text-small">
              {c.teacher}
            </Label>
          </g>
        );
      })}

      {/* Student, the child */}
      <Frame box={STUDENT_BOX} h={boxH(students.length)} />
      <Header box={STUDENT_BOX} text="Student" tone="dg-fill-accent-2" />
      <Label x={STUDENT_BOX.x + 10} y={STUDENT_BOX.y + HDR_Y} anchor="start" className="dg-text-small dg-text-muted">
        Name
      </Label>
      <Label x={STUDENT_BOX.x + 140} y={STUDENT_BOX.y + HDR_Y} anchor="start" className="dg-text-small dg-text-accent-2">
        ClassID (FK)
      </Label>
      {students.map((s, i) => {
        const y = STUDENT_BOX.y + ROW0 + i * ROW;
        const dropped = s.classId === '4';
        return (
          <g key={s.name}>
            {dropped && (
              <rect
                x={STUDENT_BOX.x + 5}
                y={y - 9}
                width={STUDENT_BOX.w - 10}
                height={ROW}
                className="dg-fill-surface dg-accent-2 dg-dashed"
              />
            )}
            <Label x={STUDENT_BOX.x + 10} y={y} anchor="start" className="dg-text-small">
              {s.name}
            </Label>
            <Label x={STUDENT_BOX.x + 140} y={y} anchor="start" className="dg-text-small dg-mono">
              {s.classId}
            </Label>
          </g>
        );
      })}

      {/* Result */}
      <Frame box={RESULT_BOX} h={boxH(result.length)} />
      <Header box={RESULT_BOX} text="Result of the INNER JOIN" tone="dg-fill-accent" />
      <Label x={RESULT_BOX.x + 10} y={RESULT_BOX.y + HDR_Y} anchor="start" className="dg-text-small dg-text-muted">
        Name
      </Label>
      <Label x={RESULT_BOX.x + 120} y={RESULT_BOX.y + HDR_Y} anchor="start" className="dg-text-small dg-text-muted">
        Teacher
      </Label>
      {result.map((r, i) => {
        const y = RESULT_BOX.y + ROW0 + i * ROW;
        return (
          <g key={r.name}>
            <Label x={RESULT_BOX.x + 10} y={y} anchor="start" className="dg-text-small">
              {r.name}
            </Label>
            <Label x={RESULT_BOX.x + 120} y={y} anchor="start" className="dg-text-small">
              {r.teacher}
            </Label>
          </g>
        );
      })}

      <Label x={W / 2} y={424} className="dg-text-small dg-text-muted">
        ON Student.ClassID = Class.ClassID — Finn&apos;s class 4 does not exist, class 3 has no students.
      </Label>
      <Label x={W / 2} y={448} className="dg-text-small dg-text-muted">
        Seven students in, six rows out: an INNER JOIN keeps only pairs that match.
      </Label>
    </Svg>
  );
}

export default SqlInnerJoinRows;
