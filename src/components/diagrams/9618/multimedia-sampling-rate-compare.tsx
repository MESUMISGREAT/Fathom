/**
 * The same analogue wave, sin(2πt) + 0.45 sin(6πt + 0.4) over two cycles,
 * sampled at two sampling rates. Left: 5 samples per cycle; right: 20 samples
 * per cycle (4 times the rate). Each sample is held until the next one, which is
 * how the stored digital version plays back. The low rate misses the small fast
 * wiggles; the high rate follows the original closely but stores 4× as many
 * samples.
 */
import { Label, Svg, graph } from '../primitives';

export const diagramKey = 'cs-multimedia-sampling-rate-compare';

const W = 620;
const H = 290;
const PW = 260;
const PH = 150;
const TOP = 62;
const XS = [36, 334];
const wave = (t: number) => Math.sin(2 * Math.PI * t) + 0.45 * Math.sin(6 * Math.PI * t + 0.4);

function Panel({ x0, perCycle }: { x0: number; perCycle: number }) {
  const sx = (t: number) => x0 + (t / 2) * PW;
  const sy = (v: number) => TOP + PH / 2 - (v / 1.6) * (PH / 2);
  const n = 2 * perCycle;
  const pts = Array.from({ length: n + 1 }, (_, i) => ({ t: i / perCycle, v: wave(i / perCycle) }));
  let d = `M${sx(pts[0]!.t).toFixed(2)},${sy(pts[0]!.v).toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` H${sx(pts[i]!.t).toFixed(2)} V${sy(pts[i]!.v).toFixed(2)}`;
  }
  return (
    <g>
      <rect x={x0} y={TOP} width={PW} height={PH} className="dg-thin" />
      <line x1={x0} y1={sy(0)} x2={x0 + PW} y2={sy(0)} className="dg-grid" />
      <path d={graph(wave, [0, 2], { sx, sy }, [-1.6, 1.6], 400)} className="dg-muted dg-dashed" />
      <path d={d} className="dg-accent" />
      {pts.map((p, i) => (
        <circle key={i} cx={sx(p.t)} cy={sy(p.v)} r={perCycle > 10 ? 2.2 : 3.5} className="dg-dot-accent-2" />
      ))}
    </g>
  );
}

export function MultimediaSamplingRateCompare() {
  const panels = [
    { perCycle: 5, title: 'Low sampling rate', sub: '5 samples per cycle', foot: 'fast wiggles missed: less accurate, smaller file' },
    { perCycle: 20, title: 'High sampling rate (×4)', sub: '20 samples per cycle', foot: 'follows the original closely: 4× the file size' },
  ];
  return (
    <Svg width={W} height={H}>
      {panels.map((p, i) => (
        <g key={i}>
          <Label x={XS[i]! + PW / 2} y={20} className="dg-text dg-bold">
            {p.title}
          </Label>
          <Label x={XS[i]! + PW / 2} y={42} className="dg-text-small dg-text-muted">
            {p.sub}
          </Label>
          <Panel x0={XS[i]!} perCycle={p.perCycle} />
          <Label x={XS[i]! + PW / 2} y={TOP + PH + 18} className="dg-text-small">
            {p.foot}
          </Label>
        </g>
      ))}
      <line x1={150} y1={H - 22} x2={178} y2={H - 22} className="dg-muted dg-dashed" />
      <Label x={184} y={H - 22} anchor="start" className="dg-text-small">
        original analogue wave
      </Label>
      <line x1={350} y1={H - 22} x2={378} y2={H - 22} className="dg-accent" />
      <Label x={384} y={H - 22} anchor="start" className="dg-text-small">
        stored samples, each held until the next
      </Label>
    </Svg>
  );
}

export default MultimediaSamplingRateCompare;
