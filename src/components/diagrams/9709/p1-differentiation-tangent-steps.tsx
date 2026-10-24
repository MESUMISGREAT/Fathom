/**
 * The tangent-and-normal method as five numbered steps, worked for y = x² − 2x + 3 at x = 2
 * (the same curve and point as p1-differentiation-tangent-normal): (1) find the point (2, 3),
 * (2) differentiate: 2x − 2, (3) put x in: m = 2, (4) normal only: −1/m = −½ (highlighted, the step
 * people forget), (5) use y − y₁ = m(x − x₁). Bottom: tangent y = 2x − 1, normal x + 2y − 8 = 0.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p1-differentiation-tangent-steps';

const W = 640;
const ROW1 = 96;
const GAP = 54;
const NUM_X = 34;
const TEXT_X = 56;
const MATH_X = 476;
const KEY = 3; // index of the highlighted step

const STEPS: { text: string; tex: string }[] = [
  { text: 'Find the point', tex: 'y = 2^2 - 2(2) + 3 = 3 \\;\\to\\; (2, 3)' },
  { text: 'Differentiate', tex: '\\dfrac{dy}{dx} = 2x - 2' },
  { text: 'Put x in: the gradient', tex: 'm = 2(2) - 2 = 2' },
  { text: 'Normal? Flip and change sign', tex: '-\\dfrac{1}{m} = -\\dfrac{1}{2}' },
  { text: 'Put into the line', tex: 'y - y_1 = m(x - x_1)' },
];

const RULE = ROW1 + (STEPS.length - 1) * GAP + 32;
const H = RULE + 120;

export default function P1DifferentiationTangentSteps() {
  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={32} w={420} h={44} size="large" tex="y = x^2 - 2x + 3 \text{ at } x = 2" />
      <line x1={24} y1={62} x2={W - 24} y2={62} className="dg-grid" />

      {STEPS.map((s, i) => {
        const y = ROW1 + i * GAP;
        const key = i === KEY;
        return (
          <g key={s.text}>
            <circle cx={NUM_X} cy={y} r={12} className={key ? 'dg-accent-2 dg-fill-accent-2' : 'dg-thin dg-fill-muted'} />
            <Label x={NUM_X} y={y + 1} className="dg-text dg-bold">
              {String(i + 1)}
            </Label>
            <Label x={TEXT_X} y={y} anchor="start" className={key ? 'dg-text-accent-2 dg-bold' : 'dg-text'}>
              {s.text}
            </Label>
            <MathLabel x={MATH_X} y={y} w={300} h={48} size="large" tex={s.tex} />
          </g>
        );
      })}

      <line x1={24} y1={RULE} x2={W - 24} y2={RULE} className="dg-grid" />
      <MathLabel
        x={W / 2}
        y={RULE + 30}
        w={W - 40}
        h={40}
        size="large"
        tex="\text{Tangent: } y - 3 = 2(x - 2),\ \text{ so } y = 2x - 1"
      />
      <MathLabel
        x={W / 2}
        y={RULE + 84}
        w={W - 40}
        h={56}
        size="large"
        tex="\text{Normal: } y - 3 = -\dfrac{1}{2}(x - 2),\ \text{ so } x + 2y - 8 = 0"
      />
    </Svg>
  );
}
