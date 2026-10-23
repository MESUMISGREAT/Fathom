/**
 * Two LANs joined by a WAN. Each LAN covers one site and is owned by the
 * organisation: three PCs on a switch, plus a router. The two routers are
 * joined by a long-distance WAN link that runs over third-party
 * infrastructure (e.g. lines leased from a telecoms company).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-lan-wan';

const W = 620;
const H = 326;
const TOP = 44;
const BOT = 262;

function Dev({ x, y, w = 50, h = 26, label, accent }: { x: number; y: number; w?: number; h?: number; label: string; accent?: boolean }) {
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

function Lan({ x0, title, routerX }: { x0: number; title: string; routerX: number }) {
  const cx = x0 + 100;
  const pcs = [x0 + 40, x0 + 100, x0 + 160];
  return (
    <g>
      <rect x={x0} y={TOP} width={200} height={BOT - TOP} rx={12} className="dg-muted dg-dashed" />
      <Label x={cx} y={TOP - 16} className="dg-text dg-bold">
        {title}
      </Label>
      {pcs.map((px) => (
        <line key={px} x1={px} y1={226} x2={cx} y2={156} className="dg-thin" />
      ))}
      <line x1={cx} y1={156} x2={routerX} y2={88} className="dg-thin" />
      <Dev x={routerX} y={88} w={60} label="router" accent />
      <Dev x={cx} y={156} w={60} label="switch" />
      {pcs.map((px) => (
        <Dev key={px} x={px} y={226} w={44} label="PC" />
      ))}
      <Label x={cx} y={BOT + 20} className="dg-text-small dg-text-muted">
        one site, small area
      </Label>
      <Label x={cx} y={BOT + 38} className="dg-text-small dg-text-muted">
        owned by the organisation
      </Label>
    </g>
  );
}

export function NetworksLanWan() {
  return (
    <Svg width={W} height={H}>
      <line x1={202} y1={88} x2={418} y2={88} className="dg-accent-2" />
      <Lan x0={16} title="LAN 1: head office" routerX={172} />
      <Lan x0={404} title="LAN 2: branch office" routerX={448} />
      <Label x={310} y={70} className="dg-text-accent-2">
        WAN link
      </Label>
      <Label x={310} y={112} className="dg-text-small">
        hundreds of km
      </Label>
      <Label x={310} y={150} className="dg-text-small dg-text-muted">
        runs over lines leased
      </Label>
      <Label x={310} y={168} className="dg-text-small dg-text-muted">
        from a telecoms company
      </Label>
      <Label x={310} y={214} className="dg-text-small dg-text-accent-2">
        LAN 1 + LAN 2 + link
      </Label>
      <Label x={310} y={232} className="dg-text-small dg-text-accent-2">
        = one WAN
      </Label>
    </Svg>
  );
}

export default NetworksLanWan;
