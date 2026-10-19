/**
 * Electrons-in-boxes notation for N, O, Fe, Cr and Cu (ground states).
 * Each box is one orbital; an arrow is one electron, up and down arrows are
 * opposite spins. Within a sub-shell, electrons go in singly (parallel spins)
 * before pairing. Cr ([Ar] 3d⁵ 4s¹) and Cu ([Ar] 3d¹⁰ 4s¹) are the two
 * exceptions to simple filling in H–Kr and are highlighted.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-electrons-in-boxes';

const W = 640;
const H = 350;
const BOX = 28;

/** Orbital occupancy: 0 empty, 1 one electron (up), 2 spin pair. */
type Occ = 0 | 1 | 2;
interface Group {
  label: string;
  x: number;
  occ: Occ[];
}
interface Row {
  symbol: string;
  z: number;
  core?: string;
  groups: Group[];
  config: string;
  unpaired: number;
  exception?: boolean;
}

const ROWS: Row[] = [
  {
    symbol: 'N',
    z: 7,
    groups: [
      { label: '1s', x: 110, occ: [2] },
      { label: '2s', x: 166, occ: [2] },
      { label: '2p', x: 222, occ: [1, 1, 1] },
    ],
    config: '1s² 2s² 2p³',
    unpaired: 3,
  },
  {
    symbol: 'O',
    z: 8,
    groups: [
      { label: '1s', x: 110, occ: [2] },
      { label: '2s', x: 166, occ: [2] },
      { label: '2p', x: 222, occ: [2, 1, 1] },
    ],
    config: '1s² 2s² 2p⁴',
    unpaired: 2,
  },
  {
    symbol: 'Fe',
    z: 26,
    core: '[Ar]',
    groups: [
      { label: '3d', x: 166, occ: [2, 1, 1, 1, 1] },
      { label: '4s', x: 322, occ: [2] },
    ],
    config: '[Ar] 3d⁶ 4s²',
    unpaired: 4,
  },
  {
    symbol: 'Cr',
    z: 24,
    core: '[Ar]',
    groups: [
      { label: '3d', x: 166, occ: [1, 1, 1, 1, 1] },
      { label: '4s', x: 322, occ: [1] },
    ],
    config: '[Ar] 3d⁵ 4s¹',
    unpaired: 6,
    exception: true,
  },
  {
    symbol: 'Cu',
    z: 29,
    core: '[Ar]',
    groups: [
      { label: '3d', x: 166, occ: [2, 2, 2, 2, 2] },
      { label: '4s', x: 322, occ: [1] },
    ],
    config: '[Ar] 3d¹⁰ 4s¹',
    unpaired: 1,
    exception: true,
  },
];

function Electron({ x, y, up }: { x: number; y: number; up: boolean }) {
  const half = 9;
  return up ? (
    <Arrow x1={x} y1={y + half} x2={x} y2={y - half} head={6} className="dg-thin" />
  ) : (
    <Arrow x1={x} y1={y - half} x2={x} y2={y + half} head={6} className="dg-thin" />
  );
}

function Orbital({ x, y, occ }: { x: number; y: number; occ: Occ }) {
  const cy = y + BOX / 2;
  return (
    <g>
      <rect x={x} y={y} width={BOX} height={BOX} className="dg-thin dg-fill-surface" />
      {occ === 1 && <Electron x={x + BOX / 2} y={cy} up />}
      {occ === 2 && (
        <>
          <Electron x={x + BOX / 2 - 5} y={cy} up />
          <Electron x={x + BOX / 2 + 5} y={cy} up={false} />
        </>
      )}
    </g>
  );
}

export function ElectronsInBoxes() {
  const top = 62;
  const step = 58;
  return (
    <Svg width={W} height={H}>
      {/* headers */}
      <Label x={20} y={18} anchor="start" className="dg-text-muted">
        atom
      </Label>
      <Label x={244} y={18} className="dg-text-muted">
        orbitals (one box each)
      </Label>
      <Label x={400} y={18} anchor="start" className="dg-text-muted">
        configuration
      </Label>
      <Label x={W - 16} y={18} anchor="end" className="dg-text-muted">
        unpaired e⁻
      </Label>
      <line x1={16} y1={32} x2={W - 16} y2={32} className="dg-grid" />

      {ROWS.map((row, r) => {
        const y = top + r * step;
        const cy = y + BOX / 2;
        return (
          <g key={row.symbol}>
            {row.exception && (
              <rect x={12} y={y - 18} width={W - 24} height={BOX + 26} rx={8} className="dg-fill-accent-2" />
            )}
            <Label x={20} y={cy - 7} anchor="start" className="dg-text dg-bold">
              {row.symbol}
            </Label>
            <Label x={20} y={cy + 10} anchor="start" className="dg-text-small">
              {`Z = ${row.z}`}
            </Label>
            {row.core && (
              <Label x={130} y={cy} className="dg-text dg-bold">
                {row.core}
              </Label>
            )}
            {row.groups.map((g) => (
              <g key={g.label}>
                <Label x={g.x + (g.occ.length * BOX) / 2} y={y - 9} className="dg-text-small">
                  {g.label}
                </Label>
                {g.occ.map((o, i) => (
                  <Orbital key={i} x={g.x + i * BOX} y={y} occ={o} />
                ))}
              </g>
            ))}
            <Label x={400} y={cy - (row.exception ? 7 : 0)} anchor="start" className="dg-text dg-mono">
              {row.config}
            </Label>
            {row.exception && (
              <Label x={400} y={cy + 11} anchor="start" className="dg-text-small dg-bold">
                exception
              </Label>
            )}
            <Label x={W - 40} y={cy} className="dg-text dg-bold">
              {String(row.unpaired)}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}

export default ElectronsInBoxes;
