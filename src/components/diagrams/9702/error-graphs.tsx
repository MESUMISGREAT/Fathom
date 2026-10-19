/**
 * How systematic and random errors show up on a graph. Current I through a
 * 10 Ω resistor against p.d. V (true relationship I = V / 10, drawn dashed).
 *
 * Left: the ammeter has a zero error of +0.10 A, so every reading is 0.10 A
 *   too high. The points lie exactly on I = V / 10 + 0.10: same gradient,
 *   intercept 0.10 A instead of zero.
 * Right: random errors of up to ±0.03 A. The points scatter either side of
 *   the true line, which is still the best estimate of the relationship.
 */
import { Arrow, Label, Svg, axes, graph } from '../primitives';

const W = 640;
const H = 300;
const GW = 310; // one graph's box
const GH = 270;
const PAD = 46;
const X: [number, number] = [0, 6];
const Y: [number, number] = [0, 0.8];
const map = axes({ width: GW, height: GH, pad: PAD, x: X, y: Y });
const { sx, sy } = map;

const ZERO_ERROR = 0.1;
const vs = [1, 2, 3, 4, 5, 6];
const noise = [0.03, -0.025, 0.02, -0.03, 0.025, -0.02];

function Frame({ title }: { title: string }) {
  return (
    <g>
      <Label x={GW / 2 + 8} y={14} className="dg-text dg-bold">
        {title}
      </Label>
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <line key={t} x1={sx(0)} y1={sy(t)} x2={sx(6)} y2={sy(t)} className="dg-grid" />
      ))}
      <line x1={sx(0)} y1={sy(0)} x2={sx(6)} y2={sy(0)} className="dg-line" />
      <line x1={sx(0)} y1={sy(0)} x2={sx(0)} y2={sy(0.8)} className="dg-line" />
      {[0, 2, 4, 6].map((t) => (
        <Label key={t} x={sx(t)} y={sy(0) + 14} className="dg-text-small">
          {t}
        </Label>
      ))}
      {[0, 0.2, 0.4, 0.6, 0.8].map((t) => (
        <Label key={t} x={sx(0) - 7} y={sy(t)} anchor="end" className="dg-text-small">
          {t.toFixed(1)}
        </Label>
      ))}
      <Label x={sx(3)} y={sy(0) + 32} className="dg-text-small dg-italic">
        V / V
      </Label>
      <text
        x={10}
        y={sy(0.4)}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90 10 ${sy(0.4)})`}
        className="dg-text-small dg-italic"
      >
        I / A
      </text>
      {/* the true relationship */}
      <path d={graph((v) => v / 10, X, map, Y)} className="dg-muted dg-dashed" />
    </g>
  );
}

export function ErrorGraphs() {
  const fit = (v: number) => v / 10 + ZERO_ERROR;
  return (
    <Svg width={W} height={H}>
      {/* left: zero error */}
      <g transform="translate(4, 10)">
        <Frame title="Zero error (systematic)" />
        <path d={graph(fit, X, map, Y)} className="dg-accent" />
        {vs.map((v) => (
          <circle key={v} cx={sx(v)} cy={sy(fit(v))} r={4} className="dg-dot-accent" />
        ))}
        <circle cx={sx(0)} cy={sy(ZERO_ERROR)} r={4} className="dg-dot-accent-2" />
        <Arrow x1={sx(0.55)} y1={sy(0.6)} x2={sx(0.06)} y2={sy(0.14)} className="dg-accent-2" headClassName="dg-dot-accent-2" head={8} />
        <Label x={sx(0.25)} y={sy(0.75)} anchor="start" className="dg-text-small dg-text-accent-2">
          intercept 0.10 A
        </Label>
        <Label x={sx(0.25)} y={sy(0.75) + 15} anchor="start" className="dg-text-small dg-text-accent-2">
          = the zero error
        </Label>
        <Label x={sx(4.0)} y={sy(0.6)} anchor="end" className="dg-text-small dg-text-accent">
          readings
        </Label>
        <Label x={sx(5.85)} y={sy(0.46)} anchor="end" className="dg-text-small dg-text-muted">
          true line
        </Label>
        <Label x={sx(5.85)} y={sy(0.12)} anchor="end" className="dg-text-small">
          same gradient,
        </Label>
        <Label x={sx(5.85)} y={sy(0.12) + 15} anchor="end" className="dg-text-small">
          every point 0.10 A too high
        </Label>
      </g>

      {/* right: random error */}
      <g transform={`translate(${W - GW - 4}, 10)`}>
        <Frame title="Random error" />
        {vs.map((v, i) => (
          <circle key={v} cx={sx(v)} cy={sy(v / 10 + noise[i]!)} r={4} className="dg-dot-accent" />
        ))}
        <Label x={sx(0.3)} y={sy(0.7)} anchor="start" className="dg-text-small">
          readings scatter either side
        </Label>
        <Label x={sx(0.3)} y={sy(0.7) + 15} anchor="start" className="dg-text-small">
          of the true line, by different
        </Label>
        <Label x={sx(0.3)} y={sy(0.7) + 30} anchor="start" className="dg-text-small">
          amounts each time
        </Label>
        <Label x={sx(5.9)} y={sy(0.36)} anchor="end" className="dg-text-small dg-text-muted">
          true line
        </Label>
      </g>
    </Svg>
  );
}
