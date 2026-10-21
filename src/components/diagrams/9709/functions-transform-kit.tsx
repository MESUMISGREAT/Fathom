/**
 * Shared furniture for the functions-* transformation diagrams: two side-by-side
 * panels on the same scale, each showing y = f(x) with f(x) = x² − 2x (in ink) and
 * one transformed curve (in accent), plus arrows tracking key points.
 * Not a diagram itself (no diagramKey), so it is not registered.
 */
import type { ReactNode } from 'react';
import { Arrow, Label, graph } from '../primitives';
import { Grid, makePlot, type Plot } from './kit';

export const PW = 300;
export const PLOT_H = 300;
/** Total height of a two-panel figure. */
export const FIG_H = PLOT_H + 80;
export const X: [number, number] = [-3.2, 4.2];
export const Y: [number, number] = [-2.6, 5.4];
export const base = (x: number) => x * x - 2 * x;

export function panelPlot(): Plot {
  return makePlot({ width: PW, height: PLOT_H, pad: 26, x: X, y: Y });
}

/** A column vector (a over b) in round brackets, centred at (x, y). */
export function ColVec({ x, y, a, b }: { x: number; y: number; a: string; b: string }) {
  return (
    <g>
      <path d={`M${x - 11},${y - 17} Q${x - 18},${y} ${x - 11},${y + 17}`} className="dg-thin" />
      <path d={`M${x + 11},${y - 17} Q${x + 18},${y} ${x + 11},${y + 17}`} className="dg-thin" />
      <Label x={x} y={y - 8} className="dg-text-small">
        {a}
      </Label>
      <Label x={x} y={y + 8} className="dg-text-small">
        {b}
      </Label>
    </g>
  );
}

export interface PanelSpec {
  /** Heading above the panel, e.g. "y = f(x) + 3". */
  title: string;
  /** The transformed function. */
  g: (x: number) => number;
  /** Arrows from a point on y = f(x) to its image: [x1, y1, x2, y2]. */
  moves: Array<[number, number, number, number]>;
  /** Description under the panel. */
  footer: ReactNode;
  /** Where to write "y = f(x)" and the image's label, in maths coordinates. */
  baseLabel: [number, number, 'start' | 'end'];
  imageLabel: [number, number, 'start' | 'end'];
  imageText: string;
  /** x tick labels (leave out any that an arrow would cover). */
  xTicks?: number[];
  /** y tick labels drawn to the left of the axis (default −2, 2, 4). */
  yTicks?: number[];
  /** y tick labels drawn to the right of the axis, where a curve would cover the left. */
  yTicksRight?: number[];
  /** Leave out the "O" at the origin when both curves pass through it. */
  hideOrigin?: boolean;
}

/** x- and y-axes with arrowheads, ticks and labels (like kit's AxesXY, with an optional origin label). */
function PanelAxes({ p, xTicks, yTicks, yTicksRight, hideOrigin }: {
  p: Plot;
  xTicks: number[];
  yTicks: number[];
  yTicksRight: number[];
  hideOrigin: boolean;
}) {
  const x0 = p.sx(0);
  const y0 = p.sy(0);
  const fmt = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`);
  const yTick = (t: number, side: 'left' | 'right') => (
    <g key={`y${side}${t}`}>
      <line x1={x0 - 4} y1={p.sy(t)} x2={x0 + 4} y2={p.sy(t)} className="dg-thin" />
      <Label x={side === 'left' ? x0 - 8 : x0 + 8} y={p.sy(t)} anchor={side === 'left' ? 'end' : 'start'} className="dg-text-small">
        {fmt(t)}
      </Label>
    </g>
  );
  return (
    <g>
      <Arrow x1={p.sx(p.x[0])} y1={y0} x2={p.sx(p.x[1]) + 8} y2={y0} className="dg-thin" head={8} />
      <Arrow x1={x0} y1={p.sy(p.y[0])} x2={x0} y2={p.sy(p.y[1]) - 8} className="dg-thin" head={8} />
      <Label x={p.sx(p.x[1]) + 8} y={y0 + 15} className="dg-text dg-italic">
        x
      </Label>
      <Label x={x0 - 13} y={p.sy(p.y[1]) - 6} className="dg-text dg-italic">
        y
      </Label>
      {!hideOrigin && (
        <Label x={x0 - 9} y={y0 + 13} className="dg-text-small">
          O
        </Label>
      )}
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={p.sx(t)} y1={y0 - 4} x2={p.sx(t)} y2={y0 + 4} className="dg-thin" />
          <Label x={p.sx(t)} y={y0 + 15} className="dg-text-small">
            {fmt(t)}
          </Label>
        </g>
      ))}
      {yTicks.map((t) => yTick(t, 'left'))}
      {yTicksRight.map((t) => yTick(t, 'right'))}
    </g>
  );
}

export function Panel({ spec, index }: { spec: PanelSpec; index: number }) {
  const p = panelPlot();
  return (
    <g transform={`translate(${index * PW}, 0)`}>
      {index > 0 && <line x1={0} y1={8} x2={0} y2={PLOT_H + 72} className="dg-grid" />}
      <Label x={PW / 2} y={20} className="dg-text-accent">
        {spec.title}
      </Label>
      <g transform="translate(0, 34)">
        <Grid p={p} />
        <PanelAxes
          p={p}
          xTicks={spec.xTicks ?? [-2, -1, 1, 2, 3]}
          yTicks={spec.yTicks ?? [-2, 2, 4]}
          yTicksRight={spec.yTicksRight ?? []}
          hideOrigin={spec.hideOrigin ?? false}
        />
        <path d={graph(base, X, p, Y)} className="dg-line" />
        <path d={graph(spec.g, X, p, Y)} className="dg-accent" />
        {spec.moves.map(([x1, y1, x2, y2]) => (
          <g key={`${x1},${y1}`}>
            <circle cx={p.sx(x1)} cy={p.sy(y1)} r={3.5} className="dg-dot" />
            <Arrow
              x1={p.sx(x1)}
              y1={p.sy(y1)}
              x2={p.sx(x2)}
              y2={p.sy(y2)}
              head={8}
              className="dg-accent-2"
              headClassName="dg-dot-accent-2"
            />
          </g>
        ))}
        <Label x={p.sx(spec.baseLabel[0])} y={p.sy(spec.baseLabel[1])} anchor={spec.baseLabel[2]} className="dg-text-small dg-bold">
          y = f(x)
        </Label>
        <Label x={p.sx(spec.imageLabel[0])} y={p.sy(spec.imageLabel[1])} anchor={spec.imageLabel[2]} className="dg-text-accent">
          {spec.imageText}
        </Label>
      </g>
      <g transform={`translate(0, ${PLOT_H + 18})`}>{spec.footer}</g>
    </g>
  );
}
