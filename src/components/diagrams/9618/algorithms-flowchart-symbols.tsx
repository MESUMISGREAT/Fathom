/**
 * Diagram for 9618 9.2 Algorithms: Flowchart symbols reference.
 * Shows all standard flowchart symbols used in Cambridge syllabus.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-algorithms-flowchart-symbols';

const W = 800;
const H = 560;

function FlowSymbol({
  x,
  y,
  shape,
  label,
  desc,
  colorClass = 'dg-fill-accent',
  textClass = 'dg-text-accent',
}: {
  x: number;
  y: number;
  shape: 'oval' | 'rect' | 'diamond' | 'parallelogram' | 'predefined' | 'document' | 'connector';
  label: string;
  desc: string;
  colorClass?: string;
  textClass?: string;
}) {
  const W_SYM = 160;
  const H_SYM = 70;

  return (
    <g>
      {shape === 'oval' && (
        <ellipse cx={x + W_SYM / 2} cy={y + H_SYM / 2} rx={W_SYM / 2} ry={H_SYM / 2} className={colorClass} />
      )}
      {shape === 'rect' && <rect x={x} y={y} width={W_SYM} height={H_SYM} rx={6} className={colorClass} />}
      {shape === 'diamond' && (
        <polygon points={`${x + W_SYM / 2},${y} ${x + W_SYM},${y + H_SYM / 2} ${x + W_SYM / 2},${y + H_SYM} ${x},${y + H_SYM / 2}`} className={colorClass} />
      )}
      {shape === 'parallelogram' && (
        <polygon points={`${x + 20},${y} ${x + W_SYM},${y} ${x + W_SYM - 20},${y + H_SYM} ${x},${y + H_SYM}`} className={colorClass} />
      )}
      {shape === 'predefined' && (
        <>
          <rect x={x} y={y} width={W_SYM} height={H_SYM} rx={6} className={colorClass} />
          <rect x={x + 10} y={y} width={W_SYM - 20} height={H_SYM} className="dg-fill-muted dg-thin" />
        </>
      )}
      {shape === 'document' && (
        <path d={`M${x},${y + H_SYM} L${x},${y} L${x + W_SYM - 20},${y} L${x + W_SYM},${y + 20} L${x + W_SYM},${y + H_SYM} Z`} className={colorClass} />
      )}
      {shape === 'connector' && (
        <circle cx={x + W_SYM / 2} cy={y + H_SYM / 2} r={W_SYM / 2} className={colorClass} />
      )}

      <Label x={x + W_SYM / 2} y={y + 18} className={textClass}>{label}</Label>
      <Label x={x + W_SYM / 2} y={y + 40} className="dg-text-small dg-muted">{desc}</Label>
    </g>
  );
}

export function AlgorithmsFlowchartSymbols() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={25} className="dg-text dg-bold" anchor="middle">
        Standard Flowchart Symbols (Cambridge 9618)
      </Label>

      {/* Row 1: Basic symbols */}
      <FlowSymbol x={30} y={55} shape="oval" label="Start / End" desc="Terminator — begin/end of algorithm" colorClass="dg-fill-muted" textClass="dg-text" />
      <FlowSymbol x={210} y={55} shape="rect" label="Process" desc="Calculation, assignment, operation" />
      <FlowSymbol x={390} y={55} shape="diamond" label="Decision" desc="Condition with Yes/No branches" colorClass="dg-fill-accent-2" textClass="dg-text-accent-2" />
      <FlowSymbol x={570} y={55} shape="parallelogram" label="Input / Output" desc="READ (input) or PRINT (output)" colorClass="dg-fill-accent" textClass="dg-text-accent" />

      {/* Row 2: Extended symbols */}
      <FlowSymbol x={30} y={160} shape="predefined" label="Subroutine / Predefined Process" desc="Call to a procedure/function defined elsewhere" colorClass="dg-fill-muted" textClass="dg-text" />
      <FlowSymbol x={210} y={160} shape="document" label="Document / Report" desc="Hardcopy output or printed report" />
      <FlowSymbol x={390} y={160} shape="connector" label="Connector (On-page)" desc="Links flow across same page (letter/number)" colorClass="dg-fill-accent-2" textClass="dg-text-accent-2" />
      <FlowSymbol x={570} y={160} shape="oval" label="Off-page Connector" desc="Links flow to another page" colorClass="dg-fill-accent" textClass="dg-text-accent" />

      {/* Row 3: Arrow / flow line */}
      <g transform="translate(30, 290)">
        <Label x={0} y={0} className="dg-text dg-bold">Flow Lines</Label>
        <Arrow x1={0} y1={40} x2={120} y2={40} head={10} className="dg-line" />
        <Label x={60} y={30} anchor="middle" className="dg-text-small dg-muted">Sequence (solid)</Label>

        <Arrow x1={0} y1={90} x2={120} y2={90} head={10} className="dg-dashed dg-line" />
        <Label x={60} y={80} anchor="middle" className="dg-text-small dg-muted">Alternative / else path (dashed)</Label>

        <Arrow x1={0} y1={140} x2={0} y2={200} head={10} className="dg-line" />
        <Label
          x={-60}
          y={170}
          anchor="middle"
          className="dg-text-small dg-muted"
        >
          Loop back
        </Label>
      </g>

      {/* Row 4: Complete example flowchart */}
      <g transform="translate(250, 280)">
        <Label x={0} y={0} className="dg-text dg-bold">Example: Find max of 3 numbers</Label>

        {/* Start */}
        <ellipse cx={130} cy={45} rx={60} ry={25} className="dg-fill-muted dg-thin" />
        <Label x={130} y={48} anchor="middle" className="dg-text-small">START</Label>

        <Arrow x1={130} y1={70} x2={130} y2={100} head={8} className="dg-line" />

        {/* Input */}
        <polygon points={`${70},${100} ${210},${100} ${190},${135} ${50},${135}`} className="dg-fill-accent dg-accent" />
        <Label x={130} y={115} anchor="middle" className="dg-text-small dg-text-accent">READ a, b, c</Label>

        <Arrow x1={130} y1={135} x2={130} y2={165} head={8} className="dg-line" />

        {/* Process: max = a */}
        <rect x={70} y={165} width={120} height={35} rx={6} className="dg-fill-accent dg-accent" />
        <Label x={130} y={182} anchor="middle" className="dg-text-small dg-text-accent">max ← a</Label>

        <Arrow x1={130} y1={200} x2={130} y2={230} head={8} className="dg-line" />

        {/* Decision: b > max */}
        <polygon points={`${130},${230} ${200},${275} ${130},${320} ${60},${275}`} className="dg-fill-accent-2 dg-accent-2" />
        <Label x={130} y={260} anchor="middle" className="dg-text-small dg-text-accent-2">{'b > max?'}</Label>

        <Label x={210} y={255} anchor="start" className="dg-text-small dg-bold dg-accent-2">Yes</Label>
        <Arrow x1={200} y1={275} x2={260} y2={275} head={8} className="dg-line" />
        <rect x={260} y={257} width={100} height={35} rx={6} className="dg-fill-muted dg-thin" />
        <Label x={310} y={275} anchor="middle" className="dg-text-small">max ← b</Label>

        <Label x={40} y={255} anchor="end" className="dg-text-small dg-bold dg-accent-2">No</Label>
        <Arrow x1={60} y1={275} x2={0} y2={275} head={8} className="dg-line" />

        {/* Decision: c > max */}
        <Arrow x1={130} y1={320} x2={130} y2={350} head={8} className="dg-line" />
        <polygon points={`${130},${350} ${200},${395} ${130},${440} ${60},${395}`} className="dg-fill-accent-2 dg-accent-2" />
        <Label x={130} y={380} anchor="middle" className="dg-text-small dg-text-accent-2">{'c > max?'}</Label>

        <Label x={210} y={375} anchor="start" className="dg-text-small dg-bold dg-accent-2">Yes</Label>
        <Arrow x1={200} y1={395} x2={260} y2={395} head={8} className="dg-line" />
        <rect x={260} y={377} width={100} height={35} rx={6} className="dg-fill-muted dg-thin" />
        <Label x={310} y={395} anchor="middle" className="dg-text-small">max ← c</Label>

        <Label x={40} y={375} anchor="end" className="dg-text-small dg-bold dg-accent-2">No</Label>
        <Arrow x1={60} y1={395} x2={0} y2={395} head={8} className="dg-line" />

        {/* Output */}
        <Arrow x1={130} y1={440} x2={130} y2={470} head={8} className="dg-line" />
        <polygon points={`${70},${470} ${210},${470} ${190},${505} ${50},${505}`} className="dg-fill-accent dg-accent" />
        <Label x={130} y={485} anchor="middle" className="dg-text-small dg-text-accent">PRINT max</Label>

        <Arrow x1={130} y1={505} x2={130} y2={535} head={8} className="dg-line" />

        {/* End */}
        <ellipse cx={130} cy={560} rx={60} ry={25} className="dg-fill-muted dg-thin" />
        <Label x={130} y={563} anchor="middle" className="dg-text-small">END</Label>
      </g>
    </Svg>
  );
}

export default AlgorithmsFlowchartSymbols;