/**
 * Looking along the beam. Unpolarised light has electric-field oscillations in
 * many planes; plane-polarised light has them in one. A longitudinal wave
 * oscillates along the direction of travel, so it has no plane to select.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-polarisation-transverse-planes';

const W = 660;
const H = 280;

const R = 42;

function radial(cx: number, cy: number, deg: number, r: number) {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function PolarisationTransversePlanes() {
  return (
    <Svg width={W} height={H}>
      <Label x={110} y={28} className="dg-text dg-bold">
        Unpolarised
      </Label>
      <Label x={330} y={28} className="dg-text dg-bold">
        Plane-polarised
      </Label>
      <Label x={550} y={28} className="dg-text dg-bold">
        Longitudinal
      </Label>

      <circle cx={110} cy={120} r={R} className="dg-thin dg-dashed" />
      {[0, 45, 90, 135].map((deg) => {
        const a = radial(110, 120, deg, R);
        const b = radial(110, 120, deg + 180, R);
        return <Arrow key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} double head={7} className="dg-accent" headClassName="dg-dot-accent" />;
      })}
      <Label x={110} y={205} className="dg-text-small dg-text-muted">
        oscillations in many planes
      </Label>

      <circle cx={330} cy={120} r={R} className="dg-thin dg-dashed" />
      <Arrow x1={330} y1={120 - R} x2={330} y2={120 + R} double head={8} className="dg-accent-2" headClassName="dg-dot" />
      <Label x={330} y={205} className="dg-text-small dg-text-muted">
        one plane only
      </Label>

      <line x1={490} y1={120} x2={610} y2={120} className="dg-line" />
      {[500, 518, 532, 542, 552, 566, 584, 598].map((x, i) => (
        <line key={x} x1={x} y1={98} x2={x} y2={142} className={i > 1 && i < 6 ? 'dg-accent-2' : 'dg-muted'} />
      ))}
      <Arrow x1={520} y1={72} x2={580} y2={72} double head={7} className="dg-muted" headClassName="dg-dot" />
      <Label x={550} y={56} className="dg-text-small dg-text-muted">
        particle motion
      </Label>
      <Label x={550} y={205} className="dg-text-small dg-text-muted">
        oscillation along travel
      </Label>

      <Label x={330} y={248} className="dg-text-small">
        Polarisation selects one plane of oscillation, so it needs a transverse wave.
      </Label>
    </Svg>
  );
}

export default PolarisationTransversePlanes;
