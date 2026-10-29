/**
 * Two programs sharing one DLL, compared with static linking, where each
 * executable carries its own copy of the library code.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-operating-systems-dynamic-linking';

const W = 580;
const H = 300;

export function OperatingSystemsDynamicLinking() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={24} className="dg-text dg-bold">
        One DLL, many programs
      </Label>

      <rect x={30} y={64} width={120} height={44} rx={6} className="dg-fill-muted dg-line" />
      <Label x={90} y={87} className="dg-text-small dg-text">
        program A
      </Label>

      <rect x={30} y={146} width={120} height={44} rx={6} className="dg-fill-muted dg-line" />
      <Label x={90} y={169} className="dg-text-small dg-text">
        program B
      </Label>

      <rect x={232} y={92} width={150} height={70} rx={8} className="dg-fill-accent dg-line" />
      <Label x={307} y={117} className="dg-text dg-bold">
        shared DLL
      </Label>
      <Label x={307} y={139} className="dg-text-small dg-text">
        one copy in memory
      </Label>

      <Arrow x1={154} y1={86} x2={228} y2={112} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <Arrow x1={154} y1={168} x2={228} y2={142} head={8} className="dg-accent" headClassName="dg-dot-accent" />

      <rect x={416} y={82} width={146} height={108} rx={8} className="dg-fill-muted dg-line" />
      <Label x={489} y={102} className="dg-text-small dg-text dg-bold">
        static instead
      </Label>
      <Label x={489} y={180} className="dg-text-small dg-text-muted">
        bigger executables
      </Label>
      <rect x={432} y={112} width={114} height={20} className="dg-fill-accent-2 dg-thin" />
      <Label x={489} y={123} className="dg-text-small dg-text-muted">
        A + copy
      </Label>
      <rect x={432} y={138} width={114} height={20} className="dg-fill-accent-2 dg-thin" />
      <Label x={489} y={149} className="dg-text-small dg-text-muted">
        B + copy
      </Label>

      <rect x={232} y={198} width={150} height={38} rx={6} className="dg-fill-muted dg-line" />
      <Label x={307} y={218} className="dg-text-small dg-text-muted">
        loaded by the OS
      </Label>

      <Label x={W / 2} y={H - 16} className="dg-text-small dg-text-muted">
        Dynamic linking shares the code; static linking duplicates it
      </Label>
    </Svg>
  );
}

export default OperatingSystemsDynamicLinking;
