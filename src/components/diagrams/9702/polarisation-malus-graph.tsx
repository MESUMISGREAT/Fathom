/**
 * Malus's law plotted: relative intensity I/I0 against the angle between the
 * analyser and the plane of polarisation. Maximum at 0 and 180 degrees, half at
 * 45, zero at 90.
 */
import { Label, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-polarisation-malus-graph';

const W = 600;
const H = 320;
const PAD = 54;

const map = axes({ width: W, height: H, pad: PAD, x: [0, 360], y: [0, 1.1] });

const TICKS: Array<[number, string]> = [
  [0, '0'],
  [45, '45'],
  [90, '90'],
  [180, '180'],
  [270, '270'],
  [360, '360'],
];

export function PolarisationMalusGraph() {
  const curve = graph((d) => Math.cos((d * Math.PI) / 180) ** 2, [0, 360], map, [0, 1.1]);
  return (
    <Svg width={W} height={H}>
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(360)} y2={map.sy(0)} className="dg-line" />
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(0)} y2={map.sy(1.1)} className="dg-line" />

      {TICKS.map(([d, label]) => (
        <g key={d}>
          <line x1={map.sx(d)} y1={map.sy(0)} x2={map.sx(d)} y2={map.sy(0) + 5} className="dg-thin" />
          <Label x={map.sx(d)} y={map.sy(0) + 18} className="dg-text-small dg-text-muted">
            {label}
          </Label>
        </g>
      ))}

      <line x1={map.sx(0) - 5} y1={map.sy(0.5)} x2={map.sx(0)} y2={map.sy(0.5)} className="dg-thin" />
      <Label x={map.sx(0) - 10} y={map.sy(0.5)} anchor="end" className="dg-text-small dg-text-muted">
        0.5
      </Label>
      <line x1={map.sx(0) - 5} y1={map.sy(1)} x2={map.sx(0)} y2={map.sy(1)} className="dg-thin" />
      <Label x={map.sx(0) - 10} y={map.sy(1)} anchor="end" className="dg-text-small dg-text-muted">
        1.0
      </Label>

      <path d={curve} className="dg-accent" fill="none" />

      <circle cx={map.sx(45)} cy={map.sy(0.5)} r={4} className="dg-dot-accent" />
      <Label x={map.sx(45) + 10} y={map.sy(0.68)} anchor="start" className="dg-text-small dg-text-accent">
        half at 45°
      </Label>
      <circle cx={map.sx(90)} cy={map.sy(0)} r={4} className="dg-dot" />

      <Label x={map.sx(360)} y={map.sy(0) + 46} anchor="end" className="dg-text-small dg-text-muted">
        angle θ between analyser and plane of polarisation / degrees
      </Label>
      <Label x={map.sx(0) + 8} y={map.sy(1.1) + 2} anchor="start" className="dg-text-small dg-text-muted">
        I / I₀
      </Label>
    </Svg>
  );
}

export default PolarisationMalusGraph;
