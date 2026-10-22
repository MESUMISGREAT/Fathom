/**
 * Distance versus displacement for half a lap of a circular track, drawn to
 * scale. The runner goes over the top of the circle from "start" (left) to
 * "finish" (right): the distance is the length of the curved path, half the
 * circumference (πr); the displacement is the straight arrow from start to
 * finish, the diameter (2r). A side panel gives the numbers for a 400 m track.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-equations-motion-half-lap';

const W = 600;
const H = 290;
const C = { x: 180, y: 160 };
const R = 112;

/** Point on the circle at angle deg (maths convention, y up). */
const at = (deg: number, r = R) => ({
  x: C.x + r * Math.cos((deg * Math.PI) / 180),
  y: C.y - r * Math.sin((deg * Math.PI) / 180),
});

export function EquationsMotionHalfLap() {
  const start = at(180);
  const finish = at(0);
  // Arrowhead on the arc just before the finish, pointing along the tangent (clockwise, so downwards).
  const a1 = at(14);
  const a2 = at(4);
  const mid = at(90, R + 20);
  return (
    <Svg width={W} height={H}>
      {/* the rest of the track, not run */}
      <path
        d={`M${start.x},${start.y} A${R},${R} 0 0 0 ${finish.x},${finish.y}`}
        className="dg-muted dg-dashed"
      />
      {/* the half lap that was run: over the top, start to finish */}
      <path d={`M${start.x},${start.y} A${R},${R} 0 0 1 ${a2.x},${a2.y}`} className="dg-accent" />
      <Arrow x1={a1.x} y1={a1.y} x2={finish.x + 0.5} y2={finish.y - 4} className="dg-accent" headClassName="dg-dot-accent" head={12} />
      {/* displacement: straight from start to finish */}
      <Arrow x1={start.x} y1={start.y} x2={finish.x} y2={finish.y} className="dg-accent-2" headClassName="dg-dot-accent-2" head={12} />
      <circle cx={start.x} cy={start.y} r={5} className="dg-dot" />
      <circle cx={finish.x} cy={finish.y} r={5} className="dg-dot" />
      <circle cx={C.x} cy={C.y} r={2.5} className="dg-dot" />
      <Label x={start.x - 10} y={start.y} anchor="end" className="dg-text dg-bold">
        start
      </Label>
      <Label x={finish.x + 12} y={finish.y} anchor="start" className="dg-text dg-bold">
        finish
      </Label>
      <Label x={mid.x} y={mid.y - 8} className="dg-text-accent">
        distance = πr (the curved path)
      </Label>
      <Label x={C.x} y={C.y + 20} className="dg-text-accent-2">
        displacement = 2r
      </Label>
      <Label x={C.x} y={C.y + 38} className="dg-text-small">
        straight from start to finish
      </Label>
      <Label x={C.x} y={C.y + 64} className="dg-text-small dg-text-muted">
        rest of the track (not run)
      </Label>

      {/* numbers for a 400 m track */}
      <g>
        <rect x={392} y={70} width={196} height={170} rx={10} className="dg-fill-muted" />
        <Label x={490} y={92} className="dg-text dg-bold">
          400 m track, r = 63.7 m
        </Label>
        <Label x={406} y={122} anchor="start" className="dg-text-small dg-bold">
          Half a lap
        </Label>
        <Label x={406} y={142} anchor="start" className="dg-text-small">
          distance = 200 m
        </Label>
        <Label x={406} y={160} anchor="start" className="dg-text-small">
          displacement = 127 m
        </Label>
        <Label x={406} y={190} anchor="start" className="dg-text-small dg-bold">
          A full lap
        </Label>
        <Label x={406} y={210} anchor="start" className="dg-text-small">
          distance = 400 m
        </Label>
        <Label x={406} y={228} anchor="start" className="dg-text-small">
          displacement = 0
        </Label>
      </g>
    </Svg>
  );
}

export default EquationsMotionHalfLap;
