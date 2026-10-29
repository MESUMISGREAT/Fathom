/**
 * What makes a computer fast: four speed-up bars comparing machine A (2.0 GHz,
 * 2 cores, 8-bit bus, no cache) with machine B (3.5 GHz, 8 cores, 64-bit bus,
 * large cache). The bars are drawn to scale within each factor, which shows how
 * much each factor grows; each row is labelled with the mechanism it improves.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-cpu-architecture-performance';

const W = 620;
const H = 400;
const X = 150;
const MAX = 320;

function bar(x: number, y: number, w: number, cls: string) {
  return <rect x={x} y={y} width={w} height={13} rx={3} className={cls} />;
}

export function CpuArchitecturePerformance() {
  return (
    <Svg width={W} height={H}>
      <rect x={20} y={32} width={12} height={12} rx={2} className="dg-fill-muted dg-thin" />
      <Label x={40} y={40} anchor="start" className="dg-text-small">
        A: 2.0 GHz · 2 cores · 8-bit bus · no cache
      </Label>
      <rect x={20} y={54} width={12} height={12} rx={2} className="dg-fill-accent dg-thin" />
      <Label x={40} y={62} anchor="start" className="dg-text-small">
        B: 3.5 GHz · 8 cores · 64-bit bus · large cache
      </Label>

      {/* clock speed */}
      <Label x={140} y={107} anchor="end" className="dg-text">
        clock speed
      </Label>
      {bar(X, 100, (2.0 / 3.5) * MAX, 'dg-fill-muted dg-thin')}
      {bar(X, 118, MAX, 'dg-fill-accent dg-thin')}
      <Label x={X + (2.0 / 3.5) * MAX + 8} y={107} anchor="start" className="dg-text-small">
        2.0 GHz
      </Label>
      <Label x={X + MAX + 8} y={125} anchor="start" className="dg-text-small">
        3.5 GHz
      </Label>
      <Label x={X} y={146} anchor="start" className="dg-text-small dg-text-muted">
        more cycles per second
      </Label>

      {/* cores */}
      <Label x={140} y={187} anchor="end" className="dg-text">
        cores
      </Label>
      {bar(X, 180, (2 / 8) * MAX, 'dg-fill-muted dg-thin')}
      {bar(X, 198, MAX, 'dg-fill-accent dg-thin')}
      <Label x={X + (2 / 8) * MAX + 8} y={187} anchor="start" className="dg-text-small">
        2
      </Label>
      <Label x={X + MAX + 8} y={205} anchor="start" className="dg-text-small">
        8
      </Label>
      <Label x={X} y={226} anchor="start" className="dg-text-small dg-text-muted">
        more instruction streams at once
      </Label>

      {/* bus width */}
      <Label x={140} y={267} anchor="end" className="dg-text">
        bus width
      </Label>
      {bar(X, 260, (8 / 64) * MAX, 'dg-fill-muted dg-thin')}
      {bar(X, 278, MAX, 'dg-fill-accent dg-thin')}
      <Label x={X + (8 / 64) * MAX + 8} y={267} anchor="start" className="dg-text-small">
        8-bit
      </Label>
      <Label x={X + MAX + 8} y={285} anchor="start" className="dg-text-small">
        64-bit
      </Label>
      <Label x={X} y={306} anchor="start" className="dg-text-small dg-text-muted">
        more bits per transfer
      </Label>

      {/* cache */}
      <Label x={140} y={347} anchor="end" className="dg-text">
        cache
      </Label>
      <Label x={X} y={347} anchor="start" className="dg-text-small">
        none
      </Label>
      {bar(X, 358, MAX, 'dg-fill-accent dg-thin')}
      <Label x={X + MAX + 8} y={365} anchor="start" className="dg-text-small">
        large
      </Label>
      <Label x={X} y={386} anchor="start" className="dg-text-small dg-text-muted">
        fewer waits for memory
      </Label>
    </Svg>
  );
}

export default CpuArchitecturePerformance;
