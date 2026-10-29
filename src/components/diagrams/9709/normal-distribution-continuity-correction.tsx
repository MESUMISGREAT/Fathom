/**
 * Continuity correction: the binomial bars for X ~ B(20, 0.4) shown with the
 * normal curve N(8, 4.8). For P(X ≤ 9) the bar of 9 ends at 9.5, so the normal
 * area used is P(Y < 9.5).
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'normal-distribution-continuity-correction';

const PW = 540;
const PH = 230;
const N = 20;
const PP = 0.4;
const MU = N * PP;
const VAR = N * PP * (1 - PP);
const SD = Math.sqrt(VAR);
const X: [number, number] = [0, 17];
const Y: [number, number] = [0, 0.2];
const pdf = (y: number) => Math.exp(-0.5 * ((y - MU) / SD) ** 2) / (SD * Math.sqrt(2 * Math.PI));

function choose(n: number, r: number) {
  let out = 1;
  for (let i = 0; i < r; i++) out = (out * (n - i)) / (i + 1);
  return out;
}
function binom(k: number) {
  return choose(N, k) * PP ** k * (1 - PP) ** (N - k);
}

export default function NormalDistributionContinuityCorrection() {
  const p = makePlot({ width: PW, height: PH, pad: 18, x: X, y: Y });
  const axisY = p.sy(0);
  const barW = p.sx(1) - p.sx(0) - 3;
  return (
    <Svg width={620} height={330}>
      <MathLabel x={310} y={20} tex="X \sim \mathrm{B}(20,\ 0.4)" w={220} h={28} tone="accent" size="large" />
      <g transform="translate(45, 36)">
        {Array.from({ length: 17 }, (_, k) => (
          <rect
            key={k}
            x={p.sx(k) - barW / 2}
            y={p.sy(binom(k))}
            width={barW}
            height={axisY - p.sy(binom(k))}
            className={k <= 9 ? 'dg-fill-accent dg-thin' : 'dg-fill-muted dg-thin'}
          />
        ))}
        <path d={graph(pdf, X, p, Y)} className="dg-accent-2" />
        <line x1={p.sx(X[0])} y1={axisY} x2={p.sx(X[1]) + 8} y2={axisY} className="dg-thin" />
        <line x1={p.sx(9.5)} y1={axisY} x2={p.sx(9.5)} y2={p.sy(pdf(9.5))} className="dg-grid dg-dashed" />
        {[0, 5, 15].map((t) => (
          <g key={t}>
            <line x1={p.sx(t)} y1={axisY - 3} x2={p.sx(t)} y2={axisY + 3} className="dg-thin" />
            <Label x={p.sx(t)} y={axisY + 16} className="dg-text-small">
              {t}
            </Label>
          </g>
        ))}
        <Label x={p.sx(9.5) + 6} y={axisY + 16} anchor="start" className="dg-text-small dg-text-accent-2">
          9.5
        </Label>
        <MathLabel x={p.sx(2.2)} y={p.sy(0.048)} tex="\text{P}(X \le 9)" w={110} h={24} tone="accent" />
      </g>
      <MathLabel
        x={310}
        y={292}
        tex="Y \sim \mathrm{N}(np,\ npq) = \mathrm{N}(8,\ 4.8), \qquad \text{P}(X \le 9) \approx \text{P}(Y < 9.5)"
        w={480}
        h={34}
      />
      <Label x={310} y={316} className="dg-text-small">
        the bar for 9 ends at 9.5, so the normal area stops at 9.5
      </Label>
    </Svg>
  );
}
