/**
 * A beam becomes plane-polarised at the first filter. The analyser is at angle
 * theta to that plane, so it transmits I0 cos^2 theta.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-polarisation-filter-chain';

const W = 640;
const H = 250;

export function PolarisationFilterChain() {
  return (
    <Svg width={W} height={H}>
      <rect x={14} y={84} width={130} height={68} rx={8} className="dg-fill-muted dg-thin" />
      <Label x={79} y={110} className="dg-text-small dg-bold">
        Unpolarised
      </Label>
      <Label x={79} y={130} className="dg-text-small dg-text-muted">
        light
      </Label>

      <Arrow x1={144} y1={118} x2={166} y2={118} />

      <line x1={176} y1={60} x2={176} y2={178} className="dg-accent-2" strokeWidth={7} />
      <Label x={176} y={198} className="dg-text-small dg-text-muted">
        filter at 0°
      </Label>

      <Arrow x1={186} y1={118} x2={210} y2={118} />

      <rect x={210} y={84} width={144} height={68} rx={8} className="dg-fill-accent dg-thin" />
      <Label x={282} y={110} className="dg-text-small dg-bold">
        Plane-polarised
      </Label>
      <Label x={282} y={130} className="dg-text-small dg-text-muted">
        intensity I₀
      </Label>

      <Arrow x1={354} y1={118} x2={372} y2={118} />

      <line x1={398} y1={66} x2={398} y2={170} transform="rotate(25 398 118)" className="dg-accent" strokeWidth={7} />
      <Label x={398} y={198} className="dg-text-small dg-text-muted">
        analyser at θ
      </Label>

      <Arrow x1={426} y1={118} x2={448} y2={118} />

      <rect x={448} y={84} width={176} height={68} rx={8} className="dg-fill-muted dg-thin" />
      <Label x={536} y={110} className="dg-text-small dg-bold">
        Transmitted
      </Label>
      <Label x={536} y={134} className="dg-text dg-text-accent">
        I = I₀ cos²θ
      </Label>

      <Label x={320} y={232} className="dg-text-small dg-text-muted">
        Each filter multiplies the intensity by cos² of its angle to the previous plane.
      </Label>
    </Svg>
  );
}

export default PolarisationFilterChain;
