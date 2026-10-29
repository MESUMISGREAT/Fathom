/**
 * Origin of gas pressure: molecular collisions with the container walls.
 * Two panels of the same sealed box. Left, gas at a moderate temperature: molecules
 * (spheres) move in random straight lines; three are shown at the moment of impact on
 * the right-hand wall, each leaving a short push arrow into the wall. Right, the gas
 * after heating: the same molecules move faster (longer arrows), impacts are closer
 * together, and the pressure label is marked higher. Motion arrows are illustrative;
 * speeds are not drawn to scale.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'chem-gases-molecular-collisions';

const W = 640;
const H = 360;

type Mol = { x: number; y: number; dx: number; dy: number };

/** Deterministic molecule layout per panel (identical positions, different speeds). */
const MOLS: Mol[] = [
  { x: 40, y: 40, dx: 1, dy: 0.4 },
  { x: 110, y: 80, dx: 0.9, dy: -0.5 },
  { x: 180, y: 45, dx: 0.3, dy: 1 },
  { x: 60, y: 120, dx: 1, dy: 0.1 },
  { x: 150, y: 130, dx: 0.7, dy: 0.7 },
  { x: 220, y: 100, dx: 1, dy: -0.2 },
  { x: 95, y: 165, dx: -0.6, dy: -0.8 },
  { x: 195, y: 175, dx: 0.5, dy: -0.9 },
  { x: 45, y: 200, dx: 0.9, dy: -0.3 },
  { x: 130, y: 215, dx: 0.8, dy: 0.6 },
  { x: 225, y: 210, dx: -0.7, dy: 0.7 },
  { x: 175, y: 75, dx: -1, dy: -0.2 },
];

function Panel({
  x0,
  title,
  speed,
  impacts,
  caption,
}: {
  x0: number;
  title: string;
  /** Arrow-length multiplier for the molecular motion arrows. */
  speed: number;
  /** Number of impact marks drawn on the right wall. */
  impacts: number;
  caption: string;
}) {
  const ox = x0 + 30;
  const oy = 60;
  const bw = 240;
  const bh = 230;
  return (
    <g>
      <Label x={x0 + 150} y={28} className="dg-text dg-bold">
        {title}
      </Label>
      <rect x={ox} y={oy} width={bw} height={bh} rx={10} className="dg-line" />
      {MOLS.map((m, k) => {
        const len = 26 * speed;
        const n = Math.hypot(m.dx, m.dy);
        const ux = m.dx / n;
        const uy = m.dy / n;
        // start at the sphere's edge and clamp the tip inside the box
        const cx = ox + m.x;
        const cy = oy + m.y;
        const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
        const x2 = clamp(cx + ux * (9 + len), ox + 5, ox + bw - 5);
        const y2 = clamp(cy + uy * (9 + len), oy + 5, oy + bh - 5);
        return (
          <g key={k}>
            <circle cx={cx} cy={cy} r={7} className="dg-thin dg-fill-accent" />
            <Arrow
              x1={cx + ux * 9}
              y1={cy + uy * 9}
              x2={x2}
              y2={y2}
              head={7}
              className="dg-thin dg-dashed"
              headClassName="dg-dot"
            />
          </g>
        );
      })}
      {/* impact marks: a short push arrow into the right wall */}
      {Array.from({ length: impacts }, (_, k) => {
        const y = oy + 50 + k * (130 / Math.max(1, impacts - 1));
        return (
          <g key={`hit-${k}`}>
            <circle cx={ox + bw - 16} cy={y} r={7} className="dg-thin dg-fill-accent-2" />
            <Arrow x1={ox + bw - 30} y1={y} x2={ox + bw - 2} y2={y} head={8} className="dg-thin" headClassName="dg-dot" />
          </g>
        );
      })}
      <Label x={ox + bw - 44} y={oy - 14} className="dg-text-small dg-text-accent">
        wall
      </Label>
      <Label x={x0 + 150} y={oy + bh + 26} className="dg-text-small dg-text-muted">
        {caption}
      </Label>
    </g>
  );
}

export default function GasesMolecularCollisions() {
  return (
    <Svg width={W} height={H}>
      <Panel
        x0={10}
        title="Gas at moderate temperature"
        speed={1}
        impacts={3}
        caption="Each bounce pushes on the wall"
      />
      <Panel
        x0={330}
        title="The same gas, heated"
        speed={1.8}
        impacts={5}
        caption="Faster molecules: harder and more frequent hits"
      />
      <Label x={W / 2} y={H - 22} className="dg-text-small dg-bold">
        Billions of bounces per second give a steady force per unit area — the pressure.
      </Label>
    </Svg>
  );
}
