/**
 * Run-length encoding of the 20-character string AAAAAABBBBCCCCCCCCDD. The
 * characters sit in a row of boxes (one byte each), bracketed into four runs:
 * 6 × A, 4 × B, 8 × C and 2 × D. Arrows lead from each run to its encoded
 * pair (count, character): 6 A, 4 B, 8 C, 2 D, stored in 8 bytes instead of 20.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-rle-runs';

const W = 620;
const H = 300;
const TEXT = 'AAAAAABBBBCCCCCCCCDD';
const CELL = 27;
const X0 = (W - TEXT.length * CELL) / 2;
const Y_TEXT = 48;
const PAIR = 2 * 44;
const PAIR_GAP = 30;

function runs(s: string): { ch: string; start: number; n: number }[] {
  const out: { ch: string; start: number; n: number }[] = [];
  for (let i = 0; i < s.length; ) {
    let j = i;
    while (j < s.length && s[j] === s[i]) j++;
    out.push({ ch: s[i]!, start: i, n: j - i });
    i = j;
  }
  return out;
}

export function CompressionRleRuns() {
  const rs = runs(TEXT);
  const pairsW = rs.length * PAIR + (rs.length - 1) * PAIR_GAP;
  const PX0 = (W - pairsW) / 2;
  const Y_PAIR = 190;
  return (
    <Svg width={W} height={H}>
      <Label x={X0} y={22} anchor="start" className="dg-text dg-bold">
        Original: 20 characters = 20 bytes
      </Label>
      {[...TEXT].map((c, i) => (
        <g key={i}>
          <rect
            x={X0 + i * CELL}
            y={Y_TEXT}
            width={CELL}
            height={32}
            className={rs.findIndex((r) => i >= r.start && i < r.start + r.n) % 2 === 0 ? 'dg-fill-muted dg-thin' : 'dg-fill-accent dg-thin'}
          />
          <Label x={X0 + i * CELL + CELL / 2} y={Y_TEXT + 16} className="dg-text dg-mono">
            {c}
          </Label>
        </g>
      ))}

      {rs.map((r, k) => {
        const x1 = X0 + r.start * CELL + 3;
        const x2 = X0 + (r.start + r.n) * CELL - 3;
        const mid = (x1 + x2) / 2;
        const yb = Y_TEXT + 40;
        const px = PX0 + k * (PAIR + PAIR_GAP);
        return (
          <g key={k}>
            {/* bracket under the run */}
            <path d={`M${x1},${yb} L${x1},${yb + 8} L${x2},${yb + 8} L${x2},${yb}`} className="dg-muted" />
            <Label x={mid} y={yb + 24} className="dg-text-small dg-text-muted">
              {`run of ${r.n}`}
            </Label>
            <Arrow x1={mid} y1={yb + 34} x2={px + PAIR / 2} y2={Y_PAIR - 6} head={7} className="dg-muted" />
            {/* encoded pair: count, character */}
            <rect x={px} y={Y_PAIR} width={PAIR / 2} height={34} className="dg-fill-accent-2 dg-thin" />
            <rect x={px + PAIR / 2} y={Y_PAIR} width={PAIR / 2} height={34} className="dg-fill-surface dg-thin" />
            <Label x={px + PAIR / 4} y={Y_PAIR + 17} className="dg-text dg-mono dg-bold">
              {r.n}
            </Label>
            <Label x={px + (3 * PAIR) / 4} y={Y_PAIR + 17} className="dg-text dg-mono">
              {r.ch}
            </Label>
            <Label x={px + PAIR / 4} y={Y_PAIR + 46} className="dg-text-small dg-text-muted">
              count
            </Label>
            <Label x={px + (3 * PAIR) / 4} y={Y_PAIR + 46} className="dg-text-small dg-text-muted">
              char
            </Label>
          </g>
        );
      })}
      <Label x={W / 2} y={H - 16} className="dg-text dg-bold">
        Encoded: 4 runs × 2 bytes = 8 bytes
      </Label>
    </Svg>
  );
}

export default CompressionRleRuns;
