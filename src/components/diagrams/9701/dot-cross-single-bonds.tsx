import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-dot-cross-single-bonds';

function Pair({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x - 4} cy={y} r={3} className="dg-dot" /><line x1={x + 1} y1={y - 4} x2={x + 7} y2={y + 4} className="dg-accent dg-thin" /><line x1={x + 7} y1={y - 4} x2={x + 1} y2={y + 4} className="dg-accent dg-thin" /></g>;
}

function LonePair({ x, y }: { x: number; y: number }) {
  return <g><circle cx={x - 4} cy={y} r={3} className="dg-dot" /><circle cx={x + 4} cy={y} r={3} className="dg-dot" /></g>;
}

export default function DotCrossSingleBonds() {
  return (
    <Svg width={620} height={300}>
      <MathLabel x={165} y={28} tex="\text{H}_2\text{O}" w={100} />
      <MathLabel x={455} y={28} tex="\text{NH}_3" w={100} />
      <circle cx={165} cy={150} r={31} className="dg-thin dg-fill-muted" />
      <Label x={165} y={150} className="dg-text dg-bold">O</Label>
      <circle cx={78} cy={92} r={24} className="dg-thin dg-fill-muted" />
      <circle cx={78} cy={208} r={24} className="dg-thin dg-fill-muted" />
      <Label x={78} y={92}>H</Label><Label x={78} y={208}>H</Label>
      <line x1={142} y1={135} x2={98} y2={106} className="dg-line" />
      <line x1={142} y1={165} x2={98} y2={194} className="dg-line" />
      <Pair x={120} y={120} /><Pair x={120} y={180} />
      <LonePair x={155} y={102} /><LonePair x={172} y={102} />
      <LonePair x={155} y={198} /><LonePair x={172} y={198} />
      <Label x={165} y={248} className="dg-text-small">two bonds + two lone pairs</Label>

      <circle cx={455} cy={150} r={31} className="dg-thin dg-fill-muted" />
      <Label x={455} y={150} className="dg-text dg-bold">N</Label>
      <circle cx={368} cy={92} r={24} className="dg-thin dg-fill-muted" />
      <circle cx={368} cy={150} r={24} className="dg-thin dg-fill-muted" />
      <circle cx={368} cy={208} r={24} className="dg-thin dg-fill-muted" />
      <Label x={368} y={92}>H</Label><Label x={368} y={150}>H</Label><Label x={368} y={208}>H</Label>
      <line x1={432} y1={135} x2={388} y2={106} className="dg-line" />
      <line x1={424} y1={150} x2={392} y2={150} className="dg-line" />
      <line x1={432} y1={165} x2={388} y2={194} className="dg-line" />
      <Pair x={410} y={120} /><Pair x={408} y={150} /><Pair x={410} y={180} />
      <LonePair x={455} y={101} />
      <Label x={455} y={248} className="dg-text-small">three bonds + one lone pair</Label>
      <circle cx={282} cy={278} r={3} className="dg-dot" />
      <Label x={294} y={278} anchor="start" className="dg-text-small">dot from one atom</Label>
      <line x1={430} y1={274} x2={438} y2={282} className="dg-accent dg-thin" />
      <line x1={438} y1={274} x2={430} y2={282} className="dg-accent dg-thin" />
      <Label x={446} y={278} anchor="start" className="dg-text-small">cross from the other</Label>
    </Svg>
  );
}
