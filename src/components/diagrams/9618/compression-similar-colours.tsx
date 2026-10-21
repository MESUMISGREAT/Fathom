/**
 * Why lossy image compression helps. A row of 12 greyscale pixels (8 bits each,
 * 12 bytes): 201 199 200 202 200 198 81 79 80 82 80 78. No two neighbours are
 * equal, so RLE finds 12 runs = 24 bytes, bigger than the original. A lossy
 * step rounds each value to the nearest 10 (no value moves by more than 2),
 * giving 200 × 6 then 80 × 6. Now RLE finds 2 runs = 4 bytes.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-similar-colours';

const W = 620;
const H = 356;
const CELL = 40;
const X0 = (W - 12 * CELL) / 2;

const original = [201, 199, 200, 202, 200, 198, 81, 79, 80, 82, 80, 78];
const rounded = original.map((v) => Math.round(v / 10) * 10);

function runCount(vs: number[]): number {
  let n = 0;
  vs.forEach((v, i) => {
    if (i === 0 || vs[i - 1] !== v) n++;
  });
  return n;
}

function Row({ y, values }: { y: number; values: number[] }) {
  return (
    <g>
      {values.map((v, i) => (
        <g key={i}>
          <rect x={X0 + i * CELL} y={y} width={CELL} height={32} className={v > 140 ? 'dg-fill-muted dg-thin' : 'dg-fill-accent dg-thin'} />
          <Label x={X0 + i * CELL + CELL / 2} y={y + 16} className="dg-text dg-mono">
            {v}
          </Label>
        </g>
      ))}
    </g>
  );
}

export function CompressionSimilarColours() {
  const r1 = runCount(original);
  const r2 = runCount(rounded);
  const pairs: { n: number; v: number }[] = [];
  rounded.forEach((v, i) => {
    if (i === 0 || rounded[i - 1] !== v) pairs.push({ n: 1, v });
    else pairs[pairs.length - 1]!.n++;
  });
  return (
    <Svg width={W} height={H}>
      <Label x={X0} y={20} anchor="start" className="dg-text dg-bold">
        Original row: 12 pixels, 8 bits each = 12 bytes
      </Label>
      <Row y={36} values={original} />
      <Label x={X0} y={88} anchor="start" className="dg-text-accent-2">
        {`RLE on the original: ${r1} runs × 2 bytes = ${r1 * 2} bytes (bigger!)`}
      </Label>

      <Arrow x1={W / 2} y1={104} x2={W / 2} y2={146} head={8} className="dg-muted" />
      <Label x={W / 2 + 12} y={118} anchor="start" className="dg-text-small dg-bold">
        lossy step: round to the nearest 10
      </Label>
      <Label x={W / 2 + 12} y={134} anchor="start" className="dg-text-small dg-text-muted">
        no pixel changes by more than 2
      </Label>

      <Row y={152} values={rounded} />
      <Label x={X0} y={204} anchor="start" className="dg-text-accent">
        {`RLE after rounding: ${r2} runs × 2 bytes = ${r2 * 2} bytes`}
      </Label>

      {pairs.map((p, k) => {
        const px = W / 2 - 110 + k * 130;
        return (
          <g key={k}>
            <rect x={px} y={230} width={44} height={34} className="dg-fill-accent-2 dg-thin" />
            <rect x={px + 44} y={230} width={46} height={34} className="dg-fill-surface dg-thin" />
            <Label x={px + 22} y={247} className="dg-text dg-mono dg-bold">
              {p.n}
            </Label>
            <Label x={px + 67} y={247} className="dg-text dg-mono">
              {p.v}
            </Label>
            <Label x={px + 22} y={276} className="dg-text-small dg-text-muted">
              count
            </Label>
            <Label x={px + 67} y={276} className="dg-text-small dg-text-muted">
              value
            </Label>
          </g>
        );
      })}
      <Label x={W / 2} y={316} className="dg-text">
        Tiny, invisible changes create long runs of identical pixels,
      </Label>
      <Label x={W / 2} y={336} className="dg-text">
        and long runs compress brilliantly.
      </Label>
    </Svg>
  );
}

export default CompressionSimilarColours;
