/**
 * Newton's third law for a book on a table, drawn as two separate force diagrams so each force sits on
 * the object it acts on: left, the book with its weight W down and the table's push R up; right, the
 * table top with the book's push R down. The two forces labelled R are the third-law pair.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'forces-third-law-book';

const W = 600;
const H = 300;

function Up({ x, y, len, className }: { x: number; y: number; len: number; className: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y - len} className={className} strokeWidth={3} />
      <polygon points={`${x - 7},${y - len + 12} ${x + 7},${y - len + 12} ${x},${y - len}`} className={className.replace('dg-', 'dg-dot-')} />
    </g>
  );
}
function Down({ x, y, len, className }: { x: number; y: number; len: number; className: string }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={y + len} className={className} strokeWidth={3} />
      <polygon points={`${x - 7},${y + len - 12} ${x + 7},${y + len - 12} ${x},${y + len}`} className={className.replace('dg-', 'dg-dot-')} />
    </g>
  );
}

export default function ForcesThirdLawBook() {
  return (
    <Svg width={W} height={H}>
      {/* Book on its own */}
      <Label x={150} y={24} className="dg-text-small">
        forces on the book
      </Label>
      <rect x={95} y={120} width={110} height={40} rx={4} className="dg-fill-surface dg-line" strokeWidth={2} />
      <Label x={150} y={140} className="dg-text-small">
        book
      </Label>
      <Up x={130} y={120} len={70} className="dg-accent" />
      <Label x={140} y={58} anchor="start" className="dg-text-small dg-text-accent">
        R (table on book)
      </Label>
      <Down x={170} y={160} len={70} className="dg-accent-2" />
      <Label x={180} y={226} anchor="start" className="dg-text-small dg-text-accent-2">
        W (Earth on book)
      </Label>

      {/* Table on its own */}
      <Label x={450} y={24} className="dg-text-small">
        forces on the table
      </Label>
      <rect x={360} y={120} width={180} height={14} className="dg-fill-surface dg-line" strokeWidth={2} />
      <line x1={375} y1={134} x2={375} y2={220} className="dg-line" strokeWidth={2} />
      <line x1={525} y1={134} x2={525} y2={220} className="dg-line" strokeWidth={2} />
      <Label x={450} y={160} className="dg-text-small dg-text-muted">
        table
      </Label>
      <Down x={450} y={50} len={70} className="dg-accent" />
      <Label x={462} y={58} anchor="start" className="dg-text-small dg-text-accent">
        R (book on table)
      </Label>

      <line x1={300} y1={40} x2={300} y2={240} className="dg-grid" />
      <Label x={W / 2} y={274} className="dg-text-small dg-text-muted">
        The two forces R: same size, opposite directions, different objects.
      </Label>
    </Svg>
  );
}
