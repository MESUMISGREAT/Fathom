import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-intermolecular-forces-molecular-dipoles';

export default function MolecularDipoles() {
  return (
    <Svg width={620} height={290}>
      <MathLabel x={150} y={34} tex="\text{CO}_2" w={90} />
      <MathLabel x={460} y={34} tex="\text{H}_2\text{O}" w={90} />
      <line x1={98} y1={118} x2={126} y2={118} className="dg-line" /><line x1={174} y1={118} x2={202} y2={118} className="dg-line" />
      <Label x={78} y={118} className="dg-text dg-bold">O δ−</Label>
      <Label x={150} y={118} className="dg-text dg-bold">C δ+</Label>
      <Label x={222} y={118} className="dg-text dg-bold">O δ−</Label>
      <Arrow x1={139} y1={88} x2={90} y2={88} head={7} className="dg-accent" />
      <Arrow x1={161} y1={88} x2={210} y2={88} head={7} className="dg-accent" />
      <Label x={150} y={160} className="dg-text-small">equal arrows cancel</Label>
      <Label x={150} y={194} className="dg-text-small dg-bold">no overall dipole</Label>

      <line x1={414} y1={102} x2={402} y2={90} className="dg-line" />
      <line x1={414} y1={134} x2={402} y2={146} className="dg-line" />
      <Label x={432} y={118} className="dg-text dg-bold">O δ−</Label>
      <Label x={380} y={74} className="dg-text-small">H δ+</Label>
      <Label x={380} y={162} className="dg-text-small">H δ+</Label>
      <Arrow x1={402} y1={94} x2={421} y2={111} head={7} className="dg-accent" />
      <Arrow x1={402} y1={142} x2={421} y2={125} head={7} className="dg-accent" />
      <Arrow x1={352} y1={118} x2={409} y2={118} head={8} className="dg-accent-2" />
      <Label x={482} y={194} className="dg-text-small dg-bold">overall dipole remains</Label>
      <Label x={310} y={258} className="dg-text-small dg-text-muted">Arrows point toward the more electronegative atom</Label>
    </Svg>
  );
}
