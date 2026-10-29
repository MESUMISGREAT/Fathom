/**
 * Flow diagram: equation \u2192 rearrangement \u2192 choose x\u2081 \u2192 iterate \u2192 check convergence \u2192 state root.
 */
import { Label, MathLabel, Svg, Arrow } from '../primitives';

export const diagramKey = 'p3-numerical-solution-iteration-steps';

const W = 560;
const H = 200;
const BOX_W = 110;
const BOX_H = 50;
const GAP = 16;
const Y = 60;

const steps = [
  { id: 0, text: 'Equation\\\\nf(x) = 0' },
  { id: 1, text: 'Rearrange to\\\\nx = F(x)' },
  { id: 2, text: 'Choose\\\\nx\u2081' },
  { id: 3, text: 'Iterate\\\\nx\u2082 = F(x\u2081)\\\\nx\u2083 = F(x\u2082)\u2026' },
  { id: 4, text: 'Check\\\\n|x\u2099 \u2212 x\u2099\u208a\u2081| < tol' },
  { id: 5, text: 'State root\\\\n\u03b1 = \u2026' },
];

function ArrowRight({ x, y, length = 20, className = 'dg-accent' }: { x: number; y: number; length?: number; className?: string }) {
  return (
    <Arrow
      x1={x}
      y1={y}
      x2={x + length}
      y2={y}
      className={className}
      head={6}
    />
  );
}

export default function P3NumericalSolutionIterationSteps() {
  return (
    <Svg width={W} height={H}>
      <g transform="translate(20, 20)">
        {steps.map((step, i) => {
          const x = i * (BOX_W + GAP);
          return (
            <g key={step.id}>
              <rect
                x={x}
                y={Y - BOX_H / 2}
                width={BOX_W}
                height={BOX_H}
                rx={8}
                className="dg-box"
              />
              <MathLabel
                x={x + BOX_W / 2}
                y={Y}
                tex={step.text}
                anchor="middle"
                w={BOX_W - 10}
                h={BOX_H - 10}
                size="small"
              />
              {i < steps.length - 1 && (
                <ArrowRight
                  x={x + BOX_W}
                  y={Y}
                  length={GAP}
                  className="dg-accent"
                />
              )}
            </g>
          );
        })}
      </g>
      <Label x={W / 2} y={H - 14} className="dg-text-small dg-bold">
        Given the iteration formula, you only run steps 3\u20135.
      </Label>
    </Svg>
  );
}