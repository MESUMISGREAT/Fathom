/**
 * Perceptual coding in one picture. The x-axis is frequency on a logarithmic
 * scale from 10 Hz to 40 kHz; the y-axis is loudness (illustrative levels, no
 * units). The range of human hearing, about 20 Hz to 20 kHz, is shaded. Six
 * sound components are drawn as vertical bars: 150 Hz, a loud 1 kHz sound and
 * 6 kHz are kept (solid). A 12 Hz component (below the hearing range), a
 * 25 kHz component (above it) and a quiet 1.25 kHz component that lies under
 * the dashed masking threshold of the loud 1 kHz sound are removed (dashed).
 */
import { Label, Svg, axes } from '../primitives';

export const diagramKey = 'cs-compression-sound-masking';

const W = 620;
const H = 360;
const PAD = 56;
const LX: [number, number] = [1, Math.log10(40000)];
const LY: [number, number] = [0, 100];
const { sx: sxl, sy } = axes({ width: W, height: H - 30, pad: PAD, x: LX, y: LY });
const sx = (f: number) => sxl(Math.log10(f));

// Masking threshold of the 1 kHz sound: peak 75 at 1 kHz, falling to 0 at 500 Hz and at 4 kHz.
const PEAK = 75;
function mask(f: number): number {
  const x = Math.log10(f);
  return x < 3 ? PEAK - (PEAK / Math.log10(2)) * (3 - x) : PEAK - (PEAK / Math.log10(4)) * (x - 3);
}

const parts = [
  { f: 12, level: 55, kept: false, note: 'too low to hear' },
  { f: 150, level: 50, kept: true, note: '' },
  { f: 1000, level: 85, kept: true, note: 'loud sound' },
  { f: 1250, level: 35, kept: false, note: 'masked' },
  { f: 6000, level: 45, kept: true, note: '' },
  { f: 25000, level: 50, kept: false, note: 'too high to hear' },
];

export function CompressionSoundMasking() {
  const y0 = sy(0);
  const maskPts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const lf = Math.log10(500) + ((Math.log10(4000) - Math.log10(500)) * i) / 80;
    const f = 10 ** lf;
    maskPts.push(`${i === 0 ? 'M' : 'L'}${sx(f).toFixed(2)},${sy(Math.max(0, mask(f))).toFixed(2)}`);
  }
  return (
    <Svg width={W} height={H}>
      {/* hearing range */}
      <rect x={sx(20)} y={sy(100)} width={sx(20000) - sx(20)} height={y0 - sy(100)} className="dg-fill-accent" />
      <Label x={(sx(20) + sx(20000)) / 2} y={sy(100) + 14} className="dg-text-small dg-text-accent">
        range of human hearing (about 20 Hz to 20 kHz)
      </Label>

      {/* axes */}
      <line x1={sx(10)} y1={y0} x2={sx(40000)} y2={y0} className="dg-line" />
      <line x1={sx(10)} y1={y0} x2={sx(10)} y2={sy(100)} className="dg-line" />
      {[10, 100, 1000, 10000].map((f) => (
        <g key={f}>
          <line x1={sx(f)} y1={y0} x2={sx(f)} y2={y0 + 6} className="dg-thin" />
          <Label x={sx(f)} y={y0 + 18} className="dg-text-small">
            {f >= 1000 ? `${f / 1000} kHz` : `${f} Hz`}
          </Label>
        </g>
      ))}
      <Label x={(sx(10) + sx(40000)) / 2} y={y0 + 40} className="dg-text-muted">
        frequency (logarithmic scale)
      </Label>
      <text
        x={sx(10) - 18}
        y={(y0 + sy(100)) / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        className="dg-text-muted"
        transform={`rotate(-90 ${sx(10) - 18} ${(y0 + sy(100)) / 2})`}
      >
        loudness
      </text>

      {/* masking threshold of the loud sound */}
      <path d={maskPts.join(' ')} className="dg-accent-2 dg-dashed" />
      <Label x={sx(2600)} y={sy(62)} anchor="start" className="dg-text-small dg-text-accent-2">
        masking threshold
      </Label>

      {parts.map((p) => {
        const x = sx(p.f);
        const top = sy(p.level);
        return (
          <g key={p.f}>
            <line x1={x} y1={y0} x2={x} y2={top} className={p.kept ? 'dg-line' : 'dg-muted dg-dashed'} />
            <circle cx={x} cy={top} r={5} className={p.kept ? 'dg-dot' : 'dg-fill-surface dg-muted'} />
            {p.note && (
              <Label
                x={p.f === 1250 ? x + 8 : x}
                y={p.f === 1250 ? top : top - 16}
                anchor={p.f === 1250 ? 'start' : 'middle'}
                className={p.kept ? 'dg-text-small dg-bold' : 'dg-text-small dg-text-muted'}
              >
                {p.note}
              </Label>
            )}
          </g>
        );
      })}

      {/* key */}
      <line x1={W - 190} y1={H - 14} x2={W - 172} y2={H - 14} className="dg-line" />
      <Label x={W - 166} y={H - 14} anchor="start" className="dg-text-small">
        kept
      </Label>
      <line x1={W - 126} y1={H - 14} x2={W - 108} y2={H - 14} className="dg-muted dg-dashed" />
      <Label x={W - 102} y={H - 14} anchor="start" className="dg-text-small">
        removed
      </Label>
    </Svg>
  );
}

export default CompressionSoundMasking;
