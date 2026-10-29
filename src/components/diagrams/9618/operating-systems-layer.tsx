/**
 * The operating system sits between the user, the application programs and the
 * hardware: requests pass down through it, and hardware actions come back up.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-operating-systems-layer';

const W = 600;
const H = 300;
const BOX_W = 240;
const X = (W - BOX_W) / 2;

const layers = [
  { label: 'User', y: 56, cls: 'dg-fill-muted', text: 'dg-text' },
  { label: 'Application programs', y: 110, cls: 'dg-fill-muted', text: 'dg-text' },
  { label: 'Operating system', y: 164, cls: 'dg-fill-accent', text: 'dg-text' },
  { label: 'Hardware', y: 218, cls: 'dg-fill-muted', text: 'dg-text' },
];
const BOX_H = 40;

export function OperatingSystemsLayer() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        The OS is the layer in the middle
      </Label>

      {layers.map((l) => (
        <g key={l.label}>
          <rect x={X} y={l.y} width={BOX_W} height={BOX_H} rx={6} className={`${l.cls} dg-line`} />
          <Label x={W / 2} y={l.y + BOX_H / 2 + 1} className={`${l.text} dg-bold`}>
            {l.label}
          </Label>
        </g>
      ))}

      <Arrow x1={70} y1={76} x2={70} y2={192} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={84} y={134} anchor="start" className="dg-text-small dg-text-accent">
        requests
      </Label>

      <Arrow x1={W - 70} y1={192} x2={W - 70} y2={76} head={8} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={W - 84} y={134} anchor="end" className="dg-text-small dg-text-accent-2">
        results
      </Label>

      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">
        Applications ask the OS; the OS works the hardware
      </Label>
    </Svg>
  );
}

export default OperatingSystemsLayer;
