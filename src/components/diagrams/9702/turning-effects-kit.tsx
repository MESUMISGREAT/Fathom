/**
 * Shared geometry helpers for the moments and equilibrium diagrams (topics 4.1 and 4.2).
 * Not a diagram itself (no diagramKey), so it is not registered in index.ts.
 *
 * Coordinates are SVG screen units (y down). Angles passed to dir() and arcPath() are in degrees,
 * measured anticlockwise on screen from the +x direction (the maths convention, y up).
 */
import { Arrow, Label } from '../primitives';

export type Pt = { x: number; y: number };
export const DEG = Math.PI / 180;

export const add = (p: Pt, v: Pt, k = 1): Pt => ({ x: p.x + k * v.x, y: p.y + k * v.y });
export const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
export const len = (v: Pt): number => Math.hypot(v.x, v.y);
export const unit = (v: Pt): Pt => {
  const l = len(v);
  return { x: v.x / l, y: v.y / l };
};
export const dot = (a: Pt, b: Pt): number => a.x * b.x + a.y * b.y;
/** Unit vector at angle deg (anticlockwise from +x on screen). */
export const dir = (deg: number): Pt => ({ x: Math.cos(deg * DEG), y: -Math.sin(deg * DEG) });
/** Foot of the perpendicular from p onto the line through a with direction u (unit). */
export const foot = (p: Pt, a: Pt, u: Pt): Pt => add(a, u, dot(sub(p, a), u));

/** Arc of radius r around c, anticlockwise on screen from angle a1 to a2 (degrees). */
export function arcPath(c: Pt, r: number, a1: number, a2: number): string {
  const p = add(c, dir(a1), r);
  const q = add(c, dir(a2), r);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  const sweep = a2 > a1 ? 0 : 1;
  return `M${p.x.toFixed(2)},${p.y.toFixed(2)} A${r},${r} 0 ${large} ${sweep} ${q.x.toFixed(2)},${q.y.toFixed(2)}`;
}

/** A small right-angle mark at corner c between unit directions u and v. */
export function RightAngle({ c, u, v, s = 9 }: { c: Pt; u: Pt; v: Pt; s?: number }) {
  const a = add(c, u, s);
  const b = add(a, v, s);
  const d = add(c, v, s);
  return <path d={`M${a.x},${a.y} L${b.x},${b.y} L${d.x},${d.y}`} className="dg-thin" />;
}

/** A double-headed dimension arrow from a to b with end ticks; the label is drawn by the caller. */
export function Dimension({ a, b, tick = 6 }: { a: Pt; b: Pt; tick?: number }) {
  const u = unit(sub(b, a));
  const n = { x: -u.y, y: u.x };
  return (
    <g>
      <Arrow x1={a.x} y1={a.y} x2={b.x} y2={b.y} double head={7} className="dg-thin" headClassName="dg-dot" />
      <line x1={a.x + n.x * tick} y1={a.y + n.y * tick} x2={a.x - n.x * tick} y2={a.y - n.y * tick} className="dg-thin" />
      <line x1={b.x + n.x * tick} y1={b.y + n.y * tick} x2={b.x - n.x * tick} y2={b.y - n.y * tick} className="dg-thin" />
    </g>
  );
}

/** A curved arrow round c from angle a1 to a2 (degrees, anticlockwise positive), head at a2. */
export function TurnArrow({ c, r, a1, a2, className = 'dg-accent-2', headClassName = 'dg-dot-accent-2' }: {
  c: Pt;
  r: number;
  a1: number;
  a2: number;
  className?: string;
  headClassName?: string;
}) {
  const end = add(c, dir(a2), r);
  // Tangent direction at the end of the arc, in the sense of travel.
  const s = a2 > a1 ? 1 : -1;
  const t = dir(a2 + s * 90);
  const back = add(end, t, -2);
  return (
    <g>
      <path d={arcPath(c, r, a1, a2 - (s * 7) / r / DEG)} className={className} />
      <Arrow x1={back.x} y1={back.y} x2={end.x} y2={end.y} head={10} className={className} headClassName={headClassName} />
    </g>
  );
}

/** A pivot drawn as a small triangle with its apex at p. */
export function Pivot({ p, w = 26, h = 24 }: { p: Pt; w?: number; h?: number }) {
  return (
    <path
      d={`M${p.x},${p.y} L${p.x - w / 2},${p.y + h} L${p.x + w / 2},${p.y + h} Z`}
      className="dg-fill-muted dg-line"
    />
  );
}

/** A vertical wall face at x from y1 to y2, hatched on the side away from the object (left). */
export function Wall({ x, y1, y2, depth = 16 }: { x: number; y1: number; y2: number; depth?: number }) {
  const hatches = [];
  for (let y = y1 + 6; y < y2; y += 14) {
    hatches.push(<line key={y} x1={x} y1={y} x2={x - depth} y2={y + 10} className="dg-muted" />);
  }
  return (
    <g>
      <rect x={x - depth} y={y1} width={depth} height={y2 - y1} className="dg-fill-muted" />
      {hatches}
      <line x1={x} y1={y1} x2={x} y2={y2} className="dg-line" />
    </g>
  );
}

/** A horizontal ceiling at y from x1 to x2, hatched above. */
export function Ceiling({ y, x1, x2, depth = 14 }: { y: number; x1: number; x2: number; depth?: number }) {
  const hatches = [];
  for (let x = x1 + 4; x < x2; x += 14) {
    hatches.push(<line key={x} x1={x} y1={y} x2={x + 10} y2={y - depth} className="dg-muted" />);
  }
  return (
    <g>
      <rect x={x1} y={y - depth} width={x2 - x1} height={depth} className="dg-fill-muted" />
      {hatches}
      <line x1={x1} y1={y} x2={x2} y2={y} className="dg-line" />
    </g>
  );
}

/** A force arrow of the given length from p in unit direction u, with an optional label at the tip. */
export function Force({
  p,
  u,
  l,
  label,
  dx = 0,
  dy = 0,
  anchor = 'middle',
  tone = 'ink',
}: {
  p: Pt;
  u: Pt;
  l: number;
  label?: string;
  dx?: number;
  dy?: number;
  anchor?: 'start' | 'middle' | 'end';
  tone?: 'ink' | 'accent' | 'accent-2';
}) {
  const tip = add(p, u, l);
  const cls = tone === 'ink' ? 'dg-line' : `dg-${tone}`;
  const head = tone === 'ink' ? 'dg-dot' : `dg-dot-${tone}`;
  const text = tone === 'ink' ? 'dg-text dg-bold' : `dg-text-${tone}`;
  return (
    <g>
      <Arrow x1={p.x} y1={p.y} x2={tip.x} y2={tip.y} head={11} className={cls} headClassName={head} />
      {label && (
        <Label x={tip.x + dx} y={tip.y + dy} anchor={anchor} className={text}>
          {label}
        </Label>
      )}
    </g>
  );
}
