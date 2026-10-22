/**
 * One minute of CD-quality stereo sound (44.1 kHz, 16-bit, 2 channels), drawn
 * to scale as horizontal bars: uncompressed 10 584 000 bytes (10.1 MiB),
 * MP3 at 320 kbit/s 2 400 000 bytes (2.29 MiB), MP3 at 128 kbit/s 960 000 bytes
 * (0.92 MiB). The right-hand column gives the time to download each over an
 * 8 Mbit/s connection: 10.6 s, 2.4 s and 0.96 s.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-size-bars';

const W = 600;
const H = 284;
const X0 = 150; // bar start
const BAR_MAX = 290; // px for the x-axis maximum
const AXIS_MAX = 11; // MiB
const MIB = 1024 * 1024;
const BAR_H = 34;
const Y0 = 70;
const GAP = 22;

const rows = [
  { name: 'Uncompressed', bytes: 10_584_000, time: '10.6 s', cls: 'dg-fill-muted dg-thin' },
  { name: 'MP3, 320 kbit/s', bytes: 2_400_000, time: '2.4 s', cls: 'dg-fill-accent dg-accent' },
  { name: 'MP3, 128 kbit/s', bytes: 960_000, time: '0.96 s', cls: 'dg-fill-accent dg-accent' },
];

const sx = (mib: number) => X0 + (mib / AXIS_MAX) * BAR_MAX;

export function CompressionSizeBars() {
  const axisY = Y0 + rows.length * (BAR_H + GAP) - 6;
  const colX = 545; // centre of the download-time column
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        One minute of CD-quality stereo sound
      </Label>
      <Label x={colX} y={40} className="dg-text-small dg-text-muted">
        download time
      </Label>
      <Label x={colX} y={54} className="dg-text-small dg-text-muted">
        at 8 Mbit/s
      </Label>

      {rows.map((r, i) => {
        const y = Y0 + i * (BAR_H + GAP);
        const mib = r.bytes / MIB;
        const end = sx(mib);
        return (
          <g key={r.name}>
            <Label x={X0 - 12} y={y + BAR_H / 2} anchor="end" className="dg-text">
              {r.name}
            </Label>
            <rect x={X0} y={y} width={end - X0} height={BAR_H} className={r.cls} />
            <Label x={end + 8} y={y + BAR_H / 2} anchor="start" className="dg-text dg-bold">
              {`${mib < 3 ? mib.toFixed(2) : mib.toFixed(1)} MiB`}
            </Label>
            <Label x={colX} y={y + BAR_H / 2} className="dg-text-accent">
              {r.time}
            </Label>
          </g>
        );
      })}

      {/* x-axis in MiB, to scale */}
      <line x1={X0} y1={axisY} x2={sx(AXIS_MAX)} y2={axisY} className="dg-thin" />
      <line x1={X0} y1={Y0 - 8} x2={X0} y2={axisY} className="dg-thin" />
      {[0, 2, 4, 6, 8, 10].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={axisY} x2={sx(t)} y2={axisY + 6} className="dg-thin" />
          <Label x={sx(t)} y={axisY + 18} className="dg-text-small">
            {t}
          </Label>
        </g>
      ))}
      <Label x={sx(AXIS_MAX / 2)} y={axisY + 40} className="dg-text-muted">
        file size (MiB)
      </Label>
    </Svg>
  );
}

export default CompressionSizeBars;
