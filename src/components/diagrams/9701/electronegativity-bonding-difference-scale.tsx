/**
 * The bonding scale: difference in Pauling electronegativity from 0 to 3.5, drawn to scale.
 * Left (difference up to about 1.7) is covalent: electrons shared, equally at 0 and unequally
 * (polar) above 0. Right (above about 2.0) is ionic: electrons transferred, ions formed.
 * A shaded strip from 1.7 to 2.0 is the borderline region where textbooks draw the line,
 * with a dashed rule-of-thumb line at 1.8. Example bonds are marked at their differences:
 * Cl–Cl 0, C–H 0.4, H–Cl 1.0, O–H 1.2, Na–Cl 2.3, Ca–F 3.0, K–F 3.2.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-electronegativity-bonding-difference-scale';

const W = 640;
const H = 264;
const X0 = 40;
const X1 = 610;
const MAX = 3.5;
const BAND_TOP = 104;
const AXIS = 144;

const sx = (d: number) => X0 + (d / MAX) * (X1 - X0);

/** [bond, difference, label row (0 = lower, 1 = upper), anchor]. */
const BONDS: Array<[string, number, 0 | 1, 'start' | 'middle' | 'end']> = [
  ['Cl–Cl 0', 0, 0, 'start'],
  ['C–H 0.4', 0.4, 1, 'middle'],
  ['H–Cl 1.0', 1.0, 0, 'end'],
  ['O–H 1.2', 1.2, 1, 'start'],
  ['Na–Cl 2.3', 2.3, 0, 'middle'],
  ['Ca–F 3.0', 3.0, 0, 'end'],
  ['K–F 3.2', 3.2, 1, 'middle'],
];

export function ElectronegativityBondingDifferenceScale() {
  const rowY = [86, 64];
  const ticks = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
  return (
    <Svg width={W} height={H}>
      {/* what happens to the electrons */}
      <Label x={X0} y={22} anchor="start" className="dg-text-small dg-bold">
        ← electrons shared
      </Label>
      <Label x={X1} y={22} anchor="end" className="dg-text-small dg-bold">
        electrons transferred: ions →
      </Label>

      {/* bands */}
      <rect x={sx(0)} y={BAND_TOP} width={sx(1.7) - sx(0)} height={AXIS - BAND_TOP} className="dg-fill-muted" />
      <rect x={sx(1.7)} y={BAND_TOP} width={sx(2.0) - sx(1.7)} height={AXIS - BAND_TOP} className="dg-fill-accent-2" />
      <rect x={sx(2.0)} y={BAND_TOP} width={sx(MAX) - sx(2.0)} height={AXIS - BAND_TOP} className="dg-fill-accent" />
      <line x1={sx(1.8)} y1={BAND_TOP - 6} x2={sx(1.8)} y2={AXIS} className="dg-line dg-dashed" />

      {/* example bonds */}
      {BONDS.map(([name, d, row, anchor]) => {
        const x = sx(d);
        const ly = rowY[row]!;
        const lx = anchor === 'start' ? x - 3 : anchor === 'end' ? x + 3 : x;
        return (
          <g key={name}>
            <line x1={x} y1={ly + 8} x2={x} y2={AXIS} className="dg-thin" />
            <circle cx={x} cy={AXIS} r={4} className="dg-dot" />
            <Label x={lx} y={ly} anchor={anchor} className="dg-text-small dg-bold">
              {name}
            </Label>
          </g>
        );
      })}

      {/* axis */}
      <line x1={X0} y1={AXIS} x2={X1} y2={AXIS} className="dg-line" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={AXIS} x2={sx(t)} y2={AXIS + 6} className="dg-thin" />
          <Label x={sx(t)} y={AXIS + 18} className="dg-text-small">
            {t.toFixed(1)}
          </Label>
        </g>
      ))}

      {/* region names */}
      <Label x={sx(0.85)} y={AXIS + 46} className="dg-text dg-bold">
        covalent
      </Label>
      <Label x={sx(0.85)} y={AXIS + 64} className="dg-text-small">
        (non-polar at 0, polar above 0)
      </Label>
      <Label x={sx(1.85)} y={AXIS + 46} className="dg-text-accent-2">
        ≈ 1.8
      </Label>
      <Label x={sx(1.85)} y={AXIS + 64} className="dg-text-small">
        borderline
      </Label>
      <Label x={sx(2.75)} y={AXIS + 46} className="dg-text dg-bold">
        ionic
      </Label>
      <Label x={sx(2.75)} y={AXIS + 64} className="dg-text-small">
        (oppositely charged ions)
      </Label>

      <Label x={(X0 + X1) / 2} y={H - 22} className="dg-text">
        difference in Pauling electronegativity
      </Label>
    </Svg>
  );
}

export default ElectronegativityBondingDifferenceScale;
