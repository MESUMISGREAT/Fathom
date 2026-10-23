/**
 * Stretches of y = f(x), where f(x) = x² − 2x (vertex (1, −1), roots 0 and 2).
 * Left: y = 2f(x), stretch parallel to the y-axis, factor 2. Heights double, so the
 * vertex goes to (1, −2) and the roots stay at 0 and 2.
 * Right: y = f(2x) = 4x² − 4x, stretch parallel to the x-axis, factor ½. Distances from
 * the y-axis halve, so the vertex goes to (0.5, −1) and the roots to 0 and 1.
 */
import { Label, Svg, MathLabel } from '../primitives';
import { FIG_H, PW, Panel, base, type PanelSpec } from './functions-transform-kit';

export const diagramKey = 'functions-stretches';

const specs: PanelSpec[] = [
  {
    title: 'y = 2f(x)',
    g: (x) => 2 * base(x),
    moves: [
      [1, -1, 1, -2],
      [-0.5, base(-0.5), -0.5, 2 * base(-0.5)],
    ],
    baseLabel: [3.15, 0.8, 'start'],
    imageLabel: [0.5, 4.9, 'start'],
    imageText: '2f(x)',
    xTickNudge: [[2, 8]],
    yTicks: [-2],
    yTicksRight: [2, 4],
    footer: (
      <Label x={150} y={22} className="dg-text">
        stretch parallel to the y-axis, factor 2
      </Label>
    ),
  },
  {
    title: 'y = f(2x)',
    g: (x) => base(2 * x),
    moves: [
      [1, -1, 0.5, -1],
      [3, 3, 1.5, 3],
      [-1, 3, -0.5, 3],
    ],
    baseLabel: [3.15, 0.8, 'start'],
    imageLabel: [0.18, 4.75, 'start'],
    imageText: 'f(2x)',
    xTickNudge: [
      [1, 8],
      [2, 8],
    ],
    yTicks: [-2, 4],
    yTicksRight: [2],
    footer: (
      <MathLabel x={150} y={22} w={420} h={46} tex={"\\text{stretch parallel to the } x\\text{-axis, factor } \\dfrac{1}{2}"} />
    ),
  },
];

export default function FunctionsStretches() {
  return (
    <Svg width={PW * 2} height={FIG_H}>
      {specs.map((s, i) => (
        <Panel key={s.title} spec={s} index={i} />
      ))}
    </Svg>
  );
}
