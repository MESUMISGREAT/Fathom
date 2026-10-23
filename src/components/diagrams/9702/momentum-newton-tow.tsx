/**
 * A car (1200 kg) towing a trailer (400 kg), accelerating to the right.
 * Top: the whole system (1600 kg). Only external forces appear: the driving
 *   force 2400 N forwards and resistive forces of 300 N (car) + 100 N
 *   (trailer) backwards. Resultant 2000 N, so a = 1.25 m s⁻².
 * Bottom: separate free-body diagrams. Trailer: tow bar pulls it forwards
 *   with 600 N, resistance 100 N backwards (resultant 500 N). Car: driving
 *   force 2400 N forwards, resistance 300 N and the tow bar's pull of 600 N
 *   backwards (resultant 1500 N). The two 600 N tow-bar forces (accent-2)
 *   are a Newton's third law pair. Arrow lengths are not to scale.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-tow';

const W = 640;
const H = 346;

function Wheels({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g>
      <circle cx={x1} cy={y} r={8} className="dg-fill-muted dg-line" />
      <circle cx={x2} cy={y} r={8} className="dg-fill-muted dg-line" />
    </g>
  );
}

function Car({ l, r, road }: { l: number; r: number; road: number }) {
  const top = road - 48;
  return (
    <g>
      <path
        d={`M${l},${road - 10} L${l},${top + 18} L${l + 20},${top + 16} L${l + 32},${top} L${r - 30},${top} L${r - 14},${top + 16} L${r},${top + 20} L${r},${road - 10} Z`}
        className="dg-fill-accent dg-accent"
      />
      <Wheels x1={l + 20} x2={r - 20} y={road - 8} />
    </g>
  );
}

function Trailer({ l, r, road }: { l: number; r: number; road: number }) {
  return (
    <g>
      <rect x={l} y={road - 40} width={r - l} height={30} className="dg-fill-accent-2 dg-accent-2" />
      <Wheels x1={l + 16} x2={r - 16} y={road - 8} />
    </g>
  );
}

export function MomentumNewtonTow() {
  // ---- top: whole system ----
  const road1 = 128;
  const tL = 190;
  const tR = 270;
  const cL = 300;
  const cR = 410;
  const fy = road1 - 26;

  // ---- bottom: separate bodies ----
  const road2 = 262;
  const t2L = 110;
  const t2R = 190;
  const c2L = 400;
  const c2R = 510;
  const fy2 = road2 - 26;

  return (
    <Svg width={W} height={H}>
      <Label x={20} y={18} anchor="start" className="dg-text dg-bold">
        Whole system: car + trailer, 1600 kg
      </Label>
      <line x1={80} y1={road1} x2={560} y2={road1} className="dg-thin" />
      <Trailer l={tL} r={tR} road={road1} />
      <line x1={tR} y1={fy + 6} x2={cL} y2={fy + 6} className="dg-line" />
      <Car l={cL} r={cR} road={road1} />
      <Arrow x1={cR} y1={fy} x2={cR + 80} y2={fy} />
      <Label x={cR + 88} y={fy - 8} anchor="start" className="dg-text-small dg-bold">
        driving force
      </Label>
      <Label x={cR + 88} y={fy + 8} anchor="start" className="dg-text-small">
        2400 N
      </Label>
      <Arrow x1={tL} y1={fy} x2={tL - 36} y2={fy} />
      <Label x={tL - 44} y={fy - 8} anchor="end" className="dg-text-small dg-bold">
        resistance
      </Label>
      <Label x={tL - 44} y={fy + 8} anchor="end" className="dg-text-small">
        300 N + 100 N
      </Label>
      <Arrow x1={255} y1={52} x2={325} y2={52} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={333} y={52} anchor="start" className="dg-text-small dg-text-accent">
        a = 2000 ÷ 1600 = 1.25 m s⁻²
      </Label>
      <Label x={(tR + cL) / 2} y={road1 + 16} className="dg-text-small dg-text-muted">
        tow bar forces are internal: leave them out
      </Label>

      <line x1={20} y1={166} x2={620} y2={166} className="dg-grid" />

      {/* ---- bottom left: trailer alone ---- */}
      <Label x={20} y={186} anchor="start" className="dg-text dg-bold">
        Trailer alone, 400 kg
      </Label>
      <line x1={30} y1={road2} x2={290} y2={road2} className="dg-thin" />
      <Trailer l={t2L} r={t2R} road={road2} />
      <Arrow x1={t2R} y1={fy2} x2={t2R + 44} y2={fy2} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={t2R + 50} y={fy2 - 8} anchor="start" className="dg-text-small dg-text-accent-2">
        tow bar
      </Label>
      <Label x={t2R + 50} y={fy2 + 8} anchor="start" className="dg-text-small dg-text-accent-2">
        600 N
      </Label>
      <Arrow x1={t2L} y1={fy2} x2={t2L - 24} y2={fy2} />
      <Label x={t2L - 30} y={fy2} anchor="end" className="dg-text-small">
        100 N
      </Label>
      <Label x={150} y={road2 + 18} className="dg-text-small">
        600 − 100 = 400 × 1.25
      </Label>

      {/* ---- bottom right: car alone ---- */}
      <Label x={330} y={186} anchor="start" className="dg-text dg-bold">
        Car alone, 1200 kg
      </Label>
      <line x1={330} y1={road2} x2={620} y2={road2} className="dg-thin" />
      <Car l={c2L} r={c2R} road={road2} />
      <Arrow x1={c2R} y1={fy2} x2={c2R + 70} y2={fy2} />
      <Label x={c2R + 74} y={fy2 - 16} anchor="end" className="dg-text-small">
        2400 N
      </Label>
      <Arrow x1={c2L} y1={fy2} x2={c2L - 44} y2={fy2} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={c2L - 50} y={fy2} anchor="end" className="dg-text-small dg-text-accent-2">
        600 N
      </Label>
      <Arrow x1={c2L} y1={fy2 + 14} x2={c2L - 30} y2={fy2 + 14} />
      <Label x={c2L - 36} y={fy2 + 16} anchor="end" className="dg-text-small">
        300 N
      </Label>
      <Label x={470} y={road2 + 18} className="dg-text-small">
        2400 − 300 − 600 = 1200 × 1.25
      </Label>
      <Label x={W / 2} y={316} className="dg-text-small dg-bold">
        the two 600 N tow-bar forces are a third-law pair (equal, opposite, on different bodies)
      </Label>
      <Label x={W / 2} y={333} className="dg-text-small dg-text-muted">
        arrow lengths not to scale
      </Label>
    </Svg>
  );
}

export default MomentumNewtonTow;
