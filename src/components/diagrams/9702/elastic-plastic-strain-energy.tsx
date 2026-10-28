/**
 * Elastic potential energy as the area of a triangle. Within the limit of proportionality the
 * force-extension graph is a straight line, so the area under it is 1/2 * base * height, giving
 * E_P = 1/2 F x = 1/2 k x^2.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-elastic-plastic-strain-energy';

const W = 540;
const H = 410;
const PAD = 60;

const { sx, sy } = axes({ width: W, height: H, pad: PAD, x: [0, 6], y: [0, 10] });

const k = 1.5;
const force = (x: number) => k * x;
const xEnd = 5;
const fEnd = force(xEnd);

export function ElasticPlasticStrainEnergy() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        The stored energy is the shaded area
      </Label>

      {/* axes */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(6)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(10)} className="dg-line" />


      <Label x={sx(0) - 12} y={sy(9.4)} anchor="end" className="dg-text-small dg-text-muted">
        force F
      </Label>

      {/* shaded triangle */}
      <path
        d={`M${sx(0)},${sy(0)} L${sx(xEnd)},${sy(0)} L${sx(xEnd)},${sy(fEnd)} Z`}
        className="dg-fill-accent"
        opacity={1}
        stroke="none"
      />

      {/* line */}
      <path d={graph(force, [0, xEnd], { sx, sy }, [0, 10])} className="dg-accent" strokeWidth={2.5} />

      {/* dashed height */}
      <line
        x1={sx(xEnd)}
        y1={sy(fEnd)}
        x2={sx(xEnd)}
        y2={sy(0)}
        className="dg-muted dg-dashed"
      />

      {/* base and height labels */}
      <line x1={sx(0)} y1={sy(0) + 32} x2={sx(xEnd)} y2={sy(0) + 32} className="dg-thin" />
      <line x1={sx(0)} y1={sy(0) + 27} x2={sx(0)} y2={sy(0) + 37} className="dg-thin" />
      <line x1={sx(xEnd)} y1={sy(0) + 27} x2={sx(xEnd)} y2={sy(0) + 37} className="dg-thin" />
      <Label x={sx(xEnd / 2)} y={sy(0) + 52} className="dg-text-small dg-text-muted">
        extension x
      </Label>
      <MathLabel
        x={sx(xEnd) + 22}
        y={sy(fEnd / 2)}
        tex="F"
        w={30}
        h={26}
        size="small"
        tone="accent"
      />

      <MathLabel
        x={sx(3.15)}
        y={sy(9.1)}
        tex="E_P = \dfrac{1}{2}Fx = \dfrac{1}{2}kx^2"
        w={270}
        h={48}
        tone="accent"
      />

      <Label x={sx(2.95)} y={sy(1.75)} className="dg-text-small dg-text-muted">
        area of triangle
      </Label>
    </Svg>
  );
}

export default ElasticPlasticStrainEnergy;
