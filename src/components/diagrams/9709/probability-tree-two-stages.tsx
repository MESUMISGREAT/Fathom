/**
 * A two-stage tree for drawing two counters without replacement from a bag of 4 red and
 * 6 blue. Branch probabilities use the bag that actually remains at that stage, which is
 * why the second-stage fractions differ between branches, and each final outcome is the
 * product along its own branch.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'probability-tree-two-stages';

const W = 580;
const H = 350;
const R = 17;

const root = { x: 56, y: 175 };
const l1 = {
  R: { x: 222, y: 94 },
  B: { x: 222, y: 256 },
};
const l2 = {
  RR: { x: 396, y: 48 },
  RB: { x: 396, y: 138 },
  BR: { x: 396, y: 212 },
  BB: { x: 396, y: 302 },
};

const frac = (a: number, b: number) => `\\dfrac{${a}}{${b}}`;

const products = [
  { at: l2.RR, tex: `${frac(4, 10)} \\times ${frac(3, 9)} = \\dfrac{2}{15}` },
  { at: l2.RB, tex: `${frac(4, 10)} \\times ${frac(6, 9)} = \\dfrac{4}{15}` },
  { at: l2.BR, tex: `${frac(6, 10)} \\times ${frac(4, 9)} = \\dfrac{4}{15}` },
  { at: l2.BB, tex: `${frac(6, 10)} \\times ${frac(5, 9)} = \\dfrac{1}{3}` },
];

export default function ProbabilityTreeTwoStages() {
  const branches: Array<{ a: { x: number; y: number }; b: { x: number; y: number }; tex: string }> = [
    { a: root, b: l1.R, tex: frac(4, 10) },
    { a: root, b: l1.B, tex: frac(6, 10) },
    { a: l1.R, b: l2.RR, tex: frac(3, 9) },
    { a: l1.R, b: l2.RB, tex: frac(6, 9) },
    { a: l1.B, b: l2.BR, tex: frac(4, 9) },
    { a: l1.B, b: l2.BB, tex: frac(5, 9) },
  ];

  return (
    <Svg width={W} height={H}>
      <Label x={root.x} y={root.y - 30} className="dg-text-small">
        start
      </Label>
      <Label x={150} y={16} className="dg-text-small">
        1st draw
      </Label>
      <Label x={310} y={16} className="dg-text-small">
        2nd draw
      </Label>

      {branches.map((br) => (
        <Arrow
          key={`${br.a.x}-${br.a.y}-${br.b.y}`}
          x1={br.a.x + (br.a === root ? 6 : R)}
          y1={br.a.y}
          x2={br.b.x - R - 2}
          y2={br.b.y}
          className="dg-thin"
          head={7}
        />
      ))}

      <MathLabel x={126} y={118} tex={frac(4, 10)} w={50} h={30} size="small" />
      <MathLabel x={126} y={232} tex={frac(6, 10)} w={50} h={30} size="small" />

      <MathLabel x={312} y={50} tex={frac(3, 9)} w={44} h={30} size="small" />
      <MathLabel x={318} y={137} tex={frac(6, 9)} w={44} h={30} size="small" />
      <MathLabel x={318} y={213} tex={frac(4, 9)} w={44} h={30} size="small" />
      <MathLabel x={312} y={300} tex={frac(5, 9)} w={44} h={30} size="small" />

      {(
        [
          [root, ''],
          [l1.R, 'R'],
          [l1.B, 'B'],
          [l2.RR, 'RR'],
          [l2.RB, 'RB'],
          [l2.BR, 'BR'],
          [l2.BB, 'BB'],
        ] as Array<[{ x: number; y: number }, string]>
      ).map(([p, label]) =>
        label === '' ? null : (
          <g key={`${p.x}-${p.y}`}>
            <circle cx={p.x} cy={p.y} r={R} className="dg-fill-muted dg-thin" />
            <Label x={p.x} y={p.y} className="dg-text-small">
              {label}
            </Label>
          </g>
        ),
      )}

      {products.map((p) => (
        <MathLabel
          key={p.tex}
          x={560}
          y={p.at.y}
          anchor="end"
          tex={p.tex}
          w={170}
          h={40}
          size="small"
          tone="muted"
        />
      ))}
    </Svg>
  );
}
