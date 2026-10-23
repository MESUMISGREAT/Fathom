/**
 * y = cos θ for 0° ≤ θ ≤ 360° inside the shaded band −1 ≤ y ≤ 1 (its range).
 * The line y = ½ meets the curve twice, at θ = 60° and θ = 300°. The line y = −2
 * lies below the band and never meets it, so cos θ = −2 has no solutions.
 */
import { Label, Svg, graph, MathLabel } from '../primitives';
import { GraphFrame, cosd, frame } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-reject-root';

const W = 620;
const H = 320;

export default function P1TrigonometryRejectRoot() {
  const p = frame(50, 30, 440, 250, [-12, 372], [-2.5, 1.5]);
  return (
    <Svg width={W} height={H}>
      <rect
        x={p.sx(0)}
        y={p.sy(1)}
        width={p.sx(360) - p.sx(0)}
        height={p.sy(-1) - p.sy(1)}
        className="dg-fill-muted"
      />
      <GraphFrame
        p={p}
        xLabel="θ"
        xTicks={[90, 180, 270, 360].map((v) => ({ v, label: `${v}°` }))}
        yTicks={[
          { v: 1, label: '1' },
          { v: 0.5, label: '1/2' },
          { v: -1, label: '−1' },
          { v: -2, label: '−2' },
        ]}
      />
      <path d={graph(cosd, [0, 360], p, p.y)} className="dg-accent" />
      <line x1={p.sx(0)} y1={p.sy(0.5)} x2={p.sx(360)} y2={p.sy(0.5)} className="dg-accent-2" style={{ strokeWidth: 1.75 }} />
      <line x1={p.sx(0)} y1={p.sy(-2)} x2={p.sx(360)} y2={p.sy(-2)} className="dg-muted dg-dashed" />
      {[60, 300].map((t) => (
        <g key={t}>
          <line x1={p.sx(t)} y1={p.sy(0.5)} x2={p.sx(t)} y2={p.sy(0)} className="dg-muted" />
          <circle cx={p.sx(t)} cy={p.sy(0.5)} r={4.5} className="dg-dot" />
          <Label x={p.sx(t) + (t === 60 ? 8 : -8)} y={p.sy(0.5) - 13} anchor={t === 60 ? 'start' : 'end'} className="dg-text-small dg-bold">
            {`${t}°`}
          </Label>
        </g>
      ))}
      <Label x={p.sx(180)} y={p.sy(-2) - 14} className="dg-text-small">
        y = −2 never meets the curve
      </Label>
      <Label x={p.sx(180)} y={p.sy(1) - 10} className="dg-text-muted">
        range of cos θ: −1 ≤ y ≤ 1
      </Label>

      <g>
        <MathLabel x={555} y={84} w={125} h={46} tone="accent-2" tex={"\\cos\\theta = \\dfrac{1}{2}"} />
        <Label x={555} y={116} className="dg-text-small">
          θ = 60°, 300°
        </Label>
        <Label x={555} y={204} className="dg-text dg-bold">
          cos θ = −2
        </Label>
        <Label x={555} y={224} className="dg-text-small">
          no solutions:
        </Label>
        <Label x={555} y={242} className="dg-text-small">
          reject it
        </Label>
      </g>
    </Svg>
  );
}
