/**
 * Layered defence (9618 6.1.3). An attacker or a piece of malware meets a series of independent
 * controls from the outside in: physical security, the firewall, accounts and authentication,
 * patches, anti-malware, and finally encryption with access rights on the data itself. Each layer
 * covers a different route, so one failure does not expose everything.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-security-defence-layers';

const W = 640;
const H = 384;
const BAR_X = 96;
const BAR_W = 448;
const BAR_H = 30;
const GAP = 20;

const layers = [
  'physical security: locked room, cable lock',
  'firewall: filters traffic by IP, port, protocol',
  'accounts and authentication: passwords, MFA',
  'patches and updates: close known flaws',
  'anti-virus and anti-spyware: detect and quarantine',
];

export function DefenceLayersDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        an attacker or a piece of malware arrives
      </Label>
      <Arrow x1={W / 2} y1={34} x2={W / 2} y2={52} head={8} />
      {layers.map((layer, i) => {
        const y = 56 + i * (BAR_H + GAP);
        return (
          <g key={layer}>
            <rect x={BAR_X} y={y} width={BAR_W} height={BAR_H} rx={4} className="dg-fill-muted dg-thin" />
            <Label x={BAR_X + BAR_W / 2} y={y + BAR_H / 2} className="dg-text-small">
              {layer}
            </Label>
            <Arrow x1={W / 2} y1={y + BAR_H + 3} x2={W / 2} y2={y + BAR_H + GAP - 3} head={7} />
          </g>
        );
      })}
      <rect x={160} y={306} width={320} height={40} rx={6} className="dg-fill-accent dg-thin" />
      <Label x={W / 2} y={320} className="dg-text dg-bold">
        the data itself
      </Label>
      <Label x={W / 2} y={338} className="dg-text-small">
        encryption + access rights
      </Label>
      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">
        each layer covers a different route in, so one gap does not expose everything
      </Label>
    </Svg>
  );
}

export default DefenceLayersDiagram;
