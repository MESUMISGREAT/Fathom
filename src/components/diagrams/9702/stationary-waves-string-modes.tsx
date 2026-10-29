/**
 * The three lowest modes of a string fixed at both ends. A string of length L
 * carries n half-wavelengths, so L = nλ/2 and f = nv/2L. Fixed ends are always
 * nodes; the loops between them carry the antinodes.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-stationary-waves-string-modes';

const W = 640;
const H = 440;
const X0 = 120;
const X1 = 520;
const AMP = 30;

const shape = (u: number, n: number) => AMP * Math.sin(n * Math.PI * u);

function curve(y0: number, n: number): string {
  let d = '';
  for (let i = 0; i <= 200; i++) {
    const u = i / 200;
    const x = X0 + u * (X1 - X0);
    d += `${d === '' ? 'M' : 'L'}${x.toFixed(1)},${(y0 - shape(u, n)).toFixed(1)} `;
  }
  return d.trim();
}

export function StationaryWavesStringModes() {
  const rows = [
    { n: 1, y: 100, tex: 'L=\\dfrac{\\lambda}{2}', freq: 'f_1=\\dfrac{v}{2L}' },
    { n: 2, y: 225, tex: 'L=\\lambda', freq: 'f_2=2f_1' },
    { n: 3, y: 350, tex: 'L=\\dfrac{3\\lambda}{2}', freq: 'f_3=3f_1' },
  ];
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={30} className="dg-text dg-bold">
        String fixed at both ends: one loop per half-wavelength
      </Label>

      {rows.map((r) => (
        <g key={r.n}>
          <line x1={X0} y1={r.y} x2={X1} y2={r.y} className="dg-grid" />
          <line x1={X0} y1={r.y - AMP - 12} x2={X0} y2={r.y + AMP + 12} className="dg-line" strokeWidth={3} />
          <line x1={X1} y1={r.y - AMP - 12} x2={X1} y2={r.y + AMP + 12} className="dg-line" strokeWidth={3} />
          <path d={curve(r.y, r.n)} className="dg-accent" strokeWidth={2.5} />
          {Array.from({ length: r.n + 1 }, (_, k) => {
            const x = X0 + ((X1 - X0) * k) / r.n;
            return <circle key={k} cx={x} cy={r.y} r={3.5} className="dg-dot" />;
          })}
          <Label x={X0} y={r.y - AMP - 26} className="dg-text-small dg-text-muted">
            N
          </Label>
          <Label x={X1} y={r.y - AMP - 26} className="dg-text-small dg-text-muted">
            N
          </Label>
          <Label x={64} y={r.y - 20} anchor="start" className="dg-text-small dg-bold">
            {r.n === 1 ? 'fundamental' : `mode n = ${r.n}`}
          </Label>
          <Label x={64} y={r.y + 4} anchor="start" className="dg-text-small dg-text-muted">
            {r.n} {r.n === 1 ? 'loop' : 'loops'}
          </Label>
          <MathLabel x={320} y={r.y + 52} tex={r.tex} w={180} h={40} />
          <MathLabel x={540} y={r.y} tex={r.freq} w={170} h={40} anchor="start" tone="muted" />
        </g>
      ))}
    </Svg>
  );
}

export default StationaryWavesStringModes;
