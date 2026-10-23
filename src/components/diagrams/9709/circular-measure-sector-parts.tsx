/**
 * A sector of a circle, radius r and angle θ = 1.2 rad (drawn to scale), inside
 * the full circle. The arc length is s = rθ and the shaded area is A = ½r²θ,
 * both found as the fraction θ / 2π of the whole circle.
 */
import { Label, Svg, MathLabel } from '../primitives';
import { arcPath, polar, sectorPath } from './p1-trigonometry-kit';

export const diagramKey = 'circular-measure-sector-parts';

const W = 620;
const H = 290;
const O = { x: 160, y: 158 };
const R = 122;
const A0 = 0.2;
const A1 = 1.4;

export default function CircularMeasureSectorParts() {
  const P = polar(O, R, A0);
  const Q = polar(O, R, A1);
  const rP = polar(O, R * 0.55, A0);
  const rQ = polar(O, R * 0.55, A1);
  const sLbl = polar(O, R + 16, (A0 + A1) / 2);
  const aLbl = polar(O, R * 0.66, (A0 + A1) / 2);
  const tLbl = polar(O, 38, (A0 + A1) / 2);
  return (
    <Svg width={W} height={H}>
      <circle cx={O.x} cy={O.y} r={R} className="dg-muted dg-dashed" />
      <path d={sectorPath(O, R, A0, A1)} className="dg-fill-accent" />
      <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} className="dg-line" />
      <line x1={O.x} y1={O.y} x2={Q.x} y2={Q.y} className="dg-line" />
      <path d={arcPath(O, R, A0, A1)} className="dg-accent" style={{ strokeWidth: 4 }} />
      <path d={arcPath(O, 24, A0, A1)} className="dg-accent-2" />
      <circle cx={O.x} cy={O.y} r={3.5} className="dg-dot" />
      <Label x={O.x - 10} y={O.y + 6} anchor="end" className="dg-text dg-italic">
        O
      </Label>
      <Label x={rP.x + 4} y={rP.y + 14} className="dg-text dg-italic">
        r
      </Label>
      <Label x={rQ.x - 13} y={rQ.y} className="dg-text dg-italic">
        r
      </Label>
      <Label x={tLbl.x + 2} y={tLbl.y} className="dg-text-accent-2">
        θ
      </Label>
      <Label x={sLbl.x + 4} y={sLbl.y - 6} anchor="start" className="dg-text-accent">
        s = rθ
      </Label>
      <Label x={aLbl.x + 4} y={aLbl.y + 4} className="dg-text dg-bold">
        A
      </Label>

      <g>
        <Label x={460} y={40} className="dg-text dg-bold">
          θ in radians
        </Label>
        <Label x={460} y={70} className="dg-text-small">
          fraction of the circle = θ ÷ 2π
        </Label>
        <Label x={460} y={112} className="dg-text-accent">
          arc length
        </Label>
        <Label x={460} y={134} className="dg-text-small">
          (θ ÷ 2π) × 2πr = rθ
        </Label>
        <Label x={460} y={176} className="dg-text dg-bold">
          sector area
        </Label>
        <MathLabel x={460} y={198} w={239} h={46} size="small" tex={"\\dfrac{\\theta}{2\\pi} \\times \\pi r^2 = \\dfrac{1}{2} r^2\\theta"} />
        <Label x={460} y={240} className="dg-text-small">
          perimeter of sector = 2r + rθ
        </Label>
      </g>
    </Svg>
  );
}
