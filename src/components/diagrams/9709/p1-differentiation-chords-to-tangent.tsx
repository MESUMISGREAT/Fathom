/**
 * y = x³ near P(2, 8). Chords from P to Q at x = 2 + h for h = 1, 0.5 and 0.2
 * have gradients 19, 15.25 and 13.24; the tangent at P, y = 12x − 16, has
 * gradient 12, the limit of the chord gradients 12 + 6h + h² as h → 0.
 */
import { Label, Svg, graph } from '../primitives';
import { AxesXY, makePlot } from './kit';

export const diagramKey = 'p1-differentiation-chords-to-tangent';

const W = 580;
const H = 420;
const X: [number, number] = [-0.3, 3.4];
const Y: [number, number] = [-3, 30];
const f = (x: number) => x ** 3;
const P = { x: 2, y: 8 };
const chords = [
  { h: 1, m: 19 },
  { h: 0.5, m: 15.25 },
  { h: 0.2, m: 13.24 },
];

export default function P1DifferentiationChordsToTangent() {
  const p = makePlot({ width: W, height: H, pad: 34, x: X, y: Y });
  // Extend each chord a little beyond P and Q.
  const seg = (m: number, x1: number, x2: number) => (
    <line x1={p.sx(x1)} y1={p.sy(P.y + m * (x1 - P.x))} x2={p.sx(x2)} y2={p.sy(P.y + m * (x2 - P.x))} className="dg-muted" />
  );
  const tx1 = 1.45;
  const tx2 = 3.35;
  return (
    <Svg width={W} height={H}>
      <AxesXY p={p} xTicks={[1, 2, 3]} yTicks={[10, 20]} />

      {chords.map((c) => (
        <g key={`c${c.h}`}>{seg(c.m, 1.75, 2 + c.h + 0.12)}</g>
      ))}

      {/* tangent */}
      <line x1={p.sx(tx1)} y1={p.sy(12 * tx1 - 16)} x2={p.sx(tx2)} y2={p.sy(12 * tx2 - 16)} className="dg-accent-2" />

      <path d={graph(f, [0, X[1]], p, Y)} className="dg-accent" />

      {chords.map((c) => {
        const qx = 2 + c.h;
        const below = c.h < 1;
        return (
          <g key={c.h}>
            <circle cx={p.sx(qx)} cy={p.sy(f(qx))} r={4} className="dg-dot" />
            <Label x={p.sx(qx) + (below ? 12 : 9)} y={p.sy(f(qx)) + (below ? 16 : 0)} anchor="start" className="dg-text-small">
              {`Q, h = ${c.h}`}
            </Label>
          </g>
        );
      })}

      <circle cx={p.sx(P.x)} cy={p.sy(P.y)} r={5} className="dg-dot-accent-2" />
      <Label x={p.sx(P.x) + 9} y={p.sy(P.y) + 15} anchor="start" className="dg-text-accent-2">
        P(2, 8)
      </Label>
      <Label x={p.sx(1.62)} y={p.sy(0.9)} anchor="start" className="dg-text-accent-2">
        tangent at P: gradient 12
      </Label>
      <Label x={p.sx(1.02)} y={p.sy(6)} anchor="start" className="dg-text-accent">
        y = x³
      </Label>

      {/* table of chord gradients */}
      <g>
        <Label x={p.sx(0.12)} y={p.sy(28.5)} anchor="start" className="dg-text dg-bold">
          chord PQ, Q at x = 2 + h
        </Label>
        <Label x={p.sx(0.2)} y={p.sy(28.5) + 20} anchor="start" className="dg-text-small dg-bold">
          h
        </Label>
        <Label x={p.sx(0.75)} y={p.sy(28.5) + 20} anchor="start" className="dg-text-small dg-bold">
          gradient
        </Label>
        {[
          ['1', '19'],
          ['0.5', '15.25'],
          ['0.2', '13.24'],
          ['0.01', '12.0601'],
          ['→ 0', '→ 12'],
        ].map(([h, m], i) => (
          <g key={h}>
            <Label x={p.sx(0.2)} y={p.sy(28.5) + 40 + i * 18} anchor="start" className="dg-text-small dg-mono">
              {h}
            </Label>
            <Label x={p.sx(0.75)} y={p.sy(28.5) + 40 + i * 18} anchor="start" className={i === 4 ? 'dg-text-accent-2' : 'dg-text-small dg-mono'}>
              {m}
            </Label>
          </g>
        ))}
      </g>
    </Svg>
  );
}
