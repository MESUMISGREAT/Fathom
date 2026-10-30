/**
 * Three relationships between two lines in 3D: parallel, intersecting, skew.
 * Each panel draws a wire-frame box in oblique projection so depth is visible. The skew panel
 * shows the "bridge over a road" picture: in the drawing the lines appear to cross, but a dashed
 * vertical gap shows that one line runs along the floor and the other along the roof.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'p3-vectors-line-relationships';

const W = 660;
const H = 290;
const BOX = { w: 130, d: 70, h: 90 }; // width (x), depth (y), height (z) in viewBox units

/** Oblique projection of (x, y, z) inside a panel whose front-bottom-left corner is (ox, oy). */
function project(ox: number, oy: number, x: number, y: number, z: number): [number, number] {
  return [ox + x + 0.6 * y, oy - z - 0.45 * y];
}

function Box({ ox, oy }: { ox: number; oy: number }) {
  const p = (x: number, y: number, z: number) => project(ox, oy, x, y, z);
  const { w, d, h } = BOX;
  const edges: [number, number, number, number, number, number][] = [
    [0, 0, 0, w, 0, 0], [0, 0, h, w, 0, h], [0, d, h, w, d, h], [0, 0, 0, 0, 0, h],
    [w, 0, 0, w, 0, h], [w, 0, 0, w, d, 0], [w, d, 0, w, d, h], [0, 0, h, 0, d, h], [w, 0, h, w, d, h],
  ];
  const hidden: [number, number, number, number, number, number][] = [
    [0, 0, 0, 0, d, 0], [0, d, 0, w, d, 0], [0, d, 0, 0, d, h],
  ];
  const seg = ([a, b, c, e, f, g]: [number, number, number, number, number, number], cls: string, k: number) => {
    const [x1, y1] = p(a, b, c);
    const [x2, y2] = p(e, f, g);
    return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className={cls} />;
  };
  return (
    <g>
      {edges.map((e, k) => seg(e, 'dg-grid', k))}
      {hidden.map((e, k) => seg(e, 'dg-grid dg-dashed', 100 + k))}
    </g>
  );
}

function Line3({ ox, oy, from, to, cls }: { ox: number; oy: number; from: [number, number, number]; to: [number, number, number]; cls: string }) {
  const [x1, y1] = project(ox, oy, from[0], from[1], from[2]);
  const [x2, y2] = project(ox, oy, to[0], to[1], to[2]);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={cls} strokeWidth={3} />;
}

export function LineRelationships() {
  const oy = 215;
  const panels = [20, 240, 460] as const;
  const { w, d, h } = BOX;
  const meet = project(panels[1], oy, w / 2, d / 2, h / 2);
  // Skew: line A along the floor's front-to-back middle, line B along the roof, left to right.
  const floorMid = project(panels[2], oy, w / 2, d / 2, 0);
  const roofMid = project(panels[2], oy, w / 2, d / 2, h);
  return (
    <Svg width={W} height={H}>
      <Label x={110} y={24} className="dg-text dg-bold">
        Parallel
      </Label>
      <Box ox={panels[0]} oy={oy} />
      <Line3 ox={panels[0]} oy={oy} from={[0, 15, 20]} to={[w, 15, 70]} cls="dg-accent" />
      <Line3 ox={panels[0]} oy={oy} from={[0, 55, 20]} to={[w, 55, 70]} cls="dg-accent-2" />
      <Label x={110} y={252} className="dg-text-small dg-text-muted">
        same direction, never meet
      </Label>

      <Label x={330} y={24} className="dg-text dg-bold">
        Intersecting
      </Label>
      <Box ox={panels[1]} oy={oy} />
      <Line3 ox={panels[1]} oy={oy} from={[0, 0, 0]} to={[w, d, h]} cls="dg-accent" />
      <Line3 ox={panels[1]} oy={oy} from={[0, 0, h]} to={[w, d, 0]} cls="dg-accent-2" />
      <circle cx={meet[0]} cy={meet[1]} r={5} className="dg-dot" />
      <Label x={meet[0]} y={meet[1] + 22} className="dg-text-small">
        shared point
      </Label>
      <Label x={330} y={252} className="dg-text-small dg-text-muted">
        meet at exactly one point
      </Label>

      <Label x={550} y={24} className="dg-text dg-bold">
        Skew
      </Label>
      <Box ox={panels[2]} oy={oy} />
      <Line3 ox={panels[2]} oy={oy} from={[w / 2, 0, 0]} to={[w / 2, d, 0]} cls="dg-accent" />
      <Line3 ox={panels[2]} oy={oy} from={[0, d / 2, h]} to={[w, d / 2, h]} cls="dg-accent-2" />
      <line x1={floorMid[0]} y1={floorMid[1]} x2={roofMid[0]} y2={roofMid[1]} className="dg-muted dg-dashed" />
      <Label x={roofMid[0] + 8} y={(floorMid[1] + roofMid[1]) / 2} anchor="start" className="dg-text-small">
        gap
      </Label>
      <Label x={550} y={252} className="dg-text-small dg-text-muted">
        not parallel, yet
      </Label>
      <Label x={550} y={270} className="dg-text-small dg-text-muted">
        never meet
      </Label>
    </Svg>
  );
}

export default LineRelationships;
