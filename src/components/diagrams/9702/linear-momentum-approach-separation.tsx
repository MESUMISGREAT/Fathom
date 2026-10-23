/**
 * An elastic collision in one dimension, rightwards positive. Velocity arrows
 * to scale (18 px per m s⁻¹).
 * Before: A (2.0 kg) at +6.0 m s⁻¹, B (1.0 kg) at rest.
 *   Relative speed of approach = 6.0 − 0 = 6.0 m s⁻¹.
 * After: A at +2.0 m s⁻¹, B at +8.0 m s⁻¹.
 *   Relative speed of separation = 8.0 − 2.0 = 6.0 m s⁻¹.
 * Total momentum 12 kg m s⁻¹ and total kinetic energy 36 J, before and after.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-linear-momentum-approach-separation';

const W = 640;
const H = 300;
const K = 18; // px per m s⁻¹

export function LinearMomentumApproachSeparation() {
  const y1 = 80;
  const y2 = 210;
  const ra = 20;
  const rb = 15;
  return (
    <Svg width={W} height={H}>
      <Arrow x1={470} y1={22} x2={520} y2={22} head={7} className="dg-thin" />
      <Label x={528} y={22} anchor="start" className="dg-text-small">
        positive
      </Label>

      {/* before */}
      <Label x={30} y={22} anchor="start" className="dg-text dg-bold">
        Before
      </Label>
      <circle cx={150} cy={y1} r={ra} className="dg-fill-accent dg-accent" />
      <Label x={150} y={y1 + 1} className="dg-text dg-bold">
        A
      </Label>
      <Arrow x1={150 + ra + 4} y1={y1} x2={150 + ra + 4 + 6 * K} y2={y1} />
      <Label x={150 + ra + 4 + 3 * K} y={y1 - 16} className="dg-text-small">
        6.0 m s⁻¹
      </Label>
      <circle cx={380} cy={y1} r={rb} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={380} y={y1 + 1} className="dg-text dg-bold">
        B
      </Label>
      <Label x={380} y={y1 - 28} className="dg-text-small">
        at rest
      </Label>
      <Label x={150} y={y1 + 36} className="dg-text-small">
        2.0 kg
      </Label>
      <Label x={380} y={y1 + 31} className="dg-text-small">
        1.0 kg
      </Label>
      <Label x={W / 2} y={y1 + 62} className="dg-text-accent">
        relative speed of approach = 6.0 − 0 = 6.0 m s⁻¹
      </Label>

      <line x1={20} y1={162} x2={620} y2={162} className="dg-grid" />

      {/* after */}
      <Label x={30} y={184} anchor="start" className="dg-text dg-bold">
        After
      </Label>
      <circle cx={210} cy={y2} r={ra} className="dg-fill-accent dg-accent" />
      <Label x={210} y={y2 + 1} className="dg-text dg-bold">
        A
      </Label>
      <Arrow x1={210 + ra + 4} y1={y2} x2={210 + ra + 4 + 2 * K} y2={y2} />
      <Label x={210 + ra + 4 + 2 * K + 8} y={y2} anchor="start" className="dg-text-small">
        2.0 m s⁻¹
      </Label>
      <circle cx={420} cy={y2} r={rb} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={420} y={y2 + 1} className="dg-text dg-bold">
        B
      </Label>
      <Arrow x1={420 + rb + 4} y1={y2} x2={420 + rb + 4 + 8 * K} y2={y2} />
      <Label x={420 + rb + 4 + 4 * K} y={y2 - 16} className="dg-text-small">
        8.0 m s⁻¹
      </Label>
      <Label x={W / 2} y={y2 + 52} className="dg-text-accent">
        relative speed of separation = 8.0 − 2.0 = 6.0 m s⁻¹
      </Label>
      <Label x={W / 2} y={y2 + 78} className="dg-text-small dg-text-muted">
        equal, because the collision is elastic (total Eₖ = 36 J before and after)
      </Label>
    </Svg>
  );
}

export default LinearMomentumApproachSeparation;
