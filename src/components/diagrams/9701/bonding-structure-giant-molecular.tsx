/**
 * Giant molecular solids: three panels. Left, diamond — a schematic of the 3D covalent
 * network (a central carbon bonded to four others, each continuing outward, so every atom
 * is joined to four). Middle, graphite — two hexagonal sheets of carbon atoms viewed from
 * an angle, dots for delocalised electrons within the sheets, dashed weak forces between
 * the layers and a slide arrow. Right, silicon(IV) oxide — a slice of the network where
 * every Si is bonded to four O and every O bridges two Si atoms. All bonds solid;
 * interlayer forces dashed.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-bonding-structure-giant-molecular';

const W = 640;
const H = 410;

/** Atom with an opaque underlay, so bond lines behind it stay hidden. */
function Atom({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} className="dg-fill-surface" />
      <circle cx={x} cy={y} r={r} className="dg-thin dg-fill-accent" />
    </>
  );
}

export default function BondingStructureGiantMolecular() {
  const y0 = 78;

  // diamond: centre + 4 neighbours + 4 outward continuation atoms (schematic of the network)
  const dCentre: [number, number] = [100, 162];
  const dInner: Array<[number, number]> = [
    [64, 126], [136, 126], [64, 198], [136, 198],
  ];
  const dOuter: Array<[number, number]> = [
    [38, 100], [162, 100], [38, 224], [162, 224],
  ];

  // graphite: two sheets of 9 carbons, drawn as flattened hexagons of atoms
  const gAtoms: Array<[number, number]> = [
    [0, -22], [26, -22], [-26, -22],
    [52, 0], [0, 0], [-52, 0],
    [26, 22], [-26, 22], [0, 22],
  ];
  const gBonds: Array<[number, number]> = [
    [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 6], [4, 6], [4, 7], [5, 7], [6, 8], [7, 8],
  ];
  const sheet = (cx: number, cy: number) =>
    gAtoms.map(([dx, dy]) => [cx + dx, cy + dy] as [number, number]);

  // SiO2: 3x3 silicon lattice with bridging oxygens
  const si: Array<[number, number]> = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) si.push([470 + 42 * c, y0 + 42 + 42 * r]);

  const captionY = (i: number) => 300 + 17 * i;

  return (
    <Svg width={W} height={H}>
      {/* ---------------- diamond ---------------- */}
      <Label x={100} y={28} className="dg-text dg-bold">
        Diamond
      </Label>
      <rect x={16} y={60} width={168} height={210} rx={10} className="dg-thin" />
      {dInner.map(([x, y], k) => (
        <line key={`di-${k}`} x1={dCentre[0]} y1={dCentre[1]} x2={x} y2={y} className="dg-thin" />
      ))}
      {dInner.map(([x, y], k) => (
        <line key={`do-${k}`} x1={x} y1={y} x2={dOuter[k]![0]} y2={dOuter[k]![1]} className="dg-thin" />
      ))}
      {dOuter.map(([x, y], k) => (
        <Atom key={`dc-${k}`} x={x} y={y} r={12} />
      ))}
      {dInner.map(([x, y], k) => (
        <Atom key={`dn-${k}`} x={x} y={y} r={13} />
      ))}
      <Atom x={dCentre[0]} y={dCentre[1]} r={14} />
      <Label x={100} y={248} className="dg-text-small dg-text-muted">
        network continues in 3D
      </Label>
      <Label x={100} y={captionY(0)} className="dg-text-small">
        Each C forms 4 covalent
      </Label>
      <Label x={100} y={captionY(1)} className="dg-text-small">
        bonds in a rigid 3D network.
      </Label>
      <Label x={100} y={captionY(2)} className="dg-text-small">
        Very hard; very high melting
      </Label>
      <Label x={100} y={captionY(3)} className="dg-text-small">
        point; does not conduct.
      </Label>

      {/* ---------------- graphite ---------------- */}
      <Label x={318} y={28} className="dg-text dg-bold">
        Graphite
      </Label>
      <rect x={234} y={60} width={168} height={210} rx={10} className="dg-thin" />
      {[132, 218].map((cy) => {
        const pts = sheet(318, cy);
        return (
          <g key={`sheet-${cy}`}>
            {gBonds.map(([a, b], k) => (
              <line
                key={`b-${cy}-${k}`}
                x1={pts[a]![0]}
                y1={pts[a]![1]}
                x2={pts[b]![0]}
                y2={pts[b]![1]}
                className="dg-thin"
              />
            ))}
            {pts.map(([x, y], k) => (
              <Atom key={`a-${cy}-${k}`} x={x} y={y} r={9} />
            ))}
          </g>
        );
      })}
      {/* delocalised electrons within the sheets */}
      {[132, 218].map((cy) =>
        [-38, -13, 13, 38].map((dx) => (
          <circle key={`e-${cy}-${dx}`} cx={318 + dx} cy={cy} r={3} className="dg-dot" />
        )),
      )}
      {/* weak forces between layers */}
      <line x1={256} y1={157} x2={256} y2={193} className="dg-thin dg-dashed" />
      <line x1={380} y1={157} x2={380} y2={193} className="dg-thin dg-dashed" />
      <Label x={318} y={168} className="dg-text-small dg-text-muted">
        weak forces
      </Label>
      <Label x={318} y={184} className="dg-text-small dg-text-muted">
        between layers
      </Label>
      <Arrow x1={386} y1={136} x2={386} y2={214} className="dg-line" />
      <Label x={318} y={captionY(0)} className="dg-text-small">
        Hexagonal sheets; each C
      </Label>
      <Label x={318} y={captionY(1)} className="dg-text-small">
        forms 3 bonds. Dots show
      </Label>
      <Label x={318} y={captionY(2)} className="dg-text-small">
        delocalised electrons in
      </Label>
      <Label x={318} y={captionY(3)} className="dg-text-small">
        the sheets: conducts.
      </Label>
      <Label x={318} y={captionY(4)} className="dg-text-small">
        Sheets slide: lubricant.
      </Label>

      {/* ---------------- SiO2 ---------------- */}
      <Label x={512} y={28} className="dg-text dg-bold">
        Silicon(IV) oxide, SiO₂
      </Label>
      <rect x={430} y={60} width={170} height={210} rx={10} className="dg-thin" />
      {/* bonds: Si–Si links drawn through the bridging O atoms */}
      {si.map(([x, y]) => (
        <g key={`si-${x}-${y}`}>
          <line x1={x} y1={y} x2={x + 42} y2={y} className="dg-thin" />
          <line x1={x} y1={y} x2={x} y2={y + 42} className="dg-thin" />
        </g>
      ))}
      {/* bridging O atoms at midpoints of every link */}
      {si.map(([x, y]) => (
        <g key={`ox-${x}-${y}`}>
          <Atom x={x + 21} y={y} r={7} />
          <Atom x={x} y={y + 21} r={7} />
        </g>
      ))}
      {si.map(([x, y]) => (
        <Atom key={`si2-${x}-${y}`} x={x} y={y} r={13} />
      ))}
      <Label x={515} y={68} className="dg-text-small dg-text-muted">
        (slice of the network)
      </Label>
      <Label x={515} y={86} className="dg-text-small dg-text-muted">
        big spheres: Si · small: O
      </Label>
      <Label x={512} y={captionY(0)} className="dg-text-small">
        Each Si bonds to 4 O; each
      </Label>
      <Label x={512} y={captionY(1)} className="dg-text-small">
        O bridges 2 Si. Giant
      </Label>
      <Label x={512} y={captionY(2)} className="dg-text-small">
        covalent network — no SiO₂
      </Label>
      <Label x={512} y={captionY(3)} className="dg-text-small">
        molecules; very high
      </Label>
      <Label x={512} y={captionY(4)} className="dg-text-small">
        melting point (≈1700 °C).
      </Label>

      {/* footer */}
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-bold">
        Giant molecular solids: strong covalent bonds throughout the structure.
      </Label>
    </Svg>
  );
}
