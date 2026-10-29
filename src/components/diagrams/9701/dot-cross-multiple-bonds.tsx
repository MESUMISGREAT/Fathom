import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-dot-cross-multiple-bonds';

function Pair({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x - 4} cy={y} r={3} className="dg-dot" /><line x1={x + 1} y1={y - 4} x2={x + 7} y2={y + 4} className="dg-accent dg-thin" /><line x1={x + 7} y1={y - 4} x2={x + 1} y2={y + 4} className="dg-accent dg-thin" /></g>;
}

export default function DotCrossMultipleBonds() {
  return (
    <Svg width={620} height={470}>
      <MathLabel x={150} y={28} tex="\text{O}_2" w={90} />
      <MathLabel x={470} y={28} tex="\text{N}_2" w={90} />
      {[100, 116].map((y) => <line key={y} x1={100} y1={y} x2={200} y2={y} className="dg-line" />)}
      <circle cx={82} cy={108} r={26} className="dg-thin dg-fill-muted" /><Label x={82} y={108} className="dg-text dg-bold">O</Label>
      <circle cx={218} cy={108} r={26} className="dg-thin dg-fill-muted" /><Label x={218} y={108} className="dg-text dg-bold">O</Label>
      <Pair x={145} y={98} /><Pair x={145} y={118} />
      <Label x={150} y={158} className="dg-text-small">2 shared pairs</Label>

      {[92, 108, 124].map((y) => <line key={y} x1={420} y1={y} x2={520} y2={y} className="dg-line" />)}
      <circle cx={402} cy={108} r={26} className="dg-thin dg-fill-muted" /><Label x={402} y={108} className="dg-text dg-bold">N</Label>
      <circle cx={538} cy={108} r={26} className="dg-thin dg-fill-muted" /><Label x={538} y={108} className="dg-text dg-bold">N</Label>
      <Pair x={465} y={92} /><Pair x={465} y={108} /><Pair x={465} y={124} />
      <Label x={470} y={158} className="dg-text-small">3 shared pairs</Label>

      <MathLabel x={310} y={196} tex="\text{CO}_2" w={100} />
      {[{ x1: 240, y: 254, x2: 288 }, { x1: 240, y: 270, x2: 288 }, { x1: 332, y: 254, x2: 428 }, { x1: 332, y: 270, x2: 428 }].map(({ x1, y, x2 }) => <line key={`${x1}-${y}`} x1={x1} y1={y} x2={x2} y2={y} className="dg-line" />)}
      <circle cx={220} cy={262} r={24} className="dg-thin dg-fill-muted" /><Label x={220} y={262} className="dg-text dg-bold">O</Label>
      <circle cx={310} cy={262} r={24} className="dg-thin dg-fill-muted" /><Label x={310} y={262} className="dg-text dg-bold">C</Label>
      <circle cx={450} cy={262} r={24} className="dg-thin dg-fill-muted" /><Label x={450} y={262} className="dg-text dg-bold">O</Label>
      <Pair x={265} y={254} /><Pair x={265} y={270} />
      <Pair x={380} y={254} /><Pair x={380} y={270} />
      <Label x={310} y={316} className="dg-text-small">two shared pairs in each C=O bond</Label>
      <MathLabel x={310} y={346} tex="\text{C}_2\text{H}_4\quad \text{C=C plus four C-H pairs}" w={380} h={30} size="small" />
      <MathLabel x={310} y={372} tex="\text{HCN}" w={80} h={24} size="small" />
      <circle cx={155} cy={420} r={20} className="dg-thin dg-fill-muted" /><Label x={155} y={420} className="dg-text dg-bold">H</Label>
      <circle cx={290} cy={420} r={24} className="dg-thin dg-fill-muted" /><Label x={290} y={420} className="dg-text dg-bold">C</Label>
      <circle cx={425} cy={420} r={24} className="dg-thin dg-fill-muted" /><Label x={425} y={420} className="dg-text dg-bold">N</Label>
      <line x1={175} y1={420} x2={266} y2={420} className="dg-line" />
      <Pair x={220} y={420} />
      {[405, 420, 435].map((y) => <line key={y} x1={314} y1={y} x2={401} y2={y} className="dg-line" />)}
      <Pair x={357} y={405} /><Pair x={357} y={420} /><Pair x={357} y={435} />
      <circle cx={419} cy={386} r={3} className="dg-dot" /><circle cx={429} cy={386} r={3} className="dg-dot" />
      <Label x={290} y={458} className="dg-text-small">one H–C pair + three C≡N pairs</Label>
    </Svg>
  );
}
