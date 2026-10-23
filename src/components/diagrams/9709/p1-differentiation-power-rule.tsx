/**
 * The power rule as a table, not a graph: for x², x³, x⁵ and x^½, the power (accent colour)
 * comes down in front and one is taken off it (second accent), giving 2x, 3x², 5x⁴ and ½x^(−½).
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p1-differentiation-power-rule';

const W = 480;
const COL_Y = 64; // function
const COL_STEP = 244; // power down, one off
const COL_D = 404; // derivative
const TOP = 70;
const ROW = 60;
// \Large keeps the small powers (especially the ½) readable when the diagram shrinks on a phone.
const BIG = '\\Large ';

const a = (s: string) => `\\htmlClass{dg-k-accent}{${s}}`;
const b = (s: string) => `\\htmlClass{dg-k-accent-2}{${s}}`;

const ROWS: { fn: string; step: string; result: string }[] = [
  { fn: `x^{${a('2')}}`, step: `${a('2')}\\,x^{2 ${b('- 1')}}`, result: '2x' },
  { fn: `x^{${a('3')}}`, step: `${a('3')}\\,x^{3 ${b('- 1')}}`, result: '3x^2' },
  { fn: `x^{${a('5')}}`, step: `${a('5')}\\,x^{5 ${b('- 1')}}`, result: '5x^4' },
  {
    fn: `x^{${a('\\frac12')}}`,
    step: `${a('\\tfrac12')}\\,x^{\\frac12 ${b('- 1')}}`,
    result: '\\tfrac12 x^{-\\frac12}',
  },
];

export default function P1DifferentiationPowerRule() {
  const H = TOP - 22 + ROWS.length * ROW + 10;
  return (
    <Svg width={W} height={H}>
      <MathLabel x={COL_Y} y={24} w={60} tone="muted" size="large" tex="y" />
      <Label x={COL_STEP} y={14} className="dg-text-accent">
        bring the power down
      </Label>
      <Label x={COL_STEP} y={34} className="dg-text-accent-2">
        then take one off it
      </Label>
      <MathLabel x={COL_D} y={24} w={110} h={40} tone="muted" tex="\dfrac{dy}{dx}" />
      <line x1={24} y1={TOP - 22} x2={W - 24} y2={TOP - 22} className="dg-grid" />

      {ROWS.map((r, i) => {
        const y = TOP + i * ROW + ROW / 2 - 22;
        return (
          <g key={r.result}>
            <MathLabel x={COL_Y} y={y} w={100} h={56} size="large" tex={BIG + r.fn} />
            <Arrow x1={COL_Y + 40} y1={y} x2={COL_STEP - 62} y2={y} head={7} className="dg-thin" />
            <MathLabel x={COL_STEP} y={y} w={130} h={56} size="large" tex={BIG + r.step} />
            <MathLabel x={COL_D} y={y} w={140} h={56} size="large" tex={`${BIG}= ${r.result}`} />
            {i < ROWS.length - 1 && <line x1={24} y1={y + ROW / 2} x2={W - 24} y2={y + ROW / 2} className="dg-grid" />}
          </g>
        );
      })}
    </Svg>
  );
}
