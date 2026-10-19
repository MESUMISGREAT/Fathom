/**
 * The same analogue wave, sin(2πt) + 0.45 sin(6πt + 0.4) over two cycles,
 * sampled at the same rate (20 samples per cycle) with two sampling
 * resolutions. Left: 2 bits, so every sample is rounded to one of 4 levels;
 * right: 4 bits, 16 levels. The available levels are the grid lines, evenly
 * spaced from −1.5 to +1.5. More bits means smaller rounding (quantisation)
 * errors, at twice the file size.
 */
import { Label, Svg, graph } from '../primitives';

export const diagramKey = 'cs-multimedia-sampling-resolution-compare';

const W = 620;
const H = 290;
const PW = 260;
const PH = 150;
const TOP = 62;
const XS = [36, 334];
const RANGE = 1.5;
const PER_CYCLE = 20;
const wave = (t: number) => Math.sin(2 * Math.PI * t) + 0.45 * Math.sin(6 * Math.PI * t + 0.4);

function Panel({ x0, bits }: { x0: number; bits: number }) {
  const levels = 2 ** bits;
  const step = (2 * RANGE) / (levels - 1);
  const level = (k: number) => -RANGE + k * step;
  const quantise = (v: number) => level(Math.min(levels - 1, Math.max(0, Math.round((v + RANGE) / step))));
  const sx = (t: number) => x0 + (t / 2) * PW;
  const sy = (v: number) => TOP + PH / 2 - (v / 1.6) * (PH / 2);
  const pts = Array.from({ length: 2 * PER_CYCLE + 1 }, (_, i) => ({ t: i / PER_CYCLE, v: quantise(wave(i / PER_CYCLE)) }));
  let d = `M${sx(pts[0]!.t).toFixed(2)},${sy(pts[0]!.v).toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) d += ` H${sx(pts[i]!.t).toFixed(2)} V${sy(pts[i]!.v).toFixed(2)}`;
  return (
    <g>
      {Array.from({ length: levels }, (_, k) => (
        <line key={k} x1={x0} y1={sy(level(k))} x2={x0 + PW} y2={sy(level(k))} className="dg-grid" />
      ))}
      <rect x={x0} y={TOP} width={PW} height={PH} className="dg-thin" />
      <path d={graph(wave, [0, 2], { sx, sy }, [-1.6, 1.6], 400)} className="dg-muted dg-dashed" />
      <path d={d} className="dg-accent" />
      {pts.map((p, i) => (
        <circle key={i} cx={sx(p.t)} cy={sy(p.v)} r={2.2} className="dg-dot-accent-2" />
      ))}
    </g>
  );
}

export function MultimediaSamplingResolutionCompare() {
  const panels = [
    { bits: 2, title: 'Sampling resolution 2 bits', sub: '2² = 4 levels', foot: 'big rounding errors: blocky, less accurate' },
    { bits: 4, title: 'Sampling resolution 4 bits', sub: '2⁴ = 16 levels', foot: 'small rounding errors: 2× the file size' },
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
          <Panel x0={XS[i]!} bits={p.bits} />
          <Label x={XS[i]! + PW / 2} y={TOP + PH + 18} className="dg-text-small">
            {p.foot}
          </Label>
        </g>
      ))}
      <line x1={70} y1={H - 22} x2={98} y2={H - 22} className="dg-muted dg-dashed" />
      <Label x={104} y={H - 22} anchor="start" className="dg-text-small">
        original wave
      </Label>
      <line x1={210} y1={H - 22} x2={238} y2={H - 22} className="dg-accent" />
      <Label x={244} y={H - 22} anchor="start" className="dg-text-small">
        stored version
      </Label>
      <line x1={360} y1={H - 22} x2={388} y2={H - 22} className="dg-grid" />
      <Label x={394} y={H - 22} anchor="start" className="dg-text-small">
        levels a sample can take
      </Label>
    </Svg>
  );
}

export default MultimediaSamplingResolutionCompare;
