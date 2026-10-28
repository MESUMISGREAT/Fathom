/**
 * Two Boltzmann distributions. Raising the temperature lowers and broadens the
 * peak and shifts it right, so the area beyond Ea grows markedly.
 */
import { Label, Svg, axes, graph } from '../primitives';

export const diagramKey = 'chem-rate-reaction-temperature-curves';

const W = 600;
const H = 330;
const PAD = 58;
const EA = 3;
const XMAX = 6;

const map = axes({ width: W, height: H, pad: PAD, x: [0, XMAX], y: [0, 1.1] });

const cold = (x: number) => 2.718 * x * Math.exp(-x);
const hot = (x: number) => 1.8 * x * Math.exp(-0.7 * x);

function tail(g: (x: number) => number): string {
  let d = `M${map.sx(EA)},${map.sy(0)}`;
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const x = EA + ((XMAX - EA) * i) / steps;
    d += ` L${map.sx(x)},${map.sy(g(x))}`;
  }
  d += ` L${map.sx(XMAX)},${map.sy(0)} Z`;
  return d;
}

export function RateReactionTemperatureCurves() {
  return (
    <Svg width={W} height={H}>
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(XMAX)} y2={map.sy(0)} className="dg-line" />
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(0)} y2={map.sy(1.1)} className="dg-line" />

      <path d={tail(cold)} className="dg-fill-accent-2" opacity={1} />
      <path d={tail(hot)} className="dg-fill-accent" opacity={1} />

      <path d={graph(cold, [0, XMAX], map, [0, 1.1])} className="dg-accent-2" fill="none" />
      <path d={graph(hot, [0, XMAX], map, [0, 1.1])} className="dg-accent" fill="none" />

      <line x1={map.sx(EA)} y1={map.sy(0)} x2={map.sx(EA)} y2={map.sy(hot(EA))} className="dg-muted dg-dashed" />
      <Label x={map.sx(EA)} y={map.sy(0) + 18} className="dg-text-small dg-text-muted">
        Eₐ
      </Label>

      <line x1={70} y1={34} x2={96} y2={34} className="dg-accent-2" />
      <Label x={102} y={34} anchor="start" className="dg-text-small">
        lower T
      </Label>
      <line x1={190} y1={34} x2={216} y2={34} className="dg-accent" />
      <Label x={222} y={34} anchor="start" className="dg-text-small">
        higher T
      </Label>

      <Label x={map.sx(XMAX)} y={map.sy(1.06)} anchor="end" className="dg-text-small">
        shaded area = molecules with E ≥ Eₐ
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

export default RateReactionTemperatureCurves;
