/**
 * Shared SVG building blocks for lesson diagrams. Colours come from CSS
 * classes (defined in globals.css) so every diagram adapts to light/dark mode:
 *
 *   strokes: dg-line (ink, 2px), dg-thin (ink, 1.25px), dg-muted, dg-grid,
 *            dg-accent, dg-accent-2, dg-dashed (combine with a stroke class)
 *   fills:   dg-fill-accent, dg-fill-accent-2, dg-fill-muted, dg-dot, dg-dot-accent
 *   text:    dg-text, dg-text-muted, dg-text-accent, dg-text-accent-2, dg-text-small, dg-mono, dg-bold, dg-italic
 *   helpers: Svg, Arrow, Label, MathLabel, axes() + graph() for y = f(x) in maths coordinates
 *
 * Write every formula with MathLabel (LaTeX), not Label: Label is plain SVG text, which can't
 * draw a fraction bar or a root sign over a whole expression. So no "1 ⁄ (2√u)" or "√(2x³ + 5)"
 * in diagram text: use MathLabel with \dfrac{1}{2\sqrt{u}} and \sqrt{2x^3 + 5}.
 *
 * Keep text at the default 14px (dg-text) or 12px (dg-text-small) in
 * viewBox units and design for a viewBox about 480-640 wide.
 */
import katex from 'katex';
import type { ReactNode, SVGProps } from 'react';

export function Svg({
  width,
  height,
  children,
  ...rest
}: { width: number; height: number; children: ReactNode } & Omit<SVGProps<SVGSVGElement>, 'width' | 'height'>) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="dg"
      aria-hidden="true"
      focusable="false"
      style={{ maxWidth: width, aspectRatio: `${width} / ${height}` }}
      {...rest}
    >
      {children}
    </svg>
  );
}

/** A straight arrow with a filled head; no <marker> ids, so it is safe to repeat on a page. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  head = 9,
  className = 'dg-line',
  headClassName = 'dg-dot',
  double = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  head?: number;
  className?: string;
  headClassName?: string;
  /** Arrowheads at both ends. */
  double?: boolean;
}) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const tip = (x: number, y: number, a: number) => {
    const w = head * 0.55;
    const bx = x - head * Math.cos(a);
    const by = y - head * Math.sin(a);
    return `M${x},${y} L${bx + w * Math.sin(a)},${by - w * Math.cos(a)} L${bx - w * Math.sin(a)},${by + w * Math.cos(a)} Z`;
  };
  // Stop the shaft short of the tip so the line end doesn't poke through the head.
  const sx = double ? x1 + head * 0.8 * Math.cos(angle) : x1;
  const sy = double ? y1 + head * 0.8 * Math.sin(angle) : y1;
  const ex = x2 - head * 0.8 * Math.cos(angle);
  const ey = y2 - head * 0.8 * Math.sin(angle);
  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} className={className} />
      <path d={tip(x2, y2, angle)} className={headClassName} />
      {double && <path d={tip(x1, y1, angle + Math.PI)} className={headClassName} />}
    </g>
  );
}

/** Text label; anchor defaults to middle. */
export function Label({
  x,
  y,
  children,
  anchor = 'middle',
  className = 'dg-text',
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: 'start' | 'middle' | 'end';
  className?: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="middle" className={className}>
      {children}
    </text>
  );
}

/**
 * A formula typeset by KaTeX, e.g. tex="\dfrac{dy}{dx} = 3x^2". It sits in a w × h box centred on
 * (x, y); with anchor 'start' or 'end' the box starts or ends at x instead. Make the box big
 * enough: KaTeX doesn't wrap, and anything outside the box is cut off. A \dfrac needs h ≈ 44.
 * tone picks the colour (like dg-text, dg-text-muted, dg-text-accent, dg-text-accent-2).
 * Colour part of a formula with \htmlClass{dg-k-accent}{...} (or dg-k-accent-2, dg-k-muted), so it
 * follows light/dark mode; \cancel{...} strikes a term through. Bad LaTeX throws when the diagram
 * renders, so the diagram tests catch it.
 */
export function MathLabel({
  x,
  y,
  tex,
  w = 320,
  h = 32,
  anchor = 'middle',
  tone,
  size,
}: {
  x: number;
  y: number;
  tex: string;
  w?: number;
  h?: number;
  anchor?: 'start' | 'middle' | 'end';
  tone?: 'muted' | 'accent' | 'accent-2';
  size?: 'small' | 'large';
}) {
  const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  const html = katex.renderToString(tex, {
    throwOnError: true,
    output: 'html',
    trust: (ctx) => ctx.command === '\\htmlClass' && /^dg-k-[a-z0-9-]+$/.test(ctx.class),
    strict: (code: string) => (code === 'htmlExtension' ? 'ignore' : 'warn'),
  });
  const cls = ['dg-math', anchor !== 'middle' && `dg-math-${anchor}`, tone && `dg-math-${tone}`, size && `dg-math-${size}`]
    .filter(Boolean)
    .join(' ');
  return (
    <foreignObject x={left} y={y - h / 2} width={w} height={h}>
      <div className={cls} dangerouslySetInnerHTML={{ __html: html }} />
    </foreignObject>
  );
}

/**
 * Turns short plain maths like "3π/2", "−π/2", "(π/2, 3)", "r sin(θ/2)" or "30° = π/6" into LaTeX
 * with real fractions. Words of three or more letters (other than sin, cos, tan) stay as text.
 */
export function plainToTex(s: string): string {
  return s
    .replace(/ \(/g, '\\ (')
    .replace(/(\s?)\b([A-Za-z]{3,}(?:-[A-Za-z]+)*)\b(\s?)/g, (_m, a: string, w: string, b: string) =>
      ['sin', 'cos', 'tan'].includes(w) ? `${a}\\${w} ` : `\\text{${a}${w}${b}}`,
    )
    .replace(/(\d*)([πθ]?)\/(\d+)/g, (_m, n: string, sym: string, d: string) => `\\dfrac{${n}${sym}}{${d}}`)
    .replace(/π/g, '\\pi ')
    .replace(/θ/g, '\\theta ')
    .replace(/°/g, '^\\circ')
    .replace(/−/g, '-');
}

/**
 * A Label whose text may hold a fraction (e.g. a radian tick "3π/2"): if it does, it is typeset as
 * a real fraction with MathLabel; otherwise it is ordinary SVG text. Use it in shared kits whose
 * labels are data.
 */
export function FracLabel({
  x,
  y,
  children,
  anchor = 'middle',
  className = 'dg-text',
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: 'start' | 'middle' | 'end';
  className?: string;
}) {
  if (typeof children !== 'string' || !/[\dπθ]\/\d/.test(children))
    return (
      <Label x={x} y={y} anchor={anchor} className={className}>
        {children}
      </Label>
    );
  const tone = className.includes('accent-2')
    ? 'accent-2'
    : className.includes('accent')
      ? 'accent'
      : className.includes('muted')
        ? 'muted'
        : undefined;
  return (
    <MathLabel
      x={x}
      y={y}
      anchor={anchor}
      w={children.length * 10 + 40}
      h={46}
      tone={tone}
      size={className.includes('small') ? 'small' : undefined}
      tex={plainToTex(children)}
    />
  );
}

/** Build an SVG path from a function, e.g. a curve y = f(x), already mapped to screen space. */
export function plotPath(f: (x: number) => number, from: number, to: number, steps = 120): string {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const x = from + ((to - from) * i) / steps;
    const y = f(x);
    if (!Number.isFinite(y)) continue;
    d += `${d === '' ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d.trim();
}

/**
 * Maps maths coordinates to SVG coordinates for graph-style diagrams.
 * y increases upwards in maths space.
 */
export function axes(opts: { width: number; height: number; pad: number; x: [number, number]; y: [number, number] }) {
  const { width, height, pad } = opts;
  const sx = (x: number) => pad + ((x - opts.x[0]) / (opts.x[1] - opts.x[0])) * (width - 2 * pad);
  const sy = (y: number) => height - pad - ((y - opts.y[0]) / (opts.y[1] - opts.y[0])) * (height - 2 * pad);
  return { sx, sy };
}

/**
 * Path for y = f(x) in maths coordinates, mapped with `axes()`. Points outside
 * the y-range are dropped and the path is broken there, so curves never spill
 * past the plotting area (and asymptotes don't draw vertical lines).
 */
export function graph(
  f: (x: number) => number,
  x: [number, number],
  map: { sx: (x: number) => number; sy: (y: number) => number },
  yRange: [number, number],
  steps = 240,
): string {
  let d = '';
  let pen = false;
  for (let i = 0; i <= steps; i++) {
    const xv = x[0] + ((x[1] - x[0]) * i) / steps;
    const yv = f(xv);
    if (!Number.isFinite(yv) || yv < yRange[0] || yv > yRange[1]) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${map.sx(xv).toFixed(2)},${map.sy(yv).toFixed(2)} `;
    pen = true;
  }
  return d.trim();
}
