/**
 * Hybridisation of carbon in electrons-in-boxes form. Top: ground state 2s² 2p², then one
 * 2s electron promoted to give 2s¹ 2p³ (four unpaired electrons). Below: three ways to mix
 * the orbitals. sp³: 2s + three 2p → four sp³ orbitals (109.5°, four σ bonds, e.g. CH₄).
 * sp²: 2s + two 2p → three sp² orbitals (120°) and one unhybridised p orbital (for a π
 * bond, e.g. C₂H₄). sp: 2s + one 2p → two sp orbitals (180°) and two unhybridised p
 * orbitals (two π bonds, e.g. HCN). Hybrid boxes sit lower than p boxes (lower energy).
 */
import { Arrow, Label, Svg } from '../primitives';
import { Boxes } from './covalent-bonding-kit';

export const diagramKey = 'chem-covalent-bonding-hybridisation';

const W = 640;
const H = 430;
const B = 26;

interface Col {
  cx: number;
  name: string;
  hybrids: number;
  p: number;
  lines: string[];
}

const COLS: Col[] = [
  { cx: 110, name: 'sp³', hybrids: 4, p: 0, lines: ['mix 2s + three 2p', '4 sp³ orbitals, 109.5° apart', '4 σ bonds', 'e.g. CH₄, C₂H₆'] },
  { cx: 320, name: 'sp²', hybrids: 3, p: 1, lines: ['mix 2s + two 2p', '3 sp² orbitals, 120° apart', '+ 1 p left over → 1 π bond', 'e.g. C₂H₄'] },
  { cx: 530, name: 'sp', hybrids: 2, p: 2, lines: ['mix 2s + one 2p', '2 sp orbitals, 180° apart', '+ 2 p left over → 2 π bonds', 'e.g. HCN, C₂H₂'] },
];

export function CovalentBondingHybridisation() {
  const yS = 92;
  const yP = 62;
  const yHyb = 240;
  const yPl = 200;
  return (
    <Svg width={W} height={H}>
      {/* ground state */}
      <Label x={130} y={18} className="dg-text dg-bold">
        carbon: ground state
      </Label>
      <Label x={58} y={yS - 10} className="dg-text-small">
        2s
      </Label>
      <Boxes x={45} y={yS} occ={[2]} box={B} />
      <Label x={137} y={yP - 10} className="dg-text-small">
        2p
      </Label>
      <Boxes x={98} y={yP} occ={[1, 1, 0]} box={B} />

      <Arrow x1={200} y1={84} x2={300} y2={84} />
      <Label x={250} y={68} className="dg-text-small">
        promote one
      </Label>
      <Label x={250} y={102} className="dg-text-small">
        2s electron
      </Label>

      {/* promoted */}
      <Label x={430} y={18} className="dg-text dg-bold">
        promoted: 4 unpaired electrons
      </Label>
      <Label x={358} y={yS - 10} className="dg-text-small">
        2s
      </Label>
      <Boxes x={345} y={yS} occ={[1]} box={B} />
      <Label x={437} y={yP - 10} className="dg-text-small">
        2p
      </Label>
      <Boxes x={398} y={yP} occ={[1, 1, 1]} box={B} />
      <Label x={W - 24} y={yP + 13} anchor="end" className="dg-text-muted">
        higher energy
      </Label>
      <Label x={W - 24} y={yS + 13} anchor="end" className="dg-text-muted">
        lower energy
      </Label>

      <line x1={24} y1={140} x2={W - 24} y2={140} className="dg-grid" />
      <Label x={W / 2} y={160} className="dg-text-small">
        then mix (hybridise) some or all of these four orbitals:
      </Label>

      {COLS.map((c) => {
        const hybW = c.hybrids * B;
        const pW = c.p * B;
        const total = hybW + (c.p ? pW + 14 : 0);
        const x0 = c.cx - total / 2;
        return (
          <g key={c.name}>
            <Label x={c.cx} y={186} className="dg-text-accent">
              {c.name}
            </Label>
            <Boxes x={x0} y={yHyb} occ={Array(c.hybrids).fill(1)} box={B} className="dg-accent dg-fill-accent" />
            <Label x={x0 + hybW / 2} y={yHyb + B + 13} className="dg-text-small">
              {c.name}
            </Label>
            {c.p > 0 && (
              <>
                <Boxes x={x0 + hybW + 14} y={yPl} occ={Array(c.p).fill(1)} box={B} />
                <Label x={x0 + hybW + 14 + pW / 2} y={yPl - 10} className="dg-text-small">
                  2p
                </Label>
              </>
            )}
            {c.lines.map((l, i) => (
              <Label key={i} x={c.cx} y={312 + i * 19} className={i === 3 ? 'dg-text-small dg-bold' : 'dg-text-small'}>
                {l}
              </Label>
            ))}
          </g>
        );
      })}
      <line x1={215} y1={176} x2={215} y2={400} className="dg-grid" />
      <line x1={425} y1={176} x2={425} y2={400} className="dg-grid" />
    </Svg>
  );
}

export default CovalentBondingHybridisation;
