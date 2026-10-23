/**
 * Three ways onto the internet, one per row, all ending at "the internet" on
 * the right.
 * Home: devices -> router -> modem (digital in, analogue out) -> PSTN
 * (telephone exchange) -> ISP -> internet.
 * Business: company LAN -> router -> dedicated (leased) line, permanent and not
 * shared -> ISP -> internet.
 * Mobile: phone -> radio waves -> cell tower (base station) -> mobile network
 * -> internet.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-internet-access';

const W = 640;
const H = 330;

function Box({ x, y, w, lines, kind = 'plain' }: { x: number; y: number; w: number; lines: string[]; kind?: 'plain' | 'hw' }) {
  const h = lines.length > 1 ? 40 : 30;
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={6} className="dg-fill-surface" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={6} className={kind === 'hw' ? 'dg-fill-accent dg-accent' : 'dg-fill-muted dg-thin'} />
      {lines.map((l, i) => (
        <Label key={i} x={x} y={y + (i - (lines.length - 1) / 2) * 15} className="dg-text-small">
          {l}
        </Label>
      ))}
    </g>
  );
}

export function NetworksInternetAccess() {
  const y1 = 70;
  const y2 = 170;
  const y3 = 270;
  const IX = 560;
  return (
    <Svg width={W} height={H}>
      <rect x={IX} y={30} width={70} height={270} rx={12} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={IX + 35} y={156} className="dg-text-small dg-bold">
        the
      </Label>
      <Label x={IX + 35} y={174} className="dg-text-small dg-bold">
        internet
      </Label>

      <Label x={10} y={y1 - 38} anchor="start" className="dg-text-small dg-text-muted">
        Home broadband over the PSTN
      </Label>
      <Label x={10} y={y2 - 38} anchor="start" className="dg-text-small dg-text-muted">
        Business: dedicated line
      </Label>
      <Label x={10} y={y3 - 38} anchor="start" className="dg-text-small dg-text-muted">
        Mobile: cell phone network
      </Label>

      {/* home */}
      <Arrow x1={80} y1={y1} x2={98} y2={y1} head={7} />
      <Arrow x1={160} y1={y1} x2={208} y2={y1} head={7} />
      <Label x={184} y={y1 - 14} className="dg-text-small dg-text-muted">
        digital
      </Label>
      <Arrow x1={270} y1={y1} x2={328} y2={y1} head={7} />
      <Label x={299} y={y1 - 14} className="dg-text-small dg-text-muted">
        analogue
      </Label>
      <Arrow x1={434} y1={y1} x2={463} y2={y1} head={7} />
      <Arrow x1={515} y1={y1} x2={IX - 2} y2={y1} head={7} />
      <Box x={45} y={y1} w={70} lines={['home', 'devices']} />
      <Box x={130} y={y1} w={60} lines={['router']} kind="hw" />
      <Box x={240} y={y1} w={60} lines={['modem']} kind="hw" />
      <Box x={382} y={y1} w={104} lines={['PSTN', '(phone exchange)']} kind="hw" />
      <Box x={490} y={y1} w={50} lines={['ISP']} />

      {/* business */}
      <Arrow x1={80} y1={y2} x2={98} y2={y2} head={7} />
      <line x1={160} y1={y2} x2={455} y2={y2} className="dg-accent" />
      <Arrow x1={445} y1={y2} x2={463} y2={y2} head={7} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={310} y={y2 - 16} className="dg-text-small dg-text-accent">
        dedicated (leased) line
      </Label>
      <Label x={310} y={y2 + 18} className="dg-text-small dg-text-muted">
        permanent, not shared
      </Label>
      <Arrow x1={515} y1={y2} x2={IX - 2} y2={y2} head={7} />
      <Box x={45} y={y2} w={70} lines={['company', 'LAN']} />
      <Box x={130} y={y2} w={60} lines={['router']} kind="hw" />
      <Box x={490} y={y2} w={50} lines={['ISP']} />

      {/* mobile */}
      <line x1={73} y1={y3} x2={160} y2={y3} className="dg-muted dg-dashed" />
      <Arrow x1={150} y1={y3} x2={166} y2={y3} head={7} className="dg-muted" headClassName="dg-dot" />
      <Label x={120} y={y3 - 14} className="dg-text-small dg-text-muted">
        radio
      </Label>
      <Arrow x1={272} y1={y3} x2={324} y2={y3} head={7} />
      <Arrow x1={430} y1={y3} x2={IX - 2} y2={y3} head={7} />
      <Box x={45} y={y3} w={56} lines={['phone']} />
      <Box x={220} y={y3} w={104} lines={['cell tower', '(base station)']} kind="hw" />
      <Box x={378} y={y3} w={104} lines={['mobile', 'network']} kind="hw" />
    </Svg>
  );
}

export default NetworksInternetAccess;
