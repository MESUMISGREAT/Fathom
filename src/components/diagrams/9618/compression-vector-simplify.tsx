/**
 * Lossy compression of a vector path by simplification. Left: a wiggly
 * "coastline" path stored as 49 points (each point is an x, y pair in the
 * drawing list). Right: the same path after the Ramer-Douglas-Peucker
 * algorithm keeps only the points needed to stay within 4 units of the
 * original: 14 points. The original is drawn faintly underneath so the
 * closeness is visible. Below each panel: the number of coordinate values
 * stored (98 against 28).
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-vector-simplify';

const W = 620;
const H = 316;
const PW = 260; // inner width of each panel's path
const N = 49;
const EPS = 4;
const LEFT = 30;
const RIGHT = 330;
const TOP = 40; // path y offset

type P = { x: number; y: number };

const f = (x: number) => 80 + 30 * Math.sin(x / 38) + 11 * Math.sin(x / 11 + 1) + 4 * Math.sin(x / 5.3);
const original: P[] = Array.from({ length: N }, (_, i) => {
  const x = (PW * i) / (N - 1);
  return { x, y: f(x) };
});

function lineDist(p: P, a: P, b: P): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.abs(dy * p.x - dx * p.y + b.x * a.y - b.y * a.x) / Math.hypot(dx, dy);
}

/** Ramer-Douglas-Peucker: keep the fewest points that stay within eps of the original. */
function simplify(ps: P[], eps: number): P[] {
  if (ps.length < 3) return ps;
  let best = 0;
  let idx = 0;
  for (let i = 1; i < ps.length - 1; i++) {
    const d = lineDist(ps[i]!, ps[0]!, ps[ps.length - 1]!);
    if (d > best) {
      best = d;
      idx = i;
    }
  }
  if (best <= eps) return [ps[0]!, ps[ps.length - 1]!];
  const l = simplify(ps.slice(0, idx + 1), eps);
  const r = simplify(ps.slice(idx), eps);
  return [...l.slice(0, -1), ...r];
}

const simplified = simplify(original, EPS);

const pathD = (ps: P[], ox: number) =>
  ps.map((p, i) => `${i === 0 ? 'M' : 'L'}${(ox + p.x).toFixed(2)},${(TOP + p.y).toFixed(2)}`).join(' ');

function Panel({ ox, pts, title, faint }: { ox: number; pts: P[]; title: string; faint?: boolean }) {
  const cx = ox + PW / 2;
  return (
    <g>
      <Label x={cx} y={22} className="dg-text dg-bold">
        {title}
      </Label>
      <rect x={ox - 12} y={TOP + 22} width={PW + 24} height={134} rx={6} className="dg-fill-muted" />
      {faint && <path d={pathD(original, ox)} className="dg-muted dg-dashed" />}
      <path d={pathD(pts, ox)} className="dg-accent" />
      {pts.map((p, i) => (
        <circle key={i} cx={ox + p.x} cy={TOP + p.y} r={3} className="dg-dot" />
      ))}
      <Label x={cx} y={TOP + 182} className="dg-text">
        {`${pts.length} points`}
      </Label>
      <Label x={cx} y={TOP + 204} className="dg-text-muted">
        {`${pts.length} × 2 = ${pts.length * 2} coordinate values stored`}
      </Label>
    </g>
  );
}

export function CompressionVectorSimplify() {
  return (
    <Svg width={W} height={H}>
      <Panel ox={LEFT} pts={original} title="Original path" />
      <Panel ox={RIGHT} pts={simplified} title="Simplified path (lossy)" faint />
      <line x1={W / 2} y1={10} x2={W / 2} y2={H - 60} className="dg-grid" />
      <Label x={W / 2} y={H - 34} className="dg-text-accent">
        Fewer points = fewer numbers in the drawing list = a smaller file
      </Label>
      <Label x={W / 2} y={H - 12} className="dg-text-small dg-text-muted">
        {`Dashed: the original. Every original point stays within ${EPS} units of the new outline.`}
      </Label>
    </Svg>
  );
}

export default CompressionVectorSimplify;
