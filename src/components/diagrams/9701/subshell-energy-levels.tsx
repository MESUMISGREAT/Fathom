/**
 * Sub-shell energy levels for shells 1–4 (as far as 4p), drawn as orbital
 * boxes: s = 1 box, p = 3 boxes, d = 5 boxes. Columns are shells (n = 1 … 4),
 * height is energy. The order is 1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p, so the
 * 4s row (in the n = 4 column) sits below 3d (in the n = 3 column). Gaps get
 * smaller higher up, as they do in real atoms; energies are not to scale.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-subshell-energy-levels';

const W = 600;
const H = 450;
const BOX = 24;

interface Sub {
  name: string;
  /** Left edge of the boxes. */
  x: number;
  /** Top of the boxes. */
  y: number;
  orbitals: number;
  order: number;
}

const COL = { 1: 110, 2: 205, 3: 330, 4: 495 } as const;

const SUBS: Sub[] = [
  { name: '1s', x: COL[1], y: 388, orbitals: 1, order: 1 },
  { name: '2s', x: COL[2], y: 318, orbitals: 1, order: 2 },
  { name: '2p', x: COL[2], y: 278, orbitals: 3, order: 3 },
  { name: '3s', x: COL[3], y: 222, orbitals: 1, order: 4 },
  { name: '3p', x: COL[3], y: 190, orbitals: 3, order: 5 },
  { name: '4s', x: COL[4], y: 148, orbitals: 1, order: 6 },
  { name: '3d', x: COL[3], y: 122, orbitals: 5, order: 7 },
  { name: '4p', x: COL[4], y: 70, orbitals: 3, order: 8 },
];

export function SubshellEnergyLevels() {
  const s4 = SUBS.find((s) => s.name === '4s')!;
  const d3 = SUBS.find((s) => s.name === '3d')!;
  return (
    <Svg width={W} height={H}>
      {/* energy axis */}
      <Arrow x1={44} y1={420} x2={44} y2={40} className="dg-line" />
      <text x={28} y={230} transform="rotate(-90 28 230)" textAnchor="middle" dominantBaseline="middle" className="dg-text">
        energy (not to scale)
      </text>

      {/* sub-shells */}
      {SUBS.map((s) => (
        <g key={s.name}>
          <Label x={s.x - 10} y={s.y + BOX / 2} anchor="end" className="dg-text dg-bold">
            {s.name}
          </Label>
          {Array.from({ length: s.orbitals }, (_, i) => (
            <rect
              key={i}
              x={s.x + i * BOX}
              y={s.y}
              width={BOX}
              height={BOX}
              className={s.name === '4s' || s.name === '3d' ? 'dg-thin dg-fill-accent' : 'dg-thin dg-fill-muted'}
            />
          ))}
          <Label x={s.x + s.orbitals * BOX + 8} y={s.y + BOX / 2} anchor="start" className="dg-text-muted">
            {`(${s.order})`}
          </Label>
        </g>
      ))}

      {/* 4s below 3d */}
      <line x1={s4.x - 6} y1={d3.y + BOX / 2} x2={W - 14} y2={d3.y + BOX / 2} className="dg-muted dg-dashed" />
      <Label x={W - 14} y={d3.y + BOX / 2 - 10} anchor="end" className="dg-text-small">
        3d level
      </Label>
      <Label x={s4.x + 12} y={s4.y + BOX + 16} className="dg-text-accent">
        4s is below 3d,
      </Label>
      <Label x={s4.x + 12} y={s4.y + BOX + 33} className="dg-text-accent">
        so it fills first
      </Label>

      {/* key */}
      <rect x={76} y={40} width={210} height={98} rx={8} className="dg-grid" />
      <rect x={90} y={54} width={BOX} height={BOX} className="dg-thin dg-fill-muted" />
      <Label x={124} y={66} anchor="start" className="dg-text-small">
        = one orbital (max 2 e⁻)
      </Label>
      <Label x={90} y={98} anchor="start" className="dg-text-small">
        s: 1 orbital · p: 3 · d: 5
      </Label>
      <Label x={90} y={120} anchor="start" className="dg-text-small">
        (n) = filling order
      </Label>

      {/* shell columns */}
      {([1, 2, 3, 4] as const).map((n) => (
        <Label key={n} x={COL[n] + (n === 3 ? 48 : n === 1 ? 12 : 36)} y={436} className="dg-text-muted">
          {`n = ${n}`}
        </Label>
      ))}
    </Svg>
  );
}

export default SubshellEnergyLevels;
