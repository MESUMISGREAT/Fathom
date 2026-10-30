/**
 * Velocity–time graph for constant acceleration: a straight line from u to v
 * over time t. The area is a trapezium giving displacement s = ½(u+v)t.
 * It splits into a rectangle (ut) and a triangle (½at²), showing the
 * suvat formulae s = ut + ½at² and s = ½(u+v)t.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'kinematics-suvat';

const W = 680;
const H = 360;
const X0 = 90;
const Y0 = 270;
const PX = 50;
const VSCALE = 18;

const x = (t: number) => X0 + t * PX;
const y = (v: number) => Y0 - v * VSCALE;

// Example values: u = 2, v = 8, t = 6, a = 1
const u = 2;
const v = 8;
const t = 6;
const a = 1;

export function KinematicsSuvat() {
  // The trapezium area path
  const areaPath = `M${x(0)},${y(0)} L${x(0)},${y(u)} L${x(t)},${y(v)} L${x(t)},${y(0)} Z`;

  // The velocity line
  const velocityPath = `M${x(0)},${y(u)} L${x(t)},${y(v)}`;

  return (
    <Svg width={W} height={H}>
      <Label x={340} y={28} className="dg-text dg-bold">
        Constant acceleration: the four suvat formulae
      </Label>
      <Label x={340} y={50} className="dg-text-small dg-text-muted">
        u = 2 m·s⁻¹, v = 8 m·s⁻¹, t = 6 s, a = 1 m·s⁻² → s = 30 m
      </Label>

      {/* Axes */}
      <line x1={x(0)} y1={y(0)} x2={x(t + 0.5)} y2={y(0)} className="dg-line" />
      <line x1={x(0)} y1={y(0)} x2={x(0)} y2={y(v + 2)} className="dg-line" />
      <Label x={x(t + 0.5) + 8} y={y(0)} anchor="start" className="dg-text-small dg-text-muted">
        t (s)
      </Label>
      <Label x={x(0) - 14} y={y(v + 2) - 4} anchor="end" className="dg-text-small dg-text-muted">
        v (m·s⁻¹)
      </Label>

      {/* Time axis ticks and labels */}
      {[0, t].map((ti) => (
        <g key={ti}>
          <line x1={x(ti)} y1={y(0)} x2={x(ti)} y2={y(0) + 6} className="dg-muted" />
          <Label x={x(ti)} y={y(0) + 20} className="dg-text-small dg-text-muted">
            {ti === 0 ? '0' : 't'}
          </Label>
        </g>
      ))}

      {/* Velocity axis ticks and labels */}
      {[0, u, v].map((vi) => {
        const label = vi === 0 ? '0' : vi === u ? 'u' : 'v';
        return (
          <g key={vi}>
            <line x1={x(0) - 6} y1={y(vi)} x2={x(0)} y2={y(vi)} className="dg-muted" />
            <Label x={x(0) - 16} y={y(vi)} anchor="end" className="dg-text-small dg-text-muted">
              {label}
            </Label>
          </g>
        );
      })}

      {/* Velocity line */}
      <path d={velocityPath} className="dg-accent" strokeWidth={2.5} />

      {/* Shaded trapezium area */}
      <path d={areaPath} className="dg-fill-accent" opacity={0.25} />

      {/* Split lines to show rectangle + triangle */}
      <line x1={x(t)} y1={y(u)} x2={x(t)} y2={y(0)} className="dg-thin dg-dashed" />
      <Label x={x(t) + 10} y={y(u / 2)} anchor="start" className="dg-text-small dg-text-accent">
        rectangle: ut
      </Label>
      <MathLabel x={x(t / 2)} y={y(u) - 18} anchor="middle" tex="\frac{1}{2}at^2" w={80} h={32} tone="accent-2" size="small" />

      {/* Formulae box */}
      <rect x={30} y={120} width={620} height={160} rx={10} className="dg-fill-muted dg-thin" />

      <Label x={60} y={140} className="dg-text dg-bold">
        The four constant-acceleration formulae
      </Label>

      <MathLabel x={180} y={180} tex="v = u + at" w={180} h={44} anchor="start" tone="accent" />
      <MathLabel x={180} y={215} tex="s = ut + \tfrac{1}{2}at^2" w={220} h={44} anchor="start" tone="accent" />
      <MathLabel x={420} y={180} tex="v^2 = u^2 + 2as" w={220} h={44} anchor="start" tone="accent-2" />
      <MathLabel x={420} y={215} tex="s = \tfrac{1}{2}(u + v)t" w={220} h={44} anchor="start" tone="accent-2" />

      <Label x={60} y={250} className="dg-text-small dg-text-muted">
        Each formula omits one of {`u, v, a, s, t`} — pick the one that skips the
        quantity you don’t know and don’t need.
      </Label>

      <Label x={60} y={276} className="dg-text-small dg-text-muted">
        The graph area is the trapezium s = rectangle + triangle = ut + 
      </Label>
      <MathLabel x={60} y={290} tex="s = \frac{1}{2}(u+v)t = ut + \frac{1}{2}at^2" w={300} h={32} anchor="start" tone="muted" size="small" />

      {/* Small labels on the graph */}
      <Label x={x(0) - 6} y={y(u) - 14} anchor="end" className="dg-text-small dg-text-accent">
        u
      </Label>
      <Label x={x(t) + 6} y={y(v) - 14} anchor="start" className="dg-text-small dg-text-accent">
        v
      </Label>
    </Svg>
  );
}

export default KinematicsSuvat;