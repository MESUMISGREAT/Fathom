import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-density-pressure-pressure-area';

export default function PressureArea() {
  return (
    <Svg width={470} height={235}>
      <MathLabel x={235} y={34} tex="p = \dfrac{F}{A}" w={160} h={50} size="large" />
      <Label x={130} y={62} className="dg-text dg-bold">Same normal force</Label>
      <Label x={350} y={62} className="dg-text dg-bold">Same normal force</Label>
      <rect x={85} y={110} width={90} height={48} rx={4} className="dg-line dg-fill-muted" />
      <rect x={328} y={110} width={44} height={48} rx={4} className="dg-line dg-fill-muted" />
      <Arrow x1={130} y1={70} x2={130} y2={103} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={350} y1={70} x2={350} y2={103} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={106} y={82} tex="F" w={30} h={26} />
      <MathLabel x={376} y={82} tex="F" w={30} h={26} />
      <line x1={55} y1={163} x2={205} y2={163} className="dg-line" />
      <line x1={305} y1={163} x2={395} y2={163} className="dg-line" />
      <MathLabel x={130} y={187} tex="A_{\text{large}}" w={120} h={30} />
      <MathLabel x={350} y={187} tex="A_{\text{small}}" w={120} h={30} />
      <Label x={130} y={218} className="dg-text-small dg-text-muted">force spread out</Label>
      <Label x={350} y={218} className="dg-text-small dg-text-accent">force concentrated</Label>
    </Svg>
  );
}