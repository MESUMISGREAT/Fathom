/**
 * A visual reminder that transforming the model makes the graph linear.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'p2-logarithmic-exponential-linearising';

export default function P2LogarithmicExponentialLinearising() {
  return (
    <Svg width={620} height={240}>
      <rect x={20} y={20} width={280} height={200} rx={12} className="dg-fill-muted" />
      <rect x={320} y={20} width={280} height={200} rx={12} className="dg-fill-muted" />
      <Label x={122} y={42} className="dg-text-small">power law</Label>
      <Label x={416} y={42} className="dg-text-small">exponential law</Label>

      <line x1={68} y1={180} x2={270} y2={180} className="dg-thin" />
      <line x1={68} y1={180} x2={68} y2={74} className="dg-thin" />
      <line x1={68} y1={168} x2={240} y2={92} className="dg-accent" strokeWidth={3} />
      <MathLabel x={34} y={56} tex="\ln y" w={80} h={24} anchor="start" tone="muted" />
      <MathLabel x={270} y={198} tex="\ln x" w={80} h={24} anchor="end" tone="muted" />
      <MathLabel x={134} y={115} tex="n" w={24} h={24} tone="accent" />
      <MathLabel x={78} y={150} tex="\ln k" w={70} h={24} anchor="start" tone="muted" />

      <line x1={368} y1={180} x2={570} y2={180} className="dg-thin" />
      <line x1={368} y1={180} x2={368} y2={74} className="dg-thin" />
      <line x1={368} y1={168} x2={540} y2={92} className="dg-accent-2" strokeWidth={3} />
      <MathLabel x={334} y={56} tex="\ln y" w={80} h={24} anchor="start" tone="muted" />
      <MathLabel x={570} y={198} tex="x" w={40} h={24} anchor="end" tone="muted" />
      <MathLabel x={428} y={115} tex="\ln a" w={54} h={24} tone="accent-2" />
      <MathLabel x={378} y={150} tex="\ln k" w={70} h={24} anchor="start" tone="muted" />
    </Svg>
  );
}
