/**
 * What happens when a computer is switched on, showing why it needs both ROM and RAM.
 * 1 the processor runs the bootstrap loader, which is stored in ROM (non-volatile, read-only);
 * 2 the bootstrap loader copies the operating system from secondary storage (SSD or hard disk)
 * into RAM; 3 the processor then runs the operating system, and later the apps, from RAM
 * (volatile, read-write).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-boot-sequence';

const W = 620;
const H = 330;

function Box({ x, title, a, b, tone }: { x: number; title: string; a: string; b: string; tone: string }) {
  return (
    <g>
      <rect x={x} y={150} width={164} height={76} rx={8} className={tone} />
      <Label x={x + 82} y={170} className="dg-text dg-bold">
        {title}
      </Label>
      <Label x={x + 82} y={192} className="dg-text-small">
        {a}
      </Label>
      <Label x={x + 82} y={210} className="dg-text-small dg-text-muted">
        {b}
      </Label>
    </g>
  );
}

function Num({ x, y, n }: { x: number; y: number; n: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} className="dg-fill-surface dg-accent" />
      <Label x={x} y={y + 1} className="dg-text-small dg-bold">
        {n}
      </Label>
    </g>
  );
}

export function ComputerComponentsBootSequence() {
  return (
    <Svg width={W} height={H}>
      <rect x={238} y={18} width={144} height={50} rx={8} className="dg-fill-accent dg-accent" />
      <Label x={310} y={43} className="dg-text dg-bold">
        processor (CPU)
      </Label>

      <Box x={14} title="ROM" a="bootstrap loader" b="non-volatile, read-only" tone="dg-fill-accent-2 dg-accent-2" />
      <Box x={228} title="RAM" a="OS and running apps" b="volatile, read-write" tone="dg-fill-accent dg-accent" />
      <Box x={442} title="SSD or hard disk" a="OS and app files" b="kept with the power off" tone="dg-fill-muted dg-thin" />

      <Arrow x1={96} y1={148} x2={236} y2={60} head={9} />
      <Num x={150} y={98} n="1" />
      <Arrow x1={440} y1={188} x2={394} y2={188} head={9} />
      <Num x={417} y={166} n="2" />
      <Arrow x1={310} y1={148} x2={310} y2={70} double head={9} />
      <Num x={330} y={110} n="3" />

      <Label x={20} y={258} anchor="start" className="dg-text-small">
        1 power on: the CPU runs the bootstrap loader stored in ROM
      </Label>
      <Label x={20} y={280} anchor="start" className="dg-text-small">
        2 the bootstrap loader copies the operating system from storage into RAM
      </Label>
      <Label x={20} y={302} anchor="start" className="dg-text-small">
        3 the CPU runs the operating system (then your apps) from RAM
      </Label>
    </Svg>
  );
}

export default ComputerComponentsBootSequence;
