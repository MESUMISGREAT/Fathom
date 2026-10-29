/**
 * A 2 kg trolley moving at 3 m/s hits a stationary 4 kg trolley and they move
 * off together. Momentum before: 2(3) + 4(0) = 6 kg m s^-1.
 * Momentum after: 6v, so v = 1 m/s in the original direction.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'mech-momentum-collision';

const W = 660;
const H = 330;

export function MechMomentumCollision() {
  return (
    <Svg width={W} height={H}>
      <Label x={330} y={30} className="dg-text dg-bold">
        They coalesce: total momentum is conserved
      </Label>

      <Label x={40} y={98} anchor="start" className="dg-text-small dg-text-muted">
        before
      </Label>
      <rect x={90} y={78} width={100} height={52} rx={8} className="dg-fill-accent dg-thin" />
      <Label x={140} y={104} className="dg-text-small dg-bold">
        A: 2 kg
      </Label>

      <Arrow x1={196} y1={104} x2={268} y2={104} />
      <Label x={232} y={84} className="dg-text-small dg-text-accent">
        3 m s⁻¹
      </Label>

      <rect x={300} y={78} width={100} height={52} rx={8} className="dg-fill-muted dg-thin" />
      <Label x={350} y={104} className="dg-text-small dg-bold">
        B: 4 kg
      </Label>
      <Label x={350} y={150} className="dg-text-small dg-text-muted">
        at rest
      </Label>

      <Label x={470} y={104} anchor="start" className="dg-text-small dg-text-muted">
        p = 2 × 3 + 4 × 0
      </Label>
      <Label x={470} y={126} anchor="start" className="dg-text-small dg-text-muted">
        = 6 kg m s⁻¹
      </Label>

      <line x1={40} y1={178} x2={620} y2={178} className="dg-grid" />

      <Label x={40} y={252} anchor="start" className="dg-text-small dg-text-muted">
        after
      </Label>
      <rect x={230} y={226} width={140} height={52} rx={8} className="dg-fill-accent-2 dg-thin" />
      <Label x={300} y={252} className="dg-text-small dg-bold">
        A + B: 6 kg
      </Label>

      <Arrow x1={376} y1={252} x2={448} y2={252} className="dg-accent-2" headClassName="dg-dot-accent" />
      <Label x={412} y={232} className="dg-text-small dg-text-accent-2">
        1 m s⁻¹
      </Label>

      <Label x={470} y={246} anchor="start" className="dg-text-small dg-text-muted">
        6v = 6 so v = 1 m s⁻¹
      </Label>
      <Label x={470} y={268} anchor="start" className="dg-text-small dg-text-muted">
        (same direction)
      </Label>

      <Label x={330} y={306} className="dg-text-small dg-text-muted">
        Momentum is a vector: a velocity to the left would enter the sum with a minus sign.
      </Label>
    </Svg>
  );
}

export default MechMomentumCollision;
