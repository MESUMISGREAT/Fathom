import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-intermolecular-forces-hydrogen-bonds';

export default function IntermolecularForcesHydrogenBonds() {
  return (
    <Svg width={620} height={340}>
      <Label x={24} y={28} anchor="start" className="dg-text-small dg-bold">Water: O–H ⋯ O</Label>
      <circle cx={110} cy={105} r={27} className="dg-thin dg-fill-accent-2" />
      <circle cx={174} cy={105} r={20} className="dg-thin dg-fill-muted" />
      <circle cx={290} cy={105} r={27} className="dg-thin dg-fill-accent-2" />
      <circle cx={354} cy={105} r={20} className="dg-thin dg-fill-muted" />
      <line x1={137} y1={105} x2={154} y2={105} className="dg-line" />
      <line x1={194} y1={105} x2={263} y2={105} className="dg-muted dg-dashed" />
      <line x1={317} y1={105} x2={334} y2={105} className="dg-line" />
      <Label x={110} y={105} className="dg-text dg-bold">O δ−</Label>
      <Label x={174} y={105} className="dg-text-small">H δ+</Label>
      <Label x={290} y={105} className="dg-text dg-bold">O δ−</Label>
      <Label x={354} y={105} className="dg-text-small">H δ+</Label>
      <Label x={229} y={60} className="dg-text-small dg-text-accent">hydrogen bond</Label>
      <Label x={229} y={150} className="dg-text-small">solid = covalent O–H</Label>

      <line x1={25} y1={185} x2={595} y2={185} className="dg-grid" />
      <Label x={24} y={210} anchor="start" className="dg-text-small dg-bold">Ammonia: N–H ⋯ N</Label>
      <circle cx={110} cy={278} r={27} className="dg-thin dg-fill-accent-2" />
      <circle cx={174} cy={278} r={20} className="dg-thin dg-fill-muted" />
      <circle cx={290} cy={278} r={27} className="dg-thin dg-fill-accent-2" />
      <circle cx={354} cy={278} r={20} className="dg-thin dg-fill-muted" />
      <line x1={137} y1={278} x2={154} y2={278} className="dg-line" />
      <line x1={194} y1={278} x2={263} y2={278} className="dg-muted dg-dashed" />
      <line x1={317} y1={278} x2={334} y2={278} className="dg-line" />
      <Label x={110} y={278} className="dg-text dg-bold">N δ−</Label>
      <Label x={174} y={278} className="dg-text-small">H δ+</Label>
      <Label x={290} y={278} className="dg-text dg-bold">N:</Label>
      <Label x={354} y={278} className="dg-text-small">H</Label>
      <Label x={229} y={234} className="dg-text-small dg-text-accent">hydrogen bond</Label>
    </Svg>
  );
}
