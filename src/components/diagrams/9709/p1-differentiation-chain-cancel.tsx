/**
 * The chain rule as fractions that cancel: dy/du × du/dx = dy/dx, with both du's struck
 * through. Below, the three steps on an easy example, y = (2x + 1)², and a check by expanding.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p1-differentiation-chain-cancel';

const W = 620;
const H = 364;
const BOX_W = 182;
const BOX_H = 122;
const BOX_TOP = 186;
const GAP = 13;

const STEPS: { title: string; first: string; second: string }[] = [
  { title: '1. Name the inside', first: 'u = 2x + 1', second: '\\dfrac{du}{dx} = 2' },
  { title: '2. Do the outside', first: 'y = u^2', second: '\\dfrac{dy}{du} = 2u' },
  { title: '3. Multiply', first: '\\dfrac{dy}{dx} = 2u \\times 2', second: '= 4(2x + 1)' },
];

export default function P1DifferentiationChainCancel() {
  const left = (W - 3 * BOX_W - 2 * GAP) / 2;
  const du = '\\htmlClass{dg-k-accent}{\\cancel{du}}';
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text-muted">
        Treat them like fractions: the du&apos;s cancel
      </Label>
      <MathLabel
        x={W / 2}
        y={76}
        w={W - 40}
        h={70}
        size="large"
        tex={`\\dfrac{dy}{${du}} \\times \\dfrac{${du}}{dx} = \\dfrac{dy}{dx}`}
      />
      <Label x={W / 2} y={124} className="dg-text-muted">
        dy stays on top, dx stays on the bottom
      </Label>

      <line x1={30} y1={146} x2={W - 30} y2={146} className="dg-grid" />
      <MathLabel x={W / 2} y={168} w={W - 40} tex="\text{Example: } y = (2x + 1)^2" />

      {STEPS.map((s, i) => {
        const x = left + i * (BOX_W + GAP);
        const cx = x + BOX_W / 2;
        return (
          <g key={s.title}>
            <rect x={x} y={BOX_TOP} width={BOX_W} height={BOX_H} rx={12} className={i === 2 ? 'dg-accent dg-fill-accent' : 'dg-thin dg-fill-muted'} />
            <Label x={cx} y={BOX_TOP + 20} className={i === 2 ? 'dg-text-accent' : 'dg-text dg-bold'}>
              {s.title}
            </Label>
            <MathLabel x={cx} y={BOX_TOP + 54} w={BOX_W - 12} h={44} tex={s.first} />
            <MathLabel x={cx} y={BOX_TOP + 96} w={BOX_W - 12} h={44} tex={s.second} />
          </g>
        );
      })}

      <MathLabel
        x={W / 2}
        y={338}
        w={W - 40}
        tone="muted"
        tex="\text{Check by expanding: } (2x + 1)^2 = 4x^2 + 4x + 1 \;\Rightarrow\; 8x + 4 = 4(2x + 1)\ \checkmark"
      />
    </Svg>
  );
}
