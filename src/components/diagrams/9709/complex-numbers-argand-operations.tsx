/**
 * Adding complex numbers on an Argand diagram is vector addition: the arrows for z and w are the
 * two sides of a parallelogram, and the diagonal is z + w. Here z = 2 + i and w = 1 + 2i, so
 * z + w = 3 + 3i; the dashed copies show w moved to the tip of z and z moved to the tip of w.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'complex-numbers-argand-operations';

const W = 620;
const H = 380;
const OX = 180;
const OY = 310;
const S = 62;

const px = (x: number) => OX + x * S;
const py = (y: number) => OY - y * S;

const Z = { x: px(2), y: py(1) };
const Wv = { x: px(1), y: py(2) };
const SUM = { x: px(3), y: py(3) };

export default function ComplexNumbersArgandOperations() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Addition: complete the parallelogram
      </Label>

      {/* axes */}
      <Arrow x1={110} y1={OY} x2={px(4.6)} y2={OY} className="dg-thin" head={7} />
      <Arrow x1={OX} y1={OY + 30} x2={OX} y2={py(3.7)} className="dg-thin" head={7} />
      <Label x={px(4.6) + 8} y={OY} anchor="start" className="dg-text-small dg-text-muted">
        Re
      </Label>
      <Label x={OX} y={py(3.7) - 12} className="dg-text-small dg-text-muted">
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

      <MathLabel x={Z.x + 16} y={Z.y + 12} tex="z" anchor="start" w={30} h={24} size="small" tone="accent" />
      <MathLabel x={Wv.x + 16} y={Wv.y - 12} tex="w" anchor="start" w={30} h={24} size="small" tone="accent-2" />
      <MathLabel x={SUM.x + 4} y={SUM.y - 20} tex="z + w" anchor="start" w={60} h={26} size="small" />

      <Label x={W / 2} y={H - 34} className="dg-text-small dg-text-muted">
        The dashed sides are copies of w and z, so the diagonal is their sum.
      </Label>
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-text-muted">
        Real parts add, imaginary parts add: (2 + i) + (1 + 2i) = 3 + 3i.
      </Label>
    </Svg>
  );
}
