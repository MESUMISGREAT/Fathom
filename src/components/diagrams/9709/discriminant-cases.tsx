/**
 * Three panels, same scale: y = x² − 2x − 3, y = x² − 2x + 1 and y = x² − 2x + 3.
 * Same shape, shifted vertically, so the discriminant goes 16 → 0 → −8 and the
 * curve goes from crossing the x-axis twice, to touching it, to missing it.
 */
import { Label, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'discriminant-cases';

const PW = 200;
const W = PW * 3;
const H = 318;
const X: [number, number] = [-2, 4];
const Y: [number, number] = [-4.5, 6.5];

const cases = [
  {
    c: -3,
    title: 'b² − 4ac > 0',
    sub: 'two distinct real roots',
    eq: 'y = x² − 2x − 3',
    disc: 'b² − 4ac = 4 + 12 = 16',
    roots: [-1, 3],
  },
  {
    c: 1,
    title: 'b² − 4ac = 0',
    sub: 'one repeated root',
    eq: 'y = x² − 2x + 1',
    disc: 'b² − 4ac = 4 − 4 = 0',
    roots: [1],
  },
  {
    c: 3,
    title: 'b² − 4ac < 0',
    sub: 'no real roots',
    eq: 'y = x² − 2x + 3',
    disc: 'b² − 4ac = 4 − 12 = −8',
    roots: [] as number[],
  },
];

export default function DiscriminantCases() {
  // Each panel's plotting frame sits between y = 50 and y = 250.
  const p = makePlot({ width: PW, height: 220, pad: 18, x: X, y: Y });
  return (
    <Svg width={W} height={H}>
      {cases.map((k, i) => (
        <g key={k.c} transform={`translate(${i * PW}, 0)`}>
          {i > 0 && <line x1={0} y1={8} x2={0} y2={H - 8} className="dg-grid" />}
          <Label x={PW / 2} y={18} className={i === 1 ? 'dg-text-accent-2' : 'dg-text-accent'}>
            {k.title}
          </Label>
          <Label x={PW / 2} y={37} className="dg-text-small">
            {k.sub}
          </Label>
          <g transform="translate(0, 46)">
            {/* axes */}
            <line x1={p.sx(X[0])} y1={p.sy(0)} x2={p.sx(X[1])} y2={p.sy(0)} className="dg-thin" />
            <line x1={p.sx(0)} y1={p.sy(Y[0])} x2={p.sx(0)} y2={p.sy(Y[1])} className="dg-thin" />
            <Label x={p.sx(X[1]) + 8} y={p.sy(0)} className="dg-text-small dg-italic">
              x
            </Label>
            <Label x={p.sx(0)} y={p.sy(Y[1]) - 9} className="dg-text-small dg-italic">
              y
            </Label>
            {[-1, 1, 2, 3].map((t) => (
              <line key={t} x1={p.sx(t)} y1={p.sy(0) - 3} x2={p.sx(t)} y2={p.sy(0) + 3} className="dg-thin" />
            ))}
            <line x1={p.sx(1)} y1={p.sy(Y[0])} x2={p.sx(1)} y2={p.sy(Y[1])} className="dg-grid dg-dashed" />
            <path
              d={graph((x) => x * x - 2 * x + k.c, X, p, Y)}
              className={i === 1 ? 'dg-accent-2' : 'dg-accent'}
            />
            <circle cx={p.sx(1)} cy={p.sy(k.c - 1)} r={3} className="dg-dot" />
            {k.roots.map((r) => (
              <circle key={r} cx={p.sx(r)} cy={p.sy(0)} r={5} className={i === 1 ? 'dg-dot-accent-2' : 'dg-dot-accent'} />
            ))}
            {k.roots.length === 2 && (
              <>
                <Label x={p.sx(-1) - 4} y={p.sy(0) + 14} anchor="end" className="dg-text-small">
                  −1
                </Label>
                <Label x={p.sx(3) + 4} y={p.sy(0) + 14} anchor="start" className="dg-text-small">
                  3
                </Label>
              </>
            )}
            {k.roots.length === 1 && (
              <Label x={p.sx(1) + 6} y={p.sy(0) + 14} anchor="start" className="dg-text-small">
                1
              </Label>
            )}
          </g>
          <Label x={PW / 2} y={284} className="dg-text-small">
            {k.eq}
          </Label>
          <Label x={PW / 2} y={304} className="dg-text-small">
            {k.disc}
          </Label>
        </g>
      ))}
    </Svg>
  );
}
