/**
 * Diagram for 9618 11 Programming: Procedures, Functions, Loops, Parameters.
 * Shows structure charts, procedure/function syntax, loop types, parameter passing.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-programming-structure';

const W = 800;
const H = 600;

function CodeBlock({ x, y, lines, width = 280, lineHeight = 22, bgClass = 'dg-fill-muted', textClass = 'dg-text' }: {
  x: number; y: number; lines: string[]; width?: number; lineHeight?: number; bgClass?: string; textClass?: string;
}) {
  const h = lines.length * lineHeight + 12;
  return (
    <g>
      <rect x={x} y={y} width={width} height={h} rx={6} className={bgClass} />
      {lines.map((line, i) => (
        <Label key={i} x={x + 12} y={y + 10 + i * lineHeight} className={`${textClass} dg-mono`}>
          {line}
        </Label>
      ))}
    </g>
  );
}

function LoopDiagram({ x, y, type, label, colorClass, textClass }: {
  x: number; y: number; type: 'for' | 'while' | 'repeat'; label: string; colorClass: string; textClass: string;
}) {
  const W_SYM = 220;
  const H_SYM = 140;
  const cx = x + W_SYM / 2;

  return (
    <g transform={`translate(${x}, ${y})`}>
      <Label x={cx} y={-5} anchor="middle" className={`${textClass} dg-bold`}>{label}</Label>

      {type === 'for' && (
        <>
          <rect x={20} y={10} width={W_SYM - 40} height={35} rx={6} className={colorClass} />
          <Label x={cx} y={30} anchor="middle" className={textClass}>FOR i ← 1 TO 10</Label>

          <Arrow x1={cx} y1={45} x2={cx} y2={70} head={8} className="dg-line" />

          <rect x={20} y={70} width={W_SYM - 40} height={35} rx={6} className="dg-fill-muted dg-thin" />
          <Label x={cx} y={90} anchor="middle" className="dg-text-small dg-muted">Process (body)</Label>

          <Arrow x1={cx} y1={105} x2={cx} y2={130} head={8} className="dg-dashed dg-line" />
          <Label x={cx} y={125} anchor="middle" className="dg-text-small dg-muted">Increment & check</Label>
        </>
      )}

      {type === 'while' && (
        <>
          <polygon points={`${cx},${10} ${cx + 80},${45} ${cx - 80},${45}`} className={colorClass} />
          <Label x={cx} y={30} anchor="middle" className={textClass}>WHILE condition</Label>

          <Arrow x1={cx} y1={45} x2={cx} y2={70} head={8} className="dg-line" />

          <rect x={20} y={70} width={W_SYM - 40} height={35} rx={6} className="dg-fill-muted dg-thin" />
          <Label x={cx} y={90} anchor="middle" className="dg-text-small dg-muted">Process (body)</Label>

          <Arrow x1={cx} y1={105} x2={cx} y2={120} head={8} className="dg-dashed dg-line" />
          <Label x={cx} y={115} anchor="middle" className="dg-text-small dg-muted">Re-check condition</Label>
        </>
      )}

      {type === 'repeat' && (
        <>
          <rect x={20} y={10} width={W_SYM - 40} height={35} rx={6} className="dg-fill-muted dg-thin" />
          <Label x={cx} y={30} anchor="middle" className="dg-text-small dg-muted">Process (body) — runs first</Label>

          <Arrow x1={cx} y1={45} x2={cx} y2={70} head={8} className="dg-line" />

          <polygon points={`${cx},${70} ${cx + 80},${105} ${cx - 80},${105}`} className={colorClass} />
          <Label x={cx} y={90} anchor="middle" className={textClass}>UNTIL condition</Label>

          <Arrow x1={cx} y1={105} x2={cx} y2={120} head={8} className="dg-dashed dg-line" />
          <Label x={cx} y={115} anchor="middle" className="dg-text-small dg-muted">Loop back if false</Label>
        </>
      )}
    </g>
  );
}

export function ProgrammingStructureDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={25} className="dg-text dg-bold" anchor="middle">
        9618 Topic 11: Procedures, Functions & Loops
      </Label>

      {/* Column 1: Procedure vs Function */}
      <g transform="translate(20, 50)">
        <Label x={0} y={0} className="dg-text dg-bold">Procedure vs Function</Label>

        {/* Procedure */}
        <CodeBlock x={0} y={25} lines={[
          "PROCEDURE DisplayMenu()",
          "  PRINT \"1. Add\"",
          "  PRINT \"2. Exit\"",
          "ENDPROCEDURE",
          "",
          "CALL DisplayMenu()  // Statement"
        ]} width={260} bgClass="dg-fill-muted" textClass="dg-text" />

        <Label x={0} y={180} className="dg-text-small dg-muted">No return value • Called as statement</Label>

        {/* Function */}
        <CodeBlock x={0} y={205} lines={[
          "FUNCTION CircleArea(r: REAL) RETURNS REAL",
          "  CONST PI = 3.14159",
          "  RETURN PI * r * r",
          "ENDFUNCTION",
          "",
          "area ← CircleArea(5)  // Expression"
        ]} width={260} bgClass="dg-fill-accent" textClass="dg-text-accent" />

        <Label x={0} y={360} className="dg-text-small dg-muted">Returns value • Used in expressions</Label>
      </g>

      {/* Column 2: Loop Types */}
      <g transform="translate(290, 50)">
        <Label x={0} y={0} className="dg-text dg-bold">Iteration Constructs</Label>

        <LoopDiagram
          x={0} y={25}
          type="for"
          label="Count-Controlled (FOR)"
          colorClass="dg-fill-accent"
          textClass="dg-text-accent"
        />

        <LoopDiagram
          x={0} y={185}
          type="while"
          label="Pre-Condition (WHILE)"
          colorClass="dg-fill-accent-2"
          textClass="dg-text-accent-2"
        />

        <LoopDiagram
          x={0} y={345}
          type="repeat"
          label="Post-Condition (REPEAT...UNTIL)"
          colorClass="dg-fill-accent"
          textClass="dg-text-accent"
        />

        <Label x={0} y={510} className="dg-text-small dg-muted">
          FOR: known count • WHILE: 0+ times • REPEAT: 1+ times
        </Label>
      </g>

      {/* Column 3: Parameters by Value vs By Reference */}
      <g transform="translate(540, 50)">
        <Label x={0} y={0} className="dg-text dg-bold">Parameter Passing</Label>

        {/* By Value */}
        <CodeBlock x={0} y={25} lines={[
          "// By Value (default)",
          "PROCEDURE Increment(x: INTEGER)",
          "  x ← x + 1",
          "ENDPROCEDURE",
          "",
          "num ← 5",
          "CALL Increment(num)",
          "PRINT num  // 5 (unchanged)"
        ]} width={240} bgClass="dg-fill-muted" textClass="dg-text" />

        <Label x={0} y={210} className="dg-text-small dg-muted">Copy passed • Original safe</Label>

        {/* By Reference */}
        <CodeBlock x={0} y={235} lines={[
          "// By Reference (BYREF)",
          "PROCEDURE Increment(BYREF x: INTEGER)",
          "  x ← x + 1",
          "ENDPROCEDURE",
          "",
          "num ← 5",
          "CALL Increment(num)",
          "PRINT num  // 6 (changed!)"
        ]} width={240} bgClass="dg-fill-accent-2" textClass="dg-text-accent-2" />

        <Label x={0} y={420} className="dg-text-small dg-muted">Alias passed • Original modified</Label>

        {/* Swap example */}
        <CodeBlock x={0} y={445} lines={[
          "// Swap needs BYREF",
          "PROCEDURE Swap(BYREF a, BYREF b)",
          "  temp ← a",
          "  a ← b",
          "  b ← temp",
          "ENDPROCEDURE"
        ]} width={240} bgClass="dg-fill-accent" textClass="dg-text-accent" />

        <Label x={0} y={560} className="dg-text-small dg-muted">Two outputs → BYREF params</Label>
      </g>

      {/* Bottom: Structure chart example */}
      <g transform="translate(20, 410)">
        <Label x={0} y={0} className="dg-text dg-bold">Structure Chart Example</Label>

        {/* Main box */}
        <rect x={0} y={25} width={160} height={40} rx={6} className="dg-fill-accent" />
        <Label x={80} y={45} anchor="middle" className="dg-text-accent">Main Program</Label>

        {/* Arrows down */}
        <Arrow x1={80} y1={65} x2={80} y2={85} head={8} className="dg-line" />

        {/* Three sub boxes */}
        <rect x={-10} y={85} width={100} height={35} rx={6} className="dg-fill-muted dg-thin" />
        <Label x={40} y={102} anchor="middle" className="dg-text-small">ReadData</Label>

        <rect x={75} y={85} width={100} height={35} rx={6} className="dg-fill-muted dg-thin" />
        <Label x={125} y={102} anchor="middle" className="dg-text-small">ProcessData</Label>

        <rect x={160} y={85} width={100} height={35} rx={6} className="dg-fill-muted dg-thin" />
        <Label x={210} y={102} anchor="middle" className="dg-text-small">WriteResults</Label>

        <Arrow x1={40} y1={120} x2={40} y2={140} head={8} className="dg-dashed dg-line" />
        <Label x={40} y={138} anchor="middle" className="dg-text-small dg-muted">array (BYREF)</Label>

        <Arrow x1={125} y1={120} x2={125} y2={140} head={8} className="dg-dashed dg-line" />
        <Label x={125} y={138} anchor="middle" className="dg-text-small dg-muted">array, count</Label>

        <Arrow x1={210} y1={120} x2={210} y2={140} head={8} className="dg-dashed dg-line" />
        <Label x={210} y={138} anchor="middle" className="dg-text-small dg-muted">results</Label>

        {/* Lower level */}
        <rect x={75} y={150} width={100} height={35} rx={6} className="dg-fill-accent-2 dg-accent-2" />
        <Label x={125} y={167} anchor="middle" className="dg-text-small dg-text-accent-2">FindMax</Label>

        <Arrow x1={125} y1={135} x2={125} y2={150} head={8} className="dg-line" />
      </g>
    </Svg>
  );
}

export default ProgrammingStructureDiagram;