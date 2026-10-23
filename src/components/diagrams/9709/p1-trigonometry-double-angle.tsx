/**
 * y = sin 2x (solid) and y = sin x (dashed) for 0° ≤ x ≤ 360°, with the line
 * y = 0.6. sin x = 0.6 has 2 solutions here, but sin 2x = 0.6 has 4
 * (x = 18.4°, 71.6°, 198.4°, 251.6°), because 2x runs through 0° to 720°: two
 * full cycles.
 */
import { Label, Svg, graph } from '../primitives';
import { GraphFrame, frame, sind } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-double-angle';

const W = 640;
const H = 310;
const K = 0.6;
const XR: [number, number] = [-12, 372];

export default function P1TrigonometryDoubleAngle() {
  const p = frame(50, 34, 420, 226, XR, [-1.3, 1.3]);
  const b = (Math.asin(K) * 180) / Math.PI;
  const dbl = [b / 2, (180 - b) / 2, (360 + b) / 2, (540 - b) / 2];
  const single = [b, 180 - b];
  return (
    <Svg width={W} height={H}>
      <GraphFrame
        p={p}
        xTicks={[90, 180, 270, 360].map((v) => ({ v, label: `${v}°` }))}
        yTicks={[
          { v: 1, label: '1' },
          { v: -1, label: '−1' },
        ]}
      />
      <path d={graph(sind, [0, 360], p, p.y)} className="dg-muted dg-dashed" />
      <path d={graph((x) => sind(2 * x), [0, 360], p, p.y, 480)} className="dg-accent" />
      <line x1={p.sx(0)} y1={p.sy(K)} x2={p.sx(360)} y2={p.sy(K)} className="dg-accent-2" style={{ strokeWidth: 1.75 }} />
      {single.map((x) => (
        <circle key={`s${x}`} cx={p.sx(x)} cy={p.sy(K)} r={5} className="dg-muted" />
      ))}
      {dbl.map((x) => (
        <circle key={`d${x}`} cx={p.sx(x)} cy={p.sy(K)} r={4.5} className="dg-dot" />
      ))}
      <Label x={p.sx(360) + 4} y={p.sy(K) - 12} anchor="end" className="dg-text-small">
        y = 0.6
      </Label>

      <g>
        <Label x={560} y={60} className="dg-text-accent">
          y = sin 2x
        </Label>
        <Label x={560} y={80} className="dg-text-small">
          4 solutions (solid dots):
        </Label>
        <Label x={560} y={98} className="dg-text-small dg-bold">
          {dbl.map((x) => `${x.toFixed(1)}°`).slice(0, 2).join(', ')},
        </Label>
        <Label x={560} y={116} className="dg-text-small dg-bold">
          {dbl.map((x) => `${x.toFixed(1)}°`).slice(2).join(', ')}
        </Label>
        <Label x={560} y={150} className="dg-text-small">
          y = sin x (dashed)
        </Label>
        <Label x={560} y={168} className="dg-text-small">
          2 solutions (rings)
        </Label>
        <Label x={560} y={204} className="dg-text-small">
          0° ≤ x ≤ 360° means
        </Label>
        <Label x={560} y={222} className="dg-text-small">
          0° ≤ 2x ≤ 720°:
        </Label>
        <Label x={560} y={240} className="dg-text-small">
          two full cycles
        </Label>
      </g>
    </Svg>
  );
}
