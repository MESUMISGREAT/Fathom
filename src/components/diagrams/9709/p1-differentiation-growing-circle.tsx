/**
 * Why dA/dr = 2πr: a circle of radius r grows by a thin ring. The ring is
 * almost a long thin strip, circumference × width, so the extra area is about
 * 2πr × the extra radius. No extra notation (no δ): this is for first-timers.
 * With time involved, dA/dt = dA/dr × dr/dt.
 */
import { Arrow, Label, Svg, MathLabel } from '../primitives';

export const diagramKey = 'p1-differentiation-growing-circle';

const W = 600;
const H = 326;
const CX = 150;
const CY = 150;
const R = 100;
const DR = 22;

export default function P1DifferentiationGrowingCircle() {
  const ring =
    `M${CX + R + DR},${CY} A${R + DR},${R + DR} 0 1 0 ${CX - R - DR},${CY} A${R + DR},${R + DR} 0 1 0 ${CX + R + DR},${CY} Z ` +
    `M${CX + R},${CY} A${R},${R} 0 1 1 ${CX - R},${CY} A${R},${R} 0 1 1 ${CX + R},${CY} Z`;
  return (
    <Svg width={W} height={H}>
      <path d={ring} className="dg-fill-accent-2" fillRule="evenodd" />
      <circle cx={CX} cy={CY} r={R} className="dg-accent dg-fill-accent" />
      <circle cx={CX} cy={CY} r={R + DR} className="dg-accent-2 dg-dashed" />
      <circle cx={CX} cy={CY} r={3} className="dg-dot" />

      {/* radius and ring width */}
      <line x1={CX} y1={CY} x2={CX + R} y2={CY} className="dg-line" />
      <Label x={CX + R / 2} y={CY - 12} className="dg-text dg-italic">
        r
      </Label>
      <Arrow x1={CX + R} y1={CY + 18} x2={CX + R + DR} y2={CY + 18} head={6} double className="dg-thin" />
      <Label x={CX} y={CY + 40} className="dg-text-accent">
        area A = πr²
      </Label>

      {/* explanation */}
      <Label x={316} y={60} anchor="start" className="dg-text-accent-2">
        the new ring
      </Label>
      <Label x={316} y={86} anchor="start" className="dg-text">
        ≈ a strip 2πr long, very thin
      </Label>
      <Label x={316} y={116} anchor="start" className="dg-text">
        extra area ≈ 2πr × extra radius
      </Label>
      <Label x={316} y={146} anchor="start" className="dg-text">
        so A grows 2πr times as fast as r:
      </Label>
      <MathLabel x={316} y={192} anchor="start" w={334} h={46} tex={"\\dfrac{dA}{dr} = 2\\pi r\\ \\text{(the circumference)}"} />
      <line x1={316} y1={236} x2={W - 20} y2={236} className="dg-grid" />
      <Label x={316} y={260} anchor="start" className="dg-text">
        If r grows with time t:
      </Label>
      <MathLabel x={316} y={292} anchor="start" w={239} h={46} tone="accent-2" tex={"\\dfrac{dA}{dt} = \\dfrac{dA}{dr} \\times \\dfrac{dr}{dt}"} />
    </Svg>
  );
}
