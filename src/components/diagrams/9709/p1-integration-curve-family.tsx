/**
 * The family y = x² + c for c = −2, −1, 0, 1, 2, 3: every curve has dy/dx = 2x, shown by short
 * parallel tangent segments (gradient 2) where x = 1. Only y = x² + 3 (highlighted) passes
 * through the point (1, 4), so knowing a point fixes c.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, makePlot } from './kit';

export const diagramKey = 'p1-integration-curve-family';

const X: [number, number] = [-2.6, 2.6];
const Y: [number, number] = [-2.6, 8.4];
const PAD = 32;
const W = 480;
const H = 470;
const CS = [-2, -1, 0, 1, 2, 3];
const KEY = 3;

export default function P1IntegrationCurveFamily() {
  const p = makePlot({ width: W, height: H, pad: PAD, x: X, y: Y });
  const d = 0.32; // half-length of each tangent segment, in x units
  return (
    <Svg width={W} height={H}>
      <AxesXY p={p} xTicks={[-2, -1, 1, 2]} yTicks={[]} />
      {CS.map((c) => (
        <path key={`c${c}`} d={graph((x) => x * x + c, X, p, Y)} className={c === KEY ? 'dg-accent' : 'dg-muted'} />
      ))}
      {/* tangents at x = 1, gradient 2 on every curve */}
      {CS.map((c) => (
        <line
          key={`t${c}`}
          x1={p.sx(1 - d)}
          y1={p.sy(1 + c - 2 * d)}
          x2={p.sx(1 + d)}
          y2={p.sy(1 + c + 2 * d)}
          className={c === KEY ? 'dg-accent-2' : 'dg-thin'}
        />
      ))}
      {/* curve labels, right of the y-axis, in the gap between each curve and the next */}
      {CS.map((c) => (
        <Label
          key={`l${c}`}
          x={p.sx(0.08)}
          y={p.sy(c + 0.62)}
          anchor="start"
          className={c === KEY ? 'dg-text-accent' : 'dg-text-small'}
        >
          {`c = ${c < 0 ? '−' : ''}${Math.abs(c)}`}
        </Label>
      ))}
      <circle cx={p.sx(1)} cy={p.sy(4)} r={5} className="dg-dot" />
      <Label x={p.sx(0.88)} y={p.sy(4.45)} anchor="end" className="dg-text dg-bold">
        (1, 4)
      </Label>
      <Label x={p.sx(1.05)} y={p.sy(8.0)} anchor="start" className="dg-text-accent">
        y = x² + 3
      </Label>
      <Label x={W - 16} y={H - 14} anchor="end" className="dg-text-small">
        tangents at x = 1 all have gradient 2
      </Label>
    </Svg>
  );
}
