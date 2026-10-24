/**
 * Top view of a hard disk platter. The platter has a magnetic coating and spins on a central
 * spindle. Its surface is divided into concentric rings called tracks (one is highlighted), and
 * each track is divided into sectors by radial lines (one sector is shaded). An actuator arm,
 * pivoting at the bottom right, swings the read/write head across the platter to the right
 * track; the head then waits for the right sector to spin underneath it.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-hdd-platter';

const W = 620;
const H = 380;
const CX = 200;
const CY = 196;
const R = 168;
const rings = [40, 62, 84, 106, 128, 150];

const rad = (d: number) => (d * Math.PI) / 180;
const at = (deg: number, r: number) => ({ x: CX + r * Math.cos(rad(deg)), y: CY + r * Math.sin(rad(deg)) });

function wedge(a0: number, a1: number, r0: number, r1: number) {
  const p = at(a0, r1);
  const q = at(a1, r1);
  const s = at(a1, r0);
  const t = at(a0, r0);
  const f = (n: number) => n.toFixed(1);
  return `M${f(p.x)},${f(p.y)} A${r1},${r1} 0 0 1 ${f(q.x)},${f(q.y)} L${f(s.x)},${f(s.y)} A${r0},${r0} 0 0 0 ${f(t.x)},${f(t.y)} Z`;
}

export function ComputerComponentsHddPlatter() {
  const head = at(-22.5, 117);
  const pivot = { x: 540, y: 330 };
  const trackPt = at(160, 117);
  const sectorPt = at(-48, 117);
  const edgePt = at(232, R);
  const spinA = at(20, R + 14);
  const spinB = at(55, R + 14);
  const spinTip = at(60, R + 14);
  return (
    <Svg width={W} height={H}>
      <circle cx={CX} cy={CY} r={R} className="dg-fill-muted dg-line" />
      {/* highlighted track */}
      <path d={`${wedge(0, 180, 106, 128)} ${wedge(180, 360, 106, 128)}`} className="dg-fill-accent" />
      {rings.map((r) => (
        <circle key={r} cx={CX} cy={CY} r={r} className="dg-grid" />
      ))}
      <circle cx={CX} cy={CY} r={106} className="dg-accent" />
      <circle cx={CX} cy={CY} r={128} className="dg-accent" />
      {/* sector boundaries */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => {
        const a = at(d, 40);
        const b = at(d, 150);
        return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="dg-grid" />;
      })}
      <path d={wedge(-45, 0, 106, 128)} className="dg-fill-accent-2 dg-accent-2" />
      {/* spindle */}
      <circle cx={CX} cy={CY} r={16} className="dg-dot" />
      <Label x={CX} y={CY + 27} className="dg-text-small dg-bold">
        spindle
      </Label>
      {/* spin direction */}
      <path d={`M${spinA.x.toFixed(1)},${spinA.y.toFixed(1)} A${R + 14},${R + 14} 0 0 1 ${spinB.x.toFixed(1)},${spinB.y.toFixed(1)}`} className="dg-muted" />
      <Arrow x1={spinB.x} y1={spinB.y} x2={spinTip.x} y2={spinTip.y} head={8} className="dg-muted" headClassName="dg-dot" />
      <Label x={372} y={304} anchor="start" className="dg-text-small dg-text-muted">
        spins at
      </Label>
      <Label x={372} y={320} anchor="start" className="dg-text-small dg-text-muted">
        constant speed
      </Label>

      {/* actuator arm and head */}
      <line x1={pivot.x} y1={pivot.y} x2={head.x} y2={head.y} className="dg-line" style={{ strokeWidth: 6 }} />
      <circle cx={pivot.x} cy={pivot.y} r={12} className="dg-fill-muted dg-line" />
      <rect x={head.x - 7} y={head.y - 7} width={14} height={14} rx={2} className="dg-dot" />

      {/* labels */}
      <line x1={edgePt.x} y1={edgePt.y} x2={52} y2={30} className="dg-thin" />
      <Label x={20} y={20} anchor="start" className="dg-text-small">
        platter with a magnetic coating
      </Label>
      <line x1={trackPt.x} y1={trackPt.y} x2={14} y2={300} className="dg-thin" />
      <Label x={10} y={312} anchor="start" className="dg-text-small dg-text-accent">
        track
      </Label>
      <line x1={sectorPt.x} y1={sectorPt.y} x2={330} y2={46} className="dg-thin" />
      <Label x={334} y={40} anchor="start" className="dg-text-small dg-text-accent-2">
        sector (one block of a track)
      </Label>
      <Label x={330} y={120} anchor="start" className="dg-text-small dg-bold">
        read/write head
      </Label>
      <Label x={472} y={196} anchor="start" className="dg-text-small">
        actuator arm swings
      </Label>
      <Label x={472} y={212} anchor="start" className="dg-text-small">
        the head across tracks
      </Label>
    </Svg>
  );
}

export default ComputerComponentsHddPlatter;
