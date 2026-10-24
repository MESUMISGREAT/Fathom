/**
 * Integration undoes differentiation. Top: x³ + c and 3x² in two boxes, with an arrow
 * "differentiate" going right and an arrow "integrate" coming back. Below: a rule table of
 * five integrals (x², 4x³, 5, 1/x², √x), each worked as "add 1 to the power, divide by the new power, + c".
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p1-integration-reverse-rule';

const W = 640;
const BOX_Y = 92;
const LEFT_X = 150;
const RIGHT_X = 490;
const TABLE_TOP = 214;
const ROW = 56;
const COL1 = 150;
const COL2 = 430;

const ROWS: { from: string; to: string }[] = [
  { from: 'x^2', to: '\\dfrac{x^3}{3} + c' },
  { from: '4x^3', to: '\\dfrac{4x^4}{4} + c = x^4 + c' },
  { from: '5 = 5x^0', to: '\\dfrac{5x^1}{1} + c = 5x + c' },
  { from: '\\dfrac{1}{x^2} = x^{-2}', to: '\\dfrac{x^{-1}}{-1} + c = -\\dfrac{1}{x} + c' },
  { from: '\\sqrt{x} = x^{\\frac12}', to: '\\dfrac{x^{\\frac32}}{\\frac32} + c = \\dfrac{2}{3}x^{\\frac32} + c' },
];

export default function P1IntegrationReverseRule() {
  const H = TABLE_TOP + ROWS.length * ROW + 30;
  return (
    <Svg width={W} height={H}>
      {/* the two boxes */}
      <rect x={LEFT_X - 80} y={BOX_Y - 28} width={160} height={56} rx={10} className="dg-accent dg-fill-accent" />
      <rect x={RIGHT_X - 80} y={BOX_Y - 28} width={160} height={56} rx={10} className="dg-thin dg-fill-muted" />
      <MathLabel x={LEFT_X} y={BOX_Y} w={150} h={44} size="large" tex="x^3 + c" />
      <MathLabel x={RIGHT_X} y={BOX_Y} w={150} h={44} size="large" tex="3x^2" />

      {/* differentiate: left to right, above */}
      <Arrow x1={LEFT_X + 70} y1={BOX_Y - 42} x2={RIGHT_X - 70} y2={BOX_Y - 42} className="dg-thin" />
      <Label x={W / 2} y={BOX_Y - 60} className="dg-text">
        differentiate: power down, take one off
      </Label>
      {/* integrate: right to left, below */}
      <Arrow x1={RIGHT_X - 70} y1={BOX_Y + 42} x2={LEFT_X + 70} y2={BOX_Y + 42} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={W / 2} y={BOX_Y + 62} className="dg-text-accent">
        integrate: add one to the power, divide by the new power
      </Label>
      <Label x={W / 2} y={BOX_Y + 88} className="dg-text-small">
        the constant c vanishes when you differentiate, so put it back when you integrate
      </Label>

      {/* rule table */}
      <line x1={24} y1={TABLE_TOP - 16} x2={W - 24} y2={TABLE_TOP - 16} className="dg-grid" />
      <Label x={COL1} y={TABLE_TOP + 2} className="dg-text dg-bold">
        Integrate this
      </Label>
      <Label x={COL2} y={TABLE_TOP + 2} className="dg-text dg-bold">
        You get
      </Label>
      {ROWS.map((r, i) => {
        const y = TABLE_TOP + 42 + i * ROW;
        return (
          <g key={r.from}>
            <line x1={24} y1={y - ROW / 2} x2={W - 24} y2={y - ROW / 2} className="dg-grid" />
            <MathLabel x={COL1} y={y} w={230} h={50} size="large" tex={r.from} />
            <Arrow x1={COL1 + 105} y1={y} x2={COL1 + 140} y2={y} className="dg-thin" head={7} />
            <MathLabel x={COL2} y={y} w={330} h={52} size="large" tex={r.to} />
          </g>
        );
      })}
    </Svg>
  );
}
