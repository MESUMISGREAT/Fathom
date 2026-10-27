/**
 * Simple molecular solids: three panels. Left, solid iodine — I₂ molecules drawn as pairs
 * of touching spheres, with dashed weak van der Waals' forces between separate molecules
 * and a note that the covalent bond within each molecule is strong. Middle,
 * buckminsterfullerene — two C₆₀ balls drawn as circles with a hexagonal cage pattern and
 * spokes to the rim, joined by a dashed force. Right, ice — H₂O molecules at the corners of
 * an open hexagonal ring joined by dashed hydrogen bonds, leaving a gap in the middle (why
 * ice is less dense than water). All intermolecular forces are dashed; intramolecular
 * bonds are solid.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-bonding-structure-simple-molecular';

const W = 640;
const H = 400;

/** Atom with an opaque underlay, so bond lines behind it stay hidden. */
function Atom({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <>
      <circle cx={x} cy={y} r={r} className="dg-fill-surface" />
      <circle cx={x} cy={y} r={r} className="dg-thin dg-fill-accent" />
    </>
  );
}

/** One I₂ molecule: two touching spheres along an angle, with the covalent bond between. */
function I2({ x, y, rot }: { x: number; y: number; rot: number }) {
  const a = (rot * Math.PI) / 180;
  const dx = 11 * Math.cos(a);
  const dy = 11 * Math.sin(a);
  return (
    <g>
      <line x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} className="dg-line" />
      <Atom x={x - dx} y={y - dy} r={10} />
      <Atom x={x + dx} y={y + dy} r={10} />
    </g>
  );
}

/** One C₆₀ ball: circle with a hexagonal cage hint and spokes to the rim. */
function C60({ x, y }: { x: number; y: number }) {
  const verts = Array.from({ length: 6 }, (_, m) => {
    const a = (m * Math.PI) / 3 - Math.PI / 2;
    return [x + 22 * Math.cos(a), y + 22 * Math.sin(a)] as const;
  });
  return (
    <g>
      <circle cx={x} cy={y} r={40} className="dg-thin dg-fill-accent" />
      <polygon points={verts.map(([vx, vy]) => `${vx},${vy}`).join(' ')} className="dg-thin" />
      {verts.map(([vx, vy], m) => (
        <line
          key={m}
          x1={vx}
          y1={vy}
          x2={x + 37 * Math.cos((m * Math.PI) / 3 - Math.PI / 2)}
          y2={y + 37 * Math.sin((m * Math.PI) / 3 - Math.PI / 2)}
          className="dg-thin"
        />
      ))}
    </g>
  );
}

export default function BondingStructureSimpleMolecular() {
  const panelY = 46;
  const panelH = 236;

  // iodine: two rows of three I2 molecules
  const iodine: Array<[number, number, number]> = [
    [52, 96, 20], [122, 92, -15], [192, 100, 30],
    [58, 168, -25], [128, 172, 10], [198, 166, -35],
  ];

  // ice: hexagonal ring of 6 water molecules
  const hx = 522;
  const hy = 150;
  const ring = 58;
  const ice: Array<[number, number]> = Array.from({ length: 6 }, (_, k) => {
    const a = (k * Math.PI) / 3 - Math.PI / 2;
    return [hx + ring * Math.cos(a), hy + ring * Math.sin(a)];
  });

  return (
    <Svg width={W} height={H}>
      {/* ---------- iodine ---------- */}
      <Label x={125} y={24} className="dg-text dg-bold">
        Solid iodine, I₂
      </Label>
      <rect x={20} y={panelY} width={210} height={panelH} rx={10} className="dg-thin" />
      {/* dashed intermolecular forces between nearby molecules */}
      <line x1={72} y1={110} x2={110} y2={130} className="dg-thin dg-dashed" />
      <line x1={140} y1={110} x2={172} y2={132} className="dg-thin dg-dashed" />
      <line x1={76} y1={152} x2={112} y2={140} className="dg-thin dg-dashed" />
      <line x1={150} y1={152} x2={180} y2={140} className="dg-thin dg-dashed" />
      <line x1={88} y1={182} x2={110} y2={162} className="dg-thin dg-dashed" />
      <line x1={160} y1={182} x2={180} y2={166} className="dg-thin dg-dashed" />
      {iodine.map(([x, y, r], k) => (
        <I2 key={k} x={x} y={y} rot={r} />
      ))}
      <Label x={125} y={panelY + panelH + 20} className="dg-text-small">
        Strong covalent bonds (solid)
      </Label>
      <Label x={125} y={panelY + panelH + 38} className="dg-text-small">
        inside each molecule; weak
      </Label>
      <Label x={125} y={panelY + panelH + 56} className="dg-text-small">
        van der Waals&apos; forces
      </Label>
      <Label x={125} y={panelY + panelH + 74} className="dg-text-small">
        (dashed) between molecules.
      </Label>

      {/* ---------- C60 ---------- */}
      <Label x={330} y={24} className="dg-text dg-bold">
        Buckminsterfullerene, C₆₀
      </Label>
      <rect x={230} y={panelY} width={200} height={panelH} rx={10} className="dg-thin" />
      <C60 x={292} y={124} />
      <C60 x={372} y={198} />
      <line x1={320} y1={152} x2={352} y2={172} className="dg-thin dg-dashed" />
      <Label x={330} y={panelY + panelH + 20} className="dg-text-small">
        Each ball is one C₆₀ molecule
      </Label>
      <Label x={330} y={panelY + panelH + 38} className="dg-text-small">
        (60 carbon atoms); weak
      </Label>
      <Label x={330} y={panelY + panelH + 56} className="dg-text-small">
        van der Waals&apos; forces
      </Label>
      <Label x={330} y={panelY + panelH + 74} className="dg-text-small">
        (dashed) between the balls.
      </Label>

      {/* ---------- ice ---------- */}
      <Label x={525} y={24} className="dg-text dg-bold">
        Ice
      </Label>
      <rect x={430} y={panelY} width={195} height={panelH} rx={10} className="dg-thin" />
      {/* hydrogen bonds around the ring */}
      {ice.map(([x, y], k) => {
        const [nx, ny] = ice[(k + 1) % ice.length]!;
        return (
          <line key={`hb-${k}`} x1={x} y1={y} x2={nx} y2={ny} className="dg-thin dg-dashed" />
        );
      })}
      {ice.map(([x, y], k) => (
        <g key={`w-${k}`}>
          <Atom x={x} y={y} r={13} />
          <Label x={x} y={y} className="dg-text-small">
            H₂O
          </Label>
        </g>
      ))}
      <Label x={hx} y={hy} className="dg-text-small dg-text-muted">
        gap
      </Label>
      <Label x={525} y={panelY + panelH + 20} className="dg-text-small">
        Hydrogen bonds (dashed) hold
      </Label>
      <Label x={525} y={panelY + panelH + 38} className="dg-text-small">
        an open lattice with gaps:
      </Label>
      <Label x={525} y={panelY + panelH + 56} className="dg-text-small">
        the gaps make ice less dense
      </Label>
      <Label x={525} y={panelY + panelH + 74} className="dg-text-small">
        than water, so ice floats.
      </Label>

      {/* footer */}
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-bold">
        Strong bonds within molecules · weak forces between molecules
      </Label>
    </Svg>
  );
}
