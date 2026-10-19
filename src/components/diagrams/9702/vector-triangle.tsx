/**
 * Adding and subtracting two coplanar vectors tip to tail, drawn to scale
 * (38 px per newton).
 *   A = 5.0 N along +x; B = 3.0 N at 60° to A.
 *   A + B: |R|² = 5² + 3² + 2(5)(3)cos 60° = 49, so R = 7.0 N at 21.8° to A.
 *   A − B = A + (−B): |A − B|² = 5² + 3² − 2(5)(3)cos 60° = 19, so 4.36 N at 36.6° below A.
 */
import { Arrow, Label, Svg } from '../primitives';

const W = 640;
const H = 250;
const S = 38; // px per newton
const DEG = Math.PI / 180;

type Pt = { x: number; y: number };
/** Move from p by a vector of magnitude mag (N) at angle deg (maths convention, y up). */
const step = (p: Pt, mag: number, deg: number): Pt => ({
  x: p.x + mag * S * Math.cos(deg * DEG),
  y: p.y - mag * S * Math.sin(deg * DEG),
});
const at = (p: Pt, r: number, deg: number): Pt => ({ x: p.x + r * Math.cos(deg * DEG), y: p.y - r * Math.sin(deg * DEG) });

/** Arc of radius r around c, counterclockwise (maths sense) from a1 to a2 degrees. */
function arc(c: Pt, r: number, a1: number, a2: number): string {
  const p = at(c, r, a1);
  const q = at(c, r, a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M${p.x.toFixed(2)},${p.y.toFixed(2)} A${r},${r} 0 ${large} 0 ${q.x.toFixed(2)},${q.y.toFixed(2)}`;
}

const A = 5;
const B = 3;
const THETA = 60;

export function VectorTriangle() {
  // Panel 1: A + B
  const o1: Pt = { x: 34, y: 186 };
  const p1 = step(o1, A, 0);
  const q1 = step(p1, B, THETA);
  const rAngle = Math.atan2(o1.y - q1.y, q1.x - o1.x) / DEG; // 21.8°

  // Panel 2: A − B = A + (−B)
  const o2: Pt = { x: 372, y: 84 };
  const p2 = step(o2, A, 0);
  const q2 = step(p2, B, THETA + 180);
  const dAngle = Math.atan2(o2.y - q2.y, q2.x - o2.x) / DEG; // −36.6°

  return (
    <Svg width={W} height={H}>
      {/* ---------- A + B ---------- */}
      <Label x={170} y={22} className="dg-text dg-bold">
        Adding: A + B
      </Label>
      <line x1={p1.x} y1={p1.y} x2={p1.x + 78} y2={p1.y} className="dg-muted dg-dashed" />
      <path d={arc(p1, 26, 0, THETA)} className="dg-thin" />
      <Label x={at(p1, 42, 30).x} y={at(p1, 42, 30).y} className="dg-text-small">
        60°
      </Label>
      <path d={arc(o1, 66, 0, rAngle)} className="dg-thin" />
      <Label x={at(o1, 92, rAngle / 2).x} y={at(o1, 92, rAngle / 2).y} className="dg-text-small">
        21.8°
      </Label>
      <Arrow x1={o1.x} y1={o1.y} x2={p1.x} y2={p1.y} className="dg-line" />
      <Arrow x1={p1.x} y1={p1.y} x2={q1.x} y2={q1.y} className="dg-line" />
      <Arrow x1={o1.x} y1={o1.y} x2={q1.x} y2={q1.y} className="dg-accent" headClassName="dg-dot-accent" head={11} />
      <Label x={(o1.x + p1.x) / 2} y={o1.y + 18} className="dg-text">
        A = 5.0 N
      </Label>
      <Label x={(p1.x + q1.x) / 2 + 12} y={(p1.y + q1.y) / 2 + 8} anchor="start" className="dg-text">
        B = 3.0 N
      </Label>
      <Label x={(o1.x + q1.x) / 2 - 12} y={(o1.y + q1.y) / 2 - 16} anchor="end" className="dg-text-accent">
        R = 7.0 N
      </Label>
      <Label x={170} y={232} className="dg-text-small dg-text-muted">
        tip to tail: R runs from the start of A to the tip of B
      </Label>

      {/* ---------- A − B ---------- */}
      <Label x={o2.x + 95} y={22} className="dg-text dg-bold">
        Subtracting: A − B = A + (−B)
      </Label>
      <path d={arc(p2, 26, 180, 240)} className="dg-thin" />
      <Label x={at(p2, 42, 210).x} y={at(p2, 42, 210).y} className="dg-text-small">
        60°
      </Label>
      <Arrow x1={o2.x} y1={o2.y} x2={p2.x} y2={p2.y} className="dg-line" />
      <Arrow x1={p2.x} y1={p2.y} x2={q2.x} y2={q2.y} className="dg-line" />
      <Arrow x1={o2.x} y1={o2.y} x2={q2.x} y2={q2.y} className="dg-accent-2" headClassName="dg-dot-accent-2" head={11} />
      <Label x={(o2.x + p2.x) / 2} y={o2.y - 16} className="dg-text">
        A = 5.0 N
      </Label>
      <Label x={(p2.x + q2.x) / 2 + 12} y={(p2.y + q2.y) / 2} anchor="start" className="dg-text">
        −B
      </Label>
      <Label x={(o2.x + q2.x) / 2 - 10} y={(o2.y + q2.y) / 2 + 14} anchor="end" className="dg-text-accent-2">
        A − B = 4.4 N
      </Label>
      <Label x={at(o2, 76, dAngle / 2).x} y={at(o2, 76, dAngle / 2).y} className="dg-text-small">
        {`${Math.abs(dAngle).toFixed(1)}°`}
      </Label>
      <path d={arc(o2, 44, dAngle, 0)} className="dg-thin" />
      <Label x={o2.x + 95} y={232} className="dg-text-small dg-text-muted">
        −B: same size as B, opposite direction
      </Label>
    </Svg>
  );
}
