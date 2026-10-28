/**
 * An electromagnetic wave: the electric field oscillates vertically and the magnetic field
 * oscillates at right angles to it, both perpendicular to the direction of travel. The magnetic
 * field is drawn at a slant to suggest that it points into and out of the page.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-electromagnetic-spectrum-transverse-wave';

const W = 640;
const H = 380;
const AXIS = 200;
const X0 = 80;
const X1 = 560;
const LAM = 160;
const AMP_E = 52;
const AMP_B = 44;
const TAU = Math.PI * 2;

const phase = (x: number) => Math.sin((TAU * (x - X0)) / LAM);

const ePath = (() => {
  let d = '';
  for (let x = X0; x <= X1; x += 4) {
    const y = AXIS - AMP_E * phase(x);
    d += `${d === '' ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d.trim();
})();

const bPath = (() => {
  let d = '';
  for (let x = X0; x <= X1; x += 4) {
    const b = AMP_B * phase(x);
    const bx = x - 0.3 * b;
    const by = AXIS + 0.22 * b;
    d += `${d === '' ? 'M' : 'L'}${bx.toFixed(1)},${by.toFixed(1)} `;
  }
  return d.trim();
})();

export function ElectromagneticSpectrumTransverseWave() {
  return (
    <Svg width={W} height={H}>
      <Label x={60} y={30} anchor="start" className="dg-text dg-bold">
        Every electromagnetic wave is transverse
      </Label>

      {/* direction of travel */}
      <line x1={X0 - 20} y1={AXIS} x2={X1 + 30} y2={AXIS} className="dg-thin dg-text-muted" />
      <Arrow x1={X1 + 6} y1={AXIS} x2={X1 + 46} y2={AXIS} head={9} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={620} y={224} anchor="end" className="dg-text-small dg-text-accent-2">
        travel
      </Label>

      {/* field axes */}
      <line x1={X0} y1={AXIS - AMP_E - 10} x2={X0} y2={AXIS + AMP_E + 10} className="dg-grid" />
      <line x1={X0} y1={AXIS + 40} x2={X0 - 46} y2={AXIS + 58} className="dg-grid" />

      <path d={ePath} className="dg-accent" strokeWidth={2.5} fill="none" />
      <path d={bPath} className="dg-accent-2" strokeWidth={2.5} fill="none" />

      <MathLabel x={X0 + 40} y={AXIS - AMP_E - 32} tex="E" w={40} h={28} size="small" tone="accent" />
      <Label x={40} y={AXIS + 84} anchor="start" className="dg-text-small dg-text-accent-2">
        B (pointing into the page)
      </Label>

      <MathLabel
        x={W / 2}
        y={352}
        tex="c = 3.00 \times 10^{8}\ \text{m s}^{-1}\ \text{in free space}"
        w={420}
        h={34}
        size="small"
      />
    </Svg>
  );
}

export default ElectromagneticSpectrumTransverseWave;
