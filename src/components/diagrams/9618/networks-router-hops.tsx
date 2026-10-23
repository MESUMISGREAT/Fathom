/**
 * A packet crossing several networks. Your PC sends a packet addressed to
 * 198.51.100.7. Six routers R1-R6 are joined in a partial mesh (R1-R2, R1-R3,
 * R2-R3, R2-R4, R3-R5, R4-R5, R4-R6, R5-R6). The highlighted route is
 * PC -> R1 -> R2 -> R4 -> R6 -> web server; each router passes the packet to
 * the next hop. Below, R1's simplified routing table: network 198.51.100.0 ->
 * next hop R2; network 203.0.113.0 -> next hop R3.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-router-hops';

const W = 620;
const H = 362;

const R: Record<string, { x: number; y: number }> = {
  R1: { x: 150, y: 150 },
  R2: { x: 260, y: 82 },
  R3: { x: 260, y: 218 },
  R4: { x: 390, y: 82 },
  R5: { x: 390, y: 218 },
  R6: { x: 500, y: 150 },
};
const links = [
  ['R1', 'R2'],
  ['R1', 'R3'],
  ['R2', 'R3'],
  ['R2', 'R4'],
  ['R3', 'R5'],
  ['R4', 'R5'],
  ['R4', 'R6'],
  ['R5', 'R6'],
];
const route = ['R1', 'R2', 'R4', 'R6'];

function edge(a: { x: number; y: number }, b: { x: number; y: number }, ra: number, rb: number) {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / d;
  const uy = (b.y - a.y) / d;
  return { x1: a.x + ra * ux, y1: a.y + ra * uy, x2: b.x - rb * ux, y2: b.y - rb * uy };
}

export function NetworksRouterHops() {
  const pc = { x: 46, y: 150 };
  const srv = { x: 576, y: 150 };
  return (
    <Svg width={W} height={H}>
      {links
        .filter(([a, b]) => !(route.indexOf(a!) >= 0 && route.indexOf(b!) === route.indexOf(a!) + 1))
        .map(([a, b]) => (
          <line key={`${a}${b}`} x1={R[a!]!.x} y1={R[a!]!.y} x2={R[b!]!.x} y2={R[b!]!.y} className="dg-thin" />
        ))}
      <Arrow {...edge(pc, R.R1!, 26, 21)} head={9} className="dg-accent" headClassName="dg-dot-accent" />
      {route.slice(0, -1).map((a, i) => (
        <Arrow key={a} {...edge(R[a]!, R[route[i + 1]!]!, 20, 21)} head={9} className="dg-accent" headClassName="dg-dot-accent" />
      ))}
      <Arrow {...edge(R.R6!, srv, 20, 30)} head={9} className="dg-accent" headClassName="dg-dot-accent" />

      {Object.entries(R).map(([k, p]) => (
        <g key={k}>
          <circle cx={p.x} cy={p.y} r={19} className="dg-fill-surface" />
          <circle cx={p.x} cy={p.y} r={19} className={route.includes(k) ? 'dg-fill-accent dg-accent' : 'dg-fill-muted dg-thin'} />
          <Label x={p.x} y={p.y} className="dg-text-small dg-bold">
            {k}
          </Label>
        </g>
      ))}
      <rect x={pc.x - 26} y={pc.y - 15} width={52} height={30} rx={5} className="dg-fill-muted dg-thin" />
      <Label x={pc.x} y={pc.y} className="dg-text-small">
        your PC
      </Label>
      <rect x={srv.x - 30} y={srv.y - 24} width={60} height={48} rx={5} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={srv.x} y={srv.y - 8} className="dg-text-small">
        web
      </Label>
      <Label x={srv.x} y={srv.y + 9} className="dg-text-small">
        server
      </Label>
      <Label x={614} y={srv.y + 40} anchor="end" className="dg-text-small dg-mono">
        198.51.100.7
      </Label>
      <Label x={pc.x - 20} y={pc.y - 50} anchor="start" className="dg-text-small dg-text-accent">
        packet: destination
      </Label>
      <Label x={pc.x - 20} y={pc.y - 32} anchor="start" className="dg-text-small dg-text-accent dg-mono">
        198.51.100.7
      </Label>

      {/* routing table */}
      <rect x={130} y={262} width={360} height={92} rx={8} className="dg-fill-muted dg-thin" />
      <Label x={310} y={278} className="dg-text-small dg-bold">
        R1’s routing table (simplified)
      </Label>
      <line x1={140} y1={292} x2={480} y2={292} className="dg-grid" />
      <Label x={150} y={306} anchor="start" className="dg-text-small dg-text-muted">
        destination network
      </Label>
      <Label x={380} y={306} anchor="start" className="dg-text-small dg-text-muted">
        next hop
      </Label>
      <Label x={150} y={322} anchor="start" className="dg-text-small dg-mono">
        198.51.100.0
      </Label>
      <Label x={380} y={322} anchor="start" className="dg-text-small dg-text-accent">
        R2
      </Label>
      <Label x={150} y={342} anchor="start" className="dg-text-small dg-mono">
        203.0.113.0
      </Label>
      <Label x={380} y={342} anchor="start" className="dg-text-small">
        R3
      </Label>
    </Svg>
  );
}

export default NetworksRouterHops;
