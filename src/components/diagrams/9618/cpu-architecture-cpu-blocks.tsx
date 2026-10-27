/**
 * Inside the CPU: the Control Unit issues dashed control signals to the ALU, the
 * registers, the system clock and (through the control bus) main memory. Data
 * flows through the ALU. Main memory sits outside the CPU, reached by the buses.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Box, Cell } from './cpu-architecture-kit';

export const diagramKey = 'cs-cpu-architecture-cpu-blocks';

const W = 620;
const H = 400;

const cells = ['ACC', 'IX', 'PC', 'MAR', 'MDR', 'CIR', 'Status'];

export function CpuArchitectureCpuBlocks() {
  return (
    <Svg width={W} height={H}>
      <rect x={20} y={40} width={380} height={320} rx={14} className="dg-fill-accent dg-accent" />
      <Label x={44} y={66} anchor="start" className="dg-text dg-bold">
        CPU
      </Label>
      <Label x={40} y={92} anchor="start" className="dg-text-small dg-text-muted">
        registers
      </Label>
      {cells.map((c, i) => (
        <Cell key={c} x={36 + i * 50} y={100} w={48} h={34} label={c} />
      ))}

      <Box x={60} y={180} w={130} h={76} title="Control Unit" />
      <Box x={230} y={180} w={130} h={76} title="ALU" lines={['arithmetic + logic']} />

      <Arrow x1={190} y1={218} x2={230} y2={218} double head={7} />

      <Arrow x1={110} y1={180} x2={110} y2={138} className="dg-dashed dg-accent" headClassName="dg-dot-accent" head={7} />
      <Arrow x1={295} y1={180} x2={295} y2={138} double head={7} />

      <Box x={60} y={290} w={130} h={60} title="System clock" lines={['3 GHz pulses']} />
      <Arrow x1={110} y1={256} x2={110} y2={286} className="dg-dashed dg-accent" headClassName="dg-dot-accent" head={7} />

      <rect x={470} y={150} width={140} height={140} rx={12} className="dg-fill-muted dg-thin" />
      <Label x={540} y={176} className="dg-text dg-bold">
        Main memory
      </Label>
      <Label x={540} y={198} className="dg-text-small">
        instructions + data
      </Label>
      <Label x={540} y={220} className="dg-text-small dg-text-muted">
        outside the CPU
      </Label>

      <Arrow x1={400} y1={230} x2={470} y2={230} double head={8} />
      <Label x={435} y={216} className="dg-text-small">
        data
      </Label>

      <path d="M190,256 V272 H430 V205 H450" className="dg-dashed dg-accent" />
      <Arrow x1={450} y1={205} x2={468} y2={205} className="dg-dashed dg-accent" headClassName="dg-dot-accent" head={7} />
      <Label x={435} y={190} className="dg-text-small">
        control
      </Label>
    </Svg>
  );
}

export default CpuArchitectureCpuBlocks;
