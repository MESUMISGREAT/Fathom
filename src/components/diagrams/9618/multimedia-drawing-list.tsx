/**
 * A vector graphic and the drawing list that defines it. The canvas has
 * coordinates 0-10 with (0, 0) at the top left and y increasing downwards.
 * Four drawing objects, drawn in list order:
 *   1 line      start (0, 9), end (10, 9), line colour accent, thickness 3
 *   2 rectangle corner (2, 5), width 4, height 4, fill colour accent-2
 *   3 polygon   points (1, 5), (4, 2), (7, 5), fill colour accent
 *   4 circle    centre (8.5, 2), radius 1, line colour accent-2, thickness 3
 * Colour properties are shown as swatches (not names) so the picture matches
 * the list in any theme.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-multimedia-drawing-list';

const W = 640;
const H = 340;
const X0 = 46;
const Y0 = 56;
const U = 22; // pixels per unit
const px = (x: number) => X0 + x * U;
const py = (y: number) => Y0 + y * U;

const list = [
  { name: 'line', geom: 'start (0, 9), end (10, 9)', style: 'line colour:', swatch: 'dg-dot-accent', extra: 'thickness: 3' },
  { name: 'rectangle', geom: 'corner (2, 5), width 4, height 4', style: 'fill colour:', swatch: 'dg-dot-accent-2', extra: '' },
  { name: 'polygon', geom: 'points (1, 5), (4, 2), (7, 5)', style: 'fill colour:', swatch: 'dg-dot-accent', extra: '' },
  { name: 'circle', geom: 'centre (8.5, 2), radius 1', style: 'line colour:', swatch: 'dg-dot-accent-2', extra: 'thickness: 3' },
];

function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} className="dg-fill-surface dg-thin" />
      <Label x={x} y={y + 1} className="dg-text-small dg-bold">
        {n}
      </Label>
    </g>
  );
}

export function MultimediaDrawingList() {
  const ticks = [0, 2, 4, 6, 8, 10];
  const lx = 330;
  return (
    <Svg width={W} height={H}>
      <Label x={px(5)} y={20} className="dg-text dg-bold">
        What you see
      </Label>
      {/* grid */}
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <line x1={px(i)} y1={py(0)} x2={px(i)} y2={py(10)} className="dg-grid" />
          <line x1={px(0)} y1={py(i)} x2={px(10)} y2={py(i)} className="dg-grid" />
        </g>
      ))}
      {ticks.map((t) => (
        <g key={t}>
          <Label x={px(t)} y={py(0) - 10} className="dg-text-small dg-text-muted">
            {t}
          </Label>
          <Label x={px(0) - 10} y={py(t)} anchor="end" className="dg-text-small dg-text-muted">
            {t}
          </Label>
        </g>
      ))}
      <rect x={px(0)} y={py(0)} width={10 * U} height={10 * U} className="dg-thin" />

      {/* drawing objects, in list order */}
      <line x1={px(0)} y1={py(9)} x2={px(10)} y2={py(9)} className="dg-accent" style={{ strokeWidth: 3 }} />
      <rect x={px(2)} y={py(5)} width={4 * U} height={4 * U} className="dg-dot-accent-2" />
      <polygon points={`${px(1)},${py(5)} ${px(4)},${py(2)} ${px(7)},${py(5)}`} className="dg-dot-accent" />
      <circle cx={px(8.5)} cy={py(2)} r={U} className="dg-accent-2" style={{ strokeWidth: 3 }} />

      <Badge x={px(8.6)} y={py(9.6)} n={1} />
      <Badge x={px(4)} y={py(7)} n={2} />
      <Badge x={px(4)} y={py(4)} n={3} />
      <Badge x={px(8.5)} y={py(3.7)} n={4} />

      <Label x={px(5)} y={py(10) + 20} className="dg-text-small dg-text-muted">
        (0, 0) is the top-left corner; y increases downwards
      </Label>

      {/* the drawing list */}
      <Label x={lx} y={20} anchor="start" className="dg-text dg-bold">
        What is stored: the drawing list
      </Label>
      <rect x={lx - 10} y={36} width={W - lx} height={262} rx={6} className="dg-fill-muted dg-thin" />
      {list.map((o, i) => {
        const y = 60 + i * 62;
        return (
          <g key={o.name}>
            <Badge x={lx + 6} y={y} n={i + 1} />
            <Label x={lx + 24} y={y} anchor="start" className="dg-text dg-bold">
              {o.name}
            </Label>
            <Label x={lx + 104} y={y} anchor="start" className="dg-text-small dg-text-muted">
              drawing object
            </Label>
            <Label x={lx + 24} y={y + 19} anchor="start" className="dg-text-small dg-mono">
              {o.geom}
            </Label>
            <Label x={lx + 24} y={y + 36} anchor="start" className="dg-text-small dg-mono">
              {o.style}
            </Label>
            <rect x={lx + 120} y={y + 30} width={22} height={12} rx={2} className={`${o.swatch} dg-thin`} />
            {o.extra && (
              <Label x={lx + 152} y={y + 36} anchor="start" className="dg-text-small dg-mono">
                {o.extra}
              </Label>
            )}
          </g>
        );
      })}
      <Label x={lx + (W - lx) / 2 - 5} y={316} className="dg-text-small dg-text-accent">
        mono text = properties of each object
      </Label>
    </Svg>
  );
}

export default MultimediaDrawingList;
