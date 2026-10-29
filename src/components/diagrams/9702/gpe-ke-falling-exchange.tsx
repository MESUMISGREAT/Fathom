/**
 * A 1.0 kg ball dropped from 4.0 m: at four heights, two stacked bars show how the
 * same 39 J is shared between the gravitational store and the kinetic store. The
 * total bar length never changes; the speed labels show what the kinetic share is
 * worth.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-gpe-ke-falling-exchange';

const W = 620;
const H = 372;
const BAR_X = 262;
const BAR_W = 160; // 40 J
const jpx = (j: number) => (j / 40) * BAR_W;

const rows = [
  { h: 4.0, y: 78, ep: 39.2, ek: 0, v: '0' },
  { h: 3.0, y: 150, ep: 29.4, ek: 9.8, v: '4.4' },
  { h: 2.0, y: 222, ep: 19.6, ek: 19.6, v: '6.3' },
  { h: 0.0, y: 294, ep: 0, ek: 39.2, v: '8.9' },
];

export function GpeKeFallingExchange() {
  return (
    <Svg width={W} height={H}>
      <Label x={200} y={24} className="dg-text dg-bold">
        A 1.0 kg ball dropped from 4.0 m
      </Label>

      {/* height scale */}
      <line x1={54} y1={62} x2={54} y2={306} className="dg-muted" />
      {rows.map((r) => (
        <g key={r.h}>
          <line x1={48} y1={r.y} x2={54} y2={r.y} className="dg-muted" />
          <Label x={42} y={r.y} anchor="end" className="dg-text-small dg-text-muted">
            {r.h.toFixed(1)} m
          </Label>
        </g>
      ))}
      <Label x={30} y={186} anchor="middle" className="dg-text-small dg-text-muted">
        height
      </Label>

      {/* balls */}
      {rows.map((r) => (
        <circle key={r.h} cx={92} cy={r.y} r={7} className="dg-dot" />
      ))}
      <line x1={92} y1={78} x2={92} y2={294} className="dg-muted dg-dashed" />

      {/* stacked bars */}
      {rows.map((r) => (
        <g key={r.h}>
          <rect x={BAR_X} y={r.y - 9} width={jpx(r.ep)} height={18} className="dg-fill-accent-2 dg-line" />
          <rect x={BAR_X + jpx(r.ep)} y={r.y - 9} width={jpx(r.ek)} height={18} className="dg-fill-accent dg-line" />
          <Label x={BAR_X + jpx(40) + 10} y={r.y} anchor="start" className="dg-text-small dg-text-muted">
            v = {r.v} m s⁻¹
          </Label>
        </g>
      ))}

      {/* first and last row readings */}
      <Label x={BAR_X + 4} y={78 - 20} anchor="start" className="dg-text-small dg-text-accent-2">
        all 39 J stored, nothing moving
      </Label>
      <Label x={BAR_X + 4} y={294 - 20} anchor="start" className="dg-text-small dg-text-accent">
        all 39 J kinetic, 8.9 m s⁻¹
      </Label>

      {/* legend */}
      <rect x={262} y={330} width={16} height={12} className="dg-fill-accent-2 dg-line" />
      <Label x={286} y={336} anchor="start" className="dg-text-small dg-text-muted">
        gravitational store
      </Label>
      <rect x={430} y={330} width={16} height={12} className="dg-fill-accent dg-line" />
      <Label x={454} y={336} anchor="start" className="dg-text-small dg-text-muted">
        kinetic store
      </Label>
      <MathLabel x={286} y={360} tex="mg\Delta h = \tfrac{1}{2}mv^2" w={200} h={26} anchor="start" />
    </Svg>
  );
}

export default GpeKeFallingExchange;
