/**
 * Left: particles A (3 kg) and B (5 kg) hanging either side of a smooth fixed pulley, each with tension T
 * up and its weight down, and acceleration arrows (A up, B down). Right: a trailer (600 kg) and car
 * (1000 kg) joined by a light bar, with the driving force, both resistances, and the tension T acting
 * forwards on the trailer and backwards on the car.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'mech-connected-particles';

const W = 680;
const H = 340;

type Pt = { x: number; y: number };

function Arrow({ from, to, className, head }: { from: Pt; to: Pt; className: string; head: string }) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const s = 10;
  const tri = `${to.x},${to.y} ${to.x - s * ux - (s / 2) * uy},${to.y - s * uy + (s / 2) * ux} ${to.x - s * ux + (s / 2) * uy},${to.y - s * uy - (s / 2) * ux}`;
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={className} strokeWidth={2.5} />
      <polygon points={tri} className={head} />
    </g>
  );
}

export default function MechConnectedParticles() {
  return (
    <Svg width={W} height={H}>
      {/* Pulley */}
      <line x1={100} y1={18} x2={200} y2={18} className="dg-line" strokeWidth={3} />
      <line x1={150} y1={18} x2={150} y2={70} className="dg-line" />
      <circle cx={150} cy={70} r={40} className="dg-fill-surface dg-line" />
      <circle cx={150} cy={70} r={4} className="dg-dot" />
      <path d="M110,70 A40,40 0 0 1 190,70" className="dg-line" fill="none" strokeWidth={2} />
      <line x1={110} y1={70} x2={110} y2={170} className="dg-line" strokeWidth={2} />
      <line x1={190} y1={70} x2={190} y2={210} className="dg-line" strokeWidth={2} />
      <rect x={86} y={170} width={48} height={40} rx={3} className="dg-fill-surface dg-line" />
      <rect x={166} y={210} width={48} height={40} rx={3} className="dg-fill-surface dg-line" />
      <Label x={110} y={184} className="dg-text-small">A</Label>
      <Label x={110} y={200} className="dg-text-small">3 kg</Label>
      <Label x={190} y={224} className="dg-text-small">B</Label>
      <Label x={190} y={240} className="dg-text-small">5 kg</Label>
      <Arrow from={{ x: 110, y: 170 }} to={{ x: 110, y: 128 }} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={{ x: 190, y: 210 }} to={{ x: 190, y: 168 }} className="dg-accent" head="dg-dot-accent" />
      <MathLabel x={94} y={140} tex="T" w={24} tone="accent" />
      <MathLabel x={206} y={180} tex="T" w={24} tone="accent" />
      <Arrow from={{ x: 110, y: 210 }} to={{ x: 110, y: 262 }} className="dg-line" head="dg-dot" />
      <Arrow from={{ x: 190, y: 250 }} to={{ x: 190, y: 302 }} className="dg-line" head="dg-dot" />
      <MathLabel x={84} y={254} tex="3g" w={30} />
      <MathLabel x={216} y={294} tex="5g" w={30} />
      <Arrow from={{ x: 52, y: 222 }} to={{ x: 52, y: 172 }} className="dg-accent-2" head="dg-dot-accent-2" />
      <Arrow from={{ x: 250, y: 205 }} to={{ x: 250, y: 255 }} className="dg-accent-2" head="dg-dot-accent-2" />
      <MathLabel x={38} y={198} tex="a" w={20} tone="accent-2" />
      <MathLabel x={264} y={230} tex="a" w={20} tone="accent-2" />
      <Label x={150} y={326} className="dg-text-small dg-text-muted">Smooth pulley: same T both sides</Label>

      {/* Car and trailer */}
      <line x1={340} y1={226} x2={676} y2={226} className="dg-line" strokeWidth={3} />
      <rect x={360} y={180} width={80} height={44} rx={4} className="dg-fill-surface dg-line" />
      <rect x={510} y={168} width={110} height={56} rx={6} className="dg-fill-surface dg-line" />
      <line x1={440} y1={206} x2={510} y2={206} className="dg-line" strokeWidth={3} />
      <Label x={400} y={196} className="dg-text-small">trailer</Label>
      <Label x={400} y={212} className="dg-text-small">600 kg</Label>
      <Label x={565} y={188} className="dg-text-small">car</Label>
      <Label x={565} y={206} className="dg-text-small">1000 kg</Label>
      <Arrow from={{ x: 442, y: 186 }} to={{ x: 472, y: 186 }} className="dg-accent" head="dg-dot-accent" />
      <Arrow from={{ x: 508, y: 186 }} to={{ x: 478, y: 186 }} className="dg-accent" head="dg-dot-accent" />
      <MathLabel x={456} y={166} tex="T" w={24} tone="accent" />
      <MathLabel x={494} y={166} tex="T" w={24} tone="accent" />
      <Arrow from={{ x: 620, y: 196 }} to={{ x: 670, y: 196 }} className="dg-accent-2" head="dg-dot-accent-2" />
      <Label x={646} y={176} className="dg-text-small">3000 N</Label>
      <Arrow from={{ x: 580, y: 250 }} to={{ x: 530, y: 250 }} className="dg-line" head="dg-dot" />
      <Arrow from={{ x: 420, y: 250 }} to={{ x: 370, y: 250 }} className="dg-line" head="dg-dot" />
      <Label x={555} y={272} className="dg-text-small">500 N</Label>
      <Label x={395} y={272} className="dg-text-small">300 N</Label>
      <Label x={510} y={326} className="dg-text-small dg-text-muted">The rope or bar pulls the trailer forward and the car back</Label>
    </Svg>
  );
}
