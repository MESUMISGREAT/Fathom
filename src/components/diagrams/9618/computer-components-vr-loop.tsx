/**
 * The loop inside a virtual reality headset, drawn as four boxes joined clockwise by arrows:
 * 1 sensors (gyroscope, accelerometer) detect head movement; 2 the processor works out the new
 * viewpoint; 3 it renders two slightly different images, one for each eye; 4 two screens
 * behind lenses show them and the brain combines them into one 3D scene. The user turns their
 * head and the loop starts again; the centre notes that it repeats many times a second.
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-computer-components-vr-loop';

const W = 620;
const H = 330;

function Box({ cx, cy, w, a, b, tone }: { cx: number; cy: number; w: number; a: string; b: string; tone: 'accent' | 'accent-2' | 'muted' }) {
  const cls = tone === 'accent' ? 'dg-fill-accent dg-accent' : tone === 'accent-2' ? 'dg-fill-accent-2 dg-accent-2' : 'dg-fill-muted dg-thin';
  return (
    <g>
      <rect x={cx - w / 2} y={cy - 27} width={w} height={54} rx={8} className={cls} />
      <Label x={cx} y={cy - 9} className="dg-text-small dg-bold">
        {a}
      </Label>
      <Label x={cx} y={cy + 9} className="dg-text-small">
        {b}
      </Label>
    </g>
  );
}

export function ComputerComponentsVrLoop() {
  return (
    <Svg width={W} height={H}>
      <Box cx={310} cy={44} w={250} a="1 sensors detect head movement" b="(gyroscope, accelerometer)" tone="muted" />
      <Box cx={510} cy={165} w={196} a="2 processor works out" b="the new viewpoint" tone="accent" />
      <Box cx={310} cy={286} w={250} a="3 renders two slightly different" b="images, one for each eye" tone="accent" />
      <Box cx={110} cy={165} w={196} a="4 two screens + lenses" b="show them: you see 3D" tone="accent-2" />

      <Arrow x1={437} y1={56} x2={500} y2={134} head={9} />
      <Arrow x1={500} y1={196} x2={437} y2={274} head={9} />
      <Arrow x1={183} y1={274} x2={120} y2={196} head={9} />
      <Arrow x1={120} y1={134} x2={183} y2={56} head={9} />

      <Label x={112} y={88} anchor="end" className="dg-text-small dg-italic">
        you turn your head
      </Label>
      <Label x={310} y={157} className="dg-text-small dg-text-muted">
        repeats many times
      </Label>
      <Label x={310} y={173} className="dg-text-small dg-text-muted">
        every second
      </Label>
    </Svg>
  );
}

export default ComputerComponentsVrLoop;
