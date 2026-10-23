/**
 * How one packet travels from B to E in a bus and in a star.
 * Left, bus: five devices A-E tap into one backbone cable with a terminator at
 * each end. B's packet spreads along the backbone in both directions; A, C and
 * D receive it, check the address and ignore it; E accepts it.
 * Right, star: five devices each have their own cable to a central switch. B
 * sends the packet to the switch, which forwards it only to E.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-bus-star';

const W = 620;
const H = 330;
const BUS_Y = 165;

function Dev({ x, y, label, accent }: { x: number; y: number; label: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x - 20} y={y - 13} width={40} height={26} rx={5} className="dg-fill-surface" />
      <rect x={x - 20} y={y - 13} width={40} height={26} rx={5} className={accent ? 'dg-fill-accent dg-accent' : 'dg-fill-muted dg-thin'} />
      <Label x={x} y={y} className="dg-text-small dg-bold">
        {label}
      </Label>
    </g>
  );
}

const busDevs = [
  { id: 'A', x: 58, up: true, note: 'ignores' },
  { id: 'B', x: 108, up: false, note: 'sends' },
  { id: 'C', x: 158, up: true, note: 'ignores' },
  { id: 'D', x: 208, up: false, note: 'ignores' },
  { id: 'E', x: 258, up: true, note: 'accepts ✓' },
];

const SX = 470;
const SY = 172;
const starDevs = [
  { id: 'A', x: 470, y: 68 },
  { id: 'B', x: 572, y: 140 },
  { id: 'C', x: 534, y: 262 },
  { id: 'D', x: 406, y: 262 },
  { id: 'E', x: 368, y: 140 },
];

export function NetworksBusStar() {
  return (
    <Svg width={W} height={H}>
      <Label x={155} y={20} className="dg-text dg-bold">
        Bus
      </Label>
      <Label x={470} y={20} className="dg-text dg-bold">
        Star
      </Label>
      <line x1={310} y1={36} x2={310} y2={H - 10} className="dg-grid" />

      {/* bus */}
      <line x1={30} y1={BUS_Y} x2={286} y2={BUS_Y} className="dg-line" />
      <rect x={20} y={BUS_Y - 9} width={10} height={18} className="dg-dot" />
      <rect x={286} y={BUS_Y - 9} width={10} height={18} className="dg-dot" />
      <Label x={25} y={BUS_Y + 26} className="dg-text-small dg-text-muted">
        terminator
      </Label>
      <Label x={286} y={BUS_Y + 26} anchor="end" className="dg-text-small dg-text-muted">
        terminator
      </Label>
      <Arrow x1={108} y1={BUS_Y - 8} x2={36} y2={BUS_Y - 8} head={7} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={108} y1={BUS_Y - 8} x2={280} y2={BUS_Y - 8} head={7} className="dg-accent" headClassName="dg-dot-accent" />
      {busDevs.map((d) => {
        const y = d.up ? 92 : 238;
        return (
          <g key={d.id}>
            <line x1={d.x} y1={d.up ? y + 13 : y - 13} x2={d.x} y2={BUS_Y} className="dg-thin" />
            <Dev x={d.x} y={y} label={d.id} accent={d.id === 'B' || d.id === 'E'} />
            <Label
              x={d.x}
              y={d.up ? y - 26 : y + 26}
              className={d.id === 'E' || d.id === 'B' ? 'dg-text-small dg-text-accent' : 'dg-text-small dg-text-muted'}
            >
              {d.note}
            </Label>
          </g>
        );
      })}
      <Label x={155} y={292} className="dg-text-small">
        every device receives the packet;
      </Label>
      <Label x={155} y={310} className="dg-text-small">
        only E, the destination, accepts it
      </Label>

      {/* star */}
      {starDevs.map((d) => (
        <line key={d.id} x1={SX} y1={SY} x2={d.x} y2={d.y} className="dg-thin" />
      ))}
      <Arrow x1={548} y1={147} x2={508} y2={160} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={432} y1={160} x2={392} y2={147} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <rect x={SX - 34} y={SY - 15} width={68} height={30} rx={5} className="dg-fill-surface" />
      <rect x={SX - 34} y={SY - 15} width={68} height={30} rx={5} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={SX} y={SY} className="dg-text-small dg-bold">
        switch
      </Label>
      {starDevs.map((d) => (
        <Dev key={d.id} x={d.x} y={d.y} label={d.id} accent={d.id === 'B' || d.id === 'E'} />
      ))}
      <Label x={470} y={310} className="dg-text-small">
        the switch forwards it only to E
      </Label>
    </Svg>
  );
}

export default NetworksBusStar;
