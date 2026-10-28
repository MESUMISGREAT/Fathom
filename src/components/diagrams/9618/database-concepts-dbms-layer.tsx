/**
 * Programs never open the data files directly. Three applications send requests
 * to the DBMS, which enforces access rights, integrity rules, locking, recovery
 * and queries before touching the single shared database.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-database-concepts-dbms-layer';

const W = 620;
const H = 400;

const APPS = [
  { y: 84, name: 'Reports program' },
  { y: 174, name: 'Attendance program' },
  { y: 264, name: 'Library program' },
];

const SERVICES = [
  'access rights',
  'integrity rules',
  'locking / transactions',
  'backup and recovery',
  'SQL queries',
  'indexes',
];

function DatabaseBox({ x, y, w, h, title }: { x: number; y: number; w: number; h: number; title: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} className="dg-fill-muted dg-thin" />
      <Label x={x + w / 2} y={y + 18} className="dg-text-small dg-bold">
        {title}
      </Label>
    </g>
  );
}

export function DatabaseConceptsDbmsLayer() {
  return (
    <Svg width={W} height={H}>
      {APPS.map((a) => (
        <g key={a.name}>
          <rect x={16} y={a.y} width={150} height={52} rx={8} className="dg-fill-accent dg-thin" />
          <Label x={91} y={a.y + 26} className="dg-text-small">
            {a.name}
          </Label>
          <Arrow x1={168} y1={a.y + 26} x2={202} y2={a.y + 26} />
        </g>
      ))}

      <rect x={206} y={52} width={194} height={300} rx={10} className="dg-line" />
      <Label x={303} y={78} className="dg-text dg-bold">
        DBMS
      </Label>
      <Label x={303} y={98} className="dg-text-small dg-text-muted">
        software layer
      </Label>
      {SERVICES.map((s, i) => (
        <g key={s}>
          <circle cx={222} cy={124 + i * 34} r={2.5} className="dg-dot-accent" />
          <Label x={234} y={124 + i * 34} anchor="start" className="dg-text-small">
            {s}
          </Label>
        </g>
      ))}

      <Arrow x1={402} y1={202} x2={432} y2={202} />

      <rect x={436} y={64} width={168} height={276} rx={10} className="dg-fill-muted dg-thin" />
      <Label x={520} y={86} className="dg-text dg-bold">
        One database
      </Label>
      <DatabaseBox x={455} y={108} w={130} h={58} title="Student" />
      <DatabaseBox x={455} y={176} w={130} h={58} title="Course" />
      <DatabaseBox x={455} y={244} w={130} h={58} title="Loan" />

      <Label x={310} y={378} className="dg-text-small dg-text-muted">
        Programs ask the DBMS; they never read the data files directly.
      </Label>
    </Svg>
  );
}

export default DatabaseConceptsDbmsLayer;
