import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p2-trigonometry-r-form';

export default function RForm() {
  return (
    <Svg width={600} height={245}>
      <Label x={130} y={22} className="dg-text-accent">Match the coefficients</Label>
      <path d="M70 180 L70 84 L198 180 Z" fill="none" className="dg-line" />
      <line x1={70} y1={180} x2={82} y2={180} className="dg-thin" />
      <line x1={82} y1={180} x2={82} y2={168} className="dg-thin" />
      <MathLabel x={92} y={116} tex="\alpha" w={34} h={32} size="small" />
      <MathLabel x={56} y={130} tex="3" w={28} h={32} />
      <MathLabel x={134} y={196} tex="4" w={28} h={32} />
      <MathLabel x={144} y={124} tex="5" w={28} h={32} />
      <MathLabel x={410} y={70} tex="R^2 = 3^2 + 4^2 = 25" w={270} h={40} />
      <MathLabel x={410} y={112} tex="R = 5" w={180} h={40} />
      <MathLabel x={410} y={150} tex="cos \alpha = \dfrac{3}{5}" w={300} h={50} />
      <MathLabel x={410} y={204} tex="sin \alpha = \dfrac{4}{5}" w={300} h={50} />
    </Svg>
  );
}
