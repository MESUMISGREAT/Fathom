/**
 * Two stretches of y = sin x (dashed) for 0° ≤ x ≤ 360°.
 * Left: y = 3 sin x, a stretch parallel to the y-axis with factor 3: amplitude 3,
 * range −3 ≤ y ≤ 3, period still 360°.
 * Right: y = sin 2x, a stretch parallel to the x-axis with factor ½: period 180°,
 * so two full cycles fit in 360°; range still −1 ≤ y ≤ 1.
 */
import { Label, Svg, graph } from '../primitives';
import { GraphFrame, frame, sind } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-amplitude-period';

const W = 640;
const H = 300;
const XR: [number, number] = [-15, 375];
const ticks = [90, 180, 270, 360].map((v) => ({ v, label: `${v}°` }));

export default function P1TrigonometryAmplitudePeriod() {
  const L = frame(40, 62, 250, 190, XR, [-3.5, 3.5]);
  const R = frame(370, 62, 250, 190, XR, [-1.6, 1.6]);
  return (
    <Svg width={W} height={H}>
      <Label x={165} y={18} className="dg-text-accent">
        y = 3 sin x
      </Label>
      <Label x={165} y={38} className="dg-text-small">
        amplitude 3, period 360°
      </Label>
      <GraphFrame
        p={L}
        xTicks={ticks}
        yTicks={[
          { v: 3, label: '3' },
          { v: 1, label: '1' },
          { v: -1, label: '−1' },
          { v: -3, label: '−3' },
        ]}
      />
      <path d={graph(sind, [0, 360], L, L.y)} className="dg-muted dg-dashed" />
      <path d={graph((x) => 3 * sind(x), [0, 360], L, L.y)} className="dg-accent" />

      <line x1={330} y1={14} x2={330} y2={H - 10} className="dg-grid" />

      <Label x={495} y={18} className="dg-text-accent-2">
        y = sin 2x
      </Label>
      <Label x={495} y={38} className="dg-text-small">
        amplitude 1, period 180°
      </Label>
      <GraphFrame
        p={R}
        xTicks={ticks}
        yTicks={[
          { v: 1, label: '1' },
          { v: -1, label: '−1' },
        ]}
      />
      <path d={graph(sind, [0, 360], R, R.y)} className="dg-muted dg-dashed" />
      <path d={graph((x) => sind(2 * x), [0, 360], R, R.y)} className="dg-accent-2" />

      <Label x={W / 2} y={H - 12} className="dg-text-small">
        dashed: y = sin x
      </Label>
    </Svg>
  );
}
