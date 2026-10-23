/**
 * Left: a 12 cm square of card with an x cm square cut from each corner
 * (drawn to scale for x = 2) and dashed fold lines; folding gives an open box
 * with base (12 − 2x) by (12 − 2x) and height x.
 * Right: V = x(12 − 2x)² for 0 < x < 6, maximum V = 128 cm³ at x = 2.
 */
import { Label, Svg, graph } from '../primitives';
import { makePlot } from './kit';

export const diagramKey = 'p1-differentiation-box-net';

const W = 640;
const H = 340;
const S = 18; // px per cm on the net
const NX = 40;
const NY = 56;
const cut = 2;
const V = (x: number) => x * (12 - 2 * x) ** 2;

export default function P1DifferentiationBoxNet() {
  const side = 12 * S;
  const c = cut * S;
  const p = makePlot({ width: 330, height: 300, pad: 36, x: [0, 6.4], y: [0, 150] });
  const GX = 300;
  const GY = 20;
  const outline = [
    [c, 0],
    [side - c, 0],
    [side - c, c],
    [side, c],
    [side, side - c],
    [side - c, side - c],
    [side - c, side],
    [c, side],
    [c, side - c],
    [0, side - c],
    [0, c],
    [c, c],
  ]
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${NX + x!},${NY + y!}`)
    .join(' ');
  return (
    <Svg width={W} height={H}>
      {/* the net */}
      <Label x={NX + side / 2} y={22} className="dg-text dg-bold">
        12 cm square, corners cut out
      </Label>
      {[
        [0, 0],
        [side - c, 0],
        [0, side - c],
        [side - c, side - c],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={NX + x!} y={NY + y!} width={c} height={c} className="dg-muted dg-dashed" />
      ))}
      <path d={`${outline} Z`} className="dg-accent dg-fill-accent" />
      <rect x={NX + c} y={NY + c} width={side - 2 * c} height={side - 2 * c} className="dg-accent dg-dashed" />
      <Label x={NX + c / 2} y={NY + c / 2} className="dg-text-small dg-italic">
        x
      </Label>
      <Label x={NX + side / 2} y={NY + side / 2 - 10} className="dg-text-accent">
        base
      </Label>
      <Label x={NX + side / 2} y={NY + side / 2 + 10} className="dg-text-small">
        (12 − 2x) by (12 − 2x)
      </Label>
      <Label x={NX + side / 2} y={NY + c / 2} className="dg-text-small">
        fold up: height x
      </Label>
      <line x1={NX} y1={NY + side + 14} x2={NX + side} y2={NY + side + 14} className="dg-thin" />
      <line x1={NX} y1={NY + side + 9} x2={NX} y2={NY + side + 19} className="dg-thin" />
      <line x1={NX + side} y1={NY + side + 9} x2={NX + side} y2={NY + side + 19} className="dg-thin" />
      <Label x={NX + side / 2} y={NY + side + 30} className="dg-text-small">
        12 cm
      </Label>

      {/* the graph */}
      <g transform={`translate(${GX}, ${GY})`}>
        <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(6.4)} y2={p.sy(0)} className="dg-thin" />
        <line x1={p.sx(0)} y1={p.sy(0)} x2={p.sx(0)} y2={p.sy(150)} className="dg-thin" />
        {[1, 2, 3, 4, 5, 6].map((t) => (
          <g key={t}>
            <line x1={p.sx(t)} y1={p.sy(0) - 3} x2={p.sx(t)} y2={p.sy(0) + 3} className="dg-thin" />
            <Label x={p.sx(t)} y={p.sy(0) + 15} className="dg-text-small">
              {t}
            </Label>
          </g>
        ))}
        {[50, 100].map((t) => (
          <g key={t}>
            <line x1={p.sx(0) - 3} y1={p.sy(t)} x2={p.sx(0) + 3} y2={p.sy(t)} className="dg-thin" />
            <Label x={p.sx(0) - 6} y={p.sy(t)} anchor="end" className="dg-text-small">
              {t}
            </Label>
          </g>
        ))}
        <line x1={p.sx(2)} y1={p.sy(0)} x2={p.sx(2)} y2={p.sy(128)} className="dg-grid dg-dashed" />
        <line x1={p.sx(0)} y1={p.sy(128)} x2={p.sx(2)} y2={p.sy(128)} className="dg-grid dg-dashed" />
        <path d={graph(V, [0, 6], p, [0, 150])} className="dg-accent-2" />
        <circle cx={p.sx(2)} cy={p.sy(128)} r={5} className="dg-dot-accent-2" />
        <Label x={p.sx(2) + 10} y={p.sy(128) - 12} anchor="start" className="dg-text-accent-2">
          maximum V = 128 at x = 2
        </Label>
        <Label x={p.sx(0) - 6} y={p.sy(128)} anchor="end" className="dg-text-small">
          128
        </Label>
        <Label x={p.sx(3.6)} y={p.sy(95)} anchor="start" className="dg-text">
          V = x(12 − 2x)²
        </Label>
        <Label x={p.sx(6.4)} y={p.sy(0) + 30} anchor="end" className="dg-text-small">
          x (cm)
        </Label>
        <Label x={p.sx(0) + 6} y={p.sy(150) - 4} anchor="start" className="dg-text-small">
          V (cm³)
        </Label>
      </g>
    </Svg>
  );
}
