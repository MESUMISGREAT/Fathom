/**
 * Double entry (9618 6.2.3). Two operators type the same form independently; a comparison step
 * either accepts the matching record or flags a mismatch for re-entry against the source.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-data-integrity-double-entry';

const W = 640;
const H = 318;

export function DoubleEntryDiagram() {
  return (
    <Svg width={W} height={H}>
      <rect x={24} y={26} width={232} height={60} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={140} y={46} className="dg-text-small dg-bold">
        operator A
      </Label>
      <Label x={140} y={66} className="dg-text-small">
        types the form
      </Label>

      <rect x={384} y={26} width={232} height={60} rx={6} className="dg-fill-muted dg-thin" />
      <Label x={500} y={46} className="dg-text-small dg-bold">
        operator B
      </Label>
      <Label x={500} y={66} className="dg-text-small">
        types the same form
      </Label>

      <Arrow x1={140} y1={90} x2={140} y2={116} head={8} />
      <Arrow x1={500} y1={90} x2={500} y2={116} head={8} />

      <rect x={40} y={120} width={200} height={54} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={140} y={140} className="dg-text-small dg-bold">
        entry 1
      </Label>
      <Label x={140} y={160} className="dg-text-small dg-text-muted">
        first copy
      </Label>

      <rect x={400} y={120} width={200} height={54} rx={6} className="dg-fill-surface dg-thin" />
      <Label x={500} y={140} className="dg-text-small dg-bold">
        entry 2
      </Label>
      <Label x={500} y={160} className="dg-text-small dg-text-muted">
        second copy
      </Label>

      <Arrow x1={178} y1={176} x2={282} y2={214} head={8} />
      <Arrow x1={462} y1={176} x2={358} y2={214} head={8} />

      <rect x={236} y={218} width={170} height={52} rx={6} className="dg-fill-accent dg-thin" />
      <Label x={321} y={238} className="dg-text-small dg-bold">
        the system compares
      </Label>
      <Label x={321} y={258} className="dg-text-small">
        both copies
      </Label>

      <Arrow x1={321} y1={270} x2={321} y2={290} head={8} />
      <rect x={212} y={292} width={218} height={22} rx={4} className="dg-fill-muted dg-thin" />
      <Label x={321} y={303} className="dg-text-small">
        match → stored once
      </Label>

      <Arrow x1={410} y1={244} x2={446} y2={244} head={8} />
      <rect x={450} y={220} width={176} height={48} rx={6} className="dg-fill-accent-2 dg-thin" />
      <Label x={538} y={238} className="dg-text-small dg-bold">
        differ → flag
      </Label>
      <Label x={538} y={256} className="dg-text-small">
        re-enter, check the source
      </Label>

      <Label x={W / 2} y={16} className="dg-text-small dg-text-accent-2">
        operator B must not see entry 1
      </Label>
    </Svg>
  );
}

export default DoubleEntryDiagram;
