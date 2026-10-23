/**
 * The chain rule as one extra step, on y = (2x + 1)²: (1) bring the power down (one off the power)
 * and keep the box (2x + 1) the same, (2) find the derivative of the box (2), (3) multiply: 4(2x + 1).
 * Last line checks it by expanding.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p1-differentiation-chain-box';

const W = 600;
const H = 330;
const ROW1 = 104;
const GAP = 58;
const NUM_X = 34;
const TEXT_X = 56;
const MATH_X = 450;

const box = (s: string) => `\\htmlClass{dg-k-accent}{\\boxed{${s}}}`;
const two = '\\htmlClass{dg-k-accent-2}{2}';

const STEPS: { text: string; tex: string }[] = [
  { text: 'Power down, box stays the same', tex: `2\\big(\\,${box('2x + 1')}\\,\\big)^1` },
  { text: 'Derivative of the box', tex: `2x + 1 \\;\\to\\; ${two}` },
  { text: 'Multiply them', tex: `2(2x + 1) \\times ${two} = 4(2x + 1)` },
];

export default function P1DifferentiationChainBox() {
  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={34} w={300} h={48} size="large" tex={`y = \\big(\\,${box('2x + 1')}\\,\\big)^2`} />
      <line x1={24} y1={68} x2={W - 24} y2={68} className="dg-grid" />

      {STEPS.map((s, i) => {
        const y = ROW1 + i * GAP;
        return (
          <g key={s.text}>
            <circle cx={NUM_X} cy={y} r={12} className={i === 2 ? 'dg-accent-2 dg-fill-accent-2' : 'dg-thin dg-fill-muted'} />
            <Label x={NUM_X} y={y + 1} className="dg-text dg-bold">
              {String(i + 1)}
            </Label>
            <Label x={TEXT_X} y={y} anchor="start" className={i === 2 ? 'dg-text-accent-2' : 'dg-text'}>
              {s.text}
            </Label>
            <MathLabel x={MATH_X} y={y} w={270} h={44} size="large" tex={s.tex} />
          </g>
        );
      })}

      <line x1={24} y1={ROW1 + 2 * GAP + 34} x2={W - 24} y2={ROW1 + 2 * GAP + 34} className="dg-grid" />
      <MathLabel
        x={W / 2}
        y={ROW1 + 2 * GAP + 72}
        w={W - 30}
        h={48}
        tone="muted"
        tex="\text{Check by expanding: } y = 4x^2 + 4x + 1,\ \text{so } \dfrac{dy}{dx} = 8x + 4 = 4(2x + 1)\ \checkmark"
      />
    </Svg>
  );
}
