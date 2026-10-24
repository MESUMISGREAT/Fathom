/**
 * Feedback keeping a greenhouse near 25 °C, from a simple model. Temperature (16 to 28 °C)
 * against time (0 to 60 minutes). The heater starts on at 18 °C and the temperature climbs
 * along a curve; when it reaches 26 °C the processor switches the heater off and the
 * temperature falls; at 24 °C the heater goes back on. So after the first warm-up the
 * temperature zigzags between 24 and 26 °C, around the 25 °C target. A strip under the graph
 * shows when the heater is on. Model: dT/dt = (34 − T)/20 with the heater on and
 * (15 − T)/20 with it off, T in °C, t in minutes.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-thermostat-graph';

const W = 600;
const H = 340;
const L = 64;
const R = 480;
const TOP = 34;
const BOT = 250;
const T_MAX = 60;
const Y_MIN = 16;
const Y_MAX = 28;

const sx = (t: number) => L + (t / T_MAX) * (R - L);
const sy = (v: number) => BOT - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * (BOT - TOP);

/** Euler simulation of the on/off controller; returns the path and the heater-on intervals. */
function simulate() {
  const dt = 0.02;
  let T = 18;
  let on = true;
  let start = 0;
  const onIntervals: [number, number][] = [];
  let d = `M${sx(0).toFixed(1)},${sy(T).toFixed(1)}`;
  for (let i = 1; i * dt <= T_MAX + 1e-9; i++) {
    const t = i * dt;
    T += (on ? (34 - T) / 20 : (15 - T) / 20) * dt;
    if (on && T >= 26) {
      on = false;
      onIntervals.push([start, t]);
    } else if (!on && T <= 24) {
      on = true;
      start = t;
    }
    if (i % 5 === 0) d += ` L${sx(t).toFixed(1)},${sy(T).toFixed(1)}`;
  }
  if (on) onIntervals.push([start, T_MAX]);
  return { d, onIntervals };
}

export function ComputerComponentsThermostatGraph() {
  const { d, onIntervals } = simulate();
  return (
    <Svg width={W} height={H}>
      {/* axes and ticks */}
      <line x1={L} y1={BOT} x2={R + 8} y2={BOT} className="dg-line" />
      <line x1={L} y1={BOT} x2={L} y2={TOP - 8} className="dg-line" />
      {[0, 10, 20, 30, 40, 50, 60].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={BOT} x2={sx(t)} y2={BOT + 5} className="dg-thin" />
          <Label x={sx(t)} y={BOT + 16} className="dg-text-small">
            {String(t)}
          </Label>
        </g>
      ))}
      {[16, 18, 20, 22, 24, 26, 28].map((v) => (
        <g key={v}>
          <line x1={L - 5} y1={sy(v)} x2={L} y2={sy(v)} className="dg-thin" />
          <Label x={L - 9} y={sy(v)} anchor="end" className="dg-text-small">
            {String(v)}
          </Label>
        </g>
      ))}
      <Label x={(L + R) / 2} y={BOT + 36} className="dg-text-small">
        time (minutes)
      </Label>
      <Label x={L - 30} y={14} anchor="start" className="dg-text-small">
        temperature (°C)
      </Label>

      {/* thresholds */}
      <line x1={L} y1={sy(26)} x2={R} y2={sy(26)} className="dg-grid dg-dashed" />
      <line x1={L} y1={sy(24)} x2={R} y2={sy(24)} className="dg-grid dg-dashed" />
      <line x1={L} y1={sy(25)} x2={R} y2={sy(25)} className="dg-accent-2 dg-dashed" />
      <Label x={R + 8} y={sy(26)} anchor="start" className="dg-text-small dg-text-muted">
        26: heater off
      </Label>
      <Label x={R + 8} y={sy(25)} anchor="start" className="dg-text-small dg-text-accent-2">
        25: target
      </Label>
      <Label x={R + 8} y={sy(24)} anchor="start" className="dg-text-small dg-text-muted">
        24: heater on
      </Label>

      <path d={d} className="dg-accent" />

      {/* heater strip */}
      <Label x={L - 6} y={BOT + 62} anchor="end" className="dg-text-small">
        heater on
      </Label>
      <rect x={L} y={BOT + 55} width={R - L} height={14} className="dg-thin" />
      {onIntervals.map(([a, b]) => (
        <rect key={a} x={sx(a)} y={BOT + 55} width={sx(b) - sx(a)} height={14} className="dg-fill-accent-2 dg-accent-2" />
      ))}
    </Svg>
  );
}

export default ComputerComponentsThermostatGraph;
