/**
 * Number line showing successive approximations converging to \u221a2.
 * x\u2081 = 1, x\u2082 = 1.5, x\u2083 \u2248 1.4167, x\u2084 \u2248 1.4142 cluster around \u03b1 = \u221a2 \u2248 1.41421356.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p3-numerical-solution-approximations';

const W = 520;
const H = 220;
const LEFT = 1.0;
const RIGHT = 1.55;
const ALPHA = Math.sqrt(2);

const x1 = 1.0;
const x2 = 1.5;
const x3 = 1.4166666667;
const x4 = 1.4142156863;

const scaleX = (x: number) => 40 + ((x - LEFT) / (RIGHT - LEFT)) * 440;
const yBase = 120;

export default function P3NumericalSolutionApproximations() {
  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={28} tex="x_{n+1} = \tfrac{1}{2}(x_n + 2/x_n),\quad x_1 = 1" w={380} h={32} />
      {/* number line */}
      <line x1={scaleX(LEFT)} y1={yBase} x2={scaleX(RIGHT)} y2={yBase} className="dg-line" />
      {/* ticks */}
      <g>
        {[1.0, 1.1, 1.2, 1.3, 1.4, 1.5].map(v => (
          <g key={v}>
            <line x1={scaleX(v)} y1={yBase - 6} x2={scaleX(v)} y2={yBase + 6} className="dg-line" />
            <Label x={scaleX(v)} y={yBase + 22} anchor="middle" className="dg-text-xs dg-text-muted">{v.toFixed(1)}</Label>
          </g>
        ))}
      </g>
      {/* alpha marker */}
      <line x1={scaleX(ALPHA)} y1={yBase - 16} x2={scaleX(ALPHA)} y2={yBase + 16} className="dg-accent-2" strokeWidth={2} />
      <MathLabel x={scaleX(ALPHA)} y={yBase - 32} tex="\alpha = \sqrt{2}" anchor="middle" w={100} h={24} size="small" tone="accent-2" />
      {/* points */}
      {[
        { x: x1, label: 'x_1', yOffset: -60 },
        { x: x2, label: 'x_2', yOffset: -60 },
        { x: x3, label: 'x_3', yOffset: -60 },
        { x: x4, label: 'x_4', yOffset: -60 },
      ].map(({ x, label, yOffset }) => (
        <g key={label}>
          <circle cx={scaleX(x)} cy={yBase} r={5} className="dg-fill-surface dg-accent" />
          <MathLabel x={scaleX(x)} y={yBase + yOffset} tex={label} anchor="middle" w={50} h={24} size="small" tone="accent" />
        </g>
      ))}
      {/* convergence arrows */}
      <MathLabel x={scaleX((x1 + x2) / 2)} y={yBase - 52} tex="\downarrow" anchor="middle" w={20} h={20} size="large" tone="muted" />
      <MathLabel x={scaleX((x2 + x3) / 2)} y={yBase - 52} tex="\downarrow" anchor="middle" w={20} h={20} size="large" tone="muted" />
      <MathLabel x={scaleX((x3 + x4) / 2)} y={yBase - 52} tex="\downarrow" anchor="middle" w={20} h={20} size="large" tone="muted" />
      {/* distance labels */}
      <Label x={scaleX((x1 + x2) / 2)} y={yBase + 50} anchor="middle" className="dg-text-xs dg-text-muted">
        large step
      </Label>
      <Label x={scaleX((x2 + x3) / 2)} y={yBase + 50} anchor="middle" className="dg-text-xs dg-text-muted">
        smaller
      </Label>
      <Label x={scaleX((x3 + x4) / 2)} y={yBase + 50} anchor="middle" className="dg-text-xs dg-text-muted">
        tiny
      </Label>
      <Label x={W / 2} y={H - 20} className="dg-text-small dg-bold">
        The sequence x\u2081, x\u2082, x\u2083, x\u2084 \u2026 closes in on \u03b1.
      </Label>
    </Svg>
  );
}