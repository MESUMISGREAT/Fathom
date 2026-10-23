/**
 * Client-server versus peer-to-peer. Left: one server in the middle with five
 * clients around it; every client links only to the server, and one link is
 * labelled with a request going in and a response coming back. Right: five
 * peers, each linked to the others, each labelled as acting as both client and
 * server; there is no central computer.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-client-server-p2p';

const W = 620;
const H = 320;
const CY = 172;
const R = 108;

function Dev({ x, y, w = 56, h = 26, label, accent }: { x: number; y: number; w?: number; h?: number; label: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={5} className="dg-fill-surface" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={5} className={accent ? 'dg-fill-accent dg-accent' : 'dg-fill-muted dg-thin'} />
      <Label x={x} y={y} className="dg-text-small">
        {label}
      </Label>
    </g>
  );
}

const ring = (cx: number, n: number, r: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = (-90 + (360 / n) * i) * (Math.PI / 180);
    return { x: cx + r * Math.cos(a), y: CY + r * Math.sin(a) };
  });

export function NetworksClientServerP2p() {
  const cs = ring(150, 5, R);
  const pp = ring(470, 5, R);
  return (
    <Svg width={W} height={H}>
      <Label x={150} y={22} className="dg-text dg-bold">
        Client-server
      </Label>
      <Label x={470} y={22} className="dg-text dg-bold">
        Peer-to-peer
      </Label>
      <line x1={310} y1={40} x2={310} y2={H - 20} className="dg-grid" />

      {cs.map((p, i) => (
        <line key={i} x1={150} y1={CY} x2={p.x} y2={p.y} className="dg-thin" />
      ))}
      {/* request / response on the lower-right client's link */}
      <Arrow x1={cs[2]!.x - 14} y1={cs[2]!.y - 34} x2={150 + 30} y2={CY + 22} head={7} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={150 + 42} y1={CY + 12} x2={cs[2]!.x - 2} y2={cs[2]!.y - 44} head={7} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={238} y={196} anchor="start" className="dg-text-small dg-text-accent">
        request
      </Label>
      <Label x={176} y={150} anchor="start" className="dg-text-small dg-text-accent-2">
        response
      </Label>
      <Dev x={150} y={CY} w={64} h={48} label="server" accent />
      {cs.map((p, i) => (
        <Dev key={i} x={p.x} y={p.y} label="client" />
      ))}

      {pp.map((p, i) =>
        pp.slice(i + 1).map((q, j) => <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="dg-thin" />),
      )}
      {pp.map((p, i) => (
        <Dev key={i} x={p.x} y={p.y} label="peer" accent />
      ))}
      <Label x={150} y={H - 14} className="dg-text-small dg-text-muted">
        clients send requests to a central server
      </Label>
      <Label x={470} y={H - 14} className="dg-text-small dg-text-muted">
        every peer is both client and server
      </Label>
    </Svg>
  );
}

export default NetworksClientServerP2p;
