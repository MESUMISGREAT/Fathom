/**
 * Successive ionisation energies of sodium (all 11), plotted on a log scale
 * (real data, kJ mol⁻¹, NIST values as tabulated in standard references).
 * The 1 + 8 + 2 grouping matches the configuration 2, 8, 1: one easy
 * electron from shell 3, then a big jump to shell 2, then a second big jump
 * to shell 1. A log scale is needed because the values span 500 to 159 000.
 */
import { Label, Svg, axes, graph } from '../primitives';

const W = 640;
const H = 420;
const PAD = 64;
const XR: [number, number] = [0, 12];
const YR: [number, number] = [2, 5.6];

/** Successive ionisation energies of Na / kJ mol⁻¹, 1st to 11th. */
const IE = [495.8, 4562, 6910.3, 9543, 13354, 16613, 20117, 25496, 28932, 141362, 159076];
const LOG = IE.map((v) => Math.log10(v));

function interpolate(x: number): number {
  const n = Math.min(10, Math.max(1, Math.floor(x)));
  const t = x - n;
  return LOG[n - 1]! + (LOG[n]! - LOG[n - 1]!) * t;
}

const shellOf = (n: number) => (n === 1 ? 3 : n <= 9 ? 2 : 1);
const DOT = { 3: 'dg-dot-accent', 2: 'dg-dot', 1: 'dg-dot-accent-2' } as const;

export function SuccessiveIonisationSodium() {
  const m = axes({ width: W, height: H, pad: PAD, x: XR, y: YR });
  const { sx, sy } = m;
  return (
    <Svg width={W} height={H}>
      {/* grid and axes (log scale) */}
      {[2, 3, 4, 5].map((p) => (
        <g key={p}>
          <line x1={sx(0)} y1={sy(p)} x2={sx(XR[1])} y2={sy(p)} className="dg-grid" />
          <Label x={sx(0) - 8} y={sy(p)} anchor="end" className="dg-text-small">
            {['10²', '10³', '10⁴', '10⁵'][p - 2]!}
          </Label>
        </g>
      ))}
      <line x1={sx(0)} y1={sy(YR[0])} x2={sx(XR[1])} y2={sy(YR[0])} className="dg-line" />
      <line x1={sx(0)} y1={sy(YR[0])} x2={sx(0)} y2={sy(YR[1])} className="dg-line" />
      {IE.map((_, i) => (
        <g key={i}>
          <line x1={sx(i + 1)} y1={sy(YR[0])} x2={sx(i + 1)} y2={sy(YR[0]) + 5} className="dg-thin" />
          <Label x={sx(i + 1)} y={sy(YR[0]) + 16} className="dg-text-small">
            {String(i + 1)}
          </Label>
        </g>
      ))}
      <Label x={(sx(0) + sx(XR[1])) / 2} y={H - 22} className="dg-text">
        number of the electron removed (1st, 2nd, 3rd …)
      </Label>
      <text x={16} y={H / 2} transform={`rotate(-90 16 ${H / 2})`} textAnchor="middle" dominantBaseline="middle" className="dg-text">
        ionisation energy / kJ mol⁻¹ (log scale)
      </text>

      {/* data */}
      <path d={graph(interpolate, [1, 11], m, YR, 10 * 24)} className="dg-muted" />
      {LOG.map((v, i) => (
        <circle key={i} cx={sx(i + 1)} cy={sy(v)} r={5} className={DOT[shellOf(i + 1)]} />
      ))}

      {/* groupings */}
      <Label x={sx(1.3)} y={sy(2.5)} anchor="start" className="dg-text-accent">
        1 electron from shell 3 (3s)
      </Label>
      <Label x={sx(5.5)} y={sy(4.85)} className="dg-text dg-bold">
        8 electrons from shell 2 (2p, 2s)
      </Label>
      <Label x={sx(10.5)} y={sy(5.45)} className="dg-text-accent-2">
        2 from shell 1 (1s)
      </Label>
      <Label x={sx(1.7)} y={sy(3.05)} anchor="start" className="dg-text-small dg-bold">
        big jump
      </Label>
      <Label x={sx(9.7)} y={sy(4.6)} anchor="start" className="dg-text-small dg-bold">
        big jump
      </Label>
      <Label x={sx(5.5)} y={sy(2.25)} className="dg-text-muted">
        Na is 2, 8, 1 → one electron before the first big jump → group 1
      </Label>
    </Svg>
  );
}
