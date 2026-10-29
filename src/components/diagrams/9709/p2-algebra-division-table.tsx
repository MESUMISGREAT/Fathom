/**
 * Long division sketch for a polynomial in x.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p2-algebra-division-table';

export default function P2AlgebraDivisionTable() {
  return (
    <Svg width={540} height={250}>
      <rect x={24} y={20} width={492} height={212} rx={12} className="dg-fill-muted" />
      <Label x={44} y={48} anchor="start" className="dg-text-small">polynomial division identity</Label>
      <MathLabel
        x={270}
        y={80}
        tex="x^3 + 3x^2 - 13x - 15"
        w={450}
        h={34}
      />
      <MathLabel x={270} y={118} tex="=(x+3)(x^2-13)+24" w={450} h={34} />
      <Label x={90} y={171} className="dg-text-small">divisor</Label>
      <MathLabel x={90} y={191} tex="x+3" w={70} h={28} tone="accent" />
      <Label x={270} y={171} className="dg-text-small">quotient</Label>
      <MathLabel x={270} y={191} tex="x^2-13" w={100} h={28} tone="accent-2" />
      <Label x={440} y={171} className="dg-text-small">remainder</Label>
      <MathLabel x={440} y={191} tex="24" w={60} h={28} tone="muted" />
    </Svg>
  );
}
