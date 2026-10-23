/**
 * Where the work happens. Left, thin client: the client box only handles
 * input and output (screen, keyboard, mouse); processing, storage and the
 * applications all sit on the server, joined by a solid line labelled
 * "constant connection needed". Right, thick client: processing, storage and
 * applications sit on the client itself; the server holds only shared files and
 * backups, joined by a dashed line labelled "connection optional".
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-thin-thick';

const W = 620;
const H = 300;
const BOX_W = 210;

function Machine({ x, y, h, title, chips }: { x: number; y: number; h: number; title: string; chips: { text: string; on: boolean }[] }) {
  return (
    <g>
      <rect x={x} y={y} width={BOX_W} height={h} rx={10} className="dg-fill-muted dg-thin" />
      <Label x={x + BOX_W / 2} y={y + 18} className="dg-text dg-bold">
        {title}
      </Label>
      {chips.map((c, i) => (
        <g key={c.text}>
          <rect
            x={x + 20}
            y={y + 36 + i * 30}
            width={BOX_W - 40}
            height={24}
            rx={5}
            className={c.on ? 'dg-fill-accent dg-accent' : 'dg-fill-surface dg-muted dg-dashed'}
          />
          <Label x={x + BOX_W / 2} y={y + 48 + i * 30} className={c.on ? 'dg-text-small' : 'dg-text-small dg-text-muted'}>
            {c.text}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function NetworksThinThick() {
  const thinClient = [{ text: 'input and output only', on: true }];
  const thinServer = [
    { text: 'processing', on: true },
    { text: 'storage', on: true },
    { text: 'applications', on: true },
  ];
  const thickClient = [
    { text: 'processing', on: true },
    { text: 'storage', on: true },
    { text: 'applications', on: true },
  ];
  const thickServer = [{ text: 'shared files, backups', on: true }];
  return (
    <Svg width={W} height={H}>
      <Label x={155} y={20} className="dg-text-accent">
        Thin client
      </Label>
      <Label x={465} y={20} className="dg-text-accent">
        Thick client
      </Label>
      <line x1={310} y1={36} x2={310} y2={H - 10} className="dg-grid" />

      {/* thin: small client, big server */}
      <line x1={155} y1={102} x2={155} y2={150} className="dg-line" />
      <Label x={163} y={118} anchor="start" className="dg-text-small">
        constant
      </Label>
      <Label x={163} y={134} anchor="start" className="dg-text-small">
        connection needed
      </Label>
      <Machine x={50} y={36} h={66} title="client" chips={thinClient} />
      <Machine x={50} y={150} h={130} title="server" chips={thinServer} />

      {/* thick: big client, small server */}
      <line x1={465} y1={166} x2={465} y2={214} className="dg-muted dg-dashed" />
      <Label x={473} y={190} anchor="start" className="dg-text-small dg-text-muted">
        connection optional
      </Label>
      <Machine x={360} y={36} h={130} title="client" chips={thickClient} />
      <Machine x={360} y={214} h={66} title="server" chips={thickServer} />
    </Svg>
  );
}

export default NetworksThinThick;
