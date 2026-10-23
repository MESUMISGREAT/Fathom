/**
 * Partial sums S₁ … S₈ of two convergent GPs with first term 8, same scale.
 * Left, r = ½: 8, 12, 14, 15, 15.5, … climbing towards S∞ = 8 ⁄ (1 − ½) = 16.
 * Right, r = −½: 8, 4, 6, 5, 5.5, … zigzagging in towards S∞ = 8 ⁄ (1 + ½) = 16⁄3.
 */
import { Label, Svg, MathLabel } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'series-sum-to-infinity';

const PW = 300;
const W = PW * 2;
const H = 330;
const X: [number, number] = [0, 9];
const Y: [number, number] = [0, 18];
const ns = [1, 2, 3, 4, 5, 6, 7, 8];

const partial = (a: number, r: number, n: number) => (a * (1 - r ** n)) / (1 - r);

const panels = [
  { r: 0.5, title: 'r = \\dfrac{1}{2}', limit: 16, limitText: 'S_\\infty = 16', cls: 'accent', note: 'creeps up, never passes 16' },
  { r: -0.5, title: 'r = -\\dfrac{1}{2}', limit: 16 / 3, limitText: 'S_\\infty = \\dfrac{16}{3}', cls: 'accent-2', note: 'overshoots, undershoots, closes in' },
] as const;

export default function SeriesSumToInfinity() {
  const p = makePlot({ width: PW, height: 250, pad: 30, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      {panels.map((k, i) => {
        const pts = ns.map((n) => ({ n, s: partial(8, k.r, n) }));
        const d = pts.map((q, j) => `${j === 0 ? 'M' : 'L'}${p.sx(q.n).toFixed(1)},${p.sy(q.s).toFixed(1)}`).join(' ');
        return (
          <g key={k.title} transform={`translate(${i * PW}, 0)`}>
            {i > 0 && <line x1={0} y1={10} x2={0} y2={H - 10} className="dg-grid" />}
            <MathLabel x={PW / 2} y={22} w={PW - 20} h={40} tone={k.cls as 'accent' | 'accent-2'} tex={`a = 8,\\ ${k.title}`} />
            <Label x={PW / 2} y={48} className="dg-text-small">
              {k.note}
            </Label>
            <g transform="translate(0, 50)">
              {/* axes */}
              <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(X[1])} y2={p.sy(0)} className="dg-thin" />
              <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(0)} y2={p.sy(Y[1])} className="dg-thin" />
              <Label x={p.sx(X[1])} y={p.sy(0) + 15} anchor="end" className="dg-text-small dg-italic">
                n
              </Label>
              <Label x={p.sx(0)} y={p.sy(Y[1]) - 10} className="dg-text-small dg-italic">
                Sₙ
              </Label>
              {[4, 8, 12, 16].map((t) => (
                <g key={t}>
                  <line x1={p.sx(0) - 3} y1={p.sy(t)} x2={p.sx(0) + 3} y2={p.sy(t)} className="dg-thin" />
                  <Label x={p.sx(0) - 6} y={p.sy(t)} anchor="end" className="dg-text-small">
                    {t}
                  </Label>
                </g>
              ))}
              {ns.map((n) => (
                <Label key={n} x={p.sx(n)} y={p.sy(0) + 14} className="dg-text-small">
                  {n}
                </Label>
              ))}

              {/* the limit */}
              <line x1={p.sx(0)} y1={p.sy(k.limit)} x2={p.sx(X[1])} y2={p.sy(k.limit)} className="dg-muted dg-dashed" />
              <MathLabel x={p.sx(X[1])} y={p.sy(k.limit) + (i === 0 ? -16 : 22)} anchor="end" w={110} h={44} tone="muted" tex={k.limitText} />

              <path d={d} className="dg-muted" />
              {pts.map((q) => (
                <circle key={q.n} cx={p.sx(q.n)} cy={p.sy(q.s)} r={4} className={`dg-dot-${k.cls}`} />
              ))}
              {pts.slice(0, 4).map((q, j) => (
                <Label
                  key={`l${q.n}`}
                  x={p.sx(q.n) + (i === 0 ? 7 : 0)}
                  y={p.sy(q.s) + (i === 0 ? 13 : j % 2 === 0 ? -12 : 14)}
                  anchor={i === 0 ? 'start' : 'middle'}
                  className="dg-text-small"
                >
                  {Math.round(q.s * 1000) / 1000}
                </Label>
              ))}
            </g>
          </g>
        );
      })}
    </Svg>
  );
}
