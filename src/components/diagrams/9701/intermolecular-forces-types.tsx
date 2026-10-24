import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-intermolecular-forces-types';

export default function IntermolecularForcesTypes() {
  return (
    <Svg width={620} height={250}>
      {[105, 310, 515].map((x) => <line key={x} x1={x} y1={48} x2={x} y2={230} className="dg-grid" />)}
      <Label x={105} y={24} className="dg-text-small dg-bold">London (temporary)</Label>
      <Label x={310} y={24} className="dg-text-small dg-bold">Permanent dipoles</Label>
      <Label x={515} y={24} className="dg-text-small dg-bold">Hydrogen bond</Label>
      <circle cx={65} cy={125} r={29} className="dg-thin dg-fill-muted" />
      <circle cx={145} cy={125} r={29} className="dg-thin dg-fill-muted" />
      <Label x={54} y={125}>δ+</Label><Label x={76} y={125}>δ−</Label>
      <Label x={134} y={125}>δ+</Label><Label x={156} y={125}>δ−</Label>
      <line x1={94} y1={125} x2={116} y2={125} className="dg-muted dg-dashed" />
      <Label x={105} y={184} className="dg-text-small">temporary dipoles</Label>
      <circle cx={270} cy={125} r={29} className="dg-thin dg-fill-muted" />
      <circle cx={350} cy={125} r={29} className="dg-thin dg-fill-muted" />
      <Label x={259} y={125}>δ+</Label><Label x={281} y={125}>δ−</Label>
      <Label x={339} y={125}>δ+</Label><Label x={361} y={125}>δ−</Label>
      <line x1={299} y1={125} x2={321} y2={125} className="dg-muted dg-dashed" />
      <Label x={310} y={184} className="dg-text-small">opposite ends attract</Label>
      <Label x={465} y={125} className="dg-text dg-bold">O</Label>
      <Label x={510} y={125} className="dg-text dg-bold">H</Label>
      <Label x={557} y={125} className="dg-text dg-bold">O:</Label>
      <line x1={477} y1={125} x2={499} y2={125} className="dg-line" />
      <line x1={521} y1={125} x2={544} y2={125} className="dg-muted dg-dashed" />
      <Label x={515} y={184} className="dg-text-small">special dipole attraction</Label>
      <Label x={310} y={226} className="dg-text-small dg-text-muted">Dashed links act between molecules</Label>
    </Svg>
  );
}
