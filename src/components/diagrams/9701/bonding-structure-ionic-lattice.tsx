/**
 * Giant ionic lattices: sodium chloride and magnesium oxide. Left panel: a slice of the
 * NaCl lattice, alternating Na⁺ (small) and Cl⁻ (large) ions in a 5 × 4 grid; one central
 * Na⁺ is ringed with six arrows pointing to its six oppositely charged neighbours in the
 * slice (4 in the plane + 1 above + 1 below, noted in the caption). Right panel: the MgO
 * lattice in the same pattern with Mg²⁺ and O²⁻ ions, whose double charges give stronger
 * attraction. Ion radii roughly in proportion (Na⁺ 95 pm, Cl⁻ 181 pm, Mg²⁺ 72 pm,
 * O²⁻ 140 pm); gaps are stretched for clarity.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-bonding-structure-ionic-lattice';

const W = 640;
const H = 420;

function Ion({ x, y, r, charge, tone }: { x: number; y: number; r: number; charge: string; tone: 'pos' | 'neg' }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        className={tone === 'pos' ? 'dg-thin dg-fill-accent-2' : 'dg-thin dg-fill-muted'}
      />
      <Label x={x} y={y} className="dg-text-small dg-bold">
        {charge}
      </Label>
    </g>
  );
}

export default function BondingStructureIonicLattice() {
  const gap = 52;
  // Left panel: NaCl, 5 columns × 4 rows, alternating ions.
  const lx = 78;
  const ly = 92;
  const nacl: Array<{ x: number; y: number; pos: boolean }> = [];
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 5; i++) {
      nacl.push({ x: lx + i * gap, y: ly + j * gap, pos: (i + j) % 2 === 0 });
    }
  }
  const centre = nacl.find((p) => p.pos && p.x === lx + 2 * gap && p.y === ly + 2 * gap)!;
  const neighbours = [
    { x: centre.x - gap, y: centre.y },
    { x: centre.x + gap, y: centre.y },
    { x: centre.x, y: centre.y - gap },
    { x: centre.x, y: centre.y + gap },
  ];

  // Right panel: MgO, 4 × 4, alternating Mg²⁺ / O²⁻.
  const rx = 428;
  const ry = 92;
  const mgo: Array<{ x: number; y: number; pos: boolean }> = [];
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      mgo.push({ x: rx + i * gap, y: ry + j * gap, pos: (i + j) % 2 === 0 });
    }
  }

  return (
    <Svg width={W} height={H}>
      {/* ---- NaCl panel ---- */}
      <Label x={lx + 2 * gap} y={40} className="dg-text dg-bold">
        Sodium chloride, NaCl
      </Label>
      <rect x={lx - 34} y={ly - 34} width={4 * gap + 68} height={3 * gap + 68} rx={10} className="dg-thin" />
      {nacl.map((p, k) => (
        <Ion key={k} x={p.x} y={p.y} r={p.pos ? 13 : 20} charge={p.pos ? '+' : '−'} tone={p.pos ? 'pos' : 'neg'} />
      ))}
      {/* ring the central Na⁺ and point at its four in-plane neighbours */}
      <circle cx={centre.x} cy={centre.y} r={19} className="dg-accent dg-dashed" />
      {neighbours.map((n, k) => (
        <Arrow
          key={k}
          x1={centre.x}
          y1={centre.y}
          x2={n.x}
          y2={n.y}
          head={8}
          className="dg-thin dg-accent"
          headClassName="dg-dot-accent"
        />
      ))}
      <Label x={lx + 2 * gap} y={ly + 3 * gap + 58} className="dg-text-small dg-text-muted">
        Each Na⁺ is attracted to 6 Cl⁻
      </Label>
      <Label x={lx + 2 * gap} y={ly + 3 * gap + 80} className="dg-text-small dg-text-muted">
        (4 in this slice, 1 above, 1 below)
      </Label>

      {/* ---- MgO panel ---- */}
      <Label x={rx + 1.5 * gap} y={40} className="dg-text dg-bold">
        Magnesium oxide, MgO
      </Label>
      <rect x={rx - 34} y={ry - 34} width={3 * gap + 68} height={3 * gap + 68} rx={10} className="dg-thin" />
      {mgo.map((p, k) => (
        <Ion key={k} x={p.x} y={p.y} r={p.pos ? 12 : 17} charge={p.pos ? '2+' : '2−'} tone={p.pos ? 'pos' : 'neg'} />
      ))}
      <Label x={rx + 1.5 * gap} y={ry + 3 * gap + 58} className="dg-text-small dg-text-muted">
        Ions carry double the charge
      </Label>
      <MathLabel
        x={rx + 1.5 * gap}
        y={ry + 3 * gap + 82}
        tex="\text{stronger attraction}"
        w={190}
        h={26}
        tone="accent"
        size="small"
      />
      <MathLabel
        x={rx + 1.5 * gap}
        y={ry + 3 * gap + 108}
        tex="\Rightarrow \text{higher melting point}"
        w={200}
        h={26}
        tone="accent"
        size="small"
      />

      {/* footer */}
      <Label x={W / 2} y={H - 34} className="dg-text-small">
        Small circles: positive ions. Large circles: negative ions. No molecules — the formula gives the ion ratio.
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text-small dg-text-muted">
        (Melting points: NaCl 801 °C, MgO about 2800 °C)
      </Label>
    </Svg>
  );
}
