/**
 * Four Argand diagrams for the loci lesson, each drawn to scale:
 * (1) circle |z - a| = r with a = 1 + i, r = 1.5;
 * (2) perpendicular bisector |z - a| = |z - b| with a = -1 - 1.5i, b = 2 + 0.5i (through the midpoint,
 *     at right angles to ab);
 * (3) half-line arg(z - a) = pi/4 from a = -1.5 - i, with a excluded;
 * (4) the region |z - 2 - 2i| <= 2 and |z| <= |z - 4|: the left half of the disc, boundaries solid.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'complex-numbers-loci-summary';

const W = 660;
const H = 640;
const S = 38; // pixels per unit

type Range = [number, number];
function frame(px: number, py: number, xr: Range, yr: Range) {
  const X = (x: number) => px + 20 + (x - xr[0]) * S;
  const Y = (y: number) => py + 20 + (yr[1] - y) * S;
  const axes = (
    <g>
      <line x1={X(xr[0])} y1={Y(0)} x2={X(xr[1])} y2={Y(0)} className="dg-line dg-thin" />
      <line x1={X(0)} y1={Y(yr[0])} x2={X(0)} y2={Y(yr[1])} className="dg-line dg-thin" />
      <Label x={X(xr[1]) - 4} y={Y(0) - 10} anchor="end" className="dg-text-small dg-text-muted">
        Re
      </Label>
      <Label x={X(0) + 6} y={Y(yr[1]) + 8} anchor="start" className="dg-text-small dg-text-muted">
        Im
      </Label>
    </g>
  );
  const bottom = Y(yr[0]);
  return { X, Y, axes, bottom, mid: (X(xr[0]) + X(xr[1])) / 2 };
}

export default function ComplexNumbersLociSummary() {
  const A = frame(0, 0, [-3, 4], [-3, 3]);
  const B = frame(330, 0, [-3, 4], [-3, 3]);
  const C = frame(0, 320, [-3, 4], [-3, 3]);
  const D = frame(330, 320, [-1.5, 5.5], [-1, 5]);

  // Panel B: perpendicular bisector of a and b, gradient -3/2 through the midpoint (0.5, -0.5).
  const bis = (x: number) => -0.5 - 1.5 * (x - 0.5);
  // Panel C: angle arc of radius 0.7 from the rightward direction to pi/4.
  const r = 0.7;
  const c45 = Math.SQRT1_2;

  return (
    <Svg width={W} height={H}>
      {/* 1. Circle */}
      {A.axes}
      <circle cx={A.X(1)} cy={A.Y(1)} r={1.5 * S} className="dg-accent" fill="none" strokeWidth={3} />
      <line x1={A.X(1)} y1={A.Y(1)} x2={A.X(2.5)} y2={A.Y(1)} className="dg-line dg-dashed" />
      <circle cx={A.X(1)} cy={A.Y(1)} r={4} className="dg-dot" />
      <MathLabel x={A.X(0.85)} y={A.Y(1.35)} tex="a" w={30} />
      <MathLabel x={A.X(1.75)} y={A.Y(1.35)} tex="r" w={30} />
      <MathLabel x={A.mid} y={A.bottom + 22} tex="\lvert z - a \rvert = r" w={300} />
      <Label x={A.mid} y={A.bottom + 48} className="dg-text-small dg-text-muted">
        circle: centre a, radius r
      </Label>

      {/* 2. Perpendicular bisector */}
      {B.axes}
      <line x1={B.X(-1)} y1={B.Y(-1.5)} x2={B.X(2)} y2={B.Y(0.5)} className="dg-line dg-dashed" />
      <line x1={B.X(-1.3)} y1={B.Y(bis(-1.3))} x2={B.X(2.1)} y2={B.Y(bis(2.1))} className="dg-accent" strokeWidth={3} />
      <circle cx={B.X(-1)} cy={B.Y(-1.5)} r={5} className="dg-dot-accent-2" />
      <circle cx={B.X(2)} cy={B.Y(0.5)} r={5} className="dg-dot-accent-2" />
      <circle cx={B.X(0.5)} cy={B.Y(-0.5)} r={3.5} className="dg-dot" />
      <MathLabel x={B.X(-1.35)} y={B.Y(-1.75)} tex="a" w={30} />
      <MathLabel x={B.X(2.35)} y={B.Y(0.75)} tex="b" w={30} />
      <Label x={B.X(0.75)} y={B.Y(-0.85)} anchor="start" className="dg-text-small dg-text-muted">
        midpoint
      </Label>
      <MathLabel x={B.mid} y={B.bottom + 22} tex="\lvert z - a \rvert = \lvert z - b \rvert" w={300} />
      <Label x={B.mid} y={B.bottom + 48} className="dg-text-small dg-text-muted">
        perpendicular bisector of a and b
      </Label>

      {/* 3. Half-line */}
      {C.axes}
      <line x1={C.X(-1.5)} y1={C.Y(-1)} x2={C.X(0.1)} y2={C.Y(-1)} className="dg-line dg-dashed" />
      <line x1={C.X(-1.5) + 4} y1={C.Y(-1) - 4} x2={C.X(2.3)} y2={C.Y(2.8)} className="dg-accent" strokeWidth={3} />
      <path
        d={`M ${C.X(-1.5 + r)} ${C.Y(-1)} A ${r * S} ${r * S} 0 0 0 ${C.X(-1.5 + r * c45)} ${C.Y(-1 + r * c45)}`}
        className="dg-accent-2"
        fill="none"
        strokeWidth={2}
      />
      <circle cx={C.X(-1.5)} cy={C.Y(-1)} r={5} className="dg-fill-surface dg-accent" strokeWidth={2} />
      <MathLabel x={C.X(-1.8)} y={C.Y(-1.35)} tex="a" w={30} />
      <MathLabel x={C.X(-1.5 + 1.05)} y={C.Y(-1 + 0.3)} tex="\theta" w={30} tone="accent-2" />
      <MathLabel x={C.mid} y={C.bottom + 22} tex="\arg(z - a) = \theta" w={300} />
      <Label x={C.mid} y={C.bottom + 48} className="dg-text-small dg-text-muted">
        half-line from a (a itself excluded)
      </Label>

      {/* 4. Region: left half of the disc */}
      {D.axes}
      <path
        d={`M ${D.X(2)} ${D.Y(4)} A ${2 * S} ${2 * S} 0 0 0 ${D.X(2)} ${D.Y(0)} Z`}
        className="dg-fill-accent"
      />
      <circle cx={D.X(2)} cy={D.Y(2)} r={2 * S} className="dg-accent" fill="none" strokeWidth={2.5} />
      <line x1={D.X(2)} y1={D.Y(-0.8)} x2={D.X(2)} y2={D.Y(4.8)} className="dg-accent-2" strokeWidth={2.5} />
      <circle cx={D.X(2)} cy={D.Y(2)} r={3.5} className="dg-dot" />
      <Label x={D.X(2.15)} y={D.Y(4.6)} anchor="start" className="dg-text-small dg-text-accent-2">
        x = 2
      </Label>
      <Label x={D.X(1)} y={D.Y(2)} className="dg-text-small dg-text-accent">
        shaded
      </Label>
      <MathLabel x={D.mid} y={D.bottom + 22} tex="\lvert z - 2 - 2i \rvert \leqslant 2,\ \lvert z \rvert \leqslant \lvert z - 4 \rvert" w={320} />
      <Label x={D.mid} y={D.bottom + 48} className="dg-text-small dg-text-muted">
        region: both rules hold, boundaries solid
      </Label>
    </Svg>
  );
}
