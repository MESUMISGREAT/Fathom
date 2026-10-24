/**
 * Dot-and-cross diagrams (outer shells only) for molecules with single covalent bonds:
 * H₂, Cl₂, HCl, CH₄, NH₃ and C₂H₆. Shared pairs sit in the overlap of two shells; lone
 * (non-bonding) pairs sit on one shell. In every molecule each atom ends with a full outer
 * shell: 2 electrons for H, 8 for C, N and Cl.
 */
import { Label, Svg } from '../primitives';
import { KeyRow, LonePair, type Mark, Shared, Shell, polar } from './covalent-bonding-kit';

export const diagramKey = 'chem-covalent-bonding-single-bonds';

const W = 640;
const H = 440;
const RH = 22;
const RC = 30;
const RCL = 34;

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

/** A central atom (crosses) with H atoms (dots) at the given angles, plus optional lone pairs. */
function Central({
  c,
  symbol,
  hAngles,
  lone = [],
}: {
  c: Pt;
  symbol: string;
  hAngles: number[];
  lone?: number[];
}) {
  const dCH = 38;
  return (
    <g>
      <Shell cx={c[0]} cy={c[1]} r={RC} symbol={symbol} />
      {hAngles.map((a) => {
        const h = polar(c[0], c[1], dCH, a);
        return (
          <g key={a}>
            <Shell cx={h[0]} cy={h[1]} r={RH} symbol="H" />
            <Shared a={c} ra={RC} b={h} rb={RH} marks={['cross', 'dot']} />
          </g>
        );
      })}
      {lone.map((a) => (
        <LonePair key={a} cx={c[0]} cy={c[1]} r={RC} angle={a} marks={['cross', 'cross']} />
      ))}
    </g>
  );
}

export function CovalentBondingSingleBonds() {
  const y1 = 92;
  const y2 = 282;
  // row 1
  const h2a: Pt = [84, y1];
  const h2b: Pt = [116, y1];
  const cl1: Pt = [275, y1];
  const cl2: Pt = [325, y1];
  const hcl: Pt = [494, y1];
  const clh: Pt = [534, y1];
  const clLone = (c: Pt, skip: number, mark: Mark) =>
    [0, 90, 180, 270]
      .filter((a) => a !== skip)
      .map((a) => <LonePair key={`${c[0]}-${a}`} cx={c[0]} cy={c[1]} r={RCL} angle={a} marks={[mark, mark]} />);
  // row 2
  const ch4: Pt = [100, y2];
  const nh3: Pt = [290, y2];
  const c1: Pt = [472, y2];
  const c2: Pt = [520, y2];
  return (
    <Svg width={W} height={H}>
      {/* H2 */}
      <Shell cx={h2a[0]} cy={h2a[1]} r={RH} symbol="H" />
      <Shell cx={h2b[0]} cy={h2b[1]} r={RH} symbol="H" />
      <Shared a={h2a} ra={RH} b={h2b} rb={RH} marks={['dot', 'cross']} />
      <Caption x={100} y={y1 + 62} name="H₂" note="1 shared pair" />

      {/* Cl2 */}
      <Shell cx={cl1[0]} cy={cl1[1]} r={RCL} symbol="Cl" />
      <Shell cx={cl2[0]} cy={cl2[1]} r={RCL} symbol="Cl" />
      <Shared a={cl1} ra={RCL} b={cl2} rb={RCL} marks={['dot', 'cross']} />
      {clLone(cl1, 0, 'dot')}
      {clLone(cl2, 180, 'cross')}
      <Caption x={300} y={y1 + 62} name="Cl₂" note="1 shared pair, 3 lone pairs on each Cl" />

      {/* HCl */}
      <Shell cx={hcl[0]} cy={hcl[1]} r={RH} symbol="H" />
      <Shell cx={clh[0]} cy={clh[1]} r={RCL} symbol="Cl" />
      <Shared a={hcl} ra={RH} b={clh} rb={RCL} marks={['dot', 'cross']} />
      {clLone(clh, 180, 'cross')}
      <Caption x={515} y={y1 + 62} name="HCl" note="1 shared pair, 3 lone pairs on Cl" />

      <line x1={24} y1={196} x2={W - 24} y2={196} className="dg-grid" />

      {/* CH4 */}
      <Central c={ch4} symbol="C" hAngles={[0, 90, 180, 270]} />
      <Caption x={ch4[0]} y={y2 + 82} name="CH₄" note="4 shared pairs" />

      {/* NH3 */}
      <Central c={nh3} symbol="N" hAngles={[0, 90, 180]} lone={[270]} />
      <Caption x={nh3[0]} y={y2 + 82} name="NH₃" note="3 shared pairs, 1 lone pair on N" />

      {/* C2H6 */}
      <Shell cx={c1[0]} cy={c1[1]} r={RC} symbol="C" />
      <Shell cx={c2[0]} cy={c2[1]} r={RC} symbol="C" />
      <Shared a={c1} ra={RC} b={c2} rb={RC} marks={['dot', 'cross']} />
      {[
        { c: c1, angles: [90, 180, 270] },
        { c: c2, angles: [270, 0, 90] },
      ].map(({ c, angles }) =>
        angles.map((a) => {
          const h = polar(c[0], c[1], 38, a);
          return (
            <g key={`${c[0]}-${a}`}>
              <Shell cx={h[0]} cy={h[1]} r={RH} symbol="H" />
              <Shared a={c} ra={RC} b={h} rb={RH} marks={['cross', 'dot']} />
            </g>
          );
        }),
      )}
      <Caption x={497} y={y2 + 82} name="C₂H₆" note="7 shared pairs (one C–C, six C–H)" />

      {/* key */}
      <KeyRow x={40} y={H - 16} mark="cross" >{'electron from C, N or the right-hand atom'}</KeyRow>
      <KeyRow x={340} y={H - 16} mark="dot">{'electron from H or the left-hand atom'}</KeyRow>
    </Svg>
  );
}

export default CovalentBondingSingleBonds;
