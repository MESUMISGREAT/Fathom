import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-dot-cross-coordinate';

export default function DotCrossCoordinate() {
  return (
    <Svg width={620} height={410}>
      <MathLabel x={94} y={34} tex="\text{NH}_3" w={90} />
      <circle cx={100} cy={125} r={32} className="dg-thin dg-fill-muted" />
      <Label x={100} y={125} className="dg-text dg-bold">N</Label>
      <circle cx={143} cy={110} r={3.5} className="dg-dot" /><circle cx={151} cy={118} r={3.5} className="dg-dot" />
      <Label x={166} y={90} anchor="start" className="dg-text-small">lone pair</Label>
      <Label x={221} y={125} className="dg-text dg-bold">+</Label>
      <MathLabel x={270} y={125} tex="\text{H}^+" w={70} />
      <Arrow x1={315} y1={125} x2={385} y2={125} head={9} className="dg-accent" />
      <MathLabel x={500} y={34} tex="[\text{NH}_4]^+" w={150} />
      <circle cx={478} cy={125} r={34} className="dg-thin dg-fill-muted" />
      <circle cx={555} cy={125} r={24} className="dg-thin dg-fill-muted" />
      <Label x={478} y={125} className="dg-text dg-bold">N</Label><Label x={555} y={125}>H</Label>
      <line x1={512} y1={125} x2={531} y2={125} className="dg-line" />
      <circle cx={517} cy={118} r={3.5} className="dg-dot" /><circle cx={525} cy={132} r={3.5} className="dg-dot" />
      <Label x={516} y={188} className="dg-text-small">both electrons came from N</Label>
      <Label x={310} y={235} className="dg-text-small dg-text-muted">The pair is shared after the bond forms</Label>
      <line x1={24} y1={270} x2={596} y2={270} className="dg-grid" />
      <MathLabel x={310} y={294} tex="\text{Al}_2\text{Cl}_6" w={120} />
      <circle cx={225} cy={344} r={28} className="dg-thin dg-fill-muted" />
      <circle cx={395} cy={344} r={28} className="dg-thin dg-fill-muted" />
      <Label x={225} y={344} className="dg-text dg-bold">Cl</Label>
      <Label x={395} y={344} className="dg-text dg-bold">Al</Label>
      <line x1={253} y1={344} x2={367} y2={344} className="dg-line" />
      <circle cx={300} cy={336} r={3.5} className="dg-dot" />
      <circle cx={310} cy={336} r={3.5} className="dg-dot" />
      <Label x={310} y={387} className="dg-text-small">a bridging chlorine donates both electrons</Label>
    </Svg>
  );
}
