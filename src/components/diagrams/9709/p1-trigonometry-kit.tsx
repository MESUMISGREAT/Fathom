/**
 * Shared furniture for the P1 trigonometry and circular-measure diagrams:
 * graph axes with custom tick labels (degrees or radians), and small geometry
 * helpers (angle arcs, right-angle marks). Not a diagram itself, so it has no
 * diagramKey and is not registered in index.ts.
 */
import { Arrow, Label } from '../primitives';
import type { Plot } from './kit';

/** Degrees to radians. */
export const rad = (deg: number) => (deg * Math.PI) / 180;
/** sin, cos, tan of an angle in degrees. */
export const sind = (d: number) => Math.sin(rad(d));
export const cosd = (d: number) => Math.cos(rad(d));
export const tand = (d: number) => Math.tan(rad(d));

export interface Tick {
  v: number;
  label?: string;
  /** Nudge the label (screen units). */
  dx?: number;
  dy?: number;
  anchor?: 'start' | 'middle' | 'end';
  className?: string;
}

/**
 * x- and y-axes through the origin, arrowheads at the positive ends, tick
 * marks and string labels. x tick labels sit below the axis by default.
 */
export function TrigAxes({
  p,
  xTicks = [],
  yTicks = [],
  xLabel = 'x',
  yLabel = 'y',
  origin = true,
}: {
  p: Plot;
  xTicks?: Tick[];
  yTicks?: Tick[];
  xLabel?: string;
  yLabel?: string;
  origin?: boolean;
}) {
  const x0 = p.sx(Math.max(p.x[0], Math.min(0, p.x[1])));
  const y0 = p.sy(0);
  return (
    <g>
      <Arrow x1={p.sx(p.x[0])} y1={y0} x2={p.sx(p.x[1]) + 10} y2={y0} className="dg-thin" head={8} />
      <Arrow x1={x0} y1={p.sy(p.y[0])} x2={x0} y2={p.sy(p.y[1]) - 8} className="dg-thin" head={8} />
      <Label x={p.sx(p.x[1]) + 12} y={y0 + 14} className="dg-text dg-italic">
        {xLabel}
      </Label>
      <Label x={x0 - 12} y={p.sy(p.y[1]) - 6} className="dg-text dg-italic">
        {yLabel}
      </Label>
      {origin && (
        <Label x={x0 - 8} y={y0 + 13} className="dg-text-small">
          O
        </Label>
      )}
      {xTicks.map((t) => (
        <g key={`xt${t.v}`}>
          <line x1={p.sx(t.v)} y1={y0 - 4} x2={p.sx(t.v)} y2={y0 + 4} className="dg-thin" />
          {t.label && (
            <Label
              x={p.sx(t.v) + (t.dx ?? 0)}
              y={y0 + 15 + (t.dy ?? 0)}
              anchor={t.anchor ?? 'middle'}
              className={t.className ?? 'dg-text-small'}
            >
              {t.label}
            </Label>
          )}
        </g>
      ))}
      {yTicks.map((t) => (
        <g key={`yt${t.v}`}>
          <line x1={x0 - 4} y1={p.sy(t.v)} x2={x0 + 4} y2={p.sy(t.v)} className="dg-thin" />
          {t.label && (
            <Label
              x={x0 - 8 + (t.dx ?? 0)}
              y={p.sy(t.v) + (t.dy ?? 0)}
              anchor={t.anchor ?? 'end'}
              className={t.className ?? 'dg-text-small'}
            >
              {t.label}
            </Label>
          )}
        </g>
      ))}
    </g>
  );
}

export type Pt = { x: number; y: number };

/** Point at distance r from c, at angle a (radians, anticlockwise from east, maths sense). */
export const polar = (c: Pt, r: number, a: number): Pt => ({ x: c.x + r * Math.cos(a), y: c.y - r * Math.sin(a) });

/** SVG arc path around c with radius r from angle a0 to a1 (radians, anticlockwise, a1 > a0). */
export function arcPath(c: Pt, r: number, a0: number, a1: number): string {
  const s = polar(c, r, a0);
  const e = polar(c, r, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large} 0 ${e.x.toFixed(2)},${e.y.toFixed(2)}`;
}

/** Closed sector path (centre, arc, back to centre). */
export function sectorPath(c: Pt, r: number, a0: number, a1: number): string {
  const s = polar(c, r, a0);
  const e = polar(c, r, a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${c.x},${c.y} L${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large} 0 ${e.x.toFixed(2)},${e.y.toFixed(2)} Z`;
}

const unit = (a: Pt, b: Pt) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return { x: (b.x - a.x) / d, y: (b.y - a.y) / d };
};

/** Right-angle mark at corner v between the directions towards a and b. */
export function RightAngle({ v, a, b, s = 11 }: { v: Pt; a: Pt; b: Pt; s?: number }) {
  const u = unit(v, a);
  const w = unit(v, b);
  return (
    <path
      d={`M${v.x + s * u.x},${v.y + s * u.y} L${v.x + s * (u.x + w.x)},${v.y + s * (u.y + w.y)} L${v.x + s * w.x},${v.y + s * w.y}`}
      className="dg-thin"
    />
  );
}

/**
 * Graph furniture with labels kept clear of the curves: dashed verticals at the
 * x ticks with their labels in a row under the plotting frame, light horizontal
 * lines at the y ticks with labels in the left margin, and arrowed axes.
 */
export function GraphFrame({
  p,
  xTicks = [],
  yTicks = [],
  xLabel = 'x',
  yLabel = 'y',
  below = 14,
}: {
  p: Plot;
  xTicks?: Tick[];
  yTicks?: Tick[];
  xLabel?: string;
  yLabel?: string;
  /** Gap between the bottom of the frame and the x tick labels. */
  below?: number;
}) {
  const top = p.sy(p.y[1]);
  const bot = p.sy(p.y[0]);
  const left = p.sx(p.x[0]);
  const right = p.sx(p.x[1]);
  const x0 = p.sx(Math.max(p.x[0], Math.min(0, p.x[1])));
  const y0 = p.sy(0);
  return (
    <g>
      {xTicks.map((t) => (
        <line key={`gx${t.v}`} x1={p.sx(t.v)} y1={top} x2={p.sx(t.v)} y2={bot} className="dg-grid dg-dashed" />
      ))}
      {yTicks.map((t) => (
        <line key={`gy${t.v}`} x1={left} y1={p.sy(t.v)} x2={right} y2={p.sy(t.v)} className="dg-grid" />
      ))}
      <Arrow x1={left} y1={y0} x2={right + 12} y2={y0} className="dg-thin" head={7} />
      <Arrow x1={x0} y1={bot} x2={x0} y2={top - 10} className="dg-thin" head={7} />
      <Label x={right + 16} y={y0 + 12} className="dg-text-small dg-italic">
        {xLabel}
      </Label>
      <Label x={x0 + 10} y={top - 8} className="dg-text-small dg-italic">
        {yLabel}
      </Label>
      {xTicks.map((t) =>
        t.label ? (
          <Label
            key={`lx${t.v}`}
            x={p.sx(t.v) + (t.dx ?? 0)}
            y={bot + below + (t.dy ?? 0)}
            anchor={t.anchor ?? 'middle'}
            className={t.className ?? 'dg-text-small'}
          >
            {t.label}
          </Label>
        ) : null,
      )}
      {yTicks.map((t) =>
        t.label ? (
          <Label
            key={`ly${t.v}`}
            x={left - 6 + (t.dx ?? 0)}
            y={p.sy(t.v) + (t.dy ?? 0)}
            anchor={t.anchor ?? 'end'}
            className={t.className ?? 'dg-text-small'}
          >
            {t.label}
          </Label>
        ) : null,
      )}
    </g>
  );
}

/** A Plot whose x- and y-ranges fill the rectangle (left, top, width, height) exactly. */
export function frame(left: number, top: number, width: number, height: number, x: [number, number], y: [number, number]): Plot {
  return {
    sx: (v: number) => left + ((v - x[0]) / (x[1] - x[0])) * width,
    sy: (v: number) => top + height - ((v - y[0]) / (y[1] - y[0])) * height,
    x,
    y,
  };
}
