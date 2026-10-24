/**
 * Bonding in ethene, C₂H₄. Left: the flat σ framework seen from above (four C–H σ bonds
 * and one C–C σ bond, angles about 120° around each carbon); the second line of the C=C
 * double bond is the π bond. Right: side view with the plane of the molecule edge-on. Each
 * sp² carbon has one unhybridised p orbital at right angles to the plane; they overlap
 * sideways, so the π electron density sits above and below the plane.
 */
import { Label, Svg } from '../primitives';
import { Lobe } from './covalent-bonding-kit';

export const diagramKey = 'chem-covalent-bonding-ethene-pi-bond';

const W = 640;
const H = 320;

type Pt = [number, number];

function trimmed(p: Pt, q: Pt, t: number) {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const d = Math.hypot(dx, dy);
  return { x1: p[0] + (dx / d) * t, y1: p[1] + (dy / d) * t, x2: q[0] - (dx / d) * t, y2: q[1] - (dy / d) * t };
}

export function CovalentBondingEthenePiBond() {
  // top view
  const c1: Pt = [120, 160];
  const c2: Pt = [200, 160];
  const L = 62;
  const hs: Array<[Pt, Pt]> = [
    [c1, [c1[0] - L * Math.cos(Math.PI / 6), c1[1] - L / 2]],
    [c1, [c1[0] - L * Math.cos(Math.PI / 6), c1[1] + L / 2]],
    [c2, [c2[0] + L * Math.cos(Math.PI / 6), c2[1] - L / 2]],
    [c2, [c2[0] + L * Math.cos(Math.PI / 6), c2[1] + L / 2]],
  ];
  // side view
  const y = 170;
  const s1 = 410;
  const s2 = 470;
  return (
    <Svg width={W} height={H}>
      <Label x={160} y={28} className="dg-text dg-bold">
        from above: the σ framework
      </Label>
      {hs.map(([c, h], i) => (
        <g key={i}>
          <line {...trimmed(c, h, 12)} className="dg-line" />
          <Label x={h[0]} y={h[1]} className="dg-text dg-bold">
            H
          </Label>
          <Label x={(c[0] + h[0]) / 2 + (i < 2 ? 2 : -2)} y={(c[1] + h[1]) / 2 + (i % 2 === 0 ? -12 : 12)} className="dg-text-small dg-italic">
            σ
          </Label>
        </g>
      ))}
      <line x1={c1[0] + 12} y1={c1[1] - 4} x2={c2[0] - 12} y2={c2[1] - 4} className="dg-line" />
      <line x1={c1[0] + 12} y1={c1[1] + 5} x2={c2[0] - 12} y2={c2[1] + 5} className="dg-accent-2" />
      <Label x={c1[0]} y={c1[1]} className="dg-text dg-bold">
        C
      </Label>
      <Label x={c2[0]} y={c2[1]} className="dg-text dg-bold">
        C
      </Label>
      <Label x={160} y={c1[1] - 18} className="dg-text-small dg-italic">
        σ
      </Label>
      <Label x={160} y={c1[1] + 22} className="dg-text-accent-2">
        π
      </Label>
      <Label x={160} y={250} className="dg-text-small">
        5 σ bonds in one flat plane,
      </Label>
      <Label x={160} y={267} className="dg-text-small">
        about 120° around each carbon
      </Label>

      <line x1={316} y1={40} x2={316} y2={290} className="dg-grid" />

      <Label x={480} y={28} className="dg-text dg-bold">
        side on: the π bond
      </Label>
      {/* p orbitals (unhybridised), at right angles to the plane */}
      {[s1, s2].map((x) => (
        <g key={x}>
          <Lobe x={x} y={y} angle={-90} len={52} w={30} className="dg-muted" />
          <Lobe x={x} y={y} angle={90} len={52} w={30} className="dg-muted" />
        </g>
      ))}
      <ellipse cx={(s1 + s2) / 2} cy={y - 34} rx={56} ry={17} className="dg-thin dg-fill-accent-2" />
      <ellipse cx={(s1 + s2) / 2} cy={y + 34} rx={56} ry={17} className="dg-thin dg-fill-accent-2" />
      {/* plane of the molecule, edge-on */}
      <line x1={344} y1={y} x2={536} y2={y} className="dg-line" />
      <circle cx={s1} cy={y} r={4} className="dg-dot" />
      <circle cx={s2} cy={y} r={4} className="dg-dot" />
      <Label x={s1 - 18} y={y + 10} className="dg-text-small dg-bold">
        C
      </Label>
      <Label x={s2 + 18} y={y + 10} className="dg-text-small dg-bold">
        C
      </Label>
      <Label x={548} y={y} anchor="start" className="dg-text-small">
        plane of
      </Label>
      <Label x={548} y={y + 15} anchor="start" className="dg-text-small">
        the molecule
      </Label>
      <Label x={538} y={y - 46} anchor="start" className="dg-text-accent-2">
        π above
      </Label>
      <Label x={538} y={y + 50} anchor="start" className="dg-text-accent-2">
        π below
      </Label>
      <Label x={480} y={267} className="dg-text-small">
        one π bond = both shaded regions together
      </Label>
      <Label x={480} y={284} className="dg-text-small">
        (sideways overlap of two p orbitals)
      </Label>
    </Svg>
  );
}

export default CovalentBondingEthenePiBond;
