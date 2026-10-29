/**
 * Diagram for 9618 9.1 Computational Thinking Skills: Abstraction and Decomposition.
 *
 * Left panel: Abstraction layers — concrete reality → abstract model → code.
 * Right panel: Decomposition tree — problem → sub-problems → modules (functions).
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'cs-computational-thinking-abstraction-decomposition';

const W = 720;
const H = 420;

// Shared dimensions
const BOX_W = 200;
const BOX_H = 60;
const GAP = 30;

// Left panel: Abstraction layers (vertical stack)
const LEFT_X = 40;
const LAYER_Y = [40, 140, 240, 340];
const LY0 = LAYER_Y[0]!;
const LY1 = LAYER_Y[1]!;
const LY2 = LAYER_Y[2]!;
const LY3 = LAYER_Y[3]!;

// Right panel: Decomposition tree
const RIGHT_X = 380;
const ROOT_Y = 40;
const LEVEL1_Y = 160;
const LEVEL2_Y = 280;
const MODULE_Y = 380;

const ROOT_X = RIGHT_X + 140;
const LEVEL1_X = [RIGHT_X + 20, RIGHT_X + 220];
const LEVEL2_X = [RIGHT_X + 20, RIGHT_X + 110, RIGHT_X + 220, RIGHT_X + 310];
const MODULE_X = [RIGHT_X + 20, RIGHT_X + 110, RIGHT_X + 220, RIGHT_X + 310];

// Non-null assertions for array access (TypeScript strict mode)
const L1X0 = LEVEL1_X[0]!;
const L1X1 = LEVEL1_X[1]!;
const L2X0 = LEVEL2_X[0]!;
const L2X1 = LEVEL2_X[1]!;
const L2X2 = LEVEL2_X[2]!;
const L2X3 = LEVEL2_X[3]!;
const MX0 = MODULE_X[0]!;
const MX1 = MODULE_X[1]!;
const MX2 = MODULE_X[2]!;
const MX3 = MODULE_X[3]!;

function AbstractionLayer({
  y,
  title,
  details,
  colorClass,
  textClass,
}: {
  y: number;
  title: string;
  details: string[];
  colorClass: string;
  textClass: string;
}) {
  return (
    <g>
      <rect
        x={LEFT_X}
        y={y}
        width={BOX_W}
        height={BOX_H}
        rx={8}
        className={colorClass}
      />
      <Label x={LEFT_X + BOX_W / 2} y={y + 18} className={textClass}>
        {title}
      </Label>
      {details.map((d, i) => (
        <Label
          key={i}
          x={LEFT_X + BOX_W / 2}
          y={y + 38 + i * 14}
          className="dg-text-small dg-muted"
        >
          {d}
        </Label>
      ))}
    </g>
  );
}

function DecompNode({
  x,
  y,
  w,
  title,
  subtitle,
  colorClass,
  textClass,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  subtitle?: string;
  colorClass: string;
  textClass: string;
}) {
  const h = subtitle ? 56 : 44;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className={colorClass} />
      <Label x={x + w / 2} y={y + 16} className={textClass}>
        {title}
      </Label>
      {subtitle && (
        <Label x={x + w / 2} y={y + 36} className="dg-text-small dg-muted">
          {subtitle}
        </Label>
      )}
    </g>
  );
}

export function ComputationalThinkingAbstractionDecomposition() {
  return (
    <Svg width={W} height={H}>
      {/* Title labels */}
      <Label x={LEFT_X + BOX_W / 2} y={20} className="dg-text dg-bold">
        Abstraction Layers
      </Label>
      <Label x={ROOT_X} y={20} className="dg-text dg-bold">
        Decomposition Tree
      </Label>

      {/* LEFT: Abstraction layers */}
      <AbstractionLayer
        y={LY0}
        title="Concrete Reality"
        details={['Physical library building', 'Books on shelves', 'Librarians, patrons', 'Paper loan cards', 'Opening hours, fines']}
        colorClass="dg-fill-muted dg-thin"
        textClass="dg-text"
      />

      <Arrow
        x1={LEFT_X + BOX_W / 2}
        y1={LY0 + BOX_H}
        x2={LEFT_X + BOX_W / 2}
        y2={LY1}
        head={8}
        className="dg-muted"
      />
      <Label x={LEFT_X + BOX_W / 2 + 12} y={LY0 + BOX_H + 20} anchor="start" className="dg-text-small dg-bold dg-muted">
        abstract
      </Label>

      <AbstractionLayer
        y={LY1}
        title="Essential Model"
        details={['Entity: Book (ISBN, title, author)', 'Entity: Borrower (ID, name)', 'Entity: Loan (links Book↔Borrower)', 'Relationships: has/borrows']}
        colorClass="dg-fill-accent dg-accent"
        textClass="dg-text-accent"
      />

      <Arrow
        x1={LEFT_X + BOX_W / 2}
        y1={LY1 + BOX_H}
        x2={LEFT_X + BOX_W / 2}
        y2={LY2}
        head={8}
        className="dg-muted"
      />
      <Label x={LEFT_X + BOX_W / 2 + 12} y={LY1 + BOX_H + 20} anchor="start" className="dg-text-small dg-bold dg-muted">
        implement
      </Label>

      <AbstractionLayer
        y={LY2}
        title="Data Structures & ADTs"
        details={['Book record / class', 'Borrower record / class', 'Loan record / class', 'Collections: arrays, maps, queues']}
        colorClass="dg-fill-accent-2 dg-accent-2"
        textClass="dg-text-accent-2"
      />

      <Arrow
        x1={LEFT_X + BOX_W / 2}
        y1={LY2 + BOX_H}
        x2={LEFT_X + BOX_W / 2}
        y2={LY3}
        head={8}
        className="dg-muted"
      />
      <Label x={LEFT_X + BOX_W / 2 + 12} y={LY2 + BOX_H + 20} anchor="start" className="dg-text-small dg-bold dg-muted">
        code
      </Label>

      <AbstractionLayer
        y={LY3}
        title="Procedures / Functions"
        details={['addBook(), removeBook()', 'registerBorrower()', 'issueLoan(), returnLoan()', 'overdueReport()']}
        colorClass="dg-fill-accent dg-accent"
        textClass="dg-text-accent"
      />

      {/* RIGHT: Decomposition tree */}
      {/* Root problem */}
      <DecompNode
        x={ROOT_X - 100}
        y={ROOT_Y}
        w={200}
        title="Calculate Final Grade"
        subtitle="3 exams weighted 30/30/40"
        colorClass="dg-fill-muted dg-thin"
        textClass="dg-text"
      />

      {/* Level 1: Sub-problems */}
      <Arrow
        x1={ROOT_X}
        y1={ROOT_Y + 44}
        x2={L1X0 + 90}
        y2={LEVEL1_Y}
        head={8}
        className="dg-line"
      />
      <Arrow
        x1={ROOT_X}
        y1={ROOT_Y + 44}
        x2={L1X1 + 90}
        y2={LEVEL1_Y}
        head={8}
        className="dg-line"
      />

      <DecompNode
        x={L1X0}
        y={LEVEL1_Y}
        w={180}
        title="Validate Inputs"
        subtitle="Check marks in range 0–100"
        colorClass="dg-fill-accent dg-accent"
        textClass="dg-text-accent"
      />
      <DecompNode
        x={L1X1}
        y={LEVEL1_Y}
        w={180}
        title="Compute & Report"
        subtitle="Weighted average → grade → output"
        colorClass="dg-fill-accent dg-accent"
        textClass="dg-text-accent"
      />

      {/* Level 2: Further breakdown of "Compute & Report" */}
      <Arrow
        x1={L1X1 + 90}
        y1={LEVEL1_Y + 56}
        x2={L2X2 + 80}
        y2={LEVEL2_Y}
        head={8}
        className="dg-dashed dg-line"
      />
      <Arrow
        x1={L1X1 + 90}
        y1={LEVEL1_Y + 56}
        x2={L2X3 + 80}
        y2={LEVEL2_Y}
        head={8}
        className="dg-dashed dg-line"
      />

      <DecompNode
        x={L2X2}
        y={LEVEL2_Y}
        w={160}
        title="Weighted Average"
        subtitle="0.3×m1 + 0.3×m2 + 0.4×m3"
        colorClass="dg-fill-accent-2 dg-accent-2"
        textClass="dg-text-accent-2"
      />
      <DecompNode
        x={L2X3}
        y={LEVEL2_Y}
        w={160}
        title="Grade Lookup"
        subtitle="A*/A/B/C/D/E/U boundaries"
        colorClass="dg-fill-accent-2 dg-accent-2"
        textClass="dg-text-accent-2"
      />

      {/* Module level: functions */}
      <Arrow
        x1={L1X0 + 90}
        y1={LEVEL1_Y + 56}
        x2={MX0 + 75}
        y2={MODULE_Y}
        head={8}
        className="dg-line"
      />
      <Arrow
        x1={L2X2 + 80}
        y1={LEVEL2_Y + 56}
        x2={MX1 + 75}
        y2={MODULE_Y}
        head={8}
        className="dg-line"
      />
      <Arrow
        x1={L2X3 + 80}
        y1={LEVEL2_Y + 56}
        x2={MX2 + 75}
        y2={MODULE_Y}
        head={8}
        className="dg-line"
      />
      <Arrow
        x1={L1X1 + 90}
        y1={LEVEL1_Y + 56}
        x2={MX3 + 75}
        y2={MODULE_Y}
        head={8}
        className="dg-dashed dg-line"
      />

      <DecompNode
        x={MX0}
        y={MODULE_Y}
        w={150}
        title="validateMarks()"
        colorClass="dg-fill-muted dg-thin"
        textClass="dg-text"
      />
      <DecompNode
        x={MX1}
        y={MODULE_Y}
        w={150}
        title="weightedAverage()"
        colorClass="dg-fill-muted dg-thin"
        textClass="dg-text"
      />
      <DecompNode
        x={MX2}
        y={MODULE_Y}
        w={150}
        title="lookupGrade()"
        colorClass="dg-fill-muted dg-thin"
        textClass="dg-text"
      />
      <DecompNode
        x={MX3}
        y={MODULE_Y}
        w={150}
        title="formatReport()"
        colorClass="dg-fill-muted dg-thin"
        textClass="dg-text"
      />

      {/* Labels for decomposition levels */}
      <Label x={RIGHT_X + 340} y={ROOT_Y + 20} anchor="end" className="dg-text-small dg-muted">
        Problem
      </Label>
      <Label x={RIGHT_X + 340} y={LEVEL1_Y + 20} anchor="end" className="dg-text-small dg-muted">
        Sub-problems
      </Label>
      <Label x={RIGHT_X + 340} y={LEVEL2_Y + 20} anchor="end" className="dg-text-small dg-muted">
        Further split
      </Label>
      <Label x={RIGHT_X + 340} y={MODULE_Y + 20} anchor="end" className="dg-text-small dg-muted">
        Functions / modules
      </Label>

      {/* Arrow label: each sub-problem → module */}
      <Label x={ROOT_X} y={ROOT_Y + 70} anchor="start" className="dg-text-small dg-bold dg-accent">
        decompose
      </Label>
    </Svg>
  );
}

export default ComputationalThinkingAbstractionDecomposition;