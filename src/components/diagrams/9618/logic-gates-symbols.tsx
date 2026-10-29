import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-logic-gates-symbols';

const W = 630;
const H = 310;
const gates = [
  { name: 'NOT', kind: 'not' },
  { name: 'AND', kind: 'and' },
  { name: 'OR', kind: 'or' },
  { name: 'NAND', kind: 'nand' },
  { name: 'NOR', kind: 'nor' },
  { name: 'XOR', kind: 'xor' },
] as const;

type GateKind = (typeof gates)[number]['kind'];

function GateSymbol({ x, y, kind }: { x: number; y: number; kind: GateKind }) {
  const inverted = kind === 'not' || kind === 'nand' || kind === 'nor';
  const shape = kind === 'not'
    ? `M${x},${y - 20} L${x + 36},${y} L${x},${y + 20} Z`
    : kind === 'and' || kind === 'nand'
      ? `M${x},${y - 20} H${x + 18} A20 20 0 0 1 ${x + 18} ${y + 20} H${x} Z`
      : kind === 'or' || kind === 'nor'
        ? `M${x},${y - 20} Q${x + 17} ${y - 20} ${x + 38} ${y} Q${x + 17} ${y + 20} ${x} ${y + 20} Q${x + 12} ${y} ${x} ${y - 20} Z`
        : `M${x},${y - 20} Q${x + 17} ${y - 20} ${x + 38} ${y} Q${x + 17} ${y + 20} ${x} ${y + 20} Q${x + 12} ${y} ${x} ${y - 20} Z`;
  const inputY = kind === 'not' ? [y] : [y - 9, y + 9];
  const bodyStart = kind === 'xor' ? x + 4 : x;
  const bubbleX = x + 42;
  const outputStart = inverted ? bubbleX + 4 : x + 38;
  return (
    <g>
      {inputY.map((py, i) => <line key={i} x1={x - 24} y1={py} x2={bodyStart} y2={py} className="dg-line" />)}
      <path d={shape} className="dg-line" />
      {kind === 'xor' && <path d={`M${x - 7},${y - 20} Q${x + 5},${y} ${x - 7},${y + 20}`} className="dg-line" />}
      {inverted && <circle cx={bubbleX} cy={y} r="4" className="dg-fill-muted dg-thin" />}
      <line x1={outputStart} y1={y} x2={x + 61} y2={y} className="dg-line" />
    </g>
  );
}

export function LogicGatesSymbols() {
  return (
    <Svg width={W} height={H}>
      {gates.map((gate, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const left = 18 + col * 205;
        const cy = 80 + row * 145;
        return (
          <g key={gate.name}>
            <GateSymbol x={left + 58} y={cy} kind={gate.kind} />
            <Label x={left + 142} y={cy} anchor="start" className="dg-text dg-bold">{gate.name}</Label>
            {gate.kind === 'not' && <Label x={left + 142} y={cy + 20} anchor="middle" className="dg-text-small dg-text-muted">one input</Label>}
            {gate.kind === 'xor' && <Label x={left + 142} y={cy + 20} anchor="middle" className="dg-text-small dg-text-muted">inputs differ</Label>}
          </g>
        );
      })}
      <Label x={W / 2} y={H - 15} className="dg-text-small dg-text-muted">A small output circle means NOT the gate's usual result.</Label>
    </Svg>
  );
}

export default LogicGatesSymbols;


