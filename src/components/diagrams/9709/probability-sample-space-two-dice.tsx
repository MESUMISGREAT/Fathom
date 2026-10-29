/**
 * The 36 equally likely ordered pairs from rolling two fair dice, with the score of each
 * cell shown as its total. The five cells that total 8 are shaded, which makes the key
 * point visible: the totals are not equally likely, but the cells are.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'probability-sample-space-two-dice';

const CELL = 44;
const X0 = 80;
const Y0 = 70;
const W = 400;
const H = 430;

const sumsFor = (total: number) => {
  const out: Array<[number, number]> = [];
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === total) out.push([a, b]);
  return out;
};

const HIGHLIGHT = new Set(sumsFor(8).map(([a, b]) => `${a},${b}`));

export default function ProbabilitySampleSpaceTwoDice() {
  const rows = [1, 2, 3, 4, 5, 6];
  return (
    <Svg width={W} height={H}>
      <Label x={X0 + (6 * CELL) / 2} y={28} className="dg-text">
        Die 1
      </Label>
      <Label x={22} y={Y0 + (6 * CELL) / 2} className="dg-text">
        Die 2
      </Label>

      {rows.map((a) => (
        <Label key={`top${a}`} x={X0 + (a - 0.5) * CELL} y={Y0 - 16} className="dg-text-small">
          {`${a}`}
        </Label>
      ))}
      {rows.map((b) => (
        <Label key={`left${b}`} x={X0 - 16} y={Y0 + (b - 0.5) * CELL} className="dg-text-small">
          {`${b}`}
        </Label>
      ))}

      {rows.map((b) =>
        rows.map((a) => {
          const key = `${a},${b}`;
          const on = HIGHLIGHT.has(key);
          return (
            <g key={key}>
              <rect
                x={X0 + (a - 1) * CELL}
                y={Y0 + (b - 1) * CELL}
                width={CELL}
                height={CELL}
                className={on ? 'dg-fill-accent dg-thin' : 'dg-grid'}
                fill="none"
              />
              <Label
                x={X0 + (a - 0.5) * CELL}
                y={Y0 + (b - 0.5) * CELL}
                className={on ? 'dg-text-accent-2' : 'dg-text-small'}
              >
                {`${a + b}`}
              </Label>
            </g>
          );
        }),
      )}

      <rect x={X0} y={H - 56} width={16} height={16} className="dg-fill-accent dg-thin" fill="none" />
      <Label x={X0 + 24} y={H - 48} anchor="start" className="dg-text-small">
        the 5 outcomes with total 8
      </Label>
      <Label x={X0} y={H - 20} anchor="start" className="dg-text-small">
        36 equally likely outcomes in total
      </Label>
    </Svg>
  );
}
