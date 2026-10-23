/**
 * Public versus private cloud. Left: one provider's data centre (three
 * servers) is shared over the internet by Organisation A, Organisation B and
 * members of the public. Right: a data centre (on site or hosted by a third
 * party) whose servers are used only by one organisation, reached over a
 * private, access-restricted connection.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-public-private-cloud';

const W = 620;
const H = 300;

function Servers({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={x + i * 46} y={y} width={36} height={50} rx={4} className="dg-fill-accent dg-accent" />
          {[0, 1, 2].map((j) => (
            <line key={j} x1={x + i * 46 + 7} y1={y + 12 + j * 12} x2={x + i * 46 + 29} y2={y + 12 + j * 12} className="dg-thin" />
          ))}
        </g>
      ))}
    </g>
  );
}

function User({ x, y, label, w = 88 }: { x: number; y: number; label: string; w?: number }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 14} width={w} height={28} rx={6} className="dg-fill-surface" />
      <rect x={x - w / 2} y={y - 14} width={w} height={28} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={x} y={y} className="dg-text-small">
        {label}
      </Label>
    </g>
  );
}

export function NetworksPublicPrivateCloud() {
  return (
    <Svg width={W} height={H}>
      <Label x={155} y={20} className="dg-text-accent">
        Public cloud
      </Label>
      <Label x={465} y={20} className="dg-text-accent">
        Private cloud
      </Label>
      <line x1={310} y1={36} x2={310} y2={H - 10} className="dg-grid" />

      {/* public */}
      <rect x={60} y={40} width={190} height={92} rx={10} className="dg-muted" />
      <Label x={155} y={56} className="dg-text-small dg-text-muted">
        provider’s data centre
      </Label>
      <Servers x={88} y={72} />
      {[55, 155, 255].map((ux) => (
        <line key={ux} x1={155} y1={132} x2={ux} y2={226} className="dg-thin" />
      ))}
      <rect x={112} y={162} width={86} height={24} rx={12} className="dg-fill-surface" />
      <rect x={112} y={162} width={86} height={24} rx={12} className="dg-fill-muted dg-muted" />
      <Label x={155} y={174} className="dg-text-small">
        internet
      </Label>
      <User x={55} y={240} label="Org A" />
      <User x={155} y={240} label="Org B" />
      <User x={255} y={240} label="the public" />
      <Label x={155} y={284} className="dg-text-small dg-text-muted">
        shared by many customers
      </Label>

      {/* private */}
      <rect x={370} y={40} width={190} height={92} rx={10} className="dg-muted" />
      <Label x={465} y={56} className="dg-text-small dg-text-muted">
        on site or hosted
      </Label>
      <Servers x={398} y={72} />
      <line x1={465} y1={132} x2={465} y2={226} className="dg-line" />
      <rect x={400} y={162} width={130} height={24} rx={12} className="dg-fill-surface" />
      <rect x={400} y={162} width={130} height={24} rx={12} className="dg-fill-muted dg-muted" />
      <Label x={465} y={174} className="dg-text-small">
        restricted access
      </Label>
      <User x={465} y={240} w={130} label="one organisation" />
      <Label x={465} y={284} className="dg-text-small dg-text-muted">
        dedicated to one organisation
      </Label>
    </Svg>
  );
}

export default NetworksPublicPrivateCloud;
