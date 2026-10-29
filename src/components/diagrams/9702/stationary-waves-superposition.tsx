/**
 * Superposition of two pulses on a string at three moments. The pulses keep
 * their shape and speed; where they overlap the displacements add, so the
 * resultant height is 2A at the crossing point.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-stationary-waves-superposition';

const W = 640;
const H = 360;
const X0 = 110;
const X1 = 620;
const AMP = 24;
const WIDTH = 30;

const pulse = (x: number, centre: number) => AMP * Math.exp(-(((x - centre) / WIDTH) ** 2));

function curve(y0: number, f: (x: number) => number): string {
  let d = '';
  for (let x = X0; x <= X1; x += 2) {
    d += `${d === '' ? 'M' : 'L'}${x},${(y0 - f(x)).toFixed(1)} `;
  }
  return d.trim();
}

export function StationaryWavesSuperposition() {
  const rows = [
    { y: 90, c1: 250, c2: 470, label: 't = 0' },
    { y: 200, c1: 360, c2: 360, label: 'later' },
    { y: 310, c1: 470, c2: 250, label: 'later still' },
  ];
  return (
    <Svg width={W} height={H}>
      {rows.map((r) => (
        <g key={r.label + r.y}>
          <line x1={X0} y1={r.y} x2={X1} y2={r.y} className="dg-grid" />
          <Label x={40} y={r.y} anchor="start" className="dg-text-small dg-text-muted">
            {r.label}
          </Label>
        </g>
      ))}

      {/* first snapshot: two separate pulses */}
      <path d={curve(90, (x) => pulse(x, 250))} className="dg-accent" />
      <path d={curve(90, (x) => pulse(x, 470))} className="dg-accent-2" />
      <Label x={250} y={48} className="dg-text-small dg-text-accent">
        pulse 1 →
      </Label>
      <Label x={470} y={48} className="dg-text-small dg-text-accent-2">
        ← pulse 2
      </Label>

      {/* second snapshot: overlapping, individual pulses dashed */}
      <path d={curve(200, (x) => pulse(x, 360))} className="dg-muted dg-dashed" />
      <path d={curve(200, (x) => pulse(x, 360))} className="dg-muted dg-dashed" />
      <path d={curve(200, (x) => pulse(x, 360) + pulse(x, 360))} className="dg-line" strokeWidth={2.5} />
      <Label x={360} y={122} className="dg-text dg-bold">
        resultant: A + A = 2A
      </Label>

      {/* third snapshot: separated again, unchanged */}
      <path d={curve(310, (x) => pulse(x, 470))} className="dg-accent" />
      <path d={curve(310, (x) => pulse(x, 250))} className="dg-accent-2" />
      <Label x={320} y={344} className="dg-text-small dg-text-muted">
        Each pulse leaves the meeting point unchanged: superposition does not alter the waves themselves.
      </Label>
    </Svg>
  );
}

export default StationaryWavesSuperposition;
