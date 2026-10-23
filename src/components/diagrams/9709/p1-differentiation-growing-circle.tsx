/**
 * Why dA/dr = 2πr: a circle of radius r grows by a thin ring of width δr.
 * The ring is almost a long thin strip, circumference × width, so
 * δA ≈ 2πr × δr and δA/δr → 2πr. With time involved, dA/dt = dA/dr × dr/dt.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'p1-differentiation-growing-circle';

const W = 600;
const H = 300;
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
      <Label x={CX + R + DR + 10} y={CY + 19} anchor="start" className="dg-text-small dg-italic">
        δr
      </Label>
      <Label x={CX} y={CY + 40} className="dg-text-accent">
        area A = πr²
      </Label>

      {/* explanation */}
      <Label x={316} y={60} anchor="start" className="dg-text-accent-2">
        the new ring
      </Label>
      <Label x={316} y={86} anchor="start" className="dg-text">
        ≈ a strip 2πr long, δr wide
      </Label>
      <Label x={316} y={116} anchor="start" className="dg-text">
        so δA ≈ 2πr × δr
      </Label>
      <Label x={316} y={146} anchor="start" className="dg-text">
        and δA ⁄ δr ≈ 2πr
      </Label>
      <Label x={316} y={176} anchor="start" className="dg-text dg-bold">
        dA/dr = 2πr (the circumference)
      </Label>
      <line x1={316} y1={200} x2={W - 20} y2={200} className="dg-grid" />
      <Label x={316} y={226} anchor="start" className="dg-text">
        If r grows with time t:
      </Label>
      <Label x={316} y={252} anchor="start" className="dg-text-accent-2">
        dA/dt = dA/dr × dr/dt
      </Label>
    </Svg>
  );
}
