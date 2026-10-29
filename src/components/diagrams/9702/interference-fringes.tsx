/**
 * The intensity across a double-slit fringe pattern: equally spaced maxima
 * where the path difference is a whole number of wavelengths, with minima
 * between them. The fringe spacing x is the distance between neighbouring
 * maxima.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-interference-fringes';

const W = 640;
const H = 320;
const X0 = 100;
const X1 = 580;
const BASE = 240;
const CENTRE = 340;
const PITCH = 60;

export function InterferenceFringes() {
  let intensity = '';
  for (let x = X0; x <= X1; x += 2) {
    const phase = (Math.PI * (x - CENTRE)) / PITCH;
    const y = BASE - 120 * Math.cos(phase) ** 2;
    intensity += `${intensity === '' ? 'M' : 'L'}${x},${y.toFixed(1)} `;
  }

  const maxima = [CENTRE - 2 * PITCH, CENTRE - PITCH, CENTRE, CENTRE + PITCH, CENTRE + 2 * PITCH];

  return (
    <Svg width={W} height={H}>
      <Label x={320} y={26} className="dg-text dg-bold">
        Intensity across the fringes
      </Label>

      <line x1={X0} y1={BASE} x2={X1} y2={BASE} className="dg-line" />
      <line x1={X0} y1={BASE} x2={X0} y2={BASE - 140} className="dg-line" />

      <path d={intensity} className="dg-accent" strokeWidth={2.2} />

      {maxima.map((x) => (
        <line key={x} x1={x} y1={BASE} x2={x} y2={BASE - 120} className="dg-dashed dg-muted" />
      ))}

      <line x1={CENTRE} y1={BASE + 14} x2={CENTRE + PITCH} y2={BASE + 14} className="dg-line" />
      <line x1={CENTRE} y1={BASE + 8} x2={CENTRE} y2={BASE + 20} className="dg-line" />
      <line x1={CENTRE + PITCH} y1={BASE + 8} x2={CENTRE + PITCH} y2={BASE + 20} className="dg-line" />
      <Label x={CENTRE + PITCH / 2} y={BASE + 36} className="dg-text-small dg-text-accent">
        fringe spacing x
      </Label>

      <Label x={CENTRE} y={BASE - 140} className="dg-text-small dg-text-muted">
        bright
      </Label>

      <Label x={X0 - 10} y={BASE - 140} anchor="end" className="dg-text-small dg-text-muted">
        I
      </Label>
      <Label x={X1 + 8} y={BASE} anchor="start" className="dg-text-small dg-text-muted">
        position
      </Label>
      <Label x={CENTRE} y={300} className="dg-text-small dg-text-muted">
        equally spaced bright fringes, with darkness between them
      </Label>
    </Svg>
  );
}

export default InterferenceFringes;
