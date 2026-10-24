/**
 * The five basic shapes for molecules with no lone pairs on the central atom (VSEPR):
 * CO₂ linear (2 bonding regions, 180°), BF₃ trigonal planar (3, 120°), CH₄ tetrahedral
 * (4, 109.5°), PF₅ trigonal bipyramidal (5; 120° between equatorial bonds, 90° between
 * axial and equatorial bonds) and SF₆ octahedral (6, 90°). Plain lines are in the plane of
 * the paper, solid wedges come towards you and hashed wedges go away from you.
 */
import { Label, Svg } from '../primitives';
import { AngleArc, Atom, Bond, type BondKind, RightAngle, polar } from './shapes-molecules-kit';

export const diagramKey = 'chem-shapes-molecules-five-shapes';

const W = 640;
const H = 500;
type Pt = [number, number];
const LEN = 62;

function Molecule({ c, centre, ligand, bonds }: { c: Pt; centre: string; ligand: string; bonds: Array<{ a: number; kind?: BondKind }> }) {
  return (
    <g>
      {bonds.map((b) => (
        <g key={b.a}>
          <Bond c={c} angle={b.a} len={LEN} kind={b.kind} />
          <Atom p={polar(c, LEN, b.a)} s={ligand} />
        </g>
      ))}
      <Atom p={c} s={centre} />
    </g>
  );
}

function Caption({ x, y, name, shape, detail }: { x: number; y: number; name: string; shape: string; detail: string }) {
  return (
    <g>
      <Label x={x} y={y} className="dg-text dg-bold">
        {`${name}: ${shape}`}
      </Label>
      <Label x={x} y={y + 18} className="dg-text-small">
        {detail}
      </Label>
    </g>
  );
}

export function ShapesMoleculesFiveShapes() {
  const y1 = 100;
  const co2: Pt = [110, y1];
  const bf3: Pt = [320, y1 + 6];
  const ch4: Pt = [530, y1 + 6];
  const y2 = 340;
  const pf5: Pt = [190, y2];
  const sf6: Pt = [450, y2];
  return (
    <Svg width={W} height={H}>
      {/* CO2 */}
      <Molecule c={co2} centre="C" ligand="O" bonds={[{ a: 0, kind: 'double' }, { a: 180, kind: 'double' }]} />
      <AngleArc c={co2} a1={180} a2={0} r={22} label="180°" labelR={40} />
      <Caption x={110} y={192} name="CO₂" shape="linear" detail="2 bonding regions, 180°" />

      {/* BF3 */}
      <Molecule c={bf3} centre="B" ligand="F" bonds={[{ a: 270 }, { a: 30 }, { a: 150 }]} />
      <AngleArc c={bf3} a1={30} a2={150} r={24} label="120°" labelR={42} />
      <Caption x={320} y={192} name="BF₃" shape="trigonal planar" detail="3 bonding pairs, 120°" />

      {/* CH4 */}
      <Molecule c={ch4} centre="C" ligand="H" bonds={[{ a: 270 }, { a: 155 }, { a: 55, kind: 'wedge' }, { a: 15, kind: 'dash' }]} />
      <AngleArc c={ch4} a1={155} a2={270} r={24} label="109.5°" labelR={46} />
      <Caption x={530} y={192} name="CH₄" shape="tetrahedral" detail="4 bonding pairs, 109.5°" />

      <line x1={24} y1={236} x2={W - 24} y2={236} className="dg-grid" />

      {/* PF5 */}
      <Molecule
        c={pf5}
        centre="P"
        ligand="F"
        bonds={[{ a: 270 }, { a: 90 }, { a: 180 }, { a: 25, kind: 'wedge' }, { a: 335, kind: 'dash' }]}
      />
      <RightAngle c={pf5} a={180} />
      <Label x={pf5[0] - 30} y={pf5[1] - 30} className="dg-text-accent">
        90°
      </Label>
      <Caption x={190} y={y2 + 100} name="PF₅" shape="trigonal bipyramidal" detail="5 bonding pairs, 120° and 90°" />

      {/* SF6 */}
      <Molecule
        c={sf6}
        centre="S"
        ligand="F"
        bonds={[{ a: 270 }, { a: 90 }, { a: 180 }, { a: 0 }, { a: 40, kind: 'wedge' }, { a: 220, kind: 'dash' }]}
      />
      <RightAngle c={sf6} a={270} />
      <Label x={sf6[0] + 28} y={sf6[1] - 28} className="dg-text-accent">
        90°
      </Label>
      <Caption x={450} y={y2 + 100} name="SF₆" shape="octahedral" detail="6 bonding pairs, 90°" />

      <Label x={W / 2} y={H - 14} className="dg-text-small">
        line: in the plane of the paper · solid wedge: towards you · hashed wedge: away from you
      </Label>
    </Svg>
  );
}

export default ShapesMoleculesFiveShapes;
