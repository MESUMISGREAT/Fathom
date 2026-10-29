/**
 * The gradient of a concentration-time curve is the rate. The tangent at t = 0
 * gives the initial rate; a tangent later in the reaction is less steep.
 */
import { Label, Svg, axes, graph } from '../primitives';

export const diagramKey = 'chem-rate-reaction-tangent';

const W = 600;
const H = 330;
const PAD = 58;

const map = axes({ width: W, height: H, pad: PAD, x: [0, 60], y: [0, 1.05] });

const c = (t: number) => 0.15 + 0.85 * Math.exp(-t / 18);
const dc = (t: number) => (-0.85 / 18) * Math.exp(-t / 18);

function tangent(t0: number, from: number, to: number) {
  return `M${map.sx(from)},${map.sy(c(t0) + dc(t0) * (from - t0))} L${map.sx(to)},${map.sy(c(t0) + dc(t0) * (to - t0))}`;
}

export function RateReactionTangent() {
  return (
    <Svg width={W} height={H}>
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(60)} y2={map.sy(0)} className="dg-line" />
      <line x1={map.sx(0)} y1={map.sy(0)} x2={map.sx(0)} y2={map.sy(1.05)} className="dg-line" />

      {[0, 20, 40, 60].map((t) => (
        <g key={t}>
          <line x1={map.sx(t)} y1={map.sy(0)} x2={map.sx(t)} y2={map.sy(0) + 5} className="dg-thin" />
          <Label x={map.sx(t)} y={map.sy(0) + 18} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}
      {[0.5, 1.0].map((v) => (
        <g key={v}>
          <line x1={map.sx(0) - 5} y1={map.sy(v)} x2={map.sx(0)} y2={map.sy(v)} className="dg-thin" />
          <Label x={map.sx(0) - 10} y={map.sy(v)} anchor="end" className="dg-text-small dg-text-muted">
            {v.toFixed(1)}
          </Label>
        </g>
      ))}

      <path d={graph(c, [0, 60], map, [0, 1.05])} className="dg-accent" fill="none" />

      <path d={tangent(0, 0, 20)} className="dg-accent-2 dg-dashed" fill="none" />
      <path d={tangent(30, 12, 52)} className="dg-muted dg-dashed" fill="none" />

      <Label x={map.sx(7)} y={map.sy(0.9)} anchor="start" className="dg-text-small dg-text-accent-2">
        initial rate
      </Label>

      <Label x={map.sx(36)} y={map.sy(0.4)} anchor="start" className="dg-text-small dg-text-muted">
        later rate
      </Label>

      <Label x={map.sx(30)} y={map.sy(0) + 42} className="dg-text-small dg-text-muted">
        time / s
      </Label>
      <Label x={map.sx(0) + 6} y={map.sy(1.05) + 4} anchor="start" className="dg-text-small dg-text-muted">
        concentration / mol dm⁻³
      </Label>
    </Svg>
  );
}

export default RateReactionTangent;
