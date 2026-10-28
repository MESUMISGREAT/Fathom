/**
 * A transverse wave on a rope (top) above a longitudinal wave of dots (bottom), so the two
 * different oscillation directions can be seen side by side. The dots in the lower panel are
 * drawn at their displaced positions, which is what makes the compressions visible.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-transverse-longitudinal-compare';

const W = 640;
const H = 400;
const X0 = 60;
const X1 = 600;
const LAM = 180;
const TAU = Math.PI * 2;

// --- top panel: transverse, oscillations vertical ---
const SPINE = 140;
const AMP = 30;
const yOf = (x: number) => SPINE - AMP * Math.sin((TAU * (x - X0)) / LAM);
const ropeDots: Array<{ x: number; y: number }> = [];
for (let x = X0; x <= X1; x += 12) ropeDots.push({ x, y: yOf(x) });

// --- bottom panel: longitudinal, oscillations horizontal ---
const ROW = 310;
const shift = (x: number) => 22 * Math.sin((TAU * (x - X0)) / LAM);
const longDots: number[] = [];
for (let x = X0 + 6; x <= X1; x += 9) longDots.push(x + shift(x));
// s = A sin(k(x - X0)): zero and falling at (x - X0) = lambda/2, 3lambda/2, 5lambda/2.
const compressions = [X0 + LAM / 2, X0 + (3 * LAM) / 2, X0 + (5 * LAM) / 2];

export function TransverseLongitudinalCompare() {
  return (
    <Svg width={W} height={H}>
      <Label x={60} y={34} anchor="start" className="dg-text dg-bold">
        Transverse wave: the rope moves at right angles to the travel direction
      </Label>

      {/* equilibrium line */}
      <line x1={X0} y1={SPINE} x2={X1} y2={SPINE} className="dg-grid dg-dashed" />

      {/* rope */}
      {ropeDots.map((d) => (
        <circle key={`r${d.x}`} cx={d.x} cy={d.y} r={2.6} className="dg-dot" />
      ))}

      {/* oscillation arrow at a crest */}
      <Arrow
        x1={465}
        y1={SPINE}
        x2={465}
        y2={SPINE - AMP - 4}
        double
        head={7}
        className="dg-accent"
        headClassName="dg-dot-accent"
      />
      <Label x={455} y={80} anchor="end" className="dg-text-small dg-text-accent">
        oscillation
      </Label>

      {/* travel arrow */}
      <Arrow x1={400} y1={196} x2={492} y2={196} head={8} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={500} y={196} anchor="start" className="dg-text-small dg-text-accent-2">
        travel
      </Label>

      <Label x={60} y={236} anchor="start" className="dg-text dg-bold">
        Longitudinal wave: the particles move back and forth along the travel direction
      </Label>

      {/* equilibrium line for the row */}
      <line x1={X0} y1={ROW} x2={X1} y2={ROW} className="dg-grid dg-dashed" />

      {longDots.map((x) => (
        <circle key={`l${x.toFixed(1)}`} cx={x} cy={ROW} r={3.1} className="dg-dot-accent" />
      ))}

      {/* one particle oscillating along the row */}
      <Arrow
        x1={X0 + LAM / 4}
        y1={276}
        x2={X0 + LAM / 4 + 22}
        y2={276}
        double
        head={7}
        className="dg-accent"
        headClassName="dg-dot-accent"
      />
      <Label x={X0 + LAM / 4 + 32} y={276} anchor="start" className="dg-text-small dg-text-accent">
        oscillation
      </Label>

      {/* compressions */}
      {compressions.map((x) => (
        <g key={`c${x}`}>
          <line x1={x} y1={ROW + 8} x2={x} y2={ROW + 26} className="dg-muted" />
          <Label x={x} y={ROW + 38} className="dg-text-small dg-text-muted">
            compression
          </Label>
        </g>
      ))}

      {/* travel arrow */}
      <Arrow x1={400} y1={376} x2={492} y2={376} head={8} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={500} y={376} anchor="start" className="dg-text-small dg-text-accent-2">
        travel
      </Label>
    </Svg>
  );
}

export default TransverseLongitudinalCompare;
