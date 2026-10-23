/**
 * Velocity–time graph for a whole parachute jump (downwards positive),
 * computed by stepping dv/dt = g − c v² with g = 9.81 m s⁻².
 * Illustrative numbers: free-fall terminal velocity 50 m s⁻¹; the canopy
 * opens at t = 25 s and inflates over 3 s, raising c until the terminal
 * velocity is 5 m s⁻¹; the parachutist lands at t = 50 s.
 *   A: speeding up, gradient (acceleration) decreasing from g;
 *   B: first terminal velocity, D = W;
 *   C: parachute opens, D > W, so the resultant force is upwards and the
 *      parachutist decelerates (still moving downwards);
 *   D: new, lower terminal velocity, D = W again;
 *   E: lands.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-non-uniform-parachute-vt';

const W = 640;
const H = 320;
const G = 9.81;
const C1 = G / 50 ** 2;
const C2 = G / 5 ** 2;
const T_OPEN = 25;
const T_RAMP = 3;
const T_LAND = 50;
const T_MAX = 55;

const X0 = 56;
const X1 = 440;
const Y0 = 262;
const Y1 = 40;
const sx = (t: number) => X0 + (t / T_MAX) * (X1 - X0);
const sy = (v: number) => Y0 - (v / 60) * (Y0 - Y1);

function jump(): [number, number][] {
  const c = (t: number) =>
    t < T_OPEN ? C1 : t < T_OPEN + T_RAMP ? C1 + ((C2 - C1) * (t - T_OPEN)) / T_RAMP : C2;
  const pts: [number, number][] = [[0, 0]];
  let v = 0;
  const dt = 0.002;
  for (let i = 1; i * dt <= T_LAND + 1e-9; i++) {
    const t = i * dt;
    v += (G - c(t) * v * v) * dt;
    if (i % 25 === 0) pts.push([t, v]);
  }
  pts.push([T_LAND + 0.4, 0], [T_MAX, 0]);
  return pts;
}

const key: [string, string, string][] = [
  ['A', 'speeding up;', 'acceleration decreasing'],
  ['B', 'terminal velocity:', 'D = W, a = 0'],
  ['C', 'parachute opens: D > W,', 'decelerates (still falling)'],
  ['D', 'new, lower terminal', 'velocity: D = W again'],
  ['E', 'lands', ''],
];

export function NonUniformParachuteVt() {
  const pts = jump();
  const d = pts.map(([t, v], i) => `${i === 0 ? 'M' : 'L'}${sx(t).toFixed(2)},${sy(v).toFixed(2)}`).join(' ');
  const tag = (x: number, y: number, s: string) => (
    <g>
      <circle cx={x} cy={y} r={10} className="dg-fill-surface dg-thin" />
      <Label x={x} y={y + 1} className="dg-text-small dg-bold">
        {s}
      </Label>
    </g>
  );
  return (
    <Svg width={W} height={H}>
      {[10, 20, 30, 40, 50, 60].map((v) => (
        <line key={v} x1={X0} y1={sy(v)} x2={X1} y2={sy(v)} className="dg-grid" />
      ))}
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} className="dg-line" />
      <line x1={X0} y1={Y0} x2={X0} y2={Y1} className="dg-line" />
      {[0, 10, 20, 30, 40, 50].map((t) => (
        <Label key={t} x={sx(t)} y={Y0 + 14} className="dg-text-small">
          {t}
        </Label>
      ))}
      {[0, 10, 20, 30, 40, 50, 60].map((v) => (
        <Label key={v} x={X0 - 7} y={sy(v)} anchor="end" className="dg-text-small">
          {v}
        </Label>
      ))}
      <Label x={(X0 + X1) / 2} y={Y0 + 34} className="dg-text-small dg-italic">
        t / s
      </Label>
      <text
        x={14}
        y={(Y0 + Y1) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 14 ${(Y0 + Y1) / 2})`}
        className="dg-text-small dg-italic"
      >
        v (downwards) / m s⁻¹
      </text>
      <Label x={(X0 + X1) / 2} y={18} className="dg-text dg-bold">
        A parachute jump
      </Label>
      <path d={d} className="dg-accent" />
      {tag(sx(4), sy(44), 'A')}
      {tag(sx(16), sy(56), 'B')}
      {tag(sx(28.6), sy(32), 'C')}
      {tag(sx(39), sy(11), 'D')}
      {tag(sx(53), sy(7), 'E')}

      {/* key */}
      {key.map(([k, l1, l2], i) => {
        const y = 52 + i * 46;
        return (
          <g key={k}>
            {tag(470, y + 6, k)}
            <Label x={488} y={y} anchor="start" className="dg-text-small">
              {l1}
            </Label>
            {l2 && (
              <Label x={488} y={y + 15} anchor="start" className="dg-text-small">
                {l2}
              </Label>
            )}
          </g>
        );
      })}
    </Svg>
  );
}

export default NonUniformParachuteVt;
