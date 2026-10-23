/**
 * Paths of a ball launched at 25 m s⁻¹ at 45° above the horizontal, drawn to
 * scale (same scale on both axes), g = 9.81 m s⁻².
 * Dashed: no air resistance, a symmetric parabola; range 63.7 m, maximum
 *   height 15.9 m, peak halfway along.
 * Solid: air resistance with drag ∝ v² (illustrative terminal speed
 *   30 m s⁻¹), computed by stepping the equations of motion. Range about
 *   43 m, maximum height about 12.6 m, peak past halfway (about 23 m along),
 *   and the descent is steeper than the climb.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-non-uniform-projectile-drag';

const W = 640;
const H = 250;
const G = 9.81;
const U = 25;
const TH = Math.PI / 4;
const S = 8.2; // px per metre, both axes
const X0 = 50;
const Y0 = 200;
const sx = (x: number) => X0 + x * S;
const sy = (y: number) => Y0 - y * S;

function path(k: number) {
  let vx = U * Math.cos(TH);
  let vy = U * Math.sin(TH);
  let x = 0;
  let y = 0;
  let peak: [number, number] = [0, 0];
  const pts: [number, number][] = [[0, 0]];
  const dt = 0.0005;
  for (let i = 1; ; i++) {
    const s = Math.hypot(vx, vy);
    vx += -k * s * vx * dt;
    vy += (-G - k * s * vy) * dt;
    x += vx * dt;
    y += vy * dt;
    if (y > peak[1]) peak = [x, y];
    if (y < 0) {
      pts.push([x, 0]);
      break;
    }
    if (i % 40 === 0) pts.push([x, y]);
  }
  const d = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${sx(px).toFixed(2)},${sy(py).toFixed(2)}`).join(' ');
  return { d, peak, range: x };
}

export function NonUniformProjectileDrag() {
  const vac = path(0);
  const air = path(G / 30 ** 2);
  return (
    <Svg width={W} height={H}>
      <line x1={X0 - 10} y1={Y0} x2={sx(70)} y2={Y0} className="dg-line" />
      {[0, 10, 20, 30, 40, 50, 60, 70].map((x) => (
        <g key={x}>
          <line x1={sx(x)} y1={Y0} x2={sx(x)} y2={Y0 + 5} className="dg-thin" />
          <Label x={sx(x)} y={Y0 + 16} className="dg-text-small">
            {x}
          </Label>
        </g>
      ))}
      <Label x={sx(70)} y={Y0 + 36} anchor="end" className="dg-text-small dg-italic">
        horizontal distance / m (same scale both ways)
      </Label>
      <line x1={X0} y1={Y0} x2={X0} y2={sy(20)} className="dg-line" />
      {[0, 10, 20].map((y) => (
        <Label key={y} x={X0 - 7} y={sy(y)} anchor="end" className="dg-text-small">
          {y}
        </Label>
      ))}
      <text
        x={16}
        y={sy(10)}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 16 ${sy(10)})`}
        className="dg-text-small dg-italic"
      >
        height / m
      </text>
      <path d={vac.d} className="dg-muted dg-dashed" />
      <path d={air.d} className="dg-accent" />
      <circle cx={sx(vac.peak[0])} cy={sy(vac.peak[1])} r={3.5} className="dg-dot" />
      <circle cx={sx(air.peak[0])} cy={sy(air.peak[1])} r={3.5} className="dg-dot-accent" />
      <Label x={sx(vac.peak[0]) + 8} y={sy(vac.peak[1]) - 12} anchor="start" className="dg-text-small dg-text-muted">
        no air resistance: symmetric
      </Label>
      <Label x={sx(air.peak[0]) - 36} y={sy(air.peak[1]) - 16} anchor="end" className="dg-text-accent">
        with air resistance
      </Label>
      <Label x={sx(air.range) + 10} y={sy(7)} anchor="start" className="dg-text-small">
        lower, shorter,
      </Label>
      <Label x={sx(air.range) + 10} y={sy(7) + 15} anchor="start" className="dg-text-small">
        steeper on the way down
      </Label>
      <Label x={sx(air.range) + 6} y={Y0 - 12} anchor="start" className="dg-text-small dg-text-accent">
        {`${air.range.toFixed(0)} m`}
      </Label>
      <Label x={sx(vac.range) + 6} y={Y0 - 12} anchor="start" className="dg-text-small dg-text-muted">
        {`${vac.range.toFixed(0)} m`}
      </Label>
    </Svg>
  );
}

export default NonUniformProjectileDrag;
