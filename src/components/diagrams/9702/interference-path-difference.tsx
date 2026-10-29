/**
 * Two coherent sources S1 and S2 send waves to P. The distances are 5.0 and
 * 4.5 wavelengths, so the path difference is 0.5 wavelength: the waves arrive
 * in antiphase and P is a minimum (dark fringe).
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'phys-interference-path-difference';

const W = 640;
const H = 330;

export function InterferencePathDifference() {
  return (
    <Svg width={W} height={H}>
      <Label x={320} y={26} className="dg-text dg-bold">
        Path difference decides what happens at P
      </Label>

      <line x1={170} y1={280} x2={470} y2={80} className="dg-line" />
      <line x1={300} y1={280} x2={470} y2={80} className="dg-line" />

      <circle cx={170} cy={280} r={6} className="dg-dot-accent" />
      <circle cx={300} cy={280} r={6} className="dg-dot-accent" />
      <circle cx={470} cy={80} r={7} className="dg-dot" />

      <Label x={170} y={304} className="dg-text-small dg-text-accent">
        S₁
      </Label>
      <Label x={300} y={304} className="dg-text-small dg-text-accent">
        S₂
      </Label>
      <Label x={490} y={80} anchor="start" className="dg-text-small dg-bold">
        P
      </Label>

      <Label x={286} y={166} className="dg-text-small dg-text-muted">
        S₁P = 5.0 λ
      </Label>
      <Label x={404} y={228} className="dg-text-small dg-text-muted">
        S₂P = 4.5 λ
      </Label>

      <MathLabel x={320} y={148} tex="\text{path difference}=0.5\lambda" w={260} h={40} tone="accent-2" />
      <Label x={320} y={196} className="dg-text-small dg-text-muted">
        the waves arrive in antiphase, so P is a minimum
      </Label>

      <MathLabel
        x={320}
        y={240}
        tex="\text{path difference}=n\lambda \Rightarrow \text{max; } (n+\tfrac{1}{2})\lambda \Rightarrow \text{min}"
        w={520}
        h={40}
      />
    </Svg>
  );
}

export default InterferencePathDifference;
