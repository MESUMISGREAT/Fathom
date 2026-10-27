/**
 * The fetch–execute cycle: a two-stage loop. Fetch is four register transfers —
 * PC → MAR, MEM[MAR] → MDR, MDR → CIR, PC + 1 → PC. Execute decodes the CIR in
 * the Control Unit, performs the operation in the ALU and stores the result.
 * The arrow returns to fetch for the next instruction.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'cs-cpu-architecture-fetch-execute';

const W = 620;
const H = 400;

export function CpuArchitectureFetchExecute() {
  return (
    <Svg width={W} height={H}>
      <rect x={40} y={70} width={250} height={260} rx={12} className="dg-fill-surface dg-thin" />
      <Label x={165} y={96} className="dg-text dg-bold">
        1. Fetch
      </Label>
      <MathLabel x={165} y={136} w={240} h={30} tex={"\\text{PC} \\rightarrow \\text{MAR}"} />
      <MathLabel x={165} y={176} w={240} h={30} tex={"\\text{MEM}[\\text{MAR}] \\rightarrow \\text{MDR}"} />
      <MathLabel x={165} y={216} w={240} h={30} tex={"\\text{MDR} \\rightarrow \\text{CIR}"} />
      <MathLabel x={165} y={256} w={240} h={30} tex={"\\text{PC} + 1 \\rightarrow \\text{PC}"} />
      {['1', '2', '3', '4'].map((n, i) => (
        <Label key={n} x={56} y={136 + i * 40} anchor="start" className="dg-text-small dg-text-muted">
          {n}.
        </Label>
      ))}

      <rect x={330} y={70} width={250} height={260} rx={12} className="dg-fill-surface dg-thin" />
      <Label x={455} y={96} className="dg-text dg-bold">
        2. Execute
      </Label>
      <Label x={455} y={136} className="dg-text-small">
        Control Unit decodes the CIR
      </Label>
      <Label x={455} y={176} className="dg-text-small">
        ALU performs the operation
      </Label>
      <MathLabel x={455} y={216} w={240} h={30} tex={"\\text{result} \\rightarrow \\text{ACC}"} />
      <Label x={455} y={256} className="dg-text-small">
        flags → status register
      </Label>

      <line x1={165} y1={70} x2={165} y2={56} className="dg-line" />
      <line x1={455} y1={56} x2={455} y2={70} className="dg-line" />
      <Arrow x1={163} y1={56} x2={457} y2={56} head={8} />
      <Label x={310} y={40} className="dg-text-small">
        then start the next instruction
      </Label>

      <line x1={455} y1={330} x2={455} y2={344} className="dg-line" />
      <line x1={165} y1={344} x2={165} y2={330} className="dg-line" />
      <Arrow x1={457} y1={344} x2={163} y2={344} head={8} />
      <Label x={310} y={364} className="dg-text-small">
        fetch again — the cycle repeats
      </Label>
    </Svg>
  );
}

export default CpuArchitectureFetchExecute;
