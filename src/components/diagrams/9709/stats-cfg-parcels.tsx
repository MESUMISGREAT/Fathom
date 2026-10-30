/**
 * Cumulative frequency graph for the masses of 80 parcels, with the reading lines for the
 * lower quartile (CF 20), median (CF 40) and upper quartile (CF 60). Points are plotted at the
 * upper class boundaries and joined with straight lines, so every reading can be checked by
 * linear interpolation in the lesson.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'stats-cfg-parcels';

const W = 600;
const H = 380;
const L = 70; // left edge of plot
const B = 320; // bottom edge of plot
const PW = 480; // plot width for 0..6 kg
const PH = 260; // plot height for 0..80

const X = (kg: number) => L + (kg / 6) * PW;
const Y = (cf: number) => B - (cf / 80) * PH;

const points: [number, number][] = [
  [0, 0],
  [1, 6],
  [2, 20],
  [3, 44],
  [4, 64],
  [5, 76],
  [6, 80],
];

const readings: { cf: number; kg: number; label: string }[] = [
  { cf: 20, kg: 2, label: 'Q₁ = 2.0' },
  { cf: 40, kg: 2 + 20 / 24, label: 'median ≈ 2.83' },
  { cf: 60, kg: 3.8, label: 'Q₃ = 3.8' },
];

export function StatsCfgParcels() {
  return (
    <Svg width={W} height={H}>
      {[0, 20, 40, 60, 80].map((cf) => (
        <g key={cf}>
          <line x1={L} y1={Y(cf)} x2={L + PW} y2={Y(cf)} className="dg-grid" />
          <Label x={L - 10} y={Y(cf)} anchor="end" className="dg-text-small dg-text-muted">
            {cf}
          </Label>
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((kg) => (
        <g key={kg}>
          <line x1={X(kg)} y1={B} x2={X(kg)} y2={B - PH} className="dg-grid" />
          <Label x={X(kg)} y={B + 16} className="dg-text-small dg-text-muted">
            {kg}
          </Label>
        </g>
      ))}
      <line x1={L} y1={B} x2={L + PW} y2={B} className="dg-line" />
      <line x1={L} y1={B} x2={L} y2={B - PH} className="dg-line" />
      <Label x={L + PW / 2} y={B + 40} className="dg-text-small">
        mass (kg)
      </Label>
      <Label x={L - 46} y={B - PH / 2} className="dg-text-small">
        CF
      </Label>

      {readings.map((r) => (
        <g key={r.cf}>
          <line x1={L} y1={Y(r.cf)} x2={X(r.kg)} y2={Y(r.cf)} className="dg-accent-2 dg-dashed" />
          <line x1={X(r.kg)} y1={Y(r.cf)} x2={X(r.kg)} y2={B} className="dg-accent-2 dg-dashed" />
        </g>
      ))}
      <polyline points={points.map(([kg, cf]) => `${X(kg)},${Y(cf)}`).join(' ')} className="dg-accent" fill="none" strokeWidth={3} />
      {points.map(([kg, cf]) => (
        <circle key={kg} cx={X(kg)} cy={Y(cf)} r={4} className="dg-dot" />
      ))}
      <Label x={X(4.1)} y={Y(20)} anchor="start" className="dg-text-small dg-text-accent-2">
        {readings[0]!.label} kg
      </Label>
      <Label x={X(4.1)} y={Y(20) + 20} anchor="start" className="dg-text-small dg-text-accent-2">
        {readings[1]!.label} kg
      </Label>
      <Label x={X(4.1)} y={Y(20) + 40} anchor="start" className="dg-text-small dg-text-accent-2">
        {readings[2]!.label} kg
      </Label>
      <Label x={X(0.1)} y={Y(76)} anchor="start" className="dg-text-small dg-text-muted">
        n = 80 parcels
      </Label>
    </Svg>
  );
}

export default StatsCfgParcels;
