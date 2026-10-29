/**
 * Young's double slit: two slits separated by a, a screen a distance D away,
 * and a point P a distance x from the centre. For small angles the path
 * difference is about ax/D, and a bright fringe needs ax/D = lambda.
 */
import { Arrow, Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-interference-double-slit';

const W = 660;
const H = 360;
const SLIT_X = 120;
const SCREEN_X = 560;
const CENTRE_Y = 190;

const S1 = { x: SLIT_X, y: 172 };
const S2 = { x: SLIT_X, y: 208 };
const P = { x: SCREEN_X, y: 110 };

export function InterferenceDoubleSlit() {
  return (
    <Svg width={W} height={H}>
      <Label x={330} y={26} className="dg-text dg-bold">
        Double slit: path difference ≈ ax / D
      </Label>

      {/* barrier with two slits */}
      <line x1={SLIT_X} y1={70} x2={SLIT_X} y2={S1.y - 6} className="dg-line" strokeWidth={3} />
      <line x1={SLIT_X} y1={S1.y + 6} x2={SLIT_X} y2={S2.y - 6} className="dg-line" strokeWidth={3} />
      <line x1={SLIT_X} y1={S2.y + 6} x2={SLIT_X} y2={310} className="dg-line" strokeWidth={3} />

      {/* screen */}
      <line x1={SCREEN_X} y1={60} x2={SCREEN_X} y2={310} className="dg-line" />
      <Label x={SCREEN_X + 10} y={66} anchor="start" className="dg-text-small dg-text-muted">
        screen
      </Label>

      {/* rays */}
      <line x1={S1.x} y1={S1.y} x2={P.x} y2={P.y} className="dg-accent" />
      <line x1={S2.x} y1={S2.y} x2={P.x} y2={P.y} className="dg-accent" />

      <circle cx={S1.x} cy={S1.y} r={4.5} className="dg-dot-accent" />
      <circle cx={S2.x} cy={S2.y} r={4.5} className="dg-dot-accent" />
      <circle cx={P.x} cy={P.y} r={6} className="dg-dot" />
      <circle cx={SCREEN_X} cy={CENTRE_Y} r={4} className="dg-dot" />

      <Label x={100} y={S1.y - 12} anchor="end" className="dg-text-small dg-text-accent">
        S₁
      </Label>
      <Label x={100} y={S2.y + 16} anchor="end" className="dg-text-small dg-text-accent">
        S₂
      </Label>
      <Label x={P.x - 14} y={P.y - 12} anchor="end" className="dg-text-small dg-bold">
        P
      </Label>
      <Label x={SCREEN_X - 12} y={CENTRE_Y + 20} anchor="end" className="dg-text-small dg-text-muted">
        centre
      </Label>

      {/* a */}
      <Arrow x1={SLIT_X - 34} y1={S1.y} x2={SLIT_X - 34} y2={S2.y} double head={7} />
      <Label x={SLIT_X - 44} y={(S1.y + S2.y) / 2} anchor="end" className="dg-text-small dg-text-muted">
        a
      </Label>

      {/* x */}
      <Arrow x1={SCREEN_X + 34} y1={CENTRE_Y} x2={SCREEN_X + 34} y2={P.y} double head={7} />
      <Label x={SCREEN_X + 44} y={(CENTRE_Y + P.y) / 2} anchor="start" className="dg-text-small dg-text-muted">
        x
      </Label>

      {/* D */}
      <Arrow x1={SLIT_X} y1={340} x2={SCREEN_X} y2={340} double head={8} />
      <Label x={(SLIT_X + SCREEN_X) / 2} y={322} className="dg-text-small dg-text-muted">
        D
      </Label>

      <MathLabel x={330} y={86} tex="\text{path difference}\approx\dfrac{ax}{D}" w={230} h={44} tone="muted" />
      <MathLabel x={300} y={262} tex="\lambda=\dfrac{ax}{D}" w={150} h={44} tone="accent" />
    </Svg>
  );
}

export default InterferenceDoubleSlit;
