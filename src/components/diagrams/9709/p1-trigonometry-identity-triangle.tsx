/**
 * Quarter of the unit circle with P = (cos θ, sin θ) at θ = 40°. The right-angled
 * triangle ONP has hypotenuse OP = 1, base ON = cos θ and height NP = sin θ, so
 * Pythagoras gives cos²θ + sin²θ = 1, and the gradient of OP is sin θ ÷ cos θ = tan θ.
 */
import { Arrow, Label, Svg } from '../primitives';
import { RightAngle, arcPath, polar, rad } from './p1-trigonometry-kit';

export const diagramKey = 'p1-trigonometry-identity-triangle';

const W = 620;
const H = 330;
const O = { x: 60, y: 292 };
const R = 250;
const TH = 40;

export default function P1TrigonometryIdentityTriangle() {
  const P = polar(O, R, rad(TH));
  const N = { x: P.x, y: O.y };
  const mid = polar(O, R / 2, rad(TH));
  const th = polar(O, 44, rad(TH / 2));
  return (
    <Svg width={W} height={H}>
      <Arrow x1={O.x - 10} y1={O.y} x2={O.x + R + 40} y2={O.y} className="dg-thin" head={8} />
      <Arrow x1={O.x} y1={O.y + 10} x2={O.x} y2={O.y - R - 24} className="dg-thin" head={8} />
      <Label x={O.x + R + 44} y={O.y + 14} className="dg-text dg-italic">
        x
      </Label>
      <Label x={O.x - 12} y={O.y - R - 22} className="dg-text dg-italic">
        y
      </Label>
      <path d={arcPath(O, R, 0, Math.PI / 2)} className="dg-thin" />
      <path d={`M${O.x},${O.y} L${N.x},${N.y} L${P.x},${P.y} Z`} className="dg-fill-accent" />
      <line x1={O.x} y1={O.y} x2={N.x} y2={N.y} className="dg-accent-2" />
      <line x1={N.x} y1={N.y} x2={P.x} y2={P.y} className="dg-accent-2" />
      <line x1={O.x} y1={O.y} x2={P.x} y2={P.y} className="dg-line" />
      <RightAngle v={N} a={O} b={P} s={12} />
      <path d={arcPath(O, 30, 0, rad(TH))} className="dg-accent" />
      <circle cx={P.x} cy={P.y} r={4.5} className="dg-dot-accent" />
      <Label x={O.x - 10} y={O.y + 14} className="dg-text-small">
        O
      </Label>
      <Label x={N.x} y={N.y + 16} className="dg-text dg-italic">
        N
      </Label>
      <Label x={P.x + 10} y={P.y - 12} anchor="start" className="dg-text dg-italic">
        P(cos θ, sin θ)
      </Label>
      <Label x={mid.x - 8} y={mid.y - 12} anchor="end" className="dg-text">
        1
      </Label>
      <Label x={th.x + 4} y={th.y} anchor="start" className="dg-text-accent">
        θ
      </Label>
      <Label x={(O.x + N.x) / 2 + 20} y={O.y - 14} className="dg-text-accent-2">
        cos θ
      </Label>
      <Label x={N.x + 8} y={(N.y + P.y) / 2} anchor="start" className="dg-text-accent-2">
        sin θ
      </Label>

      <g>
        <Label x={500} y={60} className="dg-text dg-bold">
          Pythagoras in ONP
        </Label>
        <Label x={500} y={84} className="dg-text-accent">
          cos²θ + sin²θ = 1
        </Label>
        <Label x={500} y={132} className="dg-text dg-bold">
          gradient of OP
        </Label>
        <Label x={500} y={156} className="dg-text-accent">
          tan θ = sin θ ÷ cos θ
        </Label>
      </g>
    </Svg>
  );
}
