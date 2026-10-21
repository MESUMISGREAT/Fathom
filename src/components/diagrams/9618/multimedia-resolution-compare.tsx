/**
 * The same crescent-moon shape stored as a bitmap at three image resolutions
 * (8 × 8, 16 × 16 and 32 × 32 pixels), all displayed at the same size. A pixel
 * is filled when its centre lies inside the true shape (the dashed outline).
 * Doubling the width and the height gives 4× the pixels, so at 1 bit per pixel
 * the pixel data grow from 8 to 32 to 128 bytes.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-multimedia-resolution-compare';

const W = 620;
const H = 290;
const SIZE = 156;
const TOP = 48;
const XS = [36, 232, 428];
const RES = [8, 16, 32];

// crescent in unit coordinates: inside circle A and outside circle B
const A = { x: 0.5, y: 0.5, r: 0.4 };
const B = { x: 0.68, y: 0.36, r: 0.3 };
const inside = (x: number, y: number, c: { x: number; y: number; r: number }) => (x - c.x) ** 2 + (y - c.y) ** 2 < c.r ** 2;
const inShape = (x: number, y: number) => inside(x, y, A) && !inside(x, y, B);

/** Outline of the crescent: the arc of A outside B, then the arc of B inside A. */
function outline(x0: number): string {
  const n = 720;
  const arc = (c: typeof A, keep: (x: number, y: number) => boolean) => {
    const pts: [number, number][] = [];
    const ok = Array.from({ length: n }, (_, i) => {
      const t = (2 * Math.PI * i) / n;
      return keep(c.x + c.r * Math.cos(t), c.y + c.r * Math.sin(t));
    });
    // start just after a point that is not kept, so the kept run is contiguous
    const start = ok.findIndex((v, i) => v && !ok[(i - 1 + n) % n]);
    for (let k = 0; k < n; k++) {
      const i = (start + k) % n;
      if (!ok[i]) break;
      const t = (2 * Math.PI * i) / n;
      pts.push([c.x + c.r * Math.cos(t), c.y + c.r * Math.sin(t)]);
    }
    return pts;
  };
  const outer = arc(A, (x, y) => !inside(x, y, B));
  let inner = arc(B, (x, y) => inside(x, y, A));
  const last = outer[outer.length - 1]!;
  const d = (p: [number, number]) => (p[0] - last[0]) ** 2 + (p[1] - last[1]) ** 2;
  if (d(inner[0]!) > d(inner[inner.length - 1]!)) inner = inner.reverse();
  return (
    [...outer, ...inner]
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${(x0 + x * SIZE).toFixed(2)},${(TOP + y * SIZE).toFixed(2)}`)
      .join(' ') + ' Z'
  );
}

export function MultimediaResolutionCompare() {
  return (
    <Svg width={W} height={H}>
      {RES.map((n, p) => {
        const x0 = XS[p]!;
        const cell = SIZE / n;
        const cells = [];
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            if (inShape((c + 0.5) / n, (r + 0.5) / n)) {
              cells.push(<rect key={`${r}-${c}`} x={x0 + c * cell} y={TOP + r * cell} width={cell + 0.3} height={cell + 0.3} className="dg-dot-accent" />);
            }
          }
        }
        const pixels = n * n;
        return (
          <g key={n}>
            <Label x={x0 + SIZE / 2} y={24} className="dg-text dg-bold">
              {`${n} × ${n} pixels`}
            </Label>
            {n <= 16 &&
              Array.from({ length: n - 1 }, (_, i) => (
                <g key={i}>
                  <line x1={x0 + (i + 1) * cell} y1={TOP} x2={x0 + (i + 1) * cell} y2={TOP + SIZE} className="dg-grid" />
                  <line x1={x0} y1={TOP + (i + 1) * cell} x2={x0 + SIZE} y2={TOP + (i + 1) * cell} className="dg-grid" />
                </g>
              ))}
            <g shapeRendering="crispEdges">{cells}</g>
            <path d={outline(x0)} className="dg-muted dg-dashed" />
            <rect x={x0} y={TOP} width={SIZE} height={SIZE} className="dg-thin" />
            <Label x={x0 + SIZE / 2} y={TOP + SIZE + 22} className="dg-text-small">
              {`${pixels} pixels`}
            </Label>
            <Label x={x0 + SIZE / 2} y={TOP + SIZE + 42} className="dg-text-small dg-text-muted">
              {`at 1 bit per pixel: ${pixels / 8} bytes`}
            </Label>
          </g>
        );
      })}
      <Label x={W / 2} y={H - 18} className="dg-text-small dg-text-accent">
        double the width and height → 4 × the pixels → 4 × the file size
      </Label>
    </Svg>
  );
}

export default MultimediaResolutionCompare;
