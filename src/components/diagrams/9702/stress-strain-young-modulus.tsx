/**
 * Stress against strain: a straight section through the origin whose gradient is the Young
 * modulus, then a curve past the limit of proportionality where E is not defined this way.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-stress-strain-young-modulus';

const W = 560;
const H = 410;
const PAD = 58;

const { sx, sy } = axes({ width: W, height: H, pad: PAD, x: [0, 10], y: [0, 10] });

const linear = (e: number) => e;
const real = (e: number) => (e <= 6 ? e : 6 + 2.6 * (1 - Math.exp(-(e - 6) / 3.4)));

export function StressStrainYoungModulus() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        Stress against strain
      </Label>

      <line x1={sx(0)} y1={sy(0)} x2={sx(10)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(10)} className="dg-line" />

      <Label x={sx(10)} y={sy(0) + 28} anchor="end" className="dg-text-small dg-text-muted">
        strain ε
      </Label>
      <Label x={sx(0) + 10} y={26} anchor="start" className="dg-text-small dg-text-muted">
        stress σ
      </Label>

      {/* dashed extension of the linear part */}
      <path d={graph(linear, [0, 10], { sx, sy }, [0, 10])} className="dg-muted dg-dashed" />

      {/* real curve */}
      <path d={graph(real, [0, 10], { sx, sy }, [0, 10])} className="dg-accent" strokeWidth={2.5} />

      {/* gradient triangle on the straight part */}
      <line x1={sx(2)} y1={sy(2)} x2={sx(5)} y2={sy(2)} className="dg-line" />
      <line x1={sx(5)} y1={sy(2)} x2={sx(5)} y2={sy(5)} className="dg-line" />
      <Label x={sx(3.5)} y={sy(1.6)} className="dg-text-small dg-text-muted">
        Δε
      </Label>
      <Label x={sx(5.3)} y={sy(3.5)} anchor="start" className="dg-text-small dg-text-muted">
        Δσ
      </Label>

      <MathLabel
        x={sx(2.4)}
        y={sy(8.6)}
        tex="\text{gradient} = \dfrac{\Delta\sigma}{\Delta\varepsilon} = E"
        w={230}
        h={46}
      />

      {/* limit of proportionality */}
      <circle cx={sx(6)} cy={sy(6)} r={5} className="dg-dot-accent" />
      <line x1={sx(6)} y1={sy(6)} x2={sx(6)} y2={sy(0)} className="dg-muted dg-dashed" />
      <line x1={sx(6.1)} y1={sy(5.9)} x2={sx(6.6)} y2={sy(5.1)} className="dg-thin" />
      <Label x={sx(6.7)} y={sy(4.9)} anchor="start" className="dg-text-small dg-text-accent">
        limit of
      </Label>
      <Label x={sx(6.7)} y={sy(4.3)} anchor="start" className="dg-text-small dg-text-accent">
        proportionality
      </Label>

      <Label x={sx(9.6)} y={sy(3.0)} anchor="end" className="dg-text-small dg-text-muted">
        E not defined from
      </Label>
      <Label x={sx(9.6)} y={sy(2.4)} anchor="end" className="dg-text-small dg-text-muted">
        the gradient here
      </Label>

      <Label x={sx(0.7)} y={sy(0.5)} anchor="start" className="dg-text-small dg-text-muted">
        straight
      </Label>
    </Svg>
  );
}

export default StressStrainYoungModulus;
