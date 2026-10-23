/**
 * A head-on collision in one dimension, rightwards positive. Velocity arrows
 * drawn to scale (22 px per m s⁻¹).
 * Before: A (0.40 kg) at +5.0 m s⁻¹, B (0.60 kg) at −3.0 m s⁻¹.
 *   Total momentum = 0.40 × 5.0 + 0.60 × (−3.0) = +2.0 − 1.8 = +0.20 kg m s⁻¹.
 * After: A at −2.5 m s⁻¹, B at +2.0 m s⁻¹.
 *   Total momentum = 0.40 × (−2.5) + 0.60 × 2.0 = −1.0 + 1.2 = +0.20 kg m s⁻¹.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-linear-momentum-collision-1d';

const W = 640;
const H = 340;
const K = 22; // px per m s⁻¹
const RA = 16;
const RB = 20;

function Ball({ x, y, r, name, cls }: { x: number; y: number; r: number; name: string; cls: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} className={cls} />
      <Label x={x} y={y + 1} className="dg-text dg-bold">
        {name}
      </Label>
    </g>
  );
}

export function LinearMomentumCollision1d() {
  const y1 = 76;
  const y2 = 228;
  const ax = 200;
  const bx = 440;
  const row = (
    y: number,
    va: number,
    vb: number,
    pa: string,
    pb: string,
    total: string,
  ) => (
    <g>
      <Ball x={ax} y={y} r={RA} name="A" cls="dg-fill-accent dg-accent" />
      <Ball x={bx} y={y} r={RB} name="B" cls="dg-fill-accent-2 dg-accent-2" />
      {[
        { x: ax, r: RA, v: va },
        { x: bx, r: RB, v: vb },
      ].map(({ x, r, v }) => {
        const s = Math.sign(v);
        const x1 = x + s * (r + 4);
        const x2 = x1 + v * K;
        return (
          <g key={x}>
            <Arrow x1={x1} y1={y} x2={x2} y2={y} />
            <Label x={(x1 + x2) / 2} y={y - 24} className="dg-text-small">
              {`${Math.abs(v).toFixed(1)} m s⁻¹`}
            </Label>
          </g>
        );
      })}
      <Label x={ax} y={y + 34} className="dg-text-small">
        0.40 kg
      </Label>
      <Label x={bx} y={y + 38} className="dg-text-small">
        0.60 kg
      </Label>
      <Label x={ax} y={y + 54} className="dg-text-small dg-text-accent">
        {pa}
      </Label>
      <Label x={bx} y={y + 58} className="dg-text-small dg-text-accent-2">
        {pb}
      </Label>
      <Label x={W / 2} y={y + 84} className="dg-text-small dg-bold">
        {total}
      </Label>
    </g>
  );
  return (
    <Svg width={W} height={H}>
      <Arrow x1={470} y1={22} x2={520} y2={22} head={7} className="dg-thin" />
      <Label x={528} y={22} anchor="start" className="dg-text-small">
        positive
      </Label>
      <Label x={30} y={22} anchor="start" className="dg-text dg-bold">
        Before
      </Label>
      {row(y1, 5, -3, 'p = +2.0', 'p = −1.8', 'total p = (+2.0) + (−1.8) = +0.20 kg m s⁻¹')}
      <line x1={20} y1={178} x2={620} y2={178} className="dg-grid" />
      <Label x={30} y={198} anchor="start" className="dg-text dg-bold">
        After
      </Label>
      {row(y2, -2.5, 2, 'p = −1.0', 'p = +1.2', 'total p = (−1.0) + (+1.2) = +0.20 kg m s⁻¹')}
    </Svg>
  );
}

export default LinearMomentumCollision1d;
