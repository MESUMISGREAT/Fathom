/**
 * Forming the ammonium ion: NH₃ + H⁺ → NH₄⁺. Top row: dot-and-cross (outer shells only).
 * NH₃ has a lone pair on N; H⁺ has no electrons (an empty 1s orbital); in NH₄⁺ the new
 * N–H bond holds two electrons that both came from N (a coordinate or dative bond).
 * Bottom row: the same change with displayed formulae; the dative bond is an arrow
 * pointing from the N (the lone-pair donor) to the H (the acceptor).
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';
import { Electron, LonePair, Shared, Shell, polar } from './covalent-bonding-kit';

export const diagramKey = 'chem-covalent-bonding-ammonium-ion';

const W = 640;
const H = 440;
type Pt = [number, number];
const RN = 30;
const RH = 22;
const D = 38;

function Bracket({ x1, x2, y1, y2, charge }: { x1: number; x2: number; y1: number; y2: number; charge: string }) {
  const t = 8;
  return (
    <g>
      <path d={`M${x1 + t},${y1} L${x1},${y1} L${x1},${y2} L${x1 + t},${y2}`} className="dg-line" />
      <path d={`M${x2 - t},${y1} L${x2},${y1} L${x2},${y2} L${x2 - t},${y2}`} className="dg-line" />
      <Label x={x2 + 9} y={y1 + 4} className="dg-text dg-bold">
        {charge}
      </Label>
    </g>
  );
}

export function CovalentBondingAmmoniumIon() {
  const y1 = 128;
  const nA: Pt = [110, y1];
  const hPlus: Pt = [268, y1];
  const nB: Pt = [490, y1];
  const top = polar(nB[0], nB[1], D, 270);
  // lens centre of the new bond (between N and the top H)
  const lens = polar(nB[0], nB[1], (D - RH + RN) / 2, 270);

  const y2 = 330;
  const L = 46;
  return (
    <Svg width={W} height={H}>
      <MathLabel
        x={W / 2}
        y={22}
        w={420}
        h={30}
        tex={'\\text{NH}_3\\text{(g)} + \\text{HCl(g)} \\rightarrow \\text{NH}_4\\text{Cl(s)}'}
      />
      <Label x={W / 2} y={46} className="dg-text-small">
        HCl gives up H⁺ (its Cl keeps both bonding electrons as Cl⁻); NH₃ picks up the H⁺
      </Label>

      {/* row 1: dot-and-cross */}
      <Shell cx={nA[0]} cy={nA[1]} r={RN} symbol="N" />
      {[0, 90, 180].map((a) => {
        const h = polar(nA[0], nA[1], D, a);
        return (
          <g key={a}>
            <Shell cx={h[0]} cy={h[1]} r={RH} symbol="H" />
            <Shared a={nA} ra={RN} b={h} rb={RH} marks={['cross', 'dot']} />
          </g>
        );
      })}
      <LonePair cx={nA[0]} cy={nA[1]} r={RN} angle={270} marks={['cross', 'cross']} />
      <Label x={nA[0]} y={y1 + 80} className="dg-text-small">
        NH₃: lone pair on N
      </Label>

      <Label x={196} y={y1} className="dg-text dg-bold">
        +
      </Label>
      <circle cx={hPlus[0]} cy={hPlus[1]} r={RH} className="dg-muted dg-dashed" />
      <Label x={hPlus[0]} y={hPlus[1]} className="dg-text dg-bold">
        H⁺
      </Label>
      <Label x={hPlus[0]} y={y1 + 80} className="dg-text-small">
        H⁺: no electrons
      </Label>

      <Arrow x1={318} y1={y1} x2={390} y2={y1} />

      <Bracket x1={420} x2={560} y1={y1 - 70} y2={y1 + 70} charge="+" />
      <Shell cx={nB[0]} cy={nB[1]} r={RN} symbol="N" />
      {[0, 90, 180].map((a) => {
        const h = polar(nB[0], nB[1], D, a);
        return (
          <g key={a}>
            <Shell cx={h[0]} cy={h[1]} r={RH} symbol="H" />
            <Shared a={nB} ra={RN} b={h} rb={RH} marks={['cross', 'dot']} />
          </g>
        );
      })}
      <circle cx={top[0]} cy={top[1]} r={RH} className="dg-thin" />
      <Label x={top[0]} y={top[1] - 7} className="dg-text dg-bold">
        H
      </Label>
      <ellipse cx={lens[0]} cy={lens[1]} rx={13} ry={7.5} className="dg-accent-2" />
      <Shared a={nB} ra={RN} b={top} rb={RH} marks={['cross', 'cross']} />
      <Label x={nB[0]} y={y1 + 92} className="dg-text-small">
        NH₄⁺: both electrons in the ringed pair came from N
      </Label>

      <line x1={24} y1={236} x2={W - 24} y2={236} className="dg-grid" />

      {/* row 2: displayed formulae */}
      <Label x={110} y={y2} className="dg-text dg-bold">
        N
      </Label>
      <line x1={100} y1={y2} x2={110 - L + 10} y2={y2} className="dg-line" />
      <line x1={120} y1={y2} x2={110 + L - 10} y2={y2} className="dg-line" />
      <line x1={110} y1={y2 + 10} x2={110} y2={y2 + L - 10} className="dg-line" />
      <Label x={110 - L} y={y2} className="dg-text dg-bold">
        H
      </Label>
      <Label x={110 + L} y={y2} className="dg-text dg-bold">
        H
      </Label>
      <Label x={110} y={y2 + L} className="dg-text dg-bold">
        H
      </Label>
      <Electron x={105} y={y2 - 17} mark="cross" />
      <Electron x={115} y={y2 - 17} mark="cross" />

      <Label x={196} y={y2} className="dg-text dg-bold">
        +
      </Label>
      <Label x={hPlus[0]} y={y2} className="dg-text dg-bold">
        H⁺
      </Label>
      <Arrow x1={318} y1={y2} x2={390} y2={y2} />

      <Bracket x1={420} x2={560} y1={y2 - 64} y2={y2 + 64} charge="+" />
      <Label x={490} y={y2} className="dg-text dg-bold">
        N
      </Label>
      <line x1={480} y1={y2} x2={490 - L + 10} y2={y2} className="dg-line" />
      <line x1={500} y1={y2} x2={490 + L - 10} y2={y2} className="dg-line" />
      <line x1={490} y1={y2 + 10} x2={490} y2={y2 + L - 10} className="dg-line" />
      <Arrow x1={490} y1={y2 - 10} x2={490} y2={y2 - L + 9} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={490 - L} y={y2} className="dg-text dg-bold">
        H
      </Label>
      <Label x={490 + L} y={y2} className="dg-text dg-bold">
        H
      </Label>
      <Label x={490} y={y2 + L} className="dg-text dg-bold">
        H
      </Label>
      <Label x={490} y={y2 - L} className="dg-text dg-bold">
        H
      </Label>
      <Label x={W / 2} y={H - 18} className="dg-text-small">
        The arrow is the dative bond: it points from N, which supplies the lone pair, to H⁺, which accepts it.
      </Label>
    </Svg>
  );
}

export default CovalentBondingAmmoniumIon;
