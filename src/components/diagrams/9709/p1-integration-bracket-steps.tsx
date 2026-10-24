/**
 * Integrating a bracket (ax + b)ⁿ in four numbered steps, on ∫(2x + 1)² dx:
 * (1) add 1 to the power, bracket stays the same: (2x + 1)³; (2) divide by the new power, 3;
 * (3) divide by 2, the number in front of x (highlighted, the step people forget): (2x + 1)³/6;
 * (4) + c. Bottom line checks it with the chain rule.
 */
import { MathLabel, Svg } from '../primitives';
import { StepRows } from './p1-integration-kit';

export const diagramKey = 'p1-integration-bracket-steps';

const W = 640;
const ROW1 = 100;
const GAP = 62;
const a = '\\htmlClass{dg-k-accent-2}{2}';

const STEPS = [
  { text: 'Add 1 to the power, bracket the same', tex: '(2x + 1)^3' },
  { text: 'Divide by the new power', tex: '\\dfrac{(2x + 1)^3}{3}' },
  { text: 'Divide by the number in front of x', tex: `\\dfrac{(2x + 1)^3}{3 \\times ${a}} = \\dfrac{(2x + 1)^3}{6}` },
  { text: 'Add + c', tex: '\\dfrac{(2x + 1)^3}{6} + c' },
];

export default function P1IntegrationBracketSteps() {
  const rule = ROW1 + (STEPS.length - 1) * GAP + 36;
  const H = rule + 70;
  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={34} w={300} h={48} size="large" tex={`\\int (${a}x + 1)^2 \\, dx`} />
      <line x1={24} y1={66} x2={W - 24} y2={66} className="dg-grid" />
      <StepRows steps={STEPS} top={ROW1} gap={GAP} keyIndex={2} mathX={478} mathW={300} mathH={54} />
      <line x1={24} y1={rule} x2={W - 24} y2={rule} className="dg-grid" />
      <MathLabel
        x={W / 2}
        y={rule + 36}
        w={W - 30}
        h={52}
        tone="muted"
        tex="\text{Check (chain rule): } \dfrac{d}{dx}\,\dfrac{(2x + 1)^3}{6} = \dfrac{3(2x + 1)^2 \times 2}{6} = (2x + 1)^2\ \checkmark"
      />
    </Svg>
  );
}
