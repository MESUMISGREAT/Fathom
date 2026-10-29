/**
 * Top: two waves with a constant phase difference, so the pattern they make is
 * stable. Bottom: the phase difference wanders, so the pattern shifts and no
 * steady fringes appear.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-interference-coherence';

const W = 640;
const H = 320;
const X0 = 90;
const X1 = 590;

function wave(y0: number, phase: (x: number) => number, k = 0.11, amp = 26): string {
  let d = '';
  for (let x = X0; x <= X1; x += 2) {
    d += `${d === '' ? 'M' : 'L'}${x},${(y0 - amp * Math.sin(k * (x - X0) + phase(x))).toFixed(1)} `;
  }
  return d.trim();
}

export function InterferenceCoherence() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={26} className="dg-text dg-bold">
        Coherent or not? Watch the phase difference
      </Label>

      <Label x={90} y={52} anchor="start" className="dg-text-small dg-text-accent">
        coherent
      </Label>
      <path d={wave(90, () => 0)} className="dg-accent" />
      <path d={wave(90, () => 1.2, 0.11, 20)} className="dg-accent-2" />
      <Label x={320} y={136} className="dg-text-small dg-text-muted">
        constant phase difference: the interference pattern stays still
      </Label>

      <line x1={X0} y1={160} x2={X1} y2={160} className="dg-grid" />

      <Label x={90} y={170} anchor="start" className="dg-text-small dg-text-accent">
        not coherent
      </Label>
      <path d={wave(210, () => 0)} className="dg-accent" />
      <path d={wave(210, (x) => 1.2 + 3.2 * Math.sin((x - X0) / 55), 0.11, 20)} className="dg-accent-2" />
      <Label x={320} y={262} className="dg-text-small dg-text-muted">
        the phase difference wanders, so maxima and minima move about
      </Label>
      <Label x={320} y={290} className="dg-text-small dg-text-muted">
        (incoherent sources give no steady fringe pattern)
      </Label>
    </Svg>
  );
}

export default InterferenceCoherence;
