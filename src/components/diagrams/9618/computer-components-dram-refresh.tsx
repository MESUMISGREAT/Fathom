/**
 * Why DRAM needs refreshing. Charge on a DRAM capacitor holding a 1 (vertical axis) against
 * time. The charge leaks away exponentially. The solid sawtooth shows refreshing: at regular
 * intervals the cell is read and recharged to full, so it never falls to the dashed threshold.
 * The dashed curve shows the same cell with no refresh: it keeps leaking, crosses the threshold
 * and the 1 would be read as a 0, so the data is lost.
 */
import { Label, Svg, axes, plotPath } from '../primitives';

export const diagramKey = 'cs-computer-components-dram-refresh';

const W = 600;
const H = 300;
const TAU = 8;
const PERIOD = 2;
const T_MAX = 10;
const THRESH = 0.5;

export function ComputerComponentsDramRefresh() {
  const { sx, sy } = axes({ width: W, height: H, pad: 50, x: [0, T_MAX], y: [0, 1.1] });
  const left = sx(0);
  const right = sx(T_MAX);
  const bottom = sy(0);
  /** Screen x back to time, so plotPath can draw the real exponential. */
  const tOf = (X: number) => ((X - left) / (right - left)) * T_MAX;
  let saw = '';
  for (let k = 0; k * PERIOD < T_MAX; k++) {
    const t0 = k * PERIOD;
    const seg = plotPath((X) => sy(Math.exp(-(tOf(X) - t0) / TAU)), sx(t0), sx(t0 + PERIOD), 40);
    saw += (k === 0 ? seg : seg.replace(/^M/, 'L')) + ' ';
  }
  const leak = plotPath((X) => sy(Math.exp(-tOf(X) / TAU)), sx(PERIOD), right, 120);
  const lostT = TAU * Math.log(1 / THRESH);
  return (
    <Svg width={W} height={H}>
      <line x1={left} y1={bottom} x2={right + 10} y2={bottom} className="dg-line" />
      <line x1={left} y1={bottom} x2={left} y2={sy(1.1) - 6} className="dg-line" />
      <Label x={right} y={bottom + 18} anchor="end" className="dg-text-small">
        time
      </Label>
      <Label x={left - 8} y={sy(1.1) - 14} anchor="start" className="dg-text-small">
        charge on the capacitor
      </Label>
      <Label x={left - 8} y={sy(1)} anchor="end" className="dg-text-small">
        full
      </Label>

      <line x1={left} y1={sy(THRESH)} x2={right} y2={sy(THRESH)} className="dg-muted dg-dashed" />
      <Label x={left + 8} y={sy(THRESH) + 14} anchor="start" className="dg-text-small dg-text-muted">
        threshold: below this, the 1 reads as 0
      </Label>

      <path d={leak} className="dg-accent-2 dg-dashed" />
      <circle cx={sx(lostT)} cy={sy(THRESH)} r={5} className="dg-dot-accent-2" />
      <Label x={sx(lostT) + 10} y={sy(THRESH) - 30} anchor="start" className="dg-text-small dg-text-accent-2">
        no refresh: data lost
      </Label>

      <path d={saw.trim()} className="dg-accent" />
      {[1, 2, 3, 4].map((k) => (
        <Label key={k} x={sx(k * PERIOD)} y={sy(1) - 14} className="dg-text-small dg-text-accent">
          refresh
        </Label>
      ))}
    </Svg>
  );
}

export default ComputerComponentsDramRefresh;
