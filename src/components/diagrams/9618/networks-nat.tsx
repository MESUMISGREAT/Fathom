/**
 * A home LAN behind a NAT router. Three devices have private addresses
 * 192.168.1.10 (laptop), 192.168.1.11 (phone) and 192.168.1.12 (console). The
 * router has a private LAN-side address 192.168.1.1 and one public address
 * 203.0.113.25. Across the internet is a web server at the public address
 * 198.51.100.7. Below: the laptop's packet leaves with source 192.168.1.10; after
 * NAT the same packet has source 203.0.113.25; the destination stays
 * 198.51.100.7.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-nat';

const W = 640;
const H = 316;

function Dev({ x, y, w, name, ip, kind = 'plain' }: { x: number; y: number; w: number; name: string; ip: string; kind?: 'plain' | 'router' | 'server' }) {
  const cls = kind === 'router' ? 'dg-fill-accent dg-accent' : kind === 'server' ? 'dg-fill-accent-2 dg-accent-2' : 'dg-fill-muted dg-thin';
  return (
    <g>
      <rect x={x - w / 2} y={y - 21} width={w} height={42} rx={6} className="dg-fill-surface" />
      <rect x={x - w / 2} y={y - 21} width={w} height={42} rx={6} className={cls} />
      <Label x={x} y={y - 9} className="dg-text-small dg-bold">
        {name}
      </Label>
      <Label x={x} y={y + 9} className="dg-text-small dg-mono">
        {ip}
      </Label>
    </g>
  );
}

export function NetworksNat() {
  const RX = 300;
  const RY = 140;
  const devs = [
    { y: 70, name: 'laptop', ip: '192.168.1.10' },
    { y: 140, name: 'phone', ip: '192.168.1.11' },
    { y: 210, name: 'console', ip: '192.168.1.12' },
  ];
  return (
    <Svg width={W} height={H}>
      <rect x={6} y={30} width={RX - 6} height={214} rx={12} className="dg-muted dg-dashed" />
      <Label x={20} y={18} anchor="start" className="dg-text-small dg-text-muted">
        home LAN: private addresses
      </Label>
      <Label x={W - 10} y={18} anchor="end" className="dg-text-small dg-text-muted">
        the internet: public addresses
      </Label>
      {devs.map((d) => (
        <line key={d.y} x1={142} y1={d.y} x2={RX - 70} y2={RY} className="dg-thin" />
      ))}
      <line x1={RX + 70} y1={RY} x2={512} y2={RY} className="dg-line" />
      <Label x={441} y={RY - 14} className="dg-text-small dg-text-muted">
        internet
      </Label>
      {devs.map((d) => (
        <Dev key={d.y} x={76} y={d.y} w={130} name={d.name} ip={d.ip} />
      ))}
      <rect x={RX - 70} y={RY - 36} width={140} height={72} rx={8} className="dg-fill-surface" />
      <rect x={RX - 70} y={RY - 36} width={140} height={72} rx={8} className="dg-fill-accent dg-accent" />
      <Label x={RX} y={RY - 20} className="dg-text-small dg-bold">
        router (NAT)
      </Label>
      <Label x={RX} y={RY} className="dg-text-small dg-mono">
        LAN 192.168.1.1
      </Label>
      <Label x={RX} y={RY + 20} className="dg-text-small dg-mono dg-bold">
        public 203.0.113.25
      </Label>
      <Dev x={574} y={RY} w={124} name="web server" ip="198.51.100.7" kind="server" />

      <Label x={20} y={270} anchor="start" className="dg-text-small">
        leaving the laptop:
      </Label>
      <Label x={180} y={270} anchor="start" className="dg-text-small dg-mono">
        source 192.168.1.10 → destination 198.51.100.7
      </Label>
      <Label x={20} y={294} anchor="start" className="dg-text-small">
        after NAT:
      </Label>
      <Label x={180} y={294} anchor="start" className="dg-text-small dg-mono dg-bold">
        source 203.0.113.25 → destination 198.51.100.7
      </Label>
    </Svg>
  );
}

export default NetworksNat;
