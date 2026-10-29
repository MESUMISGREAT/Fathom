import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-logic-gates-expression-circuit';

const W = 600;
const H = 225;

export function LogicGatesExpressionCircuit() {
  return (
    <Svg width={W} height={H}>
      <Label x={28} y={53} anchor="start" className="dg-text dg-mono">A</Label>
      <Label x={28} y={158} anchor="start" className="dg-text dg-mono">B</Label>
      <line x1="47" y1="60" x2="110" y2="60" className="dg-line" />
      <path d="M110 42 L146 60 L110 78 Z" className="dg-line" />
      <circle cx="151" cy="60" r="5" className="dg-fill-muted dg-thin" />
      <Label x={128} y={31} className="dg-text-small dg-text-muted">NOT</Label>
      <path d="M156 60 H260 V74 H300" className="dg-line" />
      <path d="M47 160 H230 V94 H300" className="dg-line" />
      <path d="M300 64 H320 A20 20 0 0 1 320 104 H300 Z" className="dg-line" />
      <path d="M340 84 H510" className="dg-line" />
      <Label x={520} y={84} anchor="start" className="dg-text dg-mono">Y</Label>
      <Label x={W / 2} y={H - 17} className="dg-text dg-bold">Y = (NOT A) AND B</Label>
    </Svg>
  );
}

export default LogicGatesExpressionCircuit;
