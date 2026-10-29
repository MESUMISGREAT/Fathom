/**
 * How an interrupt is handled: the program runs, a device raises an interrupt on
 * the control bus, the CPU finishes the current instruction, saves the registers
 * and PC, runs the Interrupt Service Routine, restores the saved state and
 * resumes the original program where it stopped.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-cpu-architecture-interrupts';

const W = 620;
const H = 440;
const X = 170;
const BW = 300;
const BH = 56;

const boxes = [
  { y: 30, title: 'Program runs normally', line: '', cls: 'dg-fill-surface dg-thin' },
  { y: 98, title: 'Device raises an interrupt', line: 'signal on the control bus', cls: 'dg-fill-accent-2 dg-accent-2' },
  { y: 166, title: 'CPU finishes the instruction', line: 'checked at the end of each fetch–execute cycle', cls: 'dg-fill-surface dg-thin' },
  { y: 234, title: 'CPU saves the registers and the PC', line: 'so it can return to the right place', cls: 'dg-fill-surface dg-thin' },
  { y: 302, title: 'CPU runs the Interrupt Service Routine', line: 'the ISR deals with the device', cls: 'dg-fill-accent dg-accent' },
  { y: 370, title: 'Saved state restored', line: 'the program resumes where it stopped', cls: 'dg-fill-surface dg-thin' },
];

export function CpuArchitectureInterrupts() {
  return (
    <Svg width={W} height={H}>
      {boxes.map((b) => (
        <g key={b.y}>
          <rect x={X} y={b.y} width={BW} height={BH} rx={10} className={b.cls} />
          <Label x={X + BW / 2} y={b.line ? b.y + 21 : b.y + BH / 2} className="dg-text-small dg-bold">
            {b.title}
          </Label>
          {b.line && (
            <Label x={X + BW / 2} y={b.y + 41} className="dg-text-small">
              {b.line}
            </Label>
          )}
        </g>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <Arrow key={i} x1={X + BW / 2} y1={boxes[i]!.y + BH} x2={X + BW / 2} y2={boxes[i + 1]!.y} head={7} />
      ))}
    </Svg>
  );
}

export default CpuArchitectureInterrupts;
