/**
 * Loading and unloading a wire. Load it within the elastic limit and the unloading line retraces
 * the loading line back to the origin. Load it beyond the elastic limit and the unloading line is
 * parallel to the straight part but no longer passes through the origin: the gap is the permanent
 * (plastic) extension.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-elastic-plastic-loading-unloading';

const W = 560;
const H = 500;
const PAD = 62;

const { sx, sy } = axes({ width: W, height: H, pad: PAD, x: [0, 10], y: [0, 8] });

const limit = 4;
const loading = (x: number) =>
  x <= limit ? x : limit + 2.6 * (1 - Math.exp(-(x - limit) / 2.6));

// The wire leaves the graph at (8.5, loading(8.5)) and unloads along a line parallel to the
// straight part (gradient 1), so it reaches the extension axis at x = 8.5 - loading(8.5).
const bigX = 8.5;
const bigF = loading(bigX);
const permanent = bigX - bigF;

export function ElasticPlasticLoadingUnloading() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        Loading and unloading a metal wire
      </Label>

      {/* axes */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(10)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(8)} className="dg-line" />

      <Label x={sx(9.9)} y={sy(0) + 30} anchor="end" className="dg-text-small dg-text-muted">
        extension x
      </Label>
      <Label x={sx(0) - 12} y={sy(7.5)} anchor="end" className="dg-text-small dg-text-muted">
        force F
      </Label>

      {/* ticks */}
      {[2, 4, 6, 8].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(0) + 5} className="dg-muted" />
          <Label x={sx(t)} y={sy(0) + 17} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}
      {[2, 4, 6].map((t) => (
        <g key={t}>
          <line x1={sx(0)} y1={sy(t)} x2={sx(0) - 5} y2={sy(t)} className="dg-muted" />
          <Label x={sx(0) - 9} y={sy(t)} anchor="end" className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}

      {/* loading curve */}
      <path d={graph(loading, [0, 9.4], { sx, sy }, [0, 8])} className="dg-accent" strokeWidth={2.5} />
      <Label x={sx(4.4)} y={sy(5.95)} anchor="start" className="dg-text-small dg-text-accent">
        loading
      </Label>

      {/* elastic limit */}
      <circle cx={sx(limit)} cy={sy(limit)} r={4.5} className="dg-dot-accent" />
      <line x1={sx(limit)} y1={sy(limit)} x2={sx(limit)} y2={sy(0)} className="dg-muted dg-dashed" />
      <Label x={sx(limit) - 11} y={sy(limit) - 17} anchor="end" className="dg-text-small dg-text-accent">
        elastic limit
      </Label>

      {/* small load: unloads back to the origin */}
      <line
        x1={sx(3)}
        y1={sy(3)}
        x2={sx(0)}
        y2={sy(0)}
        className="dg-accent-2 dg-dashed"
        strokeWidth={2}
      />
      <Label x={sx(0.3)} y={sy(3.2)} anchor="start" className="dg-text-small dg-text-accent-2">
        unloads to 0
      </Label>
      <line x1={sx(1.98)} y1={sy(3.05)} x2={sx(2.02)} y2={sy(2.2)} className="dg-thin" />

      {/* large load: unloads parallel to the straight part, leaving a permanent extension */}
      <line
        x1={sx(bigX)}
        y1={sy(bigF)}
        x2={sx(permanent)}
        y2={sy(0)}
        className="dg-accent-2 dg-dashed"
        strokeWidth={2}
      />
      <circle cx={sx(bigX)} cy={sy(bigF)} r={4.5} className="dg-dot-accent" />
      <Label x={sx(bigX) + 0.12} y={sy(bigF - 1.05)} anchor="start" className="dg-text-small dg-text-muted">
        release
      </Label>

      {/* permanent extension marker */}
      <line
        x1={sx(0)}
        y1={sy(0) + 42}
        x2={sx(permanent)}
        y2={sy(0) + 42}
        className="dg-thin"
      />
      <line x1={sx(0)} y1={sy(0) + 37} x2={sx(0)} y2={sy(0) + 47} className="dg-thin" />
      <line
        x1={sx(permanent)}
        y1={sy(0) + 37}
        x2={sx(permanent)}
        y2={sy(0) + 47}
        className="dg-thin"
      />
      <Label x={sx(permanent / 2)} y={sy(0) + 52} className="dg-text-small dg-text-accent-2">
        permanent extension
      </Label>

      <MathLabel
        x={sx(6.35)}
        y={sy(7.0)}
        tex="\text{unloading is parallel to } F = kx"
        w={240}
        h={28}
        size="small"
      />
    </Svg>
  );
}

export default ElasticPlasticLoadingUnloading;
