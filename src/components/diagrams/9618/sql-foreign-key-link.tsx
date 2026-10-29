/**
 * A foreign key: the child table's ClassID points at the parent table's primary key. The connector
 * runs outside both boxes, so no label crosses a table header.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-sql-foreign-key-link';

const W = 640;
const H = 372;

const PARENT = { x: 30, y: 50, w: 270, h: 106 };
const CHILD = { x: 30, y: 206, w: 290, h: 120 };

const PARENT_KEY_Y = 96;
const CHILD_KEY_Y = 302;

export function SqlForeignKeyLink() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        A foreign key points at the parent&apos;s primary key
      </Label>

      {/* Parent table */}
      <rect
        x={PARENT.x}
        y={PARENT.y}
        width={PARENT.w}
        height={PARENT.h}
        rx={8}
        className="dg-fill-surface dg-line"
      />
      <rect x={PARENT.x} y={PARENT.y} width={PARENT.w} height={26} rx={8} className="dg-fill-accent" />
      <rect x={PARENT.x} y={PARENT.y + 16} width={PARENT.w} height={10} className="dg-fill-accent" />
      <Label x={PARENT.x + 12} y={PARENT.y + 14} anchor="start" className="dg-text dg-bold">
        Class — parent table
      </Label>
      <Label x={PARENT.x + 12} y={PARENT_KEY_Y} anchor="start" className="dg-text-small dg-mono">
        ClassID
      </Label>
      <Label x={PARENT.x + 150} y={PARENT_KEY_Y} anchor="start" className="dg-text-small dg-text-accent">
        primary key
      </Label>
      <Label x={PARENT.x + 12} y={PARENT_KEY_Y + 26} anchor="start" className="dg-text-small dg-mono">
        Teacher
      </Label>
      <Label
        x={PARENT.x + 150}
        y={PARENT_KEY_Y + 26}
        anchor="start"
        className="dg-text-small dg-text-muted"
      >
        VARCHAR(40)
      </Label>

      {/* Child table */}
      <rect
        x={CHILD.x}
        y={CHILD.y}
        width={CHILD.w}
        height={CHILD.h}
        rx={8}
        className="dg-fill-surface dg-line"
      />
      <rect x={CHILD.x} y={CHILD.y} width={CHILD.w} height={26} rx={8} className="dg-fill-accent-2" />
      <rect x={CHILD.x} y={CHILD.y + 16} width={CHILD.w} height={10} className="dg-fill-accent-2" />
      <Label x={CHILD.x + 12} y={CHILD.y + 14} anchor="start" className="dg-text dg-bold">
        Student — child table
      </Label>
      <Label x={CHILD.x + 12} y={CHILD.y + 48} anchor="start" className="dg-text-small dg-mono">
        StudentID
      </Label>
      <Label x={CHILD.x + 150} y={CHILD.y + 48} anchor="start" className="dg-text-small dg-text-muted">
        primary key
      </Label>
      <Label x={CHILD.x + 12} y={CHILD.y + 74} anchor="start" className="dg-text-small dg-mono">
        Name
      </Label>
      <Label x={CHILD.x + 150} y={CHILD.y + 74} anchor="start" className="dg-text-small dg-text-muted">
        VARCHAR(30)
      </Label>
      <rect x={CHILD.x + 6} y={CHILD_KEY_Y - 10} width={CHILD.w - 12} height={20} className="dg-fill-surface dg-accent-2 dg-dashed" />
      <Label x={CHILD.x + 12} y={CHILD_KEY_Y} anchor="start" className="dg-text-small dg-mono">
        ClassID
      </Label>
      <Label
        x={CHILD.x + 150}
        y={CHILD_KEY_Y}
        anchor="start"
        className="dg-text-small dg-text-accent-2"
      >
        foreign key
      </Label>

      {/* The reference: out of the child, up the right-hand side, into the parent's key */}
      <path
        d={`M${CHILD.x + CHILD.w + 2},${CHILD_KEY_Y} L386,${CHILD_KEY_Y} L386,${PARENT_KEY_Y}`}
        className="dg-accent"
      />
      <Arrow
        x1={386}
        y1={PARENT_KEY_Y}
        x2={PARENT.x + PARENT.w + 4}
        y2={PARENT_KEY_Y}
        head={9}
        className="dg-accent"
        headClassName="dg-dot-accent"
      />

      <Label x={406} y={186} anchor="start" className="dg-text-small dg-text-accent">
        FOREIGN KEY (ClassID)
      </Label>
      <Label x={406} y={206} anchor="start" className="dg-text-small dg-text-accent">
        REFERENCES Class (ClassID)
      </Label>
      <Label x={406} y={230} anchor="start" className="dg-text-small dg-text-muted">
        the child&apos;s value must
      </Label>
      <Label x={406} y={246} anchor="start" className="dg-text-small dg-text-muted">
        already exist in the parent
      </Label>

      <Label x={W / 2} y={356} className="dg-text-small dg-text-muted">
        A ClassID that does not exist in Class is rejected — that is referential integrity.
      </Label>
    </Svg>
  );
}

export default SqlForeignKeyLink;
