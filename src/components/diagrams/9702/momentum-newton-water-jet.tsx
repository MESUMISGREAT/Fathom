/**
 * A horizontal water jet of speed v and cross-sectional area A hits a wall
 * and stops (the water spreads out along the wall, so it loses all of its
 * horizontal velocity). In a time Δt a column of length vΔt leaves the hose
 * (in a steady flow the same mass reaches the wall in each Δt): volume AvΔt,
 * mass ρAvΔt. So Δm/Δt = ρAv and the force is
 * F = (Δm/Δt)Δv = ρAv². The wall pushes the water back (force on the water,
 * towards the hose) and the water pushes the wall forwards (force on the
 * wall): a Newton's third law pair. Not to scale.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-water-jet';

const W = 620;
const H = 320;

export function MomentumNewtonWaterJet() {
  const jy1 = 122;
  const jy2 = 142;
  const jm = (jy1 + jy2) / 2;
  const wall = 470;
  // the column that leaves the hose in a time Δt starts at the nozzle
  const c1 = 74;
  const c2 = 214;
  return (
    <Svg width={W} height={H}>
      {/* nozzle */}
      <path d={`M24,100 L74,${jy1 - 4} L74,${jy2 + 4} L24,164 Z`} className="dg-fill-muted dg-thin" />
      <Label x={46} y={182} className="dg-text-small">
        hose
      </Label>
      {/* jet */}
      <rect x={74} y={jy1} width={wall - 74} height={jy2 - jy1} className="dg-fill-accent-2" />
      <line x1={74} y1={jy1} x2={wall} y2={jy1} className="dg-accent-2" />
      <line x1={74} y1={jy2} x2={wall} y2={jy2} className="dg-accent-2" />
      {/* the column that leaves the hose in time Δt */}
      <rect x={c1} y={jy1} width={c2 - c1} height={jy2 - jy1} className="dg-fill-accent dg-accent dg-dashed" />
      <ellipse cx={c2} cy={jm} rx={5} ry={10} className="dg-thin" />
      <Label x={c2 + 12} y={jm + 26} anchor="start" className="dg-text-small">
        area A
      </Label>
      <Arrow x1={c1} y1={96} x2={c2} y2={96} head={7} className="dg-thin" double />
      <Label x={(c1 + c2) / 2} y={82} className="dg-text-small dg-bold">
        length v Δt
      </Label>
      <Label x={(c1 + c2) / 2} y={jm + 26} className="dg-text-small">
        mass Δm = ρ A v Δt
      </Label>
      {/* velocity */}
      <Arrow x1={270} y1={96} x2={360} y2={96} className="dg-muted" headClassName="dg-dot" />
      <Label x={315} y={82} className="dg-text-small">
        speed v
      </Label>
      {/* wall and splash */}
      <rect x={wall} y={40} width={16} height={196} className="dg-fill-muted dg-thin" />
      {Array.from({ length: 9 }, (_, i) => 48 + i * 22).map((y) => (
        <line key={y} x1={wall + 16} y1={y} x2={wall + 26} y2={y - 10} className="dg-thin" />
      ))}
      {/* the water turns to run along the wall: no horizontal velocity left, no bounce back */}
      <path d={`M${wall - 22},${jy1} Q${wall - 2},${jy1} ${wall - 2},${jy1 - 20} L${wall - 2},${jy1 - 46}`} className="dg-accent-2" />
      <path d={`M${wall - 22},${jy2} Q${wall - 2},${jy2} ${wall - 2},${jy2 + 20} L${wall - 2},${jy2 + 46}`} className="dg-accent-2" />
      <Arrow x1={wall - 14} y1={jy1 - 26} x2={wall - 14} y2={jy1 - 50} head={6} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={wall - 14} y1={jy2 + 26} x2={wall - 14} y2={jy2 + 50} head={6} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={wall - 30} y={jy1 - 90} anchor="end" className="dg-text-small dg-text-muted">
        water spreads out:
      </Label>
      <Label x={wall - 30} y={jy1 - 76} anchor="end" className="dg-text-small dg-text-muted">
        horizontal velocity → 0
      </Label>
      {/* third-law pair */}
      <Arrow x1={wall - 6} y1={jy2 + 66} x2={wall - 76} y2={jy2 + 66} className="dg-line" />
      <Label x={wall - 84} y={jy2 + 58} anchor="end" className="dg-text-small dg-bold">
        F on the water
      </Label>
      <Label x={wall - 84} y={jy2 + 74} anchor="end" className="dg-text-small">
        (wall pushes it back)
      </Label>
      <Arrow x1={wall + 30} y1={jm} x2={wall + 96} y2={jm} className="dg-line" />
      <Label x={wall + 34} y={jm - 22} anchor="start" className="dg-text-small dg-bold">
        F on the wall
      </Label>
      <Label x={wall + 34} y={jm + 22} anchor="start" className="dg-text-small">
        (water pushes it)
      </Label>
      {/* the algebra */}
      <line x1={20} y1={254} x2={600} y2={254} className="dg-grid" />
      <Label x={170} y={274} className="dg-text-small">
        mass per second: Δm / Δt = ρ A v
      </Label>
      <Label x={450} y={274} className="dg-text-small">
        change in velocity: Δv = v − 0 = v
      </Label>
      <Label x={W / 2} y={298} className="dg-text dg-bold">
        F = (Δm / Δt) × Δv = ρ A v²
      </Label>
    </Svg>
  );
}

export default MomentumNewtonWaterJet;
