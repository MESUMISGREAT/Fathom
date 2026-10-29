/**
 * How a machine-learning system works: data is collected, a training algorithm finds patterns
 * in it, the resulting model makes predictions on new data, and the new data feeds back in.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-ai-system-pipeline';

const W = 640;
const H = 236;
const BOX_W = 132;
const BOX_H = 58;
const GAP = 24;
const X0 = (W - (4 * BOX_W + 3 * GAP)) / 2;
const TOP = 66;
const MID = TOP + BOX_H / 2;
const BOTTOM = TOP + BOX_H;

const steps = [
  { title: 'Collect data', sub: 'training examples' },
  { title: 'Train', sub: 'find patterns' },
  { title: 'Model', sub: 'learned rules' },
  { title: 'Predict', sub: 'on new data' },
];

const boxX = (i: number) => X0 + i * (BOX_W + GAP);

export function AiSystemPipeline() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        How a machine-learning system is built and used
      </Label>

      {steps.map((s, i) => {
        const x = boxX(i);
        return (
          <g key={s.title}>
            <rect
              x={x}
              y={TOP}
              width={BOX_W}
              height={BOX_H}
              rx={8}
              className={i === 2 ? 'dg-fill-accent-2 dg-line' : 'dg-fill-accent dg-line'}
            />
            <Label x={x + BOX_W / 2} y={TOP + 22} className="dg-text dg-bold">
              {s.title}
            </Label>
            <Label x={x + BOX_W / 2} y={TOP + 41} className="dg-text-small dg-text-muted">
              {s.sub}
            </Label>
            {i < steps.length - 1 && (
              <Arrow x1={x + BOX_W + 3} y1={MID} x2={x + BOX_W + GAP - 3} y2={MID} head={8} />
            )}
          </g>
        );
      })}

      {/* Feedback loop: what the system sees in use becomes training data for the next model. */}
      <path
        d={`M${boxX(3) + BOX_W / 2},${BOTTOM + 2} L${boxX(3) + BOX_W / 2},${BOTTOM + 46} L${boxX(0) + BOX_W / 2},${BOTTOM + 46}`}
        className="dg-muted dg-dashed"
      />
      <Arrow
        x1={boxX(0) + BOX_W / 2}
        y1={BOTTOM + 46}
        x2={boxX(0) + BOX_W / 2}
        y2={BOTTOM + 4}
        head={8}
        className="dg-muted"
      />
      <Label x={W / 2} y={BOTTOM + 68} className="dg-text-small dg-text-muted">
        new data from use is fed back to improve the next model
      </Label>

      <Label x={X0} y={BOTTOM + 96} anchor="start" className="dg-text-small dg-text-muted">
        The program is not written by hand: the model's rules come from the training data.
      </Label>
    </Svg>
  );
}

export default AiSystemPipeline;
