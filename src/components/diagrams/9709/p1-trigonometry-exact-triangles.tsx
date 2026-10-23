/**
 * The two triangles behind the exact values (each drawn to scale).
 * Left: an equilateral triangle of side 2 cut in half gives a right-angled
 * triangle with sides 1, √3, 2 and angles 30°, 60°, 90°.
 * Right: a square of side 1 cut along a diagonal gives a right-angled isosceles
 * triangle with sides 1, 1, √2 and angles 45°, 45°, 90°.
 */
import { FracLabel, Svg, MathLabel } from '../primitives';
import { RightAngle, arcPath, polar, rad } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-exact-triangles';

const W = 620;
const H = 290;

export default function P1TrigonometryExactTriangles() {
  const s = 88;
  const Bl = { x: 50, y: 222 };
  const Br = { x: Bl.x + 2 * s, y: Bl.y };
  const M = { x: Bl.x + s, y: Bl.y };
  const T = { x: M.x, y: Bl.y - Math.sqrt(3) * s };
  const k = 150;
  const Q = { x: 390, y: 222 };
  const R1 = { x: Q.x + k, y: Q.y };
  const U = { x: Q.x, y: Q.y - k };
  const a30 = polar(T, 42, rad(285));
  const a60 = polar(Br, 38, rad(150));
  const a45r = polar(R1, 40, rad(157.5));
  const a45u = polar(U, 42, rad(292.5));
  return (
    <Svg width={W} height={H}>
      <FracLabel x={M.x} y={22} className="dg-text-accent">
        half an equilateral triangle
      </FracLabel>
      <path d={`M${Bl.x},${Bl.y} L${T.x},${T.y} L${M.x},${M.y} Z`} className="dg-muted dg-dashed" />
      <path d={`M${M.x},${M.y} L${T.x},${T.y} L${Br.x},${Br.y} Z`} className="dg-fill-accent" />
      <path d={`M${M.x},${M.y} L${T.x},${T.y} L${Br.x},${Br.y} Z`} className="dg-line" />
      <RightAngle v={M} a={T} b={Br} s={12} />
      <path d={arcPath(T, 26, rad(270), rad(300))} className="dg-accent-2" />
      <path d={arcPath(Br, 24, rad(120), rad(180))} className="dg-accent-2" />
      <FracLabel x={a30.x + 2} y={a30.y + 4} anchor="start" className="dg-text-accent-2">
        30°
      </FracLabel>
      <FracLabel x={a60.x - 4} y={a60.y - 4} anchor="end" className="dg-text-accent-2">
        60°
      </FracLabel>
      <FracLabel x={(M.x + Br.x) / 2} y={M.y + 16} className="dg-text">
        1
      </FracLabel>
      <MathLabel x={M.x - 10} y={(M.y + T.y) / 2 + 22} anchor="end" w={60} h={30} tex={"\\sqrt{3}"} />
      <FracLabel x={(T.x + Br.x) / 2 + 12} y={(T.y + Br.y) / 2 - 6} anchor="start" className="dg-text">
        2
      </FracLabel>
      <FracLabel x={(Bl.x + T.x) / 2 - 12} y={(Bl.y + T.y) / 2 - 6} anchor="end" className="dg-text-muted">
        2
      </FracLabel>
      <FracLabel x={M.x} y={H - 18} className="dg-text-small">
        30° = π/6, 60° = π/3
      </FracLabel>

      <line x1={330} y1={12} x2={330} y2={H - 10} className="dg-grid" />

      <FracLabel x={(Q.x + R1.x) / 2} y={22} className="dg-text-accent">
        half a square
      </FracLabel>
      <path d={`M${U.x},${U.y} L${R1.x},${R1.y}`} className="dg-muted dg-dashed" />
      <path d={`M${U.x},${U.y} L${U.x + k},${U.y} L${R1.x},${R1.y}`} className="dg-muted dg-dashed" />
      <path d={`M${Q.x},${Q.y} L${U.x},${U.y} L${R1.x},${R1.y} Z`} className="dg-fill-accent" />
      <path d={`M${Q.x},${Q.y} L${U.x},${U.y} L${R1.x},${R1.y} Z`} className="dg-line" />
      <RightAngle v={Q} a={U} b={R1} s={12} />
      <path d={arcPath(R1, 24, rad(135), rad(180))} className="dg-accent-2" />
      <path d={arcPath(U, 26, rad(270), rad(315))} className="dg-accent-2" />
      <FracLabel x={a45r.x - 6} y={a45r.y - 4} anchor="end" className="dg-text-accent-2">
        45°
      </FracLabel>
      <FracLabel x={a45u.x + 2} y={a45u.y + 6} anchor="start" className="dg-text-accent-2">
        45°
      </FracLabel>
      <FracLabel x={(Q.x + R1.x) / 2} y={Q.y + 16} className="dg-text">
        1
      </FracLabel>
      <FracLabel x={Q.x - 10} y={(Q.y + U.y) / 2} anchor="end" className="dg-text">
        1
      </FracLabel>
      <MathLabel x={(U.x + R1.x) / 2 + 10} y={(U.y + R1.y) / 2 - 10} anchor="start" w={60} h={30} tex={"\\sqrt{2}"} />
      <FracLabel x={(Q.x + R1.x) / 2} y={H - 18} className="dg-text-small">
        45° = π/4
      </FracLabel>
    </Svg>
  );
}
