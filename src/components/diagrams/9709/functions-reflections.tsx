/**
 * Reflections of y = f(x), where f(x) = x² − 2x (vertex (1, −1), roots 0 and 2).
 * Left: y = −f(x) = −x² + 2x, reflection in the x-axis; the vertex goes to (1, 1).
 * Right: y = f(−x) = x² + 2x, reflection in the y-axis; the vertex goes to (−1, −1)
 * and the roots to 0 and −2.
 */
import { Label, Svg } from '../primitives';
import { FIG_H, PW, Panel, base, type PanelSpec } from './functions-transform-kit';

export const diagramKey = 'functions-reflections';

const specs: PanelSpec[] = [
  {
    title: 'y = −f(x)',
    g: (x) => -base(x),
    moves: [
      [1, -1, 1, 1],
      [2.6, base(2.6), 2.6, -base(2.6)],
    ],
    baseLabel: [3.15, 0.8, 'start'],
    imageLabel: [-1.2, -1.7, 'end'],
    imageText: '−f(x)',
    // Both curves cross the axis at 2 (no free side for a label there), and the arrow at
    // x = 1 crosses the axis, so that label is shifted right.
    xTicks: [-2, -1, 1, 3],
    xTickNudge: [[1, 10]],
    yTicks: [2, 4],
    yTicksRight: [-2],
    hideOrigin: true,
    footer: (
      <Label x={150} y={22} className="dg-text">
        reflection in the x-axis
      </Label>
    ),
  },
  {
    title: 'y = f(−x)',
    g: (x) => base(-x),
    moves: [[1, -1, -1, -1]],
    baseLabel: [3.15, 0.8, 'start'],
    imageLabel: [-3.0, -1.75, 'start'],
    imageText: 'f(−x)',
    xTickNudge: [
      [-2, -8],
      [2, 8],
    ],
    hideOrigin: true,
    footer: (
      <Label x={150} y={22} className="dg-text">
        reflection in the y-axis
      </Label>
    ),
  },
];

export default function FunctionsReflections() {
  return (
    <Svg width={PW * 2} height={FIG_H}>
      {specs.map((s, i) => (
        <Panel key={s.title} spec={s} index={i} />
      ))}
    </Svg>
  );
}
