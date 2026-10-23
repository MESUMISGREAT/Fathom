/**
 * Change in momentum of a 0.20 kg ball that hits a wall at 15 m s⁻¹ and
 * rebounds at 10 m s⁻¹ along the same line, towards the wall positive.
 * Momentum arrows to scale (40 px per kg m s⁻¹):
 *   before: +3.0 kg m s⁻¹ (towards the wall);
 *   after: −2.0 kg m s⁻¹ (away from the wall);
 *   Δp = p_after − p_before = −2.0 − (+3.0) = −5.0 kg m s⁻¹, built tip to tail
 *   as (−p_before) + p_after: 5.0 kg m s⁻¹ away from the wall.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-rebound';

const W = 620;
const H = 320;
const K = 40; // px per kg m s⁻¹

export function MomentumNewtonRebound() {
  const wall = 560;
  const ball = wall - 14;
  const r = 12;
  const y1 = 70;
  const y2 = 150;
  const y3 = 240;
  const start = 520; // Δp construction starts here
  return (
    <Svg width={W} height={H}>
      {/* wall */}
      <rect x={wall} y={36} width={16} height={146} className="dg-fill-muted dg-thin" />
      {Array.from({ length: 7 }, (_, i) => 44 + i * 20).map((y) => (
        <line key={y} x1={wall + 16} y1={y} x2={wall + 26} y2={y - 10} className="dg-thin" />
      ))}
      {/* sign convention */}
      <Arrow x1={30} y1={24} x2={80} y2={24} head={7} className="dg-thin" />
      <Label x={88} y={24} anchor="start" className="dg-text-small">
        positive direction: towards the wall
      </Label>

      {/* before */}
      <Label x={30} y={y1} anchor="start" className="dg-text dg-bold">
        Before
      </Label>
      <circle cx={ball} cy={y1} r={r} className="dg-fill-accent dg-accent" />
      <Arrow x1={ball - r - 3 * K} y1={y1} x2={ball - r} y2={y1} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={ball - r - 1.5 * K} y={y1 - 16} className="dg-text-small">
        15 m s⁻¹
      </Label>
      <Label x={ball - r - 3 * K - 10} y={y1} anchor="end" className="dg-text-small dg-text-accent-2">
        p = 0.20 × (+15) = +3.0 kg m s⁻¹
      </Label>

      {/* after */}
      <Label x={30} y={y2} anchor="start" className="dg-text dg-bold">
        After
      </Label>
      <circle cx={ball} cy={y2} r={r} className="dg-fill-accent dg-accent" />
      <Arrow x1={ball - r} y1={y2} x2={ball - r - 2 * K} y2={y2} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={ball - r - 1 * K} y={y2 - 16} className="dg-text-small">
        10 m s⁻¹
      </Label>
      <Label x={ball - r - 2 * K - 10} y={y2} anchor="end" className="dg-text-small dg-text-accent">
        p = 0.20 × (−10) = −2.0 kg m s⁻¹
      </Label>

      {/* change in momentum, tip to tail */}
      <line x1={20} y1={190} x2={600} y2={190} className="dg-grid" />
      <Label x={30} y={212} anchor="start" className="dg-text dg-bold">
        Change in momentum
      </Label>
      <Arrow x1={start} y1={y3} x2={start - 3 * K} y2={y3} className="dg-accent-2 dg-dashed" headClassName="dg-dot-accent-2" />
      <Arrow x1={start - 3 * K} y1={y3} x2={start - 5 * K} y2={y3} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={start - 1.5 * K} y={y3 - 14} className="dg-text-small dg-text-accent-2">
        − p before
      </Label>
      <Label x={start - 4 * K} y={y3 - 14} className="dg-text-small dg-text-accent">
        + p after
      </Label>
      <Arrow x1={start} y1={y3 + 26} x2={start - 5 * K} y2={y3 + 26} head={11} />
      <Label x={start - 5 * K - 10} y={y3 + 26} anchor="end" className="dg-text dg-bold">
        Δp
      </Label>
      <Label x={start - 2.5 * K} y={y3 + 46} className="dg-text-small">
        Δp = (−2.0) − (+3.0) = −5.0 kg m s⁻¹
      </Label>
      <Label x={start - 2.5 * K} y={y3 + 64} className="dg-text-small dg-text-muted">
        5.0 kg m s⁻¹ away from the wall (not 3.0 − 2.0 = 1.0)
      </Label>
    </Svg>
  );
}

export default MomentumNewtonRebound;
