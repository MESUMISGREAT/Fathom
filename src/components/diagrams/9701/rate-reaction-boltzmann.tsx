/**
 * Boltzmann distribution at one temperature. The shaded area to the right of
 * Ea is the number of molecules with enough energy to react.
 */
import { Label, Svg, axes, graph } from '../primitives';

export const diagramKey = 'chem-rate-reaction-boltzmann';

const W = 600;
const H = 330;
const PAD = 58;
const EA = 3.2;
const XMAX = 6;

const map = axes({ width: W, height: H, pad: PAD, x: [0, XMAX], y: [0, 1.1] });

const f = (x: number) => 2.718 * x * Math.exp(-x);

/** Area under the curve from EA to XMAX, closed down to the axis. */
function tailPath(): string {
  let d = `M${map.sx(EA)},${map.sy(0)}`;
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const x = EA + ((XMAX - EA) * i) / steps;
    d += ` L${map.sx(x)},${map.sy(f(x))}`;
  }
  d += ` L${map.sx(XMAX)},${map.sy(0)} Z`;
  return d;
}

export function RateReactionBoltzmann() {
  return (
    <Svg width={W} height={H}>
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(XMAX)} y2={map.sy(0)} className="dg-line" />
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(0)} y2={map.sy(1.1)} className="dg-line" />

      <path d={tailPath()} className="dg-fill-accent-2" opacity={1} />
      <path d={graph(f, [0, XMAX], map, [0, 1.1])} className="dg-accent" fill="none" />

      <line x1={map.sx(EA)} y1={map.sy(0)} x2={map.sx(EA)} y2={map.sy(f(EA))} className="dg-accent-2 dg-dashed" />
      <Label x={map.sx(EA)} y={map.sy(0) + 18} className="dg-text-small dg-text-accent-2">
        Eₐ
      </Label>

      <Label x={map.sx(4.6)} y={map.sy(0.28)} className="dg-text-small">
        molecules with
      </Label>
      <Label x={map.sx(4.6)} y={map.sy(0.18)} className="dg-text-small">
        E ≥ Eₐ
      </Label>

      <Label x={map.sx(XMAX)} y={map.sy(0) + 42} anchor="end" className="dg-text-small dg-text-muted">
        kinetic energy
      </Label>
      <Label x={map.sx(0) + 6} y={map.sy(1.1) + 4} anchor="start" className="dg-text-small dg-text-muted">
        number of molecules
      </Label>
    </Svg>
  );
}

export default RateReactionBoltzmann;
