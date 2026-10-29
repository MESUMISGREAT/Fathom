/**
 * Two points a quarter-wavelength apart on a sine wave. A separation of lambda/4 corresponds to a
 * quarter of a cycle: 90 degrees, or pi/2 radians.
 */
import { Arrow, Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-progressive-waves-phase-difference';

const W = 640;
const H = 360;
const PAD = 54;

const { sx, sy } = axes({ width: W, height: H, pad: PAD, x: [0, 3.2], y: [-1.5, 1.5] });

const wave = (x: number) => Math.sin(Math.PI * x);

export function ProgressiveWavesPhaseDifference() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        A quarter-wavelength apart means a quarter-cycle phase difference
      </Label>

      {/* axes */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(3.2)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(-1.5)} x2={sx(0)} y2={sy(1.5)} className="dg-line" />

      <Label x={sx(0) + 6} y={sy(1.5) + 16} anchor="start" className="dg-text-small dg-text-muted">
        displacement
      </Label>

      {/* wave */}
      <path d={graph(wave, [0, 3.15], { sx, sy }, [-1.5, 1.5])} className="dg-accent" strokeWidth={2.5} />

      {/* point A at a crest */}
      <circle cx={sx(0.5)} cy={sy(1)} r={4.5} className="dg-dot-accent" />
      <Label x={sx(0.62)} y={sy(1.18)} anchor="start" className="dg-text-small dg-text-accent">
        A
      </Label>

      {/* point B a quarter wavelength later, at equilibrium going down */}
      <circle cx={sx(1.0)} cy={sy(0)} r={4.5} className="dg-dot-accent-2" />
      <Label x={sx(1.0) + 13} y={sy(0) - 14} anchor="start" className="dg-text-small dg-text-accent-2">
        B
      </Label>

      {/* guides */}
      <line x1={sx(0.5)} y1={sy(1)} x2={sx(0.5)} y2={sy(-1.15)} className="dg-muted dg-dashed" />
      <line x1={sx(1.0)} y1={sy(0)} x2={sx(1.0)} y2={sy(-1.15)} className="dg-muted dg-dashed" />

      {/* separation arrow */}
      <Arrow
        x1={sx(0.5)}
        y1={sy(-1.12)}
        x2={sx(1.0)}
        y2={sy(-1.12)}
        double
        className="dg-accent-2"
        headClassName="dg-dot-accent-2"
      />
      <MathLabel
        x={sx(0.75)}
        y={sy(-0.82)}
        tex="\Delta x = \dfrac{\lambda}{4}"
        w={110}
        h={40}
        size="small"
        tone="accent-2"
      />

      <MathLabel
        x={sx(2.0)}
        y={sy(1.15)}
        tex="\Delta\phi = 90° = \dfrac{\pi}{2}"
        w={200}
        h={42}
        size="small"
        tone="accent"
      />

      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        One full cycle is 360° or 2π radians, so a quarter cycle is 90° or π/2.
      </Label>
    </Svg>
  );
}

export default ProgressiveWavesPhaseDifference;
