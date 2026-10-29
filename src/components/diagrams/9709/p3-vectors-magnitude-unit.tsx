/**
 * 3D vector showing magnitude and unit vector.
 * Vector from origin to (3, 4, 12) has magnitude 13.
 * Unit vector is (3/13, 4/13, 12/13) with length 1.
 */
import { Label, MathLabel, Svg, Arrow } from '../primitives';

export const diagramKey = 'p3-vectors-magnitude-unit';

const W = 480;
const H = 380;
const origin = { x: 60, y: 300 };
const scale = 20;

const vx = 3, vy = 4, vz = 12;
const mag = Math.sqrt(vx * vx + vy * vy + vz * vz); // 13
const ux = vx / mag, uy = vy / mag, uz = vz / mag;

const projX = (x: number, z: number) => origin.x + x * scale + z * scale * 0.3;
const projY = (y: number, z: number) => origin.y - y * scale - z * scale * 0.5;

const vTip = { x: projX(vx, vz), y: projY(vy, vz) };
const uTip = { x: projX(ux, uz), y: projY(uy, uz) };

export default function P3VectorsMagnitudeUnit() {
  return (
    <Svg width={W} height={H}>
      <defs>
        <marker id="arrow" markerWidth={10} markerHeight={10} refX={8} refY={3} orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#64748b" />
        </marker>
      </defs>

      {/* Axes */}
      <Arrow x1={origin.x} y1={origin.y} x2={projX(14, 0)} y2={projY(0, 0)} className="dg-thin" head={6} />
      <Arrow x1={origin.x} y1={origin.y} x2={projX(0, 0)} y2={projY(14, 0)} className="dg-thin" head={6} />
      <Arrow x1={origin.x} y1={origin.y} x2={projX(0, 14)} y2={projY(0, 14)} className="dg-thin" head={6} />
      <MathLabel x={projX(15, 0)} y={projY(0, 0) + 4} tex="x" anchor="start" w={20} h={20} size="small" />
      <MathLabel x={projX(0, 0) - 10} y={projY(15, 0)} tex="y" anchor="end" w={20} h={20} size="small" />
      <MathLabel x={projX(0, 15) + 8} y={projY(0, 15) + 10} tex="z" anchor="start" w={20} h={20} size="small" />

      {/* Original vector v */}
      <Arrow x1={origin.x} y1={origin.y} x2={vTip.x} y2={vTip.y} className="dg-accent" head={8} />
      <MathLabel x={vTip.x + 10} y={vTip.y - 10} tex="v = (3, 4, 12)" anchor="start" w={120} h={24} size="small" tone="accent" />
      {/* Magnitude label */}
      <MathLabel
        x={vTip.x + 10}
        y={vTip.y - 35}
        tex="|v| = 13"
        anchor="start"
        w={80}
        h={20}
        size="small"
        tone="accent"
      />

      {/* Unit vector u (shorter, same direction) */}
      <Arrow x1={origin.x} y1={origin.y} x2={uTip.x} y2={uTip.y} className="dg-accent-2" head={6} />
      <MathLabel x={uTip.x + 10} y={uTip.y + 10} tex="\\hat{v} = (3/13, 4/13, 12/13)" anchor="start" w={160} h={24} size="small" tone="accent-2" />

      {/* Info box - use MathLabel for all text to avoid JSX interpretation issues */}
      <g transform="translate(20, 50)">
        <MathLabel x={0} y={20} tex="Magnitude:" size="small" tone="accent" w={200} h={20} />
        <MathLabel x={0} y={45} tex="|v| = \\sqrt{3^2 + 4^2 + 12^2} = \\sqrt{169} = 13" size="small" w={300} h={20} />
        <MathLabel x={0} y={70} tex="Unit vector: \\hat{v} = v / |v| = (3/13, 4/13, 12/13)" size="small" w={300} h={20} />
        <MathLabel x={0} y={95} tex="|\\hat{v}| = \\sqrt{(3/13)^2 + (4/13)^2 + (12/13)^2} = 1" size="small" w={300} h={20} />
        <MathLabel x={0} y={120} tex="Key: v = |v| \\hat{v} (magnitude x direction)" size="small" tone="muted" w={300} h={20} />
      </g>

      <Label x={W / 2} y={H - 12} className="dg-text-small dg-bold">
        Magnitude is the length (Pythagoras). Unit vector has same direction, length 1.
      </Label>
    </Svg>
  );
}