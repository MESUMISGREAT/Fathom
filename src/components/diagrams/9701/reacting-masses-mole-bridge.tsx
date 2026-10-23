/**
 * The mole bridge for reacting-mass calculations, for a reaction aA → bB.
 * Top row: mass of A and mass of B in grams, with a crossed-out direct route
 * (an equation gives no mass ratio). Bottom row: amount of A and amount of B
 * in mol. Step 1: mass of A ÷ M(A) gives moles of A. Step 2: multiply by the
 * mole ratio b/a from the balanced equation. Step 3: moles of B × M(B) gives
 * mass of B. A worked example runs along the boxes: heating 25.0 g of CaCO₃
 * (M = 100.1 g mol⁻¹) gives 0.2498 mol, the 1 : 1 ratio gives 0.2498 mol of
 * CaO, and × 56.1 g mol⁻¹ gives 14.0 g of CaO.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-reacting-masses-mole-bridge';

const W = 640;
const H = 330;
const BW = 176;
const BH = 62;
const LX = 36;
const RX = W - 36 - BW;
const TOP = 58;
const BOT = 196;

function Box({ x, y, title, sub, hub, eg }: { x: number; y: number; title: string; sub: string; hub?: boolean; eg: string }) {
  return (
    <g>
      <rect x={x} y={y} width={BW} height={BH} rx={12} className={hub ? 'dg-fill-accent dg-accent' : 'dg-fill-surface dg-line'} />
      <Label x={x + BW / 2} y={y + 23} className="dg-text dg-bold">
        {title}
      </Label>
      <Label x={x + BW / 2} y={y + 43} className="dg-text-small dg-italic">
        {sub}
      </Label>
      <Label x={x + BW / 2} y={y + BH + 16} className="dg-text-accent-2">
        {eg}
      </Label>
    </g>
  );
}

export function ReactingMassesMoleBridge() {
  const lcx = LX + BW / 2;
  const rcx = RX + BW / 2;
  const midTop = TOP + BH / 2;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={22} className="dg-text dg-bold">
        for a A → b B: cross at the mole level, never in grams
      </Label>

      <Box x={LX} y={TOP} title="mass of A" sub="what you know, in g" eg="25.0 g CaCO₃" />
      <Box x={RX} y={TOP} title="mass of B" sub="what you want, in g" eg="14.0 g CaO" />
      <Box x={LX} y={BOT} title="moles of A" sub="n = m ÷ M" hub eg="0.2498 mol CaCO₃" />
      <Box x={RX} y={BOT} title="moles of B" sub="n(B) = n(A) × b ÷ a" hub eg="0.2498 mol CaO" />

      {/* the forbidden shortcut */}
      <line x1={LX + BW + 10} y1={midTop} x2={RX - 10} y2={midTop} className="dg-muted dg-dashed" />
      <line x1={W / 2 - 11} y1={midTop - 11} x2={W / 2 + 11} y2={midTop + 11} className="dg-accent-2" />
      <line x1={W / 2 - 11} y1={midTop + 11} x2={W / 2 + 11} y2={midTop - 11} className="dg-accent-2" />
      <Label x={W / 2} y={midTop - 24} className="dg-text-small">
        no shortcut:
      </Label>
      <Label x={W / 2} y={midTop + 26} className="dg-text-small">
        equations give mole ratios
      </Label>

      {/* step 1: down the left */}
      <Arrow x1={lcx} y1={TOP + BH + 28} x2={lcx} y2={BOT - 4} />
      <Label x={lcx + 12} y={(TOP + BH + 28 + BOT) / 2 - 8} anchor="start" className="dg-text dg-bold">
        ÷ M(A)
      </Label>
      <Label x={lcx + 12} y={(TOP + BH + 28 + BOT) / 2 + 10} anchor="start" className="dg-text-muted">
        step 1
      </Label>

      {/* step 2: across the bottom */}
      <Arrow x1={LX + BW + 8} y1={BOT + BH / 2} x2={RX - 8} y2={BOT + BH / 2} />
      <Label x={W / 2} y={BOT + BH / 2 - 16} className="dg-text dg-bold">
        × b ÷ a
      </Label>
      <Label x={W / 2} y={BOT + BH / 2 + 16} className="dg-text-muted">
        step 2: mole ratio
      </Label>

      {/* step 3: up the right */}
      <Arrow x1={rcx} y1={BOT - 4} x2={rcx} y2={TOP + BH + 28} />
      <Label x={rcx - 12} y={(TOP + BH + 28 + BOT) / 2 - 8} anchor="end" className="dg-text dg-bold">
        × M(B)
      </Label>
      <Label x={rcx - 12} y={(TOP + BH + 28 + BOT) / 2 + 10} anchor="end" className="dg-text-muted">
        step 3
      </Label>

      <Label x={W / 2} y={H - 18} className="dg-text-small">
        example: CaCO₃(s) → CaO(s) + CO₂(g); M(CaCO₃) = 100.1, M(CaO) = 56.1 g mol⁻¹
      </Label>
    </Svg>
  );
}

export default ReactingMassesMoleBridge;
