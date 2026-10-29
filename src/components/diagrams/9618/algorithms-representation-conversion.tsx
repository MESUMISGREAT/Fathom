/**
 * Diagram for 9618 9.2 Algorithms: Converting between representations.
 * Shows the three representations side by side for the same algorithm.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-algorithms-representation-conversion';

const W = 900;
const H = 580;

function Box({ x, y, w, h, title, lines, colorClass = 'dg-fill-accent', textClass = 'dg-text-accent', titleClass = 'dg-text dg-bold' }: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  lines: string[];
  colorClass?: string;
  textClass?: string;
  titleClass?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className={colorClass} />
      <Label x={x + w / 2} y={y + 20} anchor="middle" className={titleClass}>{title}</Label>
      {lines.map((line, i) => (
        <Label key={i} x={x + 10} y={y + 40 + i * 22} className={`${textClass} dg-text-small`}>{line}</Label>
      ))}
    </g>
  );
}

function FlowSymbol({ x, y, shape, label, colorClass = 'dg-fill-accent', textClass = 'dg-text-accent' }: {
  x: number;
  y: number;
  shape: 'oval' | 'rect' | 'diamond' | 'parallelogram';
  label: string;
  colorClass?: string;
  textClass?: string;
}) {
  const W_SYM = 140;
  const H_SYM = 50;

  return (
    <g>
      {shape === 'oval' && <ellipse cx={x + W_SYM / 2} cy={y + H_SYM / 2} rx={W_SYM / 2} ry={H_SYM / 2} className={colorClass} />}
      {shape === 'rect' && <rect x={x} y={y} width={W_SYM} height={H_SYM} rx={6} className={colorClass} />}
      {shape === 'diamond' && <polygon points={`${x + W_SYM / 2},${y} ${x + W_SYM},${y + H_SYM / 2} ${x + W_SYM / 2},${y + H_SYM} ${x},${y + H_SYM / 2}`} className={colorClass} />}
      {shape === 'parallelogram' && <polygon points={`${x + 15},${y} ${x + W_SYM},${y} ${x + W_SYM - 15},${y + H_SYM} ${x},${y + H_SYM}`} className={colorClass} />}

      <Label x={x + W_SYM / 2} y={y + H_SYM / 2 + 4} anchor="middle" className={textClass}>{label}</Label>
    </g>
  );
}

export function AlgorithmsRepresentationConversion() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={25} className="dg-text dg-bold" anchor="middle">
        Converting Between Representations: Find Maximum of 3 Numbers
      </Label>

      {/* Column headers */}
      <Label x={75} y={55} anchor="middle" className="dg-text dg-bold dg-accent">Structured English</Label>
      <Label x={340} y={55} anchor="middle" className="dg-text dg-bold dg-accent-2">Pseudocode</Label>
      <Label x={680} y={55} anchor="middle" className="dg-text dg-bold dg-muted">Flowchart</Label>

      {/* Structured English column */}
      <Box
        x={10}
        y={70}
        w={130}
        h={460}
        title="Algorithm"
        lines={[
          "READ the three numbers",
          "SET max to first number",
          "IF second > max THEN",
          "    SET max to second",
          "ENDIF",
          "IF third > max THEN",
          "    SET max to third",
          "ENDIF",
          "PRINT max",
        ]}
        colorClass="dg-fill-muted dg-thin"
        textClass="dg-text"
        titleClass="dg-text dg-bold dg-muted"
      />

      {/* Pseudocode column */}
      <Box
        x={200}
        y={70}
        w={280}
        h={460}
        title="// INPUT"
        lines={[
          "READ a, b, c",
          "",
          "// PROCESS",
          "max ← a",
          "IF b > max THEN",
          "    max ← b",
          "ENDIF",
          "IF c > max THEN",
          "    max ← c",
          "ENDIF",
          "",
          "// OUTPUT",
          "PRINT max",
        ]}
        colorClass="dg-fill-accent dg-accent"
        textClass="dg-text-accent"
      />

      {/* Flowchart column */}
      <g transform="translate(520, 70)">
        {/* Start */}
        <FlowSymbol x={80} y={0} shape="oval" label="START" colorClass="dg-fill-muted dg-thin" textClass="dg-text" />
        <Arrow x1={150} y1={50} x2={150} y2={70} head={8} className="dg-line" />

        {/* Input */}
        <FlowSymbol x={80} y={70} shape="parallelogram" label="READ a, b, c" />
        <Arrow x1={150} y1={120} x2={150} y2={140} head={8} className="dg-line" />

        {/* Process: max ← a */}
        <FlowSymbol x={80} y={140} shape="rect" label="max ← a" />
        <Arrow x1={150} y1={190} x2={150} y2={210} head={8} className="dg-line" />

        {/* Decision: b > max */}
        <FlowSymbol x={80} y={210} shape="diamond" label="b > max?" colorClass="dg-fill-accent-2" textClass="dg-text-accent-2" />
        <Arrow x1={220} y1={235} x2={280} y2={235} head={8} className="dg-line" />
        <Label x={230} y={225} anchor="start" className="dg-text-small dg-bold dg-accent-2">Yes</Label>
        <FlowSymbol x={280} y={210} shape="rect" label="max ← b" colorClass="dg-fill-muted dg-thin" textClass="dg-text" />
        <Arrow x1={350} y1={235} x2={410} y2={235} head={8} className="dg-dashed dg-line" />
        <Label x={15} y={235} anchor="end" className="dg-text-small dg-bold dg-accent-2">No</Label>

        {/* Arrow down from decision (No path) */}
        <Arrow x1={150} y1={260} x2={150} y2={280} head={8} className="dg-line" />

        {/* Decision: c > max */}
        <FlowSymbol x={80} y={280} shape="diamond" label="c > max?" colorClass="dg-fill-accent-2" textClass="dg-text-accent-2" />
        <Arrow x1={220} y1={305} x2={280} y2={305} head={8} className="dg-line" />
        <Label x={230} y={295} anchor="start" className="dg-text-small dg-bold dg-accent-2">Yes</Label>
        <FlowSymbol x={280} y={280} shape="rect" label="max ← c" colorClass="dg-fill-muted dg-thin" textClass="dg-text" />
        <Arrow x1={350} y1={305} x2={410} y2={305} head={8} className="dg-dashed dg-line" />
        <Label x={15} y={305} anchor="end" className="dg-text-small dg-bold dg-accent-2">No</Label>

        {/* Arrow down from second decision (No path) */}
        <Arrow x1={150} y1={330} x2={150} y2={350} head={8} className="dg-line" />

        {/* Output */}
        <FlowSymbol x={80} y={350} shape="parallelogram" label="PRINT max" />
        <Arrow x1={150} y1={400} x2={150} y2={420} head={8} className="dg-line" />

        {/* End */}
        <FlowSymbol x={80} y={420} shape="oval" label="END" colorClass="dg-fill-muted dg-thin" textClass="dg-text" />
      </g>

      {/* Mapping arrows between columns */}
      <g transform="translate(140, 100)">
        <Arrow x1={0} y1={0} x2={60} y2={0} head={8} className="dg-dashed dg-accent" />
        <Label x={30} y={-10} anchor="middle" className="dg-text-small dg-bold dg-accent">maps to</Label>
      </g>
      <g transform="translate(480, 100)">
        <Arrow x1={0} y1={0} x2={60} y2={0} head={8} className="dg-dashed dg-accent-2" />
        <Label x={30} y={-10} anchor="middle" className="dg-text-small dg-bold dg-accent-2">maps to</Label>
      </g>

      {/* Key mapping notes */}
      <g transform="translate(20, 540)">
        <Label x={0} y={0} className="dg-text-small dg-bold">Key mappings:</Label>
        <Label x={120} y={0} className="dg-text-small">READ → Parallelogram (input)</Label>
        <Label x={320} y={0} className="dg-text-small">Assignment → Rectangle</Label>
        <Label x={480} y={0} className="dg-text-small">IF → Diamond (Yes/No)</Label>
        <Label x={650} y={0} className="dg-text-small">PRINT → Parallelogram (output)</Label>
        <Label x={800} y={0} className="dg-text-small">START/END → Oval</Label>
      </g>
    </Svg>
  );
}

export default AlgorithmsRepresentationConversion;