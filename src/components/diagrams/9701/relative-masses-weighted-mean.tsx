/**
 * Relative atomic mass as a weighted mean, for chlorine. Bars show the two
 * isotopes at their relative isotopic masses (³⁵Cl 34.97, ³⁷Cl 36.97) with
 * heights equal to their natural abundances (75.8 % and 24.2 %). The mass
 * axis is drawn as a see-saw beam: it balances at the weighted mean,
 * (75.8 × 34.97 + 24.2 × 36.97) / 100 = 35.45, not at the simple mean (≈ 36).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-relative-masses-weighted-mean';

const W = 640;
const H = 390;
const XL = 90;
const XR = 600;
const YT = 60; // y of 100 %
const YB = 290; // y of 0 %
const M0 = 33.5;
const M1 = 38.5;

const sx = (m: number) => XL + ((m - M0) / (M1 - M0)) * (XR - XL);
const sy = (p: number) => YB - (p / 100) * (YB - YT);

const ISOTOPES = [
  { sym: '³⁵Cl', mass: 34.97, pct: 75.8 },
  { sym: '³⁷Cl', mass: 36.97, pct: 24.2 },
];
const MEAN = (75.8 * 34.97 + 24.2 * 36.97) / 100; // 35.45
const SIMPLE = (34.97 + 36.97) / 2; // 35.97

export function RelativeMassesWeightedMean() {
  const bw = 0.32;
  return (
    <Svg width={W} height={H}>
      {/* y grid and labels */}
      {[0, 25, 50, 75, 100].map((p) => (
        <g key={p}>
          {p > 0 && <line x1={XL} y1={sy(p)} x2={XR} y2={sy(p)} className="dg-grid" />}
          <Label x={XL - 8} y={sy(p)} anchor="end" className="dg-text-small">
            {String(p)}
          </Label>
        </g>
      ))}
      <line x1={XL} y1={YB} x2={XL} y2={YT - 6} className="dg-line" />
      <text x={22} y={(YT + YB) / 2} transform={`rotate(-90 22 ${(YT + YB) / 2})`} textAnchor="middle" dominantBaseline="middle" className="dg-text">
        abundance / %
      </text>

      {/* bars */}
      {ISOTOPES.map((iso) => (
        <g key={iso.sym}>
          <rect x={sx(iso.mass - bw / 2)} y={sy(iso.pct)} width={sx(iso.mass + bw / 2) - sx(iso.mass - bw / 2)} height={YB - sy(iso.pct)} className="dg-fill-accent dg-accent" />
          <Label x={sx(iso.mass)} y={sy(iso.pct) - 26} className="dg-text dg-bold">
            {iso.sym}
          </Label>
          <Label x={sx(iso.mass)} y={sy(iso.pct) - 10} className="dg-text-small">
            {`${iso.pct} %`}
          </Label>
        </g>
      ))}

      {/* simple mean (wrong) */}
      <line x1={sx(SIMPLE)} y1={YB} x2={sx(SIMPLE)} y2={YT - 18} className="dg-muted dg-dashed" />
      <Label x={sx(SIMPLE) + 8} y={YT - 22} anchor="start" className="dg-text-muted">
        simple mean ≈ 36: wrong, ignores abundance
      </Label>

      {/* weighted mean */}
      <line x1={sx(MEAN)} y1={YB} x2={sx(MEAN)} y2={YT - 18} className="dg-accent-2 dg-dashed" />
      <Label x={sx(MEAN) - 8} y={YT - 30} anchor="end" className="dg-text-accent-2">
        weighted mean
      </Label>
      <Label x={sx(MEAN) - 8} y={YT - 12} anchor="end" className="dg-text-accent-2">
        Aᵣ = 35.45 ≈ 35.5
      </Label>

      {/* the beam (mass axis) and its fulcrum */}
      <line x1={XL} y1={YB} x2={XR} y2={YB} className="dg-line" />
      <path d={`M${sx(MEAN)},${YB + 1} L${sx(MEAN) - 13},${YB + 24} L${sx(MEAN) + 13},${YB + 24} Z`} className="dg-dot-accent-2" />
      {[34, 35, 36, 37, 38].map((m) => (
        <g key={m}>
          <line x1={sx(m)} y1={YB} x2={sx(m)} y2={YB + 5} className="dg-thin" />
          <Label x={sx(m)} y={YB + 17} className="dg-text-small">
            {String(m)}
          </Label>
        </g>
      ))}
      <Label x={sx(MEAN)} y={YB + 40} className="dg-text-small dg-bold">
        balance point
      </Label>
      <Label x={(XL + XR) / 2} y={YB + 70} className="dg-text">
        relative isotopic mass
      </Label>
    </Svg>
  );
}

export default RelativeMassesWeightedMean;
