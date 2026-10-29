/**
 * Work done by a force that acts along the motion. Left: a crate pushed 6.0 m
 * by a 45 N horizontal force, with W = Fs = 270 J underneath. Right: a person
 * pressing on a wall that does not move, so s = 0 and W = 0 J.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-energy-conservation-work-done';

const W = 640;
const H = 300;

export function EnergyConservationWorkDone() {
  return (
    <Svg width={W} height={H}>
      <Label x={200} y={26} className="dg-text dg-bold">
        Pushing a crate
      </Label>
      <line x1={40} y1={210} x2={360} y2={210} className="dg-thin" />
      <rect x={60} y={160} width={80} height={50} className="dg-fill-accent dg-accent" />
      <Label x={100} y={185} className="dg-text-small">
        crate
      </Label>
      <Arrow x1={24} y1={185} x2={56} y2={185} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={10} y={148} anchor="start" className="dg-text-small dg-text-accent-2">
        F = 45 N
      </Label>
      {/* distance moved */}
      <line x1={140} y1={140} x2={140} y2={210} className="dg-muted dg-dashed" />
      <line x1={330} y1={140} x2={330} y2={210} className="dg-muted dg-dashed" />
      <Arrow x1={140} y1={132} x2={330} y2={132} double className="dg-line" head={8} />
      <Label x={235} y={114} className="dg-text">
        s = 6.0 m
      </Label>
      <MathLabel
        x={200}
        y={258}
        w={380}
        h={34}
        tex={String.raw`W = Fs = 45\ \text{N} \times 6.0\ \text{m} = 270\ \text{J}`}
      />
      {/* right panel */}
      <line x1={380} y1={40} x2={380} y2={240} className="dg-grid" />
      <Label x={512} y={26} className="dg-text dg-bold">
        Pushing a wall
      </Label>
      <rect x={556} y={70} width={44} height={140} className="dg-fill-muted dg-line" />
      <Label x={578} y={228} className="dg-text-small">
        wall
      </Label>
      <Arrow x1={440} y1={150} x2={552} y2={150} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={494} y={130} className="dg-text-small dg-text-accent-2">
        push
      </Label>
      <Label x={494} y={182} className="dg-text-small dg-text-muted">
        the wall does not move
      </Label>
      <Label x={494} y={202} className="dg-text-small dg-text-muted">
        so s = 0
      </Label>
      <MathLabel x={510} y={258} w={180} h={34} tex={String.raw`W = 0\ \text{J}`} />
    </Svg>
  );
}

export default EnergyConservationWorkDone;
