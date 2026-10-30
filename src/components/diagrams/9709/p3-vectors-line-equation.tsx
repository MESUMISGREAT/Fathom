/**
 * Vector line equation r = a + tb. Shows a 3D line with anchor point a, direction vector b,
 * and the running point r = a + tb for t = 0, 1, 2, -1.
 * Uses a simple 2D projection (x right, y up, z out of screen diagonal).
 */
import { Label, MathLabel, Svg, Arrow } from '../primitives';

export const diagramKey = 'p3-vectors-line-equation';

const W = 500;
const H = 400;

// 3D-ish projection: x right, y up, z out (diagonal up-left)
const origin = { x: 60, y: 320 };
const scale = 50;

interface Point2D { x: number; y: number; }

function proj(x: number, y: number, z: number): Point2D {
  return {
    x: origin.x + x * scale,
    y: origin.y - y * scale - z * scale * 0.5,
  };
}

function line3D(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): string {
  const p1: Point2D = proj(x1, y1, z1);
  const p2: Point2D = proj(x2, y2, z2);
  return `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} L${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
}

function dot3D(x: number, y: number, z: number, r: number, className: string) {
  const p: Point2D = proj(x, y, z);
  return <circle key={`dot-${x}-${y}-${z}`} cx={p.x} cy={p.y} r={r} className={className} />;
}

export default function P3VectorsLineEquation() {
  const a: [number, number, number] = [1, 1, 1];
  const b: [number, number, number] = [1.5, 0.8, 1.2];
  const ts: number[] = [0, 1, 2, -1];
  const points = ts.map(t => [
    a[0] + t * b[0],
    a[1] + t * b[1],
    a[2] + t * b[2],
  ]);

  // Line from t = -2.5 to t = 3.5
  const lineStart = [a[0] - 2.5 * b[0], a[1] - 2.5 * b[1], a[2] - 2.5 * b[2]] as const;
  const lineEnd = [a[0] + 3.5 * b[0], a[1] + 3.5 * b[1], a[2] + 3.5 * b[2]] as const;

  // Pre-compute projected points
  const aProj: Point2D = proj(a[0], a[1], a[2]);
  const aPlusBProj: Point2D = proj(a[0] + b[0], a[1] + b[1], a[2] + b[2]);
  const aMidBProj: Point2D = proj(a[0] + b[0] / 2, a[1] + b[1] / 2, a[2] + b[2] / 2);

  // Assert array types for TS
  const _bVec = b;

  // Axes projections
  const proj000: Point2D = proj(0, 0, 0);
  const proj500: Point2D = proj(5, 0, 0);
  const proj040: Point2D = proj(0, 4, 0);
  const proj004: Point2D = proj(0, 0, 4);

  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={22} tex="\mathbf{r} = \mathbf{a} + t\mathbf{b}" w={200} h={30} />
      <g transform="translate(40, 20)">
        {/* Axes */}
        <Arrow x1={proj000.x} y1={proj000.y} x2={proj500.x} y2={proj500.y} className="dg-thin" head={6} />
        <Arrow x1={proj000.x} y1={proj000.y} x2={proj040.x} y2={proj040.y} className="dg-thin" head={6} />
        <Arrow x1={proj000.x} y1={proj000.y} x2={proj004.x} y2={proj004.y} className="dg-thin" head={6} />
        <Label x={proj500.x + 8} y={proj500.y + 4} className="dg-text dg-italic">x</Label>
        <Label x={proj040.x - 12} y={proj040.y - 4} className="dg-text dg-italic">y</Label>
        <Label x={proj004.x + 8} y={proj004.y + 4} className="dg-text dg-italic">z</Label>
        <Label x={proj000.x - 8} y={proj000.y + 10} className="dg-text-small">O</Label>

        {/* Grid lines */}
        <g className="dg-grid">
          {[-1, 1, 2, 3, 4].map(x => {
            const p1: Point2D = proj(x, -1, 0);
            const p2: Point2D = proj(x, 4, 0);
            return <line key={`gx${x}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
          })}
          {[-1, 1, 2, 3, 4].map(y => {
            const p1: Point2D = proj(-1, y, 0);
            const p2: Point2D = proj(5, y, 0);
            return <line key={`gy${y}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
          })}
          {[-1, 1, 2, 3].map(z => {
            const p1: Point2D = proj(0, 0, z);
            const p2: Point2D = proj(5, 0, z);
            return <line key={`gz${z}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
          })}
        </g>

        {/* The line */}
        <path d={line3D(lineStart[0]!, lineStart[1]!, lineStart[2]!, lineEnd[0]!, lineEnd[1]!, lineEnd[2]!)} className="dg-accent" strokeWidth={2} />

        {/* Direction vector b from anchor a */}
        <Arrow
          x1={aProj.x}
          y1={aProj.y}
          x2={aPlusBProj.x}
          y2={aPlusBProj.y}
          className="dg-accent-2"
          head={8}
        />
        <MathLabel
          x={aMidBProj.x}
          y={aMidBProj.y}
          tex="\mathbf{b}"
          anchor="middle"
          w={40}
          h={24}
          size="small"
          tone="accent-2"
        />

        {/* Anchor point a */}
        {dot3D(a[0]!, a[1]!, a[2]!, 5, "dg-fill-surface dg-accent")}
        <MathLabel
          x={aProj.x - 12}
          y={aProj.y - 24}
          tex="\mathbf{a}"
          anchor="end"
          w={40}
          h={24}
          size="small"
          tone="accent"
        />

        {/* Points for different t values */}
        {points.map((pt, i) => {
          const t = ts[i]!;
          const color = t === 0 ? 'dg-accent' : t > 0 ? 'dg-accent-2' : 'dg-muted';
          const p: Point2D = proj(pt[0]!, pt[1]!, pt[2]!);
          return (
            <g key={t}>
              <circle cx={p.x} cy={p.y} r={4} className={`dg-dot-${color}`} />
              <MathLabel
                x={p.x + 8}
                y={p.y - 16}
                tex={`t = ${t}`}
                anchor="start"
                w={50}
                h={20}
                size="small"
                tone={color === 'dg-accent' ? 'accent' : color === 'dg-accent-2' ? 'accent-2' : 'muted'}
              />
            </g>
          );
        })}

        {/* Origin */}
        {dot3D(0, 0, 0, 3, "dg-dot-muted")}
      </g>
      <Label x={W / 2} y={H - 24} className="dg-text-small dg-bold">
        a = anchor point, b = direction, t \∈ \ℝ slides along the line
      </Label>
      <Label x={W / 2} y={H - 8} className="dg-text-small dg-text-muted">
        t = 0 gives a; t = 1 gives a + b; negative t goes backwards
      </Label>
    </Svg>
  );
}