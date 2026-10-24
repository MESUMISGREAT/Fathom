/**
 * Shared pieces for the ionic-bonding dot-and-cross diagrams. This is a helper, not a
 * diagram (it declares no diagramKey). An outer shell is a circle with its electrons in
 * four pairs (top, right, bottom, left); each electron is a dot or a cross, so you can see
 * which atom it came from. Ions get square brackets and their charge at the top right.
 */
import { Label } from '../primitives';

export type Mark = 'dot' | 'cross';

/** Electrons on each side of a shell: 0, 1 or 2 marks per side. */
export interface Sides {
  top?: Mark[];
  right?: Mark[];
  bottom?: Mark[];
  left?: Mark[];
}

/** One electron: a filled dot (ink) or a cross (accent colour, so it differs by shape and colour). */
export function Electron({ x, y, mark }: { x: number; y: number; mark: Mark }) {
  if (mark === 'dot') return <circle cx={x} cy={y} r={3.6} className="dg-dot" />;
  const s = 3.8;
  return (
    <g>
      <line x1={x - s} y1={y - s} x2={x + s} y2={y + s} className="dg-accent" />
      <line x1={x - s} y1={y + s} x2={x + s} y2={y - s} className="dg-accent" />
    </g>
  );
}

const SIDE_ANGLE: Record<keyof Sides, number> = { top: -90, right: 0, bottom: 90, left: 180 };

/** A shell of radius r centred on (cx, cy) with the element symbol in the middle. */
export function Shell({ cx, cy, r, symbol, sides }: { cx: number; cy: number; r: number; symbol: string; sides: Sides }) {
  const marks: Array<{ x: number; y: number; mark: Mark }> = [];
  for (const side of Object.keys(SIDE_ANGLE) as Array<keyof Sides>) {
    const list = sides[side] ?? [];
    const offsets = list.length === 1 ? [0] : [-13, 13];
    list.forEach((mark, i) => {
      const a = ((SIDE_ANGLE[side] + offsets[i]!) * Math.PI) / 180;
      marks.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), mark });
    });
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className="dg-thin" />
      <Label x={cx} y={cy} className="dg-text dg-bold">
        {symbol}
      </Label>
      {marks.map((m, i) => (
        <Electron key={i} {...m} />
      ))}
    </g>
  );
}

/** A shell inside square brackets with the ion's charge (e.g. "+", "2−") at the top right. */
export function Ion({
  cx,
  cy,
  r,
  symbol,
  sides,
  charge,
}: {
  cx: number;
  cy: number;
  r: number;
  symbol: string;
  sides: Sides;
  charge: string;
}) {
  const gap = 12;
  const top = cy - r - 10;
  const bottom = cy + r + 10;
  const lx = cx - r - gap;
  const rx = cx + r + gap;
  const serif = 7;
  return (
    <g>
      <path d={`M${lx + serif},${top} L${lx},${top} L${lx},${bottom} L${lx + serif},${bottom}`} className="dg-line" />
      <path d={`M${rx - serif},${top} L${rx},${top} L${rx},${bottom} L${rx - serif},${bottom}`} className="dg-line" />
      <Shell cx={cx} cy={cy} r={r} symbol={symbol} sides={sides} />
      <Label x={rx + 4} y={top + 2} anchor="start" className="dg-text dg-bold">
        {charge}
      </Label>
    </g>
  );
}

/** Eight electrons of one kind, as four pairs: a full outer shell. */
export const full = (mark: Mark): Sides => ({
  top: [mark, mark],
  right: [mark, mark],
  bottom: [mark, mark],
  left: [mark, mark],
});
