/**
 * Work done when the force is at an angle. Left: a suitcase pulled 4.0 m by a
 * 50 N strap at 30° to the floor, resolved into F cos 30° = 43.3 N along the
 * motion (which does the work) and F sin 30° = 25 N perpendicular to it.
 * Right: a basket carried 12 m along a level floor by a 30 N support force at
 * 90° to the motion, so no work is done.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-energy-conservation-work-angle';

const W = 640;
const H = 320;

export function EnergyConservationWorkAngle() {
  const ox = 110;
  const oy = 170;
  const len = 140;
  const th = (30 * Math.PI) / 180;
  const tipX = ox + len * Math.cos(th);
  const tipY = oy - len * Math.sin(th);
  const compX = ox + len * Math.cos(th);
  return (
    <Svg width={W} height={H}>
      <Label x={195} y={26} className="dg-text dg-bold">
        Pulling at an angle
      </Label>
      <line x1={30} y1={210} x2={360} y2={210} className="dg-thin" />
      <rect x={40} y={165} width={70} height={40} className="dg-fill-accent dg-accent" />
      <Label x={75} y={186} className="dg-text-small">
        case
      </Label>
      {/* right-angle mark at the foot of the vertical component */}
      <path d={`M${compX - 11},${oy} L${compX - 11},${oy - 11} L${compX},${oy - 11}`} className="dg-thin" />
      <path d={`M${ox + 40},${oy} A40,40 0 0 0 ${ox + 40 * Math.cos(th)},${oy - 40 * Math.sin(th)}`} className="dg-thin" />
      <Label x={148} y={150} className="dg-text-small dg-italic">
        30°
      </Label>
      <Arrow x1={ox} y1={oy} x2={compX} y2={oy} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={compX} y1={oy} x2={compX} y2={tipY} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={ox} y1={oy} x2={tipX} y2={tipY} className="dg-line" head={11} />
      <Label x={172} y={114} className="dg-text dg-bold">
        F = 50 N
      </Label>
      <Label x={205} y={192} className="dg-text-small dg-text-accent-2">
        F cos 30° = 43.3 N
      </Label>
      <Label x={237} y={132} anchor="start" className="dg-text-small dg-text-accent-2">
        F sin 30° = 25 N
      </Label>
      <Label x={188} y={226} className="dg-text-small dg-text-muted">
        moves 4.0 m along the floor
      </Label>
      <Arrow x1={60} y1={242} x2={210} y2={242} double className="dg-muted" head={7} />
      <MathLabel
        x={200}
        y={290}
        w={380}
        h={34}
        tex={String.raw`W = Fs\cos 30^\circ = 50 \times 4.0 \times \cos 30^\circ = 173\ \text{J}`}
      />
      {/* right panel */}
      <line x1={380} y1={40} x2={380} y2={256} className="dg-grid" />
      <Label x={505} y={26} className="dg-text dg-bold">
        Carrying a basket
      </Label>
      <line x1={390} y1={210} x2={630} y2={210} className="dg-thin" />
      <rect x={455} y={160} width={80} height={32} className="dg-fill-accent dg-accent" />
      <Label x={495} y={178} className="dg-text-small">
        basket
      </Label>
      <Arrow x1={495} y1={158} x2={495} y2={100} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={495} y={84} className="dg-text-small dg-text-accent-2">
        support force, 30 N
      </Label>
      <Arrow x1={400} y1={236} x2={620} y2={236} double className="dg-muted" head={7} />
      <Label x={510} y={254} className="dg-text-small dg-text-muted">
        walks 12 m
      </Label>
      <Label x={505} y={286} className="dg-text-small">
        force at right angles to the motion
      </Label>
      <Label x={505} y={306} className="dg-text-small dg-text-accent-2">
        so W = 0 J
      </Label>
    </Svg>
  );
}

export default EnergyConservationWorkAngle;
