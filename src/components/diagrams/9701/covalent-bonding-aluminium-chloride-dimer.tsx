/**
 * Two AlCl₃ molecules (each Al has only 6 electrons in its outer shell) join to make the
 * Al₂Cl₆ dimer. Two Cl atoms bridge the Al atoms: each bridging Cl is bonded normally to
 * one Al and uses a lone pair to form a dative (coordinate) bond, drawn as an arrow, to the
 * other Al. Each Al then has four bonds and 8 outer-shell electrons.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-covalent-bonding-aluminium-chloride-dimer';

const W = 640;
const H = 380;
type Pt = [number, number];

function trimmed(p: Pt, q: Pt, t1: number, t2: number) {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const d = Math.hypot(dx, dy);
  return { x1: p[0] + (dx / d) * t1, y1: p[1] + (dy / d) * t1, x2: q[0] - (dx / d) * t2, y2: q[1] - (dy / d) * t2 };
}

function Bond({ p, q }: { p: Pt; q: Pt }) {
  return <line {...trimmed(p, q, 13, 13)} className="dg-line" />;
}

function Atom({ p, s }: { p: Pt; s: string }) {
  return (
    <Label x={p[0]} y={p[1]} className="dg-text dg-bold">
      {s}
    </Label>
  );
}

function Monomer({ c }: { c: Pt }) {
  const L = 46;
  const ligands: Pt[] = [270, 30, 150].map((a) => [c[0] + L * Math.cos((a * Math.PI) / 180), c[1] + L * Math.sin((a * Math.PI) / 180)]);
  return (
    <g>
      <Atom p={c} s="Al" />
      {ligands.map((p, i) => (
        <g key={i}>
          <Bond p={c} q={p} />
          <Atom p={p} s="Cl" />
        </g>
      ))}
    </g>
  );
}

export function CovalentBondingAluminiumChlorideDimer() {
  const al1: Pt = [360, 190];
  const al2: Pt = [500, 190];
  const bt: Pt = [430, 122];
  const bb: Pt = [430, 258];
  const t: Pt[] = [
    [296, 126],
    [296, 254],
    [564, 126],
    [564, 254],
  ];
  return (
    <Svg width={W} height={H}>
      <Label x={90} y={28} className="dg-text dg-bold">
        2 AlCl₃
      </Label>
      <Monomer c={[90, 112]} />
      <Monomer c={[90, 262]} />
      <Label x={90} y={330} className="dg-text-small">
        6 electrons around each Al
      </Label>
      <Label x={90} y={347} className="dg-text-small">
        (electron deficient)
      </Label>

      <Arrow x1={182} y1={190} x2={250} y2={190} />

      <Label x={430} y={28} className="dg-text dg-bold">
        Al₂Cl₆
      </Label>
      <Atom p={al1} s="Al" />
      <Atom p={al2} s="Al" />
      <Atom p={bt} s="Cl" />
      <Atom p={bb} s="Cl" />
      {t.map((p, i) => (
        <g key={i}>
          <Atom p={p} s="Cl" />
          <Bond p={i < 2 ? al1 : al2} q={p} />
        </g>
      ))}
      {/* ordinary bonds to the bridging Cl atoms */}
      <Bond p={al1} q={bt} />
      <Bond p={al2} q={bb} />
      {/* dative bonds: Cl lone pair → the other Al */}
      <Arrow {...trimmed(bt, al2, 13, 14)} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow {...trimmed(bb, al1, 13, 14)} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      {/* lone pairs that are donated */}
      <circle cx={bt[0] + 3} cy={bt[1] - 14} r={2.6} className="dg-dot-accent-2" />
      <circle cx={bt[0] + 11} cy={bt[1] - 11} r={2.6} className="dg-dot-accent-2" />
      <circle cx={bb[0] - 3} cy={bb[1] + 14} r={2.6} className="dg-dot-accent-2" />
      <circle cx={bb[0] - 11} cy={bb[1] + 11} r={2.6} className="dg-dot-accent-2" />

      <line x1={330} y1={312} x2={352} y2={312} className="dg-line" />
      <Label x={360} y={312} anchor="start" className="dg-text-small">
        ordinary covalent bond
      </Label>
      <Arrow x1={330} y1={334} x2={354} y2={334} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={360} y={334} anchor="start" className="dg-text-small">
        dative bond: Cl lone pair donated to Al
      </Label>
      <Label x={430} y={358} className="dg-text-small">
        now 8 electrons around each Al
      </Label>
    </Svg>
  );
}

export default CovalentBondingAluminiumChlorideDimer;
