/**
 * Balancing by counting atoms, for hydrogen burning in oxygen. Top row:
 * H₂ + O₂ → H₂O is unbalanced (2 O atoms on the left, 1 on the right).
 * Bottom row: 2H₂ + O₂ → 2H₂O has 4 H and 2 O atoms on each side. Balancing
 * changes how many molecules there are (the big numbers), never the
 * formulas themselves.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-chemical-formulas-balancing-particles';

const W = 640;
const H = 340;
const RH = 10;
const RO = 15;
const HALF_ANGLE = (104.5 / 2) * (Math.PI / 180);

function Atom({ x, y, el }: { x: number; y: number; el: 'H' | 'O' }) {
  return (
    <g>
      <circle cx={x} cy={y} r={el === 'H' ? RH : RO} className={el === 'H' ? 'dg-fill-surface dg-thin' : 'dg-fill-accent dg-thin'} />
      <Label x={x} y={y + 1} className="dg-text-small dg-bold">
        {el}
      </Label>
    </g>
  );
}

const H2 = ({ x, y }: { x: number; y: number }) => (
  <g>
    <Atom x={x - 8} y={y} el="H" />
    <Atom x={x + 8} y={y} el="H" />
  </g>
);
const O2 = ({ x, y }: { x: number; y: number }) => (
  <g>
    <Atom x={x - 12} y={y} el="O" />
    <Atom x={x + 12} y={y} el="O" />
  </g>
);
function Water({ x, y }: { x: number; y: number }) {
  const d = 19;
  return (
    <g>
      <Atom x={x - d * Math.sin(HALF_ANGLE)} y={y + d * Math.cos(HALF_ANGLE)} el="H" />
      <Atom x={x + d * Math.sin(HALF_ANGLE)} y={y + d * Math.cos(HALF_ANGLE)} el="H" />
      <Atom x={x} y={y} el="O" />
    </g>
  );
}

function Count({ y, h, o, ok }: { y: number; h: [number, number]; o: [number, number]; ok: boolean }) {
  return (
    <g>
      <Label x={540} y={y - 22} className="dg-text-muted">
        atoms: left → right
      </Label>
      <Label x={540} y={y} className="dg-text">
        {`H: ${h[0]} → ${h[1]}`}
      </Label>
      <Label x={540} y={y + 20} className={ok ? 'dg-text' : 'dg-text-accent-2'}>
        {`O: ${o[0]} → ${o[1]}`}
      </Label>
      <Label x={540} y={y + 44} className={ok ? 'dg-text-accent' : 'dg-text-accent-2'}>
        {ok ? 'balanced' : 'not balanced'}
      </Label>
    </g>
  );
}

export function ChemicalFormulasBalancingParticles() {
  return (
    <Svg width={W} height={H}>
      <line x1={460} y1={20} x2={460} y2={H - 20} className="dg-grid" />
      <line x1={20} y1={170} x2={W - 20} y2={170} className="dg-grid" />

      {/* unbalanced */}
      <H2 x={70} y={70} />
      <Label x={125} y={70} className="dg-text dg-bold">
        +
      </Label>
      <O2 x={185} y={70} />
      <Arrow x1={232} y1={70} x2={292} y2={70} />
      <Water x={360} y={62} />
      <Label x={215} y={130} className="dg-text">
        H₂ + O₂ → H₂O
      </Label>
      <Count y={66} h={[2, 2]} o={[2, 1]} ok={false} />

      {/* balanced */}
      <H2 x={70} y={212} />
      <H2 x={70} y={254} />
      <Label x={125} y={233} className="dg-text dg-bold">
        +
      </Label>
      <O2 x={185} y={233} />
      <Arrow x1={232} y1={233} x2={292} y2={233} />
      <Water x={340} y={222} />
      <Water x={398} y={222} />
      <Label x={215} y={300} className="dg-text">
        2H₂(g) + O₂(g) → 2H₂O(l)
      </Label>
      <Count y={230} h={[4, 4]} o={[2, 2]} ok />
    </Svg>
  );
}

export default ChemicalFormulasBalancingParticles;
