/**
 * Counting the roots of x(x − 3)² = k with the line y = k. The curve has a maximum at (1, 4) and
 * a minimum at (3, 0). Dashed lines y = 5, 4, 2, 0 (the x-axis) and −1 meet it 1, 2, 3, 2 and 1
 * times; dots mark every meeting point (computed from the real roots). The two stationary values,
 * 4 and 0, are where the count changes.
 */
import { Label, MathLabel, Svg, graph } from '../primitives';
import { AxesXY, makePlot } from './kit';

export const diagramKey = 'p1-differentiation-count-roots';

const W = 610;
const H = 400;
const PLOT_W = 404;
const X: [number, number] = [-0.9, 4.6];
const Y: [number, number] = [-2.2, 6.6];
const f = (x: number) => x * (x - 3) ** 2;

/** Each line y = k, where it meets the curve (real roots of x³ − 6x² + 9x − k), and the count. */
const LINES: { k: number; xs: number[]; text: string; three?: boolean }[] = [
  { k: 5, xs: [4.1038], text: 'k = 5:\\ \\text{1 root}' },
  { k: 4, xs: [1, 4], text: 'k = 4:\\ \\text{2 roots (touches)}' },
  { k: 2, xs: [0.26795, 2, 3.73205], text: 'k = 2:\\ \\text{3 roots}', three: true },
  { k: 0, xs: [0, 3], text: 'k = 0:\\ \\text{2 roots (touches)}' },
  { k: -1, xs: [-0.1038], text: 'k = -1:\\ \\text{1 root}' },
];

export default function P1DifferentiationCountRoots() {
  const p = makePlot({ width: PLOT_W, height: H, pad: 34, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      <AxesXY p={p} />
      {LINES.map((l) => (
        <line
          key={`l${l.k}`}
          x1={p.sx(X[0])}
          y1={p.sy(l.k)}
          x2={p.sx(X[1])}
          y2={p.sy(l.k)}
          className={l.three ? 'dg-accent-2 dg-dashed' : 'dg-muted dg-dashed'}
        />
      ))}

      <path d={graph(f, X, p, Y)} className="dg-accent" />

      {LINES.flatMap((l) =>
        l.xs.map((x) => <circle key={`d${l.k}-${x}`} cx={p.sx(x)} cy={p.sy(l.k)} r={4.5} className="dg-dot-accent-2" />),
      )}

      <Label x={p.sx(1)} y={p.sy(4) - 18} className="dg-text-small">
        maximum (1, 4)
      </Label>
      <Label x={p.sx(3)} y={p.sy(0) + 18} className="dg-text-small">
        minimum (3, 0)
      </Label>
      <MathLabel x={p.sx(2.1)} y={p.sy(6.1)} w={150} h={30} tex="y = x(x - 3)^2" />

      <Label x={PLOT_W + 4} y={p.sy(6.1)} anchor="start" className="dg-text-muted">
        count the meeting points
      </Label>
      {LINES.map((l) => (
        <MathLabel
          key={`t${l.k}`}
          x={PLOT_W + 4}
          y={p.sy(l.k)}
          anchor="start"
          w={W - PLOT_W - 8}
          h={28}
          tone={l.three ? 'accent-2' : undefined}
          tex={l.text}
        />
      ))}
    </Svg>
  );
}
