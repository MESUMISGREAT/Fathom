/**
 * Horizontal line test on f(x) = (x − 2)² − 1.
 * Left: domain x ∈ ℝ. The line y = 3 meets the curve at x = 0 and x = 4, so f is many-one.
 * Right: domain x ≥ 2 (from the vertex rightwards). Every horizontal line meets the
 * curve at most once (y = 3 only at x = 4), so f is one-one. Same scale in both panels.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'functions-horizontal-line-test';

const PW = 300;
const W = PW * 2;
const H = 360;
const X: [number, number] = [-1.4, 5.4];
const Y: [number, number] = [-2.2, 6.4];
const f = (x: number) => (x - 2) ** 2 - 1;

const panels = [
  { title: 'domain x ∈ ℝ: many-one', from: X[0], hits: [0, 4], cls: 'dg-text-accent-2' },
  { title: 'domain x ≥ 2: one-one', from: 2, hits: [4], cls: 'dg-text-accent' },
];

export default function FunctionsHorizontalLineTest() {
  const p = makePlot({ width: PW, height: 300, pad: 26, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      {panels.map((k, i) => (
        <g key={k.title} transform={`translate(${i * PW}, 0)`}>
          {i > 0 && <line x1={0} y1={8} x2={0} y2={H - 8} className="dg-grid" />}
          <Label x={PW / 2} y={20} className={k.cls}>
            {k.title}
          </Label>
          <g transform="translate(0, 40)">
            <Grid p={p} />
            <AxesXY p={p} xTicks={[2, 4]} yTicks={[2, 6]} yTicksRight={[4]} />
            {/* the curve crosses the x-axis at 1 and 3, so those labels sit to the side it isn't on */}
            {[1, 3].map((t) => (
              <line key={t} x1={p.sx(t)} y1={p.sy(0) - 4} x2={p.sx(t)} y2={p.sy(0) + 4} className="dg-thin" />
            ))}
            <Label x={p.sx(1) - 7} y={p.sy(0) + 15} anchor="end" className="dg-text-small">
              1
            </Label>
            <Label x={p.sx(3) + 7} y={p.sy(0) + 15} anchor="start" className="dg-text-small">
              3
            </Label>
            {i === 1 && <path d={graph(f, [X[0], 2], p, Y)} className="dg-muted dg-dashed" />}
            <path d={graph(f, [k.from, X[1]], p, Y)} className={i === 0 ? 'dg-accent-2' : 'dg-accent'} />
            <line x1={p.sx(X[0])} y1={p.sy(3)} x2={p.sx(X[1])} y2={p.sy(3)} className="dg-line dg-dashed" />
            <Label x={p.sx(X[1]) - 2} y={p.sy(3) - 11} anchor="end" className="dg-text-small">
              y = 3
            </Label>
            {k.hits.map((h) => (
              <circle key={h} cx={p.sx(h)} cy={p.sy(3)} r={5} className="dg-dot" />
            ))}
            {i === 1 && <circle cx={p.sx(2)} cy={p.sy(-1)} r={4.5} className="dg-dot-accent" />}
          </g>
          <Label x={PW / 2} y={H - 14} className="dg-text-small">
            {i === 0 ? 'y = 3 meets the curve twice: f(0) = f(4) = 3' : 'every horizontal line meets it at most once'}
          </Label>
        </g>
      ))}
    </Svg>
  );
}
