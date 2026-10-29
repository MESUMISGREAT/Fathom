/**
 * Contact force split into normal reaction and friction. Smooth vs rough contact.
 * Left: rough contact with R and F. Right: smooth contact with only R.
 * Bottom: block on smooth inclined plane.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'forces-equilibrium-contact-smooth';

const W = 660;
const H = 420;

export function ForcesEquilibriumContactSmooth() {
  // ROUGH CONTACT constants
  const BX1 = 115;
  const BY1 = 130;
  const BW = 80;
  const BH = 50;

  // SMOOTH CONTACT constants
  const BX2 = 445;
  const BY2 = 130;

  // INCLINED PLANE constants
  const PX = 180;
  const PY = 290;
  const alpha = 30;
  const rad = (alpha * Math.PI) / 180;
  const planeLen = 200;
  const planeH = 100;
  const blockX = PX + 80;
  const blockY = PY - 60;
  const blockW = 50;
  const blockH = 30;
  const cx = blockX + blockW / 2;
  const cy = blockY + blockH / 2;

  return (
    <Svg width={W} height={H}>
      <Label x={330} y={30} className="dg-text dg-bold">
        Contact force components: rough and smooth surfaces
      </Label>

      {/* ROUGH CONTACT - left side */}
      <Label x={165} y={70} className="dg-text dg-bold dg-accent">
        Rough contact
      </Label>

      {/* Block on rough surface */}

      <rect x={BX1} y={BY1} width={BW} height={BH} rx={4} className="dg-fill-accent dg-thin" />
      <Label x={BX1 + BW / 2} y={BY1 + BH / 2} className="dg-text-small dg-bold">block</Label>

      {/* Surface */}
      <line x1={BX1 - 40} y1={BY1 + BH} x2={BX1 + BW + 40} y2={BY1 + BH} className="dg-line" strokeWidth={3} />
      <Label x={BX1 + BW / 2} y={BY1 + BH + 20} className="dg-text-small dg-text-muted">rough surface</Label>

      {/* Normal reaction R */}
      <Arrow x1={BX1 + BW / 2} y1={BY1} x2={BX1 + BW / 2} y2={BY1 - 50} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={BX1 + BW / 2 - 30} y={BY1 - 35} tex="R" w={30} h={32} anchor="end" tone="accent" />
      <Label x={BX1 + BW / 2 - 40} y={BY1 - 35} className="dg-text-small dg-text-muted">normal reaction</Label>

      {/* Friction F */}
      <Arrow x1={BX1} y1={BY1 + BH / 2} x2={BX1 - 50} y2={BY1 + BH / 2} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={BX1 - 55} y={BY1 + BH / 2 - 18} tex="F" w={30} h={32} anchor="end" tone="accent-2" />
      <Label x={BX1 - 65} y={BY1 + BH / 2 - 18} className="dg-text-small dg-text-muted">friction</Label>

      {/* Weight mg */}
      <Arrow x1={BX1 + BW / 2} y1={BY1 + BH} x2={BX1 + BW / 2} y2={BY1 + BH + 50} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={BX1 + BW / 2 - 30} y={BY1 + BH + 30} tex="mg" w={30} h={32} anchor="end" />
      <Label x={BX1 + BW / 2 - 40} y={BY1 + BH + 30} className="dg-text-small dg-text-muted">weight</Label>

      {/* Combined contact force annotation */}
      <Label x={165} y={200} className="dg-text-small">
        Contact force = R + F (vector sum)
      </Label>
      <MathLabel x={165} y={220} tex="F \\leq \\mu R" w={80} h={32} tone="muted" />

      {/* SMOOTH CONTACT - right side */}
      <Label x={495} y={70} className="dg-text dg-bold dg-accent-2">
        Smooth contact
      </Label>

      {/* Block on smooth surface */}
      <rect x={BX2} y={BY2} width={BW} height={BH} rx={4} className="dg-fill-accent-2 dg-thin" />
      <Label x={BX2 + BW / 2} y={BY2 + BH / 2} className="dg-text-small dg-bold">block</Label>

      {/* Surface */}
      <line x1={BX2 - 40} y1={BY2 + BH} x2={BX2 + BW + 40} y2={BY2 + BH} className="dg-line" strokeWidth={3} />
      <Label x={BX2 + BW / 2} y={BY2 + BH + 20} className="dg-text-small dg-text-muted">smooth surface</Label>

      {/* Normal reaction R only */}
      <Arrow x1={BX2 + BW / 2} y1={BY2} x2={BX2 + BW / 2} y2={BY2 - 50} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={BX2 + BW / 2 - 30} y={BY2 - 35} tex="R" w={30} h={32} anchor="end" tone="accent-2" />
      <Label x={BX2 + BW / 2 - 40} y={BY2 - 35} className="dg-text-small dg-text-muted">normal reaction</Label>

      {/* No friction - crossed out F */}
      <Label x={BX2 - 15} y={BY2 + BH / 2 - 5} className="dg-text-small dg-text-muted dg-italic">
        F = 0
      </Label>

      {/* Weight mg */}
      <Arrow x1={BX2 + BW / 2} y1={BY2 + BH} x2={BX2 + BW / 2} y2={BY2 + BH + 50} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={BX2 + BW / 2 - 30} y={BY2 + BH + 30} tex="mg" w={30} h={32} anchor="end" />
      <Label x={BX2 + BW / 2 - 40} y={BY2 + BH + 30} className="dg-text-small dg-text-muted">weight</Label>

      {/* Smooth definition */}
      <Label x={495} y={200} className="dg-text-small">
        Contact force = R only (no friction)
      </Label>
      <MathLabel x={495} y={220} tex="F = 0" w={50} h={32} tone="muted" />

      <line x1={40} y1={245} x2={620} y2={245} className="dg-grid" />

      {/* INCLINED PLANE - bottom */}
      <Label x={330} y={265} className="dg-text dg-bold">
        Block on a smooth inclined plane (angle α)
      </Label>

      {/* Inclined plane */}
      <path d={`M${PX},${PY} L${PX + planeLen},${PY} L${PX + planeLen - planeH * Math.tan(rad)},${PY - planeH} L${PX - planeH * Math.tan(rad)},${PY - planeH} Z`} className="dg-fill-muted dg-thin" />
      <line x1={PX} y1={PY} x2={PX + planeLen} y2={PY} className="dg-line" strokeWidth={3} />

      {/* Block on plane */}
      <rect x={blockX} y={blockY} width={blockW} height={blockH} rx={3} className="dg-fill-accent dg-thin" transform={`rotate(${alpha} ${blockX + blockW / 2} ${blockY + blockH / 2})`} />
      <Label x={blockX + blockW / 2} y={blockY + blockH / 2 + 40} className="dg-text-small dg-bold">block</Label>

      {/* Weight mg - vertical down from block center */}
      <Arrow x1={cx} y1={cy + 15} x2={cx} y2={cy + 75} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={cx - 25} y={cy + 45} tex="mg" w={30} h={32} anchor="end" />
      <Label x={cx - 35} y={cy + 45} className="dg-text-small dg-text-muted">weight</Label>

      {/* Weight components */}
      {/* Perpendicular to plane: mg cos α */}
      <Arrow x1={cx} y1={cy} x2={cx - 40} y2={cy - 69} className="dg-dashed dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={cx - 80} y={cy - 45} tex="mg\\cos\\alpha" w={80} h={32} anchor="end" tone="accent-2" size="small" />

      {/* Parallel to plane: mg sin α */}
      <Arrow x1={cx} y1={cy} x2={cx + 55} y2={cy + 32} className="dg-dashed dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={cx + 70} y={cy + 20} tex="mg\\sin\\alpha" w={80} h={32} anchor="start" tone="accent" size="small" />

      {/* Normal reaction R perpendicular to plane */}
      <Arrow x1={cx} y1={cy - 15} x2={cx - 35} y2={cy - 70} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={cx - 75} y={cy - 55} tex="R" w={30} h={32} anchor="end" tone="accent-2" />
      <Label x={cx - 85} y={cy - 55} className="dg-text-small dg-text-muted">normal reaction</Label>

      {/* Angle alpha annotation */}
      <path d={`M${PX + 25},${PY} A25,25 0 0,1 ${PX + 25 - 25 * Math.sin(rad)},${PY - 25 * Math.cos(rad)}`} className="dg-thin dg-muted" />
      <MathLabel x={PX + 35} y={PY - 12} tex="\\alpha" w={30} h={32} tone="muted" size="small" />

      <Label x={450} y={330} anchor="start" className="dg-text-small">
        On smooth incline: no friction, so R = mg cos α
      </Label>
      <Label x={450} y={350} anchor="start" className="dg-text-small dg-text-muted">
        Down-slope component = mg sin α (causes acceleration if released)
      </Label>

      <Label x={330} y={400} className="dg-text-small dg-text-muted">
        Smooth means F = 0, not R = 0. The normal reaction still acts perpendicular to the surface.
      </Label>
    </Svg>
  );
}

export default ForcesEquilibriumContactSmooth;