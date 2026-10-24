/**
 * Modulus graph: the graph of y = |x| and a shifted version y = |2x + 4| show the vertex at the zero of the inside.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p2-algebra-modulus-graph';

export default function P2AlgebraModulusGraph() {
  return (
    <Svg width={520} height={220}>
      <line x1={40} y1={175} x2={480} y2={175} className="dg-thin" />
      <line x1={250} y1={30} x2={250} y2={195} className="dg-thin" />
      <path d="M 80 35 L 250 175 L 420 35" className="dg-accent" fill="none" strokeWidth={3} />
      <path d="M 90 43 L 170 175 L 250 43" className="dg-accent-2" fill="none" strokeWidth={3} />
      <Label x={154} y={194} className="dg-text-small">−2</Label>
      <Label x={246} y={194} className="dg-text-small">0</Label>
      <Label x={205} y={25} className="dg-text-small">y</Label>
      <Label x={470} y={194} className="dg-text-small">x</Label>
      <MathLabel x={42} y={18} tex="y = |2x + 4|" w={140} h={28} anchor="start" tone="accent-2" />
      <MathLabel x={326} y={39} tex="y = |x|" w={90} h={28} tone="accent" />
    </Svg>
  );
}
