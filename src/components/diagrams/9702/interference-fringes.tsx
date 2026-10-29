/**
 * The fringe pattern from a double slit: equally spaced bright and dark bands
 * on the screen, with the intensity following cos^2 across them. The fringe
 * spacing x is the distance between neighbouring bright centres.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-interference-fringes';

const W = 640;
const H = 300;
const X0 = 120;
const X1 = 560;
const CENTRE = 340;
const PITCH = 44;

export function InterferenceFringes() {
  const brightLeft = CENTRE - PITCH;
  const brightRight = CENTRE + PITCH;

  let intensity = '';
  for (let x = X0; x <= X1; x += 2) {
    const phase = (Math.PI * (x - CENTRE)) / PITCH;
    const y = 250 - 55 * Math.cos(phase) ** 2;
    intensity += `${intensity === '' ? 'M' : 'L'}${x},${y.toFixed(1)} `;
  }

  const bands = Array.from({ length: 20 }, (_, i) => i - 10);

  return (
    <Svg width={W} height={H}>
      <Label x={320} y={26} className="dg-text dg-bold">
        Double-slit fringes on a screen
      </Label>

      {bands.map((k) => {
        const x = CENTRE + 22 * k - 11;
        const bright = k % 2 === 0;
        return bright ? (
          <rect key={k} x={x} y={56} width={22} height={74} className="dg-fill-accent" />
        ) : (
          <rect key={k} x={x} y={56} width={22} height={74} className="dg-fill-muted" />
        );
      })}
      <rect x={X0} y={56} width={X1 - X0} height={74} fill="none" className="dg-thin" />

      <line x1={brightLeft} y1={142} x2={brightRight} y2={142} className="dg-line" />
      <line x1={brightLeft} y1={136} x2={brightLeft} y2={148} className="dg-line" />
      <line x1={brightRight} y1={136} x2={brightRight} y2={148} className="dg-line" />
      <Label x={CENTRE} y={166} className="dg-text-small dg-text-accent">
        fringe spacing x
      </Label>

      <line x1={X0} y1={250} x2={X1} y2={250} className="dg-grid" />
      <path d={intensity} className="dg-accent" strokeWidth={2} />
      <Label x={X0 - 10} y={200} anchor="end" className="dg-text-small dg-text-muted">
        I
      </Label>
      <Label x={X1 + 10} y={250} anchor="start" className="dg-text-small dg-text-muted">
        position
      </Label>
      <Label x={CENTRE} y={286} className="dg-text-small dg-text-muted">
        bright fringes are equally spaced; intensity falls off slightly at the edges
      </Label>

      <Label x={108} y={94} anchor="end" className="dg-text-small dg-text-muted">
        screen
      </Label>
    </Svg>
  );
}

export default InterferenceFringes;
