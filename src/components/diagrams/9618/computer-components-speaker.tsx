/**
 * Cross-section of a loudspeaker. A varying electric current from the amplifier flows through
 * a coil wound around the pole of a permanent magnet. The coil is fixed to the narrow end of a
 * cone (diaphragm). The changing current makes the coil an electromagnet that is pushed and
 * pulled by the permanent magnet, so the coil and cone vibrate back and forth and send sound
 * waves (drawn as arcs) into the air. A microphone uses the same parts in reverse.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-speaker';

const W = 620;
const H = 320;
const CY = 170;

const rad = (d: number) => (d * Math.PI) / 180;

function wave(r: number) {
  const cx = 240;
  const a = rad(-32);
  const b = rad(32);
  return `M${(cx + r * Math.cos(a)).toFixed(1)},${(CY + r * Math.sin(a)).toFixed(1)} A${r},${r} 0 0 1 ${(cx + r * Math.cos(b)).toFixed(1)},${(CY + r * Math.sin(b)).toFixed(1)}`;
}

export function ComputerComponentsSpeaker() {
  const coilXs = [150, 158, 166, 174];
  return (
    <Svg width={W} height={H}>
      {/* permanent magnet with central pole */}
      <rect x={70} y={120} width={70} height={100} rx={4} className="dg-fill-muted dg-line" />
      <rect x={140} y={152} width={42} height={36} className="dg-fill-muted dg-line" />
      <Label x={105} y={240} className="dg-text-small">
        permanent magnet
      </Label>

      {/* coil around the pole */}
      {coilXs.map((x) => (
        <ellipse key={x} cx={x} cy={CY} rx={4} ry={26} className="dg-accent" />
      ))}
      <Label x={162} y={100} className="dg-text-small dg-text-accent">
        coil
      </Label>
      <line x1={162} y1={108} x2={162} y2={142} className="dg-accent" />

      {/* wires to the amplifier */}
      <path d="M150,196 L150,280 L30,280" className="dg-thin" />
      <path d="M174,196 L174,292 L30,292" className="dg-thin" />
      <Label x={30} y={306} anchor="start" className="dg-text-small">
        varying current from the amplifier
      </Label>

      {/* cone */}
      <path d={`M182,148 L320,58 L320,282 L182,192 Z`} className="dg-fill-accent-2 dg-accent-2" />
      <path d="M320,58 Q332,52 334,62 L334,278 Q332,288 320,282" className="dg-thin" />
      <Label x={262} y={40} className="dg-text-small">
        cone (diaphragm)
      </Label>
      <Arrow x1={230} y1={CY} x2={290} y2={CY} double head={8} className="dg-line" />
      <Label x={262} y={CY + 18} className="dg-text-small dg-bold">
        vibrates
      </Label>

      {/* sound waves */}
      {[130, 165, 200, 235].map((r) => (
        <path key={r} d={wave(r)} className="dg-muted" />
      ))}
      <Label x={490} y={CY} anchor="start" className="dg-text-small">
        sound
      </Label>
      <Label x={490} y={CY + 16} anchor="start" className="dg-text-small">
        waves
      </Label>
    </Svg>
  );
}

export default ComputerComponentsSpeaker;
