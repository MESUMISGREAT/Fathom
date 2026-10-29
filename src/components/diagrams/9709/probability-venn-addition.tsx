/**
 * Two overlapping events inside a sample space, with the overlap labelled. It shows why the
 * addition rule subtracts P(A and B): the lens-shaped intersection belongs to both circles,
 * so adding the two probabilities counts it twice.
 */
import { Label, MathLabel, Svg } from '../primitives';

export const diagramKey = 'probability-venn-addition';

const W = 460;
const H = 330;
const CY = 160;

export default function ProbabilityVennAddition() {
  return (
    <Svg width={W} height={H}>
      <rect x={36} y={44} width={388} height={238} className="dg-thin" fill="none" />
      <Label x={54} y={62} anchor="start" className="dg-text-small">
        S
      </Label>

      {/* Different strokes as well as fills: in dark mode the soft fills alone barely differ. */}
      <circle cx={178} cy={CY} r={92} className="dg-fill-accent dg-accent" fillOpacity={0.38} />
      <circle cx={286} cy={CY} r={92} className="dg-fill-accent-2 dg-accent-2" fillOpacity={0.38} />

      <Label x={124} y={CY - 62} className="dg-text">
        A
      </Label>
      <Label x={340} y={CY - 62} className="dg-text">
        B
      </Label>

      <MathLabel x={232} y={CY} tex="A \cap B" w={96} h={30} size="small" />
      <MathLabel x={232} y={CY + 26} tex="\text{counted twice}" w={150} h={24} size="small" tone="muted" />

      <Label x={50} y={268} anchor="start" className="dg-text-small">
        neither A nor B
      </Label>

      <MathLabel
        x={W / 2}
        y={H - 24}
        tex="P(A \cup B) = P(A) + P(B) - P(A \cap B)"
        w={W - 40}
        h={44}
        size="small"
      />
    </Svg>
  );
}
