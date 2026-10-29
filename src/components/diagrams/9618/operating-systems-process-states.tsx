/**
 * The three process states and the transitions between them: ready to running
 * when the scheduler picks the process, back to ready when its time slice ends,
 * to blocked while it waits for input, and back to ready when the input arrives.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-operating-systems-process-states';

const W = 620;
const H = 230;
const BOX_W = 132;
const BOX_H = 54;
const Y = 76;
const CY = Y + BOX_H / 2;

const X_READY = 34;
const X_RUN = 244;
const X_BLOCKED = 454;

const GAP1 = (X_READY + BOX_W + X_RUN) / 2;
const GAP2 = (X_RUN + BOX_W + X_BLOCKED) / 2;

export function OperatingSystemsProcessStates() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        A process is always in one of three states
      </Label>

      {[
        { label: 'ready', x: X_READY },
        { label: 'running', x: X_RUN },
        { label: 'blocked', x: X_BLOCKED },
      ].map((s) => (
        <g key={s.label}>
          <rect x={s.x} y={Y} width={BOX_W} height={BOX_H} rx={8} className="dg-fill-muted dg-line" />
          <Label x={s.x + BOX_W / 2} y={CY + 1} className="dg-text dg-bold">
            {s.label}
          </Label>
        </g>
      ))}

      <Arrow x1={X_READY + BOX_W + 8} y1={CY - 11} x2={X_RUN - 8} y2={CY - 11} head={8} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={GAP1} y={CY - 30} className="dg-text-small dg-text-accent">
        scheduled
      </Label>

      <Arrow x1={X_RUN - 8} y1={CY + 13} x2={X_READY + BOX_W + 8} y2={CY + 13} head={8} className="dg-muted" headClassName="dg-dot" />
      <Label x={GAP1} y={CY + 38} className="dg-text-small dg-text-muted">
        slice ends
      </Label>

      <Arrow x1={X_RUN + BOX_W + 8} y1={CY - 11} x2={X_BLOCKED - 8} y2={CY - 11} head={8} className="dg-muted" headClassName="dg-dot" />
      <Label x={GAP2} y={CY - 30} className="dg-text-small dg-text-muted">
        waits
      </Label>

      <Arrow x1={X_BLOCKED - 8} y1={CY + 13} x2={X_RUN + BOX_W + 8} y2={CY + 13} head={8} className="dg-accent-2" headClassName="dg-dot-accent-2" />
      <Label x={GAP2} y={CY + 38} className="dg-text-small dg-text-accent-2">
        input ready
      </Label>

      <Label x={W / 2} y={H - 18} className="dg-text-small dg-text-muted">
        The scheduler moves processes between the states
      </Label>
    </Svg>
  );
}

export default OperatingSystemsProcessStates;
