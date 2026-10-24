/**
 * Shapes around each central atom in bigger molecules. Ethane, C₂H₆: each carbon has four
 * bonding pairs, so it is tetrahedral (109.5°). Ethene, C₂H₄: each carbon has three bonding
 * regions (two C–H and the C=C, which counts as one region), so it is trigonal planar (120°)
 * and the whole molecule is flat. Hydrogen cyanide, HCN: the carbon has two bonding regions
 * (C–H and C≡N), so it is linear (180°).
 */
import { Label, Svg } from '../primitives';
import { AngleArc, Atom, Bond, type BondKind, polar } from './shapes-molecules-kit';

export const diagramKey = 'chem-shapes-molecules-several-centres';

const W = 640;
const H = 290;
type Pt = [number, number];
const LEN = 54;

function Arm({ c, a, kind, s, len = LEN }: { c: Pt; a: number; kind?: BondKind; s: string; len?: number }) {
  return (
    <g>
      <Bond c={c} angle={a} len={len} kind={kind} />
      <Atom p={polar(c, len, a)} s={s} />
    </g>
  );
}

function Triple({ a, b }: { a: Pt; b: Pt }) {
  return (
    <g>
      {[-5, 0, 5].map((o) => (
        <line key={o} x1={a[0] + 12} y1={a[1] + o} x2={b[0] - 12} y2={b[1] + o} className="dg-line" />
      ))}
    </g>
  );
}

function Caption({ x, lines }: { x: number; lines: [string, string, string] }) {
  return (
    <g>
      <Label x={x} y={214} className="dg-text dg-bold">
        {lines[0]}
      </Label>
      <Label x={x} y={234} className="dg-text-small">
        {lines[1]}
      </Label>
      <Label x={x} y={252} className="dg-text-accent">
        {lines[2]}
      </Label>
    </g>
  );
}

export function ShapesMoleculesSeveralCentres() {
  const y = 112;
  // ethane
  const e1: Pt = [80, y];
  const e2: Pt = [140, y];
  // ethene
  const t1: Pt = [292, y];
  const t2: Pt = [352, y];
  // HCN
  const h: Pt = [478, y];
  const c: Pt = [530, y];
  const n: Pt = [590, y];
  return (
    <Svg width={W} height={H}>
      {/* ethane */}
      <Bond c={e1} angle={0} len={60} />
      <Arm c={e1} a={270} s="H" />
      <Arm c={e1} a={145} kind="wedge" s="H" />
      <Arm c={e1} a={200} kind="dash" s="H" />
      <Arm c={e2} a={90} s="H" />
      <Arm c={e2} a={325} kind="wedge" s="H" />
      <Arm c={e2} a={20} kind="dash" s="H" />
      <Atom p={e1} s="C" />
      <Atom p={e2} s="C" />
      <AngleArc c={e1} a1={270} a2={0} r={22} label="109.5°" labelR={44} />
      <Caption x={110} lines={['ethane, C₂H₆', 'tetrahedral around each C', '109.5°']} />

      {/* ethene */}
      <Bond c={t1} angle={0} len={60} kind="double" />
      <Arm c={t1} a={120} s="H" />
      <Arm c={t1} a={240} s="H" />
      <Arm c={t2} a={60} s="H" />
      <Arm c={t2} a={300} s="H" />
      <Atom p={t1} s="C" />
      <Atom p={t2} s="C" />
      <AngleArc c={t1} a1={240} a2={0} r={22} label="120°" labelR={40} />
      <Caption x={322} lines={['ethene, C₂H₄', 'trigonal planar around each C', '120° (flat molecule)']} />

      {/* HCN */}
      <Bond c={c} angle={180} len={52} />
      <Triple a={c} b={n} />
      <Atom p={h} s="H" />
      <Atom p={c} s="C" />
      <Atom p={n} s="N" />
      <AngleArc c={c} a1={180} a2={0} r={22} label="180°" labelR={40} />
      <Caption x={534} lines={['hydrogen cyanide, HCN', 'linear around C', '180°']} />

      <Label x={W / 2} y={H - 12} className="dg-text-small">
        a double or triple bond counts as one bonding region
      </Label>
    </Svg>
  );
}

export default ShapesMoleculesSeveralCentres;
