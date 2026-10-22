/**
 * Shared graph furniture for the equations-of-motion diagrams (topic 2.1).
 * Not a diagram itself (no diagramKey), so it is not registered in index.ts.
 *
 * makePlot() maps physics coordinates (t, s, v ...) into a plotting box whose
 * top-left corner is (left, top) in SVG units; y increases upwards.
 * MotionAxes draws a time axis along the zero line of y (or the bottom of the
 * box if zero is outside the range) and a y-axis at the left edge, with
 * arrowheads, Cambridge-style labels ("t / s", "v / m s⁻¹") and ticks.
 */
import { Arrow, Label } from '../primitives';

export interface Plot {
  sx: (x: number) => number;
  sy: (y: number) => number;
  x: [number, number];
  y: [number, number];
}

export function makePlot(o: { left: number; top: number; width: number; height: number; x: [number, number]; y: [number, number] }): Plot {
  const sx = (x: number) => o.left + ((x - o.x[0]) / (o.x[1] - o.x[0])) * o.width;
  const sy = (y: number) => o.top + o.height - ((y - o.y[0]) / (o.y[1] - o.y[0])) * o.height;
  return { sx, sy, x: o.x, y: o.y };
}

/** Path through f(x) for x in [from, to], mapped by the plot. Values outside the y-range are skipped. */
export function curve(p: Plot, f: (x: number) => number, from: number, to: number, steps = 160): string {
  let d = '';
  let pen = false;
  for (let i = 0; i <= steps; i++) {
    const x = from + ((to - from) * i) / steps;
    const y = f(x);
    if (!Number.isFinite(y) || y < p.y[0] - 1e-9 || y > p.y[1] + 1e-9) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${p.sx(x).toFixed(2)},${p.sy(y).toFixed(2)} `;
    pen = true;
  }
  return d.trim();
}

/** Polyline through data points in plot coordinates. */
export function poly(p: Plot, pts: Array<[number, number]>): string {
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${p.sx(x).toFixed(2)},${p.sy(y).toFixed(2)}`).join(' ');
}

const fmtDefault = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);

export function MotionAxes({
  p,
  xLabel,
  yLabel,
  xTicks = [],
  yTicks = [],
  fmtX = fmtDefault,
  fmtY = fmtDefault,
  origin = true,
  grid = false,
  xLabelBelow = false,
}: {
  p: Plot;
  xLabel: string;
  yLabel: string;
  xTicks?: number[];
  yTicks?: number[];
  fmtX?: (n: number) => string;
  fmtY?: (n: number) => string;
  /** Print "0" at the origin. */
  origin?: boolean;
  /** Light grid lines at the ticks. */
  grid?: boolean;
  /** Put the x-axis label under the end of the axis instead of beside it. */
  xLabelBelow?: boolean;
}) {
  const zeroInside = p.y[0] <= 0 && p.y[1] >= 0;
  const yAxisAt = zeroInside ? 0 : p.y[0];
  const ax = p.sy(yAxisAt);
  const left = p.sx(p.x[0]);
  const right = p.sx(p.x[1]);
  const top = p.sy(p.y[1]);
  const bottom = p.sy(p.y[0]);
  const tickLabelY = p.y[0] < 0 ? ax + 13 : ax + 14;
  return (
    <g>
      {grid && (
        <g>
          {xTicks.map((t) => (
            <line key={`gx${t}`} x1={p.sx(t)} y1={top} x2={p.sx(t)} y2={bottom} className="dg-grid" />
          ))}
          {yTicks.map((t) => (
            <line key={`gy${t}`} x1={left} y1={p.sy(t)} x2={right} y2={p.sy(t)} className="dg-grid" />
          ))}
        </g>
      )}
      <Arrow x1={left} y1={ax} x2={right + 12} y2={ax} className="dg-thin" head={8} />
      <Arrow x1={left} y1={bottom} x2={left} y2={top - 12} className="dg-thin" head={8} />
      {xLabelBelow ? (
        <Label x={right + 6} y={ax + 16} anchor="end" className="dg-text-small dg-italic">
          {xLabel}
        </Label>
      ) : (
        <Label x={right + 16} y={ax} anchor="start" className="dg-text-small dg-italic">
          {xLabel}
        </Label>
      )}
      <Label x={left + 6} y={top - 16} anchor="start" className="dg-text-small dg-italic">
        {yLabel}
      </Label>
      {origin && (
        <Label x={left - 7} y={ax + 11} anchor="end" className="dg-text-small">
          0
        </Label>
      )}
      {xTicks.map((t) => (
        <g key={`xt${t}`}>
          <line x1={p.sx(t)} y1={ax - 3} x2={p.sx(t)} y2={ax + 3} className="dg-thin" />
          <Label x={p.sx(t)} y={tickLabelY} className="dg-text-small">
            {fmtX(t)}
          </Label>
        </g>
      ))}
      {yTicks.map((t) => (
        <g key={`yt${t}`}>
          <line x1={left - 3} y1={p.sy(t)} x2={left + 3} y2={p.sy(t)} className="dg-thin" />
          <Label x={left - 7} y={p.sy(t)} anchor="end" className="dg-text-small">
            {fmtY(t)}
          </Label>
        </g>
      ))}
    </g>
  );
}
