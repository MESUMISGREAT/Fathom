import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-dot-cross-octet-exceptions';

function Pair({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x - 4} cy={y} r={3} className="dg-dot" /><line x1={x + 1} y1={y - 4} x2={x + 7} y2={y + 4} className="dg-accent dg-thin" /><line x1={x + 7} y1={y - 4} x2={x + 1} y2={y + 4} className="dg-accent dg-thin" /></g>;
}

export default function DotCrossOctetExceptions() {
  const p = { x: 170, y: 153 };
  const pcl: Array<[number, number]> = [[170, 67], [75, 137], [265, 137], [112, 248], [228, 248]];
  const s = { x: 475, y: 153 };
  const sf: Array<[number, number]> = [[475, 61], [558, 107], [558, 199], [475, 245], [392, 199], [392, 107]];
  return (
    <Svg width={660} height={390}>
      <MathLabel x={170} y={24} tex="\text{PCl}_5" w={100} />
      <MathLabel x={475} y={24} tex="\text{SF}_6" w={100} />
      {pcl.map(([x, y], i) => <g key={`p-${i}`}>
        <line x1={p.x} y1={p.y} x2={x} y2={y} className="dg-line" />
        <Pair x={(p.x + x) / 2} y={(p.y + y) / 2} />
        <circle cx={x} cy={y} r={22} className="dg-thin dg-fill-muted" /><Label x={x} y={y} className="dg-text-small">Cl</Label>
      </g>)}
      <circle cx={p.x} cy={p.y} r={27} className="dg-thin dg-fill-accent-2" /><Label x={p.x} y={p.y} className="dg-text dg-bold">P</Label>
      {sf.map(([x, y], i) => <g key={`s-${i}`}>
        <line x1={s.x} y1={s.y} x2={x} y2={y} className="dg-line" />
        <Pair x={(s.x + x) / 2} y={(s.y + y) / 2} />
        <circle cx={x} cy={y} r={22} className="dg-thin dg-fill-muted" /><Label x={x} y={y} className="dg-text-small">F</Label>
      </g>)}
      <circle cx={s.x} cy={s.y} r={27} className="dg-thin dg-fill-accent-2" /><Label x={s.x} y={s.y} className="dg-text dg-bold">S</Label>
      <Label x={170} y={285} className="dg-text-small">5 pairs = 10 electrons (PF₅ too)</Label>
      <Label x={475} y={285} className="dg-text-small">6 pairs = 12 electrons</Label>
      <line x1={25} y1={312} x2={635} y2={312} className="dg-grid" />
      <MathLabel x={110} y={339} tex="\text{SO}_2" w={80} size="small" />
      <Label x={110} y={365} className="dg-text-small">10 around S</Label>
      <MathLabel x={330} y={339} tex="\text{BF}_3" w={80} size="small" />
      <Label x={330} y={365} className="dg-text-small">6 around B: incomplete</Label>
      <MathLabel x={545} y={339} tex="\text{NO}_2" w={80} size="small" />
      <Label x={545} y={365} className="dg-text-small">17 total: one unpaired</Label>
      <circle cx={584} cy={329} r={3.5} className="dg-dot" />
    </Svg>
  );
}
