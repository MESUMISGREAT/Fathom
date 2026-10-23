/**
 * Free-body diagrams of a falling skydiver at three moments. The weight W
 * (downwards) is the same length in every panel; the air resistance D
 * (upwards) is drawn to the same scale: 0, half of W, then equal to W.
 *   1. Just released: v = 0, so D = 0. Resultant = W, a = g.
 *   2. Speeding up: D = W/2 here. Resultant = W − D, so 0 < a < g.
 *   3. Terminal velocity: D = W. Resultant = 0, a = 0, v constant.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-non-uniform-skydiver-forces';

const W = 640;
const H = 330;
const WL = 92; // length of the weight arrow, px

function Skydiver({ x, y }: { x: number; y: number }) {
  // belly-down: body, head on the left, arms and legs spread
  return (
    <g>
      <line x1={x - 14} y1={y - 4} x2={x - 30} y2={y - 22} className="dg-line" />
      <line x1={x - 14} y1={y + 4} x2={x - 30} y2={y + 20} className="dg-line" />
      <line x1={x + 18} y1={y - 4} x2={x + 38} y2={y - 16} className="dg-line" />
      <line x1={x + 18} y1={y + 4} x2={x + 38} y2={y + 16} className="dg-line" />
      <ellipse cx={x} cy={y} rx={24} ry={9} className="dg-fill-accent dg-accent" />
      <circle cx={x - 32} cy={y} r={8} className="dg-fill-accent dg-accent" />
    </g>
  );
}

const panels = [
  { title: '1. Just released', d: 0, v: 'v = 0, so D = 0', res: 'resultant = W', a: 'a = g' },
  { title: '2. Speeding up', d: 0.5, v: 'v bigger, so D bigger', res: 'resultant = W − D', a: '0 < a < g' },
  { title: '3. Terminal velocity', d: 1, v: 'D has grown to equal W', res: 'resultant = 0', a: 'a = 0, v constant' },
];

export function NonUniformSkydiverForces() {
  const y = 150;
  return (
    <Svg width={W} height={H}>
      {panels.map((p, i) => {
        const x = 110 + i * 210;
        const dl = p.d * WL;
        return (
          <g key={p.title}>
            {i > 0 && <line x1={x - 105} y1={12} x2={x - 105} y2={H - 10} className="dg-grid" />}
            <Label x={x} y={20} className="dg-text dg-bold">
              {p.title}
            </Label>
            <Skydiver x={x} y={y} />
            {dl > 0 ? (
              <>
                <Arrow x1={x} y1={y - 10} x2={x} y2={y - 10 - dl} className="dg-accent-2" headClassName="dg-dot-accent-2" />
                <Label x={x + 10} y={y - 14 - dl / 2} anchor="start" className="dg-text-accent-2">
                  D
                </Label>
              </>
            ) : (
              <Label x={x} y={y - 40} className="dg-text-small dg-text-accent-2">
                no air resistance yet
              </Label>
            )}
            <Arrow x1={x} y1={y + 10} x2={x} y2={y + 10 + WL} />
            <Label x={x + 10} y={y + 12 + WL / 2} anchor="start" className="dg-text dg-bold">
              W
            </Label>
            <Label x={x} y={272} className="dg-text-small">
              {p.v}
            </Label>
            <Label x={x} y={292} className="dg-text-small">
              {p.res}
            </Label>
            <Label x={x} y={314} className="dg-text-accent">
              {p.a}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}

export default NonUniformSkydiverForces;
