/**
 * A journey 12 m east, 8 m north, then 6 m west. The distance travelled is
 * 26 m, but the displacement is the straight arrow from start to finish:
 * 10 m at about 53 degrees north of east.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'kinematics-distance-displacement';

const W = 660;
const H = 300;

export function KinematicsDistanceDisplacement() {
  return (
    <Svg width={W} height={H}>
      <Label x={60} y={40} anchor="start" className="dg-text dg-bold">
        A journey with three legs
      </Label>

      {/* the path */}
      <Arrow x1={110} y1={230} x2={350} y2={230} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={350} y1={230} x2={350} y2={70} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={350} y1={70} x2={230} y2={70} className="dg-accent" headClassName="dg-dot-accent" />

      {/* displacement */}
      <Arrow x1={110} y1={230} x2={230} y2={70} double className="dg-accent-2 dg-dashed" headClassName="dg-dot" />

      <circle cx={110} cy={230} r={5} className="dg-dot" />
      <circle cx={230} cy={70} r={5} className="dg-dot" />
      <Label x={98} y={252} anchor="middle" className="dg-text-small dg-text-muted">
        start
      </Label>
      <Label x={244} y={92} anchor="start" className="dg-text-small dg-text-muted">
        finish
      </Label>

      <Label x={230} y={218} className="dg-text-small dg-text-accent">
        12 m east
      </Label>
      <Label x={364} y={155} anchor="start" className="dg-text-small dg-text-accent">
        8 m north
      </Label>
      <Label x={290} y={58} className="dg-text-small dg-text-accent">
        6 m west
      </Label>
      <Label x={128} y={168} anchor="end" className="dg-text-small dg-text-accent-2">
        displacement
      </Label>

      <Label x={430} y={120} anchor="start" className="dg-text">
        distance = 26 m
      </Label>
      <Label x={430} y={146} anchor="start" className="dg-text">
        displacement = 10 m
      </Label>
      <Label x={430} y={170} anchor="start" className="dg-text-small dg-text-muted">
        (6 m east, 8 m north:
      </Label>
      <Label x={430} y={190} anchor="start" className="dg-text-small dg-text-muted">
        a 6-8-10 triangle)
      </Label>
      <MathLabel x={500} y={230} tex="\text{distance}\ \geq\ |\text{displacement}|" w={250} h={40} tone="muted" />
    </Svg>
  );
}

export default KinematicsDistanceDisplacement;
