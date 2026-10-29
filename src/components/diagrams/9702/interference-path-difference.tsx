/**
 * Two coherent sources S1 and S2 send waves to P. The distances are 5.0 and
 * 4.5 wavelengths, so the path difference is 0.5 wavelength: the waves arrive
 * in antiphase and P is a minimum (dark fringe).
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-interference-path-difference';

const W = 640;
const H = 390;

const S1 = { x: 170, y: 300 };
const S2 = { x: 300, y: 300 };
const P = { x: 470, y: 90 };

export function InterferencePathDifference() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={26} className="dg-text dg-bold">
        Path difference decides what happens at P
      </Label>

      <line x1={S1.x} y1={S1.y} x2={P.x} y2={P.y} className="dg-line" />
      <line x1={S2.x} y1={S2.y} x2={P.x} y2={P.y} className="dg-line" />

      <circle cx={S1.x} cy={S1.y} r={6} className="dg-dot-accent" />
      <circle cx={S2.x} cy={S2.y} r={6} className="dg-dot-accent" />
      <circle cx={P.x} cy={P.y} r={7} className="dg-dot" />

      <Label x={S1.x} y={S1.y + 24} className="dg-text-small dg-text-accent">
        S₁
      </Label>
      <Label x={S2.x} y={S2.y + 24} className="dg-text-small dg-text-accent">
        S₂
      </Label>
      <Label x={P.x + 18} y={P.y} anchor="start" className="dg-text-small dg-bold">
        P
      </Label>
      <Label x={P.x + 18} y={P.y + 20} anchor="start" className="dg-text-small dg-text-muted">
        minimum
      </Label>

      <Label x={296} y={168} anchor="end" className="dg-text-small dg-text-muted">
        S₁P = 5.0 λ
      </Label>
      <Label x={404} y={228} anchor="start" className="dg-text-small dg-text-muted">
        S₂P = 4.5 λ
      </Label>

      <MathLabel
        x={320}
        y={352}
        tex="0.5\lambda\ \text{path difference}\ \Rightarrow\ \text{antiphase}\ \Rightarrow\ \text{minimum}"
        w={600}
        h={40}
      />
    </Svg>
  );
}

export default InterferencePathDifference;
