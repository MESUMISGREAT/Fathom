/**
 * Load against extension for a wire that obeys Hooke's law up to 6 N, then curves over. The dashed
 * line shows where the proportional behaviour would have continued, so the departure is visible.
 */
import { Label, MathLabel, Svg, axes, graph } from '../primitives';

export const diagramKey = 'phys-stress-strain-force-extension-graph';

const W = 540;
const H = 400;
const PAD = 54;

const { sx, sy } = axes({ width: W, height: H, pad: PAD, x: [0, 10], y: [0, 10] });

const proportional = (x: number) => x;
const actual = (x: number) => (x <= 6 ? x : 6 + 3 * (1 - Math.exp(-(x - 6) / 4)));

export function StressStrainForceExtensionGraph() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        Load against extension
      </Label>

      {/* axes */}
      <line x1={sx(0)} y1={sy(0)} x2={sx(10)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(10)} className="dg-line" />

      <Label x={sx(10)} y={sy(0) + 30} anchor="end" className="dg-text-small dg-text-muted">
        extension
      </Label>
      <Label x={sx(0) - 14} y={sy(9.4)} anchor="end" className="dg-text-small dg-text-muted">
        load F
      </Label>

      {/* gridlines at whole numbers */}
      {[2, 4, 6, 8].map((t) => (
        <g key={t}>
          <line x1={sx(0)} y1={sy(t)} x2={sx(10)} y2={sy(t)} className="dg-muted dg-dashed" />
          <Label x={sx(0) - 8} y={sy(t)} anchor="end" className="dg-text-small dg-text-muted">
            {t}
          </Label>
          <line x1={sx(t)} y1={sy(0)} x2={sx(t)} y2={sy(0) + 5} className="dg-muted" />
          <Label x={sx(t)} y={sy(0) + 16} className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}

      {/* dashed continuation of the straight part */}
      <path d={graph(proportional, [0, 10], { sx, sy }, [0, 10])} className="dg-muted dg-dashed" />

      {/* the real curve */}
      <path d={graph(actual, [0, 10], { sx, sy }, [0, 10])} className="dg-accent" strokeWidth={2.5} />

      {/* limit of proportionality */}
      <circle cx={sx(6)} cy={sy(6)} r={5} className="dg-dot-accent" />
      <line x1={sx(6)} y1={sy(6)} x2={sx(6)} y2={sy(0)} className="dg-muted dg-dashed" />
      <line x1={sx(6.05)} y1={sy(5.9)} x2={sx(6.5)} y2={sy(3.8)} className="dg-thin" />
      <Label x={sx(6.6)} y={sy(3.4)} anchor="start" className="dg-text-small dg-text-accent">
        limit of proportionality
      </Label>

      <Label x={sx(2.2)} y={sy(1.3)} anchor="start" className="dg-text-small dg-text-muted">
        straight: F = kx
      </Label>
      <Label x={sx(9.6)} y={sy(5.4)} anchor="end" className="dg-text-small dg-text-muted">
        curves over
      </Label>

      <MathLabel x={W / 2} y={H - 12} tex="\text{gradient of the straight part} = k" w={300} h={26} size="small" />
    </Svg>
  );
}

export default StressStrainForceExtensionGraph;
