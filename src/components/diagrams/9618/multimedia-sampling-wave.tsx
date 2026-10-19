/**
 * Sampling an analogue sound wave. The wave (a real function,
 * 3.5 + 2.4 sin(2πt/9) + 0.6 sin(2πt/3.5 + 1.3), t in ms) is measured every
 * 1 ms (11 samples, t = 0 to 10). The sampling resolution is 3 bits, so each
 * measurement is rounded to the nearest of 8 levels (000 to 111). Stored values:
 * 4 5 5 6 5 2 1 2 2 3 5 = 100 101 101 110 101 010 001 010 010 011 101.
 */
import { Label, Svg, graph } from '../primitives';

export const diagramKey = 'cs-multimedia-sampling-wave';

const W = 620;
const H = 404;
const XL = 100;
const XR = 580;
const T_MAX = 10;
const YB = 330; // y of level -0.5
const LV = 34; // pixels per level
const sx = (t: number) => XL + (t / T_MAX) * (XR - XL);
const sy = (v: number) => YB - (v + 0.5) * LV;
const wave = (t: number) => 3.5 + 2.4 * Math.sin((2 * Math.PI * t) / 9) + 0.6 * Math.sin((2 * Math.PI * t) / 3.5 + 1.3);
const samples = Array.from({ length: 11 }, (_, t) => ({ t, v: wave(t), q: Math.round(wave(t)) }));

export function MultimediaSamplingWave() {
  const path = graph(wave, [0, T_MAX], { sx, sy }, [-1, 8], 400);
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={18} className="dg-text dg-bold">
        3-bit sampling resolution (8 levels), one sample every 1 ms
      </Label>
      <Label x={XL - 30} y={46} anchor="end" className="dg-text-small dg-text-muted">
        stored
      </Label>
      {samples.map((s) => (
        <Label key={s.t} x={sx(s.t)} y={46} className="dg-text-small dg-mono dg-text-accent-2">
          {s.q.toString(2).padStart(3, '0')}
        </Label>
      ))}

      {/* levels */}
      {Array.from({ length: 8 }, (_, k) => (
        <g key={k}>
          <line x1={XL} y1={sy(k)} x2={XR} y2={sy(k)} className="dg-grid" />
          <Label x={XL - 12} y={sy(k)} anchor="end" className="dg-text-small dg-mono">
            {k.toString(2).padStart(3, '0')}
          </Label>
        </g>
      ))}
      <text
        x={26}
        y={sy(3.5)}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 26 ${sy(3.5)})`}
        className="dg-text-small"
      >
        amplitude (sample level)
      </text>

      {/* samples */}
      {samples.map((s) => (
        <line key={s.t} x1={sx(s.t)} y1={YB} x2={sx(s.t)} y2={sy(Math.max(s.v, s.q))} className="dg-muted dg-dashed" />
      ))}
      <path d={path} className="dg-accent" />
      {samples.map((s) => (
        <g key={s.t}>
          <rect x={sx(s.t) - 5} y={sy(s.q) - 5} width={10} height={10} className="dg-dot-accent-2" />
          <circle cx={sx(s.t)} cy={sy(s.v)} r={3.5} className="dg-dot" />
        </g>
      ))}

      {/* time axis */}
      <line x1={XL} y1={YB} x2={XR} y2={YB} className="dg-line" />
      <line x1={XL} y1={YB} x2={XL} y2={sy(7.5)} className="dg-line" />
      {samples.map((s) => (
        <Label key={s.t} x={sx(s.t)} y={YB + 14} className="dg-text-small dg-text-muted">
          {s.t}
        </Label>
      ))}
      <Label x={(XL + XR) / 2} y={YB + 34} className="dg-text-small">
        time / ms
      </Label>

      {/* legend */}
      <line x1={110} y1={H - 16} x2={136} y2={H - 16} className="dg-accent" />
      <Label x={142} y={H - 16} anchor="start" className="dg-text-small">
        analogue wave
      </Label>
      <circle cx={262} cy={H - 16} r={3.5} className="dg-dot" />
      <Label x={272} y={H - 16} anchor="start" className="dg-text-small">
        measured amplitude
      </Label>
      <rect x={415} y={H - 21} width={10} height={10} className="dg-dot-accent-2" />
      <Label x={432} y={H - 16} anchor="start" className="dg-text-small">
        stored (nearest level)
      </Label>
    </Svg>
  );
}

export default MultimediaSamplingWave;
