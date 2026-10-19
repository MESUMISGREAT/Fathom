/**
 * Shared graph furniture for 9709 diagrams: a plotting frame built on axes(),
 * a light integer grid, and x/y axes with arrowheads and tick labels.
 * Not a diagram itself, so it is not registered in index.ts.
 */
import { Arrow, Label, axes } from '../primitives';

export interface Plot {
  sx: (x: number) => number;
  sy: (y: number) => number;
  x: [number, number];
  y: [number, number];
}

export function makePlot(opts: { width: number; height: number; pad: number; x: [number, number]; y: [number, number] }): Plot {
  const { sx, sy } = axes(opts);
  return { sx, sy, x: opts.x, y: opts.y };
}

/** Integers in [lo, hi]. */
export function ints(lo: number, hi: number): number[] {
  const out: number[] = [];
  for (let i = Math.ceil(lo); i <= Math.floor(hi); i++) out.push(i);
  return out;
}

/** Light grid lines at every integer inside the plotting range. */
export function Grid({ p }: { p: Plot }) {
  return (
    <g>
      {ints(p.x[0], p.x[1]).map((x) => (
        <line key={`gx${x}`} x1={p.sx(x)} y1={p.sy(p.y[0])} x2={p.sx(x)} y2={p.sy(p.y[1])} className="dg-grid" />
      ))}
      {ints(p.y[0], p.y[1]).map((y) => (
        <line key={`gy${y}`} x1={p.sx(p.x[0])} y1={p.sy(y)} x2={p.sx(p.x[1])} y2={p.sy(y)} className="dg-grid" />
      ))}
    </g>
  );
}

/**
 * x- and y-axes through the origin with arrowheads at the positive ends,
 * small tick marks, tick labels and an "O" at the origin.
 */
export function AxesXY({
  p,
  xTicks = [],
  yTicks = [],
  yTicksRight = [],
  xLabel = 'x',
  yLabel = 'y',
}: {
  p: Plot;
  xTicks?: number[];
  yTicks?: number[];
  /** y ticks whose labels go to the right of the axis (where a curve would cover the left). */
  yTicksRight?: number[];
  xLabel?: string;
  yLabel?: string;
}) {
  const x0 = p.sx(0);
  const y0 = p.sy(0);
  const fmt = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);
  return (
    <g>
      <Arrow x1={p.sx(p.x[0])} y1={y0} x2={p.sx(p.x[1]) + 8} y2={y0} className="dg-thin" head={8} />
      <Arrow x1={x0} y1={p.sy(p.y[0])} x2={x0} y2={p.sy(p.y[1]) - 8} className="dg-thin" head={8} />
      <Label x={p.sx(p.x[1]) + 8} y={y0 + 15} className="dg-text dg-italic">
        {xLabel}
      </Label>
      <Label x={x0 - 13} y={p.sy(p.y[1]) - 6} className="dg-text dg-italic">
        {yLabel}
      </Label>
      <Label x={x0 - 9} y={y0 + 13} className="dg-text-small">
        O
      </Label>
      {xTicks.map((t) => (
        <g key={`xt${t}`}>
          <line x1={p.sx(t)} y1={y0 - 4} x2={p.sx(t)} y2={y0 + 4} className="dg-thin" />
          <Label x={p.sx(t)} y={y0 + 15} className="dg-text-small">
            {fmt(t)}
          </Label>
        </g>
      ))}
      {yTicks.map((t) => (
        <g key={`yt${t}`}>
          <line x1={x0 - 4} y1={p.sy(t)} x2={x0 + 4} y2={p.sy(t)} className="dg-thin" />
          <Label x={x0 - 8} y={p.sy(t)} anchor="end" className="dg-text-small">
            {fmt(t)}
          </Label>
        </g>
      ))}
      {yTicksRight.map((t) => (
        <g key={`ytr${t}`}>
          <line x1={x0 - 4} y1={p.sy(t)} x2={x0 + 4} y2={p.sy(t)} className="dg-thin" />
          <Label x={x0 + 8} y={p.sy(t)} anchor="start" className="dg-text-small">
            {fmt(t)}
          </Label>
        </g>
      ))}
    </g>
  );
}
