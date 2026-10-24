import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-intermolecular-forces-water-structure';

export default function WaterStructure() {
  const ice = [[95, 112], [145, 82], [195, 112], [195, 170], [145, 200], [95, 170]];
  const liquid = [[365, 96], [415, 84], [468, 110], [390, 139], [445, 155], [493, 177], [370, 188]];
  return (
    <Svg width={600} height={280}>
      <Label x={145} y={24} className="dg-text dg-bold">Ice</Label>
      <Label x={435} y={24} className="dg-text dg-bold">Liquid water</Label>
      {ice.map(([x, y], i) => {
        const [nx, ny] = ice[(i + 1) % ice.length]!;
        return <line key={`ice-link-${i}`} x1={x} y1={y} x2={nx} y2={ny} className="dg-muted dg-dashed" />;
      })}
      {ice.map(([x, y], i) => <circle key={`ice-${i}`} cx={x} cy={y} r={16} className="dg-thin dg-fill-accent" />)}
      {liquid.slice(0, -1).map(([x, y], i) => <line key={`water-link-${i}`} x1={x} y1={y} x2={liquid[i + 1]![0]} y2={liquid[i + 1]![1]} className="dg-muted dg-dashed" />)}
      {liquid.map(([x, y], i) => <circle key={`water-${i}`} cx={x} cy={y} r={16} className="dg-thin dg-fill-accent" />)}
      <Label x={145} y={238} className="dg-text-small">open arrangement</Label>
      <Label x={435} y={238} className="dg-text-small">molecules closer together</Label>
      <Label x={300} y={264} className="dg-text-small dg-bold">Same mass: ice takes up more space → lower density</Label>
    </Svg>
  );
}
