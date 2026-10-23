/**
 * Why there are two terms. Left: water is made of separate (discrete)
 * molecules, so we can find the mass of one molecule: relative molecular
 * mass, Mr(H₂O) = 2(1.0) + 16.0 = 18.0. Right: sodium chloride is a giant
 * ionic lattice (a 2D slice is drawn, Cl⁻ drawn larger than Na⁺ in the real
 * ratio of ionic radii, about 1.8 : 1), so there is no molecule; we use the
 * formula unit NaCl instead: relative formula mass = 23.0 + 35.5 = 58.5.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-relative-masses-molecule-vs-lattice';

const W = 640;
const H = 340;
const HALF_ANGLE = (104.5 / 2) * (Math.PI / 180);

function Water({ x, y, tilt = 0 }: { x: number; y: number; tilt?: number }) {
  const d = 21;
  const t = (tilt * Math.PI) / 180;
  const h1 = { x: x + d * Math.sin(t - HALF_ANGLE), y: y + d * Math.cos(t - HALF_ANGLE) };
  const h2 = { x: x + d * Math.sin(t + HALF_ANGLE), y: y + d * Math.cos(t + HALF_ANGLE) };
  return (
    <g>
      {[h1, h2].map((h, i) => (
        <g key={i}>
          <circle cx={h.x} cy={h.y} r={9} className="dg-fill-surface dg-thin" />
          <Label x={h.x} y={h.y + 1} className="dg-text-small">
            H
          </Label>
        </g>
      ))}
      <circle cx={x} cy={y} r={16} className="dg-fill-accent dg-thin" />
      <Label x={x} y={y + 1} className="dg-text-small dg-bold">
        O
      </Label>
    </g>
  );
}

export function RelativeMassesMoleculeVsLattice() {
  const gx = 372;
  const gy = 72;
  const gap = 38;
  const cols = 6;
  const rows = 4;
  return (
    <Svg width={W} height={H}>
      <line x1={320} y1={16} x2={320} y2={H - 16} className="dg-grid" />

      {/* left: discrete molecules */}
      <Label x={160} y={22} className="dg-text dg-bold">
        separate molecules: water
      </Label>
      <Water x={80} y={80} tilt={10} />
      <Water x={205} y={92} tilt={-25} />
      <Water x={100} y={180} tilt={160} />
      <Water x={225} y={190} tilt={40} />
      <ellipse cx={205} cy={98} rx={40} ry={34} className="dg-accent-2 dg-dashed" />
      <Label x={256} y={56} anchor="start" className="dg-text-small dg-bold">
        one
      </Label>
      <Label x={256} y={70} anchor="start" className="dg-text-small dg-bold">
        molecule
      </Label>
      <Label x={160} y={262} className="dg-text">
        use one molecule, H₂O
      </Label>
      <Label x={160} y={286} className="dg-text-accent">
        relative molecular mass, Mᵣ
      </Label>
      <Label x={160} y={310} className="dg-text-small">
        2(1.0) + 16.0 = 18.0
      </Label>

      {/* right: giant ionic lattice */}
      <Label x={480} y={22} className="dg-text dg-bold">
        giant lattice: sodium chloride
      </Label>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const cx = gx + c * gap;
          const cy = gy + r * gap;
          const na = (r + c) % 2 === 0;
          return (
            <g key={`${r}-${c}`}>
              <circle cx={cx} cy={cy} r={na ? 9 : 16} className={na ? 'dg-fill-accent dg-thin' : 'dg-fill-accent-2 dg-thin'} />
              <Label x={cx} y={cy + 1} className="dg-text-small dg-bold">
                {na ? '+' : '−'}
              </Label>
            </g>
          );
        }),
      )}
      {/* one formula unit: Na⁺ at (row 1, col 1) and Cl⁻ at (row 1, col 2) */}
      <rect x={gx + gap - 15} y={gy + gap - 21} width={gap + 36} height={42} rx={10} className="dg-accent-2 dg-dashed" />
      <Label x={480} y={gy + rows * gap + 2} className="dg-text-muted">
        (2D slice; continues in every direction)
      </Label>
      <Label x={480} y={262} className="dg-text">
        no molecules: use the formula unit, NaCl
      </Label>
      <Label x={480} y={286} className="dg-text-accent">
        relative formula mass
      </Label>
      <Label x={480} y={310} className="dg-text-small">
        23.0 + 35.5 = 58.5
      </Label>
      <Label x={608} y={gy - 30} anchor="end" className="dg-text-small">
+ is Na⁺,  − is Cl⁻
      </Label>
    </Svg>
  );
}

export default RelativeMassesMoleculeVsLattice;
