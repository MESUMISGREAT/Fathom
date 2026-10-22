/**
 * A ball thrown vertically upwards at 8.0 m s⁻¹ from the top of a 25 m cliff,
 * falling past the cliff into the sea. Upwards positive, g = 9.81 m s⁻², no
 * air resistance. Vertical positions are to scale (10 px per m):
 *   s = 8.0t − 4.905t²
 *   top: t = 0.815 s, s = +3.26 m;  back at s = 0: t = 1.63 s, v = −8.0 m s⁻¹
 *   sea: s = −25 m at t = 3.22 s, v = −23.5 m s⁻¹
 * The up and down parts of the (vertical) motion are drawn side by side so
 * they don't overlap. Dots mark the ball every 0.4 s.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-equations-motion-cliff-throw';

const W = 560;
const H = 380;
const G = 9.81;
const U = 8.0;
const Y0 = 84; // screen y of s = 0 (the cliff top)
const PX = 10; // px per metre
const sy = (s: number) => Y0 - s * PX;
const sAt = (t: number) => U * t - 0.5 * G * t * t;
const T_TOP = U / G;
const S_TOP = (U * U) / (2 * G);
const T_SEA = (U + Math.sqrt(U * U + 2 * G * 25)) / G;
const X_UP = 196;
const X_DOWN = 216;
const ARC_R = (X_DOWN - X_UP) / 2;
const CLIFF_EDGE = 172;
const SEA_Y = sy(-25);

export function EquationsMotionCliffThrow() {
  const dots = [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2];
  const wave = `M${CLIFF_EDGE},${SEA_Y}` + ' q6,-5 12,0 q6,5 12,0'.repeat(15);
  return (
    <Svg width={W} height={H}>
      {/* cliff */}
      <path d={`M20,${Y0} L${CLIFF_EDGE},${Y0} L${CLIFF_EDGE},${SEA_Y + 22} L20,${SEA_Y + 22} Z`} className="dg-fill-muted" />
      <path d={`M20,${Y0} L${CLIFF_EDGE},${Y0} L${CLIFF_EDGE},${SEA_Y}`} className="dg-thin" />
      {/* sea */}
      <path d={wave} className="dg-accent-2" fill="none" />
      <Label x={W - 50} y={SEA_Y + 18} className="dg-text-small dg-text-muted">
        sea
      </Label>

      {/* launch level */}
      <line x1={CLIFF_EDGE} y1={Y0} x2={W - 16} y2={Y0} className="dg-muted dg-dashed" />
      <Label x={W - 16} y={Y0 - 10} anchor="end" className="dg-text-small dg-text-muted">
        s = 0
      </Label>

      {/* 25 m dimension on the cliff */}
      <Arrow x1={150} y1={Y0 + 2} x2={150} y2={SEA_Y - 2} className="dg-thin" head={7} double />
      <Label x={142} y={(Y0 + SEA_Y) / 2} anchor="end" className="dg-text-small">
        25 m
      </Label>

      {/* sign convention */}
      <Arrow x1={44} y1={Y0 + 120} x2={44} y2={Y0 + 70} className="dg-line" head={8} />
      <Label x={56} y={Y0 + 82} anchor="start" className="dg-text-small dg-bold">
        + up
      </Label>
      <Label x={30} y={Y0 + 148} anchor="start" className="dg-text-small">
        a = −9.81 m s⁻²
      </Label>
      <Label x={30} y={Y0 + 164} anchor="start" className="dg-text-small">
        the whole time
      </Label>

      {/* the path: up, over the top, down */}
      <line x1={X_UP} y1={sy(0)} x2={X_UP} y2={sy(S_TOP) + ARC_R} className="dg-accent" />
      <path
        d={`M${X_UP},${sy(S_TOP) + ARC_R} A${ARC_R},${ARC_R} 0 0 1 ${X_DOWN},${sy(S_TOP) + ARC_R}`}
        className="dg-accent"
        fill="none"
      />
      <line x1={X_DOWN} y1={sy(S_TOP) + ARC_R} x2={X_DOWN} y2={SEA_Y} className="dg-accent" />
      {/* launch velocity */}
      <Arrow x1={X_UP - 12} y1={sy(0) - 2} x2={X_UP - 12} y2={sy(0) - 34} className="dg-accent" headClassName="dg-dot-accent" head={7} />
      <Label x={X_UP - 20} y={sy(0) - 22} anchor="end" className="dg-text-small dg-text-accent">
        u = +8.0 m s⁻¹
      </Label>

      {/* the ball every 0.4 s */}
      {dots.map((t) => {
        const s = sAt(t);
        const goingUp = t < T_TOP - 0.05;
        const atTop = Math.abs(t - T_TOP) <= 0.05;
        const cx = atTop ? (X_UP + X_DOWN) / 2 : goingUp ? X_UP : X_DOWN;
        const cy = atTop ? sy(S_TOP) : sy(s);
        return <circle key={t} cx={cx} cy={cy} r={4.5} className="dg-dot-accent" />;
      })}

      {/* key moments */}
      <line x1={X_DOWN + 10} y1={sy(S_TOP)} x2={248} y2={sy(S_TOP)} className="dg-muted" />
      <Label x={254} y={sy(S_TOP)} anchor="start" className="dg-text-small">
        <tspan className="dg-bold">top:</tspan> v = 0, s = +3.26 m (t = 0.82 s)
      </Label>
      <line x1={X_DOWN - 5} y1={sy(0)} x2={X_DOWN + 5} y2={sy(0)} className="dg-line" />
      <line x1={X_DOWN + 6} y1={sy(0)} x2={248} y2={sy(0) + 18} className="dg-muted" />
      <Label x={254} y={sy(0) + 20} anchor="start" className="dg-text-small">
        <tspan className="dg-bold">passes the cliff top</tspan> (t = 1.63 s):
      </Label>
      <Label x={254} y={sy(0) + 36} anchor="start" className="dg-text-small">
        v = −8.0 m s⁻¹, same speed as the throw
      </Label>
      <line x1={X_DOWN + 6} y1={SEA_Y - 4} x2={248} y2={SEA_Y - 30} className="dg-muted" />
      <Label x={254} y={SEA_Y - 44} anchor="start" className="dg-text-small">
        <tspan className="dg-bold">hits the sea:</tspan> s = −25 m
      </Label>
      <Label x={254} y={SEA_Y - 28} anchor="start" className="dg-text-small">
        v = −23.5 m s⁻¹ (t = {T_SEA.toFixed(2)} s)
      </Label>
      <Label x={254} y={sy(-10)} anchor="start" className="dg-text-small dg-text-muted">
        dots every 0.4 s: wider gaps,
      </Label>
      <Label x={254} y={sy(-10) + 16} anchor="start" className="dg-text-small dg-text-muted">
        the ball is speeding up
      </Label>
    </Svg>
  );
}

export default EquationsMotionCliffThrow;
