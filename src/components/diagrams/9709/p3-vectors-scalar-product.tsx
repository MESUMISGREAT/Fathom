/**
 * Scalar product applications: angle between vectors, perpendicular test, foot of perpendicular.
 * Three panels showing the key geometric interpretations.
 * Uses simple 2D projection (x right, y up, z out diagonal).
 */
import { Label, MathLabel, Svg, Arrow } from '../primitives';

export const diagramKey = 'p3-vectors-scalar-product';

const W = 680;
const H = 320;
const PANEL_W = 200;

const origin = { x: 40, y: 200 };
const scale = 40;

interface Point2D { x: number; y: number; }

function proj(x: number, y: number, z: number, panelX: number): Point2D {
  return {
    x: origin.x + panelX + x * scale,
    y: origin.y - y * scale - z * scale * 0.5,
  };
}

function line3D(panelX: number, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): string {
  const p1: Point2D = proj(x1, y1, z1, panelX);
  const p2: Point2D = proj(x2, y2, z2, panelX);
  return `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} L${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
}

function arrow3D(panelX: number, from: [number, number, number], to: [number, number, number], className: string) {
  const p1: Point2D = proj(from[0], from[1], from[2], panelX);
  const p2: Point2D = proj(to[0], to[1], to[2], panelX);
  return (
    <Arrow x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className={className} head={6} />
  );
}

function axes3D(panelX: number) {
  const o: Point2D = proj(0, 0, 0, panelX);
  const x: Point2D = proj(3.5, 0, 0, panelX);
  const y: Point2D = proj(0, 3.5, 0, panelX);
  const z: Point2D = proj(0, 0, 3.5, panelX);
  return (
    <g>
      <Arrow x1={o.x} y1={o.y} x2={x.x} y2={x.y} className="dg-thin" head={5} />
      <Arrow x1={o.x} y1={o.y} x2={y.x} y2={y.y} className="dg-thin" head={5} />
      <Arrow x1={o.x} y1={o.y} x2={z.x} y2={z.y} className="dg-thin" head={5} />
      <Label x={o.x - 8} y={o.y + 10} className="dg-text-small">O</Label>
    </g>
  );
}

function grid3D(panelX: number) {
  return (
    <g className="dg-grid">
      {[-0.5, 0.5, 1.5, 2.5, 3.5].map(x => {
        const p1: Point2D = proj(x, -0.5, 0, panelX);
        const p2: Point2D = proj(x, 3.5, 0, panelX);
        return <line key={`gx${panelX}-${x}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
      })}
      {[-0.5, 0.5, 1.5, 2.5, 3.5].map(y => {
        const p1: Point2D = proj(-0.5, y, 0, panelX);
        const p2: Point2D = proj(3.5, y, 0, panelX);
        return <line key={`gy${panelX}-${y}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
      })}
      {[-0.5, 0.5, 1.5, 2.5].map(z => {
        const p1: Point2D = proj(0, 0, z, panelX);
        const p2: Point2D = proj(3.5, 0, z, panelX);
        return <line key={`gz${panelX}-${z}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />;
      })}
    </g>
  );
}

const panel1 = {
  a: [2, 1, 0.5] as [number, number, number],
  b: [1, 2.5, 1] as [number, number, number],
};

const panel2 = {
  a: [2, 0, 1] as [number, number, number],
  b: [0, 2, -1] as [number, number, number],
};

const panel3 = {
  a: [1, 1, 0.5] as [number, number, number],
  d: [1.5, 1, 0.8] as [number, number, number],
  t: 1.2,
  p3pt: [2.5, 0.5, 2] as [number, number, number],
};

const panel3_f = [
  panel3.a[0]! + panel3.t * panel3.d[0]!,
  panel3.a[1]! + panel3.t * panel3.d[1]!,
  panel3.a[2]! + panel3.t * panel3.d[2]!,
] as const;

// Pre-compute all projections for panel 1
const p1_aHalfProj: Point2D = proj(panel1.a[0] * 0.5, panel1.a[1] * 0.5, panel1.a[2] * 0.5, 0);
const p1_bHalfProj: Point2D = proj(panel1.b[0] * 0.5, panel1.b[1] * 0.5, panel1.b[2] * 0.5, 0);
const p1_thetaProj: Point2D = proj(1.2, 0.8, 0.3, 0);

// Pre-compute all projections for panel 2
const p2_aHalfProj: Point2D = proj(panel2.a[0] * 0.5, panel2.a[1] * 0.5, panel2.a[2] * 0.5, 0);
const p2_bHalfProj: Point2D = proj(panel2.b[0] * 0.5, panel2.b[1] * 0.5, panel2.b[2] * 0.5, 0);

// Pre-compute all projections for panel 3
const p3ptProj: Point2D = proj(panel3.p3pt[0]!, panel3.p3pt[1]!, panel3.p3pt[2]!, 0);
const fProj: Point2D = proj(panel3_f[0]!, panel3_f[1]!, panel3_f[2]!, 0);
const rightAngleProj1: Point2D = proj(panel3_f[0]! - 0.15, panel3_f[1]! - 0.1, panel3_f[2]! - 0.05, 0);
const rightAngleProj2: Point2D = proj(panel3_f[0]! + 0.1, panel3_f[1]! - 0.1, panel3_f[2]! - 0.05, 0);

export default function P3VectorsScalarProduct() {
  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={20} tex="\mathbf{a} \cdot \mathbf{b} = |a||b|\cos\theta" w={300} h={30} />

      {/* Panel 1: Angle between vectors */}
      <g transform="translate(30, 50)">
        <Label x={PANEL_W / 2} y={-10} className="dg-text-small dg-bold" anchor="middle">Angle</Label>
        {grid3D(0)}
        {axes3D(0)}

        {arrow3D(0, [0, 0, 0], panel1.a, "dg-accent")}
        {arrow3D(0, [0, 0, 0], panel1.b, "dg-accent-2")}
        
        <MathLabel
          x={p1_aHalfProj.x}
          y={p1_aHalfProj.y}
          tex="\mathbf{a}"
          anchor="middle"
          w={40}
          h={20}
          size="small"
          tone="accent"
        />
        <MathLabel
          x={p1_bHalfProj.x}
          y={p1_bHalfProj.y}
          tex="\mathbf{b}"
          anchor="middle"
          w={40}
          h={20}
          size="small"
          tone="accent-2"
        />
        <MathLabel x={p1_thetaProj.x} y={p1_thetaProj.y} tex="\theta" anchor="middle" w={30} h={20} size="small" tone="muted" />
        <MathLabel x={PANEL_W / 2} y={210} tex="\mathbf{a} \cdot \mathbf{b} = |a||b|\cos\theta" anchor="middle" w={180} h={24} size="small" />
      </g>

      {/* Panel 2: Perpendicular vectors */}
      <g transform="translate(250, 50)">
        <Label x={PANEL_W / 2} y={-10} className="dg-text-small dg-bold" anchor="middle">Perpendicular</Label>
        {grid3D(0)}
        {axes3D(0)}

        {arrow3D(0, [0, 0, 0], panel2.a, "dg-accent")}
        {arrow3D(0, [0, 0, 0], panel2.b, "dg-accent-2")}
        
        <MathLabel
          x={p2_aHalfProj.x}
          y={p2_aHalfProj.y}
          tex="\mathbf{a}"
          anchor="middle"
          w={40}
          h={20}
          size="small"
          tone="accent"
        />
        <MathLabel
          x={p2_bHalfProj.x}
          y={p2_bHalfProj.y}
          tex="\mathbf{b}"
          anchor="middle"
          w={40}
          h={20}
          size="small"
          tone="accent-2"
        />
        {/* Right angle marker - approximate position */}
        <path d={line3D(0, 0.3, 0, 0.15, 0.6, 0, 0.3)} className="dg-line-muted" />
        <MathLabel x={PANEL_W / 2} y={210} tex="\mathbf{a} \cdot \mathbf{b} = 0 \iff \mathbf{a} \perp \mathbf{b}" anchor="middle" w={180} h={24} size="small" />
      </g>

      {/* Panel 3: Foot of perpendicular from point to line */}
      <g transform="translate(470, 50)">
        <Label x={PANEL_W / 2} y={-10} className="dg-text-small dg-bold" anchor="middle">Foot of \\perp</Label>
        {grid3D(0)}
        {axes3D(0)}

        {/* Line */}
        <path d={line3D(0,
          panel3.a[0] - 0.5 * panel3.d[0], panel3.a[1] - 0.5 * panel3.d[1], panel3.a[2] - 0.5 * panel3.d[2],
          panel3.a[0] + 2.5 * panel3.d[0], panel3.a[1] + 2.5 * panel3.d[1], panel3.a[2] + 2.5 * panel3.d[2]
        )} className="dg-accent" />

        {/* Point P */}
        <circle cx={p3ptProj.x} cy={p3ptProj.y} r={4} className="dg-dot-muted" />
        <MathLabel x={p3ptProj.x + 8} y={p3ptProj.y - 10} tex="P" anchor="start" w={20} h={20} size="small" tone="muted" />

        {/* Foot F */}
        <circle cx={fProj.x} cy={fProj.y} r={4} className="dg-dot-accent-2" />
        <MathLabel x={fProj.x - 10} y={fProj.y - 10} tex="F" anchor="end" w={20} h={20} size="small" tone="accent-2" />

        {/* Perpendicular segment PF */}
        <path d={line3D(0, panel3.p3pt[0]!, panel3.p3pt[1]!, panel3.p3pt[2]!, panel3_f[0]!, panel3_f[1]!, panel3_f[2]!)} className="dg-accent-2" strokeDasharray="4,2" />
        {/* Right angle at F - approximate */}
        <path d={`M${rightAngleProj1.x.toFixed(1)},${rightAngleProj1.y.toFixed(1)} L${rightAngleProj2.x.toFixed(1)},${rightAngleProj2.y.toFixed(1)}`} className="dg-line-muted" />

        <MathLabel x={PANEL_W / 2} y={210} tex="t = -((\mathbf{a}-\mathbf{p})\cdot \mathbf{d})/|\mathbf{d}|^2" anchor="middle" w={180} h={24} size="small" />
      </g>

      <Label x={W / 2} y={H - 25} className="dg-text-small dg-text-muted">
        Key formulae:
      </Label>
      <MathLabel x={W / 2} y={H - 10} tex="a\cdot b = a_1b_1 + a_2b_2 + a_3b_3" anchor="middle" w={300} h={24} size="small" tone="muted" />
      <MathLabel x={W / 2} y={H + 10} tex="\cos\theta = \frac{a\cdot b}{|a||b|}" anchor="middle" w={300} h={24} size="small" tone="muted" />
      <MathLabel x={W / 2} y={H + 30} tex="a \perp b \iff a\cdot b = 0" anchor="middle" w={300} h={24} size="small" tone="muted" />
      <MathLabel x={W / 2} y={H + 50} tex="t = -\frac{(a-p)\cdot d}{|d|^2}" anchor="middle" w={300} h={24} size="small" tone="muted" />
    </Svg>
  );
}