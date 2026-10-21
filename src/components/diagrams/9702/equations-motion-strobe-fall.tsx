/**
 * A stroboscopic picture of a ball falling from rest with no air resistance,
 * drawn to scale next to a vertical rule (2.2 px per cm). Flash interval
 * 0.10 s; positions s = ½gt² with g = 9.81 m s⁻²:
 *   t / s : 0     0.10  0.20  0.30  0.40  0.50
 *   s / cm: 0     4.9   19.6  44.1  78.5  122.6
 * The gaps between images (4.9, 14.7, 24.5, 34.3, 44.1 cm) grow in the ratio
 * 1 : 3 : 5 : 7 : 9 because the ball speeds up at a constant rate.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-equations-motion-strobe-fall';

const W = 560;
const H = 340;
const G = 9.81;
const TOP = 28; // y of the 0 cm mark
const PX = 2.2; // px per cm
const RULE_X = 96;
const BALL_X = 140;
const times = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
const pos = times.map((t) => 0.5 * G * t * t * 100); // cm
const y = (cm: number) => TOP + cm * PX;

export function EquationsMotionStrobeFall() {
  return (
    <Svg width={W} height={H}>
      {/* vertical rule, 0 to 130 cm */}
      <rect x={RULE_X - 18} y={y(0) - 6} width={18} height={130 * PX + 12} className="dg-fill-muted" />
      <line x1={RULE_X} y1={y(0)} x2={RULE_X} y2={y(130)} className="dg-thin" />
      {Array.from({ length: 14 }, (_, i) => i * 10).map((cm) => (
        <g key={cm}>
          <line x1={RULE_X - (cm % 20 === 0 ? 12 : 7)} y1={y(cm)} x2={RULE_X} y2={y(cm)} className="dg-thin" />
          {cm % 20 === 0 && (
            <Label x={RULE_X - 24} y={y(cm)} anchor="end" className="dg-text-small">
              {cm}
            </Label>
          )}
        </g>
      ))}
      <Label x={RULE_X - 24} y={y(130) + 4} anchor="end" className="dg-text-small dg-italic">
        s / cm
      </Label>

      {/* the ball at each flash */}
      {pos.map((cm, i) => (
        <g key={i}>
          <line x1={RULE_X} y1={y(cm)} x2={BALL_X - 8} y2={y(cm)} className="dg-grid" />
          <circle cx={BALL_X} cy={y(cm)} r={7} className="dg-fill-accent dg-accent" />
          <Label x={BALL_X + 16} y={y(cm)} anchor="start" className="dg-text-small">
            {`t = ${times[i]!.toFixed(2)} s`}
          </Label>
        </g>
      ))}

      {/* the gaps */}
      {pos.slice(1).map((cm, i) => {
        const prev = pos[i]!;
        const gap = cm - prev;
        const x = 262;
        return (
          <g key={i}>
            {gap * PX > 22 ? (
              <Arrow x1={x} y1={y(prev) + 2} x2={x} y2={y(cm) - 2} className="dg-accent-2" headClassName="dg-dot-accent-2" head={7} double />
            ) : (
              <line x1={x} y1={y(prev)} x2={x} y2={y(cm)} className="dg-accent-2" />
            )}
            <Label x={x + 10} y={(y(prev) + y(cm)) / 2 + (i === 0 ? 4 : 0)} anchor="start" className="dg-text-small dg-text-accent-2">
              {`${gap.toFixed(1)} cm`}
            </Label>
          </g>
        );
      })}

      {/* notes */}
      <rect x={366} y={96} width={184} height={150} rx={10} className="dg-fill-muted" />
      <Label x={378} y={120} anchor="start" className="dg-text-small dg-bold">
        Flashes every 0.10 s
      </Label>
      <Label x={378} y={146} anchor="start" className="dg-text-small">
        s = ½gt², from rest
      </Label>
      <Label x={378} y={172} anchor="start" className="dg-text-small">
        gaps grow in the ratio
      </Label>
      <Label x={378} y={192} anchor="start" className="dg-text dg-bold">
        1 : 3 : 5 : 7 : 9
      </Label>
      <Label x={378} y={222} anchor="start" className="dg-text-small dg-text-muted">
        each gap 9.8 cm longer
      </Label>
    </Svg>
  );
}

export default EquationsMotionStrobeFall;
