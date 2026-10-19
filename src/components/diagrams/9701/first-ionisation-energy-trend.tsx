/**
 * First ionisation energy against atomic number for H (Z = 1) to Ca (Z = 20),
 * plotted from real data (kJ mol⁻¹, NIST values as tabulated in standard
 * references). Shows: peaks at the noble gases, troughs at group 1, a general
 * rise across periods 2 and 3, the dips at groups 13 (B, Al) and 16 (O, S),
 * and the fall down groups 1 and 18.
 */
import { Label, Svg, axes, graph } from '../primitives';

const W = 640;
const H = 420;
const PAD = 64;
const XR: [number, number] = [0, 21];
const YR: [number, number] = [0, 2600];

/** [symbol, first IE / kJ mol⁻¹] for Z = 1 … 20. */
const DATA: Array<[string, number]> = [
  ['H', 1312.0],
  ['He', 2372.3],
  ['Li', 520.2],
  ['Be', 899.5],
  ['B', 800.6],
  ['C', 1086.5],
  ['N', 1402.3],
  ['O', 1313.9],
  ['F', 1681.0],
  ['Ne', 2080.7],
  ['Na', 495.8],
  ['Mg', 737.7],
  ['Al', 577.5],
  ['Si', 786.5],
  ['P', 1011.8],
  ['S', 999.6],
  ['Cl', 1251.2],
  ['Ar', 1520.6],
  ['K', 418.8],
  ['Ca', 589.8],
];

/** Where each symbol sits relative to its point. */
const PLACE: Record<string, 'above' | 'below' | 'left'> = {
  Li: 'below', B: 'below', O: 'below', Na: 'below', Al: 'below', S: 'below', K: 'below',
  C: 'left', F: 'left', Si: 'left', Cl: 'left',
};
const DIPS = new Set(['B', 'O', 'Al', 'S']);

const ie = (z: number) => DATA[z - 1]![1];
/** Straight lines between the data points (the usual way this graph is drawn). */
function interpolate(x: number): number {
  const z = Math.min(19, Math.max(1, Math.floor(x)));
  const t = x - z;
  return ie(z) + (ie(z + 1) - ie(z)) * t;
}

export function FirstIonisationEnergyTrend() {
  const m = axes({ width: W, height: H, pad: PAD, x: XR, y: YR });
  const { sx, sy } = m;
  const yTicks = [0, 500, 1000, 1500, 2000, 2500];
  const group = (zs: number[]) => zs.map((z, i) => `${i === 0 ? 'M' : 'L'}${sx(z)},${sy(ie(z))}`).join(' ');
  return (
    <Svg width={W} height={H}>
      {/* period bands */}
      {[
        { from: 2.5, to: 10.5, name: 'period 2' },
        { from: 10.5, to: 18.5, name: 'period 3' },
      ].map((p, i) => (
        <g key={p.name}>
          {i === 0 && <rect x={sx(p.from)} y={sy(YR[1])} width={sx(p.to) - sx(p.from)} height={sy(0) - sy(YR[1])} className="dg-fill-muted" />}
          <Label x={(sx(p.from) + sx(p.to)) / 2} y={sy(130)} className="dg-text-muted">
            {p.name}
          </Label>
        </g>
      ))}

      {/* grid and axes */}
      {yTicks.map((t) => (
        <g key={t}>
          {t > 0 && <line x1={sx(0)} y1={sy(t)} x2={sx(XR[1])} y2={sy(t)} className="dg-grid" />}
          <Label x={sx(0) - 8} y={sy(t)} anchor="end" className="dg-text-small">
            {String(t)}
          </Label>
        </g>
      ))}
      <line x1={sx(0)} y1={sy(0)} x2={sx(XR[1])} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(YR[1])} className="dg-line" />
      {DATA.map((_, i) => (
        <g key={i}>
          <line x1={sx(i + 1)} y1={sy(0)} x2={sx(i + 1)} y2={sy(0) + 5} className="dg-thin" />
          <Label x={sx(i + 1)} y={sy(0) + 16} className="dg-text-small">
            {String(i + 1)}
          </Label>
        </g>
      ))}
      <Label x={(sx(0) + sx(XR[1])) / 2} y={H - 22} className="dg-text">
        atomic number, Z
      </Label>
      <text x={16} y={H / 2} transform={`rotate(-90 16 ${H / 2})`} textAnchor="middle" dominantBaseline="middle" className="dg-text">
        first ionisation energy / kJ mol⁻¹
      </text>

      {/* down a group: groups 18 and 1 */}
      <path d={group([2, 10, 18])} className="dg-muted dg-dashed" />
      <path d={group([3, 11, 19])} className="dg-muted dg-dashed" />

      {/* the data */}
      <path d={graph(interpolate, [1, 20], m, YR, 19 * 20)} className="dg-accent" />
      {DATA.map(([sym, v], i) => {
        const x = sx(i + 1);
        const y = sy(v);
        const where = PLACE[sym] ?? 'above';
        const lx = where === 'left' ? x - 10 : x;
        const ly = where === 'above' ? y - 13 : where === 'below' ? y + 14 : y;
        return (
          <g key={sym}>
            {DIPS.has(sym) && <circle cx={x} cy={y} r={7.5} className="dg-accent-2" />}
            <circle cx={x} cy={y} r={3.5} className="dg-dot" />
            <Label x={lx} y={ly} anchor={where === 'left' ? 'end' : 'middle'} className="dg-text-small dg-bold">
              {sym}
            </Label>
          </g>
        );
      })}

      {/* key */}
      <circle cx={sx(11.4)} cy={sy(2450)} r={7.5} className="dg-accent-2" />
      <Label x={sx(11.4) + 14} y={sy(2450)} anchor="start" className="dg-text-small">
        dips: B, Al (outer electron in a p sub-shell)
      </Label>
      <Label x={sx(11.4) + 14} y={sy(2450) + 17} anchor="start" className="dg-text-small">
        O, S (electron removed from a spin pair)
      </Label>
      <line x1={sx(11.4) - 8} y1={sy(2150)} x2={sx(11.4) + 8} y2={sy(2150)} className="dg-muted dg-dashed" />
      <Label x={sx(11.4) + 14} y={sy(2150)} anchor="start" className="dg-text-small">
        down a group: He → Ne → Ar, Li → Na → K
      </Label>
    </Svg>
  );
}
