/**
 * One radian: the angle at the centre O subtended by an arc AB whose length
 * equals the radius r. Drawn to scale (angle AOB = 1 rad ≈ 57.3°).
 */
import { Label, Svg } from '../primitives';
import { arcPath, polar, sectorPath } from './p1-trigonometry-kit';

export const diagramKey = 'circular-measure-radian-definition';

const W = 590;
const H = 290;
const O = { x: 170, y: 160 };
const R = 115;

export default function CircularMeasureRadianDefinition() {
  const A = polar(O, R, 0);
  const B = polar(O, R, 1);
  const rA = polar(O, R / 2, 0);
  const rB = polar(O, R / 2, 1);
  const arcLbl = polar(O, R + 20, 0.5);
  const angLbl = polar(O, 46, 0.5);
  return (
    <Svg width={W} height={H}>
      <circle cx={O.x} cy={O.y} r={R} className="dg-thin" />
      <path d={sectorPath(O, R, 0, 1)} className="dg-fill-accent" />
      <line x1={O.x} y1={O.y} x2={A.x} y2={A.y} className="dg-line" />
      <line x1={O.x} y1={O.y} x2={B.x} y2={B.y} className="dg-line" />
      <path d={arcPath(O, R, 0, 1)} className="dg-accent" style={{ strokeWidth: 4 }} />
      <path d={arcPath(O, 26, 0, 1)} className="dg-accent-2" />
      <circle cx={O.x} cy={O.y} r={3.5} className="dg-dot" />
      <circle cx={A.x} cy={A.y} r={3.5} className="dg-dot" />
      <circle cx={B.x} cy={B.y} r={3.5} className="dg-dot" />
      <Label x={O.x - 10} y={O.y + 4} anchor="end" className="dg-text dg-italic">
        O
      </Label>
      <Label x={A.x + 10} y={A.y + 2} anchor="start" className="dg-text dg-italic">
        A
      </Label>
      <Label x={B.x + 6} y={B.y - 12} anchor="start" className="dg-text dg-italic">
        B
      </Label>
      <Label x={rA.x} y={rA.y + 15} className="dg-text dg-italic">
        r
      </Label>
      <Label x={rB.x - 12} y={rB.y - 6} className="dg-text dg-italic">
        r
      </Label>
      <Label x={arcLbl.x + 4} y={arcLbl.y} anchor="start" className="dg-text-accent">
        arc AB = r
      </Label>
      <Label x={angLbl.x + 4} y={angLbl.y + 2} anchor="start" className="dg-text-accent-2">
        1 rad
      </Label>

      <g>
        <Label x={478} y={72} className="dg-text dg-bold">
          1 radian
        </Label>
        <Label x={478} y={96} className="dg-text-small">
          the angle at the centre when
        </Label>
        <Label x={478} y={114} className="dg-text-small">
          the arc is as long as the radius
        </Label>
        <Label x={478} y={160} className="dg-text-accent-2">
          1 rad ≈ 57.3°
        </Label>
        <Label x={478} y={196} className="dg-text-small">
          a full turn fits 2π ≈ 6.28
        </Label>
        <Label x={478} y={214} className="dg-text-small">
          radius-lengths of arc
        </Label>
        <Label x={478} y={242} className="dg-text-accent">
          2π rad = 360°
        </Label>
      </g>
    </Svg>
  );
}
