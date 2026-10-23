/**
 * A sector OAB with angle θ = 1.2 rad (to scale), split by the chord AB into the
 * isosceles triangle OAB and the minor segment. The perpendicular from O meets AB
 * at its midpoint M, so AM = MB = r sin(θ/2) and AB = 2r sin(θ/2).
 */
import { FracLabel, Svg, MathLabel } from '../primitives';
import { RightAngle, arcPath, polar } from './p1-trigonometry-kit';

export const diagramKey = 'circular-measure-segment';

const W = 620;
const H = 290;
const O = { x: 215, y: 270 };
const R = 205;
const T = 1.2;

export default function CircularMeasureSegment() {
  const aB = Math.PI / 2 - T / 2;
  const aA = Math.PI / 2 + T / 2;
  const A = polar(O, R, aA);
  const B = polar(O, R, aB);
  const M = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const seg = `${arcPath(O, R, aB, aA)} Z`;
  const rA = polar(O, R * 0.5, aA);
  const rB = polar(O, R * 0.5, aB);
  // θ/2 is a stacked fraction, so it sits further out along the bisector, where the angle is wide enough for it.
  const half = polar(O, 72, (aB + Math.PI / 2) / 2);
  return (
    <Svg width={W} height={H}>
      <path d={`M${O.x},${O.y} L${A.x},${A.y} L${B.x},${B.y} Z`} className="dg-fill-muted" />
      <path d={seg} className="dg-fill-accent" />
      <path d={arcPath(O, R, aB, aA)} className="dg-accent" />
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="dg-line" />
      <line x1={O.x} y1={O.y} x2={A.x} y2={A.y} className="dg-line" />
      <line x1={O.x} y1={O.y} x2={B.x} y2={B.y} className="dg-line" />
      <line x1={O.x} y1={O.y} x2={M.x} y2={M.y} className="dg-muted dg-dashed" />
      <RightAngle v={M} a={O} b={B} s={10} />
      <path d={arcPath(O, 30, aB, Math.PI / 2)} className="dg-accent-2" />
      <circle cx={O.x} cy={O.y} r={3.5} className="dg-dot" />
      <circle cx={M.x} cy={M.y} r={3} className="dg-dot" />
      <FracLabel x={O.x} y={O.y + 14} className="dg-text dg-italic">
        O
      </FracLabel>
      <FracLabel x={A.x - 10} y={A.y} anchor="end" className="dg-text dg-italic">
        A
      </FracLabel>
      <FracLabel x={B.x + 10} y={B.y} anchor="start" className="dg-text dg-italic">
        B
      </FracLabel>
      <FracLabel x={M.x - 12} y={M.y + 14} className="dg-text dg-italic">
        M
      </FracLabel>
      <FracLabel x={rA.x - 12} y={rA.y} anchor="end" className="dg-text dg-italic">
        r
      </FracLabel>
      <FracLabel x={rB.x + 12} y={rB.y} anchor="start" className="dg-text dg-italic">
        r
      </FracLabel>
      <FracLabel x={half.x} y={half.y} className="dg-text-accent-2">
        θ/2
      </FracLabel>
      <FracLabel x={(M.x + B.x) / 2} y={M.y + 15} className="dg-text-small">
        r sin(θ/2)
      </FracLabel>
      <FracLabel x={O.x} y={M.y - 16} className="dg-text-accent">
        segment
      </FracLabel>
      <FracLabel x={O.x - 44} y={140} className="dg-text-small">
        triangle OAB
      </FracLabel>

      <g>
        <FracLabel x={510} y={44} className="dg-text dg-bold">
          θ in radians
        </FracLabel>
        <MathLabel x={510} y={80} w={163} h={46} size="small" tex={"\\text{sector} = \\dfrac{1}{2} r^2\\theta"} />
        <MathLabel x={510} y={118} w={230} h={46} size="small" tex={"\\text{triangle} = \\dfrac{1}{2} r^2\\sin\\theta"} />
        <FracLabel x={510} y={154} className="dg-text-accent">
          segment
        </FracLabel>
        <MathLabel x={510} y={188} w={211} h={46} size="small" tex={"= \\dfrac{1}{2} r^2\\theta - \\dfrac{1}{2} r^2\\sin\\theta"} />
        <MathLabel x={510} y={226} w={192} h={46} size="small" tex={"= \\dfrac{1}{2} r^2(\\theta - \\sin\\theta)"} />
        <FracLabel x={510} y={264} className="dg-text-small">
          chord AB = 2r sin(θ/2)
        </FracLabel>
      </g>
    </Svg>
  );
}
