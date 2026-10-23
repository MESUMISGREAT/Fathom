/**
 * Building y = 2f(x) − 3 from y = f(x), where f(x) = x² − 2x, in two steps.
 * Step 1, stretch parallel to the y-axis with factor 2: y = 2f(x) (dashed), vertex (1, −1) → (1, −2).
 * Step 2, translation by (0, −3): y = 2f(x) − 3, vertex (1, −2) → (1, −5); the root
 * (2, 0) is unmoved by step 1 and then goes to (2, −3).
 */
import { Arrow, Label, Svg, graph } from '../primitives';
import { AxesXY, Grid, makePlot } from './kit';

export const diagramKey = 'functions-combined-sequence';

const W = 540;
const PH = 420;
const H = PH + 70;
const X: [number, number] = [-2.3, 4.3];
const Y: [number, number] = [-5.9, 5.2];
const f = (x: number) => x * x - 2 * x;

export default function FunctionsCombinedSequence() {
  const p = makePlot({ width: W, height: PH, pad: 30, x: X, y: Y });
  const lx = p.sx(-2.15);
  const ly = p.sy(-3.6);
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      <AxesXY p={p} xTicks={[-2, -1, 3, 4]} yTicks={[-4, 2, 4]} yTicksRight={[-2]} />
      <path d={graph(f, X, p, Y)} className="dg-line" />
      <path d={graph((x) => 2 * f(x), X, p, Y)} className="dg-muted dg-dashed" />
      <path d={graph((x) => 2 * f(x) - 3, X, p, Y)} className="dg-accent" />

      <circle cx={p.sx(1)} cy={p.sy(-1)} r={4} className="dg-dot" />
      <Arrow x1={p.sx(1)} y1={p.sy(-1)} x2={p.sx(1)} y2={p.sy(-2)} head={8} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={p.sx(1)} y1={p.sy(-2)} x2={p.sx(1)} y2={p.sy(-5)} head={9} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <circle cx={p.sx(1)} cy={p.sy(-5)} r={4.5} className="dg-dot-accent" />
      <Label x={p.sx(1) + 10} y={p.sy(-1.5)} anchor="start" className="dg-text-small dg-bold">
        ①
      </Label>
      <Label x={p.sx(1) + 10} y={p.sy(-3.6)} anchor="start" className="dg-text-small dg-bold">
        ②
      </Label>
      <Label x={p.sx(1) + 12} y={p.sy(-5.25)} anchor="start" className="dg-text-small">
        (1, −5)
      </Label>

      <circle cx={p.sx(2)} cy={p.sy(0)} r={4} className="dg-dot" />
      <Arrow x1={p.sx(2)} y1={p.sy(0)} x2={p.sx(2)} y2={p.sy(-3)} head={9} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={p.sx(2) + 10} y={p.sy(-3.1)} anchor="start" className="dg-text-small">
        (2, −3)
      </Label>

      {/* legend */}
      <g>
        <line x1={lx} y1={ly} x2={lx + 28} y2={ly} className="dg-line" />
        <Label x={lx + 36} y={ly} anchor="start" className="dg-text-small">
          y = f(x)
        </Label>
        <line x1={lx} y1={ly + 20} x2={lx + 28} y2={ly + 20} className="dg-muted dg-dashed" />
        <Label x={lx + 36} y={ly + 20} anchor="start" className="dg-text-small">
          y = 2f(x)
        </Label>
        <line x1={lx} y1={ly + 40} x2={lx + 28} y2={ly + 40} className="dg-accent" />
        <Label x={lx + 36} y={ly + 40} anchor="start" className="dg-text-accent">
          y = 2f(x) − 3
        </Label>
      </g>

      <Label x={W / 2} y={PH + 12} className="dg-text">
        ① stretch parallel to the y-axis, factor 2
      </Label>
      <Label x={W / 2} y={PH + 36} className="dg-text">
        ② then translation by 3 units in the negative y-direction
      </Label>
    </Svg>
  );
}
