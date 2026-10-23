/**
 * The chain rule for y = √(2x³ + 5) as two machines in a row: the inner
 * function u = 2x³ + 5 (rate du/dx = 6x²) feeds the outer function y = √u
 * (rate dy/du = 1/(2√u)). The overall rate is the product of the two rates.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'p1-differentiation-chain-machines';

const W = 620;
const H = 290;
const BW = 150;
const BH = 64;
const ROW = 92;

function Machine({ x, title, rule, rate, accent }: { x: number; title: string; rule: string; rate: string; accent: 1 | 2 }) {
  const box = accent === 1 ? 'dg-accent dg-fill-accent' : 'dg-accent-2 dg-fill-accent-2';
  const txt = accent === 1 ? 'dg-text-accent' : 'dg-text-accent-2';
  return (
    <g>
      <Label x={x + BW / 2} y={ROW - BH / 2 - 16} className="dg-text-muted">
        {title}
      </Label>
      <rect x={x} y={ROW - BH / 2} width={BW} height={BH} rx={12} className={box} />
      <Label x={x + BW / 2} y={ROW + 1} className={txt}>
        {rule}
      </Label>
      <Label x={x + BW / 2} y={ROW + BH / 2 + 22} className="dg-text">
        {rate}
      </Label>
    </g>
  );
}

export default function P1DifferentiationChainMachines() {
  const b1 = 96;
  const b2 = 360;
  return (
    <Svg width={W} height={H}>
      <Label x={40} y={ROW} className="dg-text dg-bold dg-italic">
        x
      </Label>
      <Arrow x1={54} y1={ROW} x2={b1 - 6} y2={ROW} head={8} className="dg-thin" />
      <Machine x={b1} title="inner function" rule="u = 2x³ + 5" rate="du/dx = 6x²" accent={1} />
      <Arrow x1={b1 + BW + 6} y1={ROW} x2={b2 - 6} y2={ROW} head={8} className="dg-thin" />
      <Label x={(b1 + BW + b2) / 2} y={ROW - 14} className="dg-text dg-bold dg-italic">
        u
      </Label>
      <Machine x={b2} title="outer function" rule="y = √u" rate="dy/du = 1 ⁄ (2√u)" accent={2} />
      <Arrow x1={b2 + BW + 6} y1={ROW} x2={W - 40} y2={ROW} head={8} className="dg-thin" />
      <Label x={W - 26} y={ROW} className="dg-text dg-bold dg-italic">
        y
      </Label>

      <line x1={30} y1={182} x2={W - 30} y2={182} className="dg-grid" />
      <Label x={W / 2} y={208} className="dg-text">
        dy/dx = dy/du × du/dx
      </Label>
      <Label x={W / 2} y={234} className="dg-text">
        = 1 ⁄ (2√u) × 6x² = 3x² ⁄ √(2x³ + 5)
      </Label>
      <Label x={W / 2} y={264} className="dg-text-muted">
        Rates multiply: outer rate (inside left alone) × inner rate
      </Label>
    </Svg>
  );
}
