/**
 * The binomial distribution B(10, 0.3): the number of successes in 10 independent trials with
 * success probability 0.3. The bars rise to a peak at 3 and then fall away, which is the
 * shape students should learn to recognise.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'discrete-rv-binomial-bars';

const W = 540;
const H = 300;
const LEFT = 92;
const RIGHT = 500;
const TOP = 60;
const BOTTOM = 248;
const Y_MAX = 0.34;
const N = 10;
const P = 0.3;

const choose = (n: number, r: number) => {
  let v = 1;
  for (let i = 0; i < r; i++) v = (v * (n - i)) / (i + 1);
  return Math.round(v);
};

const pmf = (r: number) => choose(N, r) * Math.pow(P, r) * Math.pow(1 - P, N - r);

const yPx = (v: number) => BOTTOM - (v / Y_MAX) * (BOTTOM - TOP);
const values = Array.from({ length: N + 1 }, (_, r) => r);
const slot = (RIGHT - LEFT) / values.length;
const centre = (i: number) => LEFT + slot * (i + 0.5);
const barW = slot * 0.6;

export default function DiscreteRvBinomialBars() {
  return (
    <Svg width={W} height={H}>
      <Label x={LEFT} y={26} anchor="start" className="dg-text-small">
        P(X = r)
      </Label>
      <Label x={RIGHT} y={26} anchor="end" className="dg-text">
        B(10, 0.3)
      </Label>

      {[0.1, 0.2, 0.3].map((g) => (
        <g key={g}>
          <line x1={LEFT} y1={yPx(g)} x2={RIGHT} y2={yPx(g)} className="dg-grid" />
          <line x1={LEFT - 5} y1={yPx(g)} x2={LEFT} y2={yPx(g)} className="dg-thin" />
          <Label x={LEFT - 8} y={yPx(g)} anchor="end" className="dg-text-small">
            {g.toFixed(1)}
          </Label>
        </g>
      ))}

      {values.map((r, i) => {
        const h = pmf(r);
        return (
          <g key={r}>
            <rect
              x={centre(i) - barW / 2}
              y={yPx(h)}
              width={barW}
              height={BOTTOM - yPx(h)}
              className="dg-fill-accent dg-thin"
            />
            {h >= 0.02 && (
              <Label x={centre(i)} y={yPx(h) - 11} className="dg-text-small">
                {h.toFixed(2)}
              </Label>
            )}
            {r % 2 === 0 && (
              <Label x={centre(i)} y={BOTTOM + 17} className="dg-text-small">
                {`${r}`}
              </Label>
            )}
          </g>
        );
      })}

      <Arrow x1={LEFT} y1={BOTTOM} x2={LEFT} y2={TOP - 10} className="dg-thin" head={8} />
      <Arrow x1={LEFT} y1={BOTTOM} x2={RIGHT + 16} y2={BOTTOM} className="dg-thin" head={8} />
      <Label x={RIGHT + 24} y={BOTTOM} anchor="start" className="dg-text dg-italic">
        r
      </Label>
    </Svg>
  );
}
