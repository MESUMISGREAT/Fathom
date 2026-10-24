/**
 * A print buffer. The processor (fast) sends a block of data into the buffer, a queue of
 * memory locations in the printer; five of its eight slots are full. The printer (slow) takes
 * data from the far end of the queue, first in first out, and prints at its own speed. When
 * the buffer is empty the printer sends an interrupt back to the processor (dashed arrow)
 * asking for the next block. Meanwhile the processor carries on with other tasks.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-printer-buffer';

const W = 620;
const H = 250;
const BX = 212;
const SLOT = 25;

export function ComputerComponentsPrinterBuffer() {
  return (
    <Svg width={W} height={H}>
      <Label x={16} y={30} anchor="start" className="dg-text-small dg-text-muted">
        meanwhile, the processor carries on with other tasks
      </Label>
      <rect x={16} y={70} width={120} height={60} rx={8} className="dg-fill-accent dg-accent" />
      <Label x={76} y={92} className="dg-text dg-bold">
        processor
      </Label>
      <Label x={76} y={112} className="dg-text-small">
        fast
      </Label>

      <Label x={BX + 4 * SLOT} y={62} className="dg-text-small dg-bold">
        buffer (memory in the printer)
      </Label>
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} x={BX + i * SLOT} y={82} width={SLOT} height={36} className={i >= 3 ? 'dg-fill-accent-2 dg-thin' : 'dg-thin'} />
      ))}
      <Label x={BX + 4 * SLOT} y={136} className="dg-text-small dg-text-muted">
        a queue: first in, first out
      </Label>

      <rect x={484} y={70} width={120} height={60} rx={8} className="dg-fill-muted dg-thin" />
      <Label x={544} y={92} className="dg-text dg-bold">
        printer
      </Label>
      <Label x={544} y={112} className="dg-text-small">
        slow
      </Label>

      <Arrow x1={138} y1={100} x2={BX - 2} y2={100} head={8} />
      <Arrow x1={BX + 8 * SLOT + 2} y1={100} x2={482} y2={100} head={8} />
      <Label x={174} y={72} className="dg-text-small">
        fills it
      </Label>
      <Label x={174} y={86} className="dg-text-small">
        in a burst
      </Label>
      <Label x={448} y={72} className="dg-text-small">
        prints at
      </Label>
      <Label x={448} y={86} className="dg-text-small">
        own speed
      </Label>

      <path d="M544,132 L544,214 L76,214 L76,140" className="dg-accent dg-dashed" />
      <Arrow x1={76} y1={150} x2={76} y2={132} head={9} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={310} y={230} className="dg-text-small dg-text-accent">
        interrupt: buffer empty, send the next block
      </Label>
    </Svg>
  );
}

export default ComputerComponentsPrinterBuffer;
