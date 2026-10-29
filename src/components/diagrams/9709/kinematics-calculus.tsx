/**
 * The chain s(t) -> v(t) -> a(t). Differentiating moves right; integrating
 * moves left and brings back an arbitrary constant.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'kinematics-calculus';

const W = 660;
const H = 300;

function Box({ x, title, tex }: { x: number; title: string; tex: string }) {
  return (
    <g>
      <rect x={x} y={80} width={140} height={90} rx={10} className="dg-fill-muted dg-thin" />
      <Label x={x + 70} y={108} className="dg-text-small dg-text-muted">
        {title}
      </Label>
      <MathLabel x={x + 70} y={140} tex={tex} w={130} h={44} />
    </g>
  );
}

export function KinematicsCalculus() {
  return (
    <Svg width={W} height={H}>
      <Box x={20} title="displacement" tex="s(t)" />
      <Box x={260} title="velocity" tex="v=\dfrac{ds}{dt}" />
      <Box x={500} title="acceleration" tex="a=\dfrac{dv}{dt}" />

      <Arrow x1={164} y1={112} x2={256} y2={112} />
      <Arrow x1={404} y1={112} x2={496} y2={112} />
      <Label x={210} y={94} className="dg-text-small dg-text-accent">
        differentiate
      </Label>
      <Label x={450} y={94} className="dg-text-small dg-text-accent">
        differentiate
      </Label>

      <Arrow x1={496} y1={150} x2={404} y2={150} className="dg-accent-2" headClassName="dg-dot-accent" />
      <Arrow x1={256} y1={150} x2={164} y2={150} className="dg-accent-2" headClassName="dg-dot-accent" />
      <Label x={450} y={174} className="dg-text-small dg-text-accent-2">
        integrate
      </Label>
      <Label x={210} y={174} className="dg-text-small dg-text-accent-2">
        integrate
      </Label>

      <Label x={330} y={234} className="dg-text-small dg-text-muted">
        Integrating brings back an arbitrary constant, fixed by the starting values of s and v.
      </Label>
      <Label x={330} y={258} className="dg-text-small dg-text-muted">
        Example: s = 2t³ − 9t² + 12t gives v = 6t² − 18t + 12 and a = 12t − 18.
      </Label>
    </Svg>
  );
}

export default KinematicsCalculus;
