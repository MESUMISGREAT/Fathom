/**
 * A steel ball falling through oil in a tall tube, at terminal velocity.
 * Three forces act on the ball: weight W (down), viscous drag D (up) and
 * upthrust U (up). At terminal velocity the resultant is zero, so
 * W = D + U; arrows drawn to scale with U : D : W = 1 : 3 : 4.
 * Rubber bands around the tube mark equal distances; at terminal velocity the
 * ball takes equal times to pass between them.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-non-uniform-ball-in-oil';

const W = 600;
const H = 340;

export function NonUniformBallInOil() {
  const tx = 170;
  const tw = 120;
  const top = 34;
  const bottom = 320;
  const cx = tx + tw / 2;
  const cy = 196;
  const r = 9;
  const unit = 20; // px per unit force; W = 4, D = 3, U = 1
  const bands = [110, 160, 210, 260];
  return (
    <Svg width={W} height={H}>
      {/* oil */}
      <rect x={tx} y={top + 14} width={tw} height={bottom - top - 14} className="dg-fill-muted" />
      <line x1={tx} y1={top + 14} x2={tx + tw} y2={top + 14} className="dg-thin" />
      {/* tube */}
      <path d={`M${tx},${top} L${tx},${bottom} L${tx + tw},${bottom} L${tx + tw},${top}`} className="dg-line" />
      {bands.map((y) => (
        <line key={y} x1={tx - 8} y1={y} x2={tx + tw + 8} y2={y} className="dg-accent-2" />
      ))}
      {/* ball and forces */}
      <circle cx={cx} cy={cy} r={r} className="dg-dot" />
      <Arrow x1={cx - 12} y1={cy - r} x2={cx - 12} y2={cy - r - 3 * unit} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={cx - 22} y={cy - r - 2.25 * unit} anchor="end" className="dg-text-accent">
        D
      </Label>
      <Arrow x1={cx + 12} y1={cy - r} x2={cx + 12} y2={cy - r - unit} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={cx + 22} y={cy - r - 0.6 * unit} anchor="start" className="dg-text-accent">
        U
      </Label>
      <Arrow x1={cx} y1={cy + r} x2={cx} y2={cy + r + 4 * unit} />
      <Label x={cx + 10} y={cy + r + 2 * unit} anchor="start" className="dg-text dg-bold">
        W
      </Label>

      {/* left notes */}
      <Label x={tx - 16} y={top + 30} anchor="end" className="dg-text-small">
        oil (a viscous liquid)
      </Label>
      <Label x={tx - 16} y={90} anchor="end" className="dg-text-small">
        ball speeds up first,
      </Label>
      <Label x={tx - 16} y={105} anchor="end" className="dg-text-small">
        then reaches terminal
      </Label>
      <Label x={tx - 16} y={120} anchor="end" className="dg-text-small">
        velocity quickly
      </Label>
      <Label x={tx - 16} y={236} anchor="end" className="dg-text-small dg-text-accent-2">
        bands an equal
      </Label>
      <Label x={tx - 16} y={253} anchor="end" className="dg-text-small dg-text-accent-2">
        distance apart
      </Label>

      {/* right notes */}
      <Label x={tx + tw + 24} y={70} anchor="start" className="dg-text dg-bold">
        At terminal velocity
      </Label>
      <Label x={tx + tw + 24} y={96} anchor="start" className="dg-text-small">
        W = weight (down)
      </Label>
      <Label x={tx + tw + 24} y={114} anchor="start" className="dg-text-small">
        D = viscous drag (up)
      </Label>
      <Label x={tx + tw + 24} y={132} anchor="start" className="dg-text-small">
        U = upthrust (up)
      </Label>
      <Label x={tx + tw + 24} y={164} anchor="start" className="dg-text-accent">
        W = D + U
      </Label>
      <Label x={tx + tw + 24} y={188} anchor="start" className="dg-text-small">
        resultant force = 0, a = 0
      </Label>
      <Label x={tx + tw + 24} y={236} anchor="start" className="dg-text-small">
        equal times between bands
      </Label>
      <Label x={tx + tw + 24} y={253} anchor="start" className="dg-text-small">
        show the speed is constant
      </Label>
    </Svg>
  );
}

export default NonUniformBallInOil;
