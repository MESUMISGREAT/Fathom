/**
 * A displacement-distance snapshot of a sine wave, labelled with amplitude and wavelength. The
 * amplitude is measured from the equilibrium line to a crest, not from crest to trough.
 */
import { Arrow, Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-progressive-waves-key-terms';

const W = 640;
const H = 380;
const PAD = 70;

const { sx, sy } = axes({ width: W, height: H, pad: PAD, x: [0, 4.4], y: [-1.5, 1.5] });

const wave = (x: number) => Math.sin(Math.PI * x);

export function ProgressiveWavesKeyTerms() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        A snapshot of a wave: displacement against distance
      </Label>

      {/* axes */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(4.4)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(-1.5)} x2={sx(0)} y2={sy(1.5)} className="dg-line" />

      <Label x={sx(0)} y={sy(1.5) - 16} anchor="start" className="dg-text-small dg-text-muted">
        displacement
      </Label>
      <Label x={sx(4.44)} y={sy(0) + 2} anchor="start" className="dg-text-small dg-text-muted">
        distance
      </Label>

      {/* wave */}
      <path d={graph(wave, [0, 4.3], { sx, sy }, [-1.5, 1.5])} className="dg-accent" strokeWidth={2.5} />

      {/* crest */}
      <circle cx={sx(0.5)} cy={sy(1)} r={4} className="dg-dot-accent" />
      <Label x={sx(0.5)} y={sy(1) - 18} className="dg-text-small dg-text-muted">
        crest
      </Label>

      {/* amplitude */}
      <Arrow
        x1={sx(0.5)}
        y1={sy(0)}
        x2={sx(0.5)}
        y2={sy(1)}
        head={7}
        className="dg-accent"
        headClassName="dg-dot-accent"
      />
      <MathLabel
        x={sx(0.36)}
        y={sy(0.5)}
        tex="A"
        w={34}
        h={26}
        size="small"
        tone="accent"
      />

      {/* wavelength */}
      <Arrow
        x1={sx(0.5)}
        y1={sy(-1.34)}
        x2={sx(2.5)}
        y2={sy(-1.34)}
        double
        className="dg-accent-2"
        headClassName="dg-dot-accent-2"
      />
      <MathLabel
        x={sx(1.95)}
        y={sy(-1.12)}
        tex="\lambda"
        w={40}
        h={26}
        size="small"
        tone="accent-2"
      />

      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        Amplitude is equilibrium to crest; wavelength is crest to crest.
      </Label>
    </Svg>
  );
}

export default ProgressiveWavesKeyTerms;
