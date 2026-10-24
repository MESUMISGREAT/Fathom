/**
 * The moment of a force (outcome 4.1.2).
 * Left: a spanner on a nut. F pushes at right angles to the handle; its line of action is dashed and
 *   d is the perpendicular distance from the pivot (the nut) to that line. Moment = F × d.
 * Right: a door seen from above, drawn to scale (275 px per metre, door 0.80 m wide). Three 20 N
 *   pushes: A at 0.80 m from the hinge (16 N m), B at 0.20 m (4.0 N m) and C along the door,
 *   aimed at the hinge, whose line of action passes through the hinge (0 N m).
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';
import { Dimension } from './turning-effects-kit';

export const diagramKey = 'phys-turning-effects-spanner-door';

const W = 640;
const H = 280;
const PX = 275; // px per metre for the door

export function TurningEffectsSpannerDoor() {
  // ---- left: spanner ----
  const P = { x: 60, y: 150 };
  const end = 250;
  const hex = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(P.x + 15 * Math.cos(a)).toFixed(1)},${(P.y + 15 * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

  // ---- right: door from above ----
  const hinge = { x: 360, y: 150 };
  const xA = hinge.x + 0.8 * PX;
  const xB = hinge.x + 0.2 * PX;

  return (
    <Svg width={W} height={H}>
      {/* ================= left ================= */}
      <Label x={150} y={22} className="dg-text dg-bold">
        A spanner on a nut
      </Label>
      <line x1={end} y1={40} x2={end} y2={232} className="dg-muted dg-dashed" />
      <Label x={end + 8} y={226} anchor="start" className="dg-text-small dg-text-muted">
        line of action
      </Label>
      <rect x={70} y={141} width={196} height={18} rx={6} className="dg-fill-accent dg-accent" />
      <circle cx={P.x} cy={P.y} r={27} className="dg-fill-accent dg-accent" />
      <polygon points={hex} className="dg-fill-muted dg-line" />
      <circle cx={P.x} cy={P.y} r={3} className="dg-dot" />
      <Label x={P.x} y={108} className="dg-text-small">
        pivot
      </Label>
      <Arrow x1={end} y1={66} x2={end} y2={140} head={11} />
      <Label x={end - 10} y={86} anchor="end" className="dg-text dg-bold">
        F
      </Label>
      <line x1={P.x} y1={180} x2={P.x} y2={212} className="dg-muted dg-dashed" />
      <Dimension a={{ x: P.x, y: 202 }} b={{ x: end, y: 202 }} />
      <Label x={(P.x + end) / 2} y={218} className="dg-text dg-italic">
        d
      </Label>
      <MathLabel x={150} y={256} w={240} h={30} tex="\text{moment} = F \times d" />

      {/* ================= right ================= */}
      <Label x={490} y={22} className="dg-text dg-bold">
        A door, seen from above
      </Label>
      <Label x={490} y={42} className="dg-text-muted">
        every push is 20 N
      </Label>
      <rect x={hinge.x} y={145} width={0.8 * PX + 4} height={10} className="dg-fill-muted dg-line" />
      <circle cx={hinge.x} cy={hinge.y} r={5} className="dg-dot" />
      <Label x={hinge.x} y={172} className="dg-text-small">
        hinge
      </Label>
      <Arrow x1={xA} y1={72} x2={xA} y2={144} head={11} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={xA - 10} y={84} anchor="end" className="dg-text dg-bold">
        A
      </Label>
      <Arrow x1={xB} y1={72} x2={xB} y2={144} head={11} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={xB - 10} y={84} anchor="end" className="dg-text dg-bold">
        B
      </Label>
      <Arrow x1={636} y1={hinge.y} x2={xA + 6} y2={hinge.y} head={11} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={620} y={132} className="dg-text dg-bold">
        C
      </Label>
      <Label x={345} y={202} anchor="start" className="dg-text-small">
        A: 20 N × 0.80 m = 16 N m
      </Label>
      <Label x={345} y={224} anchor="start" className="dg-text-small">
        B: 20 N × 0.20 m = 4.0 N m
      </Label>
      <Label x={345} y={246} anchor="start" className="dg-text-small">
        C: aimed at the hinge, so d = 0 and the moment is 0
      </Label>
    </Svg>
  );
}

export default TurningEffectsSpannerDoor;
