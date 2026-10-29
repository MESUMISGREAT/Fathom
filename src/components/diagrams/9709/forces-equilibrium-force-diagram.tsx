/**
 * Force diagram for a parcel on a rough horizontal table pulled by a horizontal string.
 * Forces: weight (mg) down, normal reaction (R) up, tension (T) right, friction (F) left.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'forces-equilibrium-force-diagram';

const W = 660;
const H = 330;
const CX = 330;
const CY = 165;
const R = 20;

export function ForcesEquilibriumForceDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={330} y={30} className="dg-text dg-bold">
        Force diagram: parcel on a rough horizontal table pulled by a string
      </Label>

      {/* The parcel as a dot */}
      <circle cx={CX} cy={CY} r={R} className="dg-fill-accent dg-thin" />
      <Label x={CX} y={CY} className="dg-text-small dg-bold">P</Label>

      {/* Weight - downward */}
      <Arrow x1={CX} y1={CY + R} x2={CX} y2={CY + 110} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={CX - 38} y={CY + 75} tex="mg" w={30} h={32} anchor="end" tone="accent" />
      <Label x={CX - 48} y={CY + 75} className="dg-text-small dg-text-muted">
        weight
      </Label>

      {/* Normal reaction - upward */}
      <Arrow x1={CX} y1={CY - R} x2={CX} y2={CY - 110} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={CX - 38} y={CY - 65} tex="R" w={30} h={32} anchor="end" tone="accent" />
      <Label x={CX - 48} y={CY - 65} className="dg-text-small dg-text-muted">
        normal reaction
      </Label>

      {/* Tension - right */}
      <Arrow x1={CX + R} y1={CY} x2={CX + 110} y2={CY} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={CX + 75} y={CY - 20} tex="T" w={30} h={32} anchor="start" tone="accent" />
      <Label x={CX + 75} y={CY - 20} className="dg-text-small dg-text-muted">
        tension
      </Label>

      {/* Friction - left */}
      <Arrow x1={CX - R} y1={CY} x2={CX - 110} y2={CY} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={CX - 75} y={CY - 20} tex="F" w={30} h={32} anchor="end" tone="accent" />
      <Label x={CX - 75} y={CY - 20} className="dg-text-small dg-text-muted">
        friction
      </Label>

      {/* Table surface indication */}
      <line x1={CX - 150} y1={CY + 140} x2={CX + 150} y2={CY + 140} className="dg-thin dg-muted" />
      <Label x={330} y={CY + 160} className="dg-text-small dg-text-muted">
        rough horizontal table
      </Label>

      {/* String indication */}
      <line x1={CX + 115} y1={CY} x2={CX + 200} y2={CY} className="dg-dashed dg-muted" />
      <Label x={CX + 210} y={CY - 10} anchor="start" className="dg-text-small dg-text-muted">
        string pulled to the right
      </Label>

      <Label x={330} y={300} className="dg-text-small dg-text-muted">
        Four forces: weight, normal reaction, tension, friction. One arrow per interaction.
      </Label>
    </Svg>
  );
}

export default ForcesEquilibriumForceDiagram;