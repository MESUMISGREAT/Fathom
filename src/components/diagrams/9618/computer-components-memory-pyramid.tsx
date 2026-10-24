/**
 * The memory hierarchy as a pyramid. From the top: registers; cache memory, made of SRAM;
 * main memory, made of DRAM; secondary storage (SSD, hard disk) at the wide base. An arrow
 * on the left points up: faster, and more expensive per bit. An arrow on the right points
 * down: larger capacity.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-memory-pyramid';

const W = 600;
const H = 320;
const CX = 300;
const TOP = 20;
const BASE = 300;
const HALF = 220;
const STEP = 70;

const half = (y: number) => (HALF * (y - TOP)) / (BASE - TOP);

const layers = [
  { name: 'registers', tone: 'dg-fill-muted dg-thin', text: 'dg-text-small dg-bold' },
  { name: 'cache: SRAM', tone: 'dg-fill-accent dg-accent', text: 'dg-text dg-bold' },
  { name: 'main memory: DRAM', tone: 'dg-fill-accent-2 dg-accent-2', text: 'dg-text dg-bold' },
  { name: 'secondary storage: SSD, hard disk', tone: 'dg-fill-muted dg-thin', text: 'dg-text' },
];

export function ComputerComponentsMemoryPyramid() {
  return (
    <Svg width={W} height={H}>
      {layers.map((l, k) => {
        const y0 = TOP + k * STEP;
        const y1 = y0 + STEP;
        const d = `M${CX - half(y0)},${y0} L${CX + half(y0)},${y0} L${CX + half(y1)},${y1} L${CX - half(y1)},${y1} Z`;
        return (
          <g key={l.name}>
            <path d={d} className={l.tone} />
            <Label x={CX} y={k === 0 ? y1 - 18 : (y0 + y1) / 2} className={l.text}>
              {l.name}
            </Label>
          </g>
        );
      })}
      <Arrow x1={60} y1={290} x2={60} y2={40} head={9} />
      <Label x={20} y={22} anchor="start" className="dg-text-small dg-bold">
        faster, costs more per bit
      </Label>
      <Arrow x1={540} y1={40} x2={540} y2={290} head={9} />
      <Label x={580} y={22} anchor="end" className="dg-text-small dg-bold">
        more capacity
      </Label>
    </Svg>
  );
}

export default ComputerComponentsMemoryPyramid;
