/**
 * CSMA/CD as a flowchart. Frame ready to send -> decision "Listen: is the
 * channel idle?" If no, wait and keep listening, then ask again. If yes,
 * transmit the frame while still listening -> decision "Collision detected?"
 * If no, the frame has been sent. If yes, stop transmitting and send a jam
 * signal, then wait a random time (back-off) and return to listening.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-csma-cd';

const W = 620;
const H = 430;
const X = 270;
const DW = 120;
const DH = 36;

function Box({ x, y, w, lines, kind = 'plain' }: { x: number; y: number; w: number; lines: string[]; kind?: 'plain' | 'good' | 'bad' }) {
  const h = lines.length > 1 ? 44 : 36;
  const cls = kind === 'good' ? 'dg-fill-accent dg-accent' : kind === 'bad' ? 'dg-fill-accent-2 dg-accent-2' : 'dg-fill-muted dg-thin';
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={8} className="dg-fill-surface" />
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={8} className={cls} />
      {lines.map((l, i) => (
        <Label key={i} x={x} y={y + (i - (lines.length - 1) / 2) * 17} className="dg-text-small">
          {l}
        </Label>
      ))}
    </g>
  );
}

function Diamond({ y, lines }: { y: number; lines: string[] }) {
  const d = `M${X},${y - DH} L${X + DW},${y} L${X},${y + DH} L${X - DW},${y} Z`;
  return (
    <g>
      <path d={d} className="dg-fill-surface" />
      <path d={d} className="dg-fill-muted dg-line" />
      {lines.map((l, i) => (
        <Label key={i} x={X} y={y + (i - (lines.length - 1) / 2) * 17} className="dg-text-small dg-bold">
          {l}
        </Label>
      ))}
    </g>
  );
}

export function NetworksCsmaCd() {
  const yStart = 34;
  const yD1 = 120;
  const yTx = 212;
  const yD2 = 300;
  const yJam = 386;
  const RX = 500;
  return (
    <Svg width={W} height={H}>
      {/* main column */}
      <Arrow x1={X} y1={yStart + 18} x2={X} y2={yD1 - DH} head={8} />
      <Arrow x1={X} y1={yD1 + DH} x2={X} y2={yTx - 22} head={8} />
      <Arrow x1={X} y1={yTx + 22} x2={X} y2={yD2 - DH} head={8} />
      <Arrow x1={X} y1={yD2 + DH} x2={X} y2={yJam - 22} head={8} />
      <Label x={X + 10} y={(yD1 + DH + yTx - 22) / 2} anchor="start" className="dg-text-small dg-bold">
        yes
      </Label>
      <Label x={X + 10} y={(yD2 + DH + yJam - 22) / 2} anchor="start" className="dg-text-small dg-bold">
        yes
      </Label>

      {/* idle? no -> wait, then listen again */}
      <Arrow x1={X - DW} y1={yD1} x2={120} y2={yD1} head={8} />
      <Label x={135} y={yD1 - 12} className="dg-text-small dg-bold">
        no
      </Label>
      <path d={`M64,${yD1 - 22} L64,72 L${X - 4},72`} className="dg-line" />
      <Arrow x1={X - 30} y1={72} x2={X - 1} y2={72} head={8} />

      {/* collision? no -> sent */}
      <Arrow x1={X + DW} y1={yD2} x2={RX - 86} y2={yD2} head={8} />
      <Label x={402} y={yD2 - 12} className="dg-text-small dg-bold">
        no
      </Label>

      {/* jam -> back-off -> back to listening */}
      <Arrow x1={X + 90} y1={yJam} x2={RX - 86} y2={yJam} head={8} />
      <path d={`M${RX + 85},${yJam} L605,${yJam} L605,${yD1} L${X + DW + 30},${yD1}`} className="dg-line" />
      <Arrow x1={X + DW + 40} y1={yD1} x2={X + DW + 1} y2={yD1} head={8} />

      <Box x={X} y={yStart} w={200} lines={['Frame ready to send']} />
      <Diamond y={yD1} lines={['Listen: is the', 'channel idle?']} />
      <Box x={64} y={yD1} w={108} lines={['wait, keep', 'listening']} />
      <Box x={X} y={yTx} w={200} lines={['Transmit the frame,', 'still listening']} />
      <Diamond y={yD2} lines={['Collision', 'detected?']} />
      <Box x={RX} y={yD2} w={170} lines={['Frame sent ✓']} kind="good" />
      <Box x={X} y={yJam} w={180} lines={['Stop; send a', 'jam signal']} kind="bad" />
      <Box x={RX} y={yJam} w={170} lines={['Wait a random', 'time (back-off)']} kind="bad" />
    </Svg>
  );
}

export default NetworksCsmaCd;
