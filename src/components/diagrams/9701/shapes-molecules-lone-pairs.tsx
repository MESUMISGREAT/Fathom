/**
 * Lone pairs squeeze bond angles. CH₄: 4 bonding pairs, 0 lone pairs, tetrahedral, 109.5°.
 * NH₃: 3 bonding pairs, 1 lone pair, pyramidal, 107°. H₂O: 2 bonding pairs, 2 lone pairs,
 * non-linear (bent), 104.5°. All three have four electron pairs arranged roughly
 * tetrahedrally; the shape name describes only where the atoms are. Lone pairs (shaded
 * balloons with two electrons) repel more strongly than bonding pairs, so each one closes
 * the bond angle by about 2.5°. Repulsion order: lone pair–lone pair > lone pair–bonding
 * pair > bonding pair–bonding pair.
 */
import { Label, Svg } from '../primitives';
import { AngleArc, Atom, Bond, type BondKind, LonePairLobe, polar } from './shapes-molecules-kit';

export const diagramKey = 'chem-shapes-molecules-lone-pairs';

const W = 640;
const H = 380;
const LEN = 62;
type Pt = [number, number];

function Arm({ c, a, kind, s }: { c: Pt; a: number; kind?: BondKind; s: string }) {
  return (
    <g>
      <Bond c={c} angle={a} len={LEN} kind={kind} />
      <Atom p={polar(c, LEN, a)} s={s} />
    </g>
  );
}

function Caption({ x, lines }: { x: number; lines: [string, string, string] }) {
  return (
    <g>
      <Label x={x} y={226} className="dg-text dg-bold">
        {lines[0]}
      </Label>
      <Label x={x} y={246} className="dg-text-small">
        {lines[1]}
      </Label>
      <Label x={x} y={264} className="dg-text-accent">
        {lines[2]}
      </Label>
    </g>
  );
}

export function ShapesMoleculesLonePairs() {
  const y = 118;
  const ch4: Pt = [110, y];
  const nh3: Pt = [320, y];
  const h2o: Pt = [530, y];
  return (
    <Svg width={W} height={H}>
      {/* CH4 */}
      <Arm c={ch4} a={270} s="H" />
      <Arm c={ch4} a={155} s="H" />
      <Arm c={ch4} a={55} kind="wedge" s="H" />
      <Arm c={ch4} a={15} kind="dash" s="H" />
      <Atom p={ch4} s="C" />
      <AngleArc c={ch4} a1={155} a2={270} r={24} label="109.5°" labelR={46} />
      <Caption x={110} lines={['CH₄: tetrahedral', '4 bonding pairs, 0 lone pairs', '109.5°']} />

      {/* NH3 */}
      <LonePairLobe c={nh3} angle={270} />
      <Arm c={nh3} a={150} s="H" />
      <Arm c={nh3} a={65} kind="wedge" s="H" />
      <Arm c={nh3} a={25} kind="dash" s="H" />
      <Atom p={nh3} s="N" />
      <AngleArc c={nh3} a1={65} a2={150} r={26} label="107°" labelR={44} />
      <Caption x={320} lines={['NH₃: pyramidal', '3 bonding pairs, 1 lone pair', '107°']} />

      {/* H2O */}
      <LonePairLobe c={h2o} angle={232} />
      <LonePairLobe c={h2o} angle={308} />
      <Arm c={h2o} a={142.25} s="H" />
      <Arm c={h2o} a={37.75} s="H" />
      <Atom p={h2o} s="O" />
      <AngleArc c={h2o} a1={37.75} a2={142.25} r={26} label="104.5°" labelR={46} />
      <Caption x={530} lines={['H₂O: non-linear (bent)', '2 bonding pairs, 2 lone pairs', '104.5°']} />

      {/* repulsion ladder */}
      <rect x={24} y={296} width={W - 48} height={64} rx={10} className="dg-thin dg-fill-muted" />
      <Label x={W / 2} y={316} className="dg-text dg-bold">
        repulsion between pairs: lone–lone &gt; lone–bonding &gt; bonding–bonding
      </Label>
      <Label x={W / 2} y={340} className="dg-text-small">
        each lone pair closes the bond angle by about 2.5°: 109.5° → 107° → 104.5°
      </Label>
    </Svg>
  );
}

export default ShapesMoleculesLonePairs;
