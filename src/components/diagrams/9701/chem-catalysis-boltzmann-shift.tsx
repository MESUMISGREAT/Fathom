/**
 * Maxwell-Boltzmann distribution at a fixed temperature with two thresholds marked.
 *
 * A catalyst does not change the distribution: the curve stays put. It lowers the threshold,
 * so a much larger slice of the same molecules now has enough energy to react. The two
 * shaded tails show that the catalysed fraction is much bigger than the uncatalysed one.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'chem-catalysis-boltzmann-shift';

const W = 620;
const H = 360;
const PAD = 62;
const XMAX = 6;
const EA = 3.4;
const EA_CAT = 2.4;

const map = axes({ width: W, height: H, pad: PAD, x: [0, XMAX], y: [0, 1.15] });

const f = (x: number) => 2.718 * x * Math.exp(-x);

function tail(from: number, closeTo: number): string {
  let d = `M${map.sx(from)},${map.sy(0)}`;
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const x = from + ((closeTo - from) * i) / steps;
    d += ` L${map.sx(x)},${map.sy(f(x))}`;
  }
  d += ` L${map.sx(closeTo)},${map.sy(0)} Z`;
  return d;
}

export function ChemCatalysisBoltzmannShift() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Same distribution, lower threshold
      </Label>

      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(XMAX)} y2={map.sy(0)} className="dg-line" />
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(0)} y2={map.sy(1.15)} className="dg-line" />
      <Label x={W / 2} y={H - 42} className="dg-text-small dg-text-muted">
        molecular energy
      </Label>
      <Label x={8} y={40} anchor="start" className="dg-text-small dg-text-muted">
        number of molecules
      </Label>

      {/* the extra slice between the two thresholds */}
      <path d={tail(EA_CAT, EA)} className="dg-fill-accent-2" opacity={0.5} />
      {/* the fraction that reacts even without a catalyst */}
      <path d={tail(EA, XMAX)} className="dg-fill-accent" opacity={0.55} />

      <path d={graph(f, [0, XMAX], map, [0, 1.15])} className="dg-accent" strokeWidth={2.5} fill="none" />

      <line x1={map.sx(EA)} y1={map.sy(0)} x2={map.sx(EA)} y2={map.sy(1.05)} className="dg-accent dg-dashed" />
      <line x1={map.sx(EA_CAT)} y1={map.sy(0)} x2={map.sx(EA_CAT)} y2={map.sy(1.05)} className="dg-accent-2 dg-dashed" />

      <Label x={map.sx(EA) + 8} y={map.sy(1.04)} anchor="start" className="dg-text-small dg-text-accent">
        Ea
      </Label>
      <Label x={map.sx(EA_CAT) - 8} y={map.sy(0.92)} anchor="end" className="dg-text-small dg-text-accent-2">
        Ea′
      </Label>

      <MathLabel x={map.sx(4.95)} y={map.sy(0.34)} tex="\text{extra with }Ea'" w={160} h={28} tone="muted" size="small" />
      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">
        The area to the right of each line is the fraction with enough energy to react.
      </Label>
    </Svg>
  );
}

export default ChemCatalysisBoltzmannShift;
