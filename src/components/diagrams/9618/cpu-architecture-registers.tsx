/**
 * Registers live inside the CPU: ACC, IX, PC, MAR, MDR, CIR and the status
 * register sit stacked beside the ALU and the Control Unit. Main memory is
 * outside the CPU: much larger, but slower to reach.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Cell } from './cpu-architecture-kit';

export const diagramKey = 'cs-cpu-architecture-register-file';

const W = 620;
const H = 380;

const names = ['ACC', 'IX', 'PC', 'MAR', 'MDR', 'CIR', 'Status reg.'];

export function CpuArchitectureRegisters() {
  return (
    <Svg width={W} height={H}>
      <rect x={20} y={40} width={380} height={310} rx={14} className="dg-fill-accent dg-accent" />
      <Label x={44} y={64} anchor="start" className="dg-text dg-bold">
        CPU
      </Label>
      {names.map((n, i) => (
        <Cell key={n} x={40} y={84 + i * 34} w={140} h={32} label={n} />
      ))}

      <rect x={230} y={170} width={160} height={80} rx={10} className="dg-fill-surface dg-thin" />
      <Label x={310} y={194} className="dg-text dg-bold">
        ALU
      </Label>
      <Label x={310} y={216} className="dg-text-small">
        arithmetic + logic
      </Label>
      <Arrow x1={230} y1={236} x2={184} y2={236} double head={7} />

      <rect x={230} y={270} width={160} height={70} rx={10} className="dg-fill-surface dg-thin" />
      <Label x={310} y={294} className="dg-text dg-bold">
        Control Unit
      </Label>
      <Label x={310} y={316} className="dg-text-small">
        control signals
      </Label>
      <Arrow x1={230} y1={284} x2={184} y2={270} className="dg-dashed dg-accent" headClassName="dg-dot-accent" head={7} />

      <rect x={460} y={80} width={140} height={230} rx={12} className="dg-fill-muted dg-thin" />
      <Label x={530} y={104} className="dg-text dg-bold">
        Main memory
      </Label>
      {[0, 1, 2, 3, 4].map((i) => (
        <Cell key={i} x={476} y={126 + i * 38} w={108} h={32} label="" tone="plain" />
      ))}
      <Label x={530} y={326} className="dg-text-small dg-text-muted">
        large and slower
      </Label>
      <Arrow x1={400} y1={190} x2={460} y2={190} double head={8} />
      <Label x={430} y={176} className="dg-text-small">
        buses
      </Label>
    </Svg>
  );
}

export default CpuArchitectureRegisters;
