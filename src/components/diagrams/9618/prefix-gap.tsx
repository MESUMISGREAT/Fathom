/**
 * Bar chart, drawn to scale: how many per cent larger each binary prefix is
 * than the decimal prefix it is often confused with.
 *   Ki/k: 2^10 / 10^3  = 1.024          -> 2.4 %
 *   Mi/M: 2^20 / 10^6  = 1.048576       -> 4.9 %
 *   Gi/G: 2^30 / 10^9  = 1.073741824    -> 7.4 %
 *   Ti/T: 2^40 / 10^12 = 1.099511627776 -> 10.0 %
 */
import { Label, Svg, axes } from '../primitives';

const W = 560;
const H = 320;
const PAD = 56;
const Y_MAX = 12;
const { sx, sy } = axes({ width: W, height: H, pad: PAD, x: [0, 4], y: [0, Y_MAX] });

const bars = [
  { name: 'kibi vs kilo', powers: '2¹⁰ vs 10³', ratio: 2 ** 10 / 1e3 },
  { name: 'mebi vs mega', powers: '2²⁰ vs 10⁶', ratio: 2 ** 20 / 1e6 },
  { name: 'gibi vs giga', powers: '2³⁰ vs 10⁹', ratio: 2 ** 30 / 1e9 },
  { name: 'tebi vs tera', powers: '2⁴⁰ vs 10¹²', ratio: 2 ** 40 / 1e12 },
];
const BAR_W = 0.56;

export function PrefixGap() {
  const ticks = [0, 2, 4, 6, 8, 10, 12];
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        How much bigger is the binary prefix?
      </Label>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(0)} y1={sy(t)} x2={sx(4)} y2={sy(t)} className="dg-grid" />
          <Label x={sx(0) - 8} y={sy(t)} anchor="end" className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}
      <text
        x={18}
        y={sy(Y_MAX / 2)}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 18 ${sy(Y_MAX / 2)})`}
        className="dg-text-small"
      >
        extra size (%)
      </text>
      {bars.map((b, i) => {
        const pct = (b.ratio - 1) * 100;
        const x = i + 0.5;
        const left = sx(x - BAR_W / 2);
        const right = sx(x + BAR_W / 2);
        return (
          <g key={b.name}>
            <rect x={left} y={sy(pct)} width={right - left} height={sy(0) - sy(pct)} className="dg-fill-accent dg-accent" />
            <Label x={sx(x)} y={sy(pct) - 12} className="dg-text-accent">
              {`${pct.toFixed(1)}%`}
            </Label>
            <Label x={sx(x)} y={sy(0) + 18} className="dg-text-small">
              {b.name}
            </Label>
            <Label x={sx(x)} y={sy(0) + 35} className="dg-text-small dg-text-muted">
              {b.powers}
            </Label>
          </g>
        );
      })}
      <line x1={sx(0)} y1={sy(0)} x2={sx(4)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(Y_MAX)} className="dg-line" />
    </Svg>
  );
}
