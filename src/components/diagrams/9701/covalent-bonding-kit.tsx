/**
 * Shared pieces for the covalent-bonding diagrams. This is a helper, not a diagram (it
 * declares no diagramKey). Dot-and-cross pictures draw each atom's outer shell as a circle;
 * a shared pair sits where two circles overlap. Each electron is a dot (ink) or a cross
 * (accent colour), so you can see which atom it came from by shape as well as colour.
 * Also: p-orbital lobes and electron-pair arrows for orbital diagrams.
 */
import { Arrow, Label } from '../primitives';

export type Mark = 'dot' | 'cross';
type Pt = [number, number];

const rad = (deg: number) => (deg * Math.PI) / 180;

/** One electron: a filled dot (ink) or a cross (accent colour). */
export function Electron({ x, y, mark }: { x: number; y: number; mark: Mark }) {
  if (mark === 'dot') return <circle cx={x} cy={y} r={3.4} className="dg-dot" />;
  const s = 3.6;
  return (
    <g>
      <line x1={x - s} y1={y - s} x2={x + s} y2={y + s} className="dg-accent" />
      <line x1={x - s} y1={y + s} x2={x + s} y2={y - s} className="dg-accent" />
    </g>
  );
}

/** An outer shell: a circle with the element symbol in the middle. */
export function Shell({ cx, cy, r, symbol }: { cx: number; cy: number; r: number; symbol: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className="dg-thin" />
      <Label x={cx} y={cy} className="dg-text dg-bold">
        {symbol}
      </Label>
    </g>
  );
}

/** A non-bonding pair on a shell, centred at `angle` degrees (0 = right, 90 = down). */
export function LonePair({
  cx,
  cy,
  r,
  angle,
  marks,
  spread = 13,
}: {
  cx: number;
  cy: number;
  r: number;
  angle: number;
  marks: [Mark, Mark];
  spread?: number;
}) {
  return (
    <g>
      {marks.map((mark, i) => {
        const a = rad(angle + (i === 0 ? -spread : spread));
        return <Electron key={i} x={cx + r * Math.cos(a)} y={cy + r * Math.sin(a)} mark={mark} />;
      })}
    </g>
  );
}

/**
 * Electrons shared between two overlapping shells A and B, placed in the lens where the
 * circles overlap. 2 marks: one pair stacked across the bond. 4 marks: two pairs (a double
 * bond). 6 marks: three pairs (a triple bond). Each pair is listed [A's electron, B's electron].
 */
export function Shared({ a, ra, b, rb, marks }: { a: Pt; ra: number; b: Pt; rb: number; marks: Mark[] }) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const d = Math.hypot(dx, dy);
  const ux = dx / d;
  const uy = dy / d;
  const t = (d - rb + ra) / 2;
  const mx = a[0] + ux * t;
  const my = a[1] + uy * t;
  // offsets as [along the bond, across the bond]
  const layout: Pt[] =
    marks.length === 2
      ? [
          [0, -5.5],
          [0, 5.5],
        ]
      : marks.length === 4
        ? [
            [-5, -7.5],
            [5, -7.5],
            [-5, 7.5],
            [5, 7.5],
          ]
        : [
            [-5, -13],
            [5, -13],
            [-5, 0],
            [5, 0],
            [-5, 13],
            [5, 13],
          ];
  return (
    <g>
      {marks.map((mark, i) => {
        const [al, ac] = layout[i]!;
        return <Electron key={i} x={mx + ux * al - uy * ac} y={my + uy * al + ux * ac} mark={mark} />;
      })}
    </g>
  );
}

/** Point at distance `dist` from (cx, cy) in direction `angle` degrees (0 = right, 90 = down). */
export function polar(cx: number, cy: number, dist: number, angle: number): Pt {
  return [cx + dist * Math.cos(rad(angle)), cy + dist * Math.sin(rad(angle))];
}

/** A legend row: one mark and its meaning. */
export function KeyRow({ x, y, mark, children }: { x: number; y: number; mark: Mark; children: string }) {
  return (
    <g>
      <Electron x={x} y={y} mark={mark} />
      <Label x={x + 12} y={y} anchor="start" className="dg-text-small">
        {children}
      </Label>
    </g>
  );
}

/**
 * One lobe of an orbital: a teardrop from (x, y) pointing at `angle` degrees, `len` long and
 * `w` wide at its fattest. className picks the outline/fill (e.g. "dg-thin dg-fill-accent").
 */
export function Lobe({
  x,
  y,
  angle,
  len,
  w,
  className = 'dg-thin',
}: {
  x: number;
  y: number;
  angle: number;
  len: number;
  w: number;
  className?: string;
}) {
  const h = w / 2;
  const d = `M0,0 C${0.12 * len},${-h * 1.25} ${0.82 * len},${-h * 1.15} ${len},0 C${0.82 * len},${h * 1.15} ${0.12 * len},${h * 1.25} 0,0 Z`;
  return <path d={d} transform={`translate(${x} ${y}) rotate(${angle})`} className={className} />;
}

/** An electron in an orbital box: an arrow pointing up or down. */
export function Spin({ x, y, up }: { x: number; y: number; up: boolean }) {
  const half = 9;
  return up ? (
    <Arrow x1={x} y1={y + half} x2={x} y2={y - half} head={6} className="dg-thin" />
  ) : (
    <Arrow x1={x} y1={y - half} x2={x} y2={y + half} head={6} className="dg-thin" />
  );
}

/** A row of orbital boxes (side `box`) starting at (x, y); occ per box: 0, 1 (up) or 2 (pair). */
export function Boxes({ x, y, occ, box = 26, className = 'dg-thin dg-fill-surface' }: { x: number; y: number; occ: number[]; box?: number; className?: string }) {
  return (
    <g>
      {occ.map((o, i) => {
        const bx = x + i * box;
        const cy = y + box / 2;
        return (
          <g key={i}>
            <rect x={bx} y={y} width={box} height={box} className={className} />
            {o === 1 && <Spin x={bx + box / 2} y={cy} up />}
            {o === 2 && (
              <>
                <Spin x={bx + box / 2 - 5} y={cy} up />
                <Spin x={bx + box / 2 + 5} y={cy} up={false} />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
