/**
 * IPv4 and IPv6 drawn to the same scale (4.5 px per bit). The IPv4 bar is 32
 * bits: four 8-bit parts holding 192, 168, 10 and 77, written 192.168.10.77
 * (2^32, about 4.3 billion, addresses). The IPv6 bar is four times as long, 128
 * bits: eight 16-bit groups 2001, 0db8, 0000, 0000, 0000, ff00, 0042, 8329,
 * written with colons and shortened to 2001:db8::ff00:42:8329 (2^128, about
 * 3.4 x 10^38, addresses).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-ipv4-ipv6';

const W = 640;
const H = 300;
const PX = 4.5;
const X0 = 32;

function Bar({ y, parts, bits, accent }: { y: number; parts: string[]; bits: number; accent?: boolean }) {
  const w = bits * PX;
  return (
    <g>
      {parts.map((p, i) => (
        <g key={i}>
          <rect x={X0 + i * w} y={y} width={w} height={34} className={accent ? 'dg-fill-accent-2 dg-thin' : 'dg-fill-accent dg-thin'} />
          <Label x={X0 + i * w + w / 2} y={y + 17} className="dg-text-small dg-mono">
            {p}
          </Label>
          {bits > 8 && (
            <Label x={X0 + i * w + w / 2} y={y + 48} className="dg-text-small dg-text-muted">
              {`${bits} bits`}
            </Label>
          )}
        </g>
      ))}
    </g>
  );
}

export function NetworksIpv4Ipv6() {
  return (
    <Svg width={W} height={H}>
      <Label x={X0} y={20} anchor="start" className="dg-text dg-bold">
        IPv4: 32 bits = 4 × 8-bit numbers, denary, dots
      </Label>
      <Bar y={34} parts={['192', '168', '10', '77']} bits={8} />
      <Label x={X0 + 16 * PX} y={82} className="dg-text-small dg-text-muted">
        each part 8 bits
      </Label>
      <Label x={X0 + 32 * PX + 24} y={46} anchor="start" className="dg-text-accent dg-mono">
        192.168.10.77
      </Label>
      <Label x={X0 + 32 * PX + 24} y={68} anchor="start" className="dg-text-small dg-text-muted">
        2³² ≈ 4.3 billion addresses
      </Label>

      <Label x={X0} y={124} anchor="start" className="dg-text dg-bold">
        IPv6: 128 bits = 8 × 16-bit groups, hexadecimal, colons
      </Label>
      <Bar y={138} parts={['2001', '0db8', '0000', '0000', '0000', 'ff00', '0042', '8329']} bits={16} accent />
      <Label x={X0} y={214} anchor="start" className="dg-text-small dg-mono">
        full: 2001:0db8:0000:0000:0000:ff00:0042:8329
      </Label>
      <Label x={X0} y={236} anchor="start" className="dg-text-small dg-mono dg-text-accent-2">
        short: 2001:db8::ff00:42:8329
      </Label>
      <Label x={X0} y={258} anchor="start" className="dg-text-small dg-text-muted">
        2¹²⁸ ≈ 3.4 × 10³⁸ addresses
      </Label>
      <Label x={W - 8} y={H - 12} anchor="end" className="dg-text-small dg-text-muted">
        both bars drawn to the same scale
      </Label>
    </Svg>
  );
}

export default NetworksIpv4Ipv6;
