/**
 * A decision flowchart for choosing a compression method. Question 1: would
 * changing even one bit of the data cause a problem? Yes leads to LOSSLESS
 * (text, program code, spreadsheets, databases, medical scans). No leads to
 * question 2: is a smaller file or faster transfer worth losing some detail
 * people will not notice? Yes leads to LOSSY (streaming music and video, photos
 * on web pages, video calls). No leads to LOSSLESS (master copies that will be
 * edited again, archives).
 */
import { Arrow, Label, Svg } from '../primitives';

export const diagramKey = 'cs-compression-decision-flow';

const W = 620;
const H = 330;
const QX = 16;
const QW = 290;
const OX = 360;
const OW = 244;
const BH = 64;
const Y1 = 24;
const Y2 = 134;
const Y3 = 244;

function Question({ y, lines }: { y: number; lines: string[] }) {
  return (
    <g>
      <rect x={QX} y={y} width={QW} height={BH} rx={10} className="dg-fill-muted dg-thin" />
      {lines.map((l, i) => (
        <Label key={i} x={QX + QW / 2} y={y + BH / 2 + (i - (lines.length - 1) / 2) * 19} className="dg-text">
          {l}
        </Label>
      ))}
    </g>
  );
}

function Outcome({
  x,
  y,
  w,
  title,
  lines,
  lossy,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  lines: string[];
  lossy?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={BH}
        rx={4}
        className={lossy ? 'dg-fill-accent-2 dg-accent-2' : 'dg-fill-accent dg-accent'}
      />
      <Label x={x + w / 2} y={y + 16} className={lossy ? 'dg-text-accent-2' : 'dg-text-accent'}>
        {title}
      </Label>
      {lines.map((l, i) => (
        <Label key={i} x={x + w / 2} y={y + 36 + i * 16} className="dg-text-small">
          {l}
        </Label>
      ))}
    </g>
  );
}

export function CompressionDecisionFlow() {
  return (
    <Svg width={W} height={H}>
      <Question y={Y1} lines={['Would changing even one bit', 'of the data cause a problem?']} />
      <Arrow x1={QX + QW} y1={Y1 + BH / 2} x2={OX - 2} y2={Y1 + BH / 2} head={8} />
      <Label x={(QX + QW + OX) / 2} y={Y1 + BH / 2 - 12} className="dg-text-small dg-bold">
        yes
      </Label>
      <Outcome x={OX} y={Y1} w={OW} title="LOSSLESS" lines={['text, program code, spreadsheets,', 'databases, medical scans']} />

      <Arrow x1={QX + QW / 2} y1={Y1 + BH} x2={QX + QW / 2} y2={Y2 - 2} head={8} />
      <Label x={QX + QW / 2 + 10} y={(Y1 + BH + Y2) / 2} anchor="start" className="dg-text-small dg-bold">
        no
      </Label>

      <Question y={Y2} lines={['Is a smaller, faster file worth', 'losing detail people won’t notice?']} />
      <Arrow x1={QX + QW} y1={Y2 + BH / 2} x2={OX - 2} y2={Y2 + BH / 2} head={8} />
      <Label x={(QX + QW + OX) / 2} y={Y2 + BH / 2 - 12} className="dg-text-small dg-bold">
        yes
      </Label>
      <Outcome x={OX} y={Y2} w={OW} title="LOSSY" lines={['streaming music and video,', 'web photos, video calls']} lossy />

      <Arrow x1={QX + QW / 2} y1={Y2 + BH} x2={QX + QW / 2} y2={Y3 - 2} head={8} />
      <Label x={QX + QW / 2 + 10} y={(Y2 + BH + Y3) / 2} anchor="start" className="dg-text-small dg-bold">
        no
      </Label>
      <Outcome
        x={QX + (QW - OW) / 2}
        y={Y3}
        w={OW}
        title="LOSSLESS"
        lines={['master copies that will be', 'edited again, archives']}
      />
    </Svg>
  );
}

export default CompressionDecisionFlow;
