/**
 * Bitmap file size as a box of bits: an 8 × 6 pixel image with a colour depth
 * of 3 bits drawn as three stacked layers (one bit of every pixel per layer).
 * One pixel (top right) is highlighted through all three layers: its 3 bits are
 * 1, 0, 1. Total = 8 × 6 × 3 = 144 bits = 18 bytes.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-multimedia-bit-planes';

const W = 620;
const H = 330;
const CELL = 24;
const COLS = 8;
const ROWS = 6;
const X0 = 70;
const Y0 = 130;
const DX = 28;
const DY = -24;
const bits = ['1', '0', '1']; // front, middle, back

function Layer({ k }: { k: number }) {
  const x = X0 + k * DX;
  const y = Y0 + k * DY;
  const w = COLS * CELL;
  const h = ROWS * CELL;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} className="dg-fill-surface" />
      <rect x={x} y={y} width={w} height={h} className="dg-fill-accent" />
      {Array.from({ length: COLS - 1 }, (_, i) => (
        <line key={`v${i}`} x1={x + (i + 1) * CELL} y1={y} x2={x + (i + 1) * CELL} y2={y + h} className="dg-grid" />
      ))}
      {Array.from({ length: ROWS - 1 }, (_, i) => (
        <line key={`h${i}`} x1={x} y1={y + (i + 1) * CELL} x2={x + w} y2={y + (i + 1) * CELL} className="dg-grid" />
      ))}
      <rect x={x + (COLS - 1) * CELL} y={y} width={CELL} height={CELL} className="dg-fill-accent-2 dg-accent-2" />
      <Label x={x + (COLS - 0.5) * CELL} y={y + CELL / 2 + 1} className="dg-text-small dg-mono dg-bold">
        {bits[k]}
      </Label>
      <rect x={x} y={y} width={w} height={h} className="dg-thin" />
    </g>
  );
}

export function MultimediaBitPlanes() {
  const right = X0 + COLS * CELL;
  const bottom = Y0 + ROWS * CELL;
  const tx = 400;
  return (
    <Svg width={W} height={H}>
      {[2, 1, 0].map((k) => (
        <Layer key={k} k={k} />
      ))}

      {/* width */}
      <Arrow x1={X0} y1={bottom + 16} x2={right} y2={bottom + 16} head={7} double className="dg-muted" />
      <Label x={(X0 + right) / 2} y={bottom + 34} className="dg-text-small">
        width = 8 pixels
      </Label>
      {/* height */}
      <Arrow x1={X0 - 16} y1={Y0} x2={X0 - 16} y2={bottom} head={7} double className="dg-muted" />
      <text
        x={X0 - 32}
        y={(Y0 + bottom) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 ${X0 - 32} ${(Y0 + bottom) / 2})`}
        className="dg-text-small"
      >
        height = 6 pixels
      </text>
      {/* depth */}
      <Arrow x1={right + 10} y1={bottom + 6} x2={right + 10 + 2 * DX} y2={bottom + 6 + 2 * DY} head={7} double className="dg-muted" />
      <Label x={right + 2 * DX + 22} y={bottom - 28} anchor="start" className="dg-text-small">
        colour depth = 3 bits
      </Label>
      <Label x={right + 2 * DX + 22} y={bottom - 12} anchor="start" className="dg-text-small dg-text-muted">
        (one layer per bit)
      </Label>

      {/* one pixel */}
      <Arrow x1={right + 2 * DX + 60} y1={Y0 + 2 * DY - 30} x2={right + 2 * DX + 6} y2={Y0 + 2 * DY + 10} head={7} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={right + 2 * DX + 64} y={Y0 + 2 * DY - 38} anchor="start" className="dg-text-small dg-text-accent-2">
        one pixel = 3 bits (here 101)
      </Label>

      {/* the sum */}
      <Label x={tx} y={130} anchor="start" className="dg-text dg-bold">
        file size (bits)
      </Label>
      <Label x={tx} y={152} anchor="start" className="dg-text">
        = width × height × colour depth
      </Label>
      <Label x={tx} y={174} anchor="start" className="dg-text dg-mono">
        = 8 × 6 × 3 = 144 bits
      </Label>
      <Label x={tx} y={196} anchor="start" className="dg-text dg-mono">
        = 144 ÷ 8 = 18 bytes
      </Label>
    </Svg>
  );
}

export default MultimediaBitPlanes;
