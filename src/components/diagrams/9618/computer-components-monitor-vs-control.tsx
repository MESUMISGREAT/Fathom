/**
 * Monitoring compared with control. Top row, a monitoring system: sensor, ADC, processor,
 * then an output such as a screen or alarm; it records and warns but changes nothing.
 * Bottom row, a control system: sensor, ADC, processor (which compares readings with stored
 * values), actuator, and the physical process it changes, such as the temperature of a room.
 * A dashed feedback arrow runs from the process back to the sensor: the sensor measures the
 * effect of the change, so the output affects the next input.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-monitor-vs-control';

const W = 620;
const H = 320;
const BW = 100;
const XS = [12, 132, 252, 372, 492];

function Box({ i, y, a, b, tone = 'dg-fill-muted dg-thin' }: { i: number; y: number; a: string; b?: string; tone?: string }) {
  const x = XS[i]!;
  return (
    <g>
      <rect x={x} y={y - 26} width={BW} height={52} rx={7} className={tone} />
      <Label x={x + BW / 2} y={b ? y - 8 : y} className="dg-text-small dg-bold">
        {a}
      </Label>
      {b && (
        <Label x={x + BW / 2} y={y + 10} className="dg-text-small">
          {b}
        </Label>
      )}
    </g>
  );
}

function Links({ y, n }: { y: number; n: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <Arrow key={i} x1={XS[i]! + BW + 1} y1={y} x2={XS[i + 1]! - 1} y2={y} head={7} />
      ))}
    </g>
  );
}

export function ComputerComponentsMonitorVsControl() {
  const y1 = 62;
  const y2 = 190;
  return (
    <Svg width={W} height={H}>
      <Label x={12} y={18} anchor="start" className="dg-text dg-bold">
        monitoring system
      </Label>
      <Box i={0} y={y1} a="sensor" b="measures" />
      <Box i={1} y={y1} a="ADC" b="to digital" />
      <Box i={2} y={y1} a="processor" b="records, checks" tone="dg-fill-accent dg-accent" />
      <Box i={3} y={y1} a="output" b="screen, alarm" />
      <Links y={y1} n={3} />
      <Label x={XS[4]! + 4} y={y1 - 8} anchor="start" className="dg-text-small dg-text-muted">
        watches and warns,
      </Label>
      <Label x={XS[4]! + 4} y={y1 + 8} anchor="start" className="dg-text-small dg-text-muted">
        changes nothing
      </Label>

      <Label x={12} y={y2 - 46} anchor="start" className="dg-text dg-bold">
        control system
      </Label>
      <Box i={0} y={y2} a="sensor" b="measures" />
      <Box i={1} y={y2} a="ADC" b="to digital" />
      <Box i={2} y={y2} a="processor" b="compares" tone="dg-fill-accent dg-accent" />
      <Box i={3} y={y2} a="actuator" b="motor, valve" tone="dg-fill-accent-2 dg-accent-2" />
      <Box i={4} y={y2} a="process" b="e.g. heats room" />
      <Links y={y2} n={4} />

      <path d={`M${XS[4]! + BW / 2},${y2 + 28} L${XS[4]! + BW / 2},${y2 + 70} L${XS[0]! + BW / 2},${y2 + 70} L${XS[0]! + BW / 2},${y2 + 40}`} className="dg-accent dg-dashed" />
      <Arrow x1={XS[0]! + BW / 2} y1={y2 + 44} x2={XS[0]! + BW / 2} y2={y2 + 28} head={9} className="dg-accent" headClassName="dg-dot-accent" />
      <Label x={W / 2} y={y2 + 88} className="dg-text-small dg-text-accent">
        feedback: the sensor measures the effect of the change
      </Label>
    </Svg>
  );
}

export default ComputerComponentsMonitorVsControl;
