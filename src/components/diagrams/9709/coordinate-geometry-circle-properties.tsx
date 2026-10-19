/**
 * Three circle facts used in coordinate geometry, one per panel:
 * 1. The tangent at P is perpendicular to the radius OP.
 * 2. If AB is a diameter and P is on the circle, angle APB is a right angle.
 * 3. The perpendicular bisector of a chord AB passes through the centre O
 *    (the line from O to the midpoint M is perpendicular to AB).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'coordinate-geometry-circle-properties';

const PW = 210;
const W = PW * 3;
const H = 282;
const O = { x: PW / 2, y: 160 };
const R = 70;
const at = (deg: number) => ({ x: O.x + R * Math.cos((deg * Math.PI) / 180), y: O.y - R * Math.sin((deg * Math.PI) / 180) });
type Pt = { x: number; y: number };
const unit = (a: Pt, b: Pt) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return { x: (b.x - a.x) / d, y: (b.y - a.y) / d };
};
/** Right-angle mark at corner V between directions towards A and B. */
function RightAngle({ v, a, b, s = 11 }: { v: Pt; a: Pt; b: Pt; s?: number }) {
  const u = unit(v, a);
  const w = unit(v, b);
  return (
    <path
      d={`M${v.x + s * u.x},${v.y + s * u.y} L${v.x + s * (u.x + w.x)},${v.y + s * (u.y + w.y)} L${v.x + s * w.x},${v.y + s * w.y}`}
      className="dg-thin"
    />
  );
}
function Tick({ a, b }: { a: Pt; b: Pt }) {
  const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const u = unit(a, b);
  return <line x1={m.x - 6 * u.y} y1={m.y + 6 * u.x} x2={m.x + 6 * u.y} y2={m.y - 6 * u.x} className="dg-line" />;
}

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <Label x={PW / 2} y={22} className="dg-text-accent">
        {title}
      </Label>
      <Label x={PW / 2} y={42} className="dg-text-small">
        {sub}
      </Label>
    </>
  );
}

export default function CoordinateGeometryCircleProperties() {
  // panel 1
  const P1 = at(40);
  const u = unit(O, P1);
  const t = { x: -u.y, y: u.x };
  // panel 2
  const A2 = at(180);
  const B2 = at(0);
  const P2 = at(62);
  // panel 3
  const A3 = at(205);
  const B3 = at(335);
  const M3 = { x: (A3.x + B3.x) / 2, y: (A3.y + B3.y) / 2 };
  return (
    <Svg width={W} height={H}>
      {/* 1: tangent and radius */}
      <g>
        <Heading title="tangent ⟂ radius" sub="at the point of contact" />
        <circle cx={O.x} cy={O.y} r={R} className="dg-thin" />
        <line x1={O.x} y1={O.y} x2={P1.x} y2={P1.y} className="dg-accent" />
        <line x1={P1.x - 78 * t.x} y1={P1.y - 78 * t.y} x2={P1.x + 62 * t.x} y2={P1.y + 62 * t.y} className="dg-accent-2" />
        <RightAngle v={P1} a={O} b={{ x: P1.x - t.x, y: P1.y - t.y }} />
        <circle cx={O.x} cy={O.y} r={4} className="dg-dot" />
        <circle cx={P1.x} cy={P1.y} r={4} className="dg-dot" />
        <Label x={O.x - 8} y={O.y + 12} anchor="end" className="dg-text dg-italic">
          O
        </Label>
        <Label x={P1.x + 12} y={P1.y + 8} anchor="start" className="dg-text dg-italic">
          P
        </Label>
        <Label x={PW / 2} y={H - 14} className="dg-text-small">
          {'gradients multiply to −1'}
        </Label>
      </g>

      {/* 2: angle in a semicircle */}
      <g transform={`translate(${PW}, 0)`}>
        <line x1={0} y1={10} x2={0} y2={H - 10} className="dg-grid" />
        <Heading title="angle in a semicircle" sub="AB a diameter ⇒ angle APB = 90°" />
        <circle cx={O.x} cy={O.y} r={R} className="dg-thin" />
        <polygon points={`${A2.x},${A2.y} ${P2.x},${P2.y} ${B2.x},${B2.y}`} className="dg-fill-accent" />
        <line x1={A2.x} y1={A2.y} x2={B2.x} y2={B2.y} className="dg-line" />
        <line x1={A2.x} y1={A2.y} x2={P2.x} y2={P2.y} className="dg-accent" />
        <line x1={B2.x} y1={B2.y} x2={P2.x} y2={P2.y} className="dg-accent" />
        <RightAngle v={P2} a={A2} b={B2} />
        <circle cx={O.x} cy={O.y} r={3.5} className="dg-dot" />
        <Label x={A2.x - 8} y={A2.y} anchor="end" className="dg-text dg-italic">
          A
        </Label>
        <Label x={B2.x + 8} y={B2.y} anchor="start" className="dg-text dg-italic">
          B
        </Label>
        <Label x={P2.x + 4} y={P2.y - 12} anchor="start" className="dg-text dg-italic">
          P
        </Label>
        <Label x={O.x} y={O.y + 14} className="dg-text-small dg-italic">
          O
        </Label>
        <Label x={PW / 2} y={H - 14} className="dg-text-small">
          {'AP ⟂ BP'}
        </Label>
      </g>

      {/* 3: perpendicular bisector of a chord */}
      <g transform={`translate(${2 * PW}, 0)`}>
        <line x1={0} y1={10} x2={0} y2={H - 10} className="dg-grid" />
        <Heading title="bisector of a chord" sub="passes through the centre" />
        <circle cx={O.x} cy={O.y} r={R} className="dg-thin" />
        <line x1={A3.x} y1={A3.y} x2={B3.x} y2={B3.y} className="dg-accent" />
        <line x1={O.x} y1={O.y - R - 8} x2={O.x} y2={O.y + R + 8} className="dg-accent-2 dg-dashed" />
        <RightAngle v={M3} a={B3} b={O} s={9} />
        <Tick a={A3} b={M3} />
        <Tick a={M3} b={B3} />
        <circle cx={O.x} cy={O.y} r={4} className="dg-dot" />
        <circle cx={M3.x} cy={M3.y} r={3.5} className="dg-dot-accent-2" />
        <Label x={O.x + 8} y={O.y - 6} anchor="start" className="dg-text dg-italic">
          O
        </Label>
        <Label x={A3.x - 8} y={A3.y + 4} anchor="end" className="dg-text dg-italic">
          A
        </Label>
        <Label x={B3.x + 8} y={B3.y + 4} anchor="start" className="dg-text dg-italic">
          B
        </Label>
        <Label x={M3.x - 8} y={M3.y + 14} anchor="end" className="dg-text dg-italic">
          M
        </Label>
        <Label x={PW / 2} y={H - 14} className="dg-text-small">
          {'AM = MB and OM ⟂ AB'}
        </Label>
      </g>
    </Svg>
  );
}
