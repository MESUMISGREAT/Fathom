/**
 * Equilibrium by resolving forces. A ring pulled by two tensions and a weight.
 * Horizontal: T₂cos40° = T₁. Vertical: T₂sin40° = 30 N.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'forces-equilibrium-resolving-equilibrium';

const W = 660;
const H = 380;
const CX = 330;
const CY = 180;
const R = 18;

export function ForcesEquilibriumResolvingEquilibrium() {
  // T2 constants
  const angle = 40; // degrees
  const rad = (angle * Math.PI) / 180;
  const len = 120;
  const t2x = len * Math.cos(rad);
  const t2y = len * Math.sin(rad);

  return (
    <Svg width={W} height={H}>
      <Label x={330} y={30} className="dg-text dg-bold">
        Equilibrium by resolving: a ring pulled by two strings and a load
      </Label>

      {/* The ring */}
      <circle cx={CX} cy={CY} r={R} className="dg-fill-muted dg-thin" />
      <Label x={CX} y={CY} className="dg-text-small dg-bold">ring</Label>

      {/* T1 - left */}
      <Arrow x1={CX - R} y1={CY} x2={CX - 120} y2={CY} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={CX - 65} y={CY - 18} tex="T_1" w={40} h={32} tone="accent" />
      <Label x={CX - 65} y={CY - 38} className="dg-text-small dg-text-muted">
        horizontal
      </Label>

      {/* T2 - up-right at 40° */}
      <Arrow x1={CX + R} y1={CY} x2={CX + R + t2x} y2={CY - t2y} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={CX + R + t2x / 2 + 15} y={CY - t2y / 2 - 15} tex="T_2" w={40} h={32} anchor="start" tone="accent-2" />

      {/* T2 components as dashed lines */}
      <Arrow x1={CX + R} y1={CY} x2={CX + R + t2x} y2={CY} className="dg-dashed dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={CX + R + t2x / 2} y={CY - 18} tex="T_2\\cos40^{\\circ}" w={100} h={32} tone="accent-2" size="small" />

      <Arrow x1={CX + R + t2x} y1={CY} x2={CX + R + t2x} y2={CY - t2y} className="dg-dashed dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={CX + R + t2x + 18} y={CY - t2y / 2} tex="T_2\\sin40^{\\circ}" w={100} h={32} anchor="start" tone="accent-2" size="small" />

      {/* Angle arc for T2 */}
      <path
        d={`M${CX + R + 15},${CY} A15,15 0 0,1 ${CX + R + 15 * Math.cos(rad)},${CY - 15 * Math.sin(rad)}`}
        className="dg-thin dg-muted"
      />
      <MathLabel x={CX + R + 28} y={CY - 8} tex="40^{\\circ}" w={40} h={32} tone="muted" size="small" />

      {/* Weight - downward */}
      <Arrow x1={CX} y1={CY + R} x2={CX} y2={CY + 100} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={CX - 25} y={CY + 60} tex="30\\text{ N}" w={50} h={32} anchor="end" />
      <Label x={CX - 35} y={CY + 60} className="dg-text-small dg-text-muted">
        load
      </Label>

      <line x1={40} y1={270} x2={620} y2={270} className="dg-grid" />

      {/* Equations */}
      <Label x={330} y={290} className="dg-text dg-bold">
        Equilibrium equations
      </Label>

      <Label x={100} y={315} anchor="start" className="dg-text-small">
        Choose positive directions:
      </Label>
      <MathLabel x={100} y={340} anchor="start" tex="\\rightarrow\\ \\text{positive horizontal}" w={180} h={32} tone="muted" size="small" />
      <MathLabel x={100} y={362} anchor="start" tex="\\uparrow\\ \\text{positive vertical}" w={180} h={32} tone="muted" size="small" />

      <Label x={380} y={315} anchor="start" className="dg-text-small">
        Horizontal equilibrium (sum = 0):
      </Label>
      <MathLabel x={380} y={340} anchor="start" tex="T_2\\cos40^{\\circ} - T_1 = 0" w={180} h={32} tone="accent" />
      <MathLabel x={380} y={362} anchor="start" tex="T_1 = T_2\\cos40^{\\circ}" w={180} h={32} tone="accent" />

      <Label x={380} y={390} anchor="start" className="dg-text-small">
        Vertical equilibrium (sum = 0):
      </Label>
      <MathLabel x={380} y={415} anchor="start" tex="T_2\\sin40^{\\circ} - 30 = 0" w={180} h={32} tone="accent-2" />
      <MathLabel x={380} y={437} anchor="start" tex="T_2 = 30 / \\sin40^{\\circ} \\approx 46.7\\text{ N}" w={220} h={32} tone="accent-2" />

      <Label x={330} y={465} className="dg-text-small dg-text-muted">
        Solve: T₂ ≈ 46.7 N, then T₁ = T₂cos40° ≈ 35.8 N. Each equation balances the signed components in one direction.
      </Label>
    </Svg>
  );
}

export default ForcesEquilibriumResolvingEquilibrium;