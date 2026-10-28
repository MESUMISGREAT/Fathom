/**
 * RAM drawn as a column of blocks, each owned by a process or free. A new
 * process waits for a free region, which the OS must find for it.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-operating-systems-memory-map';

const W = 520;
const H = 320;
const CELL_H = 26;
const TOP = 52;
const COL_W = 210;
const X = 150;

const cells = [
  { owner: 'operating system', cls: 'dg-fill-accent', text: 'dg-text' },
  { owner: 'operating system', cls: 'dg-fill-accent', text: 'dg-text' },
  { owner: 'word processor', cls: 'dg-fill-muted', text: 'dg-text' },
  { owner: 'word processor', cls: 'dg-fill-muted', text: 'dg-text' },
  { owner: 'free', cls: 'dg-fill-accent-2', text: 'dg-text-muted' },
  { owner: 'free', cls: 'dg-fill-accent-2', text: 'dg-text-muted' },
  { owner: 'browser', cls: 'dg-fill-muted', text: 'dg-text' },
  { owner: 'driver', cls: 'dg-fill-muted', text: 'dg-text' },
];

export function OperatingSystemsMemoryMap() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Who owns which block of RAM
      </Label>

      {cells.map((c, i) => (
        <g key={i}>
          <rect
            x={X}
            y={TOP + i * CELL_H}
            width={COL_W}
            height={CELL_H}
            className={`${c.cls} dg-thin`}
          />
          <Label x={X + COL_W / 2} y={TOP + i * CELL_H + CELL_H / 2 + 1} className={`dg-text-small ${c.text}`}>
            {c.owner}
          </Label>
        </g>
      ))}

      <rect x={400} y={118} width={104} height={40} rx={6} className="dg-fill-muted dg-line" />
      <Label x={452} y={139} className="dg-text-small dg-text">
        new game
      </Label>
      <Arrow x1={396} y1={138} x2={X + COL_W + 8} y2={TOP + 4.5 * CELL_H} head={8} className="dg-muted" headClassName="dg-dot" />

      <Label x={X + COL_W + 14} y={TOP + 4.5 * CELL_H + 18} anchor="start" className="dg-text-small dg-text-accent-2">
        free blocks
      </Label>

      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">
        The OS allocates, protects and later frees each region
      </Label>
    </Svg>
  );
}

export default OperatingSystemsMemoryMap;
