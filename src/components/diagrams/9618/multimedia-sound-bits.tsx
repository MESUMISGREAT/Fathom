/**
 * Sound file size as a grid of bits: 3 seconds of sound, sampled 8 times per
 * second (sampling rate 8 Hz, tiny so it fits), with a sampling resolution of
 * 4 bits. Each column is one sample (its 4-bit value written top to bottom,
 * most significant bit first). The values come from rounding
 * 7.5 + 7 sin(2πt/1.5) to the nearest whole number (0-15).
 * Total = 8 × 4 × 3 = 96 bits = 12 bytes.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-multimedia-sound-bits';

const W = 620;
const H = 300;
const RATE = 8;
const SECS = 3;
const BITS = 4;
const C = 15; // cell width
const R = 18; // cell height
const SEP = 10; // gap between seconds
const X0 = 150;
const Y0 = 84;
const samples = Array.from({ length: RATE * SECS }, (_, i) => Math.round(7.5 + 7 * Math.sin((2 * Math.PI * (i / RATE)) / 1.5)));
const colX = (i: number) => X0 + i * C + Math.floor(i / RATE) * SEP;

export function MultimediaSoundBits() {
  const right = colX(RATE * SECS - 1) + C;
  const bottom = Y0 + BITS * R;
  return (
    <Svg width={W} height={H}>
      <Label x={(X0 + right) / 2} y={20} className="dg-text dg-bold">
        A sound file is a grid of bits too
      </Label>
      {/* sampling rate brace over second 1 */}
      <path d={`M${colX(0)},${Y0 - 14} V${Y0 - 22} H${colX(RATE - 1) + C} V${Y0 - 14}`} className="dg-muted" />
      <Label x={(colX(0) + colX(RATE - 1) + C) / 2} y={Y0 - 36} className="dg-text-small dg-text-accent">
        sampling rate: 8 samples per second
      </Label>

      {samples.map((v, i) => {
        const bits = v.toString(2).padStart(BITS, '0');
        return (
          <g key={i}>
            {[...bits].map((b, k) => (
              <g key={k}>
                <rect x={colX(i)} y={Y0 + k * R} width={C} height={R} className={b === '1' ? 'dg-fill-accent dg-grid' : 'dg-fill-surface dg-grid'} />
                <Label x={colX(i) + C / 2} y={Y0 + k * R + R / 2 + 1} className="dg-text-small dg-mono">
                  {b}
                </Label>
              </g>
            ))}
            <rect x={colX(i)} y={Y0} width={C} height={BITS * R} className="dg-thin" />
          </g>
        );
      })}

      {/* seconds */}
      {Array.from({ length: SECS }, (_, s) => (
        <Label key={s} x={(colX(s * RATE) + colX(s * RATE + RATE - 1) + C) / 2} y={bottom + 16} className="dg-text-small dg-text-muted">
          {`second ${s + 1}`}
        </Label>
      ))}
      <Arrow x1={X0} y1={bottom + 36} x2={right} y2={bottom + 36} head={7} double className="dg-muted" />
      <Label x={(X0 + right) / 2} y={bottom + 52} className="dg-text-small">
        duration: 3 seconds
      </Label>

      {/* resolution */}
      <Arrow x1={X0 - 14} y1={Y0} x2={X0 - 14} y2={bottom} head={7} double className="dg-muted" />
      <Label x={X0 - 22} y={Y0 + (BITS * R) / 2 - 9} anchor="end" className="dg-text-small dg-text-accent">
        4 bits
      </Label>
      <Label x={X0 - 22} y={Y0 + (BITS * R) / 2 + 9} anchor="end" className="dg-text-small dg-text-muted">
        per sample
      </Label>

      {/* the sum */}
      <Label x={(X0 + right) / 2} y={H - 64} className="dg-text">
        file size (bits) = sampling rate × sampling resolution × duration
      </Label>
      <Label x={(X0 + right) / 2} y={H - 40} className="dg-text dg-mono">
        = 8 × 4 × 3 = 96 bits = 12 bytes
      </Label>
      <Label x={(X0 + right) / 2} y={H - 16} className="dg-text-small dg-text-muted">
        each column is one sample, most significant bit at the top
      </Label>
    </Svg>
  );
}

export default MultimediaSoundBits;
