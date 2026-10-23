/**
 * Building y = f(2x + 2) from y = f(x), where f(x) = x² − 2x, in two steps.
 * Step 1, translation by (−2, 0): y = f(x + 2) = x² + 2x (dashed), vertex (1, −1) → (−1, −1).
 * Step 2, stretch parallel to the x-axis with factor ½: y = f(2x + 2) = 4x² + 4x,
 * vertex (−1, −1) → (−½, −1). The point (3, 3) goes (3, 3) → (1, 3) → (½, 3).
 * Inside the bracket the steps run "add 2 first, then double", so undoing them on
 * the x-coordinate means translate first, then stretch.
 */
import { Arrow, Label, Svg, graph } from '../primitives';
import { Grid, makePlot } from './kit';

export const diagramKey = 'functions-combined-inside';

const W = 540;
const PH = 420;
const H = PH + 70;
const X: [number, number] = [-3.4, 3.6];
const Y: [number, number] = [-2.3, 5.2];
const f = (x: number) => x * x - 2 * x;

export default function FunctionsCombinedInside() {
  const p = makePlot({ width: W, height: PH, pad: 30, x: X, y: Y });
  const step = (x1: number, y1: number, x2: number, y2: number) => (
    <Arrow
      x1={p.sx(x1)}
      y1={p.sy(y1)}
      x2={p.sx(x2)}
      y2={p.sy(y2)}
      head={8}
      className="dg-accent-2"
      headClassName="dg-dot-accent-2"
    />
  );
  const lx = p.sx(1.55);
  const ly = p.sy(-1.05);
  return (
    <Svg width={W} height={H}>
      <Grid p={p} />
      {/* axes drawn here (not kit's AxesXY) so there is no "O" under the three curves through the origin */}
      <Arrow x1={p.sx(X[0])} y1={p.sy(0)} x2={p.sx(X[1]) + 8} y2={p.sy(0)} className="dg-thin" head={8} />
      <Arrow x1={p.sx(0)} y1={p.sy(Y[0])} x2={p.sx(0)} y2={p.sy(Y[1]) - 8} className="dg-thin" head={8} />
      <Label x={p.sx(X[1]) + 8} y={p.sy(0) + 15} className="dg-text dg-italic">
        x
      </Label>
      <Label x={p.sx(0) - 13} y={p.sy(Y[1]) - 6} className="dg-text dg-italic">
        y
      </Label>
      {/* no tick label at −2: the dashed curve passes through it */}
      {[-3, 2, 3].map((t) => (
        <g key={`xt${t}`}>
          <line x1={p.sx(t)} y1={p.sy(0) - 4} x2={p.sx(t)} y2={p.sy(0) + 4} className="dg-thin" />
          {/* the curve crosses the axis at 2, so that label sits just to the right */}
          <Label x={p.sx(t) + (t === 2 ? 8 : 0)} y={p.sy(0) + 15} className="dg-text-small">
            {t < 0 ? `−${-t}` : `${t}`}
          </Label>
        </g>
      ))}
      {[2, 4].map((t) => (
        <g key={`yt${t}`}>
          <line x1={p.sx(0) - 4} y1={p.sy(t)} x2={p.sx(0) + 4} y2={p.sy(t)} className="dg-thin" />
          <Label x={p.sx(0) - 8} y={p.sy(t)} anchor="end" className="dg-text-small">
            {t}
          </Label>
        </g>
      ))}
      <path d={graph(f, X, p, Y)} className="dg-line" />
      <path d={graph((x) => f(x + 2), X, p, Y)} className="dg-muted dg-dashed" />
      <path d={graph((x) => f(2 * x + 2), X, p, Y)} className="dg-accent" />

      {/* the three vertices, (1, −1) → (−1, −1) → (−½, −1), as dots only (arrows along one row would overlap) */}
      <circle cx={p.sx(1)} cy={p.sy(-1)} r={4} className="dg-dot" />
      <circle cx={p.sx(-1)} cy={p.sy(-1)} r={4} className="dg-dot" />
      <circle cx={p.sx(-0.5)} cy={p.sy(-1)} r={4.5} className="dg-dot-accent" />
      <Label x={p.sx(1)} y={p.sy(-1) + 17} className="dg-text-small">
        (1, −1)
      </Label>
      <Label x={p.sx(-1) - 8} y={p.sy(-1) + 17} anchor="end" className="dg-text-small dg-text-muted">
        (−1, −1)
      </Label>
      <Label x={p.sx(-0.58)} y={p.sy(-1) + 34} className="dg-text-accent">
        (−½, −1)
      </Label>

      {/* the point (3, 3): → (1, 3) → (½, 3) */}
      <circle cx={p.sx(3)} cy={p.sy(3)} r={4} className="dg-dot" />
      {step(3, 3, 1, 3)}
      {step(1, 3, 0.5, 3)}
      <circle cx={p.sx(0.5)} cy={p.sy(3)} r={4.5} className="dg-dot-accent" />
      <Label x={p.sx(2.2)} y={p.sy(3) - 14} className="dg-text-small dg-bold">
        ①
      </Label>
      <Label x={p.sx(0.75)} y={p.sy(3) - 14} className="dg-text-small dg-bold">
        ②
      </Label>
      <Label x={p.sx(3) + 9} y={p.sy(3) + 1} anchor="start" className="dg-text-small">
        (3, 3)
      </Label>

      {/* legend, in the empty lower right */}
      <g>
        <line x1={lx} y1={ly} x2={lx + 28} y2={ly} className="dg-line" />
        <Label x={lx + 36} y={ly} anchor="start" className="dg-text-small">
          y = f(x)
        </Label>
        <line x1={lx} y1={ly + 20} x2={lx + 28} y2={ly + 20} className="dg-muted dg-dashed" />
        <Label x={lx + 36} y={ly + 20} anchor="start" className="dg-text-small">
          y = f(x + 2)
        </Label>
        <line x1={lx} y1={ly + 40} x2={lx + 28} y2={ly + 40} className="dg-accent" />
        <Label x={lx + 36} y={ly + 40} anchor="start" className="dg-text-accent">
          y = f(2x + 2)
        </Label>
      </g>

      <Label x={W / 2} y={PH + 12} className="dg-text">
        ① translation by 2 units in the negative x-direction
      </Label>
      <Label x={W / 2} y={PH + 36} className="dg-text">
        ② then stretch parallel to the x-axis, factor ½
      </Label>
    </Svg>
  );
}
