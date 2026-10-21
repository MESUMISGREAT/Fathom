/**
 * A 12 × 8 pixel heart (R = red, W = white background) with each row's
 * run-length encoding written beside it, runs stopping at the end of each row:
 * 2W 3R 2W 3R 2W / 1W 10R 1W / 12R / 12R / 1W 10R 1W / 2W 8R 2W / 4W 4R 4W /
 * 5W 2R 5W. Total 22 runs; at 1 byte per count and 1 byte per colour code
 * that is 44 bytes, against 96 bytes for 96 pixels at 8 bits each.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-bitmap-rle';

const W = 600;
const H = 344;
const CELL = 24;
const GX = 24;
const GY = 50;

const image = [
  'WWRRRWWRRRWW',
  'WRRRRRRRRRRW',
  'RRRRRRRRRRRR',
  'RRRRRRRRRRRR',
  'WRRRRRRRRRRW',
  'WWRRRRRRRRWW',
  'WWWWRRRRWWWW',
  'WWWWWRRWWWWW',
];

function rowRuns(row: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < row.length; ) {
    let j = i;
    while (j < row.length && row[j] === row[i]) j++;
    out.push(`${j - i}${row[i]}`);
    i = j;
  }
  return out;
}

export function CompressionBitmapRle() {
  const cols = image[0]!.length;
  const rx = GX + cols * CELL + 28;
  const totalRuns = image.reduce((n, r) => n + rowRuns(r).length, 0);
  const pixels = cols * image.length;
  return (
    <Svg width={W} height={H}>
      <Label x={GX + (cols * CELL) / 2} y={22} className="dg-text dg-bold">
        {`${cols} × ${image.length} pixels`}
      </Label>
      <Label x={rx} y={22} anchor="start" className="dg-text dg-bold">
        RLE, row by row
      </Label>
      {image.map((row, r) => (
        <g key={r}>
          {[...row].map((p, c) => (
            <rect
              key={c}
              x={GX + c * CELL}
              y={GY + r * CELL}
              width={CELL}
              height={CELL}
              className={p === 'R' ? 'dg-dot-accent-2' : 'dg-fill-surface'}
            />
          ))}
          <Label x={rx} y={GY + r * CELL + CELL / 2} anchor="start" className="dg-text dg-mono">
            {rowRuns(row).join(' ')}
          </Label>
          <Label x={W - 12} y={GY + r * CELL + CELL / 2} anchor="end" className="dg-text-small dg-text-muted">
            {`${rowRuns(row).length} run${rowRuns(row).length === 1 ? '' : 's'}`}
          </Label>
        </g>
      ))}
      {/* pixel grid lines */}
      {Array.from({ length: cols + 1 }, (_, c) => (
        <line key={`v${c}`} x1={GX + c * CELL} y1={GY} x2={GX + c * CELL} y2={GY + image.length * CELL} className="dg-grid" />
      ))}
      {Array.from({ length: image.length + 1 }, (_, r) => (
        <line key={`h${r}`} x1={GX} y1={GY + r * CELL} x2={GX + cols * CELL} y2={GY + r * CELL} className="dg-grid" />
      ))}
      <rect x={GX} y={GY} width={cols * CELL} height={image.length * CELL} className="dg-thin" />

      <rect x={GX} y={GY + image.length * CELL + 18} width={14} height={14} className="dg-dot-accent-2" />
      <Label x={GX + 20} y={GY + image.length * CELL + 25} anchor="start" className="dg-text-small">
        R = red (heart)
      </Label>
      <rect x={GX + 130} y={GY + image.length * CELL + 18} width={14} height={14} className="dg-fill-surface dg-thin" />
      <Label x={GX + 150} y={GY + image.length * CELL + 25} anchor="start" className="dg-text-small">
        W = white (background)
      </Label>

      <Label x={W / 2} y={H - 40} className="dg-text">
        {`Uncompressed, 8 bits per pixel: ${pixels} pixels = ${pixels} bytes`}
      </Label>
      <Label x={W / 2} y={H - 16} className="dg-text-accent">
        {`RLE: ${totalRuns} runs × 2 bytes (count + colour) = ${totalRuns * 2} bytes`}
      </Label>
    </Svg>
  );
}

export default CompressionBitmapRle;
