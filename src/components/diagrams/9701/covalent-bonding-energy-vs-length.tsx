/**
 * Bond energy against bond length for three families of bonds, plotted to scale.
 * Bond energies (kJ mol⁻¹) are Cambridge 9701 Data Booklet values; bond lengths (nm)
 * are typical literature values. Carbon–carbon: C≡C 0.120, 840; C=C 0.134, 610;
 * C–C 0.154, 350. Hydrogen halides: H–F 0.092, 562; H–Cl 0.127, 431; H–Br 0.141, 366;
 * H–I 0.161, 299. Halogens: F–F 0.142, 158; Cl–Cl 0.199, 242; Br–Br 0.228, 193;
 * I–I 0.267, 151. Within each family, shorter bonds are stronger, except F–F, which is
 * unusually weak.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-covalent-bonding-energy-vs-length';

const W = 640;
const H = 430;
const L = 78;
const R = 24;
const T = 26;
const Bm = 64;
const X: [number, number] = [0.08, 0.28];
const Y: [number, number] = [0, 900];
const sx = (x: number) => L + ((x - X[0]) / (X[1] - X[0])) * (W - L - R);
const sy = (y: number) => H - Bm - ((y - Y[0]) / (Y[1] - Y[0])) * (H - Bm - T);

type Pt = { name: string; len: number; e: number; dx?: number; dy?: number; anchor?: 'start' | 'middle' | 'end' };
type Marker = 'circle' | 'square' | 'diamond';

const SERIES: Array<{ name: string; marker: Marker; line: string; dot: string; pts: Pt[] }> = [
  {
    name: 'carbon–carbon',
    marker: 'circle',
    line: 'dg-accent',
    dot: 'dg-dot-accent',
    pts: [
      { name: 'C≡C', len: 0.12, e: 840, dx: 10, anchor: 'start' },
      { name: 'C=C', len: 0.134, e: 610, dx: 10, anchor: 'start' },
      { name: 'C–C', len: 0.154, e: 350, dx: 10, dy: -8, anchor: 'start' },
    ],
  },
  {
    name: 'hydrogen–halogen',
    marker: 'square',
    line: 'dg-accent-2',
    dot: 'dg-dot-accent-2',
    pts: [
      { name: 'H–F', len: 0.092, e: 562, dy: -16 },
      { name: 'H–Cl', len: 0.127, e: 431, dx: -10, anchor: 'end' },
      { name: 'H–Br', len: 0.141, e: 366, dx: -8, dy: 15, anchor: 'end' },
      { name: 'H–I', len: 0.161, e: 299, dx: 10, dy: 6, anchor: 'start' },
    ],
  },
  {
    name: 'halogen–halogen',
    marker: 'diamond',
    line: 'dg-muted dg-dashed',
    dot: 'dg-dot',
    pts: [
      { name: 'F–F', len: 0.142, e: 158, dy: 18 },
      { name: 'Cl–Cl', len: 0.199, e: 242, dy: -16 },
      { name: 'Br–Br', len: 0.228, e: 193, dy: -16 },
      { name: 'I–I', len: 0.267, e: 151, dy: -16 },
    ],
  },
];

function Dot({ x, y, marker, className }: { x: number; y: number; marker: Marker; className: string }) {
  if (marker === 'circle') return <circle cx={x} cy={y} r={5} className={className} />;
  if (marker === 'square') return <rect x={x - 4.5} y={y - 4.5} width={9} height={9} className={className} />;
  return <path d={`M${x},${y - 6} L${x + 6},${y} L${x},${y + 6} L${x - 6},${y} Z`} className={className} />;
}

export function CovalentBondingEnergyVsLength() {
  const xTicks = [0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2, 0.22, 0.24, 0.26, 0.28];
  const yTicks = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  return (
    <Svg width={W} height={H}>
      {yTicks.map((t) => (
        <g key={t}>
          {t > 0 && <line x1={sx(X[0])} y1={sy(t)} x2={sx(X[1])} y2={sy(t)} className="dg-grid" />}
          <Label x={sx(X[0]) - 8} y={sy(t)} anchor="end" className="dg-text-small">
            {String(t)}
          </Label>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(0) + 5} className="dg-thin" />
          <Label x={sx(t)} y={sy(0) + 17} className="dg-text-small">
            {t.toFixed(2)}
          </Label>
        </g>
      ))}
      <line x1={sx(X[0])} y1={sy(0)} x2={sx(X[1])} y2={sy(0)} className="dg-line" />
      <line x1={sx(X[0])} y1={sy(0)} x2={sx(X[0])} y2={sy(Y[1])} className="dg-line" />
      <Label x={(sx(X[0]) + sx(X[1])) / 2} y={H - 18} className="dg-text">
        bond length / nm
      </Label>
      <text x={18} y={(T + H - Bm) / 2} transform={`rotate(-90 18 ${(T + H - Bm) / 2})`} textAnchor="middle" dominantBaseline="middle" className="dg-text">
        bond energy / kJ mol⁻¹
      </text>

      {SERIES.map((s) => (
        <g key={s.name}>
          <path d={s.pts.map((p, i) => `${i ? 'L' : 'M'}${sx(p.len)},${sy(p.e)}`).join(' ')} className={s.line} />
          {s.pts.map((p) => (
            <g key={p.name}>
              <Dot x={sx(p.len)} y={sy(p.e)} marker={s.marker} className={s.dot} />
              <Label x={sx(p.len) + (p.dx ?? 0)} y={sy(p.e) + (p.dy ?? 0)} anchor={p.anchor ?? 'middle'} className="dg-text-small dg-bold">
                {p.name}
              </Label>
            </g>
          ))}
        </g>
      ))}
      <Label x={sx(0.142) + 30} y={sy(158) + 18} anchor="start" className="dg-text-small dg-italic">
        unusually weak
      </Label>

      {/* legend */}
      {SERIES.map((s, i) => (
        <g key={s.name}>
          <line x1={sx(0.205)} y1={sy(840) + i * 22} x2={sx(0.225)} y2={sy(840) + i * 22} className={s.line} />
          <Dot x={sx(0.215)} y={sy(840) + i * 22} marker={s.marker} className={s.dot} />
          <Label x={sx(0.225) + 10} y={sy(840) + i * 22} anchor="start" className="dg-text-small">
            {s.name}
          </Label>
        </g>
      ))}
    </Svg>
  );
}

export default CovalentBondingEnergyVsLength;
