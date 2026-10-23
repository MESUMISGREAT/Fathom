/**
 * Finding the network address with a subnet mask, bit by bit.
 * Row 1: IP address 192.168.10.77 = 11000000 10101000 00001010 01001101; the
 * first 24 bits are bracketed "network ID", the last 8 "host ID".
 * Row 2: subnet mask 255.255.255.0 = 24 ones then 8 zeros.
 * Row 3: IP AND mask = 11000000 10101000 00001010 00000000 = 192.168.10.0, the
 * network address. Note: 8 host bits give 2^8 - 2 = 254 usable host addresses.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-subnet-mask';

const W = 660;
const H = 286;
const CELL = 15;
const GAP = 10;
const X0 = 136;
const cx = (i: number) => X0 + i * CELL + Math.floor(i / 8) * GAP;

const bits = (octets: number[]) => octets.map((o) => o.toString(2).padStart(8, '0')).join('');
const IP = bits([192, 168, 10, 77]);
const MASK = bits([255, 255, 255, 0]);
const NET = bits([192, 168, 10, 0]);

function Row({ y, b, fill }: { y: number; b: string; fill: (i: number, bit: string) => string }) {
  return (
    <g>
      {[...b].map((bit, i) => (
        <g key={i}>
          <rect x={cx(i)} y={y - 13} width={CELL} height={26} className={`${fill(i, bit)} dg-thin`} />
          <Label x={cx(i) + CELL / 2} y={y} className="dg-text-small dg-mono">
            {bit}
          </Label>
        </g>
      ))}
    </g>
  );
}

function Side({ y, title, value, accent }: { y: number; title: string; value: string; accent?: boolean }) {
  return (
    <g>
      <Label x={X0 - 12} y={y - 8} anchor="end" className={accent ? 'dg-text-small dg-text-accent' : 'dg-text-small dg-bold'}>
        {title}
      </Label>
      <Label x={X0 - 12} y={y + 9} anchor="end" className="dg-text-small dg-mono">
        {value}
      </Label>
    </g>
  );
}

export function NetworksSubnetMask() {
  const y1 = 76;
  const y2 = 124;
  const y3 = 188;
  const netEnd = cx(23) + CELL;
  const hostStart = cx(24);
  const hostEnd = cx(31) + CELL;
  return (
    <Svg width={W} height={H}>
      <path d={`M${X0},44 L${X0},36 L${netEnd},36 L${netEnd},44`} className="dg-accent" />
      <Label x={(X0 + netEnd) / 2} y={22} className="dg-text-small dg-text-accent">
        network ID (first 24 bits)
      </Label>
      <path d={`M${hostStart},44 L${hostStart},36 L${hostEnd},36 L${hostEnd},44`} className="dg-accent-2" />
      <Label x={(hostStart + hostEnd) / 2} y={22} className="dg-text-small dg-text-accent-2">
        host ID (8 bits)
      </Label>

      <Side y={y1} title="IP address" value="192.168.10.77" />
      <Row y={y1} b={IP} fill={(i) => (i < 24 ? 'dg-fill-accent' : 'dg-fill-accent-2')} />
      <Side y={y2} title="subnet mask" value="255.255.255.0" />
      <Row y={y2} b={MASK} fill={(_, bit) => (bit === '1' ? 'dg-fill-accent' : 'dg-fill-muted')} />
      <line x1={62} y1={152} x2={hostEnd} y2={152} className="dg-line" />
      <Label x={16} y={152} anchor="start" className="dg-text-small dg-bold">
        AND
      </Label>
      <Side y={y3} title="network address" value="192.168.10.0" accent />
      <Row y={y3} b={NET} fill={(i) => (i < 24 ? 'dg-fill-accent' : 'dg-fill-muted')} />

      <Label x={W / 2} y={236} className="dg-text-small">
        1 AND 1 = 1; anything AND 0 = 0, so the mask keeps the network ID and clears the host ID
      </Label>
      <Label x={W / 2} y={260} className="dg-text-small dg-text-muted">
        8 host bits: 2⁸ − 2 = 254 usable host addresses on this subnet
      </Label>
    </Svg>
  );
}

export default NetworksSubnetMask;
