/**
 * Left: a full mesh of five devices A-E, each linked to all four others (10
 * links). The direct A-C link has failed (dashed, crossed), so the packet from
 * A to C is rerouted A -> B -> C (highlighted).
 * Right: a hybrid star-bus network. Two switches hang off a bus backbone with a
 * terminator at each end; each switch is the centre of a star of three hosts. A
 * packet from the left host of star 1 to the right host of star 2 goes host ->
 * switch 1 -> backbone -> switch 2 -> host (highlighted).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-networks-mesh-hybrid';

const W = 620;
const H = 330;
const CX = 150;
const CY = 176;
const R = 96;

const ids = ['A', 'B', 'C', 'D', 'E'];
const node = (i: number) => {
  const a = ((-90 + 72 * i) * Math.PI) / 180;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
};

function Host({ x, y, label, accent }: { x: number; y: number; label?: string; accent?: boolean }) {
  return (
    <g>
      <rect x={x - 18} y={y - 12} width={36} height={24} rx={5} className="dg-fill-surface" />
      <rect x={x - 18} y={y - 12} width={36} height={24} rx={5} className={accent ? 'dg-fill-accent dg-accent' : 'dg-fill-muted dg-thin'} />
      {label && (
        <Label x={x} y={y} className="dg-text-small">
          {label}
        </Label>
      )}
    </g>
  );
}

export function NetworksMeshHybrid() {
  const n = ids.map((_, i) => node(i));
  const A = n[0]!;
  const B = n[1]!;
  const C = n[2]!;
  const mid = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
  const links: [number, number][] = [];
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) links.push([i, j]);

  const BB = 112;
  const s1 = 400;
  const s2 = 540;
  const HY = 262;
  const star1 = [352, 400, 448];
  const star2 = [492, 540, 588];
  return (
    <Svg width={W} height={H}>
      <Label x={150} y={20} className="dg-text dg-bold">
        Full mesh
      </Label>
      <Label x={470} y={20} className="dg-text dg-bold">
        Hybrid (star + bus)
      </Label>
      <line x1={310} y1={36} x2={310} y2={H - 10} className="dg-grid" />

      {/* mesh */}
      {links.map(([i, j]) =>
        i === 0 && j === 2 ? null : (
          <line key={`${i}${j}`} x1={n[i]!.x} y1={n[i]!.y} x2={n[j]!.x} y2={n[j]!.y} className="dg-thin" />
        ),
      )}
      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} className="dg-accent-2 dg-dashed" />
      <Label x={mid.x} y={mid.y} className="dg-text-accent-2">
        ✕
      </Label>
      <Arrow x1={A.x + 14} y1={A.y + 6} x2={B.x - 15} y2={B.y - 6} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={B.x - 4} y1={B.y + 16} x2={C.x + 8} y2={C.y - 15} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      {n.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={16} className="dg-fill-surface" />
          <circle cx={p.x} cy={p.y} r={16} className={i <= 2 && i !== 1 ? 'dg-fill-accent dg-accent' : 'dg-fill-muted dg-thin'} />
          <Label x={p.x} y={p.y} className="dg-text dg-bold">
            {ids[i]}
          </Label>
        </g>
      ))}
      <Label x={150} y={296} className="dg-text-small">
        link A–C fails, so the packet
      </Label>
      <Label x={150} y={314} className="dg-text-small">
        is rerouted A → B → C
      </Label>

      {/* hybrid */}
      <line x1={338} y1={BB} x2={602} y2={BB} className="dg-line" />
      <rect x={330} y={BB - 9} width={8} height={18} className="dg-dot" />
      <rect x={602} y={BB - 9} width={8} height={18} className="dg-dot" />
      <Label x={470} y={BB - 22} className="dg-text-small dg-text-muted">
        bus backbone
      </Label>
      {[...star1.map((x) => [s1, x] as const), ...star2.map((x) => [s2, x] as const)].map(([sx, hx]) => (
        <line key={hx} x1={sx} y1={182} x2={hx} y2={HY} className="dg-thin" />
      ))}
      <line x1={s1} y1={BB} x2={s1} y2={182} className="dg-thin" />
      <line x1={s2} y1={BB} x2={s2} y2={182} className="dg-thin" />
      {/* packet path */}
      <path d={`M${star1[0]},${HY - 12} L${s1},${182} L${s1},${BB} L${s2},${BB} L${s2},${182} L${star2[2]},${HY - 12}`} className="dg-accent" />
      {[s1, s2].map((sx) => (
        <g key={sx}>
          <rect x={sx - 30} y={168} width={60} height={28} rx={5} className="dg-fill-surface" />
          <rect x={sx - 30} y={168} width={60} height={28} rx={5} className="dg-fill-accent-2 dg-accent-2" />
          <Label x={sx} y={182} className="dg-text-small">
            switch
          </Label>
        </g>
      ))}
      {star1.map((x) => (
        <Host key={x} x={x} y={HY} accent={x === star1[0]} />
      ))}
      {star2.map((x) => (
        <Host key={x} x={x} y={HY} accent={x === star2[2]} />
      ))}
      <Label x={s1} y={HY + 28} className="dg-text-small dg-text-muted">
        star 1
      </Label>
      <Label x={s2} y={HY + 28} className="dg-text-small dg-text-muted">
        star 2
      </Label>
      <Label x={470} y={314} className="dg-text-small">
        host → switch → backbone → switch → host
      </Label>
    </Svg>
  );
}

export default NetworksMeshHybrid;
