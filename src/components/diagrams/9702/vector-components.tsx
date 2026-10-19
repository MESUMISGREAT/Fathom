/**
 * Resolving vectors into two perpendicular components, drawn to scale.
 * Left: a force F at θ = 35° to the horizontal: F cos θ along the horizontal,
 *   F sin θ along the vertical; they form a right-angled triangle with F as
 *   the hypotenuse.
 * Right: the weight W of a block on a slope inclined at θ = 30°: W sin θ down
 *   the slope and W cos θ perpendicular to (into) it. The angle between W and
 *   the perpendicular component equals the slope angle θ. Dashed lines complete
 *   the rectangle whose diagonal is W.
 */
import { Arrow, Label, Svg } from '../primitives';

const W = 640;
const H = 290;
const DEG = Math.PI / 180;

type Pt = { x: number; y: number };
const add = (p: Pt, v: Pt, k = 1): Pt => ({ x: p.x + k * v.x, y: p.y + k * v.y });
/** Unit vector at angle deg (maths convention, y up) in screen coordinates. */
const dir = (deg: number): Pt => ({ x: Math.cos(deg * DEG), y: -Math.sin(deg * DEG) });
function arc(c: Pt, r: number, a1: number, a2: number): string {
  const p = add(c, dir(a1), r);
  const q = add(c, dir(a2), r);
  return `M${p.x.toFixed(2)},${p.y.toFixed(2)} A${r},${r} 0 0 0 ${q.x.toFixed(2)},${q.y.toFixed(2)}`;
}

export function VectorComponents() {
  // ---- left: a force at 35° ----
  const th = 35;
  const o: Pt = { x: 48, y: 218 };
  const F = 170;
  const tip = add(o, dir(th), F);
  const corner: Pt = { x: tip.x, y: o.y };

  // ---- right: a block on a slope at 30° ----
  const al = 30;
  const base: Pt = { x: 350, y: 236 };
  const run = 250;
  const top: Pt = { x: base.x + run, y: base.y - run * Math.tan(al * DEG) };
  const up = dir(al); // up the slope
  const down = dir(al + 180); // down the slope
  const into = dir(al - 90); // perpendicular, into the slope
  const out = dir(al + 90); // perpendicular, out of the slope
  const contact = add(base, up, 200);
  const c = add(contact, out, 21); // centre of the block (side 42)
  const WL = 96;
  const wTip: Pt = { x: c.x, y: c.y + WL };
  const sTip = add(c, down, WL * Math.sin(al * DEG));
  const nTip = add(c, into, WL * Math.cos(al * DEG));
  const sq = 9;
  const ra1 = add(c, down, sq);
  const ra2 = add(ra1, into, sq);
  const ra3 = add(c, into, sq);
  const thetaLabel = add(c, dir(285), 46);

  return (
    <Svg width={W} height={H}>
      {/* ================= left ================= */}
      <Label x={150} y={22} className="dg-text dg-bold">
        Resolving a force
      </Label>
      <path d={arc(o, 40, 0, th)} className="dg-thin" />
      <Label x={add(o, dir(th / 2), 54).x} y={add(o, dir(th / 2), 54).y} className="dg-text dg-italic">
        θ
      </Label>
      <path d={`M${corner.x - 11},${corner.y} L${corner.x - 11},${corner.y - 11} L${corner.x},${corner.y - 11}`} className="dg-thin" />
      <Arrow x1={o.x} y1={o.y} x2={corner.x} y2={corner.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={corner.x} y1={corner.y} x2={tip.x} y2={tip.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={o.x} y1={o.y} x2={tip.x} y2={tip.y} className="dg-line" head={11} />
      <Label x={(o.x + tip.x) / 2 - 10} y={(o.y + tip.y) / 2 - 14} anchor="end" className="dg-text dg-bold">
        F
      </Label>
      <Label x={(o.x + corner.x) / 2} y={o.y + 20} className="dg-text-accent-2">
        F cos θ
      </Label>
      <Label x={corner.x + 10} y={(corner.y + tip.y) / 2} anchor="start" className="dg-text-accent-2">
        F sin θ
      </Label>
      <Label x={150} y={268} className="dg-text-small dg-text-muted">
        the component next to θ gets cos θ
      </Label>

      {/* ================= right ================= */}
      <Label x={475} y={22} className="dg-text dg-bold">
        Weight on a slope
      </Label>
      <path d={`M${base.x},${base.y} L${top.x},${top.y} L${top.x},${base.y} Z`} className="dg-fill-muted" />
      <line x1={base.x} y1={base.y} x2={top.x} y2={top.y} className="dg-line" />
      <line x1={base.x - 10} y1={base.y} x2={top.x + 10} y2={base.y} className="dg-thin" />
      <path d={arc(base, 46, 0, al)} className="dg-thin" />
      <Label x={add(base, dir(al / 2), 60).x} y={add(base, dir(al / 2), 60).y} className="dg-text dg-italic">
        θ
      </Label>
      {/* the block */}
      <rect
        x={c.x - 21}
        y={c.y - 21}
        width={42}
        height={42}
        transform={`rotate(${-al} ${c.x} ${c.y})`}
        className="dg-fill-accent dg-accent"
      />
      {/* rectangle completed by dashed lines: W is its diagonal */}
      <line x1={sTip.x} y1={sTip.y} x2={wTip.x} y2={wTip.y} className="dg-muted dg-dashed" />
      <line x1={nTip.x} y1={nTip.y} x2={wTip.x} y2={wTip.y} className="dg-muted dg-dashed" />
      <path d={`M${ra1.x},${ra1.y} L${ra2.x},${ra2.y} L${ra3.x},${ra3.y}`} className="dg-thin" />
      <path d={arc(c, 32, 270, 300)} className="dg-thin" />
      <Label x={thetaLabel.x} y={thetaLabel.y} className="dg-text-small dg-italic">
        θ
      </Label>
      <Arrow x1={c.x} y1={c.y} x2={sTip.x} y2={sTip.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={c.x} y1={c.y} x2={nTip.x} y2={nTip.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={c.x} y1={c.y} x2={wTip.x} y2={wTip.y} className="dg-line" head={11} />
      <circle cx={c.x} cy={c.y} r={3} className="dg-dot" />
      <Label x={sTip.x - 8} y={sTip.y - 12} anchor="end" className="dg-text-accent-2">
        W sin θ
      </Label>
      <Label x={nTip.x + 10} y={nTip.y - 4} anchor="start" className="dg-text-accent-2">
        W cos θ
      </Label>
      <Label x={wTip.x - 10} y={wTip.y} anchor="end" className="dg-text dg-bold">
        W
      </Label>
      <Label x={475} y={268} className="dg-text-small dg-text-muted">
        W sin θ down the slope, W cos θ into it
      </Label>
    </Svg>
  );
}
