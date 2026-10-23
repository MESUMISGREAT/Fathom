/**
 * The two resistive forces of topic 3.2.
 * Left top: a block sliding to the right on a rough floor while being pulled.
 *   Friction acts on the block along the contact surface, opposite to the
 *   sliding (velocity) direction.
 * Left bottom: a ball moving to the right through air. Drag (air resistance)
 *   acts on it opposite to its velocity relative to the air.
 * Right: the simple model used at AS Level, drawn qualitatively. Drag is zero
 *   at zero speed and increases as speed increases (plotted here as D ∝ v²,
 *   a typical shape for everyday objects in air). Sliding friction is roughly
 *   constant, whatever the speed.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-non-uniform-resistive-forces';

const W = 640;
const H = 320;

// graph frame (screen coordinates)
const GX0 = 380;
const GX1 = 612;
const GY0 = 262;
const GY1 = 62;
const VMAX = 10;
const FMAX = 10;
const gx = (v: number) => GX0 + (v / VMAX) * (GX1 - GX0);
const gy = (f: number) => GY0 - (f / FMAX) * (GY0 - GY1);
const drag = (v: number) => 0.09 * v * v; // illustrative D = k v²
const FRICTION = 3;

export function NonUniformResistiveForces() {
  let dragPath = '';
  for (let i = 0; i <= 100; i++) {
    const v = (VMAX * i) / 100;
    dragPath += `${i === 0 ? 'M' : 'L'}${gx(v).toFixed(2)},${gy(drag(v)).toFixed(2)} `;
  }
  // block
  const floor = 132;
  const bx = 120;
  const bw = 84;
  const bh = 48;
  // ball
  const cx = 162;
  const cy = 252;
  const r = 20;
  const air: [number, number][] = [];
  for (let i = 0; i < 9; i++) for (const y of [224, 280]) air.push([40 + i * 30 + (y === 280 ? 15 : 0), y]);
  return (
    <Svg width={W} height={H}>
      {/* ---------- friction ---------- */}
      <Label x={150} y={20} className="dg-text dg-bold">
        Friction: surfaces in contact
      </Label>
      <line x1={24} y1={floor} x2={296} y2={floor} className="dg-line" />
      {Array.from({ length: 14 }, (_, i) => 30 + i * 20).map((x) => (
        <line key={x} x1={x} y1={floor} x2={x - 10} y2={floor + 10} className="dg-thin" />
      ))}
      <rect x={bx} y={floor - bh} width={bw} height={bh} className="dg-fill-muted dg-line" />
      <Arrow x1={bx + 22} y1={62} x2={bx + 66} y2={62} head={8} className="dg-thin" />
      <Label x={bx + 44} y={48} className="dg-text-small dg-italic">
        sliding this way
      </Label>
      <Arrow x1={bx + bw} y1={floor - bh / 2} x2={bx + bw + 70} y2={floor - bh / 2} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={bx + bw + 40} y={floor - bh / 2 - 14} className="dg-text-small">
        pull
      </Label>
      <Arrow x1={bx + 10} y1={floor - 5} x2={bx - 58} y2={floor - 5} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={bx - 34} y={floor - 20} className="dg-text-accent-2">
        friction
      </Label>
      <Label x={150} y={160} className="dg-text-small dg-text-muted">
        acts along the surface, opposing the sliding
      </Label>

      {/* ---------- drag ---------- */}
      <line x1={20} y1={186} x2={300} y2={186} className="dg-grid" />
      <Label x={150} y={200} className="dg-text dg-bold">
        Drag: moving through a fluid
      </Label>
      {air
        .filter(([x, y]) => Math.hypot(x - cx, y - cy) > r + 12)
        .map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={2} className="dg-fill-muted dg-muted" />
        ))}
      <circle cx={cx} cy={cy} r={r} className="dg-fill-accent dg-accent" />
      <Arrow x1={cx + r + 4} y1={cy} x2={cx + r + 64} y2={cy} head={8} className="dg-thin" />
      <Label x={cx + r + 72} y={cy} anchor="start" className="dg-text-small dg-italic">
        v
      </Label>
      <Arrow x1={cx - r} y1={cy} x2={cx - r - 70} y2={cy} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={cx - r - 40} y={cy + 18} className="dg-text-accent-2">
        drag
      </Label>
      <Label x={150} y={304} className="dg-text-small dg-text-muted">
        air resistance is drag in air; acts opposite to v
      </Label>

      {/* ---------- graph ---------- */}
      <Label x={(GX0 + GX1) / 2} y={20} className="dg-text dg-bold">
        The simple model
      </Label>
      <line x1={GX0} y1={GY0} x2={GX1 + 6} y2={GY0} className="dg-line" />
      <line x1={GX0} y1={GY0} x2={GX0} y2={GY1 - 14} className="dg-line" />
      <path d={`M${gx(0)},${gy(FRICTION)} L${gx(VMAX)},${gy(FRICTION)}`} className="dg-accent-2 dg-dashed" />
      <path d={dragPath} className="dg-accent" />
      <circle cx={gx(0)} cy={gy(0)} r={4} className="dg-dot-accent" />
      <Label x={gx(8.1)} y={gy(7.6)} anchor="end" className="dg-text-accent">
        drag
      </Label>
      <Label x={gx(8.1)} y={gy(7.6) + 18} anchor="end" className="dg-text-small">
        grows as speed grows
      </Label>
      <Label x={gx(9.9)} y={gy(FRICTION) - 30} anchor="end" className="dg-text-accent-2">
        sliding friction
      </Label>
      <Label x={gx(9.9)} y={gy(FRICTION) - 13} anchor="end" className="dg-text-small">
        roughly constant
      </Label>
      <Label x={GX0 - 4} y={GY0 + 20} anchor="start" className="dg-text-small">
        drag = 0 when speed = 0
      </Label>
      <Label x={GX1 + 6} y={GY0 + 20} anchor="end" className="dg-text-small dg-italic">
        speed
      </Label>
      <text
        x={GX0 - 16}
        y={(GY0 + GY1) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${GX0 - 16} ${(GY0 + GY1) / 2})`}
        className="dg-text-small dg-italic"
      >
        resistive force
      </text>
      <Label x={(GX0 + GX1) / 2} y={GY0 + 42} className="dg-text-small dg-text-muted">
        (shapes only, no scale)
      </Label>
    </Svg>
  );
}

export default NonUniformResistiveForces;
