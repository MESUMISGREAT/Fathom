/**
 * Three line relationships in 3D: parallel, intersecting, skew.
 * Three panels side by side showing each case.
 * Uses a simple 2D projection (x right, y up, z out diagonal).
 */
import { Label, MathLabel, Svg, Arrow } from '../primitives';

export const diagramKey = 'p3-vectors-line-relationships';

const W = 680;
const H = 300;
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

interface PanelConfig {
  title: string;
  a1: [number, number, number];
  b1: [number, number, number];
  a2: [number, number, number];
  b2: [number, number, number];
  color: string;
}

const panelConfig: PanelConfig[] = [
  {
    title: 'Parallel',
    a1: [0.5, 1, 0.5],
    b1: [1.5, 0.5, 0.8],
    a2: [2, 2.5, 2],
    b2: [1.5, 0.5, 0.8], // same direction
    color: 'dg-accent',
  },
  {
    title: 'Intersecting',
    a1: [0.5, 1, 0.5],
    b1: [1.5, 0.5, 0.8],
    a2: [2.5, 0.5, 2],
    b2: [0.5, 1.5, -0.5], // different direction, they cross
    color: 'dg-accent-2',
  },
  {
    title: 'Skew',
    a1: [0.5, 0.5, 0.5],
    b1: [1.5, 0, 0.8], // mostly horizontal
    a2: [1.5, 2.5, 1.5],
    b2: [0, 1.5, 0.5], // vertical-ish, different plane
    color: 'dg-muted',
  },
];

export default function P3VectorsLineRelationships() {
  return (
    <Svg width={W} height={H}>
      <MathLabel x={W / 2} y={20} tex="Line relationships in 3D" w={200} h={28} />

      {panelConfig.map((cfg, idx) => {
        const panelX = 20 + idx * (PANEL_W + 20);
        const intersectT = 0.8; // approximate intersection parameter
        const intersectionPoint = [
          cfg.a1[0]! + intersectT * cfg.b1[0]!,
          cfg.a1[1]! + intersectT * cfg.b1[1]!,
          cfg.a1[2]! + intersectT * cfg.b1[2]!,
        ];

        const a1Proj: Point2D = proj(cfg.a1[0]!, cfg.a1[1]!, cfg.a1[2]!, panelX);
        const a1PlusB1Proj: Point2D = proj(cfg.a1[0]! + cfg.b1[0]!, cfg.a1[1]! + cfg.b1[1]!, cfg.a1[2]! + cfg.b1[2]!, panelX);
        const a2Proj: Point2D = proj(cfg.a2[0]!, cfg.a2[1]!, cfg.a2[2]!, panelX);
        const a2PlusB2Proj: Point2D = proj(cfg.a2[0]! + cfg.b2[0]!, cfg.a2[1]! + cfg.b2[1]!, cfg.a2[2]! + cfg.b2[2]!, panelX);
        const intersectionProj: Point2D = proj(intersectionPoint[0]!, intersectionPoint[1]!, intersectionPoint[2]!, panelX);

        return (
          <g key={idx} transform={`translate(${panelX}, 40)`}>
            <Label x={PANEL_W / 2} y={-10} className="dg-text-small dg-bold" anchor="middle">
              {cfg.title}
            </Label>
            {grid3D(panelX)}
            {axes3D(panelX)}

            {/* Line 1 */}
            <path
              d={line3D(panelX,
                cfg.a1[0]! - 0.5 * cfg.b1[0]!, cfg.a1[1]! - 0.5 * cfg.b1[1]!, cfg.a1[2]! - 0.5 * cfg.b1[2]!,
                cfg.a1[0]! + 2.5 * cfg.b1[0]!, cfg.a1[1]! + 2.5 * cfg.b1[1]!, cfg.a1[2]! + 2.5 * cfg.b1[2]!
              )}
              className="dg-accent"
            />

            {/* Line 2 */}
            <path
              d={line3D(panelX,
                cfg.a2[0]! - 0.5 * cfg.b2[0]!, cfg.a2[1]! - 0.5 * cfg.b2[1]!, cfg.a2[2]! - 0.5 * cfg.b2[2]!,
                cfg.a2[0]! + 2.5 * cfg.b2[0]!, cfg.a2[1]! + 2.5 * cfg.b2[1]!, cfg.a2[2]! + 2.5 * cfg.b2[2]!
              )}
              className={cfg.color === 'dg-accent' ? 'dg-accent' : cfg.color === 'dg-accent-2' ? 'dg-accent-2' : 'dg-muted'}
            />

            {/* Intersection point for intersecting case */}
            {cfg.title === 'Intersecting' && (
              <circle
                cx={intersectionProj.x}
                cy={intersectionProj.y}
                r={5}
                className="dg-dot-accent-2"
              />
            )}

            {/* Arrow showing direction for parallel case */}
            {cfg.title === 'Parallel' && (
              <>
                <Arrow
                  x1={a1Proj.x}
                  y1={a1Proj.y}
                  x2={a1PlusB1Proj.x}
                  y2={a1PlusB1Proj.y}
                  className="dg-accent"
                  head={5}
                />
                <Arrow
                  x1={a2Proj.x}
                  y1={a2Proj.y}
                  x2={a2PlusB2Proj.x}
                  y2={a2PlusB2Proj.y}
                  className="dg-accent"
                  head={5}
                />
              </>
            )}
          </g>
        );
      })}

      <Label x={W / 2} y={H - 12} className="dg-text-small dg-text-muted">
        Parallel: b\u2082 = k b\u2081 | Intersect: \u2203 t,s with a\u2081+tb\u2081 = a\u2082+sb\u2082 | Skew: neither parallel nor intersecting
      </Label>
    </Svg>
  );
}