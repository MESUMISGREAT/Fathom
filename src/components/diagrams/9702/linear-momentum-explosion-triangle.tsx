/**
 * A two-dimensional explosion. An object at rest (total momentum 0) breaks
 * into three pieces:
 *   0.20 kg at 30 m s⁻¹ east   → p = 6.0 kg m s⁻¹ east
 *   0.30 kg at 10 m s⁻¹ north  → p = 3.0 kg m s⁻¹ north
 *   0.10 kg at 67 m s⁻¹, 26.6° south of west → p = √(6.0² + 3.0²) = 6.7 kg m s⁻¹
 * Left: the three momentum arrows from the point of the explosion.
 * Right: the same three arrows tip to tail; they close into a triangle, so
 *   the total momentum after is still zero. Both panels to the same scale
 *   (22 px per kg m s⁻¹).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-linear-momentum-explosion-triangle';

const W = 640;
const H = 300;
const KP = 22; // px per kg m s⁻¹
const P1 = 6.0; // east
const P2 = 3.0; // north
const DEG = Math.PI / 180;
const ANG = Math.atan2(P2, P1) / DEG; // 26.6°, south of west for piece 3

export function LinearMomentumExplosionTriangle() {
  // ---- left: pieces fly apart ----
  const c = { x: 190, y: 140 };
  const e1 = { x: c.x + P1 * KP, y: c.y };
  const e2 = { x: c.x, y: c.y - P2 * KP };
  const e3 = { x: c.x - P1 * KP, y: c.y + P2 * KP };
  const arcR = 44;
  const a0 = 180 * DEG;
  const a1 = (180 + ANG) * DEG;
  const arcStart = { x: c.x + arcR * Math.cos(a0), y: c.y - arcR * Math.sin(a0) };
  const arcEnd = { x: c.x + arcR * Math.cos(a1), y: c.y - arcR * Math.sin(a1) };
  const lab = 194 * DEG;
  // ---- right: tip to tail ----
  const o = { x: 400, y: 220 };
  const t1 = { x: o.x + P1 * KP, y: o.y };
  const t2 = { x: t1.x, y: t1.y - P2 * KP };
  return (
    <Svg width={W} height={H}>
      {/* ================= left ================= */}
      <Label x={c.x} y={18} className="dg-text dg-bold">
        After: three pieces fly apart
      </Label>
      <Label x={c.x} y={38} className="dg-text-small dg-text-muted">
        (before: at rest, total momentum = 0)
      </Label>
      <line x1={c.x} y1={c.y} x2={c.x - 84} y2={c.y} className="dg-muted dg-dashed" />
      <Label x={c.x - 92} y={c.y} anchor="end" className="dg-text-small dg-text-muted">
        W
      </Label>
      <path
        d={`M${arcStart.x.toFixed(2)},${arcStart.y.toFixed(2)} A${arcR},${arcR} 0 0 0 ${arcEnd.x.toFixed(2)},${arcEnd.y.toFixed(2)}`}
        className="dg-thin"
      />
      <Label x={c.x + 70 * Math.cos(lab)} y={c.y - 70 * Math.sin(lab)} className="dg-text-small">
        {`${ANG.toFixed(1)}°`}
      </Label>
      <Arrow x1={c.x} y1={c.y} x2={e1.x} y2={e1.y} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={c.x} y1={c.y} x2={e2.x} y2={e2.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={c.x} y1={c.y} x2={e3.x} y2={e3.y} />
      <circle cx={c.x} cy={c.y} r={4} className="dg-dot" />
      <Label x={c.x + 10} y={c.y - 14} anchor="start" className="dg-text-small dg-text-accent">
        0.20 kg at 30 m s⁻¹ E
      </Label>
      <Label x={c.x + 3 * KP} y={c.y + 16} className="dg-text-small dg-text-accent">
        p = 6.0
      </Label>
      <Label x={c.x} y={e2.y - 14} className="dg-text-small dg-text-accent-2">
        0.30 kg at 10 m s⁻¹ N
      </Label>
      <Label x={c.x - 10} y={c.y - 1.5 * KP} anchor="end" className="dg-text-small dg-text-accent-2">
        p = 3.0
      </Label>
      <Label x={24} y={e3.y + 22} anchor="start" className="dg-text-small">
        0.10 kg at 67 m s⁻¹
      </Label>
      <Label x={24} y={e3.y + 40} anchor="start" className="dg-text-small">
        p = 6.7
      </Label>
      {/* compass */}
      <Arrow x1={40} y1={92} x2={40} y2={62} head={7} className="dg-thin" />
      <Label x={40} y={52} className="dg-text-small dg-bold">
        N
      </Label>

      <line x1={356} y1={50} x2={356} y2={270} className="dg-grid" />

      {/* ================= right ================= */}
      <Label x={500} y={18} className="dg-text dg-bold">
        Momenta tip to tail
      </Label>
      <path d={`M${t1.x - 12},${t1.y} L${t1.x - 12},${t1.y - 12} L${t1.x},${t1.y - 12}`} className="dg-thin" />
      <Arrow x1={o.x} y1={o.y} x2={t1.x} y2={t1.y} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={t2.x} y1={t2.y} x2={o.x} y2={o.y} />
      <Label x={(o.x + t1.x) / 2} y={o.y + 18} className="dg-text-small dg-text-accent">
        6.0
      </Label>
      <Label x={t1.x + 10} y={(t1.y + t2.y) / 2} anchor="start" className="dg-text-small dg-text-accent-2">
        3.0
      </Label>
      <Label x={(o.x + t2.x) / 2 - 8} y={(o.y + t2.y) / 2 - 18} anchor="end" className="dg-text-small">
        6.7
      </Label>
      <Label x={500} y={92} className="dg-text-small">
        the arrows end where they started:
      </Label>
      <Label x={500} y={110} className="dg-text-small dg-bold">
        total momentum after = 0
      </Label>
      <Label x={W / 2} y={288} className="dg-text-small dg-text-muted">
        momenta in kg m s⁻¹, drawn to the same scale in both panels
      </Label>
    </Svg>
  );
}

export default LinearMomentumExplosionTriangle;
