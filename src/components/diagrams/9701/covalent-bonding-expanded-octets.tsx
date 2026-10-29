/**
 * Expanded octets in Period 3: SO₂ (two S=O double bonds and one lone pair on S, so 10
 * electrons around S), PCl₅ (five P–Cl bonds, 10 electrons around P) and SF₆ (six S–F
 * bonds, 12 electrons around S). Only the electrons around the central atom are drawn; a
 * dashed ring encloses them so they can be counted. Below: the traditional shell-capacity
 * model used to introduce why Period 2 atoms stop at 8 and Period 3 examples can go beyond 8.
 */
import { Label, Svg } from '../primitives';
import { Electron, LonePair, type Mark, PairGroup, polar } from './covalent-bonding-kit';

export const diagramKey = 'chem-covalent-bonding-expanded-octets';

const W = 640;
const H = 420;
const CY = 150;
const RING = 54;
const PAIR_AT = 36;
const LIGAND_AT = 80;

interface Panel {
  cx: number;
  centre: string;
  name: string;
  ligands: Array<{ symbol: string; angle: number; double?: boolean }>;
  lone?: number[];
  sum: string;
  total: string;
}

const PANELS: Panel[] = [
  {
    cx: 110,
    centre: 'S',
    name: 'SO₂',
    ligands: [
      { symbol: 'O', angle: 150, double: true },
      { symbol: 'O', angle: 30, double: true },
    ],
    lone: [270],
    sum: '4 shared pairs + 1 lone pair',
    total: '10 electrons around S',
  },
  {
    cx: 320,
    centre: 'P',
    name: 'PCl₅',
    ligands: [270, 342, 54, 126, 198].map((angle) => ({ symbol: 'Cl', angle })),
    sum: '5 shared pairs',
    total: '10 electrons around P',
  },
  {
    cx: 530,
    centre: 'S',
    name: 'SF₆',
    ligands: [270, 330, 30, 90, 150, 210].map((angle) => ({ symbol: 'F', angle })),
    sum: '6 shared pairs',
    total: '12 electrons around S',
  },
];

export function CovalentBondingExpandedOctets() {
  return (
    <Svg width={W} height={H}>
      {/* key */}
      <Electron x={112} y={20} mark="cross" />
      <Label x={124} y={20} anchor="start" className="dg-text-small">
        electron from the central atom
      </Label>
      <Electron x={340} y={20} mark="dot" />
      <Label x={352} y={20} anchor="start" className="dg-text-small">
        electron from the outer atom
      </Label>

      {PANELS.map((p) => (
        <g key={p.name}>
          <circle cx={p.cx} cy={CY} r={RING} className="dg-accent-2 dg-dashed dg-fill-accent-2" />
          <Label x={p.cx} y={CY} className="dg-text dg-bold">
            {p.centre}
          </Label>
          {p.ligands.map((l) => {
            const [lx, ly] = polar(p.cx, CY, LIGAND_AT, l.angle);
            const [px, py] = polar(p.cx, CY, PAIR_AT, l.angle);
            const marks: Mark[] = l.double ? ['cross', 'dot', 'cross', 'dot'] : ['cross', 'dot'];
            return (
              <g key={l.angle}>
                <Label x={lx} y={ly} className="dg-text dg-bold">
                  {l.symbol}
                </Label>
                <PairGroup x={px} y={py} angle={l.angle} marks={marks} />
              </g>
            );
          })}
          {(p.lone ?? []).map((a) => (
            <LonePair key={a} cx={p.cx} cy={CY} r={PAIR_AT} angle={a} marks={['cross', 'cross']} spread={9} />
          ))}
          <Label x={p.cx} y={252} className="dg-text dg-bold">
            {p.name}
          </Label>
          <Label x={p.cx} y={271} className="dg-text-small">
            {p.sum}
          </Label>
          <Label x={p.cx} y={288} className="dg-text-accent-2">
            {`= ${p.total}`}
          </Label>
        </g>
      ))}

      {/* why Period 3 can, and Period 2 can't */}
      <rect x={24} y={318} width={288} height={84} rx={10} className="dg-thin dg-fill-muted" />
      <Label x={40} y={338} anchor="start" className="dg-text dg-bold">
        Period 2 (N, O, F): outer shell n = 2
      </Label>
      <Label x={40} y={360} anchor="start" className="dg-text-small">
        only 2s and 2p orbitals (4 orbitals)
      </Label>
      <Label x={40} y={380} anchor="start" className="dg-text-small">
        at most 8 electrons: NCl₃ exists, NCl₅ does not
      </Label>
      <rect x={328} y={318} width={288} height={84} rx={10} className="dg-thin dg-fill-accent-2" />
      <Label x={344} y={338} anchor="start" className="dg-text dg-bold">
        Period 3 (P, S, Cl): outer shell n = 3
      </Label>
      <Label x={344} y={360} anchor="start" className="dg-text-small">
        traditional shell model includes empty 3d orbitals
      </Label>
      <Label x={344} y={380} anchor="start" className="dg-text-small">
        used to explain expanded-octet examples
      </Label>
    </Svg>
  );
}

export default CovalentBondingExpandedOctets;
