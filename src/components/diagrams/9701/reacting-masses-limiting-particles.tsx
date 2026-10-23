/**
 * Limiting reagent in particles, for 2H₂ + O₂ → 2H₂O. Before: 6 H₂ molecules
 * and 4 O₂ molecules. After: 6 H₂O molecules and 1 O₂ molecule left over.
 * Hydrogen is the limiting reagent even though there are more H₂ molecules
 * than O₂ molecules: 6 H₂ need only 3 O₂. The test underneath divides each
 * amount by its coefficient: H₂ 6 ÷ 2 = 3, O₂ 4 ÷ 1 = 4; the smaller value
 * marks the limiting reagent.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-reacting-masses-limiting-particles';

const W = 640;
const H = 360;
const BOX_W = 240;
const BOX_H = 170;
const TOP = 46;
const LEFT = 24;
const RIGHT = W - 24 - BOX_W;

function H2({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x - 5} cy={y} r={7} className="dg-fill-surface dg-line" />
      <circle cx={x + 5} cy={y} r={7} className="dg-fill-surface dg-line" />
    </g>
  );
}

function O2({ x, y, excess = false }: { x: number; y: number; excess?: boolean }) {
  return (
    <g>
      {excess && <circle cx={x} cy={y} r={24} className="dg-accent-2 dg-dashed" />}
      <circle cx={x - 7} cy={y} r={10} className="dg-fill-accent-2 dg-line" />
      <circle cx={x + 7} cy={y} r={10} className="dg-fill-accent-2 dg-line" />
    </g>
  );
}

function H2O({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x - 11} cy={y + 8} r={7} className="dg-fill-surface dg-line" />
      <circle cx={x + 11} cy={y + 8} r={7} className="dg-fill-surface dg-line" />
      <circle cx={x} cy={y} r={10} className="dg-fill-accent-2 dg-line" />
    </g>
  );
}

export function ReactingMassesLimitingParticles() {
  const bx = (dx: number) => LEFT + dx;
  const ax = (dx: number) => RIGHT + dx;
  const y = (dy: number) => TOP + dy;
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        2H₂ + O₂ → 2H₂O
      </Label>

      {/* before */}
      <rect x={LEFT} y={TOP} width={BOX_W} height={BOX_H} rx={10} className="dg-fill-accent dg-line" />
      {[
        [40, 36], [110, 30], [190, 40], [56, 96], [140, 86], [36, 146],
      ].map(([dx, dy], i) => (
        <H2 key={`h${i}`} x={bx(dx!)} y={y(dy!)} />
      ))}
      {[
        [200, 100], [95, 140], [165, 142], [96, 66],
      ].map(([dx, dy], i) => (
        <O2 key={`o${i}`} x={bx(dx!)} y={y(dy!)} />
      ))}
      <Label x={LEFT + BOX_W / 2} y={TOP + BOX_H + 20} className="dg-text dg-bold">
        before: 6 H₂ + 4 O₂
      </Label>

      <Arrow x1={LEFT + BOX_W + 14} y1={TOP + BOX_H / 2} x2={RIGHT - 14} y2={TOP + BOX_H / 2} />
      <Label x={W / 2} y={TOP + BOX_H / 2 - 16} className="dg-text-small">
        react
      </Label>

      {/* after */}
      <rect x={RIGHT} y={TOP} width={BOX_W} height={BOX_H} rx={10} className="dg-fill-accent dg-line" />
      {[
        [44, 34], [124, 30], [44, 92], [124, 96], [44, 138], [124, 140],
      ].map(([dx, dy], i) => (
        <H2O key={`w${i}`} x={ax(dx!)} y={y(dy!)} />
      ))}
      <O2 x={ax(196)} y={y(84)} excess />
      <Label x={ax(196)} y={y(122)} className="dg-text-accent-2">
        excess
      </Label>
      <Label x={RIGHT + BOX_W / 2} y={TOP + BOX_H + 20} className="dg-text dg-bold">
        after: 6 H₂O + 1 O₂ left over
      </Label>

      {/* the test */}
      <line x1={24} y1={262} x2={W - 24} y2={262} className="dg-grid" />
      <Label x={W / 2} y={284} className="dg-text">
        divide each amount by its coefficient: H₂, 6 ÷ 2 = 3; O₂, 4 ÷ 1 = 4
      </Label>
      <Label x={W / 2} y={308} className="dg-text-accent">
        smaller number → H₂ is the limiting reagent (it runs out first)
      </Label>
      <Label x={W / 2} y={332} className="dg-text-small">
        more H₂ molecules than O₂ molecules, yet H₂ still runs out: 6 H₂ need only 3 O₂
      </Label>
    </Svg>
  );
}

export default ReactingMassesLimitingParticles;
