/**
 * Momentum and kinetic energy before and after a perfectly inelastic
 * collision: a 2.0 kg trolley at 3.0 m s⁻¹ hits a stationary 1.0 kg trolley
 * and they move off together at 2.0 m s⁻¹.
 * Left bar chart: total momentum 6.0 kg m s⁻¹ before and 6.0 after (same).
 * Right bar chart: total kinetic energy 9.0 J before and 6.0 J after; the
 *   missing 3.0 J is drawn as a dashed outline (transferred to thermal
 *   energy, sound and deformation). Bars to scale on axes from 0 to 10.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-linear-momentum-ke-bars';

const W = 640;
const H = 320;
const Y0 = 262;
const PX = 18; // px per unit
const BW = 64;
const CW = 220; // chart width

function Chart({
  x,
  title,
  unit,
  before,
  after,
  cls,
  note,
}: {
  x: number;
  title: string;
  unit: string;
  before: number;
  after: number;
  cls: string;
  note: string;
}) {
  const b1 = x + 30;
  const b2 = x + 120;
  return (
    <g>
      <Label x={x + CW / 2} y={46} className="dg-text dg-bold">
        {title}
      </Label>
      {[2, 4, 6, 8, 10].map((v) => (
        <line key={v} x1={x} y1={Y0 - v * PX} x2={x + CW} y2={Y0 - v * PX} className="dg-grid" />
      ))}
      <line x1={x} y1={Y0} x2={x + CW} y2={Y0} className="dg-line" />
      <line x1={x} y1={Y0} x2={x} y2={Y0 - 10.4 * PX} className="dg-line" />
      {[0, 2, 4, 6, 8, 10].map((v) => (
        <Label key={v} x={x - 7} y={Y0 - v * PX} anchor="end" className="dg-text-small">
          {v}
        </Label>
      ))}
      <text
        x={x - 30}
        y={Y0 - 5 * PX}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${x - 30} ${Y0 - 5 * PX})`}
        className="dg-text-small dg-italic"
      >
        {unit}
      </text>
      <rect x={b1} y={Y0 - before * PX} width={BW} height={before * PX} className={`${cls}`} />
      <rect x={b2} y={Y0 - after * PX} width={BW} height={after * PX} className={`${cls}`} />
      {after < before && (
        <rect
          x={b2}
          y={Y0 - before * PX}
          width={BW}
          height={(before - after) * PX}
          className="dg-thin dg-dashed"
        />
      )}
      <Label x={b1 + BW / 2} y={Y0 - before * PX - 12} className="dg-text-small dg-bold">
        {before.toFixed(1)}
      </Label>
      <Label x={b2 + BW / 2} y={after < before ? Y0 - after * PX + 14 : Y0 - after * PX - 12} className="dg-text-small dg-bold">
        {after.toFixed(1)}
      </Label>
      <Label x={b1 + BW / 2} y={Y0 + 16} className="dg-text-small">
        before
      </Label>
      <Label x={b2 + BW / 2} y={Y0 + 16} className="dg-text-small">
        after
      </Label>
      <Label x={x + CW / 2} y={Y0 + 42} className="dg-text-small dg-text-muted">
        {note}
      </Label>
    </g>
  );
}

export function LinearMomentumKeBars() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={16} className="dg-text-small">
        2.0 kg at 3.0 m s⁻¹ hits a stationary 1.0 kg trolley; they stick and move at 2.0 m s⁻¹
      </Label>
      <Chart
        x={70}
        title="Total momentum"
        unit="p / kg m s⁻¹"
        before={6}
        after={6}
        cls="dg-fill-accent dg-accent"
        note="conserved: always"
      />
      <Chart
        x={350}
        title="Total kinetic energy"
        unit="Eₖ / J"
        before={9}
        after={6}
        cls="dg-fill-accent-2 dg-accent-2"
        note="not conserved here"
      />
      <Label x={350 + 120 + BW + 8} y={Y0 - 7.5 * PX} anchor="start" className="dg-text-small">
        3.0 J to
      </Label>
      <Label x={350 + 120 + BW + 8} y={Y0 - 7.5 * PX + 15} anchor="start" className="dg-text-small">
        thermal
      </Label>
      <Label x={350 + 120 + BW + 8} y={Y0 - 7.5 * PX + 30} anchor="start" className="dg-text-small">
        energy, sound
      </Label>
    </Svg>
  );
}

export default LinearMomentumKeBars;
