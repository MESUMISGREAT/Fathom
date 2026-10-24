/**
 * An embedded system inside a washing machine. The microcontroller (centre) holds a
 * processor, ROM with the fixed control program, RAM for settings and readings, and
 * input/output ports on one chip. Sensors and the control panel feed in from the left;
 * the motor, water valve, heater and display are driven from the right. The whole system
 * does one dedicated job: running wash programs.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-microcontroller';

const W = 620;
const H = 340;

const inputs = ['door sensor', 'water level sensor', 'temperature sensor', 'buttons and dial'];
const outputs = ['drum motor', 'water valve', 'heater', 'display'];
const ys = [108, 152, 196, 240];

function Part({ x, y, title, sub }: { x: number; y: number; title: string; sub: [string, string] }) {
  return (
    <g>
      <rect x={x} y={y} width={76} height={62} rx={5} className="dg-fill-surface" />
      <rect x={x} y={y} width={76} height={62} rx={5} className="dg-fill-muted dg-thin" />
      <Label x={x + 38} y={y + 18} className="dg-text dg-bold">
        {title}
      </Label>
      <Label x={x + 38} y={y + 36} className="dg-text-small">
        {sub[0]}
      </Label>
      <Label x={x + 38} y={y + 50} className="dg-text-small">
        {sub[1]}
      </Label>
    </g>
  );
}

export function ComputerComponentsMicrocontroller() {
  return (
    <Svg width={W} height={H}>
      <rect x={8} y={30} width={604} height={300} rx={16} className="dg-muted" />
      <Label x={24} y={50} anchor="start" className="dg-text-small dg-text-muted">
        washing machine: the larger device
      </Label>

      {/* microcontroller chip */}
      <rect x={222} y={70} width={176} height={210} rx={10} className="dg-fill-accent dg-accent" />
      <Label x={310} y={88} className="dg-text dg-bold">
        microcontroller
      </Label>
      <Part x={228} y={104} title="CPU" sub={['runs the', 'program']} />
      <Part x={316} y={104} title="ROM" sub={['control', 'program']} />
      <Part x={228} y={176} title="RAM" sub={['settings,', 'readings']} />
      <Part x={316} y={176} title="I/O" sub={['ports to', 'outside']} />
      <Label x={310} y={262} className="dg-text-small">
        all on one chip
      </Label>

      {inputs.map((t, i) => (
        <g key={t}>
          <Label x={154} y={ys[i]!} anchor="end" className="dg-text-small">
            {t}
          </Label>
          <Arrow x1={160} y1={ys[i]!} x2={220} y2={ys[i]!} head={7} className="dg-muted" />
        </g>
      ))}
      {outputs.map((t, i) => (
        <g key={t}>
          <Arrow x1={400} y1={ys[i]!} x2={460} y2={ys[i]!} head={7} className="dg-muted" />
          <Label x={466} y={ys[i]!} anchor="start" className="dg-text-small">
            {t}
          </Label>
        </g>
      ))}
      <Label x={100} y={78} className="dg-text-small dg-text-accent">
        inputs
      </Label>
      <Label x={520} y={78} className="dg-text-small dg-text-accent">
        outputs
      </Label>
      <Label x={310} y={308} className="dg-text-small dg-text-muted">
        one dedicated task: run the wash programs
      </Label>
    </Svg>
  );
}

export default ComputerComponentsMicrocontroller;
