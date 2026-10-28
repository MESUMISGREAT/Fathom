/**
 * Monitoring and control (9618 4.3.2). Top: a status byte masked with AND to test the "too hot"
 * flag. Middle: the control byte, one bit per device, with bit 7 on the left as usual. Bottom:
 * the three mask operations that switch a device on, off or over.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-bit-manipulation-device-control';

const W = 620;
const H = 320;

const CELL = 48;
const X0 = 118;
const ROW_Y = 140;

/** Left to right is bit 7 down to bit 0. */
const devices = ['spare', 'spare', 'lock', 'alarm', 'lamp', 'pump', 'fan', 'heater'];
const BIT_PATTERN = '00001101';

export function DeviceControlDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={14} y={22} anchor="start" className="dg-text-small dg-text-muted">
        monitoring: read the status byte, mask one flag
      </Label>
      <rect x={14} y={32} width={186} height={32} className="dg-fill-muted dg-thin" />
      <Label x={107} y={48} className="dg-text-small dg-mono">
        status 0000 0110
      </Label>
      <Arrow x1={202} y1={48} x2={226} y2={48} head={8} className="dg-muted" />
      <rect x={230} y={32} width={176} height={32} className="dg-fill-muted dg-thin" />
      <Label x={318} y={48} className="dg-text-small dg-mono">
        AND B0000 0100
      </Label>
      <Arrow x1={408} y1={48} x2={432} y2={48} head={8} className="dg-muted" />
      <rect x={436} y={32} width={170} height={32} className="dg-fill-accent dg-thin" />
      <Label x={521} y={48} className="dg-text-small dg-mono">
        0000 0100 → set
      </Label>

      <Label x={14} y={104} anchor="start" className="dg-text-small dg-text-muted">
        control: one bit per device
      </Label>
      {[...BIT_PATTERN].map((b, i) => (
        <g key={i}>
          <Label x={X0 + i * CELL + CELL / 2} y={ROW_Y - 14} className="dg-text-small dg-text-accent">
            bit {7 - i}
          </Label>
          <rect
            x={X0 + i * CELL}
            y={ROW_Y}
            width={CELL}
            height={36}
            className={b === '1' ? 'dg-fill-accent dg-thin' : 'dg-fill-surface dg-thin'}
          />
          <Label x={X0 + i * CELL + CELL / 2} y={ROW_Y + 18} className="dg-text dg-mono">
            {b}
          </Label>
          <Label x={X0 + i * CELL + CELL / 2} y={ROW_Y + 52} className="dg-text-small dg-text-muted">
            {devices[i]}
          </Label>
        </g>
      ))}

      <Label x={14} y={232} anchor="start" className="dg-text-small">
        <tspan className="dg-mono">OR</tspan> 0000 0010 → switch the fan on
      </Label>
      <Label x={14} y={256} anchor="start" className="dg-text-small">
        <tspan className="dg-mono">AND</tspan> 1111 1110 → switch the heater off
      </Label>
      <Label x={14} y={280} anchor="start" className="dg-text-small">
        <tspan className="dg-mono">XOR</tspan> 0000 0100 → toggle the pump
      </Label>
      <Label x={316} y={280} anchor="start" className="dg-text-small dg-text-muted">
        the whole byte is written back
      </Label>
    </Svg>
  );
}

export default DeviceControlDiagram;
