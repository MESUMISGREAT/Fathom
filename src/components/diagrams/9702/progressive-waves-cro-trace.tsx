/**
 * A CRO screen with a sine trace. One cycle spans four horizontal divisions (time-base 2 ms/div),
 * and the peak is three divisions above the centre line (y-gain 0.5 V/div).
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-progressive-waves-cro-trace';

const W = 580;
const H = 470;
const LEFT = 80;
const TOP = 60;
const DIV = 40;
const COLS = 10;
const ROWS = 8;
const RIGHT = LEFT + COLS * DIV;
const BOTTOM = TOP + ROWS * DIV;
const MID = TOP + (ROWS / 2) * DIV;

const amplitudePx = 3 * DIV;
const periodPx = 4 * DIV;

const trace = (x: number) => MID - amplitudePx * Math.sin((2 * Math.PI * (x - LEFT)) / periodPx);

function tracePath() {
  const pts: string[] = [];
  for (let x = LEFT; x <= RIGHT; x += 2) pts.push(`${x},${trace(x).toFixed(1)}`);
  return `M${pts.join(' L')}`;
}

export function ProgressiveWavesCroTrace() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Reading a CRO: time across, voltage up
      </Label>

      {/* screen grid */}
      <rect x={LEFT} y={TOP} width={COLS * DIV} height={ROWS * DIV} className="dg-fill-surface" />
      {Array.from({ length: COLS + 1 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={LEFT + i * DIV}
          y1={TOP}
          x2={LEFT + i * DIV}
          y2={BOTTOM}
          className={i === 0 || i === COLS ? 'dg-line' : 'dg-grid'}
        />
      ))}
      {Array.from({ length: ROWS + 1 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={LEFT}
          y1={TOP + i * DIV}
          x2={RIGHT}
          y2={TOP + i * DIV}
          className={i === 0 || i === ROWS ? 'dg-line' : 'dg-grid'}
        />
      ))}

      {/* centre line */}
      <line x1={LEFT} y1={MID} x2={RIGHT} y2={MID} className="dg-muted dg-dashed" />

      {/* trace */}
      <path d={tracePath()} className="dg-accent" strokeWidth={2.5} />

      {/* one cycle marker */}
      <line x1={LEFT} y1={BOTTOM + 16} x2={LEFT + periodPx} y2={BOTTOM + 16} className="dg-thin" />
      <line x1={LEFT} y1={BOTTOM + 10} x2={LEFT} y2={BOTTOM + 22} className="dg-thin" />
      <line
        x1={LEFT + periodPx}
        y1={BOTTOM + 10}
        x2={LEFT + periodPx}
        y2={BOTTOM + 22}
        className="dg-thin"
      />
      <Label x={LEFT + periodPx / 2} y={BOTTOM + 36} className="dg-text-small dg-text-muted">
        4 divisions = one cycle
      </Label>

      {/* amplitude marker in the right margin */}
      <line x1={RIGHT} y1={MID} x2={RIGHT + 34} y2={MID} className="dg-muted dg-dashed" />
      <line
        x1={RIGHT}
        y1={MID - amplitudePx}
        x2={RIGHT + 34}
        y2={MID - amplitudePx}
        className="dg-muted dg-dashed"
      />
      <Arrow
        x1={RIGHT + 30}
        y1={MID}
        x2={RIGHT + 30}
        y2={MID - amplitudePx}
        double
        className="dg-accent"
        headClassName="dg-dot-accent"
      />
      <Label x={RIGHT + 38} y={MID - amplitudePx / 2} anchor="start" className="dg-text-small dg-text-accent">
        3 div
      </Label>

      <Label x={LEFT} y={TOP - 16} anchor="start" className="dg-text-small dg-text-muted">
        y-gain 0.5 V per division
      </Label>
      <Label x={RIGHT} y={BOTTOM + 54} anchor="end" className="dg-text-small dg-text-muted">
        time-base 2 ms per division
      </Label>

      <MathLabel
        x={W / 2}
        y={H - 12}
        tex="T = 4 \times 2\ \text{ms} = 8\ \text{ms}, \qquad A = 3 \times 0.5\ \text{V} = 1.5\ \text{V}"
        w={470}
        h={28}
        size="small"
        tone="muted"
      />
    </Svg>
  );
}

export default ProgressiveWavesCroTrace;
