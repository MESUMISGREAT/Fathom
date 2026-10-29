import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-density-pressure-upthrust';

export default function Upthrust() {
  return (
    <Svg width={470} height={300}>
      <Label x={235} y={18} className="dg-text dg-bold">Pressure forces on a submerged object</Label>
      <rect x={170} y={90} width={130} height={130} rx={5} className="dg-thin dg-fill-muted" />
      <Label x={235} y={153} className="dg-text dg-bold">object</Label>
      <Arrow x1={192} y1={50} x2={192} y2={86} className="dg-muted" />
      <Arrow x1={235} y1={50} x2={235} y2={86} className="dg-muted" />
      <Arrow x1={278} y1={50} x2={278} y2={86} className="dg-muted" />
      <Label x={235} y={42} className="dg-text-small dg-text-muted">pressure above</Label>
      <Arrow x1={192} y1={266} x2={192} y2={224} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={235} y1={270} x2={235} y2={224} className="dg-accent" headClassName="dg-dot-accent" head={12} />
      <Arrow x1={278} y1={266} x2={278} y2={224} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={235} y={290} className="dg-text-small dg-text-accent">greater pressure below → net force upward</Label>
      <Arrow x1={130} y1={112} x2={165} y2={112} className="dg-muted" />
      <Arrow x1={130} y1={152} x2={165} y2={152} className="dg-muted" />
      <Arrow x1={340} y1={112} x2={305} y2={112} className="dg-muted" />
      <Arrow x1={340} y1={152} x2={305} y2={152} className="dg-muted" />
      <Label x={95} y={132} className="dg-text-small dg-text-muted">side forces</Label>
      <Label x={375} y={132} className="dg-text-small dg-text-muted">balance</Label>
      <MathLabel x={310} y={76} tex="F_{\text{top}}" w={90} h={26} anchor="start" />
      <MathLabel x={310} y={238} tex="F_{\text{bottom}} > F_{\text{top}}" w={150} h={28} anchor="start" />
    </Svg>
  );
}