/**
 * The six utilities named in the syllabus, one card each: what it does in a few
 * words.
 */
import { Label, Svg } from '../primitives';

export const diagramKey = 'cs-operating-systems-utilities';

const W = 600;
const H = 300;
const CARD_W = 186;
const CARD_H = 78;
const GAP_X = 16;
const GAP_Y = 18;
const X0 = (W - (3 * CARD_W + 2 * GAP_X)) / 2;
const Y0 = 60;

const cards = [
  { title: 'Disk formatter', body: 'prepares a disk' },
  { title: 'Virus checker', body: 'finds malware' },
  { title: 'Defragmentation', body: 'joins scattered blocks' },
  { title: 'Disk analysis / repair', body: 'checks for errors' },
  { title: 'File compression', body: 'makes files smaller' },
  { title: 'Back-up software', body: 'copies your data' },
];

export function OperatingSystemsUtilities() {
  return (
    <Svg width={W} height={H}>
      <Label x={W / 2} y={26} className="dg-text dg-bold">
        Six utilities supplied with an operating system
      </Label>

      {cards.map((c, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = X0 + col * (CARD_W + GAP_X);
        const y = Y0 + row * (CARD_H + GAP_Y);
        return (
          <g key={c.title}>
            <rect x={x} y={y} width={CARD_W} height={CARD_H} rx={8} className="dg-fill-muted dg-line" />
            <Label x={x + CARD_W / 2} y={y + 26} className="dg-text dg-bold">
              {c.title}
            </Label>
            <Label x={x + CARD_W / 2} y={y + 50} className="dg-text-small dg-text-muted">
              {c.body}
            </Label>
          </g>
        );
      })}

      <Label x={W / 2} y={H - 18} className="dg-text-small dg-text-muted">
        Utilities maintain the system; they do not create your documents
      </Label>
    </Svg>
  );
}

export default OperatingSystemsUtilities;
