/**
 * Three arrow (mapping) diagrams side by side:
 *   one-one   x ↦ 2x   on {1, 2, 3}    (a function)
 *   many-one  x ↦ x²   on {−2, 2, 3}   (a function: −2 and 2 share the output 4)
 *   one-many  x ↦ ±√x  on {4, 9}       (not a function: each input has two outputs)
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'functions-mapping-types';

const PW = 210;
const W = PW * 3;
const H = 300;
const LX = 58;
const RX = 152;
const CY = 160;

interface Panel {
  title: string;
  verdict: string;
  ok: boolean;
  rule: string;
  left: string[];
  right: string[];
  /** [left index, right index] */
  arrows: Array<[number, number]>;
}

const panels: Panel[] = [
  {
    title: 'one-one',
    verdict: 'a function',
    ok: true,
    rule: 'x ↦ 2x',
    left: ['1', '2', '3'],
    right: ['2', '4', '6'],
    arrows: [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
  },
  {
    title: 'many-one',
    verdict: 'a function',
    ok: true,
    rule: 'x ↦ x²',
    left: ['−2', '2', '3'],
    right: ['4', '9'],
    arrows: [
      [0, 0],
      [1, 0],
      [2, 1],
    ],
  },
  {
    title: 'one-many',
    verdict: 'NOT a function',
    ok: false,
    rule: 'x ↦ ±√x',
    left: ['4', '9'],
    right: ['2', '−2', '3', '−3'],
    arrows: [
      [0, 0],
      [0, 1],
      [1, 2],
      [1, 3],
    ],
  },
];

/** y-positions for n items centred on CY. */
const ys = (n: number) => Array.from({ length: n }, (_, i) => CY + (i - (n - 1) / 2) * 40);

export default function FunctionsMappingTypes() {
  return (
    <Svg width={W} height={H}>
      {panels.map((p, k) => {
        const ly = ys(p.left.length);
        const ry = ys(p.right.length);
        return (
          <g key={p.title} transform={`translate(${k * PW}, 0)`}>
            {k > 0 && <line x1={0} y1={10} x2={0} y2={H - 10} className="dg-grid" />}
            <Label x={PW / 2} y={22} className={p.ok ? 'dg-text-accent' : 'dg-text-accent-2'}>
              {p.title}
            </Label>
            <Label x={PW / 2} y={42} className="dg-text-small">
              {p.verdict}
            </Label>
            <ellipse cx={LX} cy={CY} rx={30} ry={86} className="dg-thin dg-fill-muted" />
            <ellipse cx={RX} cy={CY} rx={30} ry={86} className="dg-thin dg-fill-muted" />
            <Label x={LX} y={CY - 100} className="dg-text-small dg-italic">
              domain
            </Label>
            <Label x={RX} y={CY - 100} className="dg-text-small dg-italic">
              outputs
            </Label>
            {p.left.map((t, i) => (
              <Label key={`l${t}`} x={LX} y={ly[i]!} className="dg-text">
                {t}
              </Label>
            ))}
            {p.right.map((t, i) => (
              <Label key={`r${t}`} x={RX} y={ry[i]!} className="dg-text">
                {t}
              </Label>
            ))}
            {p.arrows.map(([a, b]) => (
              <Arrow
                key={`${a}-${b}`}
                x1={LX + 16}
                y1={ly[a]!}
                x2={RX - 18}
                y2={ry[b]!}
                head={8}
                className={p.ok ? 'dg-accent' : 'dg-accent-2'}
                headClassName={p.ok ? 'dg-dot-accent' : 'dg-dot-accent-2'}
              />
            ))}
            <Label x={PW / 2} y={H - 28} className="dg-text dg-italic">
              {p.rule}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}
