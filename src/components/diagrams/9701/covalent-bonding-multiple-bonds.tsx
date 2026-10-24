/**
 * Dot-and-cross diagrams (outer shells only) for molecules with double and triple bonds:
 * O₂ (O=O, two lone pairs on each O), N₂ (N≡N, one lone pair on each N), CO₂ (O=C=O, two
 * lone pairs on each O) and C₂H₄ (one C=C and four C–H). Every atom ends with a full
 * outer shell: 8 electrons for C, N and O, 2 for H.
 */
import { Label, Svg } from '../primitives';
import { Electron, LonePair, type Mark, Shared, Shell, polar } from './covalent-bonding-kit';

export const diagramKey = 'chem-covalent-bonding-multiple-bonds';

const W = 640;
const H = 410;
type Pt = [number, number];

function Caption({ x, y, name, note }: { x: number; y: number; name: string; note: string }) {
  return (
    <g>
      <Label x={x} y={y} className="dg-text dg-bold">
        {name}
      </Label>
      <Label x={x} y={y + 17} className="dg-text-small">
        {note}
      </Label>
    </g>
  );
}

const pairs = (a: Mark, b: Mark, n: number): Mark[] => Array.from({ length: n }, () => [a, b]).flat();

export function CovalentBondingMultipleBonds() {
  const y1 = 96;
  const y2 = 270;
  const RO = 34;
  // O2
  const o1: Pt = [145, y1];
  const o2: Pt = [195, y1];
  // N2
  const n1: Pt = [445, y1];
  const n2: Pt = [495, y1];
  // CO2
  const RC = 30;
  const RO2 = 32;
  const c: Pt = [170, y2];
  const oL: Pt = [126, y2];
  const oR: Pt = [214, y2];
  // C2H4
  const cA: Pt = [449, y2];
  const cB: Pt = [491, y2];
  const hs: Array<{ c: Pt; a: number }> = [
    { c: cA, a: 120 },
    { c: cA, a: 240 },
    { c: cB, a: 60 },
    { c: cB, a: 300 },
  ];
  return (
    <Svg width={W} height={H}>
      {/* O2 */}
      <Shell cx={o1[0]} cy={o1[1]} r={RO} symbol="O" />
      <Shell cx={o2[0]} cy={o2[1]} r={RO} symbol="O" />
      <Shared a={o1} ra={RO} b={o2} rb={RO} marks={pairs('dot', 'cross', 2)} />
      {[230, 130].map((a) => (
        <LonePair key={a} cx={o1[0]} cy={o1[1]} r={RO} angle={a} marks={['dot', 'dot']} />
      ))}
      {[310, 50].map((a) => (
        <LonePair key={a} cx={o2[0]} cy={o2[1]} r={RO} angle={a} marks={['cross', 'cross']} />
      ))}
      <Caption x={170} y={y1 + 62} name="O₂" note="O=O: 2 shared pairs (a double bond)" />

      {/* N2 */}
      <Shell cx={n1[0]} cy={n1[1]} r={RO} symbol="N" />
      <Shell cx={n2[0]} cy={n2[1]} r={RO} symbol="N" />
      <Shared a={n1} ra={RO} b={n2} rb={RO} marks={pairs('dot', 'cross', 3)} />
      <LonePair cx={n1[0]} cy={n1[1]} r={RO} angle={180} marks={['dot', 'dot']} />
      <LonePair cx={n2[0]} cy={n2[1]} r={RO} angle={0} marks={['cross', 'cross']} />
      <Caption x={470} y={y1 + 62} name="N₂" note="N≡N: 3 shared pairs (a triple bond)" />

      <line x1={24} y1={190} x2={W - 24} y2={190} className="dg-grid" />

      {/* CO2 */}
      <Shell cx={oL[0]} cy={oL[1]} r={RO2} symbol="O" />
      <Shell cx={oR[0]} cy={oR[1]} r={RO2} symbol="O" />
      <Shell cx={c[0]} cy={c[1]} r={RC} symbol="C" />
      <Shared a={oL} ra={RO2} b={c} rb={RC} marks={pairs('dot', 'cross', 2)} />
      <Shared a={c} ra={RC} b={oR} rb={RO2} marks={pairs('cross', 'dot', 2)} />
      {[230, 130].map((a) => (
        <LonePair key={a} cx={oL[0]} cy={oL[1]} r={RO2} angle={a} marks={['dot', 'dot']} />
      ))}
      {[310, 50].map((a) => (
        <LonePair key={a} cx={oR[0]} cy={oR[1]} r={RO2} angle={a} marks={['dot', 'dot']} />
      ))}
      <Caption x={170} y={y2 + 64} name="CO₂" note="O=C=O: two double bonds, no lone pairs on C" />

      {/* C2H4 */}
      <Shell cx={cA[0]} cy={cA[1]} r={RC} symbol="C" />
      <Shell cx={cB[0]} cy={cB[1]} r={RC} symbol="C" />
      <Shared a={cA} ra={RC} b={cB} rb={RC} marks={pairs('cross', 'cross', 2)} />
      {hs.map(({ c: cc, a }) => {
        const h = polar(cc[0], cc[1], 38, a);
        return (
          <g key={`${cc[0]}-${a}`}>
            <Shell cx={h[0]} cy={h[1]} r={22} symbol="H" />
            <Shared a={cc} ra={RC} b={h} rb={22} marks={['cross', 'dot']} />
          </g>
        );
      })}
      <Caption x={470} y={y2 + 64} name="C₂H₄" note="one C=C double bond and four C–H bonds" />

      {/* key */}
      <Electron x={150} y={H - 18} mark="dot" />
      <Electron x={164} y={H - 18} mark="cross" />
      <Label x={176} y={H - 18} anchor="start" className="dg-text-small">
        dots and crosses are electrons from different atoms (outer shells only)
      </Label>
    </Svg>
  );
}

export default CovalentBondingMultipleBonds;
