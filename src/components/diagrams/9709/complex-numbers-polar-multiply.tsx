/**
 * Multiplying in polar form. z1 has modulus 2 and argument 30 degrees, z2 has modulus 3 and
 * argument 60 degrees. The product has modulus 2 x 3 = 6 and argument 30 + 60 = 90 degrees, so it
 * lies on the imaginary axis: scaling z1 by 3 and rotating it through 60 degrees.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'complex-numbers-polar-multiply';

const W = 620;
const H = 400;
const OX = 150;
const OY = 340;
const S = 34;

const rad = (deg: number) => (deg * Math.PI) / 180;
const at = (deg: number, r: number) => ({
  x: OX + r * Math.cos(rad(deg)),
  y: OY - r * Math.sin(rad(deg)),
});

const Z1 = at(30, 2 * S);
const Z2 = at(60, 3 * S);
const P = at(90, 6 * S);

function arc(fromDeg: number, toDeg: number, r: number): string {
  const steps = 28;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = fromDeg + ((toDeg - fromDeg) * i) / steps;
    const p = at(t, r);
    d += `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)} `;
  }
  return d.trim();
}

export default function ComplexNumbersPolarMultiply() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Multiply the moduli, add the arguments
      </Label>

      <Arrow x1={70} y1={OY} x2={OX + 230} y2={OY} className="dg-thin" head={7} />
      <Arrow x1={OX} y1={OY + 30} x2={OX} y2={OY - 240} className="dg-thin" head={7} />
      <Label x={OX + 236} y={OY} anchor="start" className="dg-text-small dg-text-muted">
        Re
      </Label>
      <Label x={OX} y={OY - 252} className="dg-text-small dg-text-muted">
        Im
      </Label>

      <Arrow x1={OX} y1={OY} x2={Z1.x} y2={Z1.y} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={OX} y1={OY} x2={Z2.x} y2={Z2.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={OX} y1={OY} x2={P.x} y2={P.y} head={10} />

      <path d={arc(30, 90, 60)} className="dg-muted" fill="none" />
      <Label x={OX + 64} y={OY - 78} className="dg-text-small dg-text-muted">
        rotate 60°
      </Label>

      <circle cx={Z1.x} cy={Z1.y} r={4.5} className="dg-dot-accent" />
      <circle cx={Z2.x} cy={Z2.y} r={4.5} className="dg-dot-accent-2" />
      <circle cx={P.x} cy={P.y} r={5} className="dg-dot" />

      <MathLabel x={Z1.x + 14} y={Z1.y + 18} tex="z_1=2e^{i\pi/6}" anchor="start" w={110} h={30} size="small" tone="accent" />
      <MathLabel x={Z2.x + 14} y={Z2.y - 12} tex="z_2=3e^{i\pi/3}" anchor="start" w={110} h={30} size="small" tone="accent-2" />
      <MathLabel x={P.x + 16} y={P.y + 30} tex="z_1z_2=6e^{i\pi/2}" anchor="start" w={130} h={30} size="small" />

      <Label x={400} y={180} className="dg-text-small">
        modulus 2 × 3 = 6
      </Label>
      <Label x={400} y={206} className="dg-text-small">
        argument 30° + 60° = 90°
      </Label>
      <Label x={W / 2} y={H - 20} className="dg-text-small dg-text-muted">
        The product points along the imaginary axis, because 30° + 60° = 90°.
      </Label>
    </Svg>
  );
}
