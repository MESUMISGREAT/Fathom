/**
 * How a stationary wave forms: two identical waves of amplitude A travel in
 * opposite directions and are added at each instant. At t = 0 the resultant is
 * 2A sin(kx); a quarter-period later the two waves are in antiphase everywhere
 * and the resultant is zero; at t = T/2 the pattern is inverted. The nodes at
 * x = 0, λ/2, λ, ... never move.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'phys-stationary-waves-formation';

const W = 640;
const H = 480;
const X0 = 90;
const X1 = 570;
const LAMBDA = (X1 - X0) / 2;
const AMP = 40;

const shape = (x: number) => Math.sin((2 * Math.PI * (x - X0)) / LAMBDA);

function curve(y0: number, f: (x: number) => number): string {
  let d = '';
  for (let x = X0; x <= X1; x += 2) {
    d += `${d === '' ? 'M' : 'L'}${x},${(y0 - f(x)).toFixed(1)} `;
  }
  return d.trim();
}

const nodeXs = Array.from({ length: 5 }, (_, i) => X0 + (i * LAMBDA) / 2);

export function StationaryWavesFormation() {
  return (
    <Svg width={W} height={H}>
      {/* the two travelling waves */}
      <Label x={320} y={28} className="dg-text">
        wave 1 travels right →
      </Label>
      <Label x={320} y={50} className="dg-text">
        ← wave 2 travels left
      </Label>
      <Label x={320} y={72} className="dg-text-small dg-text-muted">
        identical amplitude and frequency
      </Label>

      {/* t = 0 */}
      <line x1={X0} y1={150} x2={X1} y2={150} className="dg-grid" />
      <line x1={X0} y1={150 - AMP} x2={X1} y2={150 - AMP} className="dg-dashed dg-muted" />
      <line x1={X0} y1={150 + AMP} x2={X1} y2={150 + AMP} className="dg-dashed dg-muted" />
      <path d={curve(150, (x) => AMP * shape(x))} className="dg-accent" strokeWidth={2.5} />
      <Label x={86} y={150} anchor="end" className="dg-text-small dg-text-muted">
        t = 0
      </Label>
      <Label x={150} y={98} className="dg-text-small dg-text-accent">
        antinode
      </Label>
      <Label x={nodeXs[0] ?? X0} y={178} className="dg-text-small dg-text-muted">
        node
      </Label>

      {/* t = T/4 */}
      <line x1={X0} y1={270} x2={X1} y2={270} className="dg-grid" />
      <path d={curve(270, () => 0)} className="dg-accent" strokeWidth={2.5} />
      <Label x={86} y={270} anchor="end" className="dg-text-small dg-text-muted">
        t = T/4
      </Label>
      <Label x={330} y={300} className="dg-text-small dg-text-muted">
        the two waves are in antiphase everywhere: resultant is zero
      </Label>

      {/* t = T/2 */}
      <line x1={X0} y1={390} x2={X1} y2={390} className="dg-grid" />
      <path d={curve(390, (x) => -AMP * shape(x))} className="dg-accent" strokeWidth={2.5} />
      <Label x={86} y={390} anchor="end" className="dg-text-small dg-text-muted">
        t = T/2
      </Label>
      <Label x={330} y={460} className="dg-text-small dg-text-muted">
        every displacement has reversed: the pattern flips, the nodes stay put
      </Label>

      {/* fixed nodes */}
      {nodeXs.map((x) => (
        <circle key={x} cx={x} cy={150} r={3.5} className="dg-dot" />
      ))}
    </Svg>
  );
}

export default StationaryWavesFormation;
