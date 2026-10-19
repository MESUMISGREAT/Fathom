/**
 * Four dot plots of eight repeated measurements of g (true value 9.81 m s⁻²),
 * drawn to scale on a 9.0-11.0 m s⁻² axis. Readings are grouped into bins
 * 0.05 m s⁻² wide and stacked (a dot plot), so a tall narrow stack means a
 * small spread (precise) and a wide flat row a large spread. The triangle is
 * at the exact mean.
 *
 *   accurate + precise:   mean 9.81, range 0.09
 *   precise only:         every reading +0.55 (systematic error): mean 10.36, range 0.09
 *   accurate only:        mean 9.81, range 1.04 (large random error)
 *   neither:              every reading +0.55: mean 10.36, range 1.04
 */
import { Label, Svg } from '../primitives';

const W = 640;
const H = 448;
const TRUE_G = 9.81;
const X_MIN = 9.0;
const X_MAX = 11.0;
const PANEL_W = 300;
const PANEL_H = 186;
const R = 3.6;

const tight = [9.76, 9.79, 9.8, 9.81, 9.81, 9.82, 9.84, 9.85];
const wide = [9.3, 9.48, 9.62, 9.75, 9.88, 9.99, 10.12, 10.34];
const shift = (xs: number[]) => xs.map((x) => Math.round((x + 0.55) * 100) / 100);

const panels = [
  { title: 'Accurate and precise', sub: 'mean ≈ true value, small spread', data: tight },
  { title: 'Precise, not accurate', sub: 'small spread, mean shifted', data: shift(tight) },
  { title: 'Accurate, not precise', sub: 'mean ≈ true value, large spread', data: wide },
  { title: 'Neither', sub: 'large spread, mean shifted', data: shift(wide) },
];

const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

const BIN = 0.05;
/** Group readings into bins BIN wide and stack the dots in each bin. */
function stack(xs: number[], sx: (v: number) => number): Array<{ x: number; level: number }> {
  const count = new Map<number, number>();
  return xs.map((v) => {
    const bin = Math.round(v / BIN);
    const level = count.get(bin) ?? 0;
    count.set(bin, level + 1);
    return { x: sx(bin * BIN), level };
  });
}

function Panel({ x0, y0, title, sub, data }: { x0: number; y0: number; title: string; sub: string; data: number[] }) {
  const left = x0 + 24;
  const right = x0 + PANEL_W - 24;
  const sx = (v: number) => left + ((v - X_MIN) / (X_MAX - X_MIN)) * (right - left);
  const axisY = y0 + 128;
  const base = axisY - 4;
  const m = mean(data);
  const ticks = [9.0, 9.5, 10.0, 10.5, 11.0];
  return (
    <g>
      <rect x={x0} y={y0} width={PANEL_W} height={PANEL_H} rx={8} className="dg-fill-muted" />
      <Label x={x0 + 14} y={y0 + 18} anchor="start" className="dg-text dg-bold">
        {title}
      </Label>
      <Label x={x0 + 14} y={y0 + 37} anchor="start" className="dg-text-muted">
        {sub}
      </Label>
      {/* true value */}
      <line x1={sx(TRUE_G)} y1={y0 + 56} x2={sx(TRUE_G)} y2={axisY} className="dg-muted dg-dashed" />
      {/* readings */}
      {stack(data, sx).map((p, i) => (
        <circle key={i} cx={p.x} cy={base - R - p.level * (2 * R + 1)} r={R} className="dg-dot-accent" />
      ))}
      {/* axis */}
      <line x1={left} y1={axisY} x2={right} y2={axisY} className="dg-line" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={axisY} x2={sx(t)} y2={axisY + 5} className="dg-thin" />
          <Label x={sx(t)} y={axisY + 29} className="dg-text-small">
            {t.toFixed(1)}
          </Label>
        </g>
      ))}
      {/* mean marker: a triangle pointing up at the axis */}
      <path
        d={`M${sx(m)},${axisY + 2} L${sx(m) - 6},${axisY + 13} L${sx(m) + 6},${axisY + 13} Z`}
        className="dg-dot-accent-2"
      />
      <Label x={(left + right) / 2} y={axisY + 48} className="dg-text-small dg-text-muted">
        g / m s⁻²
      </Label>
    </g>
  );
}

export function AccuracyPrecision() {
  const gap = 20;
  const x0 = (W - 2 * PANEL_W - gap) / 2;
  const top = 44;
  return (
    <Svg width={W} height={H}>
      {/* legend */}
      <circle cx={x0 + 8} cy={20} r={R} className="dg-dot-accent" />
      <Label x={x0 + 18} y={20} anchor="start" className="dg-text-small">
        one reading
      </Label>
      <path d={`M${x0 + 118},${14} L${x0 + 112},${25} L${x0 + 124},${25} Z`} className="dg-dot-accent-2" />
      <Label x={x0 + 132} y={20} anchor="start" className="dg-text-small">
        mean of the readings
      </Label>
      <line x1={x0 + 278} y1={12} x2={x0 + 278} y2={28} className="dg-muted dg-dashed" />
      <Label x={x0 + 288} y={20} anchor="start" className="dg-text-small">
        true value, 9.81 m s⁻²
      </Label>
      {panels.map((p, i) => (
        <Panel
          key={p.title}
          x0={x0 + (i % 2) * (PANEL_W + gap)}
          y0={top + Math.floor(i / 2) * (PANEL_H + gap)}
          title={p.title}
          sub={p.sub}
          data={p.data}
        />
      ))}
    </Svg>
  );
}
