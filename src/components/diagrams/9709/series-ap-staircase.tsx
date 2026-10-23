/**
 * The AP 3, 7, 11, 15, 19, 23 (a = 3, d = 4) drawn as bars uₙ against n.
 * Every step up is the same +4, so the tops lie on a straight line, and
 * reaching u₆ from u₁ takes 5 steps of d: u₆ = 3 + 5 × 4 = 23.
 */
import { Label, Svg } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'series-ap-staircase';

const W = 560;
const H = 380;
const X: [number, number] = [0, 7];
const Y: [number, number] = [0, 27];
const a = 3;
const d = 4;
const ns = [1, 2, 3, 4, 5, 6];
const u = (n: number) => a + (n - 1) * d;
const BAR = 0.5;

export default function SeriesApStaircase() {
  const p = makePlot({ width: W, height: H, pad: 40, x: X, y: Y });
  const x0 = p.sx(0);
  const y0 = p.sy(0);
  return (
    <Svg width={W} height={H}>
      {/* bars */}
      {ns.map((n) => (
        <g key={n}>
          <rect
            x={p.sx(n - BAR / 2)}
            y={p.sy(u(n))}
            width={p.sx(BAR) - p.sx(0)}
            height={y0 - p.sy(u(n))}
            className={n === 1 || n === 6 ? 'dg-accent dg-fill-accent' : 'dg-thin dg-fill-muted'}
          />
          <Label x={p.sx(n)} y={p.sy(u(n)) - 12} className={n === 1 || n === 6 ? 'dg-text-accent' : 'dg-text'}>
            {u(n)}
          </Label>
          <Label x={p.sx(n)} y={y0 + 16} className="dg-text-small">
            {n}
          </Label>
        </g>
      ))}

      {/* risers: each step is +d */}
      {ns.slice(0, -1).map((n) => {
        const xr = p.sx(n + 1 - BAR / 2);
        return (
          <g key={`s${n}`}>
            <line x1={p.sx(n + BAR / 2)} y1={p.sy(u(n))} x2={xr} y2={p.sy(u(n))} className="dg-accent-2 dg-dashed" />
            <line x1={xr} y1={p.sy(u(n))} x2={xr} y2={p.sy(u(n + 1))} className="dg-accent-2" />
            <Label x={xr - 6} y={p.sy(u(n)) + 15} anchor="end" className="dg-text-accent-2">
              +4
            </Label>
          </g>
        );
      })}

      {/* line through the tops */}
      <line x1={p.sx(0.5)} y1={p.sy(u(0.5))} x2={p.sx(6.6)} y2={p.sy(u(6.6))} className="dg-muted dg-dashed" />

      {/* axes */}
      <line x1={x0} y1={y0} x2={p.sx(X[1])} y2={y0} className="dg-thin" />
      <line x1={x0} y1={y0} x2={x0} y2={p.sy(Y[1])} className="dg-thin" />
      <Label x={p.sx(X[1]) + 4} y={y0 + 16} className="dg-text dg-italic">
        n
      </Label>
      <Label x={x0} y={p.sy(Y[1]) - 14} className="dg-text dg-italic">
        uₙ
      </Label>

      {/* formula panel */}
      <Label x={p.sx(0.35)} y={p.sy(24.5)} anchor="start" className="dg-text dg-bold">
        a = 3, d = 4
      </Label>
      <Label x={p.sx(0.35)} y={p.sy(24.5) + 24} anchor="start" className="dg-text">
        uₙ = a + (n − 1)d
      </Label>
      <Label x={p.sx(0.35)} y={p.sy(24.5) + 48} anchor="start" className="dg-text-accent">
        u₆ = 3 + 5 × 4 = 23
      </Label>
      <Label x={p.sx(0.35)} y={p.sy(24.5) + 70} anchor="start" className="dg-text-muted">
        6th term: 5 steps of d
      </Label>
    </Svg>
  );
}
