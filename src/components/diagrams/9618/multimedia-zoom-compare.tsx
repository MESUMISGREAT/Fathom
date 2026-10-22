/**
 * The same small circle enlarged 8 times, as a bitmap and as a vector graphic.
 * The bitmap was stored as 20 × 20 pixels, so enlarging just makes each pixel an
 * 8 × 8 block and the edge becomes a staircase (pixelation). The vector circle is
 * stored as centre + radius, so it is recalculated at the new size and the edge
 * stays smooth.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-multimedia-zoom-compare';

const W = 620;
const H = 290;
const N = 20; // stored bitmap is 20 x 20 pixels
const SMALL = 1; // on-screen size of one stored pixel in the "original" (to scale: BIG / SMALL = 8)
const BIG = 8; // enlarged pixel size
const inCircle = (c: number, r: number) => (c + 0.5 - N / 2) ** 2 + (r + 0.5 - N / 2) ** 2 < (N / 2 - 0.6) ** 2;

function Bitmap({ x, y, s }: { x: number; y: number; s: number }) {
  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (inCircle(c, r)) cells.push(<rect key={`${r}-${c}`} x={x + c * s} y={y + r * s} width={s + 0.3} height={s + 0.3} className="dg-dot-accent" />);
  return <g shapeRendering="crispEdges">{cells}</g>;
}

export function MultimediaZoomCompare() {
  const panels = [
    { x0: 20, title: 'Bitmap enlarged ×8', note1: 'pixels just get bigger:', note2: 'jagged edge (pixelation)' },
    { x0: 320, title: 'Vector enlarged ×8', note1: 'recalculated from centre + radius:', note2: 'edge stays smooth' },
  ];
  const big = N * BIG; // 160
  return (
    <Svg width={W} height={H}>
      {panels.map((p, i) => {
        const sx = p.x0 + 14;
        const sy = 56;
        const bx = p.x0 + 116;
        const by = 56;
        return (
          <g key={i}>
            <Label x={p.x0 + 140} y={22} className="dg-text dg-bold">
              {p.title}
            </Label>
            {/* original */}
            {i === 0 ? (
              <Bitmap x={sx} y={sy} s={SMALL} />
            ) : (
              <circle cx={sx + (N * SMALL) / 2} cy={sy + (N * SMALL) / 2} r={(N / 2 - 0.6) * SMALL} className="dg-dot-accent" />
            )}
            <Label x={sx + (N * SMALL) / 2} y={sy + N * SMALL + 16} className="dg-text-small dg-text-muted">
              original
            </Label>
            <Arrow x1={sx + N * SMALL + 10} y1={sy + 14} x2={bx - 8} y2={by + 40} head={8} className="dg-muted" />
            {/* enlarged */}
            {i === 0 ? (
              <Bitmap x={bx} y={by} s={BIG} />
            ) : (
              <circle cx={bx + big / 2} cy={by + big / 2} r={(N / 2 - 0.6) * BIG} className="dg-dot-accent" />
            )}
            <rect x={bx} y={by} width={big} height={big} className="dg-grid" />
            <Label x={p.x0 + 140} y={by + big + 30} className="dg-text-small">
              {p.note1}
            </Label>
            <Label x={p.x0 + 140} y={by + big + 48} className={i === 0 ? 'dg-text-small dg-text-accent-2' : 'dg-text-small dg-text-accent'}>
              {p.note2}
            </Label>
          </g>
        );
      })}
      <line x1={W / 2 - 8} y1={40} x2={W / 2 - 8} y2={H - 20} className="dg-grid" />
    </Svg>
  );
}

export default MultimediaZoomCompare;
