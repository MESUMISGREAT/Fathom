/**
 * Two kinds of touchscreen in cross-section. Left, resistive: a finger presses the flexible top
 * layer down across the air gap (held open by spacer dots) until its conductive coating touches
 * the coating on the glass layer below, completing a circuit; the voltages give the x and y
 * position. Right, capacitive: glass over a transparent conductive layer that holds an
 * electrostatic field; a bare finger (a conductor) draws a little charge and changes the
 * capacitance at that point, and the controller works out the position from the change.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-touchscreens';

const W = 620;
const H = 290;

function Finger({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 16},${y - 70} L${x - 16},${y - 16} Q${x - 16},${y} ${x},${y} Q${x + 16},${y} ${x + 16},${y - 16} L${x + 16},${y - 70}`} className="dg-fill-muted dg-line" />;
}

export function ComputerComponentsTouchscreens() {
  const rx = 155;
  const cx = 465;
  return (
    <Svg width={W} height={H}>
      {/* resistive */}
      <Label x={rx} y={18} className="dg-text dg-bold">
        resistive
      </Label>
      <Finger x={rx} y={120} />
      <path d={`M28,96 L${rx - 40},96 Q${rx - 18},96 ${rx - 10},121 L${rx + 10},121 Q${rx + 18},96 ${rx + 40},96 L282,96`} className="dg-line" />
      <path d={`M28,101 L${rx - 41},101 Q${rx - 22},101 ${rx - 14},124 L${rx + 14},124 Q${rx + 22},101 ${rx + 41},101 L282,101`} className="dg-accent" />
      {[48, 76, 234, 262].map((x) => (
        <circle key={x} cx={x} cy={115} r={4} className="dg-dot" />
      ))}
      <line x1={28} y1={127} x2={282} y2={127} className="dg-accent" />
      <rect x={28} y={129} width={254} height={20} className="dg-fill-muted dg-thin" />
      <circle cx={rx} cy={126} r={5} className="dg-dot-accent-2" />
      <Label x={28} y={80} anchor="start" className="dg-text-small">
        flexible top layer
      </Label>
      <Label x={282} y={80} anchor="end" className="dg-text-small">
        air gap, spacers
      </Label>
      <Label x={rx} y={164} className="dg-text-small dg-text-muted">
        glass with conductive coating
      </Label>
      <Label x={rx} y={198} className="dg-text-small dg-bold">
        press: the two layers touch,
      </Label>
      <Label x={rx} y={214} className="dg-text-small">
        completing a circuit; voltages
      </Label>
      <Label x={rx} y={230} className="dg-text-small">
        give the x and y position
      </Label>
      <Label x={rx} y={264} className="dg-text-small dg-text-accent">
        works with gloves or any stylus
      </Label>

      <line x1={310} y1={10} x2={310} y2={280} className="dg-grid" />

      {/* capacitive */}
      <Label x={cx} y={18} className="dg-text dg-bold">
        capacitive
      </Label>
      <Finger x={cx} y={96} />
      {[-30, -15, 15, 30].map((d) => (
        <path key={d} d={`M${cx + d * 0.4},${96} Q${cx + d * 1.3},${108} ${cx + d * 1.6},${123}`} className="dg-accent-2 dg-dashed" />
      ))}
      <rect x={338} y={97} width={254} height={20} className="dg-fill-muted dg-thin" />
      <rect x={338} y={117} width={254} height={8} className="dg-fill-accent dg-accent" />
      {Array.from({ length: 11 }, (_, i) => 344 + i * 24).map((x) => (
        <rect key={x} x={x} y={127} width={14} height={6} className="dg-dot-accent" />
      ))}
      <Label x={338} y={80} anchor="start" className="dg-text-small">
        glass
      </Label>
      <Label x={cx} y={150} className="dg-text-small dg-text-muted">
        transparent conductor, electrode grid
      </Label>
      <Label x={cx} y={198} className="dg-text-small dg-bold">
        touch: finger draws a tiny charge,
      </Label>
      <Label x={cx} y={214} className="dg-text-small">
        capacitance changes at that point;
      </Label>
      <Label x={cx} y={230} className="dg-text-small">
        controller calculates x and y
      </Label>
      <Label x={cx} y={264} className="dg-text-small dg-text-accent">
        needs a bare finger or special stylus
      </Label>
    </Svg>
  );
}

export default ComputerComponentsTouchscreens;
