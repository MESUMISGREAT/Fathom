/**
 * The point z = 3 - 4i on an Argand diagram, with the dashed line from the origin whose length is
 * the modulus (5) and whose angle below the real axis is the argument (-0.927 rad). The conjugate
 * 3 + 4i is the mirror image in the real axis.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'complex-numbers-argand-intro';

const W = 600;
const H = 400;
const OX = 240;
const OY = 170;
const S = 36;

const px = (x: number) => OX + x * S;
const py = (y: number) => OY - y * S;

const Z = { x: px(3), y: py(-4) };
const ZC = { x: px(3), y: py(4) };

/** A short arc from angle a to angle b (radians, maths sense, y up) at radius r. */
function arc(a: number, b: number, r: number): string {
  const steps = 24;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = a + ((b - a) * i) / steps;
    const x = OX + r * Math.cos(t);
    const y = OY - r * Math.sin(t);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d.trim();
}

export default function ComplexNumbersArgandIntro() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        z = 3 − 4i on the Argand diagram
      </Label>

      <Arrow x1={70} y1={OY} x2={px(5.4)} y2={OY} className="dg-thin" head={7} />
      <Arrow x1={OX} y1={py(-4.6)} x2={OX} y2={py(4.6)} className="dg-thin" head={7} />
      <Label x={px(5.4) + 8} y={OY} anchor="start" className="dg-text-small dg-text-muted">
        Re
      </Label>
      <Label x={OX} y={py(4.6) - 12} className="dg-text-small dg-text-muted">
        Im
      </Label>
      <Label x={OX - 10} y={OY + 16} anchor="end" className="dg-text-small dg-text-muted">
        O
      </Label>

      {/* mirror line */}
      <line x1={Z.x} y1={Z.y} x2={ZC.x} y2={ZC.y} className="dg-dashed dg-muted" />

      {/* modulus and argument */}
      <line x1={OX} y1={OY} x2={Z.x} y2={Z.y} className="dg-accent" strokeWidth={2.5} />
      <path d={arc(0, -0.927, 54)} className="dg-muted" fill="none" />

      <circle cx={Z.x} cy={Z.y} r={5} className="dg-dot-accent" />
      <circle cx={ZC.x} cy={ZC.y} r={4.5} className="dg-dot" />

      <Label x={Z.x + 12} y={Z.y + 10} anchor="start" className="dg-text dg-bold">
        z = 3 − 4i
      </Label>
      <Label x={ZC.x + 12} y={ZC.y - 6} anchor="start" className="dg-text">
        z* = 3 + 4i
      </Label>

      <Label x={OX + 44} y={OY + 34} anchor="start" className="dg-text-small dg-text-accent-2">
        arg z
      </Label>

      <MathLabel x={392} y={300} tex="|z|=\sqrt{3^2+4^2}=5" w={200} h={34} tone="accent" />
      <MathLabel x={392} y={336} tex="\arg z \approx -0.927\ \text{rad}" w={220} h={32} tone="accent-2" />
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        The conjugate is the reflection of z in the real axis: same modulus, opposite argument.
      </Label>
    </Svg>
  );
}
