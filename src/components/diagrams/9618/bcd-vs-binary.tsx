/**
 * Denary 59 two ways. Left: BCD codes each denary digit as its own 4-bit
 * nibble (5 → 0101, 9 → 1001). Right: pure binary converts the whole value
 * (59 = 0011 1011). Same number, different bit patterns.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-bcd-vs-binary';

const W = 600;
const H = 252;
const CELL = 24;
const ROW_Y = 116;

function Cells({ x, bits }: { x: number; bits: string }) {
  return (
    <g>
      {[...bits].map((b, i) => (
        <g key={i}>
          <rect
            x={x + i * CELL}
            y={ROW_Y}
            width={CELL}
            height={34}
            className={b === '1' ? 'dg-fill-accent dg-thin' : 'dg-fill-muted dg-thin'}
          />
          <Label x={x + i * CELL + CELL / 2} y={ROW_Y + 18} className="dg-text dg-mono">
            {b}
          </Label>
        </g>
      ))}
    </g>
  );
}

function DigitBox({ cx, text, w = 44 }: { cx: number; text: string; w?: number }) {
  return (
    <g>
      <rect x={cx - w / 2} y={44} width={w} height={36} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={cx} y={63} className="dg-text dg-bold">
        {text}
      </Label>
    </g>
  );
}

export function BcdVsBinary() {
  return (
    <Svg width={W} height={H}>
      <line x1={300} y1={14} x2={300} y2={204} className="dg-grid" />

      {/* BCD */}
      <Label x={150} y={22} className="dg-text dg-bold">
        BCD: one nibble per digit
      </Label>
      <DigitBox cx={95} text="5" />
      <DigitBox cx={205} text="9" />
      <Arrow x1={95} y1={84} x2={95} y2={110} head={7} className="dg-muted" headClassName="dg-dot" />
      <Arrow x1={205} y1={84} x2={205} y2={110} head={7} className="dg-muted" headClassName="dg-dot" />
      <Cells x={95 - 2 * CELL} bits="0101" />
      <Cells x={205 - 2 * CELL} bits="1001" />
      <Label x={150} y={172} className="dg-text-accent dg-mono">
        0101 1001
      </Label>
      <Label x={150} y={194} className="dg-text-muted">
        5 → 0101 and 9 → 1001
      </Label>

      {/* Pure binary */}
      <Label x={450} y={22} className="dg-text dg-bold">
        Pure binary: the whole value
      </Label>
      <DigitBox cx={450} text="59" w={60} />
      <Arrow x1={450} y1={84} x2={450} y2={110} head={7} className="dg-muted" headClassName="dg-dot" />
      <Cells x={450 - 4 * CELL} bits="00111011" />
      <Label x={450} y={172} className="dg-text-accent dg-mono">
        0011 1011
      </Label>
      <Label x={450} y={194} className="dg-text-muted">
        32 + 16 + 8 + 2 + 1 = 59
      </Label>

      <Label x={W / 2} y={234} className="dg-text-muted">
        BCD never uses 1010 to 1111: each nibble only ever holds 0 to 9
      </Label>
    </Svg>
  );
}

export default BcdVsBinary;
