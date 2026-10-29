/**
 * A simple inverse-graph diagram for y = e^x and y = ln x.
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'p2-logarithmic-exponential-graphs';

export default function P2LogarithmicExponentialGraphs() {
  const p = makePlot({ width: 420, height: 220, pad: 24, x: [-1, 4], y: [-2, 5] });
  return (
    <Svg width={560} height={250}>
      <g transform="translate(20, 10)">
        <line x1={p.sx(-1)} y1={p.sy(0)} x2={p.sx(4)} y2={p.sy(0)} className="dg-thin" />
        <line x1={p.sx(0)} y1={p.sy(-2)} x2={p.sx(0)} y2={p.sy(5)} className="dg-thin" />
        <path d={graph((x) => Math.exp(x), [-1, 2.8], p, [-2, 5], 200)} className="dg-accent" fill="none" strokeWidth={3} />
        <path d={graph((x) => Math.log(x), [0.12, 4], p, [-2, 5], 200)} className="dg-accent-2" fill="none" strokeWidth={3} />
        <path d={graph((x) => x, [-1, 4], p, [-2, 5], 200)} className="dg-muted" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
        <circle cx={p.sx(0)} cy={p.sy(1)} r={3.5} className="dg-dot-accent" />
        <circle cx={p.sx(1)} cy={p.sy(0)} r={3.5} className="dg-dot-accent-2" />
        <Label x={p.sx(0) - 8} y={p.sy(1) - 14} anchor="end" className="dg-text-small">
          (0, 1)
        </Label>
        <Label x={p.sx(1) + 8} y={p.sy(0) + 16} anchor="start" className="dg-text-small">
          (1, 0)
        </Label>
        <Label x={p.sx(4) + 10} y={p.sy(0) + 12} className="dg-text-small">x</Label>
        <Label x={p.sx(0) - 10} y={p.sy(5) - 8} className="dg-text-small">y</Label>
        <MathLabel x={120} y={28} tex="y = e^x" w={90} h={28} tone="accent" />
        <MathLabel x={260} y={28} tex="y = \ln x" w={100} h={28} tone="accent-2" />
        <MathLabel x={150} y={200} tex="y = x" w={60} h={24} tone="muted" />
      </g>
    </Svg>
  );
}
