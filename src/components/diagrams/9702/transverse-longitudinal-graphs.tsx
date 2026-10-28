/**
 * Two displacement-distance graphs. The top one is a transverse wave, where the graph is the
 * shape you would photograph. The bottom one is a longitudinal wave: the same sine curve, but
 * the row of dots above it shows that the crests are not compressions — the compressions sit at
 * the steepest zero crossings.
 */
import { Arrow, Label, MathLabel, Svg, graph } from '../primitives';

export const diagramKey = 'phys-transverse-longitudinal-graphs';

const W = 640;
const H = 515;
const TAU = Math.PI * 2;

// Shared horizontal mapping: x runs 0..3 wavelengths across the plot.
const sx = (x: number) => 90 + (x / 3) * 510;
const sine = (x: number) => Math.sin(TAU * x);

// --- top panel: transverse, the graph is the shape ---
const ZERO_A = 150;
const AMP_A = 45;
const syA = (y: number) => ZERO_A - y * AMP_A;

// --- bottom panel: longitudinal ---
const ROW = 340;
const ZERO_B = 430;
const AMP_B = 28;
const syB = (y: number) => ZERO_B - y * AMP_B;
// Dots drawn at their displaced positions: x = x_eq + A sin(k x_eq), in wavelength units.
const A_UNITS = 0.12;
const dots: number[] = [];
for (let xe = 0.03; xe < 2.97; xe += 0.05) dots.push(sx(xe + A_UNITS * Math.sin(TAU * xe)));
const compressions = [0.5, 1.5, 2.5];

export function TransverseLongitudinalGraphs() {
  return (
    <Svg width={W} height={H}>
      <Label x={60} y={34} anchor="start" className="dg-text dg-bold">
        Transverse wave: the graph looks like the wave itself
      </Label>

      {/* axes */}
      <line x1={sx(0)} y1={ZERO_A} x2={sx(3)} y2={ZERO_A} className="dg-line" />
      <line x1={sx(0)} y1={ZERO_A - AMP_A} x2={sx(0)} y2={ZERO_A + AMP_A} className="dg-line" />
      <Label x={sx(0)} y={92} anchor="start" className="dg-text-small dg-text-muted">
        displacement
      </Label>
      <Label x={sx(3)} y={ZERO_A + 18} anchor="end" className="dg-text-small dg-text-muted">
        distance
      </Label>

      <path d={graph(sine, [0, 3], { sx, sy: syA }, [-1, 1], 300)} className="dg-accent" strokeWidth={2.5} />

      <Label x={sx(0.25)} y={88} className="dg-text-small dg-text-muted">
        crest
      </Label>
      <Label x={sx(0.75)} y={212} className="dg-text-small dg-text-muted">
        trough
      </Label>

      {/* one wavelength, crest to crest */}
      <Arrow
        x1={sx(0.25)}
        y1={232}
        x2={sx(1.25)}
        y2={232}
        double
        head={7}
        className="dg-accent-2"
        headClassName="dg-dot-accent-2"
      />
      <MathLabel x={sx(1.25) + 26} y={232} tex="\lambda" w={40} h={26} size="small" tone="accent-2" />
      <Label x={sx(1.25) + 48} y={232} anchor="start" className="dg-text-small dg-text-muted">
        one wavelength
      </Label>

      <Label x={60} y={286} anchor="start" className="dg-text dg-bold">
        Longitudinal wave: the graph is a plot of displacements, not a picture
      </Label>

      {/* the row of particles, drawn where they actually are */}
      <line x1={sx(0)} y1={ROW} x2={sx(3)} y2={ROW} className="dg-grid dg-dashed" />
      {dots.map((x, i) => (
        <circle key={i} cx={x} cy={ROW} r={3} className="dg-dot-accent" />
      ))}

      {/* guides from each compression down to the graph */}
      {compressions.map((x) => (
        <line
          key={x}
          x1={sx(x)}
          y1={ROW + 6}
          x2={sx(x)}
          y2={ZERO_B}
          className="dg-dashed dg-muted"
        />
      ))}
      <Label x={sx(0.5) + 10} y={362} anchor="start" className="dg-text-small dg-text-accent">
        compression
      </Label>

      {/* axes of the displacement-distance graph */}
      <line x1={sx(0)} y1={ZERO_B} x2={sx(3)} y2={ZERO_B} className="dg-line" />
      <line x1={sx(0)} y1={ZERO_B - AMP_B} x2={sx(0)} y2={ZERO_B + AMP_B} className="dg-line" />
      <Label x={sx(0)} y={386} anchor="start" className="dg-text-small dg-text-muted">
        displacement
      </Label>
      <Label x={sx(3)} y={ZERO_B + 18} anchor="end" className="dg-text-small dg-text-muted">
        distance
      </Label>

      <path d={graph(sine, [0, 3], { sx, sy: syB }, [-1, 1], 300)} className="dg-accent" strokeWidth={2.5} />

      {/* wavelength measured compression to compression */}
      <Arrow
        x1={sx(0.5)}
        y1={492}
        x2={sx(1.5)}
        y2={492}
        double
        head={7}
        className="dg-accent-2"
        headClassName="dg-dot-accent-2"
      />
      <MathLabel x={sx(1.0)} y={470} tex="\lambda" w={40} h={22} size="small" tone="accent-2" />

      <Label x={W / 2} y={505} className="dg-text-small dg-text-muted">
        Compressions sit where this graph is steepest — never at its crests.
      </Label>
    </Svg>
  );
}

export default TransverseLongitudinalGraphs;
