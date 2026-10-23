/**
 * A two-dimensional collision: car A (1200 kg) travelling east at 15 m s⁻¹
 * collides at a junction with car B (1600 kg) travelling north at 10 m s⁻¹;
 * they lock together.
 * Left: top view of the junction, with the cars' directions before and the
 *   wreck's direction after (41.6° north of east).
 * Right: momentum vector triangle drawn to scale (1 px per 100 kg m s⁻¹):
 *   p_A = 18 000 kg m s⁻¹ east, then p_B = 16 000 kg m s⁻¹ north from its
 *   tip; the total, 24 100 kg m s⁻¹ at 41.6° north of east, closes the
 *   triangle and is the momentum of the wreck.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-linear-momentum-junction-crash';

const W = 640;
const H = 320;
const DEG = Math.PI / 180;
const PA = 18000;
const PB = 16000;
const S = 0.01; // px per kg m s⁻¹
const ANGLE = Math.atan2(PB, PA) / DEG; // 41.6°

export function LinearMomentumJunctionCrash() {
  // ---- left: junction ----
  const jx = 170;
  const jy = 190;
  const road = 54;
  // ---- right: vector triangle ----
  const o = { x: 360, y: 260 };
  const a = { x: o.x + PA * S, y: o.y };
  const b = { x: a.x, y: a.y - PB * S };
  const arcR = 46;
  const arcEnd = { x: o.x + arcR * Math.cos(ANGLE * DEG), y: o.y - arcR * Math.sin(ANGLE * DEG) };
  const mid = (ANGLE / 2) * DEG;
  const dir = { x: Math.cos(ANGLE * DEG), y: -Math.sin(ANGLE * DEG) };
  return (
    <Svg width={W} height={H}>
      {/* ================= junction ================= */}
      <Label x={jx} y={18} className="dg-text dg-bold">
        Top view
      </Label>
      <rect x={20} y={jy - road / 2} width={300} height={road} className="dg-fill-muted" />
      <rect x={jx - road / 2} y={36} width={road} height={270} className="dg-fill-muted" />
      <line x1={20} y1={jy} x2={jx - road / 2} y2={jy} className="dg-muted dg-dashed" />
      <line x1={jx + road / 2} y1={jy} x2={320} y2={jy} className="dg-muted dg-dashed" />
      <line x1={jx} y1={36} x2={jx} y2={jy - road / 2} className="dg-muted dg-dashed" />
      <line x1={jx} y1={jy + road / 2} x2={jx} y2={306} className="dg-muted dg-dashed" />
      {/* car A heading east */}
      <rect x={40} y={jy + 4} width={44} height={20} rx={4} className="dg-fill-accent dg-accent" />
      <Label x={62} y={jy + 15} className="dg-text-small dg-bold">
        A
      </Label>
      <Arrow x1={90} y1={jy + 14} x2={134} y2={jy + 14} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={60} y={jy + 42} className="dg-text-small">
        1200 kg, 15 m s⁻¹ E
      </Label>
      {/* car B heading north */}
      <rect x={jx + 4} y={262} width={20} height={40} rx={4} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={jx + 14} y={283} className="dg-text-small dg-bold">
        B
      </Label>
      <Arrow x1={jx + 14} y1={256} x2={jx + 14} y2={226} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={jx + 34} y={288} anchor="start" className="dg-text-small">
        1600 kg, 10 m s⁻¹ N
      </Label>
      {/* wreck after */}
      <Arrow
        x1={jx + 6}
        y1={jy - 6}
        x2={jx + 6 + 110 * dir.x}
        y2={jy - 6 + 110 * dir.y}
        className="dg-line dg-dashed"
        headClassName="dg-dot"
      />
      <Label x={jx + 6 + 118 * dir.x} y={jy - 6 + 118 * dir.y - 10} anchor="start" className="dg-text-small">
        wreck after
      </Label>
      {/* compass */}
      <Arrow x1={44} y1={84} x2={44} y2={50} head={7} className="dg-thin" />
      <Label x={44} y={40} className="dg-text-small dg-bold">
        N
      </Label>

      {/* ================= vector triangle ================= */}
      <Label x={490} y={18} className="dg-text dg-bold">
        Momentum, to scale
      </Label>
      <path d={`M${a.x - 16},${a.y} L${a.x - 16},${a.y - 16} L${a.x},${a.y - 16}`} className="dg-thin" />
      <Arrow x1={o.x} y1={o.y} x2={a.x} y2={a.y} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={o.x} y1={o.y} x2={b.x} y2={b.y} head={11} />
      <path
        d={`M${o.x + arcR},${o.y} A${arcR},${arcR} 0 0 0 ${arcEnd.x.toFixed(2)},${arcEnd.y.toFixed(2)}`}
        className="dg-thin"
      />
      <Label x={o.x + (arcR + 16) * Math.cos(mid)} y={o.y - (arcR + 16) * Math.sin(mid)} className="dg-text-small">
        {`${ANGLE.toFixed(1)}°`}
      </Label>
      <Label x={(o.x + a.x) / 2} y={o.y + 18} className="dg-text-small dg-text-accent">
        car A: 18 000
      </Label>
      <Label x={a.x + 10} y={(a.y + b.y) / 2 - 8} anchor="start" className="dg-text-small dg-text-accent-2">
        car B:
      </Label>
      <Label x={a.x + 10} y={(a.y + b.y) / 2 + 10} anchor="start" className="dg-text-small dg-text-accent-2">
        16 000
      </Label>
      <Label x={(o.x + b.x) / 2 - 12} y={(o.y + b.y) / 2 - 14} anchor="end" className="dg-text-small dg-bold">
        total = 24 100
      </Label>
      <Label x={490} y={302} className="dg-text-small dg-text-muted">
        all in kg m s⁻¹
      </Label>
    </Svg>
  );
}

export default LinearMomentumJunctionCrash;
