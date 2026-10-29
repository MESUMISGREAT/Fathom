import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-dot-cross-ionic-transfer';

function ElectronMark({ x, y, type }: { x: number; y: number; type: 'dot' | 'cross' }) {
  return type === 'dot' ? (
    <circle cx={x} cy={y} r={3.5} className="dg-dot" />
  ) : (
    <g className="dg-accent dg-thin">
      <line x1={x - 3.5} y1={y - 3.5} x2={x + 3.5} y2={y + 3.5} />
      <line x1={x + 3.5} y1={y - 3.5} x2={x - 3.5} y2={y + 3.5} />
    </g>
  );
}

export default function DotCrossIonicTransfer() {
  return (
    <Svg width={620} height={320}>
      <MathLabel x={310} y={24} tex="\text{NaCl}" w={90} />
      <circle cx={120} cy={102} r={34} className="dg-thin dg-fill-muted" /><Label x={120} y={102} className="dg-text dg-bold">Na</Label>
      <circle cx={270} cy={102} r={34} className="dg-thin dg-fill-muted" /><Label x={270} y={102} className="dg-text dg-bold">Cl</Label>
      <circle cx={160} cy={76} r={4} className="dg-dot" />
      <Label x={195} y={60} className="dg-text-small">one electron transfers</Label>
      <Arrow x1={165} y1={84} x2={225} y2={84} head={7} className="dg-accent" />
      <MathLabel x={120} y={165} tex="[\text{Na}]^+" w={100} />
      <line x1={239} y1={143} x2={239} y2={181} className="dg-line" />
      <line x1={239} y1={143} x2={247} y2={143} className="dg-line" />
      <line x1={239} y1={181} x2={247} y2={181} className="dg-line" />
      <line x1={301} y1={143} x2={301} y2={181} className="dg-line" />
      <line x1={293} y1={143} x2={301} y2={143} className="dg-line" />
      <line x1={293} y1={181} x2={301} y2={181} className="dg-line" />
      <Label x={270} y={165} className="dg-text dg-bold">Cl</Label>
      <Label x={316} y={146} className="dg-text-small">−</Label>
      {[
        [259, 147, 'cross'],
        [281, 147, 'cross'],
        [259, 177, 'cross'],
        [281, 177, 'cross'],
        [249, 157, 'cross'],
        [249, 169, 'cross'],
        [291, 157, 'cross'],
        [291, 169, 'dot'],
      ].map(([x, y, type]) => (
        <ElectronMark key={`${x}-${y}`} x={Number(x)} y={Number(y)} type={type as 'dot' | 'cross'} />
      ))}
      <Label x={195} y={190} className="dg-text-small">oppositely charged ions attract</Label>
      <Label x={465} y={165} className="dg-text-small">Cl⁻: 7 crosses + 1 dot</Label>

      <line x1={24} y1={214} x2={596} y2={214} className="dg-grid" />
      <MathLabel x={310} y={238} tex="\text{MgO}" w={90} />
      <circle cx={120} cy={278} r={27} className="dg-thin dg-fill-muted" /><Label x={120} y={278} className="dg-text dg-bold">Mg</Label>
      <circle cx={270} cy={278} r={27} className="dg-thin dg-fill-muted" /><Label x={270} y={278} className="dg-text dg-bold">O</Label>
      <circle cx={153} cy={258} r={3.5} className="dg-dot" /><circle cx={153} cy={298} r={3.5} className="dg-dot" />
      <Arrow x1={160} y1={265} x2={225} y2={265} head={6} className="dg-accent" />
      <Arrow x1={160} y1={291} x2={225} y2={291} head={6} className="dg-accent" />
      <line x1={389} y1={258} x2={389} y2={298} className="dg-line" />
      <line x1={389} y1={258} x2={397} y2={258} className="dg-line" />
      <line x1={389} y1={298} x2={397} y2={298} className="dg-line" />
      <line x1={431} y1={258} x2={431} y2={298} className="dg-line" />
      <line x1={423} y1={258} x2={431} y2={258} className="dg-line" />
      <line x1={423} y1={298} x2={431} y2={298} className="dg-line" />
      <Label x={410} y={278} className="dg-text dg-bold">Mg</Label>
      <Label x={445} y={260} className="dg-text-small">2+</Label>
      <Label x={470} y={278} className="dg-text dg-bold">+</Label>
      <line x1={491} y1={258} x2={491} y2={298} className="dg-line" />
      <line x1={491} y1={258} x2={499} y2={258} className="dg-line" />
      <line x1={491} y1={298} x2={499} y2={298} className="dg-line" />
      <line x1={547} y1={258} x2={547} y2={298} className="dg-line" />
      <line x1={539} y1={258} x2={547} y2={258} className="dg-line" />
      <line x1={539} y1={298} x2={547} y2={298} className="dg-line" />
      <Label x={520} y={278} className="dg-text dg-bold">O</Label>
      <Label x={562} y={260} className="dg-text-small">2−</Label>
      {[
        [508, 261, 'cross'],
        [532, 261, 'cross'],
        [502, 270, 'cross'],
        [502, 286, 'cross'],
        [508, 295, 'cross'],
        [532, 295, 'cross'],
        [538, 270, 'dot'],
        [538, 286, 'dot'],
      ].map(([x, y, type]) => (
        <ElectronMark key={`${x}-${y}`} x={Number(x)} y={Number(y)} type={type as 'dot' | 'cross'} />
      ))}
      <Label x={520} y={315} className="dg-text-small">O²⁻: 6 crosses + 2 dots</Label>
    </Svg>
  );
}
