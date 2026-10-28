/**
 * Two routes between the same reactants and products: a direct one and one via an intermediate.
 * Hess's law says the two totals are equal.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'chem-hess-law-route-independence';

const W = 640;
const H = 400;

const box = (x: number, y: number, w: number, text: string) => (
  <g>
    <rect x={x - w / 2} y={y - 26} width={w} height={52} rx={8} className="dg-fill-muted" />
    <Label x={x} y={y} className="dg-text-small">
      {text}
    </Label>
  </g>
);

export function HessLawRouteIndependence() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        Two routes, one enthalpy change
      </Label>

      {box(110, 120, 150, 'reactants')}
      {box(530, 120, 150, 'products')}
      {box(320, 300, 210, 'intermediate')}

      {/* direct route */}
      <Arrow x1={190} y1={112} x2={452} y2={112} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={320} y={86} tex="\Delta H\ \text{(direct)}" w={160} h={26} size="small" />

      {/* via intermediate */}
      <Arrow x1={160} y1={148} x2={255} y2={278} className="dg-line" />
      <Arrow x1={390} y1={278} x2={485} y2={150} className="dg-line" />
      <MathLabel x={168} y={228} tex="\Delta H_1" w={70} h={26} size="small" anchor="end" />
      <MathLabel x={478} y={228} tex="\Delta H_2" w={70} h={26} size="small" anchor="start" />

      <Label x={320} y={352} className="dg-text-small dg-text-muted">
        same start, same finish, so the totals match
      </Label>

      <MathLabel
        x={W / 2}
        y={H - 18}
        tex="\Delta H\ \text{(direct)} = \Delta H_1 + \Delta H_2"
        w={280}
        h={30}
      />
    </Svg>
  );
}

export default HessLawRouteIndependence;
