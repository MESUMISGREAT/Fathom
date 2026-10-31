/**
 * Two rearrangements of x³ − 2x − 5 = 0, both started at x₁ = 2, plotted as value against step number.
 * x = ∛(2x + 5) settles at the root 2.095 (a dashed line); x = (x³ − 5)/2 goes 2, 1.5, −0.81, −2.77 and then
 * off the chart to −13.1.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-numerical-solution-rearranging-cobweb';

const W = 600;
const H = 330;
const sx = (n: number) => 90 + (n - 1) * 90;
const sy = (v: number) => 40 + (3 - v) * (240 / 7);

const settle = [2, 2.0801, 2.0924, 2.0942, 2.0945, 2.0945];
const runaway = [2, 1.5, -0.8125, -2.7682];
const pts = (vals: number[]) => vals.map((v, i) => `${sx(i + 1)},${sy(v)}`).join(' ');

export default function P3NumericalSolutionRearrangingCobweb() {
  return (
    <Svg width={W} height={H}>
      {[-4, -3, -2, -1, 0, 1, 2, 3].map((v) => (
        <g key={v}>
          <line x1={sx(1) - 20} y1={sy(v)} x2={sx(6) + 20} y2={sy(v)} className="dg-grid" />
          <Label x={sx(1) - 32} y={sy(v)} anchor="end" className="dg-text-small dg-text-muted">{String(v).replace('-', '−')}</Label>
        </g>
      ))}
      <line x1={sx(1) - 20} y1={sy(0)} x2={sx(6) + 20} y2={sy(0)} className="dg-line" />
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <MathLabel key={n} x={sx(n)} y={sy(-4) + 22} tex={`x_${n}`} w={30} h={24} size="small" />
      ))}
      <Label x={sx(1) - 70} y={sy(-0.5)} className="dg-text-small dg-text-muted">value</Label>
      <line x1={sx(1) - 20} y1={sy(2.095)} x2={sx(6) + 20} y2={sy(2.095)} className="dg-muted dg-dashed" />
      <Label x={sx(6) + 24} y={sy(2.095) - 14} anchor="end" className="dg-text-small dg-text-muted">root 2.095</Label>

      <polyline points={pts(settle)} fill="none" className="dg-accent" strokeWidth={2.5} />
      {settle.map((v, i) => (
        <circle key={`s${i}`} cx={sx(i + 1)} cy={sy(v)} r={4.5} className="dg-dot-accent" />
      ))}
      <polyline points={pts(runaway)} fill="none" className="dg-accent-2" strokeWidth={2.5} />
      <line x1={sx(4)} y1={sy(-2.7682)} x2={sx(4.6)} y2={sy(-4.1)} className="dg-accent-2" strokeWidth={2.5} strokeDasharray="5,4" />
      {runaway.map((v, i) => (
        <circle key={`r${i}`} cx={sx(i + 1)} cy={sy(v)} r={4.5} className="dg-dot-accent-2" />
      ))}
      <Label x={sx(4.6) + 8} y={sy(-3.8)} anchor="start" className="dg-text-small dg-text-accent-2">next: −13.1, off the chart</Label>

      <MathLabel x={sx(4.3)} y={sy(2.6) - 4} tex="x = \sqrt[3]{2x + 5}\ \text{settles}" w={220} h={28} size="small" tone="accent" />
      <MathLabel x={sx(1.7)} y={sy(-1.4)} tex="x = \tfrac{x^3 - 5}{2}\ \text{runs away}" w={220} h={32} size="small" tone="accent-2" />
    </Svg>
  );
}
