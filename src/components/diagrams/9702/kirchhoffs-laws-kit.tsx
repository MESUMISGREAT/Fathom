/**
 * Shared drawing parts for the 9702 Kirchhoff's-laws diagrams.
 *
 * Everything is drawn with Cambridge circuit symbols: a resistor is an open
 * rectangle, a cell is a long plate (positive) and a short plate (negative).
 * Colours come only from dg-* classes so the diagrams work in light and dark.
 */
import { Arrow, Label } from '../primitives';

export const INK = 'dg-line';
export const ACCENT = 'dg-accent';
export const ACCENT_2 = 'dg-accent-2';

/** A plain connecting wire. */
export function Wire({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={INK} />;
}

/** The dot that marks a junction. */
export function Node({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={5} className="dg-dot" />;
}

/**
 * Resistor as the Cambridge rectangle. `horizontal` draws a long thin box,
 * otherwise a tall thin box; (x, y) is its centre.
 */
export function Resistor({
  x,
  y,
  horizontal = true,
  length = 70,
  breadth = 22,
}: {
  x: number;
  y: number;
  horizontal?: boolean;
  length?: number;
  breadth?: number;
}) {
  return horizontal ? (
    <rect
      x={x - length / 2}
      y={y - breadth / 2}
      width={length}
      height={breadth}
      rx={2}
      className="dg-fill-muted dg-line"
    />
  ) : (
    <rect
      x={x - breadth / 2}
      y={y - length / 2}
      width={breadth}
      height={length}
      rx={2}
      className="dg-fill-muted dg-line"
    />
  );
}

/**
 * A single cell. `vertical` puts it in a vertical wire (plates horizontal);
 * the long plate is the positive terminal. (x, y) is the centre.
 */
export function Cell({ x, y, vertical = false }: { x: number; y: number; vertical?: boolean }) {
  const longPlate = 34;
  const shortPlate = 18;
  const gap = 12;
  if (vertical) {
    return (
      <g>
        <line x1={x - longPlate / 2} y1={y - gap / 2} x2={x + longPlate / 2} y2={y - gap / 2} className={INK} />
        <line
          x1={x - shortPlate / 2}
          y1={y + gap / 2}
          x2={x + shortPlate / 2}
          y2={y + gap / 2}
          className={INK}
          strokeWidth={4}
        />
        <Label x={x + 24} y={y - gap / 2} className="dg-text-small dg-text-muted">
          +
        </Label>
        <Label x={x + 24} y={y + gap / 2} className="dg-text-small dg-text-muted">
          −
        </Label>
      </g>
    );
  }
  return (
    <g>
      <line x1={x - gap / 2} y1={y - longPlate / 2} x2={x - gap / 2} y2={y + longPlate / 2} className={INK} />
      <line
        x1={x + gap / 2}
        y1={y - shortPlate / 2}
        x2={x + gap / 2}
        y2={y + shortPlate / 2}
        className={INK}
        strokeWidth={4}
      />
      <Label x={x - gap / 2} y={y - longPlate / 2 - 10} className="dg-text-small dg-text-muted">
        +
      </Label>
      <Label x={x + gap / 2} y={y + shortPlate / 2 + 10} className="dg-text-small dg-text-muted">
        −
      </Label>
    </g>
  );
}

/** An arrow along a wire showing conventional current, with a label. */
export function CurrentArrow({
  x1,
  y1,
  x2,
  y2,
  label,
  labelX,
  labelY,
  anchor = 'middle',
  tone = 'accent',
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  labelX?: number;
  labelY?: number;
  anchor?: 'start' | 'middle' | 'end';
  tone?: 'accent' | 'accent-2';
}) {
  const stroke = tone === 'accent' ? ACCENT : ACCENT_2;
  const head = tone === 'accent' ? 'dg-dot-accent' : 'dg-dot-accent-2';
  return (
    <g>
      <Arrow x1={x1} y1={y1} x2={x2} y2={y2} head={11} className={stroke} headClassName={head} />
      {label && (
        <Label
          x={labelX ?? (x1 + x2) / 2}
          y={labelY ?? (y1 + y2) / 2}
          anchor={anchor}
          className={tone === 'accent' ? 'dg-text-accent dg-bold dg-text-small' : 'dg-text-accent-2 dg-bold dg-text-small'}
        >
          {label}
        </Label>
      )}
    </g>
  );
}
