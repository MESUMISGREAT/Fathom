/**
 * Finding the centre of gravity of a flat, irregular lamina with a plumb line (outcome 4.1.1).
 * The lamina is a convex hexagon; its centre of gravity G is computed as the area centroid, and in
 * each panel the shape is rotated about the hole it hangs from so that G is exactly below the hole
 * (the only position with no moment of the weight about the pin).
 * Panel 1: hung from hole A; the plumb line through A passes through G and is marked on the card.
 * Panel 2: hung from hole B; the new vertical line through B crosses the first line (now tilted,
 *   because the card has turned) at G.
 */
import { Label, Svg } from '../primitives';
import { add, sub, type Pt } from './turning-effects-kit';

export const diagramKey = 'phys-turning-effects-plumb-line';

const W = 640;
const H = 312;

/** The lamina in its own coordinates (y down). Convex, so a ray from inside meets the edge once. */
const SHAPE: Pt[] = [
  { x: 0, y: 0 },
  { x: 130, y: -20 },
  { x: 178, y: 60 },
  { x: 120, y: 140 },
  { x: 20, y: 122 },
  { x: -28, y: 55 },
];
const HOLE_A: Pt = { x: 14, y: 10 };
const HOLE_B: Pt = { x: 160, y: 58 };

function centroid(poly: Pt[]): Pt {
  let a = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]!;
    const q = poly[(i + 1) % poly.length]!;
    const cr = p.x * q.y - q.x * p.y;
    a += cr;
    cx += (p.x + q.x) * cr;
    cy += (p.y + q.y) * cr;
  }
  return { x: cx / (3 * a), y: cy / (3 * a) };
}
const G = centroid(SHAPE);

/** Rotate p about c by phi (radians, screen sense). */
function rot(p: Pt, c: Pt, phi: number): Pt {
  const v = sub(p, c);
  return { x: c.x + v.x * Math.cos(phi) - v.y * Math.sin(phi), y: c.y + v.x * Math.sin(phi) + v.y * Math.cos(phi) };
}

/** Far point where the ray from s through g leaves the polygon. */
function exitPoint(poly: Pt[], s: Pt, g: Pt): Pt {
  const u = sub(g, s);
  let best = 1;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]!;
    const q = poly[(i + 1) % poly.length]!;
    const e = sub(q, p);
    const den = u.x * e.y - u.y * e.x;
    if (Math.abs(den) < 1e-9) continue;
    const w = sub(p, s);
    const t = (w.x * e.y - w.y * e.x) / den;
    const k = (w.x * u.y - w.y * u.x) / den;
    if (t > 1 && k >= 0 && k <= 1) best = Math.max(best, t);
  }
  return add(s, u, best);
}

/** The lamina hung from hole `hole` with that hole at screen point `pin`. */
function hang(hole: Pt, pin: Pt) {
  const v = sub(G, hole);
  const phi = Math.PI / 2 - Math.atan2(v.y, v.x);
  const map = (p: Pt) => add(rot(p, hole, phi), sub(pin, hole));
  return { map, poly: SHAPE.map(map) };
}

const pts = (poly: Pt[]) => poly.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

function Pin({ p }: { p: Pt }) {
  return (
    <g>
      <circle cx={p.x} cy={p.y} r={5} className="dg-fill-surface dg-line" />
      <circle cx={p.x} cy={p.y} r={1.8} className="dg-dot" />
    </g>
  );
}

export function TurningEffectsPlumbLine() {
  const pin1 = { x: 160, y: 62 };
  const pin2 = { x: 480, y: 62 };
  const one = hang(HOLE_A, pin1);
  const two = hang(HOLE_B, pin2);
  const bottom = 268;

  const g1 = one.map(G);
  const lineA1 = exitPoint(one.poly, pin1, g1);
  const g2 = two.map(G);
  const a2 = two.map(HOLE_A);
  const lineA2 = exitPoint(two.poly, a2, g2);
  const lineB2 = exitPoint(two.poly, pin2, g2);
  const b1 = one.map(HOLE_B);

  return (
    <Svg width={W} height={H}>
      {/* ---------- panel 1 ---------- */}
      <Label x={160} y={22} className="dg-text dg-bold">
        1. Hang it from hole A
      </Label>
      <polygon points={pts(one.poly)} className="dg-fill-accent dg-accent" />
      <line x1={pin1.x} y1={pin1.y} x2={lineA1.x} y2={lineA1.y} className="dg-accent-2" />
      <line x1={lineA1.x} y1={lineA1.y} x2={pin1.x} y2={bottom} className="dg-thin" />
      <path d={`M${pin1.x},${bottom} l-6,0 l6,14 l6,-14 Z`} className="dg-dot" />
      <Label x={pin1.x + 12} y={bottom + 6} anchor="start" className="dg-text-small">
        plumb line
      </Label>
      <Pin p={pin1} />
      <Label x={pin1.x - 12} y={pin1.y + 4} anchor="end" className="dg-text dg-bold">
        A
      </Label>
      <circle cx={b1.x} cy={b1.y} r={4} className="dg-fill-surface dg-thin" />
      <Label x={b1.x + 10} y={b1.y} anchor="start" className="dg-text dg-bold">
        B
      </Label>
      <Label x={160} y={298} className="dg-text-small dg-text-muted">
        G is somewhere on the line marked through A
      </Label>

      {/* ---------- panel 2 ---------- */}
      <Label x={480} y={22} className="dg-text dg-bold">
        2. Hang it from hole B
      </Label>
      <polygon points={pts(two.poly)} className="dg-fill-accent dg-accent" />
      <line x1={a2.x} y1={a2.y} x2={lineA2.x} y2={lineA2.y} className="dg-accent-2 dg-dashed" />
      <line x1={pin2.x} y1={pin2.y} x2={lineB2.x} y2={lineB2.y} className="dg-accent-2" />
      <line x1={lineB2.x} y1={lineB2.y} x2={pin2.x} y2={bottom} className="dg-thin" />
      <path d={`M${pin2.x},${bottom} l-6,0 l6,14 l6,-14 Z`} className="dg-dot" />
      <Pin p={pin2} />
      <Label x={pin2.x - 12} y={pin2.y + 4} anchor="end" className="dg-text dg-bold">
        B
      </Label>
      <circle cx={a2.x} cy={a2.y} r={4} className="dg-fill-surface dg-thin" />
      <Label x={a2.x - 10} y={a2.y} anchor="end" className="dg-text dg-bold">
        A
      </Label>
      <circle cx={g2.x} cy={g2.y} r={4.5} className="dg-dot" />
      <Label x={g2.x + 12} y={g2.y + 2} anchor="start" className="dg-text dg-bold">
        G
      </Label>
      <Label x={480} y={298} className="dg-text-small dg-text-muted">
        the two lines cross at the centre of gravity G
      </Label>
    </Svg>
  );
}

export default TurningEffectsPlumbLine;
