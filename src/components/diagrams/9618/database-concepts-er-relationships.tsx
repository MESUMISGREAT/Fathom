/**
 * The three relationship types. Cardinality is shown with 1 and M labels and
 * crow's feet. The many-to-many row shows the junction entity that turns one
 * M:N link into two 1:M links.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-database-concepts-er-relationships';

const W = 640;
const H = 350;

function Entity({ x, y, w, name }: { x: number; y: number; w: number; name: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={44} rx={6} className="dg-fill-accent dg-thin" />
      <Label x={x + w / 2} y={y + 22} className="dg-text-small dg-bold">
        {name}
      </Label>
    </g>
  );
}

/** Three short lines opening towards x, with the point at (px, py). */
function CrowFoot({ px, py, direction }: { px: number; py: number; direction: 'left' | 'right' }) {
  const dx = direction === 'right' ? 18 : -18;
  return (
    <g>
      <line x1={px + dx} y1={py} x2={px} y2={py - 15} className="dg-thin" />
      <line x1={px + dx} y1={py} x2={px} y2={py} className="dg-thin" />
      <line x1={px + dx} y1={py} x2={px} y2={py + 15} className="dg-thin" />
    </g>
  );
}

export function DatabaseConceptsErRelationships() {
  return (
    <Svg width={W} height={H}>
      {/* one-to-one */}
      <Entity x={40} y={50} w={110} name="Student" />
      <Entity x={250} y={50} w={140} name="StudentCard" />
      <line x1={150} y1={72} x2={250} y2={72} className="dg-line" />
      <Label x={168} y={58} className="dg-text-small dg-text-accent">
        1
      </Label>
      <Label x={228} y={58} className="dg-text-small dg-text-accent">
        1
      </Label>
      <Label x={320} y={118} className="dg-text-small dg-text-muted">
        one-to-one: one student has one card
      </Label>

      {/* one-to-many */}
      <Entity x={40} y={145} w={110} name="Customer" />
      <Entity x={250} y={145} w={110} name="Order" />
      <line x1={150} y1={167} x2={250} y2={167} className="dg-line" />
      <Label x={166} y={153} className="dg-text-small dg-text-accent">
        1
      </Label>
      <CrowFoot px={250} py={167} direction="right" />
      <Label x={320} y={213} className="dg-text-small dg-text-muted">
        one-to-many: one customer places many orders
      </Label>

      {/* many-to-many through a junction */}
      <Entity x={40} y={240} w={110} name="Student" />
      <Entity x={250} y={240} w={140} name="Enrolment" />
      <Entity x={440} y={240} w={110} name="Course" />
      <line x1={150} y1={262} x2={250} y2={262} className="dg-line" />
      <CrowFoot px={250} py={262} direction="right" />
      <line x1={390} y1={262} x2={440} y2={262} className="dg-line" />
      <CrowFoot px={390} py={262} direction="left" />
      <Label x={320} y={308} className="dg-text-small dg-text-muted">
        many-to-many: many students take many courses
      </Label>

      <Label x={320} y={336} className="dg-text-small">
        Enrolment is a junction table: the M:N link becomes two 1:M links.
      </Label>
    </Svg>
  );
}

export default DatabaseConceptsErRelationships;
