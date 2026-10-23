/**
 * Data in a streaming buffer against time, for a video that plays at 5 Mbit/s.
 * 0-5 s: download at 8 Mbit/s, not yet playing, so the buffer fills at
 * 8 Mbit/s to 40 Mbit. 5-20 s: playing, 8 in - 5 out = +3 Mbit/s, reaching
 * 85 Mbit at 20 s. At 20 s the download speed drops to 3 Mbit/s: 3 in - 5 out =
 * -2 Mbit/s, so the buffer empties at 62.5 s and the video stalls.
 */
import { Label, Svg, graph } from '../primitives';

export const diagramKey = 'cs-networks-buffer-level';

const W = 600;
const H = 340;
const L = 70;
const R = 570;
const T = 30;
const B = 290;
const TMAX = 70;
const YMAX = 100;
const sx = (t: number) => L + (t / TMAX) * (R - L);
const sy = (v: number) => B - (v / YMAX) * (B - T);

export const buffer = (t: number) => {
  if (t <= 5) return 8 * t;
  if (t <= 20) return 40 + 3 * (t - 5);
  const v = 85 - 2 * (t - 20);
  return v >= 0 ? v : NaN;
};

export function NetworksBufferLevel() {
  const stall = 62.5;
  return (
    <Svg width={W} height={H}>
      {[20, 40, 60, 80, 100].map((v) => (
        <line key={v} x1={L} y1={sy(v)} x2={R} y2={sy(v)} className="dg-grid" />
      ))}
      <line x1={L} y1={B} x2={R} y2={B} className="dg-line" />
      <line x1={L} y1={B} x2={L} y2={T} className="dg-line" />
      {[0, 10, 20, 30, 40, 50, 60, 70].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={B} x2={sx(t)} y2={B + 5} className="dg-thin" />
          <Label x={sx(t)} y={B + 16} className="dg-text-small">
            {String(t)}
          </Label>
        </g>
      ))}
      {[0, 20, 40, 60, 80, 100].map((v) => (
        <Label key={v} x={L - 8} y={sy(v)} anchor="end" className="dg-text-small">
          {String(v)}
        </Label>
      ))}
      <Label x={(L + R) / 2} y={H - 10} className="dg-text-small">
        time / s
      </Label>
      <Label x={L - 8} y={T - 16} anchor="start" className="dg-text-small">
        data in buffer / Mbit
      </Label>

      <line x1={sx(5)} y1={B} x2={sx(5)} y2={sy(40)} className="dg-muted dg-dashed" />
      <line x1={sx(20)} y1={B} x2={sx(20)} y2={sy(85)} className="dg-muted dg-dashed" />
      <Label x={sx(5) + 6} y={B - 14} anchor="start" className="dg-text-small dg-text-muted">
        playback starts
      </Label>
      <Label x={sx(20) + 6} y={B - 14} anchor="start" className="dg-text-small dg-text-muted">
        download speed drops
      </Label>

      <path d={graph(buffer, [0, stall], { sx, sy }, [0, YMAX], 280)} className="dg-accent" />
      <circle cx={sx(stall)} cy={sy(0)} r={5} className="dg-dot-accent-2" />

      <line x1={sx(2.5) + 3} y1={sy(20)} x2={sx(9) - 4} y2={sy(18)} className="dg-muted" />
      <Label x={sx(9)} y={sy(18)} anchor="start" className="dg-text-small">
        8 in, 0 out
      </Label>
      <Label x={L + 10} y={sy(84)} anchor="start" className="dg-text-small">
        8 in − 5 out
      </Label>
      <Label x={L + 10} y={sy(84) + 16} anchor="start" className="dg-text-small dg-text-accent">
        = +3 Mbit/s
      </Label>
      <Label x={sx(40) + 12} y={sy(62)} anchor="start" className="dg-text-small">
        3 in − 5 out
      </Label>
      <Label x={sx(40) + 12} y={sy(62) + 16} anchor="start" className="dg-text-small dg-text-accent">
        = −2 Mbit/s
      </Label>
      <Label x={552} y={sy(24)} className="dg-text-small dg-text-accent-2">
        buffer empty:
      </Label>
      <Label x={552} y={sy(24) + 16} className="dg-text-small dg-text-accent-2">
        video stalls
      </Label>
    </Svg>
  );
}

export default NetworksBufferLevel;
