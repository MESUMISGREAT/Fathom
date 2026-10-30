/**
 * Box-and-whisker plot of 15 pulse rates (min 58, Q1 64, median 72, Q3 83, max 96) drawn above a
 * scale, with each of the five numbers labelled and the IQR marked under the box.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'stats-box-plot-pulse';

const W = 600;
const H = 230;
const L = 50;
const PW = 500; // 50..100 beats per minute
const X = (v: number) => L + ((v - 50) / 50) * PW;
const AXIS = 170;
const MID = 90; // vertical centre of the box
const HALF = 28;

const five: { v: number; name: string }[] = [
  { v: 58, name: 'min' },
  { v: 64, name: 'Q₁' },
  { v: 72, name: 'median' },
  { v: 83, name: 'Q₃' },
  { v: 96, name: 'max' },
];

export function StatsBoxPlotPulse() {
  const [min, q1, med, q3, max] = five.map((f) => f.v) as [number, number, number, number, number];
  return (
    <Svg width={W} height={H}>
      <line x1={L} y1={AXIS} x2={L + PW} y2={AXIS} className="dg-line" />
      {[50, 60, 70, 80, 90, 100].map((v) => (
        <g key={v}>
          <line x1={X(v)} y1={AXIS} x2={X(v)} y2={AXIS + 6} className="dg-line" />
          <Label x={X(v)} y={AXIS + 20} className="dg-text-small dg-text-muted">
            {v}
          </Label>
        </g>
      ))}
      <Label x={L + PW / 2} y={AXIS + 44} className="dg-text-small">
        pulse rate (beats per minute)
      </Label>

      <line x1={X(min)} y1={MID} x2={X(q1)} y2={MID} className="dg-line" />
      <line x1={X(q3)} y1={MID} x2={X(max)} y2={MID} className="dg-line" />
      <line x1={X(min)} y1={MID - 12} x2={X(min)} y2={MID + 12} className="dg-line" />
      <line x1={X(max)} y1={MID - 12} x2={X(max)} y2={MID + 12} className="dg-line" />
      <rect x={X(q1)} y={MID - HALF} width={X(q3) - X(q1)} height={2 * HALF} className="dg-fill-accent dg-accent" strokeWidth={2} />
      <line x1={X(med)} y1={MID - HALF} x2={X(med)} y2={MID + HALF} className="dg-accent-2" strokeWidth={3} />

      {five.map((f) => (
        <g key={f.name}>
          <Label x={X(f.v)} y={MID - HALF - 24} className="dg-text-small">
            {f.name}
          </Label>
          <Label x={X(f.v)} y={MID - HALF - 8} className="dg-text-small dg-text-muted">
            {f.v}
          </Label>
        </g>
      ))}
      <line x1={X(q1)} y1={MID + HALF + 14} x2={X(q3)} y2={MID + HALF + 14} className="dg-accent dg-dashed" />
      <Label x={(X(q1) + X(q3)) / 2} y={MID + HALF + 28} className="dg-text-small dg-text-accent">
        IQR = 83 − 64 = 19
      </Label>
    </Svg>
  );
}

export default StatsBoxPlotPulse;
