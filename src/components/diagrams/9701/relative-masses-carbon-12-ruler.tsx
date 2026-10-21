/**
 * The carbon-12 scale. A carbon-12 atom is drawn as a bar exactly 12 u long,
 * cut into 12 equal slices; one slice is the unified atomic mass unit,
 * 1 u = 1/12 of the mass of a carbon-12 atom (about 1.66 × 10⁻²⁷ kg).
 * Other atoms are drawn on the same scale from their real relative isotopic
 * masses (¹H 1.008, ⁴He 4.003, ¹⁴N 14.003, ¹⁶O 15.995), so bar lengths are
 * to scale and the small departures from whole numbers are visible.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-relative-masses-carbon-12-ruler';

const W = 640;
const H = 340;
const X0 = 150;
/** Pixels per unified atomic mass unit. */
const PX = 25;
const BAR = 26;

const ROWS: Array<{ sym: string; name: string; mass: number; value: string }> = [
  { sym: '¹²C', name: 'carbon-12', mass: 12, value: '12 (exactly)' },
  { sym: '¹H', name: 'hydrogen-1', mass: 1.008, value: '1.008' },
  { sym: '⁴He', name: 'helium-4', mass: 4.003, value: '4.003' },
  { sym: '¹⁴N', name: 'nitrogen-14', mass: 14.003, value: '14.003' },
  { sym: '¹⁶O', name: 'oxygen-16', mass: 15.995, value: '15.995' },
];

const x = (u: number) => X0 + u * PX;

export function RelativeMassesCarbon12Ruler() {
  const top = 58;
  const step = 46;
  const axisY = top + ROWS.length * step + 4;
  return (
    <Svg width={W} height={H}>
      {/* grid: one line per u */}
      {Array.from({ length: 17 }, (_, u) => (
        <line key={u} x1={x(u)} y1={top - 8} x2={x(u)} y2={axisY} className="dg-grid" />
      ))}

      {/* callout for 1 u */}
      <Label x={x(0)} y={18} anchor="start" className="dg-text-accent">
        1 u = 1/12 of the mass of one ¹²C atom
      </Label>
      <Label x={x(0)} y={36} anchor="start" className="dg-text-small">
        (about 1.66 × 10⁻²⁷ kg)
      </Label>
      <Arrow x1={x(0.5) - 4} y1={42} x2={x(0.5)} y2={top - 2} head={7} className="dg-accent" headClassName="dg-dot-accent" />

      {ROWS.map((r, i) => {
        const y = top + i * step;
        const cy = y + BAR / 2;
        const isC = i === 0;
        return (
          <g key={r.sym}>
            <Label x={20} y={cy - 7} anchor="start" className="dg-text dg-bold">
              {r.sym}
            </Label>
            <Label x={20} y={cy + 9} anchor="start" className="dg-text-small">
              {r.name}
            </Label>
            <rect x={x(0)} y={y} width={r.mass * PX} height={BAR} rx={3} className={isC ? 'dg-fill-surface dg-line' : 'dg-fill-muted dg-thin'} />
            {isC && (
              <>
                <rect x={x(0)} y={y} width={PX} height={BAR} className="dg-fill-accent dg-accent" />
                {Array.from({ length: 11 }, (_, k) => (
                  <line key={k} x1={x(k + 1)} y1={y} x2={x(k + 1)} y2={y + BAR} className="dg-thin" />
                ))}
              </>
            )}
            <Label x={x(r.mass) + 8} y={cy} anchor="start" className={isC ? 'dg-text dg-bold' : 'dg-text'}>
              {r.value}
            </Label>
          </g>
        );
      })}

      {/* axis */}
      <line x1={x(0)} y1={axisY} x2={x(16)} y2={axisY} className="dg-line" />
      {Array.from({ length: 9 }, (_, k) => k * 2).map((u) => (
        <g key={u}>
          <line x1={x(u)} y1={axisY} x2={x(u)} y2={axisY + 5} className="dg-thin" />
          <Label x={x(u)} y={axisY + 17} className="dg-text-small">
            {String(u)}
          </Label>
        </g>
      ))}
      <Label x={x(8)} y={axisY + 40} className="dg-text">
        relative isotopic mass (mass of one atom ÷ 1 u)
      </Label>
    </Svg>
  );
}

export default RelativeMassesCarbon12Ruler;
