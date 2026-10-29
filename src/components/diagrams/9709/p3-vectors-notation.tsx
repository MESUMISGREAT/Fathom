/**
 * 3D vector showing four notations for the same vector from origin to (3, 2, 4).
 */
import { Label, MathLabel, Svg, Arrow } from '../primitives';

export const diagramKey = 'p3-vectors-notation';

const W = 480;
const H = 380;
// 3D-ish projection: x right, y up, z out of screen (diagonal)
const origin = { x: 60, y: 300 };
const scale = 40;
const vx = 3, vy = 2, vz = 4;

const tip = {
  x: origin.x + vx * scale,
  y: origin.y - vy * scale - vz * scale * 0.5,
};

const projX = (x: number): number => origin.x + x * scale;
const projY = (y: number, z: number): number => origin.y - y * scale - z * scale * 0.5;

export default function P3VectorsNotation() {
  return (
    <Svg width={W} height={H}>
      {/* Axes */}
      <Arrow x1={origin.x} y1={origin.y} x2={projX(4.5)} y2={projY(0, 0)} className="dg-thin" head={6} />
      <Arrow x1={origin.x} y1={origin.y} x2={projX(0)} y2={projY(3.5, 0)} className="dg-thin" head={6} />
      <Arrow x1={origin.x} y1={origin.y} x2={projX(0)} y2={projY(0, 3.5)} className="dg-thin" head={6} />
      <MathLabel x={projX(4.7)} y={projY(0, 0) + 4} tex="x" anchor="start" w={20} h={20} size="small" />
      <MathLabel x={projX(0) - 10} y={projY(3.7, 0)} tex="y" anchor="end" w={20} h={20} size="small" />
      <MathLabel x={projX(0) + 8} y={projY(0, 3.7) + 10} tex="z" anchor="start" w={20} h={20} size="small" />
      {/* Vector */}
      <Arrow x1={origin.x} y1={origin.y} x2={tip.x} y2={tip.y} className="dg-accent" head={8} />
      <MathLabel x={tip.x + 10} y={tip.y - 10} tex="(3, 2, 4)" anchor="start" w={80} h={24} size="small" tone="accent" />
      {/* Labels for notations */}
      <g fontSize={12} fill="#374151">
        <text x={20} y={50} className="dg-bold">Four names for the same vector:</text>
        <text x={20} y={80}>Column: <tspan className="dg-code">(3, 2, 4)^T</tspan></text>
        <text x={20} y={105}>i/j/k: <tspan className="dg-code">3i + 2j + 4k</tspan></text>
        <text x={20} y={130}>Bold letter: <tspan className="dg-code">a = 3i + 2j + 4k</tspan></text>
        <text x={20} y={155}>Directed segment: <tspan className="dg-code">OA (arrow over)</tspan></text>
      </g>
      <Label x={W / 2} y={H - 12} className="dg-text-small dg-bold">
        Column, i/j/k, bold letter, directed segment — all represent the same vector
      </Label>
    </Svg>
  );
}