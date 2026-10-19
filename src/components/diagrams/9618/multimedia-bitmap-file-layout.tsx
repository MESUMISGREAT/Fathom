/**
 * Layout of a tiny bitmap file: the file header (metadata such as file type,
 * width, height, colour depth and compression) comes first, then the pixel
 * data, 2 bits per pixel, row by row. Using width = 4 and colour depth = 2 from
 * the header, the 16 bits 00 01 10 11 11 10 01 00 decode to a 4 × 2 image.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-multimedia-bitmap-file-layout';

const W = 620;
const H = 330;
const fills = ['dg-fill-surface', 'dg-dot-accent', 'dg-dot-accent-2', 'dg-dot'];
const rows = [
  [0, 1, 2, 3],
  [3, 2, 1, 0],
];
const codes = ['00', '01', '10', '11'];
const header = [
  ['file type', 'bitmap'],
  ['width', '4 pixels'],
  ['height', '2 pixels'],
  ['colour depth', '2 bits'],
  ['compression', 'none'],
];

export function MultimediaBitmapFileLayout() {
  const hx = 24;
  const hy = 44;
  const hw = 236;
  const bh = 166;
  const px = 276;
  const pw = 320;
  const cell = 34;
  const gx = px + pw / 2 - 2 * cell;
  const gy = 250;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        Start of file → end of file
      </Label>

      {/* header */}
      <rect x={hx} y={hy} width={hw} height={bh} rx={6} className="dg-fill-accent dg-accent" />
      <Label x={hx + hw / 2} y={hy + 22} className="dg-text-accent">
        File header (metadata)
      </Label>
      {header.map(([k, v], i) => (
        <g key={k}>
          <Label x={hx + 16} y={hy + 54 + i * 24} anchor="start" className="dg-text-small dg-text-muted">
            {k}
          </Label>
          <Label x={hx + hw - 16} y={hy + 54 + i * 24} anchor="end" className="dg-text-small dg-mono">
            {v}
          </Label>
        </g>
      ))}

      {/* pixel data */}
      <rect x={px} y={hy} width={pw} height={bh} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={px + pw / 2} y={hy + 22} className="dg-text dg-bold">
        Pixel data (2 bits per pixel)
      </Label>
      {rows.map((r, i) => (
        <g key={i}>
          <Label x={px + 22} y={hy + 70 + i * 44} anchor="start" className="dg-text-small dg-text-muted">
            {`row ${i + 1}`}
          </Label>
          {r.map((v, c) => (
            <Label key={c} x={px + 120 + c * 50} y={hy + 70 + i * 44} className="dg-text dg-mono">
              {codes[v]}
            </Label>
          ))}
        </g>
      ))}
      <Label x={px + pw / 2} y={hy + bh - 18} className="dg-text-small dg-text-muted">
        just 0s and 1s: meaningless without the header
      </Label>

      {/* decoding */}
      <Arrow x1={hx + hw / 2} y1={hy + bh + 4} x2={gx - 12} y2={gy + cell} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={hx + 64} y={gy + 40} anchor="start" className="dg-text-small dg-text-accent">
        width 4, depth 2: so
      </Label>
      <Label x={hx + 64} y={gy + 56} anchor="start" className="dg-text-small dg-text-accent">
        8 bits per row
      </Label>
      <Arrow x1={px + pw / 2} y1={hy + bh + 4} x2={px + pw / 2} y2={gy - 6} head={8} className="dg-muted" />
      {rows.map((r, i) =>
        r.map((v, c) => (
          <rect key={`${i}-${c}`} x={gx + c * cell} y={gy + i * cell} width={cell} height={cell} className={`${fills[v]} dg-thin`} />
        )),
      )}
      <Label x={gx + 4 * cell + 14} y={gy + cell} anchor="start" className="dg-text-small dg-text-muted">
        decoded image
      </Label>
    </Svg>
  );
}

export default MultimediaBitmapFileLayout;
