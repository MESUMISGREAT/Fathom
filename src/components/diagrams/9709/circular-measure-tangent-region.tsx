/**
 * Circle centre O, radius 5 cm, and a point T with OT = 13 cm (drawn to scale,
 * 24 px per cm). The tangent from T touches the circle at A, so angle OAT = 90°.
 * OT cuts the circle at B. The shaded region is bounded by AT, TB and the arc AB,
 * and its area is triangle OAT − sector OAB.
 */
import { Arrow, Label, Svg } from '../primitives';
import { RightAngle, arcPath, polar } from './p1-trigonometry-kit';

export const diagramKey = 'circular-measure-tangent-region';

const W = 560;
const H = 330;
const S = 24;
const O = { x: 140, y: 200 };
const R = 5 * S;
const T = { x: O.x + 13 * S, y: O.y };
const ALPHA = Math.acos(5 / 13);

export default function CircularMeasureTangentRegion() {
  const A = polar(O, R, ALPHA);
  const B = polar(O, R, 0);
  const region = `M${B.x},${B.y} A${R},${R} 0 0 0 ${A.x.toFixed(2)},${A.y.toFixed(2)} L${T.x},${T.y} Z`;
  const mOA = polar(O, R / 2, ALPHA);
  const ang = polar(O, 40, ALPHA / 2);
  return (
    <Svg width={W} height={H}>
      <circle cx={O.x} cy={O.y} r={R} className="dg-thin" />
      <path d={region} className="dg-fill-accent" />
      <path d={`M${A.x},${A.y} L${T.x},${T.y} L${B.x},${B.y}`} className="dg-accent" />
      <path d={arcPath(O, R, 0, ALPHA)} className="dg-accent" />
      <line x1={O.x} y1={O.y} x2={A.x} y2={A.y} className="dg-line" />
      <line x1={O.x} y1={O.y} x2={B.x} y2={B.y} className="dg-line" />
      <RightAngle v={A} a={O} b={T} s={11} />
      <path d={arcPath(O, 26, 0, ALPHA)} className="dg-accent-2" />
      {[O, A, B, T].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} className="dg-dot" />
      ))}
      <Label x={O.x - 8} y={O.y + 15} className="dg-text dg-italic">
        O
      </Label>
      <Label x={A.x + 2} y={A.y - 16} className="dg-text dg-italic">
        A
      </Label>
      <Label x={B.x + 6} y={B.y + 16} className="dg-text dg-italic">
        B
      </Label>
      <Label x={T.x + 12} y={T.y} anchor="start" className="dg-text dg-italic">
        T
      </Label>
      <Label x={mOA.x - 10} y={mOA.y} anchor="end" className="dg-text-small">
        5 cm
      </Label>
      <Label x={ang.x + 6} y={ang.y - 2} anchor="start" className="dg-text-accent-2">
        θ
      </Label>
      {/* Dimension line for the whole of OT (not just TB), below the figure. */}
      <line x1={O.x} y1={O.y + 8} x2={O.x} y2={O.y + 36} className="dg-thin" />
      <line x1={T.x} y1={T.y + 8} x2={T.x} y2={T.y + 36} className="dg-thin" />
      <Arrow x1={O.x} y1={O.y + 30} x2={T.x} y2={T.y + 30} head={7} double className="dg-thin" />
      <Label x={(B.x + T.x) / 2} y={O.y + 44} className="dg-text-small">
        OT = 13 cm
      </Label>
      <Label x={(A.x + T.x) / 2 + 14} y={(A.y + T.y) / 2 - 14} anchor="start" className="dg-text-small">
        tangent at A
      </Label>

      <g>
        <Label x={440} y={44} className="dg-text-accent">
          shaded region
        </Label>
        <Label x={440} y={66} className="dg-text-small">
          = triangle OAT − sector OAB
        </Label>
        <Label x={440} y={94} className="dg-text-small">
          angle OAT = 90°
        </Label>
        <Label x={440} y={112} className="dg-text-small">
          (tangent ⟂ radius)
        </Label>
      </g>
    </Svg>
  );
}
