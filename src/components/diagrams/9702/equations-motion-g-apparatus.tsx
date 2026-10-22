/**
 * Apparatus for measuring g with a falling object (not to scale): a steel ball
 * held by an electromagnet on a clamp stand falls from rest through a measured
 * height h onto a trapdoor switch. One switch cuts the electromagnet's current
 * and starts an electronic timer; the ball opening the trapdoor stops it.
 * h is measured with a metre rule from the bottom of the ball to the trapdoor.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-equations-motion-g-apparatus';

const W = 600;
const H = 410;
const BENCH = 376;
const BALL_X = 234;
const BALL_R = 9;
const BALL_Y = 110; // centre
const DOOR_Y = 336; // top of the trapdoor
const RULE_X = 300;

export function EquationsMotionGApparatus() {
  const ballBottom = BALL_Y + BALL_R;
  const ruleTicks = Array.from({ length: 23 }, (_, i) => i);
  return (
    <Svg width={W} height={H}>
      {/* bench */}
      <line x1={24} y1={BENCH} x2={W - 24} y2={BENCH} className="dg-line" />

      {/* clamp stand */}
      <rect x={52} y={BENCH - 12} width={100} height={12} className="dg-fill-muted dg-thin" />
      <rect x={95} y={36} width={7} height={BENCH - 48} className="dg-fill-muted dg-thin" />
      <rect x={90} y={48} width={17} height={17} className="dg-fill-muted dg-thin" />
      <rect x={107} y={52} width={120} height={8} className="dg-fill-muted dg-thin" />

      {/* electromagnet */}
      <rect x={225} y={52} width={18} height={BALL_Y - BALL_R - 52} className="dg-fill-muted dg-thin" />
      {[66, 74, 82, 90].map((yy) => (
        <path key={yy} d={`M221,${yy} L247,${yy + 5}`} className="dg-accent-2" />
      ))}
      <Label x={214} y={80} anchor="end" className="dg-text-small">
        electromagnet
      </Label>

      {/* ball and its fall */}
      <circle cx={BALL_X} cy={BALL_Y} r={BALL_R} className="dg-fill-accent dg-accent" />
      <Label x={214} y={BALL_Y + 4} anchor="end" className="dg-text-small">
        steel ball
      </Label>
      <line x1={BALL_X} y1={ballBottom + 6} x2={BALL_X} y2={DOOR_Y - 8} className="dg-muted dg-dashed" />
      <Arrow x1={BALL_X - 22} y1={180} x2={BALL_X - 22} y2={232} className="dg-muted" headClassName="dg-dot" head={7} />
      <Label x={BALL_X - 30} y={196} anchor="end" className="dg-text-small dg-text-muted">
        falls
      </Label>
      <Label x={BALL_X - 30} y={212} anchor="end" className="dg-text-small dg-text-muted">
        from rest
      </Label>

      {/* trapdoor switch */}
      <rect x={200} y={DOOR_Y + 6} width={70} height={BENCH - DOOR_Y - 6} className="dg-fill-muted dg-thin" />
      <line x1={208} y1={DOOR_Y} x2={262} y2={DOOR_Y} className="dg-line" />
      <circle cx={208} cy={DOOR_Y} r={3} className="dg-dot" />
      <Label x={235} y={BENCH + 18} className="dg-text-small">
        trapdoor switch
      </Label>

      {/* h, measured with a metre rule */}
      <line x1={BALL_X + BALL_R + 2} y1={ballBottom} x2={RULE_X} y2={ballBottom} className="dg-muted dg-dashed" />
      <line x1={264} y1={DOOR_Y} x2={RULE_X} y2={DOOR_Y} className="dg-muted dg-dashed" />
      <Arrow x1={278} y1={ballBottom + 1} x2={278} y2={DOOR_Y - 1} className="dg-line" head={8} double />
      <Label x={270} y={(ballBottom + DOOR_Y) / 2} anchor="end" className="dg-text dg-italic dg-bold">
        h
      </Label>
      <rect x={RULE_X} y={ballBottom - 8} width={16} height={DOOR_Y - ballBottom + 16} className="dg-fill-muted dg-thin" />
      {ruleTicks.map((i) => {
        const yy = ballBottom - 2 + i * 10;
        if (yy > DOOR_Y + 6) return null;
        return <line key={i} x1={RULE_X} y1={yy} x2={RULE_X + (i % 5 === 0 ? 10 : 5)} y2={yy} className="dg-thin" />;
      })}
      <Label x={RULE_X + 24} y={ballBottom + 40} anchor="start" className="dg-text-small">
        metre rule
      </Label>

      {/* electronic timer */}
      <rect x={420} y={170} width={150} height={84} rx={8} className="dg-fill-muted dg-line" />
      <rect x={436} y={186} width={118} height={34} rx={4} className="dg-fill-surface dg-thin" />
      <Label x={495} y={204} className="dg-text dg-mono dg-bold">
        0.452 s
      </Label>
      <Label x={495} y={238} className="dg-text-small">
        electronic timer
      </Label>
      <circle cx={444} cy={170} r={3.5} className="dg-dot" />
      <Label x={444} y={158} className="dg-text-small dg-text-muted">
        start
      </Label>
      <circle cx={546} cy={254} r={3.5} className="dg-dot" />
      <Label x={546} y={270} anchor="middle" className="dg-text-small dg-text-muted">
        stop
      </Label>

      {/* wire: electromagnet -> switch -> timer start */}
      <path d={`M243,58 L243,40 L346,40`} className="dg-thin" />
      <circle cx={350} cy={40} r={3} className="dg-dot" />
      <line x1={351} y1={39} x2={374} y2={26} className="dg-line" />
      <circle cx={378} cy={40} r={3} className="dg-dot" />
      <path d={`M382,40 L444,40 L444,166`} className="dg-thin" />
      <Label x={364} y={62} className="dg-text-small">
        switch
      </Label>
      <Label x={452} y={80} anchor="start" className="dg-text-small">
        one switch cuts the
      </Label>
      <Label x={452} y={96} anchor="start" className="dg-text-small">
        magnet’s current and
      </Label>
      <Label x={452} y={112} anchor="start" className="dg-text-small">
        starts the timer
      </Label>

      {/* wire: trapdoor -> timer stop */}
      <path d={`M270,360 L546,360 L546,258`} className="dg-thin" />
      <Label x={440} y={346} className="dg-text-small">
        ball opens trapdoor: timer stops
      </Label>
    </Svg>
  );
}

export default EquationsMotionGApparatus;
