/**
 * Connected rates as one chain, written the same way every time. Circle: dA/dt = dA/dr × dr/dt,
 * where the wanted rate dA/dt is on the left, so you multiply. Balloon: dV/dt = dV/dr × dr/dt,
 * where the wanted rate dr/dt is on the right, so you divide. Bottom line: the dr's cancel like
 * fractions, which checks the chain is the right way round.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p1-differentiation-rates-chain';

const W = 600;
const H = 322;
const NAME_X = 24;
const T1 = 170;
const EQ = 218;
const T2 = 266;
const TIMES = 314;
const T3 = 362;
const NOTE_X = 420;

const want = (s: string) => `\\htmlClass{dg-k-accent-2}{${s}}`;
const know = (s: string) => `\\htmlClass{dg-k-accent}{${s}}`;

type Slot = 'want' | 'know' | 'differentiate';
const ROWS: { name: string; sub: string; terms: [string, string, string]; slots: [Slot, Slot, Slot]; note: string; verb: string }[] = [
  {
    name: 'Circle',
    sub: 'area from radius',
    terms: [want('\\dfrac{dA}{dt}'), '\\dfrac{dA}{dr}', know('\\dfrac{dr}{dt}')],
    slots: ['want', 'differentiate', 'know'],
    note: 'want is on the left,',
    verb: 'so multiply',
  },
  {
    name: 'Balloon',
    sub: 'radius from volume',
    terms: [know('\\dfrac{dV}{dt}'), '\\dfrac{dV}{dr}', want('\\dfrac{dr}{dt}')],
    slots: ['know', 'differentiate', 'want'],
    note: 'want is on the right,',
    verb: 'so divide',
  },
];

const slotClass: Record<Slot, string> = {
  want: 'dg-text-accent-2 dg-bold',
  know: 'dg-text-accent dg-bold',
  differentiate: 'dg-text-small',
};

export default function P1DifferentiationRatesChain() {
  return (
    <Svg width={W} height={H}>
      {ROWS.map((r, i) => {
        const y = 64 + i * 112;
        return (
          <g key={r.name}>
            <Label x={NAME_X} y={y - 9} anchor="start" className="dg-text dg-bold">
              {r.name}
            </Label>
            <Label x={NAME_X} y={y + 11} anchor="start" className="dg-text-small">
              {r.sub}
            </Label>

            <MathLabel x={T1} y={y} w={70} h={56} size="large" tex={r.terms[0]} />
            <MathLabel x={EQ} y={y} w={30} h={40} size="large" tex="=" />
            <MathLabel x={T2} y={y} w={70} h={56} size="large" tex={r.terms[1]} />
            <MathLabel x={TIMES} y={y} w={30} h={40} size="large" tex="\times" />
            <MathLabel x={T3} y={y} w={70} h={56} size="large" tex={r.terms[2]} />

            {[T1, T2, T3].map((tx, j) => (
              <Label key={tx} x={tx} y={y + 44} className={slotClass[r.slots[j]!]}>
                {r.slots[j]}
              </Label>
            ))}

            <Label x={NOTE_X} y={y - 9} anchor="start" className="dg-text">
              {r.note}
            </Label>
            <Label x={NOTE_X} y={y + 13} anchor="start" className="dg-text-accent-2 dg-bold">
              {r.verb}
            </Label>
            <line x1={24} y1={y + 70} x2={W - 24} y2={y + 70} className="dg-grid" />
          </g>
        );
      })}

      <MathLabel
        x={W / 2}
        y={288}
        w={W - 30}
        h={52}
        tone="muted"
        tex="\text{Right way round? The } dr\text{'s cancel: } \dfrac{dA}{\cancel{dr}} \times \dfrac{\cancel{dr}}{dt} = \dfrac{dA}{dt}"
      />
    </Svg>
  );
}
