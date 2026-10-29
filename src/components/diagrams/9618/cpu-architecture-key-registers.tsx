/**
 * The four registers behind every instruction. PC feeds the MAR with the address
 * of the next instruction; memory returns the contents of that address into the
 * MDR; the MDR is copied into the CIR, which holds the instruction being decoded
 * and executed.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Box } from './cpu-architecture-kit';

export const diagramKey = 'cs-cpu-architecture-key-registers';

const W = 620;
const H = 400;

export function CpuArchitectureKeyRegisters() {
  return (
    <Svg width={W} height={H}>
      <Box x={20} y={40} w={300} h={64} title="PC — Program Counter" lines={['address of the next instruction']} />
      <Box x={20} y={130} w={300} h={64} title="MAR — Memory Address Register" lines={['address of the location being accessed']} />
      <Box x={20} y={220} w={300} h={64} title="MDR — Memory Data Register" lines={['data moving between CPU and memory']} />
      <Box x={20} y={310} w={300} h={64} title="CIR — Current Instruction Register" lines={['instruction being decoded and executed']} />

      <rect x={420} y={130} width={180} height={154} rx={12} className="dg-fill-muted dg-thin" />
      <Label x={510} y={154} className="dg-text dg-bold">
        Main memory
      </Label>
      <rect x={440} y={176} width={140} height={30} rx={5} className="dg-fill-surface dg-thin" />
      <rect x={440} y={212} width={140} height={30} rx={5} className="dg-fill-surface dg-thin" />
      <Label x={510} y={268} className="dg-text-small dg-text-muted">
        one cell per address
      </Label>

      <Arrow x1={170} y1={104} x2={170} y2={130} head={8} />
      <Arrow x1={320} y1={162} x2={420} y2={162} head={8} />
      <Label x={370} y={148} className="dg-text-small">
        address
      </Label>
      <Arrow x1={420} y1={252} x2={320} y2={252} head={8} />
      <Label x={370} y={238} className="dg-text-small">
        contents
      </Label>
      <Arrow x1={170} y1={284} x2={170} y2={310} head={8} />
    </Svg>
  );
}

export default CpuArchitectureKeyRegisters;
