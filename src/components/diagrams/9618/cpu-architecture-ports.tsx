/**
 * Ports and the signals they carry. USB sends data both ways and supplies power;
 * HDMI carries digital video and digital audio in one cable; VGA carries analogue
 * video only, with no audio at all.
 */
import { Arrow, Label, Svg } from '../primitives';
import { Box } from './cpu-architecture-kit';

export const diagramKey = 'cs-cpu-architecture-ports';

const W = 620;
const H = 330;

export function CpuArchitecturePorts() {
  return (
    <Svg width={W} height={H}>
      <Label x={130} y={46} className="dg-text-small dg-text-muted">
        digital
      </Label>
      <Label x={320} y={46} className="dg-text-small dg-text-muted">
        digital
      </Label>
      <Label x={510} y={46} className="dg-text-small dg-text-muted">
        analogue
      </Label>

      <Box x={60} y={60} w={140} h={66} title="USB" lines={['data + power']} />
      <Box x={250} y={60} w={140} h={66} title="HDMI" lines={['video + audio']} />
      <Box x={440} y={60} w={140} h={66} title="VGA" lines={['video only']} />

      <Label x={130} y={156} className="dg-text-small">
        data — both ways
      </Label>
      <Arrow x1={70} y1={170} x2={190} y2={170} double head={7} />
      <Label x={130} y={201} className="dg-text-small">
        power out to the device
      </Label>
      <Arrow x1={70} y1={215} x2={190} y2={215} head={7} />
      <Label x={130} y={255} className="dg-text-small dg-text-muted">
        hot-swappable
      </Label>
      <Label x={130} y={273} className="dg-text-small dg-text-muted">
        plug in while on
      </Label>

      <Label x={320} y={156} className="dg-text-small">
        digital video
      </Label>
      <Arrow x1={260} y1={170} x2={380} y2={170} head={7} />
      <Label x={320} y={201} className="dg-text-small">
        digital audio
      </Label>
      <Arrow x1={260} y1={215} x2={380} y2={215} head={7} />
      <Label x={320} y={255} className="dg-text-small dg-text-muted">
        one cable for
      </Label>
      <Label x={320} y={273} className="dg-text-small dg-text-muted">
        picture and sound
      </Label>

      <Label x={510} y={156} className="dg-text-small">
        analogue video
      </Label>
      <Arrow x1={450} y1={170} x2={570} y2={170} head={7} />
      <Label x={510} y={201} className="dg-text-small dg-text-accent-2">
        no audio
      </Label>
      <line x1={450} y1={215} x2={570} y2={215} className="dg-muted" />
      <line x1={502} y1={207} x2={518} y2={223} className="dg-accent-2" />
      <line x1={518} y1={207} x2={502} y2={223} className="dg-accent-2" />
      <Label x={510} y={255} className="dg-text-small dg-text-muted">
        sound needs
      </Label>
      <Label x={510} y={273} className="dg-text-small dg-text-muted">
        a separate cable
      </Label>
    </Svg>
  );
}

export default CpuArchitecturePorts;
