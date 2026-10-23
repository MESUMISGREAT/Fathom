/**
 * Long-distance wireless links (not to scale). The curved line is the Earth's
 * surface. Two microwave towers stand on it with a straight beam between their
 * tops: microwave links need line of sight, so the towers must be tall enough to
 * see over the curve. Above, a communications satellite (in reality about
 * 36 000 km up for a geostationary one) relays signals from a ground station on
 * the left (uplink) to a distant ground station on the right (downlink).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-wireless-links';

const W = 620;
const H = 330;
const EX = 310;
const EY = 1300;
const ER = 1050;
const ground = (x: number) => EY - Math.sqrt(ER * ER - (x - EX) * (x - EX));

function Dish({ x }: { x: number }) {
  const y = ground(x);
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - 14} className="dg-line" />
      <path d={`M${x - 13},${y - 26} Q${x - 4},${y - 8} ${x + 13},${y - 18}`} className="dg-line" />
    </g>
  );
}

function Tower({ x, h }: { x: number; h: number }) {
  const y = ground(x);
  return (
    <g>
      <path d={`M${x - 10},${y} L${x},${y - h} L${x + 10},${y}`} className="dg-line" />
      <line x1={x - 6} y1={y - h * 0.4} x2={x + 6} y2={y - h * 0.4} className="dg-thin" />
      <circle cx={x} cy={y - h} r={5} className="dg-dot" />
    </g>
  );
}

export function NetworksWirelessLinks() {
  const sat = { x: 310, y: 58 };
  const g1 = { x: 70, y: ground(70) - 22 };
  const g2 = { x: 550, y: ground(550) - 22 };
  const t1 = 205;
  const t2 = 415;
  const th = 62;
  const ty = ground(t1) - th;
  return (
    <Svg width={W} height={H}>
      {/* Earth */}
      <path d={`M20,${ground(20).toFixed(1)} A${ER},${ER} 0 0 1 600,${ground(600).toFixed(1)}`} className="dg-line" />
      <Label x={310} y={ground(310) + 22} className="dg-text-small dg-text-muted">
        Earth’s surface (curved)
      </Label>

      {/* satellite links */}
      <line x1={g1.x} y1={g1.y} x2={sat.x - 6} y2={sat.y + 10} className="dg-accent-2 dg-dashed" />
      <line x1={sat.x + 6} y1={sat.y + 10} x2={g2.x} y2={g2.y} className="dg-accent-2 dg-dashed" />
      <Label x={150} y={150} anchor="end" className="dg-text-small dg-text-accent-2">
        uplink
      </Label>
      <Label x={470} y={150} anchor="start" className="dg-text-small dg-text-accent-2">
        downlink
      </Label>
      <rect x={sat.x - 34} y={sat.y - 5} width={22} height={10} className="dg-fill-accent dg-accent" />
      <rect x={sat.x + 12} y={sat.y - 5} width={22} height={10} className="dg-fill-accent dg-accent" />
      <rect x={sat.x - 12} y={sat.y - 9} width={24} height={18} rx={3} className="dg-fill-surface" />
      <rect x={sat.x - 12} y={sat.y - 9} width={24} height={18} rx={3} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={sat.x} y={24} className="dg-text dg-bold">
        communications satellite
      </Label>
      <Dish x={70} />
      <Dish x={550} />
      <Label x={70} y={ground(70) + 20} className="dg-text-small">
        ground station
      </Label>
      <Label x={550} y={ground(550) + 20} className="dg-text-small">
        ground station
      </Label>

      {/* microwave towers */}
      <line x1={t1} y1={ty} x2={t2} y2={ty} className="dg-accent" />
      <Tower x={t1} h={th} />
      <Tower x={t2} h={th} />
      <Label x={310} y={ty - 14} className="dg-text-small dg-text-accent">
        microwave beam: line of sight
      </Label>
      <Label x={310} y={ground(310) + 42} className="dg-text-small dg-text-muted">
        microwave towers must be tall enough to see over the curve
      </Label>
      <Label x={W - 10} y={H - 10} anchor="end" className="dg-text-small dg-text-muted">
        not to scale
      </Label>
    </Svg>
  );
}

export default NetworksWirelessLinks;
