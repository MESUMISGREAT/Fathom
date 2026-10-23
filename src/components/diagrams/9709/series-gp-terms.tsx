/**
 * Three geometric progressions on the same scale, terms u₁ to u₆ plotted as
 * stems against n:
 *   r = 2   (a = 1):  1, 2, 4, 8, 16, 32         grows faster and faster
 *   r = ½   (a = 32): 32, 16, 8, 4, 2, 1         shrinks towards 0
 *   r = −½  (a = 32): 32, −16, 8, −4, 2, −1      alternates in sign and shrinks
 */
import { Label, Svg, MathLabel } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'series-gp-terms';

const PW = 200;
const W = PW * 3;
const H = 340;
const X: [number, number] = [0, 7.3];
const Y: [number, number] = [-18, 35];
const ns = [1, 2, 3, 4, 5, 6];

const panels = [
  { a: 1, r: 2, title: 'r = 2', sub: 'grows faster and faster', cls: 'accent' },
  { a: 32, r: 0.5, title: 'r = \\dfrac{1}{2}', sub: 'shrinks towards 0', cls: 'accent-2' },
  { a: 32, r: -0.5, title: 'r = -\\dfrac{1}{2}', sub: 'alternates in sign, shrinks', cls: 'accent' },
] as const;

const fmt = (v: number) => (v < 0 ? `−${Math.abs(v)}` : `${v}`);

export default function SeriesGpTerms() {
  const p = makePlot({ width: PW, height: 260, pad: 22, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      {panels.map((k, i) => (
        <g key={k.title} transform={`translate(${i * PW}, 0)`}>
          {i > 0 && <line x1={0} y1={10} x2={0} y2={H - 36} className="dg-grid" />}
          <MathLabel x={PW / 2} y={22} w={PW - 20} h={40} tone={k.cls as 'accent' | 'accent-2'} tex={k.title} />
          <Label x={PW / 2} y={48} className="dg-text-small">
            {`a = ${k.a}: ${k.sub}`}
          </Label>
          <g transform="translate(0, 50)">
            <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(X[1])} y2={p.sy(0)} className="dg-thin" />
            <line x1={p.sx(0)} y1={p.sy(Y[0])} x2={p.sx(0)} y2={p.sy(Y[1])} className="dg-thin" />
            {[-16, 16, 32].map((t) => (
              <g key={t}>
                <line x1={p.sx(0) - 3} y1={p.sy(t)} x2={p.sx(0) + 3} y2={p.sy(t)} className="dg-thin" />
                <line x1={p.sx(0)} y1={p.sy(t)} x2={p.sx(X[1])} y2={p.sy(t)} className="dg-grid" />
              </g>
            ))}
            {i === 0 &&
              [-16, 16, 32].map((t) => (
                <Label key={t} x={p.sx(0) - 5} y={p.sy(t)} anchor="end" className="dg-text-small">
                  {fmt(t)}
                </Label>
              ))}
            {ns.map((n) => {
              const v = k.a * k.r ** (n - 1);
              const above = v >= 0;
              return (
                <g key={n}>
                  <line x1={p.sx(n)} y1={p.sy(0)} x2={p.sx(n)} y2={p.sy(v)} className={`dg-${k.cls}`} />
                  <circle cx={p.sx(n)} cy={p.sy(v)} r={4} className={`dg-dot-${k.cls}`} />
                  <Label x={p.sx(n)} y={p.sy(v) + (above ? -11 : 13)} className="dg-text-small">
                    {fmt(v)}
                  </Label>
                </g>
              );
            })}
            <Label x={p.sx(X[1]) - 2} y={p.sy(0) + 13} anchor="end" className="dg-text-small dg-italic">
              n
            </Label>
            <Label x={p.sx(0)} y={p.sy(Y[1]) - 9} className="dg-text-small dg-italic">
              uₙ
            </Label>
          </g>
        </g>
      ))}
      <Label x={W / 2} y={H - 12} className="dg-text-muted">
        Each term is the one before multiplied by r
      </Label>
    </Svg>
  );
}
