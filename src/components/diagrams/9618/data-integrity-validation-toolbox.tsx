/**
 * The seven validation checks (9618 6.2.2), drawn as a rule table: the check, the question it
 * asks, and one value it rejects.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-integrity-validation-toolbox';

const W = 640;
const H = 300;
const ROW_H = 30;
const HEAD_Y = 34;
const X_CHECK = 12;
const X_ASK = 150;
const X_FAIL = 388;
const COL_CHECK_W = 138;
const COL_ASK_W = 238;

const rows: [string, string, string][] = [
  ['presence', 'is anything there?', 'blank surname'],
  ['length', 'right number of characters?', '10 digits where 11 are needed'],
  ['range', 'between two limits?', 'a mark of 105 in 0–100'],
  ['limit', 'on the allowed side of one limit?', 'an order of −3 (rule: > 0)'],
  ['format', 'does it match the pattern?', '31/13/2026 as DD/MM/YYYY'],
  ['existence', 'is it in the stored list?', 'customer C9999 not found'],
  ['check digit', 'do the digits add up correctly?', 'one digit changed in a barcode'],
];

export function ValidationToolboxDiagram() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={18} className="dg-text dg-bold">
        seven checks, seven different questions
      </Label>

      <rect x={X_CHECK} y={HEAD_Y} width={COL_CHECK_W} height={ROW_H} rx={4} className="dg-fill-muted dg-thin" />
      <Label x={X_CHECK + COL_CHECK_W / 2} y={HEAD_Y + ROW_H / 2} className="dg-text-small dg-bold">
        check
      </Label>
      <rect x={X_ASK} y={HEAD_Y} width={COL_ASK_W} height={ROW_H} rx={4} className="dg-fill-muted dg-thin" />
      <Label x={X_ASK + COL_ASK_W / 2} y={HEAD_Y + ROW_H / 2} className="dg-text-small dg-bold">
        the question it asks
      </Label>
      <rect x={X_FAIL} y={HEAD_Y} width={W - X_FAIL - 12} height={ROW_H} rx={4} className="dg-fill-muted dg-thin" />
      <Label x={X_FAIL + (W - X_FAIL - 12) / 2} y={HEAD_Y + ROW_H / 2} className="dg-text-small dg-bold">
        a value it rejects
      </Label>

      {rows.map(([check, ask, fail], i) => {
        const y = HEAD_Y + ROW_H + 2 + i * ROW_H;
        return (
          <g key={check}>
            <rect
              x={X_CHECK}
              y={y}
              width={COL_CHECK_W}
              height={ROW_H - 2}
              rx={4}
              className={i % 2 === 0 ? 'dg-fill-surface dg-thin' : 'dg-fill-muted dg-thin'}
            />
            <Label x={X_CHECK + 12} y={y + (ROW_H - 2) / 2} anchor="start" className="dg-text-small dg-bold">
              {check}
            </Label>
            <rect
              x={X_ASK}
              y={y}
              width={COL_ASK_W}
              height={ROW_H - 2}
              rx={4}
              className={i % 2 === 0 ? 'dg-fill-surface dg-thin' : 'dg-fill-muted dg-thin'}
            />
            <Label x={X_ASK + 10} y={y + (ROW_H - 2) / 2} anchor="start" className="dg-text-small">
              {ask}
            </Label>
            <rect
              x={X_FAIL}
              y={y}
              width={W - X_FAIL - 12}
              height={ROW_H - 2}
              rx={4}
              className={i % 2 === 0 ? 'dg-fill-surface dg-thin' : 'dg-fill-muted dg-thin'}
            />
            <Label x={X_FAIL + 10} y={y + (ROW_H - 2) / 2} anchor="start" className="dg-text-small dg-text-muted">
              {fail}
            </Label>
          </g>
        );
      })}
    </Svg>
  );
}

export default ValidationToolboxDiagram;
