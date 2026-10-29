/**
 * Giant metallic lattice (copper): a 4 × 3 grid of positive copper ion cores (marked Cu⁺,
 * the school model: each Cu atom gives up its one 4s electron) with 12 delocalised
 * electrons scattered in the gaps — one per atom, so the charges balance. Two
 * annotations: electrons drift freely through the lattice, and layers of ions slide over
 * each other while the bonding keeps acting (malleability). Electron positions are
 * arbitrary; the electrons do not belong to any one ion.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-bonding-structure-metallic-lattice';

const W = 640;
const H = 410;

const GAP = 64;
const OX = 130;
const OY = 110;

type Pt = [number, number];

/** Deterministic electron scatter in the gaps of the 4 × 3 ion grid. */
function electronSites(): Pt[] {
  const s: Pt[] = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) s.push([i + 0.5, j]);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) s.push([i, j + 0.5]);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) s.push([i + 0.5, j + 0.5]);
  return s;
}

function pick(n: number): Pt[] {
  const all = electronSites();
  const order = all.map((p, k) => ({ p, key: (k * 7919 + 104729) % 9973 }));
  order.sort((a, b) => a.key - b.key);
  return order.slice(0, n).map(({ p }, k) => {
    const wob = ((k * 37) % 11) - 5;
    const [i, j] = p;
    const horizontalGap = !Number.isInteger(i) && Number.isInteger(j);
    return [i + (horizontalGap ? 0 : wob / GAP), j + (horizontalGap ? wob / GAP : 0)] as Pt;
  });
}

export default function BondingStructureMetallicLattice() {
  const at = ([i, j]: Pt): Pt => [OX + i * GAP, OY + j * GAP];
  const electrons = pick(12); // one per Cu atom: 12 Cu⁺ cores + 12 e⁻

  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={30} className="dg-text dg-bold">
        Giant metallic lattice — copper
      </Label>

      <rect x={OX - 46} y={OY - 42} width={3 * GAP + 92} height={2 * GAP + 92} rx={12} className="dg-thin" />

      {/* ions */}
      {[0, 1, 2].map((j) =>
        [0, 1, 2, 3].map((i) => {
          const [x, y] = at([i, j]);
          return (
            <g key={`ion-${i}-${j}`}>
              <circle cx={x} cy={y} r={18} className="dg-thin dg-fill-accent-2" />
              <Label x={x} y={y} className="dg-text-small dg-bold">
                Cu⁺
              </Label>
            </g>
          );
        }),
      )}

      {/* delocalised electrons */}
      {electrons.map((p, k) => {
        const [x, y] = at(p);
        return <circle key={`e-${k}`} cx={x} cy={y} r={3.4} className="dg-dot-accent" />;
      })}

      {/* electrons drift through the lattice */}
      <Arrow x1={OX - 30} y1={OY - 24} x2={OX + 3 * GAP + 24} y2={OY - 24} head={9} className="dg-thin dg-accent" headClassName="dg-dot-accent" />
      <Label x={OX + 1.5 * GAP} y={OY - 56} className="dg-text-small dg-text-accent">
        delocalised electrons move freely
      </Label>

      {/* sliding layers: a row of ions can shift sideways (below the box) */}
      <Arrow x1={140} y1={OY + 2 * GAP + 68} x2={330} y2={OY + 2 * GAP + 68} head={9} double className="dg-line" headClassName="dg-dot" />
      <Label x={OX + 1.5 * GAP} y={OY + 2 * GAP + 92} className="dg-text-small">
        Layers of ions slide over each other — the metal bends without shattering
      </Label>

      {/* footer */}
      <Label x={W / 2} y={H - 44} className="dg-text-small dg-text-muted">
        Metallic bonding = attraction between the positive ions and the delocalised electrons.
      </Label>
      <Label x={W / 2} y={H - 22} className="dg-text-small">
        Mobile electrons carry charge and heat: copper conducts electricity and heat.
      </Label>
    </Svg>
  );
}
