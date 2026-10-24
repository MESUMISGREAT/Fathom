/**
 * Why fluorine out-pulls chlorine. A fluorine atom (nucleus +9, inner shell of 2) and a
 * chlorine atom (nucleus +17, inner shells of 2 and 8), each with its outer shell of eight
 * electrons: six non-bonding and, at the top, the bonding pair (accent). The outer shells are
 * drawn to scale using atomic (covalent) radii of 72 pm and 99 pm; the inner shells are
 * schematic. An arrow from each bonding pair to the nucleus shows the attraction. A table
 * underneath compares nuclear charge, inner (shielding) electrons, the rough net pull
 * (protons minus inner electrons, +7 for both), atomic radius and Pauling electronegativity
 * (4.0 and 3.2).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-electronegativity-bonding-fluorine-vs-chlorine';

const W = 640;
const H = 450;
const CY = 172;
/** px per pm for the outer shell. */
const SCALE = 1.28;

interface Atom {
  name: string;
  cx: number;
  z: number;
  radiusPm: number;
  /** [radius px, number of electrons] for each inner shell (schematic). */
  inner: Array<[number, number]>;
}

const ATOMS: Atom[] = [
  { name: 'fluorine, F', cx: 170, z: 9, radiusPm: 72, inner: [[34, 2]] },
  { name: 'chlorine, Cl', cx: 470, z: 17, radiusPm: 99, inner: [[30, 2], [70, 8]] },
];

const ROWS: Array<[string, string, string]> = [
  ['nuclear charge', '+9', '+17'],
  ['inner (shielding) electrons', '2', '10'],
  ['net pull ≈ protons − inner electrons', '+7', '+7'],
  ['atomic radius', '72 pm', '99 pm'],
];

const at = (cx: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: CY + r * Math.sin(a) };
};

function AtomDrawing({ atom }: { atom: Atom }) {
  const r = atom.radiusPm * SCALE;
  const pairHalf = (Math.asin(10 / r) * 180) / Math.PI;
  const lone = [0, 90, 180].flatMap((deg) => [deg - pairHalf, deg + pairHalf]);
  const bonding = [-90 - pairHalf, -90 + pairHalf];
  const innerMax = atom.inner[atom.inner.length - 1]![0];
  return (
    <g>
      <circle cx={atom.cx} cy={CY} r={r} className="dg-thin" />
      {atom.inner.map(([ri, n]) => (
        <g key={ri}>
          <circle cx={atom.cx} cy={CY} r={ri} className="dg-muted" />
          {Array.from({ length: n }, (_, i) => {
            const deg = n === 2 ? i * 180 : 22.5 + i * 45;
            const p = at(atom.cx, ri, deg);
            return <circle key={i} cx={p.x} cy={p.y} r={3.2} className="dg-dot" />;
          })}
        </g>
      ))}
      <circle cx={atom.cx} cy={CY} r={17} className="dg-thin dg-fill-accent-2" />
      <Label x={atom.cx} y={CY + 1} className="dg-text-small dg-bold">
        {`+${atom.z}`}
      </Label>
      {lone.map((deg) => {
        const p = at(atom.cx, r, deg);
        return <circle key={deg} cx={p.x} cy={p.y} r={3.6} className="dg-dot" />;
      })}
      {bonding.map((deg) => {
        const p = at(atom.cx, r, deg);
        return <circle key={deg} cx={p.x} cy={p.y} r={4.6} className="dg-dot-accent" />;
      })}
      <Label x={atom.cx} y={CY - r - 16} className="dg-text-small dg-bold">
        bonding pair
      </Label>
      <Arrow x1={atom.cx} y1={CY - r + 10} x2={atom.cx} y2={CY - 22} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={atom.cx + 8} y={CY - (innerMax + r) / 2} anchor="start" className="dg-text-small">
        {`${atom.radiusPm} pm`}
      </Label>
      <Label x={atom.cx} y={CY + 99 * SCALE + 22} className="dg-text dg-bold">
        {atom.name}
      </Label>
    </g>
  );
}

export function ElectronegativityBondingFluorineVsChlorine() {
  const mid = (ATOMS[0]!.cx + ATOMS[1]!.cx) / 2;
  const top = 350;
  const step = 20;
  return (
    <Svg width={W} height={H}>
      {ATOMS.map((a) => (
        <AtomDrawing key={a.name} atom={a} />
      ))}

      <line x1={40} y1={top - 14} x2={W - 40} y2={top - 14} className="dg-grid" />
      {ROWS.map(([label, f, cl], i) => (
        <g key={label}>
          <Label x={mid} y={top + i * step} className="dg-text-muted">
            {label}
          </Label>
          <Label x={ATOMS[0]!.cx} y={top + i * step} className="dg-text">
            {f}
          </Label>
          <Label x={ATOMS[1]!.cx} y={top + i * step} className="dg-text">
            {cl}
          </Label>
        </g>
      ))}
      <line x1={40} y1={top + ROWS.length * step - 8} x2={W - 40} y2={top + ROWS.length * step - 8} className="dg-grid" />
      <Label x={mid} y={top + ROWS.length * step + 8} className="dg-text dg-bold">
        electronegativity
      </Label>
      <Label x={ATOMS[0]!.cx} y={top + ROWS.length * step + 8} className="dg-text-accent">
        4.0
      </Label>
      <Label x={ATOMS[1]!.cx} y={top + ROWS.length * step + 8} className="dg-text-accent">
        3.2
      </Label>
    </Svg>
  );
}

export default ElectronegativityBondingFluorineVsChlorine;
