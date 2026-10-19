/**
 * An 8 × 8 bitmap smiley with a colour depth of 2 bits, so each pixel holds one
 * of four codes (00, 01, 10, 11). A key on the right says what each code means,
 * and row 7 is pulled out to show the binary actually stored for it:
 * 00 10 10 11 11 10 10 00.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-multimedia-pixel-grid';

const W = 620;
const H = 360;
const CELL = 30;
const GX = 36;
const GY = 46;
const N = 8;

// 0 = background, 1 = cheeks, 2 = face, 3 = eyes and mouth
const image = [
  [0, 0, 2, 2, 2, 2, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 0],
  [2, 2, 3, 2, 2, 3, 2, 2],
  [2, 2, 3, 2, 2, 3, 2, 2],
  [2, 1, 2, 2, 2, 2, 1, 2],
  [2, 2, 3, 2, 2, 3, 2, 2],
  [0, 2, 2, 3, 3, 2, 2, 0],
  [0, 0, 2, 2, 2, 2, 0, 0],
];
const fills = ['dg-fill-surface', 'dg-dot-accent', 'dg-dot-accent-2', 'dg-dot'];
const codes = ['00', '01', '10', '11'];
const meanings = ['background', 'cheeks', 'face', 'eyes and mouth'];
const ROW = 6; // row 7 (0-based 6)

export function MultimediaPixelGrid() {
  const kx = GX + N * CELL + 80;
  return (
    <Svg width={W} height={H}>
      <Label x={GX + (N * CELL) / 2} y={22} className="dg-text dg-bold">
        8 × 8 pixels, colour depth 2 bits
      </Label>
      {image.map((row, r) =>
        row.map((v, c) => (
          <rect
            key={`${r}-${c}`}
            x={GX + c * CELL}
            y={GY + r * CELL}
            width={CELL}
            height={CELL}
            className={`${fills[v]} dg-grid`}
          />
        )),
      )}
      <rect x={GX} y={GY} width={N * CELL} height={N * CELL} className="dg-thin" />
      {/* highlight row 7 */}
      <rect x={GX - 4} y={GY + ROW * CELL - 4} width={N * CELL + 8} height={CELL + 8} className="dg-accent dg-dashed" />
      <Label x={GX + N * CELL + 10} y={GY + ROW * CELL + CELL / 2} anchor="start" className="dg-text-small dg-text-accent">
        row 7
      </Label>

      {/* key */}
      <Label x={kx} y={GY + 4} anchor="start" className="dg-text dg-bold">
        Key (2 bits per pixel)
      </Label>
      {codes.map((code, i) => {
        const y = GY + 24 + i * 40;
        return (
          <g key={code}>
            <rect x={kx} y={y} width={28} height={28} className={`${fills[i]} dg-thin`} />
            <Label x={kx + 40} y={y + 14} anchor="start" className="dg-text dg-mono dg-bold">
              {code}
            </Label>
            <Label x={kx + 72} y={y + 14} anchor="start" className="dg-text-muted">
              {meanings[i]}
            </Label>
          </g>
        );
      })}
      <Label x={kx} y={GY + 196} anchor="start" className="dg-text-small dg-text-muted">
        2 bits give 2² = 4 possible colours
      </Label>

      {/* row 7 as stored */}
      <Arrow x1={GX + (N * CELL) / 2} y1={GY + N * CELL + 6} x2={GX + (N * CELL) / 2} y2={GY + N * CELL + 26} head={7} className="dg-muted" />
      {image[ROW]!.map((v, c) => (
        <Label key={c} x={GX + c * CELL + CELL / 2} y={GY + N * CELL + 40} className="dg-text dg-mono dg-text-accent">
          {codes[v]}
        </Label>
      ))}
      <Label x={GX + N * CELL + 10} y={GY + N * CELL + 40} anchor="start" className="dg-text-small dg-text-muted">
        row 7 as stored: 16 bits
      </Label>
    </Svg>
  );
}

export default MultimediaPixelGrid;
