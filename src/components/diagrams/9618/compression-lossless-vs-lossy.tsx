/**
 * The same eight pixel values (200 201 199 200 81 79 80 80) go through a
 * lossless and a lossy compressor side by side. Lossless: the compressed data
 * are smaller and decompress to exactly the original values. Lossy: the
 * compressed data are much smaller, but decompress to 200 200 200 200 80 80 80
 * 80; the four values that changed (201, 199, 81, 79) are highlighted, because
 * that detail has been removed permanently.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-lossless-vs-lossy';

const W = 620;
const H = 330;
const CELL = 30;
const ROW_W = 8 * CELL;

const original = [200, 201, 199, 200, 81, 79, 80, 80];
const lossy = original.map((v) => Math.round(v / 10) * 10);

function Row({ x, y, values, compare }: { x: number; y: number; values: number[]; compare?: number[] }) {
  return (
    <g>
      {values.map((v, i) => {
        const changed = compare !== undefined && compare[i] !== v;
        return (
          <g key={i}>
            <rect
              x={x + i * CELL}
              y={y}
              width={CELL}
              height={30}
              className={changed ? 'dg-fill-accent-2 dg-thin' : 'dg-fill-muted dg-thin'}
            />
            <Label x={x + i * CELL + CELL / 2} y={y + 15} className={changed ? 'dg-text-small dg-mono dg-bold' : 'dg-text-small dg-mono'}>
              {v}
            </Label>
          </g>
        );
      })}
    </g>
  );
}

function Lane({
  cx,
  title,
  titleClass,
  boxW,
  boxNote,
  result,
  notes,
}: {
  cx: number;
  title: string;
  titleClass: string;
  boxW: number;
  boxNote: string;
  result: number[];
  notes: string[];
}) {
  const x = cx - ROW_W / 2;
  return (
    <g>
      <Label x={cx} y={22} className={`${titleClass} dg-bold`}>
        {title}
      </Label>
      <Label x={x - 6} y={65} anchor="end" className="dg-text-small dg-text-muted">
        in
      </Label>
      <Row x={x} y={50} values={original} />
      <Arrow x1={cx} y1={86} x2={cx} y2={120} head={7} className="dg-muted" />
      <Label x={cx + 8} y={103} anchor="start" className="dg-text-small dg-text-muted">
        compress
      </Label>
      <rect x={cx - boxW / 2} y={124} width={boxW} height={30} className="dg-fill-accent dg-accent" />
      <Label x={cx + boxW / 2 + 8} y={139} anchor="start" className="dg-text-small">
        {boxNote}
      </Label>
      <Arrow x1={cx} y1={160} x2={cx} y2={194} head={7} className="dg-muted" />
      <Label x={cx + 8} y={177} anchor="start" className="dg-text-small dg-text-muted">
        decompress
      </Label>
      <Label x={x - 6} y={213} anchor="end" className="dg-text-small dg-text-muted">
        out
      </Label>
      <Row x={x} y={198} values={result} compare={original} />
      {notes.map((n, i) => (
        <Label key={i} x={cx} y={250 + i * 20} className={i === 0 ? 'dg-text' : 'dg-text-muted'}>
          {n}
        </Label>
      ))}
    </g>
  );
}

export function CompressionLosslessVsLossy() {
  return (
    <Svg width={W} height={H}>
      <line x1={W / 2} y1={10} x2={W / 2} y2={H - 10} className="dg-grid" />
      <Lane
        cx={155}
        title="Lossless"
        titleClass="dg-text-accent"
        boxW={120}
        boxNote="smaller"
        result={original}
        notes={['identical to the original ✓', 'every bit restored']}
      />
      <Lane
        cx={465}
        title="Lossy"
        titleClass="dg-text-accent-2"
        boxW={56}
        boxNote="much smaller"
        result={lossy}
        notes={['only an approximation', '4 values changed (highlighted)', 'that detail is gone for good']}
      />
    </Svg>
  );
}

export default CompressionLosslessVsLossy;
