/**
 * Gauss's pairing for the AP 2 + 5 + 8 + 11 + 14 (a = 2, l = 14, n = 5).
 * The sum written forwards (bars standing up) and backwards (bars stacked on
 * top) fills a rectangle: every column is a + l = 16 tall and there are n = 5
 * columns, so 2S = 5 × 16 = 80 and S = 40.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'series-ap-sum-pairing';

const W = 560;
const H = 360;
const terms = [2, 5, 8, 11, 14];
const n = terms.length;
const top = terms[0]! + terms[n - 1]!; // a + l = 16
const UNIT = 16; // px per unit of height
const COL = 62;
const GAP = 10;
const LEFT = 120;
const BASE = 300;

export default function SeriesApSumPairing() {
  const colX = (i: number) => LEFT + i * (COL + GAP);
  const yOf = (v: number) => BASE - v * UNIT;
  const right = colX(n - 1) + COL;
  return (
    <Svg width={W} height={H}>
      {terms.map((t, i) => {
        const back = terms[n - 1 - i]!;
        return (
          <g key={i}>
            {/* forwards: a, a + d, ... */}
            <rect x={colX(i)} y={yOf(t)} width={COL} height={t * UNIT} className="dg-accent dg-fill-accent" />
            <Label x={colX(i) + COL / 2} y={yOf(t / 2)} className="dg-text-accent">
              {t}
            </Label>
            {/* backwards: l, l − d, ... stacked on top */}
            <rect x={colX(i)} y={yOf(top)} width={COL} height={back * UNIT} className="dg-accent-2 dg-fill-accent-2" />
            <Label x={colX(i) + COL / 2} y={yOf(t + back / 2)} className="dg-text-accent-2">
              {back}
            </Label>
          </g>
        );
      })}

      {/* row labels */}
      <Label x={LEFT - 12} y={yOf(1)} anchor="end" className="dg-text-accent">
        S forwards
      </Label>
      <Label x={LEFT - 12} y={yOf(15)} anchor="end" className="dg-text-accent-2">
        S backwards
      </Label>

      {/* height brace: a + l */}
      <line x1={right + 14} y1={yOf(top)} x2={right + 14} y2={yOf(0)} className="dg-thin" />
      <line x1={right + 9} y1={yOf(top)} x2={right + 19} y2={yOf(top)} className="dg-thin" />
      <line x1={right + 9} y1={yOf(0)} x2={right + 19} y2={yOf(0)} className="dg-thin" />
      <Label x={right + 24} y={yOf(top / 2) - 20} anchor="start" className="dg-text dg-bold dg-italic">
        a + l
      </Label>
      <Label x={right + 24} y={yOf(top / 2)} anchor="start" className="dg-text">
        = 2 + 14
      </Label>
      <Label x={right + 24} y={yOf(top / 2) + 20} anchor="start" className="dg-text">
        = 16
      </Label>

      {/* width brace: n columns */}
      <line x1={colX(0)} y1={BASE + 14} x2={right} y2={BASE + 14} className="dg-thin" />
      <line x1={colX(0)} y1={BASE + 9} x2={colX(0)} y2={BASE + 19} className="dg-thin" />
      <line x1={right} y1={BASE + 9} x2={right} y2={BASE + 19} className="dg-thin" />
      <Label x={(colX(0) + right) / 2} y={BASE + 32} className="dg-text">
        n = 5 columns, so 2S = 5 × 16 = 80 and S = 40
      </Label>

      <Label x={(colX(0) + right) / 2} y={yOf(top) - 18} className="dg-text-muted">
        Every column adds up to the same total
      </Label>
    </Svg>
  );
}
