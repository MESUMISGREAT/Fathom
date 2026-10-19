/**
 * A smooth left-to-right brightness ramp stored at four colour depths, all at the
 * same image resolution. Each strip can only use 2^n evenly spaced shades:
 * 1 bit = 2, 2 bits = 4, 3 bits = 8, 8 bits = 256. Fewer shades give visible
 * bands. File size grows only in proportion to the bits per pixel (×1, ×2, ×3, ×8
 * relative to 1 bit), even though the number of shades doubles with every bit.
 * Shades are drawn as the ink colour at opacity level/(2^n − 1), so the ramp
 * works in light and dark themes.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-multimedia-colour-depth-banding';

const W = 620;
const H = 316;
const SX = 156;
const SW = 360;
const SH = 40;
const TOP = 52;
const GAP = 22;

const strips = [
  { bits: 1, size: '×1' },
  { bits: 2, size: '×2' },
  { bits: 3, size: '×3' },
  { bits: 8, size: '×8' },
];

export function MultimediaColourDepthBanding() {
  return (
    <Svg width={W} height={H}>
      <Label x={SX + SW / 2} y={22} className="dg-text dg-bold">
        Same image resolution, different colour depths
      </Label>
      <Label x={SX + SW + 50} y={TOP - 14} className="dg-text-small dg-text-muted">
        file size
      </Label>
      {strips.map((s, i) => {
        const levels = 2 ** s.bits;
        const y = TOP + i * (SH + GAP);
        const w = SW / levels;
        return (
          <g key={s.bits}>
            <Label x={20} y={y + SH / 2 - 9} anchor="start" className="dg-text dg-bold">
              {`${s.bits}-bit`}
            </Label>
            <Label x={20} y={y + SH / 2 + 10} anchor="start" className="dg-text-small dg-text-muted">
              {`2${s.bits === 1 ? '¹' : s.bits === 2 ? '²' : s.bits === 3 ? '³' : '⁸'} = ${levels} shades`}
            </Label>
            {Array.from({ length: levels }, (_, k) => (
              <rect
                key={k}
                x={SX + k * w}
                y={y}
                width={w + (k < levels - 1 ? 0.6 : 0)}
                height={SH}
                className="dg-dot"
                fillOpacity={k / (levels - 1)}
              />
            ))}
            <rect x={SX} y={y} width={SW} height={SH} className="dg-thin" />
            <Label x={SX + SW + 50} y={y + SH / 2} className="dg-text-accent">
              {s.size}
            </Label>
          </g>
        );
      })}
      <Label x={SX + SW / 2} y={H - 18} className="dg-text-small dg-text-muted">
        Each extra bit doubles the shades, but adds only 1 bit per pixel to the file
      </Label>
    </Svg>
  );
}

export default MultimediaColourDepthBanding;
