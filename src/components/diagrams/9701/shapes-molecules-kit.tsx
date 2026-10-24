/**
 * Shared pieces for the shapes-of-molecules diagrams. This is a helper, not a diagram (it
 * declares no diagramKey). Bonds use the usual 3D conventions: a plain line lies in the plane
 * of the paper, a solid wedge points towards you and a hashed wedge points away. Angles are
 * in degrees on screen: 0 = right, 90 = down, 270 = up.
 */
import { Label } from '../primitives';

type Pt = [number, number];
export type BondKind = 'line' | 'wedge' | 'dash' | 'double';

const rad = (deg: number) => (deg * Math.PI) / 180;

export function polar(c: Pt, dist: number, angle: number): Pt {
  return [c[0] + dist * Math.cos(rad(angle)), c[1] + dist * Math.sin(rad(angle))];
}

/** A bond from the central atom at c, `len` long, pointing at `angle`; trimmed clear of both labels. */
export function Bond({
  c,
  angle,
  len,
  kind = 'line',
  trim = 12,
  trimEnd = 12,
}: {
  c: Pt;
  angle: number;
  len: number;
  kind?: BondKind;
  trim?: number;
  trimEnd?: number;
}) {
  const [x1, y1] = polar(c, trim, angle);
  const [x2, y2] = polar(c, len - trimEnd, angle);
  const nx = -Math.sin(rad(angle));
  const ny = Math.cos(rad(angle));
  if (kind === 'line') return <line x1={x1} y1={y1} x2={x2} y2={y2} className="dg-line" />;
  if (kind === 'double')
    return (
      <g>
        <line x1={x1 + nx * 3.5} y1={y1 + ny * 3.5} x2={x2 + nx * 3.5} y2={y2 + ny * 3.5} className="dg-line" />
        <line x1={x1 - nx * 3.5} y1={y1 - ny * 3.5} x2={x2 - nx * 3.5} y2={y2 - ny * 3.5} className="dg-line" />
      </g>
    );
  if (kind === 'wedge') {
    const w0 = 1;
    const w1 = 5.5;
    return (
      <path
        d={`M${x1 + nx * w0},${y1 + ny * w0} L${x2 + nx * w1},${y2 + ny * w1} L${x2 - nx * w1},${y2 - ny * w1} L${x1 - nx * w0},${y1 - ny * w0} Z`}
        className="dg-dot"
      />
    );
  }
  const n = 7;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;
        const half = 1 + 4.5 * t;
        return <line key={i} x1={px + nx * half} y1={py + ny * half} x2={px - nx * half} y2={py - ny * half} className="dg-thin" />;
      })}
    </g>
  );
}

/** An atom symbol. */
export function Atom({ p, s, className = 'dg-text dg-bold' }: { p: Pt; s: string; className?: string }) {
  return (
    <Label x={p[0]} y={p[1]} className={className}>
      {s}
    </Label>
  );
}

/** A lone pair: a balloon-shaped region from the central atom with two electrons in it. */
export function LonePairLobe({ c, angle, len = 40, w = 26 }: { c: Pt; angle: number; len?: number; w?: number }) {
  const h = w / 2;
  const start = 10;
  const d = `M0,0 C${0.15 * len},${-h * 1.2} ${0.85 * len},${-h * 1.2} ${len},0 C${0.85 * len},${h * 1.2} ${0.15 * len},${h * 1.2} 0,0 Z`;
  const [ox, oy] = polar(c, start, angle);
  const [ex, ey] = polar(c, start + len * 0.62, angle);
  const nx = -Math.sin(rad(angle)) * 5;
  const ny = Math.cos(rad(angle)) * 5;
  return (
    <g>
      <path d={d} transform={`translate(${ox} ${oy}) rotate(${angle})`} className="dg-thin dg-fill-accent-2" />
      <circle cx={ex + nx} cy={ey + ny} r={2.6} className="dg-dot" />
      <circle cx={ex - nx} cy={ey - ny} r={2.6} className="dg-dot" />
    </g>
  );
}

/** An arc between two directions (degrees, going clockwise on screen from a1 to a2) with a label. */
export function AngleArc({
  c,
  a1,
  a2,
  r = 24,
  label,
  labelR,
  className = 'dg-text-accent',
}: {
  c: Pt;
  a1: number;
  a2: number;
  r?: number;
  label: string;
  labelR?: number;
  className?: string;
}) {
  let sweep = a2 - a1;
  while (sweep <= 0) sweep += 360;
  const [x1, y1] = polar(c, r, a1);
  const [x2, y2] = polar(c, r, a1 + sweep);
  const mid = a1 + sweep / 2;
  const [lx, ly] = polar(c, labelR ?? r + 20, mid);
  return (
    <g>
      <path d={`M${x1},${y1} A${r},${r} 0 ${sweep > 180 ? 1 : 0} 1 ${x2},${y2}`} className="dg-accent" />
      <Label x={lx} y={ly} className={className}>
        {label}
      </Label>
    </g>
  );
}

/** A small square marking a right angle between directions a and a + 90 (clockwise). */
export function RightAngle({ c, a, s = 14 }: { c: Pt; a: number; s?: number }) {
  const [p1x, p1y] = polar(c, s, a);
  const [p3x, p3y] = polar(c, s, a + 90);
  const p2x = p1x + (p3x - c[0]);
  const p2y = p1y + (p3y - c[1]);
  return <path d={`M${p1x},${p1y} L${p2x},${p2y} L${p3x},${p3y}`} className="dg-accent" />;
}
