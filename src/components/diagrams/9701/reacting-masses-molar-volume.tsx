/**
 * Equal volumes of gases at the same temperature and pressure hold equal
 * numbers of molecules. Three identical boxes, each 24.0 dm³ at room
 * conditions, each holding 1 mol (6.02 × 10²³ molecules) of a different gas:
 * hydrogen H₂ (2.0 g), oxygen O₂ (32.0 g) and carbon dioxide CO₂ (44.0 g).
 * The same ten molecules are drawn in the same places in each box, with
 * molecule size exaggerated (in a real gas the molecules take up well under
 * 0.1% of the space). Footer: molar volume 24.0 dm³ mol⁻¹ at room
 * conditions, 22.4 dm³ mol⁻¹ at s.t.p., from the Data Booklet.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-reacting-masses-molar-volume';

const W = 640;
const H = 360;
const BOX = 160;
const TOP = 52;
const XS = [40, 240, 440];

/** Molecule centres (relative to the box) and orientations in degrees. */
const SPOTS: Array<[number, number, number]> = [
  [30, 28, 20],
  [92, 22, -30],
  [134, 46, 70],
  [56, 66, 0],
  [112, 88, 40],
  [26, 104, -60],
  [70, 120, 15],
  [130, 132, -20],
  [100, 56, 90],
  [44, 132, 50],
];

type Gas = 'H2' | 'O2' | 'CO2';

function Molecule({ x, y, angle, gas }: { x: number; y: number; angle: number; gas: Gas }) {
  const t = `translate(${x} ${y}) rotate(${angle})`;
  if (gas === 'H2') {
    return (
      <g transform={t}>
        <circle cx={-3} cy={0} r={4} className="dg-fill-surface dg-thin" />
        <circle cx={3} cy={0} r={4} className="dg-fill-surface dg-thin" />
      </g>
    );
  }
  if (gas === 'O2') {
    return (
      <g transform={t}>
        <circle cx={-5} cy={0} r={6.5} className="dg-fill-accent-2 dg-thin" />
        <circle cx={5} cy={0} r={6.5} className="dg-fill-accent-2 dg-thin" />
      </g>
    );
  }
  return (
    <g transform={t}>
      <circle cx={-10} cy={0} r={6} className="dg-fill-accent-2 dg-thin" />
      <circle cx={10} cy={0} r={6} className="dg-fill-accent-2 dg-thin" />
      <circle cx={0} cy={0} r={5.5} className="dg-dot" />
    </g>
  );
}

const GASES: Array<{ gas: Gas; name: string; mass: string }> = [
  { gas: 'H2', name: 'hydrogen, H₂', mass: 'mass 2.0 g' },
  { gas: 'O2', name: 'oxygen, O₂', mass: 'mass 32.0 g' },
  { gas: 'CO2', name: 'carbon dioxide, CO₂', mass: 'mass 44.0 g' },
];

export function ReactingMassesMolarVolume() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        same temperature and pressure: same volume, same number of molecules
      </Label>
      {GASES.map((g, i) => {
        const x = XS[i]!;
        return (
          <g key={g.gas}>
            <rect x={x} y={TOP} width={BOX} height={BOX} rx={6} className="dg-fill-accent dg-line" />
            {SPOTS.map(([dx, dy, a], k) => (
              <Molecule key={k} x={x + dx + 3} y={TOP + dy + 4} angle={a} gas={g.gas} />
            ))}
            <Label x={x + BOX / 2} y={TOP + BOX + 18} className="dg-text dg-bold">
              {g.name}
            </Label>
            <Label x={x + BOX / 2} y={TOP + BOX + 38} className="dg-text-small">
              24.0 dm³ = 1 mol
            </Label>
            <Label x={x + BOX / 2} y={TOP + BOX + 56} className="dg-text-small">
              6.02 × 10²³ molecules
            </Label>
            <Label x={x + BOX / 2} y={TOP + BOX + 76} className="dg-text-accent-2">
              {g.mass}
            </Label>
          </g>
        );
      })}
      <Label x={W / 2} y={H - 30} className="dg-text-small">
        molar volume (Data Booklet): 24.0 dm³ mol⁻¹ at room conditions; 22.4 dm³ mol⁻¹ at s.t.p. (273 K, 101 kPa)
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text-muted">
        molecules drawn far too big: in a real gas they fill well under 0.1% of the space
      </Label>
    </Svg>
  );
}

export default ReactingMassesMolarVolume;
