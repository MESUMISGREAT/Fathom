/**
 * The resultant force and the acceleration always point the same way.
 * Left, "Speeding up": a 10 kg crate pushed with 50 N against 20 N of
 *   friction. Forces drawn to scale (2 px per N): the resultant is 30 N to the
 *   right, so a = 3.0 m s⁻² to the right.
 * Right, "Braking": a 1200 kg car moving to the right (dashed velocity arrow)
 *   with a 6000 N braking force to the left. The resultant force and the
 *   acceleration (5.0 m s⁻²) point to the left, against the motion.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-force-direction';

const W = 640;
const H = 300;

function Velocity({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const dir = Math.sign(x2 - x1);
  return (
    <g>
      <line x1={x1} y1={y} x2={x2 - dir * 8} y2={y} className="dg-muted dg-dashed" />
      <path d={`M${x2},${y} L${x2 - dir * 10},${y - 5.5} L${x2 - dir * 10},${y + 5.5} Z`} className="dg-dot" />
    </g>
  );
}

export function MomentumNewtonForceDirection() {
  // ---- left: crate ----
  const floor = 150;
  const cx = 130;
  const cy = floor - 30;
  const k = 2; // px per newton

  // ---- right: braking car ----
  const road = 150;
  const carL = 470;
  const carR = 570;
  const carC = (carL + carR) / 2;
  const carY = road - 22;
  const kb = 0.012; // px per newton for the car

  const rowF = 200; // resultant force row
  const rowA = 244; // acceleration row

  return (
    <Svg width={W} height={H}>
      <Label x={160} y={20} className="dg-text dg-bold">
        Speeding up
      </Label>
      <Label x={480} y={20} className="dg-text dg-bold">
        Braking
      </Label>
      <line x1={320} y1={34} x2={320} y2={262} className="dg-grid" />

      {/* ================= left ================= */}
      <line x1={30} y1={floor} x2={300} y2={floor} className="dg-line" />
      {Array.from({ length: 13 }, (_, i) => 36 + i * 21).map((x) => (
        <line key={x} x1={x} y1={floor} x2={x - 8} y2={floor + 8} className="dg-thin" />
      ))}
      <rect x={cx - 40} y={floor - 60} width={80} height={60} className="dg-fill-accent dg-accent" />
      <Label x={cx} y={floor - 46} className="dg-text-small">
        m = 10 kg
      </Label>
      <Arrow x1={cx} y1={cy} x2={cx + 50 * k} y2={cy} />
      <Arrow x1={cx} y1={cy} x2={cx - 20 * k} y2={cy} />
      <circle cx={cx} cy={cy} r={3} className="dg-dot" />
      <Label x={cx + 50 * k + 8} y={cy - 12} anchor="start" className="dg-text-small dg-bold">
        push
      </Label>
      <Label x={cx + 50 * k + 8} y={cy + 4} anchor="start" className="dg-text-small">
        50 N
      </Label>
      <Label x={cx - 20 * k - 8} y={cy - 12} anchor="end" className="dg-text-small dg-bold">
        friction
      </Label>
      <Label x={cx - 20 * k - 8} y={cy + 4} anchor="end" className="dg-text-small">
        20 N
      </Label>
      <Arrow x1={cx} y1={rowF} x2={cx + 30 * k} y2={rowF} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={cx - 10} y={rowF} anchor="end" className="dg-text-small dg-text-accent-2">
        resultant
      </Label>
      <Label x={cx + 30 * k + 8} y={rowF} anchor="start" className="dg-text-small dg-text-accent-2">
        50 − 20 = 30 N
      </Label>
      <Arrow x1={cx} y1={rowA} x2={cx + 60} y2={rowA} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={cx - 10} y={rowA} anchor="end" className="dg-text-small dg-text-accent">
        a
      </Label>
      <Label x={cx + 68} y={rowA} anchor="start" className="dg-text-small dg-text-accent">
        30 ÷ 10 = 3.0 m s⁻²
      </Label>
      <Label x={160} y={280} className="dg-text-small dg-text-muted">
        moving right, accelerating right
      </Label>

      {/* ================= right ================= */}
      <line x1={350} y1={road} x2={620} y2={road} className="dg-line" />
      <path
        d={`M${carL},${road - 12} L${carL},${carY - 12} L${carL + 18},${carY - 16} L${carL + 32},${carY - 38} L${carR - 30},${carY - 38} L${carR - 12},${carY - 16} L${carR},${carY - 12} L${carR},${road - 12} Z`}
        className="dg-fill-accent dg-accent"
      />
      <circle cx={carL + 22} cy={road - 10} r={10} className="dg-fill-muted dg-line" />
      <circle cx={carR - 22} cy={road - 10} r={10} className="dg-fill-muted dg-line" />
      <Label x={carC} y={carY - 26} className="dg-text-small">
        1200 kg
      </Label>
      <Velocity x1={carL} x2={carR + 44} y={58} />
      <Label x={carR + 52} y={58} anchor="start" className="dg-text-small">
        v
      </Label>
      <Label x={carC + 20} y={40} className="dg-text-small dg-text-muted">
        still moving forwards
      </Label>
      <Arrow x1={carC} y1={carY - 6} x2={carC - 6000 * kb} y2={carY - 6} />
      <circle cx={carC} cy={carY - 6} r={3} className="dg-dot" />
      <Label x={carC - 6000 * kb - 8} y={carY - 16} anchor="end" className="dg-text-small dg-bold">
        braking
      </Label>
      <Label x={carC - 6000 * kb - 8} y={carY} anchor="end" className="dg-text-small">
        6000 N
      </Label>
      <Arrow x1={600} y1={rowF} x2={600 - 6000 * kb} y2={rowF} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={600 - 6000 * kb - 10} y={rowF} anchor="end" className="dg-text-small dg-text-accent-2">
        resultant 6000 N
      </Label>
      <Arrow x1={600} y1={rowA} x2={540} y2={rowA} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={530} y={rowA - 9} anchor="end" className="dg-text-small dg-text-accent">
        a = 6000 ÷ 1200
      </Label>
      <Label x={530} y={rowA + 9} anchor="end" className="dg-text-small dg-text-accent">
        = 5.0 m s⁻²
      </Label>
      <Label x={480} y={280} className="dg-text-small dg-text-muted">
        moving right, accelerating left
      </Label>
    </Svg>
  );
}

export default MomentumNewtonForceDirection;
