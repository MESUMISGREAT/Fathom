/**
 * One set of numbers, two progressions. The AP 16, 12, 8, 4, 0 (d = −4) sits
 * on a number line with equal gaps. Its 1st, 3rd and 4th terms, 16, 8 and 4,
 * are highlighted: they form a GP with r = ½ (each is half the one before).
 */
import { Label, Svg, MathLabel } from '../primitives';

export const diagramKey = 'series-ap-gp-shared';

const W = 600;
const H = 290;
const L = 50;
const R = 560;
const AXIS = 166;
const lo = -1;
const hi = 18;
const sx = (v: number) => L + ((v - lo) / (hi - lo)) * (R - L);

const ap = [16, 12, 8, 4, 0];
const gp = [16, 8, 4];

/** Arc from value u to value v, bulging up (dir = −1) or down (dir = 1). */
function arc(u: number, v: number, dir: number, height: number) {
  const x1 = sx(u);
  const x2 = sx(v);
  const y = AXIS + dir * (dir < 0 ? 36 : 12);
  const mx = (x1 + x2) / 2;
  return `M${x1},${y} Q${mx},${y + dir * height} ${x2},${y}`;
}

export default function SeriesApGpShared() {
  return (
    <Svg width={W} height={H}>
      <line x1={sx(lo)} y1={AXIS} x2={sx(hi)} y2={AXIS} className="dg-thin" />
      {Array.from({ length: hi - lo + 1 }, (_, i) => lo + i).map((v) => (
        <line key={v} x1={sx(v)} y1={AXIS - 3} x2={sx(v)} y2={AXIS + 3} className="dg-grid" />
      ))}

      {/* AP: equal steps of −4, arcs above */}
      <Label x={sx(8)} y={44} className="dg-text-accent">
        AP: subtract 4 each time (equal gaps)
      </Label>
      {ap.slice(0, -1).map((v, i) => (
        <g key={`a${v}`}>
          <path d={arc(v, ap[i + 1]!, -1, 54)} className="dg-accent" />
          <Label x={(sx(v) + sx(ap[i + 1]!)) / 2} y={AXIS - 76} className="dg-text-accent">
            −4
          </Label>
        </g>
      ))}

      {/* GP: multiply by ½, arcs below */}
      <path d={arc(16, 8, 1, 70)} className="dg-accent-2" />
      <path d={arc(8, 4, 1, 40)} className="dg-accent-2" />
      <MathLabel x={sx(12)} y={AXIS + 58} w={68} h={46} tone="accent-2" tex={"\\times \\dfrac{1}{2}"} />
      <MathLabel x={sx(6)} y={AXIS + 42} w={68} h={46} tone="accent-2" tex={"\\times \\dfrac{1}{2}"} />
      <MathLabel x={sx(10)} y={AXIS + 100} w={458} h={46} tone="accent-2" tex={"\\text{GP: 1st, 3rd and 4th terms, 16, 8, 4 } \\left(r = \\dfrac{1}{2}\\right)"} />

      {/* the points */}
      {ap.map((v, i) => {
        const inGp = gp.includes(v);
        return (
          <g key={`p${v}`}>
            <circle cx={sx(v)} cy={AXIS} r={inGp ? 7 : 5} className={inGp ? 'dg-dot-accent-2' : 'dg-dot-accent'} />
            <Label x={sx(v)} y={AXIS - 19} className="dg-text-small">
              {`u${'₁₂₃₄₅'[i]} = ${v}`}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}
