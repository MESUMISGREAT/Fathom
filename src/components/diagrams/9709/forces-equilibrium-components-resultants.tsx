/**
 * Resolving a force into perpendicular components and finding the resultant of forces.
 * Top: force P at angle θ resolved into P cos θ (horizontal) and P sin θ (vertical).
 * Bottom: two forces combined component-wise to find resultant.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'forces-equilibrium-components-resultants';

const W = 660;
const H = 480;

export function ForcesEquilibriumComponentsResultants() {
  {/* Force P at angle theta */}
  const CX1 = 180;
  const CY1 = 160;
  const P = 90;
  const angle = 30; // degrees
  const rad = (angle * Math.PI) / 180;
  const hx = P * Math.cos(rad);
  const hy = P * Math.sin(rad);

  {/* Resultant forces */}
  const CX2 = 180;
  const CY2 = 350;

  return (
    <Svg width={W} height={H}>
      <Label x={330} y={30} className="dg-text dg-bold">
        Resolving a force into perpendicular components
      </Label>

      {/* Horizontal component arrow */}
      <Arrow x1={CX1} y1={CY1} x2={CX1 + hx} y2={CY1} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={CX1 + hx / 2} y={CY1 - 18} tex="P\\cos\\theta" w={80} h={32} tone="accent" />

      {/* Vertical component arrow */}
      <Arrow x1={CX1 + hx} y1={CY1} x2={CX1 + hx} y2={CY1 - hy} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={CX1 + hx + 18} y={CY1 - hy / 2} tex="P\\sin\\theta" w={80} h={32} anchor="start" tone="accent-2" />

      {/* Original force arrow */}
      <Arrow x1={CX1} y1={CY1} x2={CX1 + hx} y2={CY1 - hy} className="dg-line" headClassName="dg-dot" />
      <MathLabel x={CX1 - 15} y={CY1 - hy / 2 - 10} tex="P" w={30} h={32} anchor="end" />

      {/* Angle arc */}
      <path
        d={`M${CX1 + 15},${CY1} A15,15 0 0,1 ${CX1 + 15 * Math.cos(rad)},${CY1 - 15 * Math.sin(rad)}`}
        className="dg-thin dg-muted"
      />
      <MathLabel x={CX1 + 28} y={CY1 - 8} tex="\\theta" w={30} h={32} tone="muted" size="small" />

      <Label x={CX1} y={CY1 + 30} className="dg-text-small dg-text-muted">
        Force P at angle θ above horizontal
      </Label>

      {/* Right triangle annotation */}
      <Label x={500} y={100} anchor="start" className="dg-text dg-bold">
        Components from the angle
      </Label>
      <Label x={500} y={128} anchor="start" className="dg-text-small">
        Angle measured from horizontal:
      </Label>
      <MathLabel x={500} y={155} anchor="start" tex="P_{\\text{horiz}} = P\\cos\\theta" w={140} h={32} tone="accent" />
      <Label x={500} y={160} anchor="start" className="dg-text-small dg-text-muted">
        adjacent side = cosine
      </Label>
      <MathLabel x={500} y={185} anchor="start" tex="P_{\\text{vert}} = P\\sin\\theta" w={140} h={32} tone="accent-2" />
      <Label x={500} y={190} anchor="start" className="dg-text-small dg-text-muted">
        opposite side = sine
      </Label>

      <line x1={40} y1={210} x2={620} y2={210} className="dg-grid" />

      {/* Resultant of multiple forces */}
      <Label x={330} y={240} className="dg-text dg-bold">
        Adding forces component by component to find the resultant
      </Label>

      const CX2 = 180;
      const CY2 = 350;

      {/* Force 1: 12 N right */}
      <Arrow x1={CX2} y1={CY2} x2={CX2 + 80} y2={CY2} className="dg-accent" headClassName="dg-dot-accent" />
      <MathLabel x={CX2 + 40} y={CY2 - 18} tex="12\\text{ N}" w={60} h={32} tone="accent" />
      <Label x={CX2 + 40} y={CY2 - 38} className="dg-text-small dg-text-muted">F₁</Label>

      {/* Force 2: 5 N up */}
      <Arrow x1={CX2} y1={CY2} x2={CX2} y2={CY2 - 60} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <MathLabel x={CX2 - 30} y={CY2 - 30} tex="5\\text{ N}" w={60} h={32} anchor="end" tone="accent-2" />
      <Label x={CX2 - 40} y={CY2 - 30} className="dg-text-small dg-text-muted">F₂</Label>

      {/* Resultant */}
      <Arrow x1={CX2} y1={CY2} x2={CX2 + 80} y2={CY2 - 60} className="dg-line dg-dashed" headClassName="dg-dot" />
      <MathLabel x={CX2 + 30} y={CY2 - 55} tex="\\mathbf{R}" w={60} h={32} tone="muted" />
      <Label x={CX2 + 30} y={CY2 - 75} className="dg-text-small dg-text-muted">resultant</Label>

      {/* Calculation box */}
      <Label x={460} y={300} anchor="start" className="dg-text dg-bold">
        Component sum
      </Label>
      <MathLabel x={460} y={330} anchor="start" tex="X = 12 + 0 = 12\\text{ N}" w={160} h={32} tone="muted" />
      <MathLabel x={460} y={360} anchor="start" tex="Y = 0 + 5 = 5\\text{ N}" w={160} h={32} tone="muted" />
      <MathLabel x={460} y={390} anchor="start" tex="|\\mathbf{R}| = \\sqrt{12^2 + 5^2} = 13\\text{ N}" w={200} h={32} tone="accent" />
      <MathLabel x={460} y={420} anchor="start" tex="\\theta = \\tan^{-1}(5/12) \\approx 22.6^{\\circ}" w={200} h={32} tone="accent-2" />

      <Label x={330} y={460} className="dg-text-small dg-text-muted">
        Add horizontal components for X, vertical for Y.
      </Label>
      <MathLabel x={330} y={475} tex="|\\mathbf{R}| = \\sqrt{X^2 + Y^2}" w={200} h={32} tone="muted" size="small" />
      <MathLabel x={330} y={495} tex="\\theta = \\tan^{-1}(Y/X)" w={200} h={32} tone="muted" size="small" />
    </Svg>
  );
}

export default ForcesEquilibriumComponentsResultants;