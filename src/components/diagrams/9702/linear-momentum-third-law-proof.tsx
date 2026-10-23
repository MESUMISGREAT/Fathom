/**
 * Why momentum is conserved. Top: trolley A (moving right) pushes on
 * trolley B during a collision; by Newton's third law B pushes back on A with
 * an equal and opposite force (rightwards positive).
 * Bottom: force–time graph during the contact time Δt. The force on B is
 * F(t) = F_max sin²(π t / Δt) (positive); the force on A is its mirror image
 * −F(t). The areas are equal in size and opposite in sign, so
 * Δp_B = +area, Δp_A = −area and the total change in momentum is zero.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-linear-momentum-third-law-proof';

const W = 640;
const H = 380;

function Trolley({ x, y, w, label, cls }: { x: number; y: number; w: number; label: string; cls: string }) {
  return (
    <g>
      <rect x={x} y={y - 34} width={w} height={34} rx={4} className={`${cls} dg-line`} />
      <circle cx={x + 16} cy={y + 7} r={7} className="dg-fill-surface dg-line" />
      <circle cx={x + w - 16} cy={y + 7} r={7} className="dg-fill-surface dg-line" />
      <Label x={x + w / 2} y={y - 17} className="dg-text dg-bold">
        {label}
      </Label>
    </g>
  );
}

export function LinearMomentumThirdLawProof() {
  const track = 112;
  const contact = 320;
  // graph
  const X0 = 90;
  const X1 = 560;
  const Y0 = 278; // force = 0
  const A = 70; // F_max in px
  const t0 = 150;
  const t1 = 470;
  const f = (x: number) => Math.sin((Math.PI * (x - t0)) / (t1 - t0)) ** 2;
  let up = `M${t0},${Y0}`;
  let dn = `M${t0},${Y0}`;
  for (let i = 0; i <= 120; i++) {
    const x = t0 + ((t1 - t0) * i) / 120;
    up += ` L${x.toFixed(2)},${(Y0 - A * f(x)).toFixed(2)}`;
    dn += ` L${x.toFixed(2)},${(Y0 + A * f(x)).toFixed(2)}`;
  }
  const upLine = `M${X0},${Y0} L${t0},${Y0}` + up.slice(up.indexOf(' ')) + ` L${X1},${Y0}`;
  const dnLine = `M${X0},${Y0} L${t0},${Y0}` + dn.slice(dn.indexOf(' ')) + ` L${X1},${Y0}`;
  return (
    <Svg width={W} height={H}>
      {/* ---------- trolleys ---------- */}
      <Label x={W / 2} y={16} className="dg-text dg-bold">
        During the collision
      </Label>
      <line x1={60} y1={track + 14} x2={580} y2={track + 14} className="dg-thin" />
      <Trolley x={contact - 130} y={track} w={130} label="A" cls="dg-fill-accent" />
      <Trolley x={contact} y={track} w={130} label="B" cls="dg-fill-accent-2" />
      <Arrow x1={contact + 4} y1={track - 46} x2={contact + 90} y2={track - 46} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={contact + 98} y={track - 46} anchor="start" className="dg-text-small">
        force on B by A = +F
      </Label>
      <Arrow x1={contact - 4} y1={track - 46} x2={contact - 90} y2={track - 46} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={contact - 98} y={track - 46} anchor="end" className="dg-text-small">
        force on A by B = −F
      </Label>
      <Label x={W / 2} y={track + 34} className="dg-text-small dg-text-muted">
        Newton&apos;s third law: equal size, opposite direction, same contact time
      </Label>

      {/* ---------- force–time graph ---------- */}
      <path d={`${up} L${t1},${Y0} Z`} className="dg-fill-accent" />
      <path d={`${dn} L${t1},${Y0} Z`} className="dg-fill-accent-2" />
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} className="dg-line" />
      <line x1={X0} y1={Y0 + 86} x2={X0} y2={Y0 - 92} className="dg-line" />
      <path d={upLine} className="dg-accent" />
      <path d={dnLine} className="dg-accent-2" />
      <Label x={X1 + 4} y={Y0 - 12} anchor="end" className="dg-text-small dg-italic">
        time
      </Label>
      <text
        x={X0 - 16}
        y={Y0}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${X0 - 16} ${Y0})`}
        className="dg-text-small dg-italic"
      >
        force (right +)
      </text>
      <Label x={(t0 + t1) / 2} y={Y0 - 26} className="dg-text-small">
        Δp of B = + area
      </Label>
      <Label x={(t0 + t1) / 2} y={Y0 + 26} className="dg-text-small">
        Δp of A = − area
      </Label>
      <Label x={(t0 + t1) / 2 + 150} y={Y0 - 56} anchor="start" className="dg-text-accent">
        on B
      </Label>
      <Label x={(t0 + t1) / 2 + 150} y={Y0 + 56} anchor="start" className="dg-text-accent-2">
        on A
      </Label>
      <Arrow x1={t0} y1={Y0 + 98} x2={t1} y2={Y0 + 98} head={7} className="dg-thin" double />
      <Label x={(t0 + t1) / 2} y={Y0 + 86} className="dg-text-small">
        contact time Δt
      </Label>
      <Label x={W / 2} y={Y0 - 110} className="dg-text dg-bold">
        Total change in momentum = (+area) + (−area) = 0
      </Label>
    </Svg>
  );
}

export default LinearMomentumThirdLawProof;
