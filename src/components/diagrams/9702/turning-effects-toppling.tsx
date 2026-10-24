/**
 * Toppling (outcome 4.1.1): a uniform block, width : height = 1 : 2, tilted onto one bottom edge.
 * Its centre of gravity G is at its centre, so it tips over once tan(tilt) > width/height = 0.5,
 * i.e. beyond 26.6°. Drawn to scale.
 * Left: tilted 15°. The vertical line through G meets the ground inside the pivot edge, so the
 *   weight's moment about the edge turns the block back (anticlockwise here).
 * Right: tilted 35°. The line through G passes outside the pivot edge, so the weight's moment
 *   turns the block further over (clockwise): it topples.
 */
import { Label, Svg } from '../primitives';
import { Force, TurnArrow, type Pt } from './turning-effects-kit';

export const diagramKey = 'phys-turning-effects-toppling';

const W = 640;
const H = 300;
const GROUND = 250;
const BW = 80;
const BH = 160;
const DEG = Math.PI / 180;

function Block({ O, tilt, title, note, turn }: { O: Pt; tilt: number; title: string; note: string; turn: [number, number] }) {
  const t = tilt * DEG;
  const map = (x: number, y: number): Pt => ({ x: O.x + x * Math.cos(t) - y * Math.sin(t), y: O.y + x * Math.sin(t) + y * Math.cos(t) });
  const corners = [map(0, 0), map(-BW, 0), map(-BW, -BH), map(0, -BH)];
  const G = map(-BW / 2, -BH / 2);
  const inside = G.x < O.x;
  return (
    <g>
      <Label x={O.x - 40} y={22} className="dg-text dg-bold">
        {title}
      </Label>
      <polygon points={corners.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} className="dg-fill-accent dg-accent" />
      <line x1={G.x} y1={G.y} x2={G.x} y2={GROUND} className="dg-muted dg-dashed" />
      <path d={`M${G.x - 5},${GROUND - 5} L${G.x + 5},${GROUND + 5} M${G.x - 5},${GROUND + 5} L${G.x + 5},${GROUND - 5}`} className="dg-accent-2" />
      <Force p={G} u={{ x: 0, y: 1 }} l={58} label="W" dx={inside ? -12 : 12} dy={-10} anchor={inside ? 'end' : 'start'} />
      <circle cx={G.x} cy={G.y} r={4} className="dg-dot" />
      <Label x={G.x + (inside ? 10 : -10)} y={G.y - 10} anchor={inside ? 'start' : 'end'} className="dg-text dg-bold">
        G
      </Label>
      <circle cx={O.x} cy={O.y} r={4.5} className="dg-dot-accent-2" />
      <Label x={O.x + (inside ? 8 : -8)} y={GROUND + 18} anchor={inside ? 'start' : 'end'} className="dg-text-small">
        pivot edge
      </Label>
      <TurnArrow c={O} r={192} a1={turn[0]} a2={turn[1]} />
      <Label x={O.x - 40} y={286} className="dg-text-small dg-text-muted">
        {note}
      </Label>
    </g>
  );
}

export function TurningEffectsToppling() {
  return (
    <Svg width={W} height={H}>
      <line x1={10} y1={GROUND} x2={630} y2={GROUND} className="dg-line" />
      <line x1={320} y1={40} x2={320} y2={236} className="dg-grid" />
      <Block O={{ x: 200, y: GROUND }} tilt={15} title="Tilted 15°" note="W passes inside the edge: it falls back" turn={[70, 100]} />
      <Block O={{ x: 500, y: GROUND }} tilt={35} title="Tilted 35°" note="W passes outside the edge: it topples" turn={[82, 56]} />
    </Svg>
  );
}

export default TurningEffectsToppling;
