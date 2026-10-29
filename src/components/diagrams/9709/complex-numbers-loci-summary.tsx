/**
 * Four Argand diagrams showing the four fundamental loci:
 * (1) Circle |z - a| = r
 * (2) Perpendicular bisector |z - a| = |z - b|
 * (3) Half-line arg(z - a) = theta
 * (4) Combined region |z - a| < r and arg(z - a) >= theta
 */
import { Svg, Arrow, MathLabel, Label } from '../primitives';

export const diagramKey = 'complex-numbers-loci-summary';

const W = 640;
const H = 600;
const PAD = 30;
const CELL_W = 300;
const CELL_H = 270;
const GAP = 20;

function drawAxes(x0: number, y0: number, s: number) {
  return (
    <g>
      <Arrow x1={x0 - 2.5 * s} y1={y0} x2={x0 + 2.5 * s} y2={y0} className="dg-thin" head={6} />
      <Arrow x1={x0} y1={y0 + 2.5 * s} x2={x0} y2={y0 - 2.5 * s} className="dg-thin" head={6} />
      <MathLabel x={x0 + 2.6 * s} y={y0 + 4} tex="\\Re" anchor="start" w={24} h={20} size="small" />
      <MathLabel x={x0 - 10} y={y0 - 2.6 * s - 4} tex="\\Im" anchor="end" w={24} h={20} size="small" />
    </g>
  );
}

function drawPoint(x: number, y: number, cls = 'dg-dot', r = 5) {
  return <circle cx={x} cy={y} r={r} className={cls} />;
}

export default function ComplexNumbersLociSummary() {
  // Cell origins (bottom-left of each cell)
  const c1 = { x: PAD, y: PAD + CELL_H };
  const c2 = { x: PAD + CELL_W + GAP, y: PAD + CELL_H };
  const c3 = { x: PAD, y: PAD };
  const c4 = { x: PAD + CELL_W + GAP, y: PAD };
  const scale = 40;

  return (
    <Svg width={W} height={H}>
      {/* --- Cell 1: Circle |z - a| = r --- */}
      <g transform={`translate(${c1.x}, ${c1.y})`}>
        {drawAxes(CELL_W / 2, CELL_H / 2, scale)}
        <Label x={CELL_W / 2} y={CELL_H - 10} className="dg-bold">|z - a| = r</Label>
        <Label x={CELL_W / 2} y={CELL_H - 28} className="dg-text-small dg-muted">circle, centre a, radius r</Label>
        {/* Centre a */}
        {drawPoint(CELL_W / 2 + 0.5 * scale, CELL_H / 2 + 0.5 * scale, 'dg-dot-accent', 6)}
        <MathLabel x={CELL_W / 2 + 0.7 * scale} y={CELL_H / 2 + 0.7 * scale} tex="a" anchor="start" w={30} h={24} size="small" tone="accent" />
        {/* Circle */}
        <circle cx={CELL_W / 2 + 0.5 * scale} cy={CELL_H / 2 + 0.5 * scale} r={1.5 * scale} className="dg-line" fill="none" strokeWidth={2} />
        {/* Radius line */}
        <Arrow
          x1={CELL_W / 2 + 0.5 * scale}
          y1={CELL_H / 2 + 0.5 * scale}
          x2={CELL_W / 2 + 2.0 * scale}
          y2={CELL_H / 2 + 0.5 * scale}
          className="dg-dashed dg-muted"
          head={4}
        />
        <MathLabel x={CELL_W / 2 + 1.25 * scale} y={CELL_H / 2 + 0.3 * scale} tex="r" anchor="middle" w={30} h={20} size="small" tone="muted" />
      </g>

      {/* --- Cell 2: Perpendicular bisector |z - a| = |z - b| --- */}
      <g transform={`translate(${c2.x}, ${c2.y})`}>
        {drawAxes(CELL_W / 2, CELL_H / 2, scale)}
        <Label x={CELL_W / 2} y={CELL_H - 10} className="dg-bold">|z - a| = |z - b|</Label>
        <Label x={CELL_W / 2} y={CELL_H - 28} className="dg-text-small dg-muted">perpendicular bisector of ab</Label>
        {/* Points a and b */}
        {drawPoint(CELL_W / 2 - 1.0 * scale, CELL_H / 2 - 0.5 * scale, 'dg-dot-accent', 5)}
        <MathLabel x={CELL_W / 2 - 1.2 * scale} y={CELL_H / 2 - 0.7 * scale} tex="a" anchor="end" w={30} h={24} size="small" tone="accent" />
        {drawPoint(CELL_W / 2 + 1.0 * scale, CELL_H / 2 + 0.5 * scale, 'dg-dot-accent-2', 5)}
        <MathLabel x={CELL_W / 2 + 1.2 * scale} y={CELL_H / 2 + 0.7 * scale} tex="b" anchor="start" w={30} h={24} size="small" tone="accent-2" />
        {/* Segment ab (dashed) */}
        <line x1={CELL_W / 2 - 1.0 * scale} y1={CELL_H / 2 - 0.5 * scale} x2={CELL_W / 2 + 1.0 * scale} y2={CELL_H / 2 + 0.5 * scale} className="dg-dashed dg-muted" strokeWidth={1.5} />
        {/* Midpoint */}
        {drawPoint(CELL_W / 2, CELL_H / 2, 'dg-dot-muted', 4)}
        <MathLabel x={CELL_W / 2 - 8} y={CELL_H / 2 - 8} tex="\\frac{a+b}{2}" anchor="end" w={60} h={24} size="small" tone="muted" />
        {/* Perpendicular bisector line */}
        <line x1={CELL_W / 2 - 2.5 * scale} y1={CELL_H / 2 + 2.5 * scale} x2={CELL_W / 2 + 2.5 * scale} y2={CELL_H / 2 - 2.5 * scale} className="dg-accent" strokeWidth={2} />
        <MathLabel x={CELL_W / 2 + 2.6 * scale} y={CELL_H / 2 - 2.8 * scale} tex="\\perp ab" anchor="start" w={50} h={20} size="small" tone="accent" />
      </g>

      {/* --- Cell 3: Half-line arg(z - a) = theta --- */}
      <g transform={`translate(${c3.x}, ${c3.y})`}>
        {drawAxes(CELL_W / 2, CELL_H / 2, scale)}
        <Label x={CELL_W / 2} y={CELL_H - 10} className="dg-bold">arg(z - a) = \\theta</Label>
        <Label x={CELL_W / 2} y={CELL_H - 28} className="dg-text-small dg-muted">half-line from a (excluded)</Label>
        {/* Point a */}
        {drawPoint(CELL_W / 2 + 0.5 * scale, CELL_H / 2 + 0.5 * scale, 'dg-dot-accent', 5)}
        <MathLabel x={CELL_W / 2 + 0.7 * scale} y={CELL_H / 2 + 0.7 * scale} tex="a" anchor="start" w={30} h={24} size="small" tone="accent" />
        {/* Open circle at a (excluded) */}
        <circle cx={CELL_W / 2 + 0.5 * scale} cy={CELL_H / 2 + 0.5 * scale} r={6} className="dg-accent" fill="none" strokeWidth={1.5} strokeDasharray="4,4" />
        {/* Ray at angle pi/4 */}
        <Arrow
          x1={CELL_W / 2 + 0.5 * scale}
          y1={CELL_H / 2 + 0.5 * scale}
          x2={CELL_W / 2 + 2.5 * scale}
          y2={CELL_H / 2 - 1.5 * scale}
          className="dg-line"
          head={8}
        />
        {/* Arc for angle */}
        <path
          d={`M${CELL_W / 2 + 0.8 * scale},${CELL_H / 2 + 0.5 * scale} A${0.3 * scale},${0.3 * scale} 0 0,1 ${CELL_W / 2 + 0.5 * scale + 0.21 * scale},${CELL_H / 2 + 0.5 * scale - 0.21 * scale}`}
          className="dg-accent"
          fill="none"
          strokeWidth={2}
        />
        <MathLabel x={CELL_W / 2 + 0.9 * scale} y={CELL_H / 2 + 0.3 * scale} tex="\\theta = \\frac{\\pi}{4}" anchor="middle" w={80} h={24} size="small" tone="accent" />
      </g>

      {/* --- Cell 4: Combined region --- */}
      <g transform={`translate(${c4.x}, ${c4.y})`}>
        {drawAxes(CELL_W / 2, CELL_H / 2, scale)}
        <Label x={CELL_W / 2} y={CELL_H - 10} className="dg-bold">{'|z − a| < r,  arg(z − a) ≥ 0'}</Label>
        <Label x={CELL_W / 2} y={CELL_H - 28} className="dg-text-small dg-muted">upper half of open disc</Label>
        {/* Centre a */}
        {drawPoint(CELL_W / 2, CELL_H / 2, 'dg-dot-accent', 5)}
        <MathLabel x={CELL_W / 2 - 8} y={CELL_H / 2 - 8} tex="a" anchor="end" w={30} h={24} size="small" tone="accent" />
        {/* Dashed circle (open boundary) */}
        <circle cx={CELL_W / 2} cy={CELL_H / 2} r={1.5 * scale} className="dg-dashed dg-line" fill="none" strokeWidth={1.5} />
        {/* Solid ray for arg = 0 (positive real axis from a) */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 2.5 * scale}
          y2={CELL_H / 2}
          className="dg-accent"
          head={8}
        />
        <MathLabel x={CELL_W / 2 + 2.6 * scale} y={CELL_H / 2 - 8} tex="\\arg = 0" anchor="start" w={50} h={20} size="small" tone="accent" />
        {/* Shaded region: upper half of disc */}
        <path
          d={`M${CELL_W / 2},${CELL_H / 2} L${CELL_W / 2 + 1.5 * scale},${CELL_H / 2} A${1.5 * scale},${1.5 * scale} 0 0,1 ${CELL_W / 2 - 1.5 * scale},${CELL_H / 2} Z`}
          className="dg-fill-accent"
          opacity={0.2}
        />
      </g>
    </Svg>
  );
}