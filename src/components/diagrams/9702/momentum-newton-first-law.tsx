/**
 * Newton's first law in three pictures. In every panel the resultant force is
 * zero, so the velocity does not change.
 * Left: a book at rest on a table. Its weight W (down) and the normal contact
 *   force N from the table (up) are equal, so it stays at rest.
 * Middle: a car cruising at a constant 30 m s⁻¹. The forward driving force
 *   (600 N) equals the backward drag + friction (600 N); its weight and the
 *   contact force from the road balance too.
 * Right: a space probe far from any star or planet, with no forces on it.
 *   Its positions at equal time intervals are equally spaced along a straight
 *   line: constant velocity.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-first-law';

const W = 640;
const H = 290;

export function MomentumNewtonFirstLaw() {
  // ---- left: book on a table ----
  const bx = 107;
  const bookTop = 150;
  const bookH = 24;
  const tableTop = bookTop + bookH;
  const by = bookTop + bookH / 2;
  const F = 58; // both arrows the same length: equal forces

  // ---- middle: car at constant velocity ----
  const road = 196;
  const carL = 282;
  const carR = 362;
  const carY = 170; // line of action of the horizontal forces
  const D = 52; // 600 N drawn to the same length both ways

  // ---- right: probe drifting at constant velocity ----
  const py = 160;
  const xs = [452, 488, 524, 560, 596];

  return (
    <Svg width={W} height={H}>
      {/* panel titles */}
      <Label x={107} y={22} className="dg-text dg-bold">
        At rest
      </Label>
      <Label x={322} y={22} className="dg-text dg-bold">
        Constant velocity
      </Label>
      <Label x={530} y={22} className="dg-text dg-bold">
        No forces at all
      </Label>
      <line x1={214} y1={40} x2={214} y2={232} className="dg-grid" />
      <line x1={428} y1={40} x2={428} y2={232} className="dg-grid" />

      {/* ================= left ================= */}
      <rect x={34} y={tableTop} width={146} height={9} className="dg-fill-muted dg-thin" />
      <line x1={48} y1={tableTop + 9} x2={48} y2={232} className="dg-line" />
      <line x1={166} y1={tableTop + 9} x2={166} y2={232} className="dg-line" />
      <rect x={bx - 26} y={bookTop} width={52} height={bookH} className="dg-fill-accent dg-accent" />
      <Arrow x1={bx} y1={by} x2={bx} y2={by - F} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={bx} y1={by} x2={bx} y2={by + F} />
      <circle cx={bx} cy={by} r={3} className="dg-dot" />
      <Label x={bx + 10} y={by - 52} anchor="start" className="dg-text-accent-2">
        N
      </Label>
      <Label x={bx + 10} y={by - 34} anchor="start" className="dg-text-small">
        contact force
      </Label>
      <Label x={bx + 10} y={by + 52} anchor="start" className="dg-text dg-bold">
        W
      </Label>
      <Label x={bx - 12} y={by + 52} anchor="end" className="dg-text-small">
        weight
      </Label>

      {/* ================= middle ================= */}
      <line x1={226} y1={road} x2={418} y2={road} className="dg-line" />
      <path
        d={`M${carL},${road - 12} L${carL},${carY - 12} L${carL + 16},${carY - 14} L${carL + 26},${carY - 34} L${carR - 24},${carY - 34} L${carR - 10},${carY - 14} L${carR},${carY - 10} L${carR},${road - 12} Z`}
        className="dg-fill-accent dg-accent"
      />
      <circle cx={carL + 18} cy={road - 10} r={10} className="dg-fill-muted dg-line" />
      <circle cx={carR - 18} cy={road - 10} r={10} className="dg-fill-muted dg-line" />
      <Arrow x1={carR} y1={carY} x2={carR + D} y2={carY} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={carL} y1={carY} x2={carL - D} y2={carY} />
      <Label x={carR + D / 2 + 2} y={carY - 16} className="dg-text-small dg-text-accent-2">
        600 N
      </Label>
      <Label x={carL - D / 2 - 2} y={carY - 16} className="dg-text-small dg-bold">
        600 N
      </Label>
      <Label x={420} y={road + 16} anchor="end" className="dg-text-small">
        driving force
      </Label>
      <Label x={224} y={road + 16} anchor="start" className="dg-text-small">
        drag + friction
      </Label>
      {/* velocity: not a force, so drawn dashed and off the car */}
      <line x1={carL + 2} y1={92} x2={carR - 10} y2={92} className="dg-muted dg-dashed" />
      <path d={`M${carR - 2},92 L${carR - 12},86.5 L${carR - 12},97.5 Z`} className="dg-dot" />
      <Label x={(carL + carR) / 2} y={74} className="dg-text-small">
        v = 30 m s⁻¹, steady
      </Label>
      <Label x={322} y={road + 34} className="dg-text-small dg-text-muted">
        (vertical forces balance too)
      </Label>

      {/* ================= right ================= */}
      {xs.map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={py} r={9} className={i === xs.length - 1 ? 'dg-fill-accent dg-accent' : 'dg-muted dg-dashed'} />
          <Label x={x} y={py + 24} className="dg-text-small dg-text-muted">
            {`${i}`}
          </Label>
        </g>
      ))}
      {xs.slice(0, -1).map((x, i) => (
        <Arrow key={x} x1={x + 2} y1={py - 24} x2={xs[i + 1]! - 2} y2={py - 24} head={6} className="dg-thin" double />
      ))}
      <Label x={524} y={py - 44} className="dg-text-small">
        equal gaps
      </Label>
      <Label x={524} y={py + 42} className="dg-text-small dg-text-muted">
        position every 1 s
      </Label>
      <Label x={530} y={92} className="dg-text-small">
        far from any star or planet
      </Label>

      {/* verdicts */}
      <Label x={107} y={262} className="dg-text-small dg-bold">
        resultant force = 0
      </Label>
      <Label x={107} y={278} className="dg-text-small">
        so it stays at rest
      </Label>
      <Label x={322} y={262} className="dg-text-small dg-bold">
        resultant force = 0
      </Label>
      <Label x={322} y={278} className="dg-text-small">
        so its velocity stays the same
      </Label>
      <Label x={530} y={262} className="dg-text-small dg-bold">
        resultant force = 0
      </Label>
      <Label x={530} y={278} className="dg-text-small">
        so it coasts in a straight line
      </Label>
    </Svg>
  );
}

export default MomentumNewtonFirstLaw;
