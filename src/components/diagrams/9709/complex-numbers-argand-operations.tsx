/**
 * Adding complex numbers on an Argand diagram is vector addition: the arrows for z1 = 2 + i and
 * z2 = 1 + 3i are two sides of a parallelogram, and its far corner is z1 + z2 = 3 + 4i. The conjugate
 * z1* = 2 − i is drawn as the reflection of z1 in the real axis.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'complex-numbers-argand-operations';

const W = 620;
const H = 400;
const OX = 180;
const OY = 300;
const S = 56;

const px = (x: number) => OX + x * S;
const py = (y: number) => OY - y * S;

const Z = { x: px(2), y: py(1) };
const Wv = { x: px(1), y: py(3) };
const SUM = { x: px(3), y: py(4) };
const CONJ = { x: px(2), y: py(-1) };

export default function ComplexNumbersArgandOperations() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2 + 50} y={26} className="dg-text dg-bold">
        Addition: complete the parallelogram
      </Label>

      {/* axes */}
      <Arrow x1={110} y1={OY} x2={px(4.6)} y2={OY} className="dg-thin" head={7} />
      <Arrow x1={OX} y1={py(-1.35)} x2={OX} y2={py(4.6)} className="dg-thin" head={7} />
      <Label x={px(4.6) + 8} y={OY} anchor="start" className="dg-text-small dg-text-muted">
        Re
      </Label>
      <Label x={OX - 12} y={py(4.6)} anchor="end" className="dg-text-small dg-text-muted">
        Im
      </Label>

      {/* the two arrows and their sum */}
      <Arrow x1={OX} y1={OY} x2={Z.x} y2={Z.y} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={OX} y1={OY} x2={Wv.x} y2={Wv.y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={OX} y1={OY} x2={SUM.x} y2={SUM.y} head={10} />

      {/* dashed copies completing the parallelogram */}
      <line x1={Z.x} y1={Z.y} x2={SUM.x} y2={SUM.y} className="dg-dashed dg-muted" />
      <line x1={Wv.x} y1={Wv.y} x2={SUM.x} y2={SUM.y} className="dg-dashed dg-muted" />

      <circle cx={Z.x} cy={Z.y} r={4.5} className="dg-dot-accent" />
      <circle cx={Wv.x} cy={Wv.y} r={4.5} className="dg-dot-accent-2" />
      <circle cx={SUM.x} cy={SUM.y} r={5} className="dg-dot" />

      <line x1={Z.x} y1={Z.y} x2={CONJ.x} y2={CONJ.y} className="dg-dashed dg-thin" />
      <circle cx={CONJ.x} cy={CONJ.y} r={4.5} className="dg-dot" />

      <MathLabel x={Z.x + 14} y={Z.y + 4} tex="z_1 = 2 + i" anchor="start" w={110} h={24} size="small" tone="accent" />
      <MathLabel x={Wv.x - 30} y={Wv.y - 4} tex="z_2 = 1 + 3i" anchor="end" w={110} h={24} size="small" tone="accent-2" />
      <MathLabel x={SUM.x + 10} y={SUM.y - 8} tex="z_1 + z_2 = 3 + 4i" anchor="start" w={150} h={26} size="small" />
      <MathLabel x={CONJ.x + 14} y={CONJ.y + 4} tex="z_1^* = 2 - i" anchor="start" w={110} h={26} size="small" />

      <Label x={W / 2} y={H - 8} className="dg-text-small dg-text-muted">
        Dashed: copies of z₂ and z₁ complete the parallelogram; z₁* is z₁ reflected in Re.
      </Label>
    </Svg>
  );
}
