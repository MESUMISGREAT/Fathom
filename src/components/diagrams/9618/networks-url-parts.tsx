/**
 * The parts of the URL https://www.example.org/films/reviews/index.html, each
 * in its own box: "https" is the protocol (how the browser and server
 * communicate); "://" separates it; "www.example.org" is the domain name (which
 * web server); "/films/reviews/" is the path (folders on the server); and
 * "index.html" is the file name (the resource itself).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-url-parts';

const W = 640;
const H = 170;
const CH = 8.6;
const Y = 40;

const parts = [
  { text: 'https', name: 'protocol', note: 'how to communicate', cls: 'accent' },
  { text: '://', name: '', note: '', cls: 'none' },
  { text: 'www.example.org', name: 'domain name', note: 'which web server', cls: 'accent-2' },
  { text: '/films/reviews/', name: 'path', note: 'folders on the server', cls: 'accent' },
  { text: 'index.html', name: 'file name', note: 'the resource itself', cls: 'accent-2' },
];

export function NetworksUrlParts() {
  const widths = parts.map((p) => p.text.length * CH + 18);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = (W - total) / 2;
  return (
    <Svg width={W} height={H}>
      {parts.map((p, i) => {
        const w = widths[i]!;
        const x0 = x;
        x += w;
        const mid = x0 + w / 2;
        const fill = p.cls === 'accent' ? 'dg-fill-accent dg-accent' : p.cls === 'accent-2' ? 'dg-fill-accent-2 dg-accent-2' : 'dg-fill-muted dg-thin';
        return (
          <g key={p.text}>
            <rect x={x0 + 2} y={Y} width={w - 4} height={38} rx={6} className={fill} />
            <Label x={mid} y={Y + 19} className="dg-text dg-mono">
              {p.text}
            </Label>
            {p.name && (
              <>
                <line x1={mid} y1={Y + 42} x2={mid} y2={Y + 58} className="dg-muted" />
                <Label x={mid} y={Y + 72} className={p.cls === 'accent' ? 'dg-text-accent' : 'dg-text-accent-2'}>
                  {p.name}
                </Label>
                <Label x={mid} y={Y + 92} className="dg-text-small dg-text-muted">
                  {p.note}
                </Label>
              </>
            )}
          </g>
        );
      })}
      <Label x={W / 2} y={H - 14} className="dg-text-small">
        DNS turns the domain name into an IP address; the path and file name are sent to that server
      </Label>
    </Svg>
  );
}

export default NetworksUrlParts;
