import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-density-pressure-liquid-column';

export default function LiquidColumn() {
  return (
    <Svg width={460} height={275}>
      <Label x={225} y={20} className="dg-text dg-bold">A column of liquid</Label>
      <rect x={155} y={65} width={140} height={155} className="dg-fill-accent-2" />
      <line x1={155} y1={65} x2={295} y2={65} className="dg-line" />
      <line x1={155} y1={220} x2={295} y2={220} className="dg-line" />
      <Arrow x1={225} y1={36} x2={225} y2={60} className="dg-muted" />
      <MathLabel x={360} y={65} tex="p_{\text{top}} A" w={105} h={28} />
      <Arrow x1={225} y1={250} x2={225} y2={224} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={360} y={228} tex="p_{\text{bottom}} A" w={140} h={28} />
      <Arrow x1={242} y1={90} x2={242} y2={195} double className="dg-thin" />
      <MathLabel x={265} y={143} tex="\Delta h" w={60} h={30} anchor="start" />
      <Arrow x1={105} y1={112} x2={105} y2={170} className="dg-muted" />
      <MathLabel x={80} y={101} tex="mg" w={50} h={26} />
      <Label x={82} y={187} className="dg-text-small dg-text-muted">weight</Label>
      <Label x={355} y={105} className="dg-text-small dg-text-muted">cross-sectional</Label>
      <Label x={355} y={123} className="dg-text-small dg-text-muted">area A</Label>
      <Label x={355} y={175} className="dg-text-small dg-text-accent">liquid density ρ</Label>
    </Svg>
  );
}