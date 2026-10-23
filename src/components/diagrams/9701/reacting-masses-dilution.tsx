/**
 * Dilution keeps the amount of solute the same. Left: a beaker holding
 * 25.0 cm³ of 2.00 mol dm⁻³ solution, n = 2.00 × 0.0250 = 0.0500 mol, with
 * twenty dots crowded into a small volume. Right: the same twenty dots spread
 * through a 250 cm³ volumetric flask filled to the mark, so the
 * concentration is 0.0500 ÷ 0.250 = 0.200 mol dm⁻³. Vessel sizes are
 * schematic. Footer: c₁V₁ = c₂V₂, 2.00 × 25.0 = 0.200 × 250.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-reacting-masses-dilution';

const W = 640;
const H = 380;

/** Twenty solute particles packed into the beaker's liquid. */
const DENSE: Array<[number, number]> = Array.from({ length: 20 }, (_, i) => {
  const row = Math.floor(i / 5);
  const col = i % 5;
  return [92 + col * 17 + (row % 2) * 8, 214 + row * 10];
});

/** The same twenty particles spread through the flask's bulb. */
const SPREAD: Array<[number, number]> = [
  [470, 120],
  [456, 168], [484, 164],
  [430, 192], [468, 188], [508, 194],
  [410, 218], [450, 214], [490, 220], [530, 214],
  [420, 244], [460, 240], [500, 246], [538, 240],
  [430, 268], [470, 264], [510, 270],
  [450, 284], [492, 283], [476, 228],
];

/** Pear-shaped volumetric flask: narrow neck, wide bulb, flat base. */
const BULB =
  'L457,140 C457,165 390,180 390,230 C390,262 405,290 430,290 L510,290 C535,290 550,262 550,230 C550,180 483,165 483,140';

export function ReactingMassesDilution() {
  const cx = 470;
  const neckL = 457;
  const neckR = 483;
  const mark = 82;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        dilution: same moles of solute, more solution
      </Label>

      {/* beaker with 25.0 cm³ */}
      <rect x={82} y={204} width={100} height={52} className="dg-fill-accent" />
      <path d="M74,150 L80,156 L80,256 L184,256 L184,150" className="dg-line" />
      {DENSE.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.2} className="dg-dot-accent" />
      ))}
      <Label x={132} y={284} className="dg-text dg-bold">
        25.0 cm³ of 2.00 mol dm⁻³
      </Label>
      <Label x={132} y={304} className="dg-text-small">
        n = 2.00 × 0.0250 = 0.0500 mol
      </Label>

      {/* arrow */}
      <Arrow x1={204} y1={214} x2={378} y2={214} />
      <Label x={291} y={196} className="dg-text-small">
        add distilled water
      </Label>
      <Label x={291} y={234} className="dg-text-small">
        up to the mark,
      </Label>
      <Label x={291} y={250} className="dg-text-small">
        then invert to mix
      </Label>

      {/* volumetric flask filled to the mark */}
      <path d={`M${neckL},${mark} ${BULB} L${neckR},${mark} Z`} className="dg-fill-accent" />
      <path d={`M${neckL},48 ${BULB} L${neckR},48`} className="dg-line" />
      <line x1={neckL - 6} y1={mark} x2={neckR + 6} y2={mark} className="dg-line" />
      <line x1={neckR + 10} y1={mark} x2={548} y2={mark} className="dg-muted" />
      <Label x={554} y={mark} anchor="start" className="dg-text-small">
        250 cm³ mark
      </Label>
      {SPREAD.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.2} className="dg-dot-accent" />
      ))}
      <Label x={cx} y={316} className="dg-text dg-bold">
        250 cm³ of 0.200 mol dm⁻³
      </Label>
      <Label x={cx} y={336} className="dg-text-small">
        n = 0.200 × 0.250 = 0.0500 mol
      </Label>

      <Label x={W / 2} y={H - 14} className="dg-text-accent">
        c₁V₁ = c₂V₂:  2.00 × 25.0 = 0.200 × 250
      </Label>
    </Svg>
  );
}

export default ReactingMassesDilution;
