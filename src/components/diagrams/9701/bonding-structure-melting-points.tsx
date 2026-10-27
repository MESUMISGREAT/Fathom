/**
 * Approximate melting points of the six syllabus substances, drawn as horizontal bars on
 * a shared 0–3000 °C scale, grouped by structure type: simple molecular (ice 0, iodine
 * 114), giant metallic (copper 1085), giant ionic (NaCl 801, MgO about 2800) and giant
 * molecular (SiO₂ about 1700). Values are standard handbook data; MgO is commonly listed
 * as 2852 °C and is drawn at about 2800. A note records that diamond and graphite sublime
 * near 3800 °C at ordinary pressure, so they have no ordinary melting point and are not
 * plotted. Bars are drawn to scale.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-bonding-structure-melting-points';

const W = 640;
const H = 380;

const X0 = 150;
const X1 = 596;
const MAX = 3000;
const sx = (v: number) => X0 + (v / MAX) * (X1 - X0);

type Row = { name: string; value: number; approx?: boolean; group: string };

const ROWS: Row[] = [
  { name: 'Ice, H₂O', value: 0, group: 'simple molecular' },
  { name: 'Iodine, I₂', value: 114, group: 'simple molecular' },
  { name: 'NaCl', value: 801, group: 'giant ionic' },
  { name: 'Copper', value: 1085, group: 'giant metallic' },
  { name: 'SiO₂', value: 1700, approx: true, group: 'giant molecular' },
  { name: 'MgO', value: 2800, approx: true, group: 'giant ionic' },
];

const ROW_H = 42;
const TOP = 76;

export default function BondingStructureMeltingPoints() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={28} className="dg-text dg-bold">
        Melting points by structure type (°C)
      </Label>

      {/* axis */}
      {[0, 1000, 2000, 3000].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={TOP - 12} x2={sx(t)} y2={TOP + ROWS.length * ROW_H} className="dg-grid" />
          <Label x={sx(t)} y={TOP - 22} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}

      {ROWS.map((r, k) => {
        const y = TOP + k * ROW_H + 12;
        // ice at 0 still needs a visible stub
        const w = Math.max(4, sx(r.value) - X0);
        return (
          <g key={r.name}>
            <Label x={X0 - 12} y={y} className="dg-text-small" anchor="end">
              {r.name}
            </Label>
            <rect x={X0} y={y - 11} width={w} height={22} rx={5} className="dg-thin dg-fill-accent" />
            <Label x={X0 + w + 10} y={y} className="dg-text-small dg-text-accent" anchor="start">
              {r.approx ? `≈ ${r.value}` : `${r.value}`}
            </Label>
          </g>
        );
      })}

      <Label x={W / 2} y={H - 52} className="dg-text-small">
        Stronger forces between particles → more energy needed → higher melting point.
      </Label>
      <Label x={W / 2} y={H - 30} className="dg-text-small dg-text-muted">
        Diamond and graphite sublime near 3800 °C at ordinary pressure: no ordinary melting point.
      </Label>
      <Label x={W / 2} y={H - 8} className="dg-text-small dg-text-muted">
        (MgO ≈ 2800: the 2+/2− ions attract far more strongly than the 1+/1− ions in NaCl.)
      </Label>
    </Svg>
  );
}
