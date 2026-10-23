/**
 * Deducing a reacting ratio from a break-point graph. 0.200 mol dm⁻³
 * Pb(NO₃)₂(aq) is added in portions to 25.0 cm³ of 0.200 mol dm⁻³ KI(aq)
 * (5.00 × 10⁻³ mol of I⁻). The ideal mass of PbI₂ (M = 461.0 g mol⁻¹) is
 * 0.0922 g per cm³ added until 12.5 cm³, then constant at 1.15 g once all the
 * iodide has reacted. Illustrative measured points scatter by about 0.01 g
 * around the ideal lines. The two best-fit lines meet at 12.5 cm³:
 * n(Pb²⁺) = 2.50 × 10⁻³ mol reacts with n(I⁻) = 5.00 × 10⁻³ mol, a 1 : 2
 * ratio, so the precipitate is PbI₂.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-reacting-masses-precipitate-graph';

const W = 640;
const H = 440;
const X0 = 76;
const X1 = 576;
const Y0 = 330;
const Y1 = 62;
const XMAX = 25;
const YMAX = 1.4;
const SLOPE = (0.2 / 1000) * 461.0; // g of PbI₂ per cm³ of Pb(NO₃)₂(aq)
const BREAK = 12.5;
const PLATEAU = SLOPE * BREAK;

const sx = (v: number) => X0 + (v / XMAX) * (X1 - X0);
const sy = (m: number) => Y0 - (m / YMAX) * (Y0 - Y1);
const ideal = (v: number) => Math.min(SLOPE * v, PLATEAU);

/** Illustrative readings: [volume / cm³, scatter / g]. */
const POINTS: Array<[number, number]> = [
  [2.5, 0.012],
  [5.0, -0.015],
  [7.5, 0.01],
  [10.0, -0.012],
  [15.0, 0.01],
  [17.5, -0.012],
  [20.0, 0.008],
  [22.5, -0.006],
  [25.0, 0.01],
];

export function ReactingMassesPrecipitateGraph() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        adding 0.200 mol dm⁻³ Pb(NO₃)₂(aq) to 25.0 cm³ of 0.200 mol dm⁻³ KI(aq)
      </Label>

      {/* grid and axes */}
      {[0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4].map((t) => (
        <line key={t} x1={X0} y1={sy(t)} x2={X1} y2={sy(t)} className="dg-grid" />
      ))}
      {[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4].map((t) => (
        <Label key={t} x={X0 - 8} y={sy(t)} anchor="end" className="dg-text-small">
          {t.toFixed(1)}
        </Label>
      ))}
      {[0, 5, 10, 15, 20, 25].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={Y0} x2={sx(t)} y2={Y0 + 5} className="dg-thin" />
          <Label x={sx(t)} y={Y0 + 17} className="dg-text-small">
            {String(t)}
          </Label>
        </g>
      ))}
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} className="dg-line" />
      <line x1={X0} y1={Y0} x2={X0} y2={Y1} className="dg-line" />
      <Label x={(X0 + X1) / 2} y={Y0 + 40} className="dg-text">
        volume of Pb(NO₃)₂(aq) added / cm³
      </Label>
      <text x={20} y={(Y0 + Y1) / 2} transform={`rotate(-90 20 ${(Y0 + Y1) / 2})`} textAnchor="middle" dominantBaseline="middle" className="dg-text">
        mass of PbI₂ precipitate / g
      </text>

      {/* best-fit lines, extended past the break */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(14.2)} y2={sy(SLOPE * 14.2)} className="dg-accent" />
      <line x1={sx(9)} y1={sy(PLATEAU)} x2={sx(25)} y2={sy(PLATEAU)} className="dg-accent" />

      {/* the break point */}
      <line x1={sx(BREAK)} y1={sy(PLATEAU)} x2={sx(BREAK)} y2={Y0} className="dg-accent-2 dg-dashed" />
      <circle cx={sx(BREAK)} cy={sy(PLATEAU)} r={6} className="dg-accent-2" />
      <Label x={sx(BREAK) + 8} y={Y0 - 12} anchor="start" className="dg-text-accent-2">
        12.5 cm³
      </Label>
      <Label x={sx(BREAK) + 12} y={sy(PLATEAU) + 20} anchor="start" className="dg-text-small dg-bold">
        all I⁻ used up: 1.15 g of PbI₂
      </Label>

      {/* data */}
      {POINTS.map(([v, d]) => (
        <g key={v}>
          <line x1={sx(v) - 5} y1={sy(ideal(v) + d) - 5} x2={sx(v) + 5} y2={sy(ideal(v) + d) + 5} className="dg-line" />
          <line x1={sx(v) - 5} y1={sy(ideal(v) + d) + 5} x2={sx(v) + 5} y2={sy(ideal(v) + d) - 5} className="dg-line" />
        </g>
      ))}

      <Label x={X1} y={Y1 - 12} anchor="end" className="dg-text-muted">
        × illustrative readings
      </Label>

      {/* region notes */}
      <Label x={sx(6.2)} y={sy(1.3)} className="dg-text-small">
        Pb²⁺ limiting:
      </Label>
      <Label x={sx(6.2)} y={sy(1.3) + 15} className="dg-text-small">
        more Pb²⁺, more PbI₂
      </Label>
      <Label x={sx(19.5)} y={sy(0.75)} className="dg-text-small">
        I⁻ limiting: extra Pb²⁺
      </Label>
      <Label x={sx(19.5)} y={sy(0.75) + 15} className="dg-text-small">
        has nothing to react with
      </Label>

      {/* deduction */}
      <Label x={W / 2} y={H - 40} className="dg-text-accent">
        at the break: n(Pb²⁺) = 2.50 × 10⁻³ mol and n(I⁻) = 5.00 × 10⁻³ mol
      </Label>
      <Label x={W / 2} y={H - 16} className="dg-text dg-bold">
        ratio 1 : 2, so Pb²⁺(aq) + 2I⁻(aq) → PbI₂(s)
      </Label>
    </Svg>
  );
}

export default ReactingMassesPrecipitateGraph;
