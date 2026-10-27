/**
 * The three buses. The address bus carries locations one way, out of the CPU; the
 * data bus carries the data itself both ways and is wider; the control bus carries
 * read/write commands and interrupt signals both ways. The buses run from the CPU
 * to main memory and the input/output devices.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Box } from './cpu-architecture-kit';

export const diagramKey = 'cs-cpu-architecture-buses';

const W = 620;
const H = 360;

export function CpuArchitectureBuses() {
  return (
    <Svg width={W} height={H}>
      <Box x={30} y={100} w={150} h={170} title="CPU" />

      <line x1={440} y1={110} x2={440} y2={260} className="dg-line" />

      <Box x={470} y={60} w={130} h={100} title="Main memory" />
      <Arrow x1={440} y1={110} x2={468} y2={110} head={7} />

      <Box x={470} y={210} w={130} h={100} title="Input/output" lines={['device']} />
      <Arrow x1={440} y1={250} x2={468} y2={250} head={7} />

      <Arrow x1={180} y1={120} x2={438} y2={120} head={8} />
      <Arrow x1={180} y1={180} x2={438} y2={180} double className="dg-accent" headClassName="dg-dot-accent" head={8} />
      <Arrow x1={180} y1={240} x2={438} y2={240} double head={8} />

      <Label x={310} y={104} className="dg-text-small">
        address bus — locations, out of the CPU
      </Label>
      <Label x={310} y={164} className="dg-text-small">
        data bus — data, both ways
      </Label>
      <Label x={310} y={224} className="dg-text-small">
        control bus — read / write / interrupt
      </Label>
    </Svg>
  );
}

export default CpuArchitectureBuses;
