/**
 * Velocity–time graph (upwards positive) for a ball thrown vertically upwards
 * at 20 m s⁻¹, with and without air resistance. g = 9.81 m s⁻².
 * No air resistance (dashed): a straight line of gradient −g from +20 m s⁻¹,
 *   crossing zero at 2.04 s and reaching −20 m s⁻¹ at 4.08 s.
 * With air resistance (solid): drag ∝ v² with an illustrative terminal speed
 *   of 20 m s⁻¹, computed by stepping dv/dt = −g − k v|v|. It is steeper than
 *   −g on the way up, has gradient exactly −g at the top (v = 0, at 1.60 s,
 *   short tangent drawn there), is shallower than −g on the way down, and
 *   lands at 3.40 s at 14.1 m s⁻¹. The shaded areas above and below the time
 *   axis are equal (same height up and down).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-non-uniform-throw-vt';

const W = 640;
const H = 320;
const G = 9.81;
const U = 20;
const K = G / 20 ** 2;

const X0 = 64;
const X1 = 470;
const YM = 160; // v = 0
const PX = (X1 - X0) / 4.5; // px per second
const PV = 5.4; // px per m s⁻¹
const sx = (t: number) => X0 + t * PX;
const sy = (v: number) => YM - v * PV;

function flight(): { pts: [number, number][]; tTop: number } {
  const pts: [number, number][] = [[0, U]];
  let v = U;
  let y = 0;
  let t = 0;
  let tTop = 0;
  const dt = 0.0005;
  for (let i = 1; ; i++) {
    const before = v;
    v += (-G - K * v * Math.abs(v)) * dt;
    y += v * dt;
    t = i * dt;
    if (before > 0 && v <= 0) tTop = t;
    if (y < 0) break;
    if (i % 20 === 0) pts.push([t, v]);
  }
  pts.push([t, v]);
  return { pts, tTop };
}

export function NonUniformThrowVt() {
  const { pts, tTop } = flight();
  const path = pts.map(([t, v], i) => `${i === 0 ? 'M' : 'L'}${sx(t).toFixed(2)},${sy(v).toFixed(2)}`).join(' ');
  const up = pts.filter(([t]) => t <= tTop);
  const down = pts.filter(([t]) => t >= tTop);
  const area = (p: [number, number][]) =>
    `M${sx(p[0]![0]).toFixed(2)},${sy(0)} ` +
    p.map(([t, v]) => `L${sx(t).toFixed(2)},${sy(v).toFixed(2)}`).join(' ') +
    ` L${sx(p[p.length - 1]![0]).toFixed(2)},${sy(0)} Z`;
  const [tEnd, vEnd] = pts[pts.length - 1]!;
  const tan = 0.45;
  return (
    <Svg width={W} height={H}>
      <path d={area(up)} className="dg-fill-accent" />
      <path d={area(down)} className="dg-fill-accent" />
      {[-20, -10, 10, 20].map((v) => (
        <line key={v} x1={X0} y1={sy(v)} x2={X1} y2={sy(v)} className="dg-grid" />
      ))}
      <line x1={X0} y1={sy(0)} x2={X1} y2={sy(0)} className="dg-line" />
      <line x1={X0} y1={sy(-25)} x2={X0} y2={sy(25)} className="dg-line" />
      {[1, 2, 3, 4].map((t) => (
        <Label key={t} x={sx(t)} y={sy(0) + 13} className="dg-text-small">
          {t}
        </Label>
      ))}
      {[-20, -10, 0, 10, 20].map((v) => (
        <Label key={v} x={X0 - 7} y={sy(v)} anchor="end" className="dg-text-small">
          {v < 0 ? `−${-v}` : v}
        </Label>
      ))}
      <Label x={X1 + 4} y={sy(0) - 12} anchor="end" className="dg-text-small dg-italic">
        t / s
      </Label>
      <text
        x={16}
        y={YM}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 16 ${YM})`}
        className="dg-text-small dg-italic"
      >
        v (upwards +) / m s⁻¹
      </text>
      {/* no air resistance */}
      <path d={`M${sx(0)},${sy(U)} L${sx((2 * U) / G)},${sy(-U)}`} className="dg-muted dg-dashed" />
      {/* with air resistance */}
      <path d={path} className="dg-accent" />
      <path
        d={`M${sx(tTop - tan)},${sy(G * tan)} L${sx(tTop + tan)},${sy(-G * tan)}`}
        className="dg-accent-2"
      />
      <circle cx={sx(tTop)} cy={sy(0)} r={4} className="dg-dot-accent-2" />
      <line x1={sx(tEnd)} y1={sy(vEnd)} x2={sx(tEnd)} y2={sy(0)} className="dg-thin dg-dashed" />

      {/* notes */}
      <Label x={sx(0.55)} y={sy(23.5)} anchor="start" className="dg-text-small">
        going up: W and drag both down,
      </Label>
      <Label x={sx(0.55)} y={sy(23.5) + 15} anchor="start" className="dg-text-small">
        so steeper than −g
      </Label>
      <Label x={sx(2.12)} y={sy(7)} anchor="start" className="dg-text-small">
        at the top v = 0, so drag = 0
      </Label>
      <Label x={sx(2.12)} y={sy(7) + 15} anchor="start" className="dg-text-small">
        and the gradient is exactly −g
      </Label>
      <Label x={sx(0.25)} y={sy(-10)} anchor="start" className="dg-text-small">
        coming down: drag up,
      </Label>
      <Label x={sx(0.25)} y={sy(-10) + 15} anchor="start" className="dg-text-small">
        so shallower than −g
      </Label>
      <Label x={sx(tEnd) - 10} y={sy(vEnd) + 22} anchor="end" className="dg-text-small">
        lands at 14 m s⁻¹, not 20
      </Label>
      <Label x={sx(4.12)} y={sy(-21.5)} anchor="start" className="dg-text-small dg-text-muted">
        no air
      </Label>

      {/* key */}
      <line x1={490} y1={60} x2={520} y2={60} className="dg-accent" />
      <Label x={528} y={60} anchor="start" className="dg-text-small">
        with air resistance
      </Label>
      <line x1={490} y1={84} x2={520} y2={84} className="dg-muted dg-dashed" />
      <Label x={528} y={84} anchor="start" className="dg-text-small">
        no air resistance
      </Label>
      <rect x={490} y={100} width={30} height={14} className="dg-fill-accent" />
      <Label x={528} y={107} anchor="start" className="dg-text-small">
        equal areas:
      </Label>
      <Label x={528} y={122} anchor="start" className="dg-text-small">
        same height up
      </Label>
      <Label x={528} y={137} anchor="start" className="dg-text-small">
        as down
      </Label>
      <Label x={490} y={200} anchor="start" className="dg-text-small">
        up: 1.6 s
      </Label>
      <Label x={490} y={218} anchor="start" className="dg-text-small">
        down: 1.8 s
      </Label>
      <Label x={490} y={236} anchor="start" className="dg-text-small dg-text-muted">
        (2.0 s each with no air)
      </Label>
    </Svg>
  );
}

export default NonUniformThrowVt;
