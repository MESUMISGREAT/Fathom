/**
 * The Von Neumann model: a CPU (Control Unit + ALU) and one main memory holding
 * both instructions and data. Input devices feed data in; output devices take
 * results out. Address, data and control buses join the CPU to memory.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Box } from './cpu-architecture-kit';

export const diagramKey = 'cs-cpu-architecture-von-neumann';

const W = 640;
const H = 400;

export function CpuArchitectureVonNeumann() {
  return (
    <Svg width={W} height={H}>
      <rect x={168} y={60} width={248} height={240} rx={14} className="dg-fill-accent dg-accent" />
      <Label x={292} y={86} className="dg-text dg-bold">
        CPU
      </Label>
      <Box x={184} y={110} w={82} h={80} title="Control" lines={['Unit']} />
      <Box x={318} y={110} w={82} h={80} title="ALU" lines={['arithmetic', '+ logic']} />
      <Arrow x1={266} y1={150} x2={318} y2={150} double head={7} />

      <Box x={476} y={90} w={150} h={150} title="Main memory" lines={['instructions', 'and data', 'in one store']} />
      <Box x={14} y={90} w={120} h={90} title="Input" lines={['devices', 'keyboard', 'sensor']} />
      <Box x={14} y={230} w={120} h={90} title="Output" lines={['devices', 'screen', 'speaker']} />

      <Arrow x1={134} y1={135} x2={166} y2={135} head={8} />
      <Arrow x1={166} y1={275} x2={136} y2={275} head={8} />

      <Arrow x1={416} y1={130} x2={474} y2={130} head={8} />
      <Arrow x1={416} y1={170} x2={474} y2={170} double head={8} />
      <Arrow x1={416} y1={210} x2={474} y2={210} double head={8} />
      <Label x={445} y={116} className="dg-text-small">
        address
      </Label>
      <Label x={445} y={156} className="dg-text-small">
        data
      </Label>
      <Label x={445} y={196} className="dg-text-small">
        control
      </Label>
    </Svg>
  );
}

export default CpuArchitectureVonNeumann;
