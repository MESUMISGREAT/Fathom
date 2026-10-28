/**
 * Block parity (9618 6.2.3). Four bytes plus a block check character computed with even parity
 * down each bit column: 00011010. A second panel shows two bits flipped inside byte 1, which
 * leaves that byte's own parity unchanged but changes the BCC to 11011010, so the mismatch is
 * detected.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-integrity-block-parity';

const W = 640;
const H = 356;
const CELL = 30;
const X_BITS = 118;
const bytes = ['01011010', '00110101', '11100011', '10010110'];
const BCC = '00011010';
const CORRUPT = ['10011010', '00110101', '11100011', '10010110'];
const BCC_AFTER = '11011010';

function BitsRow({
  bits,
  y,
  highlight = [],
  className = 'dg-fill-surface dg-thin',
}: {
  bits: string;
  y: number;
  highlight?: number[];
  className?: string;
}) {
  return (
    <g>
      {[...bits].map((b, i) => (
        <g key={i}>
          <rect
            x={X_BITS + i * CELL}
            y={y}
            width={CELL - 3}
            height={24}
            rx={2}
            className={highlight.includes(i) ? 'dg-fill-accent-2 dg-thin' : className}
          />
          <Label x={X_BITS + i * CELL + (CELL - 3) / 2} y={y + 12} className="dg-text-small dg-mono">
            {b}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function BlockParityDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={20} y={20} anchor="start" className="dg-text dg-bold">
        even block parity
      </Label>
      {bytes.map((b, i) => (
        <g key={b}>
          <Label x={X_BITS - 10} y={48 + i * 30 + 12} anchor="end" className="dg-text-small dg-text-muted">
            byte {i + 1}
          </Label>
          <BitsRow bits={b} y={48 + i * 30} className="dg-fill-muted dg-thin" />
        </g>
      ))}
      <Label x={X_BITS - 10} y={48 + 4 * 30 + 12} anchor="end" className="dg-text-small dg-text-accent dg-bold">
        BCC
      </Label>
      <BitsRow bits={BCC} y={48 + 4 * 30} className="dg-fill-accent dg-thin" />
      <Label x={X_BITS} y={208} anchor="start" className="dg-text-small dg-text-muted">
        every column holds an even number of 1s; the BCC is their XOR
      </Label>

      <rect x={20} y={222} width={600} height={124} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={32} y={240} anchor="start" className="dg-text-small dg-bold">
        two bits flipped in byte 1: it still has an even number of 1s
      </Label>
      <BitsRow bits={CORRUPT[0]!} y={252} highlight={[0, 1]} className="dg-fill-muted dg-thin" />
      <Label x={X_BITS - 10} y={252 + 12} anchor="end" className="dg-text-small dg-text-muted">
        received
      </Label>
      <Label x={X_BITS} y={296} anchor="start" className="dg-text-small dg-text-muted">
        byte parity passes, but two columns changed
      </Label>
      <BitsRow bits={BCC_AFTER} y={306} className="dg-fill-accent-2 dg-thin" />
      <Label x={X_BITS - 10} y={306 + 12} anchor="end" className="dg-text-small dg-text-accent-2 dg-bold">
        new BCC
      </Label>
      <Label x={X_BITS + 8 * CELL + 8} y={306 + 12} anchor="start" className="dg-text-small dg-text-accent-2">
        mismatch
      </Label>
    </Svg>
  );
}

export default BlockParityDiagram;
