/**
 * Shared layout for "column heading + bit box" diagrams (binary place value,
 * two's complement weights). Draws one row of bit boxes with the column
 * weight above each box and, under every 1 bit, an arrow down to the value
 * that column contributes.
 */
import { Arrow, Label } from '../primitives';

export interface BitColumnsProps {
  /** Left edge of the first box. */
  x: number;
  /** Top edge of the boxes. */
  y: number;
  bits: string;
  /** Column weights, most significant first, as display strings. */
  weights: string[];
  /** Optional row of powers shown above the weights (e.g. "2⁷"). */
  powers?: string[];
  boxW?: number;
  boxH?: number;
  gap?: number;
  /** Columns drawn in the second accent colour (e.g. the negative MSB). */
  special?: number[];
}

export function bitCentre(x: number, i: number, boxW = 58, gap = 8): number {
  return x + i * (boxW + gap) + boxW / 2;
}

export function BitColumns({ x, y, bits, weights, powers, boxW = 58, boxH = 46, gap = 8, special = [] }: BitColumnsProps) {
  const cells = [...bits];
  return (
    <g>
      {cells.map((b, i) => {
        const cx = bitCentre(x, i, boxW, gap);
        const isSpecial = special.includes(i);
        const on = b === '1';
        const fill = on ? (isSpecial ? 'dg-fill-accent-2' : 'dg-fill-accent') : 'dg-fill-muted';
        const stroke = on ? (isSpecial ? 'dg-accent-2' : 'dg-accent') : 'dg-thin';
        const textCls = on ? (isSpecial ? 'dg-text-accent-2 dg-mono dg-bold' : 'dg-text-accent dg-mono dg-bold') : 'dg-text-muted dg-mono';
        const valueCls = isSpecial ? 'dg-text-accent-2' : 'dg-text-accent';
        return (
          <g key={i}>
            {powers && (
              <Label x={cx} y={y - 44} className="dg-text-muted">
                {powers[i]}
              </Label>
            )}
            <Label x={cx} y={y - 18} className={isSpecial ? 'dg-text-accent-2' : 'dg-text dg-bold'}>
              {weights[i]}
            </Label>
            <rect x={cx - boxW / 2} y={y} width={boxW} height={boxH} rx={6} className={`${fill} ${stroke}`} />
            <Label x={cx} y={y + boxH / 2 + 1} className={textCls}>
              {b}
            </Label>
            {on && (
              <>
                <Arrow x1={cx} y1={y + boxH + 4} x2={cx} y2={y + boxH + 30} head={7} className="dg-muted" headClassName="dg-dot" />
                <Label x={cx} y={y + boxH + 44} className={valueCls}>
                  {weights[i]}
                </Label>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
