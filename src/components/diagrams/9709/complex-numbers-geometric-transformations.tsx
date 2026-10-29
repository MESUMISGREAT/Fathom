/**
 * Four Argand diagrams showing:
 * (1) Conjugation as reflection in the real axis
 * (2) Addition as translation by a vector
 * (3) Multiplication by i as 90° anticlockwise rotation
 * (4) Division by 2 as shrinking by factor 1/2
 */
import { Svg, Arrow, MathLabel, Label } from '../primitives';

export const diagramKey = 'complex-numbers-geometric-transformations';

const W = 640;
const H = 600;
const PAD = 30;
const CELL_W = 300;
const CELL_H = 270;
const GAP = 20;

function drawAxes(x0: number, y0: number, s: number, label = '') {
  return (
    <g>
      <Arrow x1={x0 - 2.5 * s} y1={y0} x2={x0 + 2.5 * s} y2={y0} className="dg-thin" head={6} />
      <Arrow x1={x0} y1={y0 + 2.5 * s} x2={x0} y2={y0 - 2.5 * s} className="dg-thin" head={6} />
      <MathLabel x={x0 + 2.6 * s} y={y0 + 4} tex="\\Re" anchor="start" w={24} h={20} size="small" />
      <MathLabel x={x0 - 10} y={y0 - 2.6 * s - 4} tex="\\Im" anchor="end" w={24} h={20} size="small" />
      {label && <Label x={x0} y={y0 - CELL_H / 2 - 8} className="dg-bold">{label}</Label>}
    </g>
  );
}

function drawPoint(x: number, y: number, r = 5, cls = 'dg-dot') {
  return <circle cx={x} cy={y} r={r} className={cls} />;
}

export default function ComplexNumbersGeometricTransformations() {
  // Cell origins (bottom-left of each cell)
  const c1 = { x: PAD, y: PAD + CELL_H };
  const c2 = { x: PAD + CELL_W + GAP, y: PAD + CELL_H };
  const c3 = { x: PAD, y: PAD };
  const c4 = { x: PAD + CELL_W + GAP, y: PAD };
  const scale = 40;

  return (
    <Svg width={W} height={H}>
      {/* --- Cell 1: Conjugation --- */}
      <g transform={`translate(${c1.x}, ${c1.y})`}>
        {drawAxes(CELL_W / 2, CELL_H / 2, scale, 'Conjugation: reflection in real axis')}
        {/* Original point */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 1.5 * scale}
          y2={CELL_H / 2 - 1 * scale}
          className="dg-accent"
          head={8}
        />
        <MathLabel x={CELL_W / 2 + 1.7 * scale} y={CELL_H / 2 - 1.1 * scale} tex="z = 1.5 + i" anchor="start" w={100} h={24} size="small" tone="accent" />
        {drawPoint(CELL_W / 2 + 1.5 * scale, CELL_H / 2 - 1 * scale)}
        {/* Conjugate point */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 1.5 * scale}
          y2={CELL_H / 2 + 1 * scale}
          className="dg-accent-2"
          head={8}
        />
        <MathLabel x={CELL_W / 2 + 1.7 * scale} y={CELL_H / 2 + 1.1 * scale} tex="z^* = 1.5 - i" anchor="start" w={100} h={24} size="small" tone="accent-2" />
        {drawPoint(CELL_W / 2 + 1.5 * scale, CELL_H / 2 + 1 * scale, 5, 'dg-dot-accent-2')}
        {/* Reflection line (real axis) */}
        <line x1={CELL_W / 2 - 2.5 * scale} y1={CELL_H / 2} x2={CELL_W / 2 + 2.5 * scale} y2={CELL_H / 2} className="dg-dashed dg-muted" strokeWidth={1.5} />
        <Label x={CELL_W / 2 + 2.6 * scale} y={CELL_H / 2 + 16} className="dg-text-small dg-muted">real axis</Label>
      </g>

      {/* --- Cell 2: Addition (translation) --- */}
      <g transform={`translate(${c2.x}, ${c2.y})`}>
        {drawAxes(CELL_W / 2, CELL_H / 2, scale, 'Addition: translation by w = 1 + i')}
        {/* Original z */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 0.8 * scale}
          y2={CELL_H / 2 + 1.2 * scale}
          className="dg-accent"
          head={8}
        />
        <MathLabel x={CELL_W / 2 + 1.0 * scale} y={CELL_H / 2 + 1.4 * scale} tex="z" anchor="start" w={40} h={24} size="small" tone="accent" />
        {/* w vector from origin */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 1.0 * scale}
          y2={CELL_H / 2 - 1.0 * scale}
          className="dg-muted"
          head={6}
        />
        <MathLabel x={CELL_W / 2 + 1.2 * scale} y={CELL_H / 2 - 1.2 * scale} tex="w = 1 + i" anchor="start" w={80} h={24} size="small" tone="muted" />
        {/* z + w */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 1.8 * scale}
          y2={CELL_H / 2 + 0.2 * scale}
          className="dg-accent-2"
          head={8}
        />
        <MathLabel x={CELL_W / 2 + 2.0 * scale} y={CELL_H / 2 + 0.4 * scale} tex="z + w" anchor="start" w={60} h={24} size="small" tone="accent-2" />
        {drawPoint(CELL_W / 2 + 1.8 * scale, CELL_H / 2 + 0.2 * scale, 5, 'dg-dot-accent-2')}
        {/* Dashed copy of w from z */}
        <Arrow
          x1={CELL_W / 2 + 0.8 * scale}
          y1={CELL_H / 2 + 1.2 * scale}
          x2={CELL_W / 2 + 1.8 * scale}
          y2={CELL_H / 2 + 0.2 * scale}
          className="dg-dashed dg-muted"
          head={6}
        />
      </g>

      {/* --- Cell 3: Multiplication by i (rotation) --- */}
      <g transform={`translate(${c3.x}, ${c3.y})`}>
        {drawAxes(CELL_W / 2, CELL_H / 2, scale, 'Multiplication by i: rotation by 90°')}
        {/* Original z */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 1.5 * scale}
          y2={CELL_H / 2 + 1.0 * scale}
          className="dg-accent"
          head={8}
        />
        <MathLabel x={CELL_W / 2 + 1.7 * scale} y={CELL_H / 2 + 1.2 * scale} tex="z" anchor="start" w={40} h={24} size="small" tone="accent" />
        {drawPoint(CELL_W / 2 + 1.5 * scale, CELL_H / 2 + 1.0 * scale)}
        {/* iz */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 - 1.0 * scale}
          y2={CELL_H / 2 + 1.5 * scale}
          className="dg-accent-2"
          head={8}
        />
        <MathLabel x={CELL_W / 2 - 1.3 * scale} y={CELL_H / 2 + 1.7 * scale} tex="iz" anchor="end" w={50} h={24} size="small" tone="accent-2" />
        {drawPoint(CELL_W / 2 - 1.0 * scale, CELL_H / 2 + 1.5 * scale, 5, 'dg-dot-accent-2')}
        {/* Arc indicating 90° rotation */}
        <path
          d={`M${CELL_W / 2 + 0.6 * scale},${CELL_H / 2} A${0.6 * scale},${0.6 * scale} 0 0,1 ${CELL_W / 2},${CELL_H / 2 - 0.6 * scale}`}
          className="dg-accent"
          fill="none"
          strokeWidth={2}
        />
        <MathLabel x={CELL_W / 2 + 0.7 * scale} y={CELL_H / 2 - 0.9 * scale} tex="\\frac{\\pi}{2}" anchor="middle" w={40} h={24} size="small" tone="accent" />
      </g>

      {/* --- Cell 4: Division by 2 (shrinking) --- */}
      <g transform={`translate(${c4.x}, ${c4.y})`}>
        {drawAxes(CELL_W / 2, CELL_H / 2, scale, 'Division by 2: shrinking by factor 1/2')}
        {/* Original z */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 1.6 * scale}
          y2={CELL_H / 2 + 1.2 * scale}
          className="dg-accent"
          head={8}
        />
        <MathLabel x={CELL_W / 2 + 1.8 * scale} y={CELL_H / 2 + 1.4 * scale} tex="z" anchor="start" w={40} h={24} size="small" tone="accent" />
        {drawPoint(CELL_W / 2 + 1.6 * scale, CELL_H / 2 + 1.2 * scale)}
        {/* z/2 */}
        <Arrow
          x1={CELL_W / 2}
          y1={CELL_H / 2}
          x2={CELL_W / 2 + 0.8 * scale}
          y2={CELL_H / 2 + 0.6 * scale}
          className="dg-accent-2"
          head={8}
        />
        <MathLabel x={CELL_W / 2 + 1.0 * scale} y={CELL_H / 2 + 0.8 * scale} tex="\dfrac{z}{2}" anchor="start" w={50} h={28} size="small" tone="accent-2" />
        {drawPoint(CELL_W / 2 + 0.8 * scale, CELL_H / 2 + 0.6 * scale, 5, 'dg-dot-accent-2')}
        {/* Dashed circle showing original distance */}
        <circle cx={CELL_W / 2} cy={CELL_H / 2} r={Math.sqrt(1.6 * 1.6 + 1.2 * 1.2) * scale} className="dg-dashed dg-muted" fill="none" strokeWidth={1} />
        {/* Dashed circle showing new distance */}
        <circle cx={CELL_W / 2} cy={CELL_H / 2} r={Math.sqrt(0.8 * 0.8 + 0.6 * 0.6) * scale} className="dg-dashed dg-accent-2" fill="none" strokeWidth={1} />
      </g>
    </Svg>
  );
}