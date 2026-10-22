/**
 * Why halving the resolution quarters the file size. The same circle is drawn
 * as a bitmap twice, at the same physical size. Left: 16 × 12 = 192 pixels.
 * Right: half the width and half the height in pixels, 8 × 6 = 48 pixels, so
 * each pixel covers four of the original pixels and the circle looks blockier.
 * A pixel is filled when its centre lies inside the circle. At 24-bit colour
 * depth the sizes are 576 bytes and 144 bytes: one quarter.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-resolution-quarter';

const W = 620;
const H = 316;
const SIDE_W = 240; // physical width of each picture
const SIDE_H = 180;
const Y0 = 44;

function Bitmap({ x0, cols, rows }: { x0: number; cols: number; rows: number }) {
  const cw = SIDE_W / cols;
  const ch = SIDE_H / rows;
  // circle in picture units (0..SIDE_W, 0..SIDE_H)
  const cx = SIDE_W / 2;
  const cy = SIDE_H / 2;
  const r = 80;
  const cells = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const px = (i + 0.5) * cw;
      const py = (j + 0.5) * ch;
      const inside = (px - cx) ** 2 + (py - cy) ** 2 <= r * r;
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={x0 + i * cw}
          y={Y0 + j * ch}
          width={cw}
          height={ch}
          className={inside ? 'dg-dot-accent' : 'dg-fill-surface'}
        />,
      );
    }
  }
  return (
    <g>
      {cells}
      {Array.from({ length: cols + 1 }, (_, i) => (
        <line key={`v${i}`} x1={x0 + i * cw} y1={Y0} x2={x0 + i * cw} y2={Y0 + SIDE_H} className="dg-grid" />
      ))}
      {Array.from({ length: rows + 1 }, (_, j) => (
        <line key={`h${j}`} x1={x0} y1={Y0 + j * ch} x2={x0 + SIDE_W} y2={Y0 + j * ch} className="dg-grid" />
      ))}
      <rect x={x0} y={Y0} width={SIDE_W} height={SIDE_H} className="dg-thin" />
      <circle cx={x0 + cx} cy={Y0 + cy} r={r} className="dg-muted dg-dashed" />
    </g>
  );
}

export function CompressionResolutionQuarter() {
  const L = 50;
  const R = W - 50 - SIDE_W;
  const big = { cols: 16, rows: 12 };
  const small = { cols: 8, rows: 6 };
  const n1 = big.cols * big.rows;
  const n2 = small.cols * small.rows;
  return (
    <Svg width={W} height={H}>
      <Label x={L + SIDE_W / 2} y={22} className="dg-text dg-bold">
        {`${big.cols} × ${big.rows} = ${n1} pixels`}
      </Label>
      <Label x={R + SIDE_W / 2} y={22} className="dg-text dg-bold">
        {`${small.cols} × ${small.rows} = ${n2} pixels`}
      </Label>
      <Bitmap x0={L} {...big} />
      <Bitmap x0={R} {...small} />
      <Label x={L + SIDE_W / 2} y={Y0 + SIDE_H + 22} className="dg-text-muted">
        {`24-bit colour: ${n1} × 3 = ${n1 * 3} bytes`}
      </Label>
      <Label x={R + SIDE_W / 2} y={Y0 + SIDE_H + 22} className="dg-text-muted">
        {`24-bit colour: ${n2} × 3 = ${n2 * 3} bytes`}
      </Label>
      <Label x={W / 2} y={H - 40} className="dg-text-accent">
        Half the width × half the height = one quarter of the pixels
      </Label>
      <Label x={W / 2} y={H - 16} className="dg-text">
        so one quarter of the file size, and a blockier circle
      </Label>
    </Svg>
  );
}

export default CompressionResolutionQuarter;
