/**
 * A pulse travelling along a rope. The solid curve is the rope now; the dashed curve is where the
 * pulse will be a moment later. A marked point P only moves up and down about equilibrium.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-progressive-waves-rope-pulse';

const W = 560;
const H = 360;
const LEFT = 40;
const RIGHT = 520;
const EQ = 220;
const PULSE_X = 330;
const GHOST_X = 410;
const HEIGHT = 74;

const pulse = (x: number, centre: number) =>
  EQ - HEIGHT * Math.exp(-(((x - centre) / 48) ** 2));

function pulsePath(centre: number) {
  const pts: string[] = [];
  for (let x = LEFT; x <= RIGHT; x += 2) {
    pts.push(`${x},${pulse(x, centre).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

export function ProgressiveWavesRopePulse() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        A pulse travels; the rope only moves up and down
      </Label>

      {/* rope at equilibrium */}
      <line x1={LEFT} y1={EQ} x2={RIGHT} y2={EQ} className="dg-muted" />

      {/* ghost pulse, later */}
      <path d={pulsePath(GHOST_X)} className="dg-accent-2 dg-dashed" strokeWidth={2} />

      {/* pulse now */}
      <path d={pulsePath(PULSE_X)} className="dg-accent" strokeWidth={2.5} />

      {/* direction of travel */}
      <Arrow x1={PULSE_X + 20} y1={80} x2={GHOST_X + 20} y2={80} />
      <Label x={(PULSE_X + GHOST_X) / 2 + 20} y={64} className="dg-text-small dg-text-muted">
        pulse moves
      </Label>

      {/* marked point P */}
      <circle cx={190} cy={EQ} r={4.5} className="dg-dot-accent" />
      <Label x={176} y={EQ + 18} anchor="end" className="dg-text-small dg-text-accent">
        P
      </Label>
      <Arrow x1={190} y1={EQ - 8} x2={190} y2={EQ - 62} double className="dg-thin" headClassName="dg-dot" />
      <Arrow x1={190} y1={EQ + 8} x2={190} y2={EQ + 62} double className="dg-thin" headClassName="dg-dot" />
      <MathLabel
        x={W / 2}
        y={320}
        tex="\text{energy travels along the rope, not the rope itself}"
        w={470}
        h={28}
        size="small"
        tone="muted"
      />
    </Svg>
  );
}

export default ProgressiveWavesRopePulse;
