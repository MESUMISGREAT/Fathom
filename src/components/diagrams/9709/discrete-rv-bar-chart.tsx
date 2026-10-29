/**
 * The probability distribution of a discrete random variable taking values 0, 1, 2, 3 with
 * probabilities 0.1, 0.2, 0.3 and 0.4. Drawn as a bar chart with the y-axis at the left edge,
 * which keeps the tick labels clear of the first bar.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'discrete-rv-bar-chart';

const W = 430;
const H = 300;

const LEFT = 88;
const RIGHT = 380;
const TOP = 56;
const BOTTOM = 250;
const Y_MAX = 0.5;

const DIST: Array<{ x: number; p: number }> = [
  { x: 0, p: 0.1 },
  { x: 1, p: 0.2 },
  { x: 2, p: 0.3 },
  { x: 3, p: 0.4 },
];

const yPx = (v: number) => BOTTOM - (v / Y_MAX) * (BOTTOM - TOP);
const slot = (RIGHT - LEFT) / DIST.length;
const centre = (i: number) => LEFT + slot * (i + 0.5);
const barW = slot * 0.58;

export default function DiscreteRvBarChart() {
  return (
    <Svg width={W} height={H}>
      <Label x={LEFT} y={24} anchor="start" className="dg-text-small">
        P(X = x)
      </Label>

      {[0.1, 0.2, 0.3, 0.4].map((g) => (
        <g key={g}>
          <line x1={LEFT} y1={yPx(g)} x2={RIGHT} y2={yPx(g)} className="dg-grid" />
          <Line x={LEFT - 8} y={yPx(g)} label={g.toFixed(1)} />
        </g>
      ))}

      {DIST.map((d, i) => (
        <g key={d.x}>
          <rect
            x={centre(i) - barW / 2}
            y={yPx(d.p)}
            width={barW}
            height={BOTTOM - yPx(d.p)}
            className="dg-fill-accent dg-thin"
          />
          <Label x={centre(i)} y={yPx(d.p) - 12} className="dg-text-small">
            {d.p.toFixed(1)}
          </Label>
          <Label x={centre(i)} y={BOTTOM + 17} className="dg-text-small">
            {`${d.x}`}
          </Label>
        </g>
      ))}

      <Arrow x1={LEFT} y1={BOTTOM} x2={LEFT} y2={TOP - 10} className="dg-thin" head={8} />
      <Arrow x1={LEFT} y1={BOTTOM} x2={RIGHT + 14} y2={BOTTOM} className="dg-thin" head={8} />
      <Label x={RIGHT + 22} y={BOTTOM} anchor="start" className="dg-text dg-italic">
        x
      </Label>
    </Svg>
  );
}

function Line({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <>
      <line x1={x} y1={y} x2={x + 5} y2={y} className="dg-thin" />
      <Label x={x - 2} y={y} anchor="end" className="dg-text-small">
        {label}
      </Label>
    </>
  );
}
