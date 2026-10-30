/**
 * Histogram with unequal class widths for the heights of 60 seedlings. Bar heights are frequency
 * densities (frequency ÷ class width) and each bar is labelled with its frequency, so the reader can
 * see that area, not height, shows the frequency.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'stats-histogram-seedlings';

const W = 600;
const H = 360;
const L = 80;
const B = 300;
const PW = 480; // 0..40 cm
const PH = 240; // 0..3 frequency density
const X = (cm: number) => L + (cm / 40) * PW;
const Y = (fd: number) => B - (fd / 3) * PH;

const classes: { from: number; to: number; f: number }[] = [
  { from: 0, to: 5, f: 6 },
  { from: 5, to: 10, f: 14 },
  { from: 10, to: 20, f: 24 },
  { from: 20, to: 40, f: 16 },
];

export function StatsHistogramSeedlings() {
  return (
    <Svg width={W} height={H}>
      {[0, 0.5, 1, 1.5, 2, 2.5, 3].map((fd) => (
        <g key={fd}>
          <line x1={L} y1={Y(fd)} x2={L + PW} y2={Y(fd)} className="dg-grid" />
          <Label x={L - 10} y={Y(fd)} anchor="end" className="dg-text-small dg-text-muted">
            {fd}
          </Label>
        </g>
      ))}
      {classes.map((c) => {
        const fd = c.f / (c.to - c.from);
        return (
          <g key={c.from}>
            <rect x={X(c.from)} y={Y(fd)} width={X(c.to) - X(c.from)} height={B - Y(fd)} className="dg-fill-accent dg-accent" strokeWidth={2} />
            <Label x={(X(c.from) + X(c.to)) / 2} y={Y(fd) - 12} className="dg-text-small dg-text-accent">
              {`f = ${c.f}`}
            </Label>
          </g>
        );
      })}
      {[0, 5, 10, 20, 40].map((cm) => (
        <Label key={cm} x={X(cm)} y={B + 16} className="dg-text-small dg-text-muted">
          {cm}
        </Label>
      ))}
      <line x1={L} y1={B} x2={L + PW} y2={B} className="dg-line" />
      <line x1={L} y1={B} x2={L} y2={B - PH} className="dg-line" />
      <Label x={L + PW / 2} y={B + 40} className="dg-text-small">
        height (cm)
      </Label>
      <Label x={L - 40} y={B - PH - 16} anchor="start" className="dg-text-small">
        frequency density
      </Label>
    </Svg>
  );
}

export default StatsHistogramSeedlings;
