/**
 * The parts of a computer system and why each is needed. Input devices (left) send data in;
 * output devices (right) present results. Inside the computer (dashed) the processor and
 * primary memory (RAM and ROM) exchange data directly. Below, secondary storage is
 * non-volatile and holds data with the power off: fixed drives (HDD, SSD) and removable
 * media (USB flash drive, SD card, optical disc). Programs and data are loaded from it into
 * RAM before the processor can use them.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-system-overview';

const W = 620;
const H = 400;

function Box({ x, y, w, h, title, lines, tone = 'plain' }: { x: number; y: number; w: number; h: number; title: string; lines: string[]; tone?: 'plain' | 'accent' | 'accent-2' }) {
  const cls = tone === 'accent' ? 'dg-fill-accent dg-accent' : tone === 'accent-2' ? 'dg-fill-accent-2 dg-accent-2' : 'dg-fill-muted dg-thin';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className="dg-fill-surface" />
      <rect x={x} y={y} width={w} height={h} rx={8} className={cls} />
      <Label x={x + w / 2} y={lines.length ? y + 18 : y + h / 2} className="dg-text dg-bold">
        {title}
      </Label>
      {lines.map((l, i) => (
        <Label key={i} x={x + w / 2} y={y + 40 + i * 18} className="dg-text-small">
          {l}
        </Label>
      ))}
    </g>
  );
}

export function ComputerComponentsSystemOverview() {
  return (
    <Svg width={W} height={H}>
      {/* the computer itself */}
      <rect x={196} y={34} width={228} height={222} rx={12} className="dg-muted dg-dashed" />
      <Label x={310} y={22} className="dg-text-small dg-text-muted">
        inside the computer
      </Label>

      <Box x={16} y={70} w={140} h={150} title="Input" lines={['keyboard', 'mouse', 'microphone', 'touchscreen', 'sensor']} />
      <Box x={464} y={70} w={140} h={150} title="Output" lines={['screen', 'printer', 'speakers', 'actuator']} />

      <Box x={230} y={56} w={160} h={50} title="Processor (CPU)" lines={[]} tone="accent" />
      <Box x={230} y={158} w={160} h={70} title="Primary memory" lines={['RAM and ROM', 'directly accessed by CPU']} tone="accent" />
      <Arrow x1={310} y1={108} x2={310} y2={156} double head={8} />

      <Arrow x1={158} y1={145} x2={226} y2={145} head={8} />
      <Arrow x1={394} y1={145} x2={462} y2={145} head={8} />

      {/* secondary storage */}
      <rect x={100} y={292} width={420} height={96} rx={10} className="dg-fill-surface" />
      <rect x={100} y={292} width={420} height={96} rx={10} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={310} y={310} className="dg-text dg-bold">
        Secondary storage (non-volatile)
      </Label>
      <rect x={116} y={324} width={180} height={52} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={206} y={340} className="dg-text-small dg-bold">
        fixed
      </Label>
      <Label x={206} y={360} className="dg-text-small">
        hard disk, SSD
      </Label>
      <rect x={312} y={324} width={192} height={52} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={408} y={340} className="dg-text-small dg-bold">
        removable
      </Label>
      <Label x={408} y={360} className="dg-text-small">
        USB stick, SD card, DVD
      </Label>
      <Arrow x1={310} y1={230} x2={310} y2={290} double head={8} />
      <Label x={320} y={268} anchor="start" className="dg-text-small dg-text-muted">
        loaded into RAM to be used
      </Label>
    </Svg>
  );
}

export default ComputerComponentsSystemOverview;
