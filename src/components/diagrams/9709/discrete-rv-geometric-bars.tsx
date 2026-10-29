/**
 * The geometric distribution Geo(0.2): the number of trials up to and including the first
 * success, with success probability 0.2 on each trial. Each bar is compounded by another
 * factor of 0.8, so the heights fall away steadily rather than in a hump.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'discrete-rv-geometric-bars';

const W = 540;
const H = 300;
const LEFT = 92;
const RIGHT = 500;
const TOP = 60;
const BOTTOM = 248;
const Y_MAX = 0.25;
const N = 10;
const P = 0.2;

const pmf = (r: number) => P * Math.pow(1 - P, r - 1);

const yPx = (v: number) => BOTTOM - (v / Y_MAX) * (BOTTOM - TOP);
const values = Array.from({ length: N }, (_, i) => i + 1);
const slot = (RIGHT - LEFT) / values.length;
const centre = (i: number) => LEFT + slot * (i + 0.5);
const barW = slot * 0.6;

export default function DiscreteRvGeometricBars() {
  return (
    <Svg width={W} height={H}>
      <Label x={LEFT} y={26} anchor="start" className="dg-text-small">
        P(X = r)
      </Label>
      <Label x={RIGHT} y={26} anchor="end" className="dg-text">
        Geo(0.2)
      </Label>

      {[0.05, 0.1, 0.15, 0.2].map((g) => (
        <g key={g}>
          <line x1={LEFT} y1={yPx(g)} x2={RIGHT} y2={yPx(g)} className="dg-grid" />
          <line x1={LEFT - 5} y1={yPx(g)} x2={LEFT} y2={yPx(g)} className="dg-thin" />
          <Label x={LEFT - 8} y={yPx(g)} anchor="end" className="dg-text-small">
            {g.toFixed(2)}
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
              className="dg-fill-accent-2 dg-thin"
            />
            {h >= 0.02 && (
              <Label x={centre(i)} y={yPx(h) - 11} className="dg-text-small">
                {h.toFixed(2)}
              </Label>
            )}
            {r % 2 === 1 && (
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
