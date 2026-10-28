/**
 * System security versus data security (9618 6.1.2). The left panel is the computer system: its
 * controls (accounts, firewall, anti-malware, patches, physical locks) surround the data. The right
 * panel shows the same data leaving the system by three ordinary routes — USB stick, backup tape,
 * cloud sync — each protected by encryption and access rights that travel with the copy.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-security-system-vs-data';

const W = 640;
const H = 302;
const SYSTEM = { x: 16, y: 46, w: 252, h: 212 };
const DATA = { x: 50, y: 186, w: 184, h: 56 };
const ROUTES = ['USB stick', 'backup tape', 'cloud sync'];
const ROUTE_Y = [92, 150, 208];

const systemControls = ['user accounts', 'firewall', 'anti-virus / anti-spyware', 'patches', 'physical locks'];

export function SystemVsDataDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={SYSTEM.x + SYSTEM.w / 2} y={28} className="dg-text dg-bold">
        system security
      </Label>
      <rect
        x={SYSTEM.x}
        y={SYSTEM.y}
        width={SYSTEM.w}
        height={SYSTEM.h}
        rx={8}
        className="dg-fill-muted dg-thin"
      />
      {systemControls.map((c, i) => (
        <Label key={c} x={SYSTEM.x + 12} y={SYSTEM.y + 20 + i * 19} anchor="start" className="dg-text-small">
          {c}
        </Label>
      ))}
      <rect x={DATA.x} y={DATA.y} width={DATA.w} height={DATA.h} rx={6} className="dg-fill-accent dg-thin" />
      <Label x={DATA.x + DATA.w / 2} y={DATA.y + 20} className="dg-text dg-bold">
        data
      </Label>
      <Label x={DATA.x + DATA.w / 2} y={DATA.y + 40} className="dg-text-small">
        files and records
      </Label>

      <Label x={432} y={28} className="dg-text dg-bold">
        data security travels with it
      </Label>
      {ROUTES.map((route, i) => {
        const y = ROUTE_Y[i]!;
        return (
          <g key={route}>
            <Arrow x1={DATA.x + DATA.w + 2} y1={DATA.y + DATA.h / 2} x2={350} y2={y + 20} head={8} />
            <rect x={352} y={y} width={248} height={42} rx={6} className="dg-fill-surface dg-thin" />
            <Label x={366} y={y + 16} anchor="start" className="dg-text-small dg-bold">
              {route}
            </Label>
            <Label x={366} y={y + 32} anchor="start" className="dg-text-small dg-text-muted">
              encrypted, access rights apply
            </Label>
          </g>
        );
      })}
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        the firewall stops at the edge of the system; encryption gives the copy its own lock
      </Label>
    </Svg>
  );
}

export default SystemVsDataDiagram;
