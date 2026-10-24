/**
 * Recoil from rest: two ice skaters, 75 kg and 25 kg, push off each other.
 * Before: both at rest, total momentum 0.
 * After: the 25 kg skater moves right at 3.0 m s⁻¹, the 75 kg skater left at
 *   1.0 m s⁻¹. Velocity arrows to scale (40 px per m s⁻¹): 120 px and 40 px.
 *   Momentum arrows to scale (1.6 px per kg m s⁻¹): both 75 kg m s⁻¹, so
 *   equal length and opposite. Total momentum is still 0.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-linear-momentum-recoil';

const W = 640;
const H = 330;
const KV = 40; // px per m s⁻¹
const KP = 1.6; // px per kg m s⁻¹

function Skater({ x, y, s, cls }: { x: number; y: number; s: number; cls: string }) {
  // a simple stick figure standing on the ice at (x, y); s scales its height
  const head = y - 62 * s;
  return (
    <g>
      <circle cx={x} cy={head} r={8 * s} className={`${cls} dg-line`} />
      <line x1={x} y1={head + 8 * s} x2={x} y2={y - 26 * s} className="dg-line" />
      <line x1={x} y1={y - 26 * s} x2={x - 10 * s} y2={y} className="dg-line" />
      <line x1={x} y1={y - 26 * s} x2={x + 10 * s} y2={y} className="dg-line" />
      <line x1={x - 16 * s} y1={y - 44 * s} x2={x + 16 * s} y2={y - 44 * s} className="dg-line" />
    </g>
  );
}

export function LinearMomentumRecoil() {
  const ice1 = 120;
  const ice2 = 262;
  const cx = 320;
  const bigX = cx - 24;
  const smallX = cx + 22;
  return (
    <Svg width={W} height={H}>
      {/* before */}
      <Label x={30} y={22} anchor="start" className="dg-text dg-bold">
        Before: both at rest
      </Label>
      <line x1={40} y1={ice1} x2={600} y2={ice1} className="dg-muted" />
      <Skater x={bigX} y={ice1} s={1.1} cls="dg-fill-accent" />
      <Skater x={smallX} y={ice1} s={0.75} cls="dg-fill-accent-2" />
      <Label x={bigX - 40} y={ice1 - 40} anchor="end" className="dg-text-small">
        75 kg
      </Label>
      <Label x={smallX + 34} y={ice1 - 30} anchor="start" className="dg-text-small">
        25 kg
      </Label>
      <Label x={600} y={ice1 - 60} anchor="end" className="dg-text-small dg-bold">
        total momentum = 0
      </Label>

      <line x1={20} y1={146} x2={620} y2={146} className="dg-grid" />

      {/* after */}
      <Label x={30} y={170} anchor="start" className="dg-text dg-bold">
        After pushing off
      </Label>
      <line x1={40} y1={ice2} x2={600} y2={ice2} className="dg-muted" />
      <Skater x={cx - 70} y={ice2} s={1.1} cls="dg-fill-accent" />
      <Skater x={cx + 70} y={ice2} s={0.75} cls="dg-fill-accent-2" />
      {/* velocity arrows */}
      <Arrow x1={cx - 96} y1={ice2 - 40} x2={cx - 96 - 1.0 * KV} y2={ice2 - 40} />
      <Label x={cx - 96 - 1.0 * KV - 8} y={ice2 - 40} anchor="end" className="dg-text-small">
        v = 1.0 m s⁻¹
      </Label>
      <Arrow x1={cx + 92} y1={ice2 - 34} x2={cx + 92 + 3.0 * KV} y2={ice2 - 34} />
      <Label x={cx + 92 + 3.0 * KV + 8} y={ice2 - 34} anchor="start" className="dg-text-small">
        v = 3.0 m s⁻¹
      </Label>
      {/* momentum arrows */}
      <Arrow x1={cx - 4} y1={ice2 + 26} x2={cx - 4 - 75 * KP} y2={ice2 + 26} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={cx + 4} y1={ice2 + 26} x2={cx + 4 + 75 * KP} y2={ice2 + 26} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={cx - 4 - 75 * KP - 8} y={ice2 + 26} anchor="end" className="dg-text-small dg-text-accent">
        p = −75 kg m s⁻¹
      </Label>
      <Label x={cx + 4 + 75 * KP + 8} y={ice2 + 26} anchor="start" className="dg-text-small dg-text-accent-2">
        p = +75 kg m s⁻¹
      </Label>
      <Label x={cx} y={ice2 + 50} className="dg-text-small dg-bold">
        total momentum = (−75) + (+75) = 0 still
      </Label>
    </Svg>
  );
}

export default LinearMomentumRecoil;
