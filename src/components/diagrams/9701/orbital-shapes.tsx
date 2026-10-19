/**
 * Shapes of s and p orbitals (boundary surfaces, nucleus at the centre).
 * Top: 1s and 2s are spheres; 2s is the same shape but larger.
 * Bottom: the three 2p orbitals are dumbbells (two lobes either side of the
 * nucleus) lying along the x, y and z axes, at right angles to each other.
 * The y axis is drawn receding into the page, so the 2p(y) lobes are
 * foreshortened. Lobe outline: r = R cos^1.5(φ), a teardrop close to a real
 * p-orbital boundary surface.
 */
import type { ReactNode } from 'react';
import { Label, Svg } from '../primitives';

export const diagramKey = 'chem-orbital-shapes';

const W = 600;
const H = 470;
const RY = 362; // centre line of the p-orbital row
const PX = [110, 300, 490];
const AX = 78; // half-length of the x and z axes
const DIAG: [number, number] = [Math.cos((35 * Math.PI) / 180), -Math.sin((35 * Math.PI) / 180)];
const DY = 58; // half-length of the receding y axis

/** One p lobe from (cx, cy) along unit vector u, foreshortened along u by `along`. */
function lobe(cx: number, cy: number, u: [number, number], R: number, along = 1): string {
  const w: [number, number] = [-u[1], u[0]];
  let d = '';
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const phi = -Math.PI / 2 + (Math.PI * i) / n;
    const r = R * Math.max(0, Math.cos(phi)) ** 1.5;
    const a = r * Math.cos(phi) * along;
    const b = r * Math.sin(phi);
    const x = cx + a * u[0] + b * w[0];
    const y = cy + a * u[1] + b * w[1];
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
  }
  return d + 'Z';
}

function Axes3D({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <line x1={cx - AX} y1={cy} x2={cx + AX} y2={cy} className="dg-muted" />
      <line x1={cx} y1={cy + AX - 8} x2={cx} y2={cy - AX + 8} className="dg-muted" />
      <line
        x1={cx - DY * DIAG[0]}
        y1={cy - DY * DIAG[1]}
        x2={cx + DY * DIAG[0]}
        y2={cy + DY * DIAG[1]}
        className="dg-muted dg-dashed"
      />
      <Label x={cx + AX + 9} y={cy} className="dg-text-muted dg-italic">
        x
      </Label>
      <Label x={cx + 10} y={cy - AX + 6} className="dg-text-muted dg-italic">
        z
      </Label>
      <Label x={cx + (DY + 10) * DIAG[0]} y={cy + (DY + 10) * DIAG[1]} className="dg-text-muted dg-italic">
        y
      </Label>
      <circle cx={cx} cy={cy} r={3} className="dg-dot" />
    </g>
  );
}

function PLabel({ x, axis }: { x: number; axis: string }): ReactNode {
  return (
    <text x={x} y={RY + 88} textAnchor="middle" dominantBaseline="middle" className="dg-text dg-bold">
      2p
      <tspan dy={5} className="dg-text-small dg-italic">
        {axis}
      </tspan>
    </text>
  );
}

export function OrbitalShapes() {
  const R = 64;
  return (
    <Svg width={W} height={H}>
      {/* s orbitals */}
      <Label x={W / 2} y={20} className="dg-text dg-bold">
        s orbitals: spherical
      </Label>
      {[
        { cx: 190, r: 40, name: '1s' },
        { cx: 400, r: 64, name: '2s' },
      ].map((s) => (
        <g key={s.name}>
          <circle cx={s.cx} cy={112} r={s.r} className="dg-line dg-fill-accent" />
          <ellipse cx={s.cx} cy={112} rx={s.r} ry={s.r * 0.28} className="dg-muted dg-dashed" />
          <circle cx={s.cx} cy={112} r={3} className="dg-dot" />
          <Label x={s.cx} y={196} className="dg-text dg-bold">
            {s.name}
          </Label>
        </g>
      ))}
      <Label x={W / 2} y={218} className="dg-text-muted">
        same shape; 2s is larger (its electrons are further out on average)
      </Label>

      <line x1={40} y1={240} x2={W - 40} y2={240} className="dg-grid" />

      {/* p orbitals */}
      <Label x={W / 2} y={258} className="dg-text dg-bold">
        p orbitals: dumbbell-shaped, at right angles to each other
      </Label>

      {/* 2p(x) */}
      <path d={lobe(PX[0]!, RY, [1, 0], R)} className="dg-line dg-fill-accent-2" />
      <path d={lobe(PX[0]!, RY, [-1, 0], R)} className="dg-line dg-fill-accent-2" />
      <Axes3D cx={PX[0]!} cy={RY} />
      <PLabel x={PX[0]!} axis="x" />

      {/* 2p(y): receding axis, so the lobes are foreshortened; back lobe first */}
      <path d={lobe(PX[1]!, RY, DIAG, R, 0.62)} className="dg-line dg-fill-accent-2" />
      <path d={lobe(PX[1]!, RY, [-DIAG[0], -DIAG[1]], R, 0.62)} className="dg-line dg-fill-accent-2" />
      <Axes3D cx={PX[1]!} cy={RY} />
      <PLabel x={PX[1]!} axis="y" />

      {/* 2p(z) */}
      <path d={lobe(PX[2]!, RY, [0, -1], R)} className="dg-line dg-fill-accent-2" />
      <path d={lobe(PX[2]!, RY, [0, 1], R)} className="dg-line dg-fill-accent-2" />
      <Axes3D cx={PX[2]!} cy={RY} />
      <PLabel x={PX[2]!} axis="z" />
    </Svg>
  );
}

export default OrbitalShapes;
