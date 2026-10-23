/**
 * A glancing collision between two snooker balls of equal mass (0.17 kg).
 * Velocities to scale (100 px per m s⁻¹), x to the right, y up.
 * Before: the cue ball moves along x at 2.0 m s⁻¹ towards the stationary
 *   object ball (dashed arrow).
 * After: the cue ball moves at 1.0 m s⁻¹ at 60° above the x-axis; the object
 *   ball moves at 1.73 m s⁻¹ at 30° below it. Dashed lines show the
 *   components: x-components 0.50 and 1.50 m s⁻¹ (sum 2.0, as before);
 *   y-components +0.87 and −0.87 m s⁻¹ (sum 0, as before). The two paths are
 *   at 90° to each other.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-linear-momentum-glancing';

const W = 640;
const H = 300;
const K = 100; // px per m s⁻¹
const DEG = Math.PI / 180;

export function LinearMomentumGlancing() {
  const c = { x: 290, y: 130 };
  const cue = { x: c.x + 1.0 * K * Math.cos(60 * DEG), y: c.y - 1.0 * K * Math.sin(60 * DEG) };
  const vo = Math.sqrt(3);
  const obj = { x: c.x + vo * K * Math.cos(30 * DEG), y: c.y + vo * K * Math.sin(30 * DEG) };
  const arc = (r: number, a1: number, a2: number) => {
    const p = { x: c.x + r * Math.cos(a1 * DEG), y: c.y - r * Math.sin(a1 * DEG) };
    const q = { x: c.x + r * Math.cos(a2 * DEG), y: c.y - r * Math.sin(a2 * DEG) };
    return `M${p.x.toFixed(2)},${p.y.toFixed(2)} A${r},${r} 0 0 ${a2 > a1 ? 0 : 1} ${q.x.toFixed(2)},${q.y.toFixed(2)}`;
  };
  return (
    <Svg width={W} height={H}>
      {/* axis through the collision */}
      <line x1={40} y1={c.y} x2={c.x + 170} y2={c.y} className="dg-grid" />
      <Label x={c.x + 176} y={c.y} anchor="start" className="dg-text-small dg-italic">
        x
      </Label>
      {/* before */}
      <circle cx={c.x - 2 * K - 34} cy={c.y} r={11} className="dg-fill-accent dg-accent" />
      <Arrow x1={c.x - 2 * K - 18} y1={c.y} x2={c.x - 18} y2={c.y} className="dg-accent dg-dashed" headClassName="dg-dot-accent" />
      <Label x={c.x - K - 18} y={c.y - 16} className="dg-text-small">
        before: 2.0 m s⁻¹
      </Label>
      <Label x={c.x - 2 * K - 34} y={c.y + 26} className="dg-text-small">
        cue ball
      </Label>
      <circle cx={c.x} cy={c.y} r={11} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={c.x - 6} y={c.y + 28} anchor="end" className="dg-text-small">
        object ball (at rest)
      </Label>

      {/* components */}
      <line x1={cue.x} y1={cue.y} x2={cue.x} y2={c.y} className="dg-muted dg-dashed" />
      <line x1={obj.x} y1={obj.y} x2={obj.x} y2={c.y} className="dg-muted dg-dashed" />
      {/* after */}
      <Arrow x1={c.x} y1={c.y} x2={cue.x} y2={cue.y} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={c.x} y1={c.y} x2={obj.x} y2={obj.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <path d={arc(24, 0, 60)} className="dg-thin" />
      <Label x={c.x + 36 * Math.cos(28 * DEG)} y={c.y - 36 * Math.sin(28 * DEG)} className="dg-text-small">
        60°
      </Label>
      <path d={arc(44, 0, -30)} className="dg-thin" />
      <Label x={c.x + 58 * Math.cos(-15 * DEG)} y={c.y - 58 * Math.sin(-15 * DEG)} className="dg-text-small">
        30°
      </Label>
      <Label x={cue.x + 10} y={cue.y - 6} anchor="start" className="dg-text-accent">
        cue ball: 1.0 m s⁻¹
      </Label>
      <Label x={obj.x + 10} y={obj.y + 4} anchor="start" className="dg-text-accent-2">
        object ball: 1.73 m s⁻¹
      </Label>
      <Label x={cue.x + 6} y={(cue.y + c.y) / 2 + 4} anchor="start" className="dg-text-small dg-text-muted">
        +0.87
      </Label>
      <Label x={obj.x + 6} y={(obj.y + c.y) / 2} anchor="start" className="dg-text-small dg-text-muted">
        −0.87
      </Label>

      {/* bookkeeping */}
      <Label x={W / 2} y={266} className="dg-text-small">
        along x: 2.0 = 1.0 cos 60° + 1.5 → 0.50 + 1.50 = 2.0 ✓
      </Label>
      <Label x={W / 2} y={286} className="dg-text-small">
        along y: 0 = 1.0 sin 60° − 1.73 sin 30° → (+0.87) + (−0.87) = 0 ✓
      </Label>
    </Svg>
  );
}

export default LinearMomentumGlancing;
