/**
 * The hardware of a small LAN in two segments joined by a bridge.
 * Segment 1 (left): a router at the top links the LAN to the internet; below it
 * a switch connects a server and two PCs (each with a NIC), and a long cable
 * run passes through a repeater to reach a distant PC.
 * Segment 2 (right): a second switch connects a PC (NIC) and a wireless access
 * point (WAP); a laptop and a phone, each with a WNIC, connect to the WAP by
 * radio (dashed lines). The bridge sits between the two switches.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-lan-hardware';

const W = 640;
const H = 372;

function Dev({ x, y, w = 56, label, tag, kind = 'plain' }: { x: number; y: number; w?: number; label: string; tag?: string; kind?: 'plain' | 'net' | 'join' }) {
  const cls = kind === 'net' ? 'dg-fill-accent dg-accent' : kind === 'join' ? 'dg-fill-accent-2 dg-accent-2' : 'dg-fill-muted dg-thin';
  return (
    <g>
      <rect x={x - w / 2} y={y - 14} width={w} height={28} rx={5} className="dg-fill-surface" />
      <rect x={x - w / 2} y={y - 14} width={w} height={28} rx={5} className={cls} />
      <Label x={x} y={y} className="dg-text-small">
        {label}
      </Label>
      {tag && (
        <Label x={x} y={y + 26} className="dg-text-small dg-text-accent">
          {tag}
        </Label>
      )}
    </g>
  );
}

export function NetworksLanHardware() {
  const sw1 = { x: 165, y: 160 };
  const sw2 = { x: 445, y: 160 };
  const wap = { x: 570, y: 160 };
  return (
    <Svg width={W} height={H}>
      <rect x={10} y={44} width={288} height={318} rx={12} className="dg-muted dg-dashed" />
      <rect x={342} y={44} width={288} height={318} rx={12} className="dg-muted dg-dashed" />
      <Label x={154} y={346} className="dg-text-small dg-text-muted">
        LAN segment 1
      </Label>
      <Label x={486} y={346} className="dg-text-small dg-text-muted">
        LAN segment 2
      </Label>

      {/* cables */}
      <line x1={165} y1={20} x2={165} y2={90} className="dg-thin" />
      <line x1={165} y1={90} x2={sw1.x} y2={sw1.y} className="dg-thin" />
      <line x1={60} y1={160} x2={sw1.x} y2={sw1.y} className="dg-thin" />
      <line x1={70} y1={250} x2={sw1.x} y2={sw1.y} className="dg-thin" />
      <line x1={150} y1={250} x2={sw1.x} y2={sw1.y} className="dg-thin" />
      <line x1={sw1.x} y1={sw1.y} x2={248} y2={226} className="dg-thin" />
      <line x1={248} y1={226} x2={248} y2={296} className="dg-thin" />
      <line x1={sw1.x} y1={sw1.y} x2={sw2.x} y2={sw2.y} className="dg-thin" />
      <line x1={400} y1={250} x2={sw2.x} y2={sw2.y} className="dg-thin" />
      <line x1={sw2.x} y1={sw2.y} x2={wap.x} y2={wap.y} className="dg-thin" />
      {/* radio links */}
      <line x1={wap.x} y1={wap.y + 14} x2={520} y2={256} className="dg-muted dg-dashed" />
      <line x1={wap.x} y1={wap.y + 14} x2={596} y2={256} className="dg-muted dg-dashed" />
      <path d={`M${wap.x - 16},${wap.y - 24} Q${wap.x},${wap.y - 36} ${wap.x + 16},${wap.y - 24}`} className="dg-muted" />
      <path d={`M${wap.x - 26},${wap.y - 30} Q${wap.x},${wap.y - 48} ${wap.x + 26},${wap.y - 30}`} className="dg-muted" />

      <Label x={175} y={22} anchor="start" className="dg-text-small dg-text-muted">
        to the internet
      </Label>
      <Dev x={165} y={90} w={64} label="router" kind="join" />
      <Dev x={sw1.x} y={sw1.y} w={64} label="switch" kind="net" />
      <Dev x={60} y={160} w={64} label="server" tag="NIC" />
      <Dev x={70} y={250} w={44} label="PC" tag="NIC" />
      <Dev x={150} y={250} w={44} label="PC" tag="NIC" />
      <Dev x={248} y={226} w={74} label="repeater" kind="join" />
      <Dev x={248} y={296} w={44} label="PC" tag="NIC" />
      <Label x={220} y={300} anchor="end" className="dg-text-small dg-text-muted">
        long cable
      </Label>
      <Dev x={320} y={160} w={58} label="bridge" kind="join" />
      <Dev x={sw2.x} y={sw2.y} w={64} label="switch" kind="net" />
      <Dev x={400} y={250} w={44} label="PC" tag="NIC" />
      <Dev x={wap.x} y={wap.y} w={52} label="WAP" kind="net" />
      <Dev x={520} y={270} w={56} label="laptop" tag="WNIC" />
      <Dev x={596} y={270} w={52} label="phone" tag="WNIC" />
    </Svg>
  );
}

export default NetworksLanHardware;
