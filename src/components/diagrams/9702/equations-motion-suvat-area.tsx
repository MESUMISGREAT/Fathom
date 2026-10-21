/**
 * Deriving the equations of uniformly accelerated motion from a
 * velocity–time graph. A straight line runs from velocity u at t = 0 to v at
 * time t. The area under it splits into a rectangle (height u, width t:
 * area ut) and a triangle (base t, height v − u = at: area ½at²). The total
 * area is the displacement s = ut + ½at²; as a trapezium it is ½(u + v)t.
 * The axes are symbolic (no numbers); the proportions are u : v = 0.35 : 0.95.
 */
import { Arrow, Label, Svg } from '../primitives';
import { MotionAxes, makePlot, poly } from './equations-motion-kit';

export const diagramKey = 'phys-equations-motion-suvat-area';

const W = 620;
const H = 310;
const U = 0.35;
const V = 0.95;

export function EquationsMotionSuvatArea() {
  const p = makePlot({ left: 64, top: 40, width: 300, height: 220, x: [0, 1.18], y: [0, 1.1] });
  return (
    <Svg width={W} height={H}>
      {/* rectangle ut and triangle ½at² */}
      <path d={`${poly(p, [[0, 0], [0, U], [1, U], [1, 0]])} Z`} className="dg-fill-accent" />
      <path d={`${poly(p, [[0, U], [1, V], [1, U]])} Z`} className="dg-fill-accent-2" />
      <MotionAxes p={p} xLabel="time" yLabel="velocity" origin />
      <line x1={p.sx(1)} y1={p.sy(0)} x2={p.sx(1)} y2={p.sy(V)} className="dg-thin dg-dashed" />
      <line x1={p.sx(0)} y1={p.sy(V)} x2={p.sx(1)} y2={p.sy(V)} className="dg-grid" />
      <line x1={p.sx(0)} y1={p.sy(U)} x2={p.sx(1)} y2={p.sy(U)} className="dg-thin" />
      <path d={poly(p, [[0, U], [1, V]])} className="dg-accent" />
      {/* axis labels for u, v and t */}
      <Label x={p.sx(0) - 8} y={p.sy(U)} anchor="end" className="dg-text dg-italic">
        u
      </Label>
      <Label x={p.sx(0) - 8} y={p.sy(V)} anchor="end" className="dg-text dg-italic">
        v
      </Label>
      <Label x={p.sx(1)} y={p.sy(0) + 16} className="dg-text dg-italic">
        t
      </Label>
      {/* area labels */}
      <Label x={p.sx(0.5)} y={p.sy(U / 2)} className="dg-text dg-bold">
        area = ut
      </Label>
      <Label x={p.sx(0.7)} y={p.sy(U + 0.21)} className="dg-text-small dg-bold">
        area = ½ × t × at
      </Label>
      <Label x={p.sx(0.7)} y={p.sy(U + 0.1)} className="dg-text-small dg-bold">
        = ½at²
      </Label>
      {/* v − u = at */}
      <Arrow x1={p.sx(1) + 16} y1={p.sy(U)} x2={p.sx(1) + 16} y2={p.sy(V)} className="dg-thin" head={7} double />
      <Label x={p.sx(1) + 24} y={p.sy((U + V) / 2) - 9} anchor="start" className="dg-text-small">
        v − u
      </Label>
      <Label x={p.sx(1) + 24} y={p.sy((U + V) / 2) + 9} anchor="start" className="dg-text-small">
        = at
      </Label>

      {/* summary panel */}
      <rect x={444} y={58} width={166} height={190} rx={10} className="dg-fill-muted" />
      <Label x={527} y={82} className="dg-text-small dg-bold">
        total area = s
      </Label>
      <Label x={456} y={112} anchor="start" className="dg-text-small">
        rectangle + triangle:
      </Label>
      <Label x={527} y={136} className="dg-text dg-bold">
        s = ut + ½at²
      </Label>
      <Label x={456} y={174} anchor="start" className="dg-text-small">
        or as one trapezium:
      </Label>
      <Label x={527} y={198} className="dg-text dg-bold">
        s = ½(u + v)t
      </Label>
      <Label x={527} y={228} className="dg-text-small dg-text-muted">
        gradient = (v − u) / t = a
      </Label>
    </Svg>
  );
}

export default EquationsMotionSuvatArea;
