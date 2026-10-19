/**
 * Translations of y = f(x), where f(x) = x² − 2x (vertex (1, −1), roots 0 and 2).
 * Left: y = f(x) + 3, translation by the vector (0, 3); the vertex moves to (1, 2).
 * Right: y = f(x + 2) = x² + 2x, translation by the vector (−2, 0); the vertex
 * moves to (−1, −1) and the roots to −2 and 0. Plus inside the bracket moves left.
 */
import { Label, Svg } from '../primitives';
import { ColVec, PLOT_H, PW, Panel, base, type PanelSpec } from './functions-transform-kit';

export const diagramKey = 'functions-translations';

const specs: PanelSpec[] = [
  {
    title: 'y = f(x) + 3',
    g: (x) => base(x) + 3,
    moves: [
      [1, -1, 1, 2],
      [2.9, base(2.9), 2.9, base(2.9) + 3],
    ],
    baseLabel: [3.15, 0.8, 'start'],
    imageLabel: [-0.4, 4.9, 'end'],
    imageText: 'f(x) + 3',
    footer: (
      <g>
        <Label x={110} y={28} anchor="end" className="dg-text">
          translation by
        </Label>
        <ColVec x={132} y={28} a="0" b="3" />
        <Label x={158} y={28} anchor="start" className="dg-text-muted">
          (up 3)
        </Label>
      </g>
    ),
  },
  {
    title: 'y = f(x + 2)',
    g: (x) => base(x + 2),
    moves: [
      [1, -1, -1, -1],
      [2, 0, 0, 0],
    ],
    baseLabel: [3.15, 0.8, 'start'],
    imageLabel: [-2.35, 3.6, 'start'],
    imageText: 'f(x + 2)',
    footer: (
      <g>
        <Label x={110} y={28} anchor="end" className="dg-text">
          translation by
        </Label>
        <ColVec x={136} y={28} a="−2" b="0" />
        <Label x={162} y={28} anchor="start" className="dg-text-muted">
          (left 2, not right!)
        </Label>
      </g>
    ),
  },
];

export default function FunctionsTranslations() {
  return (
    <Svg width={PW * 2} height={PLOT_H + 92}>
      {specs.map((s, i) => (
        <Panel key={s.title} spec={s} index={i} />
      ))}
    </Svg>
  );
}
