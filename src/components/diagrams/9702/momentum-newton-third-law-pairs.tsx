/**
 * Newton's third law pairs for a book resting on a table, drawn as separate
 * free-body diagrams for the book, the table and the Earth. All four forces
 * have the same size (the book's weight), so all arrows have the same length.
 *   Gravitational pair (accent): the Earth pulls the book down (W, on the
 *     book); the book pulls the Earth up (on the Earth).
 *   Contact pair (accent-2): the table pushes the book up (N, on the book);
 *     the book pushes the table down (on the table).
 * N and W both act on the book, so they are not a third-law pair.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'phys-momentum-newton-third-law-pairs';

const W = 640;
const H = 330;
const L = 66; // every force has the same size

export function MomentumNewtonThirdLawPairs() {
  // book
  const bx = 106;
  const by = 140;
  // table top surface
  const tx = 320;
  const ty = 150;
  // Earth: circle centre (ex, ey), radius R; draw its top cap
  const ex = 530;
  const R = 230;
  const ey = 196 + R;
  const half = 92;
  const capY = ey - Math.sqrt(R * R - half * half);

  return (
    <Svg width={W} height={H}>
      <Label x={bx} y={22} className="dg-text dg-bold">
        On the book
      </Label>
      <Label x={tx} y={22} className="dg-text dg-bold">
        On the table
      </Label>
      <Label x={ex} y={22} className="dg-text dg-bold">
        On the Earth
      </Label>
      <line x1={212} y1={36} x2={212} y2={250} className="dg-grid" />
      <line x1={428} y1={36} x2={428} y2={250} className="dg-grid" />

      {/* ---- the book: two forces, two different pairs ---- */}
      <rect x={bx - 32} y={by - 13} width={64} height={26} className="dg-fill-muted dg-thin" />
      <Label x={bx} y={by} className="dg-text-small">
        book
      </Label>
      <Arrow x1={bx + 14} y1={by - 13} x2={bx + 14} y2={by - 13 - L} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Arrow x1={bx - 14} y1={by + 13} x2={bx - 14} y2={by + 13 + L} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={bx + 24} y={by - 62} anchor="start" className="dg-text-accent-2">
        N
      </Label>
      <Label x={bx + 24} y={by - 44} anchor="start" className="dg-text-small">
        table pushes
      </Label>
      <Label x={bx + 24} y={by - 30} anchor="start" className="dg-text-small">
        book up
      </Label>
      <Label x={bx - 24} y={by + 44} anchor="end" className="dg-text-accent">
        W
      </Label>
      <Label x={bx - 24} y={by + 62} anchor="end" className="dg-text-small">
        Earth pulls
      </Label>
      <Label x={bx - 24} y={by + 76} anchor="end" className="dg-text-small">
        book down
      </Label>

      {/* ---- the table: pushed down by the book ---- */}
      <rect x={tx - 62} y={ty} width={124} height={11} className="dg-fill-muted dg-thin" />
      <line x1={tx - 52} y1={ty + 11} x2={tx - 52} y2={ty + 78} className="dg-thin" />
      <line x1={tx + 52} y1={ty + 11} x2={tx + 52} y2={ty + 78} className="dg-thin" />
      <Label x={tx + 10} y={ty - 44} anchor="start" className="dg-text-small">
        book pushes
      </Label>
      <Label x={tx + 10} y={ty - 30} anchor="start" className="dg-text-small">
        table down
      </Label>
      {/* a push on the table top: the arrow ends on the surface it acts on */}
      <Arrow x1={tx} y1={ty - L} x2={tx} y2={ty} className="dg-accent-2" headClassName="dg-dot-accent-2" />

      {/* ---- the Earth: pulled up by the book ---- */}
      <path
        d={`M${ex - half},${capY.toFixed(2)} A${R},${R} 0 0 1 ${ex + half},${capY.toFixed(2)} L${ex + half},250 L${ex - half},250 Z`}
        className="dg-fill-muted dg-thin"
      />
      <Label x={ex} y={232} className="dg-text-small">
        Earth
      </Label>
      <Arrow x1={ex} y1={ey - R + 4} x2={ex} y2={ey - R + 4 - L} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={ex + 10} y={ey - R - 44} anchor="start" className="dg-text-small">
        book pulls
      </Label>
      <Label x={ex + 10} y={ey - R - 30} anchor="start" className="dg-text-small">
        Earth up
      </Label>

      {/* ---- key ---- */}
      <line x1={20} y1={272} x2={44} y2={272} className="dg-accent" />
      <Label x={52} y={272} anchor="start" className="dg-text-small">
        pair 1, gravitational: Earth on book (down) and book on Earth (up)
      </Label>
      <line x1={20} y1={292} x2={44} y2={292} className="dg-accent-2" />
      <Label x={52} y={292} anchor="start" className="dg-text-small">
        pair 2, contact: table on book (up) and book on table (down)
      </Label>
      <Label x={20} y={316} anchor="start" className="dg-text-small dg-bold">
        N and W both act on the book, so they are NOT a third-law pair
      </Label>
    </Svg>
  );
}

export default MomentumNewtonThirdLawPairs;
