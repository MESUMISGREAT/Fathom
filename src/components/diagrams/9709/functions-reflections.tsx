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
    xTicks: [-2, -1, 2, 3],
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
