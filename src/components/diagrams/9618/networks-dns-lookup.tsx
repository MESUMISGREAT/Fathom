/**
 * Resolving www.example.org. Your browser asks a DNS resolver (usually at your
 * ISP) for the IP address (step 1). If the resolver has not cached it, it asks
 * a root server, which points it to the .org TLD servers (2); the TLD server
 * points it to example.org's name server (3); that name server returns
 * 198.51.100.7 (4). The resolver caches the answer and returns it to the
 * browser, which then sends an HTTP request to the web server at 198.51.100.7
 * (5).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-dns-lookup';

const W = 640;
const H = 440;

function Node({ x, y, w, lines, kind = 'plain' }: { x: number; y: number; w: number; lines: string[]; kind?: 'plain' | 'dns' | 'web' }) {
  const h = lines.length > 1 ? 44 : 34;
  const cls = kind === 'dns' ? 'dg-fill-accent dg-accent' : kind === 'web' ? 'dg-fill-accent-2 dg-accent-2' : 'dg-fill-muted dg-thin';
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={7} className="dg-fill-surface" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={7} className={cls} />
      {lines.map((l, i) => (
        <Label key={i} x={x} y={y + (i - (lines.length - 1) / 2) * 16} className="dg-text-small">
          {l}
        </Label>
      ))}
    </g>
  );
}

function Step({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={11} className="dg-fill-surface" />
      <circle cx={x} cy={y} r={11} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={x} y={y} className="dg-text-small dg-bold">
        {String(n)}
      </Label>
    </g>
  );
}

const steps = [
  'browser asks the resolver: what is the IP address of www.example.org?',
  'not cached, so the resolver asks a root server: “try the .org servers”',
  'the .org TLD server replies: “try example.org’s name server”',
  'example.org’s name server replies 198.51.100.7; the resolver caches it and tells the browser',
  'the browser sends an HTTP request to 198.51.100.7, which returns the page',
];

export function NetworksDnsLookup() {
  const br = { x: 80, y: 170 };
  const rs = { x: 290, y: 170 };
  const root = { x: 530, y: 60 };
  const tld = { x: 530, y: 170 };
  const auth = { x: 530, y: 280 };
  const web = { x: 80, y: 280 };
  return (
    <Svg width={W} height={H}>
      <Arrow x1={142} y1={br.y} x2={218} y2={rs.y} head={8} double className="dg-line" />
      <Arrow x1={362} y1={rs.y - 16} x2={448} y2={root.y + 10} head={8} double className="dg-line" />
      <Arrow x1={362} y1={rs.y} x2={448} y2={tld.y} head={8} double className="dg-line" />
      <Arrow x1={362} y1={rs.y + 16} x2={448} y2={auth.y - 12} head={8} double className="dg-line" />
      <Arrow x1={web.x} y1={br.y + 24} x2={web.x} y2={web.y - 24} head={8} className="dg-accent-2" headClassName="dg-dot-accent-2" />

      <Node x={br.x} y={br.y} w={120} lines={['your browser']} />
      <Node x={rs.x} y={rs.y} w={140} lines={['DNS resolver', '(at your ISP)']} kind="dns" />
      <Node x={root.x} y={root.y} w={160} lines={['root server']} kind="dns" />
      <Node x={tld.x} y={tld.y} w={160} lines={['TLD server (.org)']} kind="dns" />
      <Node x={auth.x} y={auth.y} w={160} lines={['example.org’s', 'name server']} kind="dns" />
      <Node x={web.x} y={web.y} w={120} lines={['web server', '198.51.100.7']} kind="web" />

      <Step x={180} y={148} n={1} />
      <Step x={392} y={100} n={2} />
      <Step x={405} y={152} n={3} />
      <Step x={392} y={240} n={4} />
      <Step x={100} y={225} n={5} />

      <line x1={20} y1={318} x2={W - 20} y2={318} className="dg-grid" />
      {steps.map((s, i) => (
        <g key={i}>
          <Step x={32} y={338 + i * 22} n={i + 1} />
          <Label x={52} y={338 + i * 22} anchor="start" className="dg-text-small">
            {s}
          </Label>
        </g>
      ))}
    </Svg>
  );
}

export default NetworksDnsLookup;
