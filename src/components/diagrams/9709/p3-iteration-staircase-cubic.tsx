/**
 * Staircase diagram for the iteration x_{n+1} = ∛(3x_n + 4) with x₁ = 2, which converges to the root
 * α ≈ 2.1958 of x³ − 3x − 4 = 0. Shows y = x and y = ∛(3x + 4); the steps go up to the curve and across to
 * the line, so each step lands on the next iterate and the steps shrink towards the crossing point.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-iteration-staircase-cubic';

const W = 600;
const H = 470;
const L = 80;
const B = 400;
const SIZE = 340;
const LO = 1.95;
const HI = 2.25;
const X = (x: number) => L + ((x - LO) / (HI - LO)) * SIZE;
const Y = (y: number) => B - ((y - LO) / (HI - LO)) * SIZE;
const F = (x: number) => Math.cbrt(3 * x + 4);

export default function P3IterationStaircaseCubic() {
  const curve = Array.from({ length: 61 }, (_, i) => LO + ((HI - LO) * i) / 60)
    .map((x) => `${X(x)},${Y(F(x))}`)
    .join(' ');
  const xs = [2];
  for (let i = 0; i < 5; i++) xs.push(F(xs[xs.length - 1]!));
  let path = `M ${X(xs[0]!)} ${Y(LO)}`;
  for (let i = 0; i < xs.length - 1; i++) {
    path += ` L ${X(xs[i]!)} ${Y(xs[i + 1]!)} L ${X(xs[i + 1]!)} ${Y(xs[i + 1]!)}`;
  }
  const alpha = 2.19582;
  return (
    <Svg width={W} height={H}>
      {[2, 2.1, 2.2].map((v) => (
        <g key={v}>
          <line x1={X(v)} y1={B} x2={X(v)} y2={B - SIZE} className="dg-grid" />
          <line x1={L} y1={Y(v)} x2={L + SIZE} y2={Y(v)} className="dg-grid" />
          <Label x={X(v)} y={B + 18} className="dg-text-small dg-text-muted">
            {v.toFixed(1)}
          </Label>
          <Label x={L - 10} y={Y(v)} anchor="end" className="dg-text-small dg-text-muted">
            {v.toFixed(1)}
          </Label>
        </g>
      ))}
      <line x1={L} y1={B} x2={L + SIZE} y2={B} className="dg-line" />
      <line x1={L} y1={B} x2={L} y2={B - SIZE} className="dg-line" />
      <MathLabel x={L + SIZE + 14} y={B} tex="x" w={30} />

      <line x1={X(LO)} y1={Y(LO)} x2={X(HI)} y2={Y(HI)} className="dg-line" strokeWidth={2} />
      <polyline points={curve} className="dg-accent" fill="none" strokeWidth={3} />
      <path d={path} className="dg-accent-2" fill="none" strokeWidth={2} />
      {xs.slice(0, 3).map((x, i) => (
        <g key={i}>
          <line x1={X(x)} y1={B} x2={X(x)} y2={B + 4} className="dg-line" />
          <MathLabel x={X(x)} y={B + 40} tex={`x_${i + 1}`} w={36} tone="accent-2" size="small" />
        </g>
      ))}
      <circle cx={X(alpha)} cy={Y(alpha)} r={5} className="dg-dot" />
      <MathLabel x={X(alpha) + 26} y={Y(alpha) + 18} tex="\alpha" w={30} />

      <MathLabel x={X(2.21)} y={Y(2.245)} tex="y = x" w={70} size="small" />
      <MathLabel x={X(2.04)} y={Y(2.215)} tex="y = \sqrt[3]{3x + 4}" w={130} tone="accent" size="small" />
    </Svg>
  );
}
