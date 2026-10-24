/**
 * Metallic bonding in sodium and magnesium. Each panel is a 4 × 3 slice of a lattice of
 * positive ions in a "sea" of delocalised electrons. Sodium: 12 Na⁺ ions and 12 delocalised
 * electrons (one per atom). Magnesium: 12 Mg²⁺ ions and 24 delocalised electrons (two per
 * atom). Charges balance in both. Ion circles are roughly in proportion to the ionic radii
 * (Na⁺ 0.102 nm, Mg²⁺ 0.072 nm). Electron positions are arbitrary: the electrons are free to
 * move through the whole lattice.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-metallic-bonding-sea-of-electrons';

const W = 640;
const H = 380;
const GAP = 62;
const ROWS = [96, 158, 220];

type Pt = [number, number];

/** Candidate electron sites in the gaps of the 4 × 3 grid, in grid units (ion at integer points). */
function sites(): Pt[] {
  const s: Pt[] = [];
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) s.push([i + 0.5, j]);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 4; i++) s.push([i, j + 0.5]);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) s.push([i + 0.5, j + 0.5]);
  for (let j = 0; j < 3; j++) s.push([-0.5, j], [3.5, j]);
  for (let i = 0; i < 4; i++) s.push([i, -0.5], [i, 2.5]);
  return s;
}

/** A fixed, scattered-looking choice of n sites (deterministic, so renders are stable). */
function pick(n: number, seed: number): Pt[] {
  const all = sites();
  const order = all.map((p, k) => ({ p, key: (k * 7919 + seed * 104729) % 9973 }));
  order.sort((a, b) => a.key - b.key);
  return order.slice(0, n).map(({ p }, k) => {
    const wob = ((k * 37 + seed) % 11) - 5;
    const [i, j] = p;
    // nudge across the gap only, so an electron never sits on an ion
    const horizontalGap = !Number.isInteger(i) && Number.isInteger(j);
    const verticalGap = Number.isInteger(i) && !Number.isInteger(j);
    return [i + (verticalGap ? wob / GAP : 0), j + (horizontalGap ? wob / GAP : 0)];
  });
}

function Panel({
  x0,
  title,
  charge,
  r,
  electrons,
  seed,
  lines,
}: {
  x0: number;
  title: string;
  charge: string;
  r: number;
  electrons: number;
  seed: number;
  lines: string[];
}) {
  const ox = x0 + 52;
  const at = ([i, j]: Pt): Pt => [ox + i * GAP, ROWS[0]! + j * GAP];
  return (
    <g>
      <Label x={x0 + 145} y={28} className="dg-text dg-bold">
        {title}
      </Label>
      <rect x={x0} y={50} width={290} height={216} rx={12} className="dg-thin" />
      {ROWS.map((y) =>
        [0, 1, 2, 3].map((i) => (
          <g key={`${i}-${y}`}>
            <circle cx={ox + i * GAP} cy={y} r={r} className="dg-thin dg-fill-accent-2" />
            <Label x={ox + i * GAP} y={y} className="dg-text-small dg-bold">
              {charge}
            </Label>
          </g>
        )),
      )}
      {pick(electrons, seed).map((p, k) => {
        const [x, y] = at(p);
        return <circle key={k} cx={x} cy={y} r={3.6} className="dg-dot-accent" />;
      })}
      {lines.map((l, i) => (
        <Label key={i} x={x0 + 145} y={288 + i * 18} className={i === 2 ? 'dg-text-small dg-bold' : 'dg-text-small'}>
          {l}
        </Label>
      ))}
    </g>
  );
}

export function MetallicBondingSeaOfElectrons() {
  return (
    <Svg width={W} height={H}>
      <Panel
        x0={20}
        title="sodium"
        charge="+"
        r={21}
        electrons={12}
        seed={3}
        lines={['12 Na⁺ ions, 12 delocalised electrons', '(1 per atom)', 'weaker metallic bonding']}
      />
      <Panel
        x0={330}
        title="magnesium"
        charge="2+"
        r={15}
        electrons={24}
        seed={5}
        lines={['12 Mg²⁺ ions, 24 delocalised electrons', '(2 per atom, smaller ions)', 'stronger metallic bonding']}
      />
      <circle cx={196} cy={H - 14} r={3.6} className="dg-dot-accent" />
      <Label x={206} y={H - 14} anchor="start" className="dg-text-small">
        delocalised electron (free to move through the whole lattice)
      </Label>
    </Svg>
  );
}

export default MetallicBondingSeaOfElectrons;
